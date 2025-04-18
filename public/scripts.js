// Function to update the screen with messages
function updateScreen(message) {
    const screen = document.getElementById("user-screen");
    
    // Add timestamp for log-like appearance
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
    const formattedMessage = `[${timestamp}] ${message}`;
    
    // Append the new message with a line break
    screen.innerHTML += formattedMessage + "<br>";
    
    // Auto-scroll to the bottom of the screen
    screen.scrollTop = screen.scrollHeight;
}

// Clear the screen
function clearScreen() {
    document.getElementById("user-screen").innerHTML = "";
}

function shortInput(input, i) {
    if (i === 0) {
        clearScreen();
        updateScreen("Processing input: " + input);
        ;
    }
    
    if (i >= input.length) {
        updateScreen("Validation failed: Input is incomplete");
        return;
    }

    let character = input[i];
    let presentstate = document.getElementById("q" + i);

    if (presentstate) {
        presentstate.textContent = character;

        if (/^[A-Z0-9]$/.test(character) && i !== 4 && i !== 9) {
            presentstate.style.backgroundColor = "#008000"; // green
            updateScreen(`Character '${character}' at position ${i+1} is valid`);
        } else if (character === '-' && (i === 4 || i === 9)) {
            presentstate.style.backgroundColor = "#008000"; // green
            updateScreen(`Hyphen '-' at position ${i+1} is valid`);
        } else {
            presentstate.style.backgroundColor = "#FF0000"; // red
            updateScreen(`Invalid character '${character}' at position ${i+1}`);
            updateScreen("Validation stopped due to invalid character");
            return; // Stop animation on invalid
        }

        // Optional yellow transition
        setTimeout(() => {
            presentstate.style.backgroundColor = "#FFFF00";
        }, 400);

        // Continue after delay
        setTimeout(() => {
            shortInput(input, i + 1);
        }, 500);
    }
}

function outOfRangInput(input, i) {
    if (i === 0) {
        clearScreen();
        updateScreen("Processing input: " + input);
        updateScreen("Input is too long (expected 14 characters)");
    }
    
    if (i >= 14) {
        // After filling all 14 boxes, turn them all red
        updateScreen("Excess characters detected beyond position 14");
        updateScreen("Validation failed: Input exceeds maximum length");
        
        setTimeout(() => {
            for (let j = 0; j < 14; j++) {
                let state = document.getElementById("q" + j);
                if (state) {
                    state.style.backgroundColor = "#FF0000";
                }
            }
        }, 500); 
        return;
    }

    let character = input[i];
    let presentstate = document.getElementById("q" + i);

    if (presentstate) {
        presentstate.textContent = character;

        const isValid = (/^[A-Z0-9]$/.test(character) && i !== 4 && i !== 9) || 
                        (character === '-' && (i === 4 || i === 9));

        if (!isValid) {
            presentstate.style.backgroundColor = "#FF0000"; // Invalid input: stop
            updateScreen(`Invalid character '${character}' at position ${i+1}`);
            updateScreen("Validation stopped due to invalid character");
            return;
        }

        presentstate.style.backgroundColor = "#008000"; // Valid input
        
        if (character === '-' && (i === 4 || i === 9)) {
            updateScreen(`Hyphen '-' at position ${i+1} is valid`);
        } else {
            updateScreen(`Character '${character}' at position ${i+1} is valid`);
        }

        setTimeout(() => {
            presentstate.style.backgroundColor = "#FFFF00"; // Flash yellow
        }, 300);

        // Continue filling next character after delay
        setTimeout(() => {
            outOfRangInput(input, i + 1);
        }, 500);
    }
}

function animateValidLengthInput(input, i = 0) {
    if (i === 0) {
        clearScreen();
        updateScreen("Processing input: " + input);
        updateScreen("Input has correct length (14 characters)");
    }
    
    if (i >= 14) {
        // If we reached here, input is fully valid. Turn all states green.
        updateScreen("All characters validated successfully");
        updateScreen("VALID LICENSE KEY DETECTED!");
        
        setTimeout(() => {
            for (let j = 0; j < 14; j++) {
                let state = document.getElementById("q" + j);
                if (state) {
                    state.style.backgroundColor = "#008000"; // Solid green
                }
            }
        }, 300); // small delay to let yellow effect finish
        return;
    }

    let character = input[i];
    let presentstate = document.getElementById("q" + i);

    if (presentstate) {
        presentstate.textContent = character;

        const isValid = (/^[A-Z0-9]$/.test(character) && i !== 4 && i !== 9) || 
                        (character === '-' && (i === 4 || i === 9));

        if (!isValid) {
            presentstate.style.backgroundColor = "#FF0000"; // Invalid stop here
            updateScreen(`Invalid character '${character}' at position ${i+1}`);
            updateScreen("Validation stopped due to invalid character");
            return;
        }

        presentstate.style.backgroundColor = "#008000"; // Valid
        
        // Log state transition for screen-board
        if (i === 4 || i === 9) {
            updateScreen(`Hyphen '-' at position ${i+1} is valid`);
        } else {
            updateScreen(`Character '${character}' at position ${i+1} is valid`);
        }
        
        // State transition description
        const fromState = `q${i}`;
        const toState = `q${i+1}`;
        if (i < 13) {
            updateScreen(`Transitioning from state ${fromState} to ${toState}`);
        }

        setTimeout(() => {
            presentstate.style.backgroundColor = "#FFFF00"; // Optional yellow flash
        }, 300);

        setTimeout(() => {
            animateValidLengthInput(input, i + 1); // Move to next character
        }, 500);
    }
}   

function CheckValidity(){
    // show input
    const input = document.getElementById("keyInput").value;
    const processingP = document.getElementById("userInput");
    processingP.textContent = "Input: "+ input;
    
    // Clear the screen first
    clearScreen();
    updateScreen("Starting validation...");

    let stringLength = input.length;
    console.log(stringLength);
    //create a loop for showing input in each states 
    //out of range input
    if(stringLength > 14){
        outOfRangInput(input, 0);
    }
    //less than the accepted character
    else if(stringLength < 14){
        shortInput(input, 0);
    }
    //correct length and all that
    else if(stringLength === 14){
        animateValidLengthInput(input, 0);
    }
}

function ClearInput(){
    // Reset for every input
    for(let i = 0; i < 14; i++){
        let resetState = document.getElementById("q" + i);
        resetState.style.backgroundColor = "#a1ffef";
        resetState.textContent = "q" + i;
    }
    
    // Clear the input 
    document.getElementById("keyInput").value = "";
    document.getElementById("userInput").textContent = "Input:";
    
    // Clear and reset the screen
    clearScreen();
    updateScreen("System reset. Ready for new input.");
}

// Initialize the screen when the page loads
document.addEventListener("DOMContentLoaded", function() {
    clearScreen();
    updateScreen("NFA Simulator initialized");
    updateScreen("Please enter a license key (XXXX-XXXX-XXXX)");
});
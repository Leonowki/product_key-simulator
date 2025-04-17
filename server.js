const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));

// Optional API route for server-side validation
app.get('/validate/:key', (req, res) => {
  const key = req.params.key.toUpperCase();
  const isValid = validateProductKey(key);
  res.json({ valid: isValid });
});

// DFA logic server-side
function validateProductKey(input) {
  let state = 0;

  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    switch (state) {
      case 0: case 1: case 2: case 3:
      case 5: case 6: case 7: case 8:
      case 10: case 11: case 12: case 13:
        if (/[A-Z0-9]/.test(char)) {
          state++;
        } else {
          return false;
        }
        break;
      case 4: case 9:
        if (char === '-') {
          state++;
        } else {
          return false;
        }
        break;
      default:
        return false;
    }
  }

  return state === 14;
}

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

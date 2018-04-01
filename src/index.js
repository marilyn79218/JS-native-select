require('./main.css');
const handlers = require('./handlers/inputFocusHandler.js');

const handler = handlers.handler;

var allInputs = document.getElementsByTagName('input');
Array.from(allInputs).forEach(input => {
  input.addEventListener('click', handler, false);
})

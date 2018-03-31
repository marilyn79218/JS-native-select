require('./main.css');
const handlers = require('./handlers/inputFocusHandler.js');

const handler = handlers.handler;

var input1 = document.getElementById('input1');
input1.addEventListener('click', handler, false);

var input2 = document.getElementById('input2');
input2.addEventListener('click', handler, false);

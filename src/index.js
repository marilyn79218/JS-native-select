require('./main.css');
const handlers = require('./handlers/inputFocusHandler.js');

const handler = handlers.handler;
const nestedHandler = handlers.nestedHandler;

// Add functions to function prototype
Function.prototype.clone = function() {
  var that = this;
  var temp = function temporary() {
    return that.apply(this, arguments);
  };

  for(var key in this) {
      if (this.hasOwnProperty(key)) {
          temp[key] = this[key];
      }
  }

  return temp;
};

var input1 = document.getElementById('input1');
input1.onclick = handler.clone();

var input2 = document.getElementById('input2');
input2.onclick = handler.clone();

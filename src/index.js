// import { ApiUtil } from './utils';
// const ApiUtil = require('./utils/index.js');
// console.log('ApiUtil', ApiUtil.ApiUtil.ApiUtil.get());

const f = require('./utils/iife.js');
f.f();

// Ceates an HTML element
function component() {
    var element = document.createElement('pre');
    // console.log('Hi')

    element.innerHTML = [
      'First compoenent!'
    ].join('\n\n');

    return element;
}

// Gets the specific element with an ID
var stage = document.getElementById('start');
stage.prepend(component());

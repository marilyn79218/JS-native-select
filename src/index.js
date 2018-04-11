import inputFocusHandler from './handlers/inputFocusHandler';

var allInputs = document.getElementsByTagName('input');
Array.from(allInputs).forEach(input => {
  input.addEventListener('focus', inputFocusHandler(), false);
})

import inputClickHandler from './handlers/inputFocusHandler';

var allInputs = document.getElementsByTagName('input');
Array.from(allInputs).forEach(input => {
  input.addEventListener('click', inputClickHandler, false);
})

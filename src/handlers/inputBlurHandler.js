/* eslint-disable */
import {
  addClass,
  removeClass,
  isDescendant,
  triggerEvent,
} from './helpers/DomHelpers';

import {
  compose,
} from './helpers/generalHelpers';

// Handler for blur at input
const inputBlurHandler = function(e) {
  this.inputNode = e.target;
  let wrapContainer = this.inputNode.parentNode;
  console.log('   input - blur');

  setTimeout(() => {
    if (!isDescendant(wrapContainer, document.activeElement)) {
      console.log('   input - blur (timeout)', document.activeElement);
      triggerEvent(wrapContainer, 'blur');
    }
  }, 0)
};

export default inputBlurHandler;

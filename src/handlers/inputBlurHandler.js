import {
  addClass,
  removeClass,
  isDescendant,
} from './helpers/DomHelpers';

import {
  compose,
} from './helpers/generalHelpers';

// Handler for blur at input
const inputBlurHandler = function(e) {
  this.inputNode = e.target;
  let wrapContainer = this.inputNode.parentNode;

  setTimeout(() => {
    if (!isDescendant(wrapContainer, document.activeElement)) {
      compose(
        addClass('hide-myself'),
        removeClass('show-myself'),
      )(wrapContainer.childNodes[1]);
    }
  }, 0)
};

export default inputBlurHandler;

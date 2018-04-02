import {
  addClass,
  removeClass,
  isDescendant,
} from './helpers/DomHelpers';

import {
  compose,
} from './helpers/generalHelpers';

// Handler for blur at wrapper div of input
const wrapperContainerBlurHandler = function(e) {
  this.wrapContainer = e.target;

  setTimeout(() => {
    if (!isDescendant(this.wrapContainer, document.activeElement)) {
      compose(
        addClass('hide-myself'),
        removeClass('show-myself'),
      )(this.wrapContainer.childNodes[1]);
    }
  }, 10);
}

export default wrapperContainerBlurHandler;
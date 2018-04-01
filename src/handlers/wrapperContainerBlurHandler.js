import {
  isDescendant,
} from './helpers.js';

const wrapperContainerBlurHandler = function(e) {
  this.wrapContainer = e.target;

  setTimeout(() => {
    console.log('which is focus', document.activeElement);
    if (!isDescendant(this.wrapContainer, document.activeElement)) {
      this.wrapContainer.childNodes[1].classList.remove('show-myself');
      this.wrapContainer.childNodes[1].classList.add('hide-myself');
    }
  }, 10);
}

export default wrapperContainerBlurHandler;
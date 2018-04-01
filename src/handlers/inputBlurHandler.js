import {
  isDescendant,
} from './helpers/DomHelpers';

const inputBlurHandler = function(e) {
  this.inputNode = e.target;
  let wrapContainer = this.inputNode.parentNode;

  setTimeout(() => {
    if (!isDescendant(wrapContainer, document.activeElement)) {
      console.log('input blur hide list', document.activeElement);
      wrapContainer.childNodes[1].classList.remove('show-myself');
      wrapContainer.childNodes[1].classList.add('hide-myself');
    }
  }, 0)
};

export default inputBlurHandler;

const utils = require('../utils/index.js');
const helpers = require('./helpers.js');

const wrapContainer = helpers.wrapContainer;
const replaceWith = helpers.replaceWith;
const moveSelectedItemToFist = helpers.moveSelectedItemToFist;
const removeSelectedItemFromHistory = helpers.removeSelectedItemFromHistory;

function isDescendant(parent, child) {
  var node = child.parentNode;
  while (node != null) {
      if (node == parent) {
          return true;
      }
      node = node.parentNode;
  }
  return false;
}



var handler = function(e) {
  // Data initializing
  this.data;

  // Init input node
  this.inputNode = e.target;
  this.inputNode.style.cssText = "position: relative;";
  this.inputNode.tabIndex = 1;

  // input div wrapper
  this.wrapContainer;
  // ul Node
  this.displayContainer;

  var _this = this;

  // Handler Initializing
  var logoNameHandler = (selectedItem) => (e) => {
    if (!selectedItem.isInHistory) {
      selectedItem.isInHistory = true; 
    }

    // Move selected item to the fist of source data list
    moveSelectedItemToFist(selectedItem, _this.data.items);

    // Re-render display list (ul)
    this.displayContainer.innerHTML = '';
    drawDisplayList();

    this.inputNode.value = selectedItem.name;
  }

  // UI render methods
  // Create basic li children
  var getLogoNameWrapper = (item, li) => {
    // Create first element, img
    let appImg = document.createElement('img');
    appImg.src = item.logo;
    appImg.classList.add('app-img');

    // Create second element, p
    let appNameWrapper = document.createElement('p');
    let appNameText = document.createTextNode(`${item.name}`);
    appNameWrapper.classList.add('app-name');
    appNameWrapper.appendChild(appNameText);

    // Create wrapper for logo & name
    let logoNameWrapper = document.createElement('div');
    logoNameWrapper.classList.add('logo-name-wrapper');
    logoNameWrapper.id = item.id;
    logoNameWrapper.insertBefore(appImg, logoNameWrapper.firstChild);
    logoNameWrapper.appendChild(appNameWrapper);
    // console.log('onclick li', li);
    logoNameWrapper.onclick = logoNameHandler(item);

    return logoNameWrapper;
  }

  var historyWrapperHandler = (e) => {
    let historyWrapper = e.target;
    let selectedItemId = Number(historyWrapper.previousElementSibling.id);

    // Remove item from history list & Put it as the first of 'not-in-history elements'
    removeSelectedItemFromHistory(selectedItemId, _this.data.items);

    // Re-render display list (ul)
    this.displayContainer.innerHTML = '';
    drawDisplayList();
  }

  var getLastItemInLi = (isInHistory) => {
    // let lastItemWrapper;
    if (isInHistory) {
      // Create history item
      let historyWrapper = document.createElement('div');
      historyWrapper.classList.add('history-item');
      let historyText = document.createTextNode('remove history');
      historyWrapper.appendChild(historyText);
      historyWrapper.onclick = historyWrapperHandler;

      return historyWrapper;
    } else {
      // Create block item
      let blockWrapper = document.createElement('div');

      return blockWrapper;
    }
  }

  // Create history li
  var getHistoryLi = (item) => {
    let li = document.createElement('li');
    li.classList.add('list-item');

    // Create logo name wrapper
    let logoNameWrapper = getLogoNameWrapper(item, li);

    let isInHistory = true;
    let historyWrapper = getLastItemInLi(isInHistory);

    // Append logo name wrapper & history item to li
    li.insertBefore(logoNameWrapper, li.firstChild);
    li.appendChild(historyWrapper);

    return li;
  }

  var getNormalLi = (item) => {
    let li = document.createElement('li');
    li.classList.add('list-item');

    // Create logo name wrapper
    let logoNameWrapper = getLogoNameWrapper(item, li);

    let isInHistory = false;
    let historyWrapper = getLastItemInLi(isInHistory);

    // Append logo name wrapper & history item to li
    li.insertBefore(logoNameWrapper, li.firstChild);
    li.appendChild(historyWrapper);

    return li;
  }

  var drawDisplayList = () => {
    this.data.items.forEach((item, index) => {
      if (item.id === undefined) {
        item.id = index;
      }

      let currentLi;
      if (item.isInHistory) {
        currentLi = getHistoryLi(item);
      } else {
        currentLi = getNormalLi(item);
      }

      currentLi.tabIndex = 1;
      currentLi.addEventListener('blur', () => {
        setTimeout(() => {
          if (!isDescendant(this.wrapContainer, document.activeElement)
            && document.activeElement !== this.wrapContainer) {
            this.wrapContainer.childNodes[1].classList.remove('show-myself');
            this.wrapContainer.childNodes[1].classList.add('hide-myself');
          }
        }, 100);
      });
      currentLi.addEventListener('click', () => {
        this.wrapContainer.focus();
      });

      // Append a current li to ul
      this.displayContainer.appendChild(currentLi);
    });
  }

  if (!this.data) {
    utils.ApiUtil.get().then(res => {
      this.data = res;
      console.log('Api response', res);

      // Wrap a container
      this.wrapContainer = wrapContainer(this.inputNode, 'div');
      this.wrapContainer.addEventListener('focus', () => {console.log('wrapContainer focus')}, false);
      this.wrapContainer.addEventListener('blur', wrapperContainerBlurHandler, false);
      this.inputNode.addEventListener('focus', () => {console.log('input focus')});
      this.inputNode.addEventListener('blur', () => {console.log('input blur')});


      let inputContainer = this.inputNode.parentNode;
      inputContainer.style.cssText = 'position: relative; display: inline-block;';

      // Init the display list container
      this.displayContainer = document.createElement('ul');
      this.displayContainer.classList.add('display-container');

      // Draw display list
      drawDisplayList();

      // Put display container after input field
      this.wrapContainer.appendChild(this.displayContainer);

      // Keep focus on the input field
      this.inputNode.focus();
      this.wrapContainer.focus();
    });
  } else {
    this.wrapContainer.childNodes[1].classList.remove('hide-myself');
    this.wrapContainer.childNodes[1].classList.add('show-myself');

    this.inputNode.focus();
    this.wrapContainer.focus();
  }

  e.stopPropagation();
  e.preventDefault();
}

var wrapperContainerBlurHandler = function(e) {
  this.wrapContainer = e.target;

  setTimeout(() => {
    console.log('which is focus', document.activeElement);
    if (!isDescendant(this.wrapContainer, document.activeElement)) {
      this.wrapContainer.childNodes[1].classList.remove('show-myself');
      this.wrapContainer.childNodes[1].classList.add('hide-myself');
    }
  }, 50);
  e.stopPropagation();
  e.preventDefault();
}

module.exports = {
  handler: handler,
};


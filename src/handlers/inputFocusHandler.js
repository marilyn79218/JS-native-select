import {
  ApiUtil,
} from '../utils';

import {
  wrapContainer,
  replaceWith,
  removeItemFromList,
  isDescendant,
  cloneObject,
  triggerEvent,
  getStorageKey,
  getFromLs,
  setToLs,
  removeFromLs,
} from './helpers';

import inputBlurHandler from './inputBlurHandler';
import wrapperContainerBlurHandler from './wrapperContainerBlurHandler';

var inputFocusHandler = function(e) {
  // Data initializing
  this.data;

  // Init input node
  this.inputNode = e.target;
  this.inputNode.style.cssText = "position: relative;";
  this.inputNode.tabIndex = 1;

  this.storageKey;

  this.searchText = '';
  this.normalItems;
  this.inputNode.onkeyup = (e) => {
    console.log('input keyup', e.target.value);
    this.searchText = e.target.value;

    // Re-render display list (ul)
    this.displayContainer.innerHTML = '';
    drawDisplayList();
  }

  // input div wrapper
  this.wrapContainer;
  // ul Node
  this.displayContainer;

  var _this = this;

  // Handler Initializing
  var logoNameHandler = (selectedItem) => (e) => {
    if (!selectedItem.isInHistory) {
      selectedItem.isInHistory = true;

      let historyList = getFromLs(this.storageKey);
      setToLs(this.storageKey, [ selectedItem, ...historyList ]);

      // Remove selected item from the list
      removeItemFromList(selectedItem, this.normalItems);
    } else if (selectedItem.isInHistory) {
      // Re-sort history items in localStorage
      let historyList = getFromLs(this.storageKey);
      let selectedItemIndex = historyList.findIndex(item => item.id === selectedItem.id);
      historyList.splice(selectedItemIndex, 1);
      historyList.unshift(selectedItem);
      setToLs(this.storageKey, [ ...historyList ]);
    }

    // Re-render display list (ul)
    this.displayContainer.innerHTML = '';
    drawDisplayList();

    this.inputNode.value = selectedItem.name;

    triggerEvent(this.inputNode, 'keyup');
    this.inputNode.focus();
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
    logoNameWrapper.onclick = logoNameHandler(item);

    return logoNameWrapper;
  }

  var historyWrapperHandler = (e) => {
    let historyWrapper = e.target;
    let selectedItemId = Number(historyWrapper.previousElementSibling.id);

    let historyItems = getFromLs(this.storageKey);

    // Add item back to nomal list
    let selectedHistoryItem = historyItems.find(item => item.id === selectedItemId);
    selectedHistoryItem.isInHistory = false;
    this.normalItems.unshift(selectedHistoryItem);

    // Remove from history items in localStorage
    let selectedItemIndex = historyItems.findIndex(item => item.id === selectedItemId);
    historyItems.splice(selectedItemIndex, 1);
    setToLs(this.storageKey, historyItems);

    // Re-render display list (ul)
    this.displayContainer.innerHTML = '';
    drawDisplayList();

    this.wrapContainer.focus();
  }

  var getLastItemInLi = (isInHistory) => {
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
    let historyItems = getFromLs(this.storageKey);
    let normalItems = this.normalItems;
    let currentAllItems = [...historyItems, ...normalItems];
    console.log('drawDisplayList', currentAllItems);

    let filteredItems = currentAllItems.filter(item =>
      item.name.trim().toLowerCase().indexOf(this.searchText.trim().toLowerCase()) > -1
    );
    filteredItems.forEach((item, index) => {
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
      // currentLi.addEventListener('click', logoNameHandler(item));

      // currentLi.addEventListener('focus', (e) => {
      //   console.log('   currentLi focus', e.target);
      // });
      currentLi.addEventListener('keyup', (e) => {
        if (e.keyCode === 13) {
          console.log('   currentLi keyup');
          currentLi.childNodes[0].click();
        }
      });

      // Append a current li to ul
      this.displayContainer.appendChild(currentLi);
    });
  }

  if (!this.data) {
    this.storageKey = getStorageKey(this.inputNode);
    setToLs(this.storageKey, []);

    ApiUtil.get().then(res => {
      this.data = res;
      this.normalItems = cloneObject(this.data.items);
      console.log('Api response', res);

      // Wrap a container
      this.wrapContainer = wrapContainer(this.inputNode, 'div');
      this.wrapContainer.addEventListener('focus', () => {console.log('wrapContainer focus')}, false);
      this.wrapContainer.addEventListener('blur', wrapperContainerBlurHandler, false);
      this.inputNode.addEventListener('focus', () => {console.log('input focus')});
      this.inputNode.addEventListener('blur', inputBlurHandler);


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
    });
  } else {
    this.wrapContainer.childNodes[1].classList.remove('hide-myself');
    this.wrapContainer.childNodes[1].classList.add('show-myself');

    this.inputNode.focus();
  }
};

export default inputFocusHandler;


import '../styles/main.css';
import {
  ApiUtil,
} from '../utils';

// Lots of helpers
import {
  addClass,
  removeClass,
  addEvent,
  wrapContainer,
  isDescendant,
  triggerEvent,
} from './helpers/DomHelpers';
import {
  compose,
  getStorageKey,
  removeItemFromList,
  cloneObject,
  fuzzyS,
} from './helpers/generalHelpers';
import {
  getFromLs,
  setToLs,
  removeFromLs,
} from './helpers/localStorageHelpers';

// Additional handlers
import inputBlurHandler from './inputBlurHandler';
import wrapperContainerBlurHandler from './wrapperContainerBlurHandler';

/* Basic variable nameing */
/*
  - History list: contains the app which has selected before
  - Normal items: the app which are not selected yet and which are removed from history list.
                  i.e., the apps which is in suggestion list but not in history list
*/

var inputFocusHandler = function(e) {
  // Single source of truth
  this.inputNode = e.target;
  this.inputNode.tabIndex = 1;
  this.data;
  this.normalItems;

  // The div wrapper of input
  this.wrapContainer;
  // The ul for suggestion list
  this.displayContainer;

  // If the input field is focused/ clicked in first time, we need to fetch data & initialize basic DOMs.
  // If not, just show the suggestion list
  if (!this.data) {
    // A key for save hisotry apps in localStorage
    this.storageKey = getStorageKey(this.inputNode);
    setToLs(this.storageKey, []);
    this.searchText = '';

    ApiUtil.get().then(res => {
      this.data = res;
      this.normalItems = cloneObject(this.data.items);

      // Basic settings...
      // Wrap a div container at the outside of the <input> for positioning purpose
      this.wrapContainer = wrapContainer(this.inputNode, 'div');
      compose(
        addEvent('blur', wrapperContainerBlurHandler, false),
        addClass('wrap-container'),
      )(this.wrapContainer);

      compose(
        addEvent('blur', inputBlurHandler, false),
        addClass('input-style'),
      )(this.inputNode);

      this.displayContainer = document.createElement('ul');
      addClass('display-container')(this.displayContainer);

      // Render the suggestion list
      drawDisplayList();

      // Append the <ul> container to the <div> wrapper,
      // Purpose for positioning after <input>
      this.wrapContainer.appendChild(this.displayContainer);

      // Keep focus on the input field
      this.inputNode.focus();
    });
  } else {
    compose(
      addClass('show-myself'),
      removeClass('hide-myself'),
    )(this.wrapContainer.childNodes[1]);

    this.inputNode.focus();
  }

  // Handler for user to type in input field
  this.inputNode.onkeyup = (e) => {
    this.searchText = e.target.value;

    // Re-render display list (ul)
    this.displayContainer.innerHTML = '';
    drawDisplayList();
  }

  // Handler for clicking app in suggestion list
  // If the selected app is not in history list, put it as the first priority in it and remove it from the normal list
  // If it is, just put it as the first priority in the history list.
  var logoNameHandler = (selectedItem) => (e) => {
    if (!selectedItem.isInHistory) {
      selectedItem.isInHistory = true;

      // Save the selected app into history list in localStorage
      let historyList = getFromLs(this.storageKey);
      setToLs(this.storageKey, [ selectedItem, ...historyList ]);

      // Remove the selected item from the normal list
      removeItemFromList(selectedItem, this.normalItems);
    } else if (selectedItem.isInHistory) {
      // Re-sort history items in localStorage
      let historyList = getFromLs(this.storageKey);
      let selectedItemIndex = historyList.findIndex(item => item.id === selectedItem.id);
      historyList.splice(selectedItemIndex, 1);
      historyList.unshift(selectedItem);
      setToLs(this.storageKey, [ ...historyList ]);
    }

    // Re-render suggestion list (ul)
    this.displayContainer.innerHTML = '';
    drawDisplayList();

    this.inputNode.value = selectedItem.name;

    // Keep focus on the input field
    triggerEvent(this.inputNode, 'keyup');
    this.inputNode.focus();
  }

  // The wrapper, a div, which contains <img> & its app name as TextNode
  // ALso, It return the first child of <li>
  var getLogoNameWrapper = (item, li) => {
    // Create first element, <img>
    let appImg = document.createElement('img');
    appImg.src = item.logo;
    addClass('app-img')(appImg);

    // Create second element, <p> for app name
    let appNameWrapper = document.createElement('p');
    let appNameText = document.createTextNode(`${item.name}`);
    addClass('app-name')(appNameWrapper);
    appNameWrapper.appendChild(appNameText);

    // Create wrapper for wrapping logo & name elements
    let logoNameWrapper = document.createElement('div');
    addClass('logo-name-wrapper')(logoNameWrapper);
    logoNameWrapper.id = item.id;
    logoNameWrapper.insertBefore(appImg, logoNameWrapper.firstChild);
    logoNameWrapper.appendChild(appNameWrapper);
    logoNameWrapper.onclick = logoNameHandler(item);

    return logoNameWrapper;
  }

  // A handler for removing the selected app from history list
  var historyWrapperHandler = (e) => {
    let historyWrapper = e.target;
    let selectedItemId = Number(historyWrapper.previousElementSibling.id);

    let historyItems = getFromLs(this.storageKey);

    // Add the app back to normal list
    let selectedHistoryItem = historyItems.find(item => item.id === selectedItemId);
    selectedHistoryItem.isInHistory = false;
    this.normalItems.unshift(selectedHistoryItem);

    // Remove it from history list in localStorage
    let selectedItemIndex = historyItems.findIndex(item => item.id === selectedItemId);
    historyItems.splice(selectedItemIndex, 1);
    setToLs(this.storageKey, historyItems);

    // Re-render display list (ul)
    this.displayContainer.innerHTML = '';
    drawDisplayList();

    this.inputNode.focus();
  }

  // A rendering method that return the last child of <li>
  // If the current rendered app is in history list, return the element which makes the app removable.
  // If not, return a normal block element
  var getLastItemInLi = (isInHistory) => {
    if (isInHistory) {
      let historyWrapper = document.createElement('div');
      addClass('history-item')(historyWrapper);
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

  // Create a li which contains two sub-elements for the app in `history list`
  // The two sub-elements are composed from getLogoNameWrapper() & getLastItemInLi() respectively.
  var getHistoryLi = (item) => {
    let li = document.createElement('li');
    compose(
      addClass('history-li'),
      addClass('list-item'),
    )(li)

    // Create logo name wrapper
    let logoNameWrapper = getLogoNameWrapper(item, li);

    let isInHistory = true;
    let historyWrapper = getLastItemInLi(isInHistory);


    // Append logo name wrapper & history item to li
    li.insertBefore(logoNameWrapper, li.firstChild);
    li.appendChild(historyWrapper);

    return li;
  }

  // The functionality of getNormalLi is similar to getHistoryLi,
  // but it create a li which contains two sub-elements for the app in `normal list`
  var getNormalLi = (item) => {
    let li = document.createElement('li');
    addClass('list-item')(li);

    // Create logo name wrapper
    let logoNameWrapper = getLogoNameWrapper(item, li);

    let isInHistory = false;
    let historyWrapper = getLastItemInLi(isInHistory);

    // Append logo name wrapper & history item to li
    li.insertBefore(logoNameWrapper, li.firstChild);
    li.appendChild(historyWrapper);

    return li;
  }

  // A rendering method for drawing ths whole suggestion list
  var drawDisplayList = () => {
    let historyItems = getFromLs(this.storageKey);
    let normalItems = this.normalItems;
    let currentAllItems = [...historyItems, ...normalItems];

    // Implements fuzzy search
    let _searchText = this.searchText.trim().toLowerCase();
    let filteredItems = currentAllItems.filter(item => {
      const itemName = item.name.trim().toLowerCase();
      return fuzzyS(_searchText)(itemName);
    });
    
    // Only shows the app which match fuzzy search rule
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

      // Making the li focusable by keyboard & hide the suggestion list if it is blured
      currentLi.tabIndex = 1;
      currentLi.addEventListener('blur', () => {
        setTimeout(() => {
          if (!isDescendant(this.wrapContainer, document.activeElement)
            && document.activeElement !== this.wrapContainer) {
            compose(
              addClass('hide-myself'),
              removeClass('show-myself'),
            )(this.wrapContainer.childNodes[1]);
          }
        }, 100);
      });

      // An event listener for focusing next app with keyboard
      currentLi.addEventListener('keyup', (e) => {
        if (e.keyCode === 13) {
          currentLi.childNodes[0].click();
        }
      });

      // Append a current li to ul
      this.displayContainer.appendChild(currentLi);
    });
  }
};

export default inputFocusHandler;


import '../styles/main.css';
import {
  ApiUtil,
} from '../utils';

// Lots of helpers
import {
  wrapContainer,
  replaceWith,
  isDescendant,
  triggerEvent,
} from './helpers/DomHelpers';
import {
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

/* Main user stories */
/*
  - Story 1:
    All <input> in your HTML are implementable with my handler no matter they have an id attribute or not.
  - Story 2:
    When user focus/ click in the input field, the suggestion list showed.
  - Story 3:
    When user blur at the current input field or suggestion list area, the suggestion list is hided.
  - Story 4:
    When user select an app in the list with keyboard or mouse, the input value should be updated as its app name.
    Also, it should be also updated as `the first priority in history list` (which is stored in localStorage).
  - Story 5:
    When an app is removed from the history list, it will be putted back as `the first priority in normal list`.
  - Story 6:
    If there's a value in input field and it's being focused, the suggestion list only shows apps that match 'Fuzzy Search'.
  - Story 7:
    The data in each suggestion list is independent from each other.
*/


/* Basic variable nameing */
/*
  History list: contains the app which has been selected before
  Normal items: the apps which has not been selected, i.e., the apps which is in suggestion list but not in history list
*/

var inputFocusHandler = function(e) {
  // Data initializing
  this.data;

  // Init input node
  this.inputNode = e.target;
  this.inputNode.tabIndex = 1;

  // A key for save apps in localStorage
  this.storageKey;

  this.searchText = '';
  this.normalItems;

  // A event listener for user to type in input field
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

  // Handler for clicking app in suggestion list
  var logoNameHandler = (selectedItem) => (e) => {
    if (!selectedItem.isInHistory) {
      selectedItem.isInHistory = true;

      // Save the selected app into history list in localStorage
      let historyList = getFromLs(this.storageKey);
      setToLs(this.storageKey, [ selectedItem, ...historyList ]);

      // Remove the selected item from the normal list
      removeItemFromList(selectedItem, this.normalItems);
    } else if (selectedItem.isInHistory) {
      // Re-sort history items in localStorage,
      // put the current selected app which has listed in history list as the first priority
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

  // The wrapper, a div, which contains <img> & its app name
  // It's also the first element for a <li>
  var getLogoNameWrapper = (item, li) => {
    // Create first element, <img>
    let appImg = document.createElement('img');
    appImg.src = item.logo;
    appImg.classList.add('app-img');

    // Create second element, <p> for app name
    let appNameWrapper = document.createElement('p');
    let appNameText = document.createTextNode(`${item.name}`);
    appNameWrapper.classList.add('app-name');
    appNameWrapper.appendChild(appNameText);

    // Create wrapper for wrapping logo & name elements
    let logoNameWrapper = document.createElement('div');
    logoNameWrapper.classList.add('logo-name-wrapper');
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

    this.wrapContainer.focus();
  }

  // A rendering method to get the last item in a <li>
  // If the current app is in history list, return the element which makes the app removable.
  // If not, return a normal block element
  var getLastItemInLi = (isInHistory) => {
    if (isInHistory) {
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

  // Create a li which contains all sub-elements for the app in history list
  var getHistoryLi = (item) => {
    let li = document.createElement('li');
    li.classList.add('list-item');
    li.classList.add('history-li');

    // Create logo name wrapper
    let logoNameWrapper = getLogoNameWrapper(item, li);

    let isInHistory = true;
    let historyWrapper = getLastItemInLi(isInHistory);
    historyWrapper.classList.add('history-block');

    // Append logo name wrapper & history item to li
    li.insertBefore(logoNameWrapper, li.firstChild);
    li.appendChild(historyWrapper);

    return li;
  }

  // Create a li which contains all sub-elements for the app in normal list
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

  // A rendering method for drawing ths whole suggestion list
  var drawDisplayList = () => {
    let historyItems = getFromLs(this.storageKey);
    let normalItems = this.normalItems;
    let currentAllItems = [...historyItems, ...normalItems];
    console.log('drawDisplayList', currentAllItems);

    // Implements fuzzy search
    let _searchText = this.searchText.trim().toLowerCase();
    let filteredItems = currentAllItems.filter(item => {
      const itemName = item.name.trim().toLowerCase();
      return fuzzyS(_searchText)(itemName);
    });
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
            this.wrapContainer.childNodes[1].classList.remove('show-myself');
            this.wrapContainer.childNodes[1].classList.add('hide-myself');
          }
        }, 100);
      });
      // currentLi.addEventListener('click', logoNameHandler(item));

      // currentLi.addEventListener('focus', (e) => {
      //   console.log('   currentLi focus', e.target);
      // });
      // An event listener for focusing next app with keyboard
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

  // If the input field is focused/ clicked in first time, we neeed to fetch data & initialize basic DOMs.
  // If it's not, just show the suggestion list
  if (!this.data) {
    this.storageKey = getStorageKey(this.inputNode);
    setToLs(this.storageKey, []);

    ApiUtil.get().then(res => {
      this.data = res;
      this.normalItems = cloneObject(this.data.items);
      console.log('Api response', res);

      // Basic settings...
      // Wrap a div container at the outside of the <input> for positioning purpose
      this.wrapContainer = wrapContainer(this.inputNode, 'div');
      this.wrapContainer.classList.add('wrap-container');
      this.wrapContainer.addEventListener('focus', () => {console.log('wrapContainer focus')}, false);
      this.wrapContainer.addEventListener('blur', wrapperContainerBlurHandler, false);

      this.inputNode.classList.add('input-style');
      this.inputNode.addEventListener('focus', () => {console.log('input focus')});
      this.inputNode.addEventListener('blur', inputBlurHandler);

      this.displayContainer = document.createElement('ul');
      this.displayContainer.classList.add('display-container');

      // Render the suggestion list
      drawDisplayList();

      // Append the <ul> container to the <div> wrapper,
      // Purpose for positioning after <input>
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


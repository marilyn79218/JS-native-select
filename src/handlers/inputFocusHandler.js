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

import {
  drawDisplayList,
} from './drawer';

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
      drawDisplayList({
        storageKey: this.storageKey,
        normalItems: this.normalItems,
        searchText: this.searchText,
      })(this.wrapContainer, this.inputNode, this.displayContainer);

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
    // drawDisplayList();
    drawDisplayList({
      storageKey: this.storageKey,
      normalItems: this.normalItems,
      searchText: this.searchText,
    })(this.wrapContainer, this.inputNode, this.displayContainer);
  }
};

export default inputFocusHandler;

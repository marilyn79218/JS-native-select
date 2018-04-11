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
} from './helpers/localStorageHelpers';

import {
  drawDisplayList,
} from './drawer';

// Handler for clicking app in suggestion list
// If the selected app is not in history list, put it as the first priority in it and remove it from the normal list
// If it is, just put it as the first priority in the history list.
export const logoNameHandler = (props) => (wrapContainer, inputNode, displayContainer) => (selectedItem) => (e) => {
  const {
    storageKey,
    normalItems,
    searchText,
  } = props;

  if (!selectedItem.isInHistory) {
    selectedItem.isInHistory = true;

    // Save the selected app into history list in localStorage
    let historyList = getFromLs(storageKey);
    setToLs(storageKey, [ selectedItem, ...historyList ]);

    // Remove the selected item from the normal list
    removeItemFromList(selectedItem, normalItems);
  } else if (selectedItem.isInHistory) {
    // Re-sort history items in localStorage
    let historyList = getFromLs(storageKey);
    let selectedItemIndex = historyList.findIndex(item => item.id === selectedItem.id);
    historyList.splice(selectedItemIndex, 1);
    historyList.unshift(selectedItem);
    setToLs(storageKey, [ ...historyList ]);
  }

  // Re-render suggestion list (ul)
  displayContainer.innerHTML = '';
  // drawDisplayList();
  drawDisplayList({
    storageKey,
    normalItems,
    searchText,
  })(wrapContainer, inputNode, displayContainer);

  inputNode.value = selectedItem.name;

  // Keep focus on the input field
  triggerEvent(inputNode, 'keyup');
  inputNode.focus();
}


import {
  getFromLs,
  setToLs,
} from './helpers/localStorageHelpers';

import {
  drawDisplayList,
} from './drawer';

// A handler for removing the selected app from history list
export const historyWrapperHandler = (props) => (wrapContainer, inputNode, displayContainer) => (e) => {
  const {
    storageKey,
    normalItems,
    searchText,
  } = props;

  let historyWrapper = e.target;
  let selectedItemId = Number(historyWrapper.previousElementSibling.id);

  let historyItems = getFromLs(storageKey);

  // Add the app back to normal list
  let selectedHistoryItem = historyItems.find(item => item.id === selectedItemId);
  selectedHistoryItem.isInHistory = false;
  normalItems.unshift(selectedHistoryItem);

  // Remove it from history list in localStorage
  let selectedItemIndex = historyItems.findIndex(item => item.id === selectedItemId);
  historyItems.splice(selectedItemIndex, 1);
  setToLs(storageKey, historyItems);

  // Re-render display list (ul)
  displayContainer.innerHTML = '';
  // drawDisplayList();
  drawDisplayList({
    storageKey,
    normalItems,
    searchText,
  })(wrapContainer, inputNode, displayContainer);

  inputNode.focus();
};

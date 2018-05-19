import {
  getFromLs,
  setToLs,
} from './helpers/localStorageHelpers';

import { drawDisplayList } from './drawer';

/**
 * Handler for clicking app in suggestion list
 *
 * @first_param props: { storageKey, normalItems, searchText }
 * @second_param mainNodes: { wrapContainer, inputNode, displayContainer }
 * @third_param e: SyntheticEvent
 *
 * @return void
 *
 */
/* eslint-disable */
// A handler for removing the selected app from history list
export const historyWrapperHandler = (appState) => (e) => {
  const {
    storageKey,
    normalItems,
    inputNode,
    displayContainer,
  } = appState;

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
  drawDisplayList(appState);

  inputNode.focus();
};

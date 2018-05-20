import { triggerEvent } from './helpers/DomHelpers';
import { removeItemFromList } from './helpers/generalHelpers';
import {
  getFromLs,
  setToLs,
} from './helpers/localStorageHelpers';
import { getCurrentList } from './helpers/diffHelpers';

/**
 * Handler for clicking app in suggestion list
 *
 * @first_param props: { storageKey, normalItems, searchText }
 * @second_param mainNodes: { wrapContainer, inputNode, displayContainer }
 * @third_param selectedItem: { name, logo, isInHistory }
 * @fourth_param e: SyntheticEvent
 *
 * @return void
 *
 */
/* eslint-disable */
// If the selected app is not in history list, put it as the first priority in it and remove it from the normal list
// If it is, just put it as the first priority in the history list.
export const logoNameHandler = (appState) => (selectedItem) => (e) => {
  console.log('click logoNameHandler', selectedItem);
  const {
    storageKey,
    normalItems,
    inputNode,
  } = appState;

  const beforeList = getCurrentList(appState);

  if (!selectedItem.isInHistory) {
    selectedItem.isInHistory = true;

    // Save the selected app into history list in localStorage
    let historyList = getFromLs(storageKey);
    setToLs(storageKey, [ selectedItem, ...historyList ]);

    // Remove the selected item from the normal list
    removeItemFromList(selectedItem, normalItems);
    console.log('click logoNameHandler', getFromLs(storageKey), normalItems);
  } else if (selectedItem.isInHistory) {
    // Re-sort history items in localStorage
    let historyList = getFromLs(storageKey);
    let selectedItemIndex = historyList.findIndex(item => item.id === selectedItem.id);
    historyList.splice(selectedItemIndex, 1);
    historyList.unshift(selectedItem);
    setToLs(storageKey, [ ...historyList ]);
  }

  inputNode.value = selectedItem.name;

  // Keep focus on the input field
  triggerEvent(inputNode, 'keyup', { beforeList });
  inputNode.focus();
}


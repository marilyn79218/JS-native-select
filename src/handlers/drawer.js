import {
  isDescendant,
  triggerEvent,
} from './helpers/DomHelpers';
import { fuzzyS } from './helpers/generalHelpers';
import { getFromLs } from './helpers/localStorageHelpers';

import {
  getHistoryLi,
  getNormalLi,
} from './createComponents';

/**
 * draw suggestion list
 *
 * @first_param props: { storageKey, normalItems, searchText }
 * @second_param mainNodes: { wrapContainer, inputNode, displayContainer }
 *
 * @return void
 *
 */

/* eslint-disable */
export const drawDisplayList = (props) => (mainNodes) => {
  const {
    storageKey,
    normalItems,
    searchText,
  } = props;

  const {
    wrapContainer,
    displayContainer,
  } = mainNodes;

  let historyItems = getFromLs(storageKey);
  let currentAllItems = [...historyItems, ...normalItems];

  // Implements fuzzy search
  let _searchText = searchText.trim().toLowerCase();
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
      currentLi = getHistoryLi(props)(mainNodes)(item);
    } else {
      currentLi = getNormalLi(props)(mainNodes)(item);
    }

    // Making the li focusable by keyboard & hide the suggestion list if it is blured
    currentLi.tabIndex = 1;
    currentLi.addEventListener('blur', () => {
      setTimeout(() => {
        if (!isDescendant(wrapContainer, document.activeElement)
          && document.activeElement !== wrapContainer) {
          triggerEvent(wrapContainer, 'blur');
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
    displayContainer.appendChild(currentLi);
  });
};
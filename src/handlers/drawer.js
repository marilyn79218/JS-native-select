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
} from './helpers/localStorageHelpers';

import {
  getHistoryLi,
  getNormalLi,
} from './createComponents';

export const drawDisplayList = (props) => (wrapContainer, inputNode, displayContainer) => {
  const {
    storageKey,
    normalItems,
    searchText,
  } = props;

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
      currentLi = getHistoryLi(props)(wrapContainer, inputNode, displayContainer)(item);
    } else {
      currentLi = getNormalLi(props)(wrapContainer, inputNode, displayContainer)(item);
    }

    // Making the li focusable by keyboard & hide the suggestion list if it is blured
    currentLi.tabIndex = 1;
    currentLi.addEventListener('blur', () => {
      setTimeout(() => {
        if (!isDescendant(wrapContainer, document.activeElement)
          && document.activeElement !== wrapContainer) {
          compose(
            addClass('hide-myself'),
            removeClass('show-myself'),
          )(wrapContainer.childNodes[1]);
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
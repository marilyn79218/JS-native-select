import {
  isDescendant,
  triggerEvent,
  addClass,
  removeClass,
} from './helpers/DomHelpers';
// import { fuzzyS } from './helpers/generalHelpers';
// import { getFromLs } from './helpers/localStorageHelpers';
import { getDiffObj } from './helpers/diffHelpers';

import {
  getHistoryLi,
  getNormalLi,
} from './createComponents';
import { historyWrapperHandler } from './historyWrapperHandler';

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
// export const drawDisplayList = (appState) => {
//   const {
//     storageKey,
//     normalItems,
//     searchText,
//     wrapContainer,
//     displayContainer,
//   } = appState;

//   let historyItems = getFromLs(storageKey);
//   let currentAllItems = [...historyItems, ...normalItems];

//   // Implements fuzzy search
//   let _searchText = searchText.trim().toLowerCase();
//   let filteredItems = currentAllItems.filter(item => {
//     const itemName = item.name.trim().toLowerCase();
//     return fuzzyS(_searchText)(itemName);
//   });

//   // Only shows the app which match fuzzy search rule
//   filteredItems.forEach((item, index) => {
//     if (item.id === undefined) {
//       item.id = index;
//     }

//     let currentLi;
//     if (item.isInHistory) {
//       currentLi = getHistoryLi(appState)(item);
//     } else {
//       currentLi = getNormalLi(appState)(item);
//     }

//     // Making the li focusable by keyboard & hide the suggestion list if it is blured
//     currentLi.tabIndex = 1;
//     currentLi.addEventListener('blur', () => {
//       setTimeout(() => {
//         if (!isDescendant(wrapContainer, document.activeElement)
//           && document.activeElement !== wrapContainer) {
//           triggerEvent(wrapContainer, 'blur');
//         }
//       }, 100);
//     });

//     // An event listener for focusing next app with keyboard
//     currentLi.addEventListener('keyup', (e) => {
//       if (e.keyCode === 13) {
//         currentLi.childNodes[0].click();
//       }
//     });

//     // Append a current li to ul
//     displayContainer.appendChild(currentLi);
//   });
// };

export const drawDisplayList = (appState, _beforeList, _afterList) => {
  const {
    beforeList: appBeforeList,
    afterList:  appAfterList,
    wrapContainer,
    displayContainer,
  } = appState;
  const beforeList = _beforeList || appBeforeList;
  const afterList = _afterList || appAfterList;
  console.log('beforeList', beforeList);
  console.log('afterList', afterList);

  const diffObj = getDiffObj(beforeList, afterList);
  const {
    removeList,
    insertList,
    styleChangeList,
  } = diffObj;
  console.log('displayContainer', displayContainer);
  console.log(' removeList', removeList);
  console.log(' insertList', insertList);
  console.log(' styleChangeList', styleChangeList.slice());

  removeList.forEach(removeItem => {
    console.log('removeItem', removeItem);
    const targetLi = getTargetLiFromUl(displayContainer, removeItem);

    displayContainer.removeChild(targetLi);
  });

  // TODO: Sort displayContainer.children in styleChangeList order
  styleChangeList.forEach((styleChangeItem, styleChangeIndex) => {
    let domIndex;
    Array.from(displayContainer.children).some((liElement, _domIndex) => {
      domIndex = _domIndex;
      return Number(liElement.children[0].id) === styleChangeItem.id;
    })[0];
    const targetLi = getTargetLiFromUl(displayContainer, styleChangeItem);
    
    if (styleChangeIndex !== domIndex) {
      displayContainer.removeChild(targetLi);
      displayContainer.insertBefore(targetLi, displayContainer.children[styleChangeIndex + 1]);
    }
  })

  // Update style or insert new Li
  afterList.forEach((item, index) => {
    if (item.id === undefined) {
      item.id = index;
    }

    if (isStyleChangedItem(styleChangeList, item)) {
      // Change it & Remove it from styleChangeList
      const targetLi = getTargetLiFromUl(displayContainer, item);
      console.log('update', item, targetLi);

      if (item.isInHistory === true) {
        addClass('history-li')(targetLi);

        let historyWrapper = document.createElement('div');
        addClass('history-item')(historyWrapper);
        let historyText = document.createTextNode('remove history');
        historyWrapper.appendChild(historyText);
        historyWrapper.onclick = historyWrapperHandler(appState);
        addClass('history-block')(historyWrapper);
        targetLi.replaceChild(historyWrapper, targetLi.children[1]);
      } else if (item.isInHistory === false){
        removeClass('history-li')(targetLi);

        let blockWrapper = document.createElement('div');
        targetLi.replaceChild(blockWrapper, targetLi.children[1]);
      }

      styleChangeList.shift();
    } else {
      let currentLi;
      if (item.isInHistory) {
        currentLi = getHistoryLi(appState)(item);
      } else {
        currentLi = getNormalLi(appState)(item);
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
      const nextStyleChangeItemId = (styleChangeList[0] && styleChangeList[0].id) || undefined;
      console.log('insert new', item, nextStyleChangeItemId);
      if (!nextStyleChangeItemId) {
        displayContainer.appendChild(currentLi);
      } else {
        const nextStyleChangeLi = Array.from(displayContainer.children).filter(child => {
          return Number(child.children[0].id) === nextStyleChangeItemId;
        })[0];

        displayContainer.insertBefore(currentLi, nextStyleChangeLi);
      }
    }
  });
};

const isStyleChangedItem = (styleChangeList, item) =>
  styleChangeList.some(styleChangeItem => styleChangeItem.id === item.id);

const getTargetLiFromUl = (displayContainer, item) => {
  return Array.from(displayContainer.children).filter(child => {
    return Number(child.children[0].id) === item.id;
  })[0];
};

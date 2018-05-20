import { getFromLs } from './localStorageHelpers';
import { fuzzyS } from './generalHelpers';
import { ITEM_OPERATION_STATUS } from '../../constants';

/* eslint-disable */
const {
  INSERT,
  UPDATE,
  REMOVE,
} = ITEM_OPERATION_STATUS;

export const getCurrentList = (appState) => {
  const {
    normalItems,
    searchText,
    storageKey,
  } = appState;

  const historyItems = getFromLs(storageKey);
  const _searchText = searchText.trim().toLowerCase();
  const currentAllItems = [...historyItems, ...normalItems];

  return currentAllItems.filter((item) => {
    const itemName = item.name.trim().toLowerCase();
    return fuzzyS(_searchText)(itemName);
  });
};

export const getDiffObj = (beforeList, afterList) => {
  let removeList = [];
  let insertList = [];
  let styleChangeList = [];

  beforeList.forEach((_bItem) => {
    let afterItem;
    const willExist = afterList.some((aItem, aIndex) => {
      afterItem = {
        ...aItem,
        aIndex,
      };
      return _bItem.id === aItem.id;
    });
    if (willExist) {
      const aItem = {
        ...afterItem,
        opStatus: UPDATE,
      };
      // Sort in afterList order
      styleChangeList = [...styleChangeList, aItem].sort((a, b) => a.aIndex - b.aIndex);
    } else {
      const bItem = {
        ..._bItem,
        opStatus: REMOVE,
      };
      removeList = [...removeList, bItem];
    }
  });

  afterList.forEach((_aItem) => {
    const wasExist = beforeList.some(bItem => _aItem.id === bItem.id);
    if (!wasExist) {
      const aItem = {
        ..._aItem,
        opStatus: INSERT,
      };
      insertList = [...insertList, aItem];
    }
  });

  return {
    removeList,
    insertList,
    styleChangeList: styleChangeList.map(item => {
      const _item = Object.assign(item);
      delete _item.aIndex;
      return _item;
    })
  };
};
// export const getDiffObj = (beforeList, afterList) => {
//   let sortedUpdateItems = [];
//   const prevSameIndexes = {
//     nextBIndex: 0,
//     nextAIndex: 0,
//   };

//   const nextSameIndexes =
//     findNextSameIndexes(beforeList, afterList, prevSameIndexes.nextBIndex, prevSameIndexes.nextAIndex);
//   const {
//     nextBIndex,
//     nextAIndex,
//   } = nextSameIndexes;
//   if (nextBIndex && nextAIndex) {
//     beforeList.forEach((bItem, bIndex) => {
//       if (bIndex < nextBIndex) {
//         sortedUpdateItems = [...sortedUpdateItems, {
//           ...bItem,
//           opStatus: REMOVE,
//         }]
//       }
//     })
//     afterList.forEach()
//   } else {

//   }
// };

// const findNextSameIndexes = (beforeList, afterList, nextBIndex, nextAIndex) => {
//   for (let i = nextBIndex; i < beforeList.length; i++) {
//     const _bItem = beforeList[i];
//     for (let j = nextAIndex; j < afterList.length; j++) {
//       const _aItem = afterList[j];
//       if (_bItem.id === _aItem.id) {
//         return {
//           nextBIndex: i,
//           nextAIndex: j,
//         };
//       }
//     }
//   }

//   return {
//     nextBIndex: null,
//     nextAIndex: null,
//   };
// };

export const sortItemsById = (...lists) => {
  let allList = [];
  lists.forEach((list) => {
    allList = [...allList, ...list];
  });

  return allList.sort((a, b) => a.id - b.id);
};


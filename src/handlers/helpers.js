
// DOM methods
var wrapContainer = (innerNode, wrapperEle = 'div') => {
  const constainer = document.createElement(wrapperEle);
  // constainer.id = 'input-container';
  innerNode.parentNode.insertBefore(constainer, innerNode);
  innerNode.parentNode.removeChild(innerNode);
  constainer.appendChild(innerNode);
}

var replaceWith = (replacedNode, newNode) => {
  replacedNode.parentNode.insertBefore(newNode, replacedNode);
  replacedNode.parentNode.removeChild(replacedNode);
}

// Helper functions
var moveSelectedItemToFist = (targetItem, allItems) => {
  let srcItemIndex = allItems.findIndex(srcItem => srcItem.id === targetItem.id);
  let srcItem = Object.assign({}, allItems[srcItemIndex]);

  allItems.splice(srcItemIndex, 1);
  allItems.unshift(srcItem);
}

var removeSelectedItemFromHistory = (selectedItemId, allItems) => {
  // Remove it from history
  let targetItemIndex = allItems.findIndex(srcItem => srcItem.id === selectedItemId);
  let clonedItem = Object.assign({}, allItems[targetItemIndex]);
  allItems.splice(targetItemIndex, 1);

  // Put it as the first element of 'not-in-history elements'
  let newIndex = allItems.findIndex(srcItem => !srcItem.isInHistory);
  clonedItem.isInHistory = false;
  allItems.splice(newIndex, 0, clonedItem);
}

module.exports = {
  wrapContainer: wrapContainer,
  replaceWith: replaceWith,
  moveSelectedItemToFist: moveSelectedItemToFist,
  removeSelectedItemFromHistory: removeSelectedItemFromHistory,
};

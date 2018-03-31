
// DOM methods
var wrapContainer = (innerNode, wrapperEle = 'div') => {
  const constainer = document.createElement(wrapperEle);
  // constainer.id = 'input-container';
  innerNode.parentNode.insertBefore(constainer, innerNode);
  innerNode.parentNode.removeChild(innerNode);
  constainer.appendChild(innerNode);
  constainer.tabIndex = '-1';

  return constainer;
}

var replaceWith = (replacedNode, newNode) => {
  replacedNode.parentNode.insertBefore(newNode, replacedNode);
  replacedNode.parentNode.removeChild(replacedNode);
}

var isDescendant = (parent, child) => {
  var node = child.parentNode;
  while (node != null) {
      if (node == parent) {
          return true;
      }
      node = node.parentNode;
  }
  return false;
}

var triggerEvent = (el, type) => {
  if ('createEvent' in document) {
    // modern browsers, IE9+
    var e = document.createEvent('HTMLEvents');
    e.initEvent(type, false, true);
    el.dispatchEvent(e);
  } else {
    // IE 8
    var e = document.createEventObject();
    e.eventType = type;
    el.fireEvent('on'+e.eventType, e);
  }
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

var cloneObject = (obj) => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  var temp = obj.constructor();
  for (var key in obj) {
    temp[key] = cloneObject(obj[key]);
  }
  
  return temp;
}


module.exports = {
  wrapContainer: wrapContainer,
  replaceWith: replaceWith,
  isDescendant: isDescendant,
  triggerEvent: triggerEvent,
  moveSelectedItemToFist: moveSelectedItemToFist,
  removeSelectedItemFromHistory: removeSelectedItemFromHistory,
  cloneObject: cloneObject,
};

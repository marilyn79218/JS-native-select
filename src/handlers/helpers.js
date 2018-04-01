
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

var genID = function () {
  // Math.random should be unique because of its seeding algorithm.
  return `_${Math.random().toString(36).substr(2, 9)}`;
};

var getStorageKey = DOMNode => {
  if (DOMNode.id.length === 0) {
    return genID();
  }

  return DOMNode.id;
}

// Helper functions
var removeItemFromList = (targetItem, allItems) => {
  let srcItemIndex = allItems.findIndex(srcItem => srcItem.id === targetItem.id);
  allItems.splice(srcItemIndex, 1);
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

// localStorage functions
var getFromLs = (key) => JSON.parse(localStorage.getItem(key));
var setToLs = (key, value) => localStorage.setItem(key, JSON.stringify(value));
var removeFromLs = (key) => localStorage.removeItem(key);


module.exports = {
  wrapContainer: wrapContainer,
  replaceWith: replaceWith,
  isDescendant: isDescendant,
  triggerEvent: triggerEvent,
  getStorageKey: getStorageKey,
  removeItemFromList: removeItemFromList,
  cloneObject: cloneObject,
  getFromLs: getFromLs,
  setToLs: setToLs,
  removeFromLs: removeFromLs,
};

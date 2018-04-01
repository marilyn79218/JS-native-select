
// DOM methods
export const wrapContainer = (innerNode, wrapperEle = 'div') => {
  const constainer = document.createElement(wrapperEle);
  // constainer.id = 'input-container';
  innerNode.parentNode.insertBefore(constainer, innerNode);
  innerNode.parentNode.removeChild(innerNode);
  constainer.appendChild(innerNode);
  constainer.tabIndex = '-1';

  return constainer;
}

export const replaceWith = (replacedNode, newNode) => {
  replacedNode.parentNode.insertBefore(newNode, replacedNode);
  replacedNode.parentNode.removeChild(replacedNode);
}

export const isDescendant = (parent, child) => {
  var node = child.parentNode;
  while (node != null) {
      if (node == parent) {
          return true;
      }
      node = node.parentNode;
  }
  return false;
}

export const triggerEvent = (el, type) => {
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

const genID = function () {
  // Math.random should be unique because of its seeding algorithm.
  return `_${Math.random().toString(36).substr(2, 9)}`;
};

export const getStorageKey = DOMNode => {
  if (DOMNode.id.length === 0) {
    return genID();
  }

  return DOMNode.id;
}

// Helper functions
export const removeItemFromList = (targetItem, allItems) => {
  let srcItemIndex = allItems.findIndex(srcItem => srcItem.id === targetItem.id);
  allItems.splice(srcItemIndex, 1);
}

export const cloneObject = (obj) => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  var temp = obj.constructor();
  for (var key in obj) {
    temp[key] = cloneObject(obj[key]);
  }
  
  return temp;
}

export const fuzzyS = (queryString) => (targetString) =>
  (new RegExp(Array.from(queryString).map(w => `${w}.*`).join(''))).test(targetString);

// localStorage functions
export const getFromLs = (key) => JSON.parse(localStorage.getItem(key));
export const setToLs = (key, value) => localStorage.setItem(key, JSON.stringify(value));
export const removeFromLs = (key) => localStorage.removeItem(key);

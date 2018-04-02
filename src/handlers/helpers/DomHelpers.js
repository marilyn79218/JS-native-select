export const wrapContainer = (innerNode, wrapperEle = 'div') => {
  const constainer = document.createElement(wrapperEle);
  // constainer.id = 'input-container';
  innerNode.parentNode.insertBefore(constainer, innerNode);
  innerNode.parentNode.removeChild(innerNode);
  constainer.appendChild(innerNode);
  constainer.tabIndex = '-1';

  return constainer;
};

export const addClass = className => targetDOM => targetDOM.classList.add(className);
export const removeClass = className => targetDOM => targetDOM.classList.remove(className);

export const addEvent = (eventName, eventHandler, isCapture) => targetDOM => targetDOM.addEventListener(eventName, eventHandler, isCapture);

export const replaceWith = (replacedNode, newNode) => {
  replacedNode.parentNode.insertBefore(newNode, replacedNode);
  replacedNode.parentNode.removeChild(replacedNode);
};

export const isDescendant = (parent, child) => {
  var node = child.parentNode;
  while (node != null) {
      if (node == parent) {
          return true;
      }
      node = node.parentNode;
  }
  return false;
};

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
};

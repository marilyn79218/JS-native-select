// Wrap an element (default to <div>) around a given Node (said innerNode here).
export const wrapContainer = (innerNode, wrapperEle = 'div') => {
  const constainer = document.createElement(wrapperEle);
  innerNode.parentNode.insertBefore(constainer, innerNode);
  innerNode.parentNode.removeChild(innerNode);
  constainer.appendChild(innerNode);
  constainer.tabIndex = '-1';

  return constainer;
};

// className helpers
export const addClass = className => targetDOM => targetDOM.classList.add(className);
export const removeClass = className => targetDOM => targetDOM.classList.remove(className);

export const addEvent = (eventName, eventHandler, isCapture) => targetDOM => targetDOM.addEventListener(eventName, eventHandler, isCapture);

// Check if a Node is a child of another Node
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

// Event dispatcher
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

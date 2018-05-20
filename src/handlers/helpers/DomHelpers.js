/* eslint-disable */
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
export const triggerEvent = (el, type, metaData) => {
  if ('createEvent' in document) {
    // modern browsers, IE9+
    let event;
    if (metaData) {
      event = new CustomEvent(type, {
        detail: metaData,
      });
    } else {
      event = document.createEvent('HTMLEvents');
      event.initEvent(type, false, true);
    }
    el.dispatchEvent(event);
  } else {
    // IE 8
    var e = document.createEventObject();
    e.eventType = type;
    el.fireEvent('on'+e.eventType, e);
  }
};

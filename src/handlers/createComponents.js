import { addClass } from './helpers/DomHelpers';
import { compose } from './helpers/generalHelpers';

import { logoNameHandler } from './logoNameHandler';
import { historyWrapperHandler } from './historyWrapperHandler';

// The wrapper, a div, which contains <img> & its app name as TextNode
// ALso, It return the first child of <li>
const getLogoNameWrapper = (props) => (wrapContainer, inputNode, displayContainer) => (item, li) => {
  // Create first element, <img>
  let appImg = document.createElement('img');
  appImg.src = item.logo;
  addClass('app-img')(appImg);

  // Create second element, <p> for app name
  let appNameWrapper = document.createElement('p');
  let appNameText = document.createTextNode(`${item.name}`);
  addClass('app-name')(appNameWrapper);
  appNameWrapper.appendChild(appNameText);

  // Create wrapper for wrapping logo & name elements
  let logoNameWrapper = document.createElement('div');
  addClass('logo-name-wrapper')(logoNameWrapper);
  logoNameWrapper.id = item.id;
  logoNameWrapper.insertBefore(appImg, logoNameWrapper.firstChild);
  logoNameWrapper.appendChild(appNameWrapper);
  logoNameWrapper.onclick = logoNameHandler(props)(wrapContainer, inputNode, displayContainer)(item);

  return logoNameWrapper;
}

// A rendering method that return the last child of <li>
// If the current rendered app is in history list, return the element which makes the app removable.
// If not, return a normal block element
const getLastItemInLi = (props) => (wrapContainer, inputNode, displayContainer) => (isInHistory) => {
  if (isInHistory) {
    let historyWrapper = document.createElement('div');
    addClass('history-item')(historyWrapper);
    let historyText = document.createTextNode('remove history');
    historyWrapper.appendChild(historyText);
    historyWrapper.onclick = historyWrapperHandler(props)(wrapContainer, inputNode, displayContainer);

    return historyWrapper;
  } else {
    // Create block item
    let blockWrapper = document.createElement('div');

    return blockWrapper;
  }
}

// Create a li which contains two sub-elements for the app in `history list`
// The two sub-elements are composed from getLogoNameWrapper() & getLastItemInLi() respectively.
export const getHistoryLi = (props) => (wrapContainer, inputNode, displayContainer) => (item) => {
  let li = document.createElement('li');
  compose(
    addClass('history-li'),
    addClass('list-item'),
  )(li)

  // Create logo name wrapper
  let logoNameWrapper = getLogoNameWrapper(props)(wrapContainer, inputNode, displayContainer)(item, li);

  let isInHistory = true;
  let historyWrapper = getLastItemInLi(props)(wrapContainer, inputNode, displayContainer)(isInHistory);
  addClass('history-block')(historyWrapper);


  // Append logo name wrapper & history item to li
  li.insertBefore(logoNameWrapper, li.firstChild);
  li.appendChild(historyWrapper);

  return li;
}

// The functionality of getNormalLi is similar to getHistoryLi,
// but it create a li which contains two sub-elements for the app in `normal list`
export const getNormalLi = (props) => (wrapContainer, inputNode, displayContainer) => (item) => {
  let li = document.createElement('li');
  addClass('list-item')(li);

  // Create logo name wrapper
  let logoNameWrapper = getLogoNameWrapper(props)(wrapContainer, inputNode, displayContainer)(item, li);

  let isInHistory = false;
  let historyWrapper = getLastItemInLi(props)(wrapContainer, inputNode, displayContainer)(isInHistory);

  // Append logo name wrapper & history item to li
  li.insertBefore(logoNameWrapper, li.firstChild);
  li.appendChild(historyWrapper);

  return li;
};

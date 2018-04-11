import { addClass } from './helpers/DomHelpers';
import { compose } from './helpers/generalHelpers';

import { logoNameHandler } from './logoNameHandler';
import { historyWrapperHandler } from './historyWrapperHandler';

/**
 * get the wrapper for `<img>` & `<p>app name</p>`
 *
 * @first_param props: { storageKey, normalItems, searchText }
 * @second_param mainNodes: { wrapContainer, inputNode, displayContainer }
 * @third_param item: { name, logo }
 *
 * @return {HTMLElement}
 *
 */
// Return the wrapper, a div, which contains <img> & its app name as TextNode
const getLogoNameWrapper = (props) => (mainNodes) => (item) => {
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
  logoNameWrapper.onclick = logoNameHandler(props)(mainNodes)(item);

  return logoNameWrapper;
}

/**
 * get the last child of <li>
 *
 * @first_param props: { storageKey, normalItems, searchText }
 * @second_param mainNodes: { wrapContainer, inputNode, displayContainer }
 * @third_param isInHistory: boolean
 *
 * @return {HTMLElement}
 *
 */
// A rendering method that return the last child of <li>
// If the current rendered app is in history list, return the element which makes the app removable.
// If not, return a normal block element
const getLastItemInLi = (props) => (mainNodes) => (isInHistory) => {
  if (isInHistory) {
    let historyWrapper = document.createElement('div');
    addClass('history-item')(historyWrapper);
    let historyText = document.createTextNode('remove history');
    historyWrapper.appendChild(historyText);
    historyWrapper.onclick = historyWrapperHandler(props)(mainNodes);

    return historyWrapper;
  } else {
    // Create block item
    let blockWrapper = document.createElement('div');

    return blockWrapper;
  }
}


/**
 * draw history li
 *
 * @first_param props: { storageKey, normalItems, searchText }
 * @second_param mainNodes: { wrapContainer, inputNode, displayContainer }
 *
 * @return {HTMLElement}
 *
 */
// Create a li which contains two sub-elements for the app in `history list`
// The two sub-elements are composed from getLogoNameWrapper() & getLastItemInLi() respectively.
export const getHistoryLi = (props) => (mainNodes) => (item) => {
  let li = document.createElement('li');
  compose(
    addClass('history-li'),
    addClass('list-item'),
  )(li)

  // Create logo name wrapper
  let logoNameWrapper = getLogoNameWrapper(props)(mainNodes)(item);

  let isInHistory = true;
  let historyWrapper = getLastItemInLi(props)(mainNodes)(isInHistory);
  addClass('history-block')(historyWrapper);


  // Append logo name wrapper & history item to li
  li.insertBefore(logoNameWrapper, li.firstChild);
  li.appendChild(historyWrapper);

  return li;
}

/**
 * draw normal li
 *
 * @first_param props: { storageKey, normalItems, searchText }
 * @second_param mainNodes: { wrapContainer, inputNode, displayContainer }
 *
 * @return {HTMLElement}
 *
 */
// The functionality of getNormalLi is similar to getHistoryLi,
// but it create a li which contains two sub-elements for the app in `normal list`
export const getNormalLi = (props) => (mainNodes) => (item) => {
  let li = document.createElement('li');
  addClass('list-item')(li);

  // Create logo name wrapper
  let logoNameWrapper = getLogoNameWrapper(props)(mainNodes)(item);

  let isInHistory = false;
  let historyWrapper = getLastItemInLi(props)(mainNodes)(isInHistory);

  // Append logo name wrapper & history item to li
  li.insertBefore(logoNameWrapper, li.firstChild);
  li.appendChild(historyWrapper);

  return li;
};

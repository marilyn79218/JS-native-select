import '../styles/main.css';
import {
  ApiUtil,
} from '../utils';

// Lots of helpers
import {
  addClass,
  removeClass,
  addEvent,
  wrapContainer,
  isDescendant,
  triggerEvent,
} from './helpers/DomHelpers';
import {
  compose,
  getStorageKey,
  removeItemFromList,
  cloneObject,
  fuzzyS,
} from './helpers/generalHelpers';
import {
  getFromLs,
  setToLs,
  removeFromLs,
} from './helpers/localStorageHelpers';

// Additional handlers
import inputBlurHandler from './inputBlurHandler';
import wrapperContainerBlurHandler from './wrapperContainerBlurHandler';

import {
  drawDisplayList,
} from './drawer';

/* Basic variable nameing */
/*
  - History list: contains the app which has selected before
  - Normal items: the app which are not selected yet and which are removed from history list.
                  i.e., the apps which is in suggestion list but not in history list
*/

var inputFocusHandler = () => {
  let appState = {
    searchText: '',
  };

  return (e) => {
    appState.inputNode = e.target;
    appState.inputNode.tabIndex = 1;

    const setState = (updateState, callback) => {
      if (typeof updateState === 'function') {
        appState = {
          ...appState,
          ...updateState(appState),
        };

        return appState;
      }

      appState = {
        ...appState,
        ...updateState,
      };

      if (callback) {
        callback();
      }

      return appState;
    };

    // If the input field is focused/ clicked in first time, we need to fetch data & initialize basic DOMs.
    // If not, just show the suggestion list
    if (!appState.data) {
      // A key for save hisotry apps in localStorage
      const _storageKey = getStorageKey(appState.inputNode);
      setState({
        storageKey: _storageKey,
      }, () => setToLs(_storageKey, []));

      ApiUtil.get().then(res => {
        const _data = res;
        const _normalItems = cloneObject(_data.items);

        // Basic settings...
        // Wrap a div container at the outside of the <input> for positioning purpose
        const _wrapContainer = wrapContainer(appState.inputNode, 'div');
        compose(
          addEvent('blur', wrapperContainerBlurHandler, false),
          addClass('wrap-container'),
        )(_wrapContainer);

        compose(
          addEvent('blur', inputBlurHandler, false),
          addClass('input-style'),
        )(appState.inputNode);

        const _displayContainer = document.createElement('ul');
        addClass('display-container')(_displayContainer);

        setState({
          data: _data,
          normalItems: _normalItems,
          wrapContainer: _wrapContainer,
          displayContainer: _displayContainer,
        });

        // Render the suggestion list
        drawDisplayList({
          storageKey: appState.storageKey,
          normalItems: appState.normalItems,
          searchText: appState.searchText,
        })(appState.wrapContainer, appState.inputNode, appState.displayContainer);

        // Append the <ul> container to the <div> wrapper,
        // Purpose for positioning after <input>
        appState.wrapContainer.appendChild(appState.displayContainer);

        // Keep focus on the input field
        appState.inputNode.focus();
      });
    } else {
      compose(
        addClass('show-myself'),
        removeClass('hide-myself'),
      )(appState.wrapContainer.childNodes[1]);

      appState.inputNode.focus();
    }

    // Handler for user to type in input field
    appState.inputNode.onkeyup = (e) => {
      let searchText = e.target.value;
      setState({
        searchText,
      });

      // Re-render display list (ul)
      appState.displayContainer.innerHTML = '';
      drawDisplayList({
        storageKey: appState.storageKey,
        normalItems: appState.normalItems,
        searchText: appState.searchText,
      })(appState.wrapContainer, appState.inputNode, appState.displayContainer);
    }
  };
};

export default inputFocusHandler;

import '../styles/main.css';
import { ApiUtil } from '../utils';

// Lots of helpers
import {
  addClass,
  removeClass,
  addEvent,
  wrapContainer,
} from './helpers/DomHelpers';
import {
  compose,
  getStorageKey,
  cloneObject,
} from './helpers/generalHelpers';
import { setToLs } from './helpers/localStorageHelpers';

// Additional handlers
import inputBlurHandler from './inputBlurHandler';
import wrapperContainerBlurHandler from './wrapperContainerBlurHandler';

import { drawDisplayList } from './drawer';

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

    const {
      data,
      inputNode,
    } = appState;
    // If the input field is focused/ clicked in first time, we need to fetch data & initialize basic DOMs.
    // If not, just show the suggestion list
    if (!data) {
      // A key for save hisotry apps in localStorage
      const _storageKey = getStorageKey(inputNode);
      setState({
        storageKey: _storageKey,
      }, () => setToLs(_storageKey, []));

      ApiUtil.get().then(res => {
        const _data = res;
        const _normalItems = cloneObject(_data.items);

        // Basic settings...
        // Wrap a div container at the outside of the <input> for positioning purpose
        const _wrapContainer = wrapContainer(inputNode, 'div');
        compose(
          addEvent('blur', wrapperContainerBlurHandler, false),
          addClass('wrap-container'),
        )(_wrapContainer);

        compose(
          addEvent('blur', inputBlurHandler, false),
          addClass('input-style'),
        )(inputNode);

        const _displayContainer = document.createElement('ul');
        addClass('display-container')(_displayContainer);

        setState({
          data: _data,
          normalItems: _normalItems,
          wrapContainer: _wrapContainer,
          displayContainer: _displayContainer,
        }, () => {
          const {
            storageKey,
            normalItems,
            searchText,
            wrapContainer,
            inputNode,
            displayContainer,
          } = appState;

          // Render the suggestion list
          drawDisplayList({
            storageKey,
            normalItems,
            searchText,
          })({
            wrapContainer,
            inputNode,
            displayContainer,
          });

          // Append the <ul> container to the <div> wrapper,
          // Purpose for positioning after <input>
          wrapContainer.appendChild(displayContainer);

          // Keep focus on the input field
          inputNode.focus();
        });
      });
    } else {
      const {
        wrapContainer,
        inputNode,
      } = appState;

      compose(
        addClass('show-myself'),
        removeClass('hide-myself'),
      )(wrapContainer.childNodes[1]);

      inputNode.focus();
    }

    // Handler for user to type in input field
    inputNode.onkeyup = (e) => {
      setState({
        searchText: e.target.value,
      }, () => {
        const {
          storageKey,
          normalItems,
          searchText,
          wrapContainer,
          inputNode,
          displayContainer,
        } = appState;

        // Re-render display list (ul)
        displayContainer.innerHTML = '';
        drawDisplayList({
          storageKey,
          normalItems,
          searchText,
        })({
          wrapContainer,
          inputNode,
          displayContainer,
        });
      });
    }
  };
};

export default inputFocusHandler;

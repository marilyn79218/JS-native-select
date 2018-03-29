require('./main.css');

const utils = require('./utils/index.js');

// utils.ApiUtil.get().then(res => console.log('Api response', res));

// const f = require('./utils/iife.js');
// f.f();

// // Ceates an HTML element
// function component() {
//     var element = document.createElement('pre');

//     element.innerHTML = [
//       'First compoenent!'
//     ].join('\n\n');

//     return element;
// }

// DOM methods
var wrapContainer = (innerNode, wrapperEle = 'div') => {
  const constainer = document.createElement(wrapperEle);
  constainer.id = 'input-container';
  innerNode.parentNode.insertBefore(constainer, innerNode);
  innerNode.parentNode.removeChild(innerNode);
  constainer.appendChild(innerNode);
}

var replaceWith = (replacedNode, newNode) => {
  replacedNode.parentNode.insertBefore(newNode, replacedNode);
  replacedNode.parentNode.removeChild(replacedNode);
}

var handler = (e) => {
  // Data initializing
  this.data = {};
  this.historyList = [];

  // Init input node
  this.inputNode = e.target;
  this.inputNode.style.cssText = "position: relative;";

  var _this = this;

  // Handler Initializing
  var logoNameHandler = (selectedItem, selectedLi, displayContainer) => (e) => {
    selectedItem.isInHistory = true;
    this.historyList.push(selectedItem);
    console.log('historyList', this.historyList);

    addItemToHistory(selectedLi, displayContainer);

    this.inputNode.value = selectedItem.name;
  }

  // UI render methods
  // Create basic li children
  var getLogoNameWrapper = (item, li, displayContainer) => {
    // Create first element, img
    let appImg = document.createElement('img');
    appImg.src = item.logo;
    appImg.classList.add('app-img');

    // Create second element, p
    let appNameWrapper = document.createElement('p');
    let appNameText = document.createTextNode(`${item.name}`);
    appNameWrapper.classList.add('app-name');
    appNameWrapper.appendChild(appNameText);

    // Create wrapper for logo & name
    let logoNameWrapper = document.createElement('div');
    logoNameWrapper.classList.add('logo-name-wrapper');
    logoNameWrapper.insertBefore(appImg, logoNameWrapper.firstChild);
    logoNameWrapper.appendChild(appNameWrapper);
    console.log('onclick li', li);
    logoNameWrapper.onclick = logoNameHandler(item, li, displayContainer);

    return logoNameWrapper;
  }

  var getLastItemInLi = (isInHistory) => {
    // let lastItemWrapper;
    if (isInHistory) {
      // Create history item
      let historyWrapper = document.createElement('div');
      historyWrapper.classList.add('history-item');
      let historyText = document.createTextNode('remove history');
      historyWrapper.appendChild(historyText);

      return historyWrapper;
    } else {
      // Create block item
      let blockWrapper = document.createElement('div');

      return blockWrapper;
    }
  }

  // Create history li
  var getHistoryLi = (item, displayContainer) => {
    let li = document.createElement('li');
    li.classList.add('list-item');

    // Create logo name wrapper
    let logoNameWrapper = getLogoNameWrapper(item, li, displayContainer);

    let isInHistory = true;
    let historyWrapper = getLastItemInLi(isInHistory);

    // Append logo name wrapper & history item to li
    li.insertBefore(logoNameWrapper, li.firstChild);
    li.appendChild(historyWrapper);

    return li;
  }

  var getNormalLi = (item, displayContainer) => {
    let li = document.createElement('li');
    li.classList.add('list-item');

    // Create logo name wrapper
    let logoNameWrapper = getLogoNameWrapper(item, li, displayContainer);

    let isInHistory = false;
    let historyWrapper = getLastItemInLi(isInHistory);

    // Append logo name wrapper & history item to li
    li.insertBefore(logoNameWrapper, li.firstChild);
    li.appendChild(historyWrapper);

    return li;
  }

  var drawDisplayList = (items, displayContainer) => {
    items.forEach((item, index) => {
      if (!item.id) {
        _this.data.items[index].id = index;
      }

      // let historyLi = getHistoryLi(item, displayContainer);
      let normalLi = getNormalLi(item, displayContainer);

      // Append a current li to ul
      // displayContainer.appendChild(historyLi);
      displayContainer.appendChild(normalLi);
    });
  }

  var addItemToHistory = (selectedLi, displayContainer) => {
    let clonedLi = selectedLi.cloneNode(true);
    clonedLi.childNodes[0].onclick = selectedLi.childNodes[0].onclick;
    let isInHistory = true;
    replaceWith(clonedLi.childNodes[1], getLastItemInLi(isInHistory));

    console.log('displayContainer', displayContainer);
    console.log('selectedLi', selectedLi);

    // Remove it from displayContainer (ul)
    displayContainer.removeChild(selectedLi);

    // Prepend it to displayContainer (ul)
    displayContainer.insertBefore(clonedLi, displayContainer.firstChild);
  }

  utils.ApiUtil.get().then(res => {
    this.data = res;
    console.log('Api response', res);

    // Wrap a container
    wrapContainer(this.inputNode, 'div');
    let inputContainer = document.getElementById('input-container');
    inputContainer.style.cssText = 'position: relative;';

    // Init the display list container
    let displayContainer = document.createElement('ul');
    displayContainer.classList.add('display-container');

    // Draw display list
    drawDisplayList(this.data.items, displayContainer);

    // Put display container after input field
    inputContainer.appendChild(displayContainer);

    // Keep focus on the input field
    this.inputNode.focus();
  });
}

var input1 = document.getElementById('input1');
input1.onclick = handler;

// var input2 = document.getElementById('input2');
// input2.onclick = handler;

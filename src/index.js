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

// Helper functions
var moveSelectedItemToFist = (targetItem, allItems) => {
  let srcItemIndex = allItems.findIndex(srcItem => srcItem.id === targetItem.id);
  let srcItem = Object.assign({}, allItems[srcItemIndex]);

  allItems.splice(srcItemIndex, 1);
  allItems.unshift(srcItem);
}

var handler = (e) => {
  // Data initializing
  this.data = {};

  // Init input node
  this.inputNode = e.target;
  this.inputNode.style.cssText = "position: relative;";

  // ul Node
  this.displayContainer;

  var _this = this;

  // Handler Initializing
  var logoNameHandler = (selectedItem) => (e) => {
    if (!selectedItem.isInHistory) {
      selectedItem.isInHistory = true; 
    }

    // Move selected item to the fist of source data list
    moveSelectedItemToFist(selectedItem, _this.data.items);

    // Re-render display list (ul)
    this.displayContainer.innerHTML = '';
    drawDisplayList();

    // addItemToHistory(selectedItem);

    this.inputNode.value = selectedItem.name;
  }

  // UI render methods
  // Create basic li children
  var getLogoNameWrapper = (item, li) => {
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
    logoNameWrapper.id = item.id;
    logoNameWrapper.insertBefore(appImg, logoNameWrapper.firstChild);
    logoNameWrapper.appendChild(appNameWrapper);
    console.log('onclick li', li);
    logoNameWrapper.onclick = logoNameHandler(item);

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
  var getHistoryLi = (item) => {
    let li = document.createElement('li');
    li.classList.add('list-item');

    // Create logo name wrapper
    let logoNameWrapper = getLogoNameWrapper(item, li);

    let isInHistory = true;
    let historyWrapper = getLastItemInLi(isInHistory);

    // Append logo name wrapper & history item to li
    li.insertBefore(logoNameWrapper, li.firstChild);
    li.appendChild(historyWrapper);

    return li;
  }

  var getNormalLi = (item) => {
    let li = document.createElement('li');
    li.classList.add('list-item');

    // Create logo name wrapper
    let logoNameWrapper = getLogoNameWrapper(item, li);

    let isInHistory = false;
    let historyWrapper = getLastItemInLi(isInHistory);

    // Append logo name wrapper & history item to li
    li.insertBefore(logoNameWrapper, li.firstChild);
    li.appendChild(historyWrapper);

    return li;
  }

  var drawDisplayList = () => {
    this.data.items.forEach((item, index) => {
      if (item.id === undefined) {
        item.id = index;
      }

      let currentLi;
      if (item.isInHistory) {
        currentLi = getHistoryLi(item);
      } else {
        currentLi = getNormalLi(item);
      }

      // Append a current li to ul
      // displayContainer.appendChild(historyLi);
      this.displayContainer.appendChild(currentLi);
    });
  }

  // var addItemToHistory = (selectedItem) => {
  //   // Find selected li from current ul
  //   let ajustedLi = Array.from(this.displayContainer.childNodes).find((li) => selectedItem.id === Number(li.childNodes[0].id));

  //   let clonedLi = ajustedLi.cloneNode(true);
  //   clonedLi.childNodes[0].onclick = ajustedLi.childNodes[0].onclick;
  //   let isInHistory = true;
  //   replaceWith(clonedLi.childNodes[1], getLastItemInLi(isInHistory));

  //   // Remove it from displayContainer (ul)
  //   this.displayContainer.removeChild(ajustedLi);

  //   // Prepend it to displayContainer (ul)
  //   this.displayContainer.insertBefore(clonedLi, this.displayContainer.firstChild);
  // }

  utils.ApiUtil.get().then(res => {
    this.data = res;
    console.log('Api response', res);

    // Wrap a container
    wrapContainer(this.inputNode, 'div');
    let inputContainer = document.getElementById('input-container');
    inputContainer.style.cssText = 'position: relative;';

    // Init the display list container
    this.displayContainer = document.createElement('ul');
    this.displayContainer.classList.add('display-container');

    // Draw display list
    drawDisplayList();

    // Put display container after input field
    inputContainer.appendChild(this.displayContainer);

    // Keep focus on the input field
    this.inputNode.focus();
  });
}

var input1 = document.getElementById('input1');
input1.onclick = handler;

// var input2 = document.getElementById('input2');
// input2.onclick = handler;

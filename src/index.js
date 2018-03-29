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

var wrapContainer = (innerNode, wrapperEle = 'div') => {
  const constainer = document.createElement(wrapperEle);
  constainer.id = 'input-container';
  innerNode.parentNode.insertBefore(constainer, innerNode);
  innerNode.parentNode.removeChild(innerNode);
  constainer.appendChild(innerNode);
}

var handler = (e) => {
  // Get data first
  this.data = {};
  utils.ApiUtil.get().then(res => {
    this.data = res;
    console.log('Api response', res);

    // Init input node
    let inputNode = e.target;
    inputNode.style.cssText = "position: relative;";

    // Wrap a container
    wrapContainer(inputNode, 'div');
    let inputContainer = document.getElementById('input-container');
    inputContainer.style.cssText = 'position: relative;';

    // Init the display list container
    let displayContainer = document.createElement('ul');
    displayContainer.classList.add('display-container');

    this.data.items.forEach(item => {
      let li = document.createElement('li');
      li.classList.add('list-item');

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

      // Create history item
      let historyWrapper = document.createElement('div');
      historyWrapper.classList.add('history-item');
      let historyText = document.createTextNode('remove history');
      historyWrapper.appendChild(historyText);

      // Append logo name wrapper & history item to li
      li.insertBefore(logoNameWrapper, li.firstChild);
      li.appendChild(historyWrapper);

      // Append a current li to ul
      displayContainer.appendChild(li);
    });

    // Put display container after input field
    inputContainer.appendChild(displayContainer);

    // Keep focus on the input field
    inputNode.focus();
  });
}

var input = document.getElementById('input');
input.onclick = handler;



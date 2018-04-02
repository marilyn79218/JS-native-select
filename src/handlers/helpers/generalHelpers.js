export const compose = (...args) => (x) => {
  let result;
  
  var tmp = [...args];
  args.forEach(arg => {
    var fun = tmp.pop();
    if (!result) {
      result = fun(x); 
    } else {
      result = fun(result); 
    }
  });
  
  return result;
}

const genID = () => {
  // Math.random should be unique because of its seeding algorithm.
  return `_${Math.random().toString(36).substr(2, 9)}`;
};

export const getStorageKey = DOMNode => {
  if (DOMNode.id.length === 0) {
    return genID();
  }

  return DOMNode.id;
}

// Helper functions
export const removeItemFromList = (targetItem, allItems) => {
  let srcItemIndex = allItems.findIndex(srcItem => srcItem.id === targetItem.id);
  allItems.splice(srcItemIndex, 1);
}

export const cloneObject = (obj) => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  var temp = obj.constructor();
  for (var key in obj) {
    temp[key] = cloneObject(obj[key]);
  }
  
  return temp;
}

export const fuzzyS = (queryString) => (targetString) =>
  (new RegExp(Array.from(queryString).map(w => `${w}.*`).join(''))).test(targetString);

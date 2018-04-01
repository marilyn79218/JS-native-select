const lineServices = require('../../fixtures/line-services.js');

function cloneObject(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  var temp = obj.constructor();
  for (var key in obj) {
    temp[key] = cloneObject(obj[key]);
  }
  
  return temp;
}

const BASE_URL1 = 'https://line.me/en/family-apps';
// const BASE_URL2 = 'https://line.me/en/download';

const fetch = (_url, _options) => Promise.resolve(cloneObject(lineServices));

class ApiUtil {
  static get() {
    const url = BASE_URL1;
    const options = {
      method: 'GET',
      headers: {},
    };
    return fetch(url, options);
  }
}

// export default ApiUtil;
module.exports = ApiUtil;

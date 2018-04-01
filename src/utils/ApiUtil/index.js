import lineServices from '../../fixtures/line-services';
import {
  cloneObject,
} from '../../handlers/helpers/generalHelpers';

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

export default ApiUtil;

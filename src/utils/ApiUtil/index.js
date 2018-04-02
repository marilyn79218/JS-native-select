import lineServices from '../../fixtures/line-services';
import {
  cloneObject,
} from '../../handlers/helpers/generalHelpers';

const BASE_URL = 'https://line.me/en/family-apps';

const fetch = (_url, _options) => Promise.resolve(cloneObject(lineServices));

class ApiUtil {
  static get() {
    const url = process.env.ENDPOINT_ENV || BASE_URL;
    const options = {
      method: 'GET',
      headers: {},
    };

    // Will be the endpoint you given
    console.log('fetch url', url); 

    return fetch(url, options);
  }
}

export default ApiUtil;

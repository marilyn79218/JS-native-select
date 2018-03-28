// const BASE_URL1 = 'https://line.me/en/family-apps';
const BASE_URL2 = 'https://line.me/en/download';

class ApiUtil {
  static get(path) {
    return fetch(BASE_URL2);
  }
}

// export default ApiUtil;
module.exports = {
  ApiUtil: ApiUtil
};

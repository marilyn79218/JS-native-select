const data = {
  totoal: 10,
  items: [
    {
      name: 'B612',
      logo: 'https://d.line-scdn.net/stf/line-lp/family/en/b612_190.png',
    },
    {
      name: 'LOOKS',
      logo: 'https://d.line-scdn.net/stf/line-lp/line_looks_190x190.png',
    },
    {
      name: 'LINE MAN',
      logo: 'https://d.line-scdn.net/stf/line-lp/line_android_190x190_1111.png',
    },
    {
      name: 'Emoji LINE',
      logo: 'https://d.line-scdn.net/stf/line-lp/family/en/190X190_line_me.png',
    },
    {
      name: 'LINE@',
      logo: 'https://d.line-scdn.net/stf/line-lp/family/en/lineat_96.png',
    },
    {
      name: 'LINE TV',
      logo: 'https://d.line-scdn.net/stf/line-lp/family/en/linelogo_96x96.png',
    },
    {
      name: 'LINE Camera',
      logo: 'https://d.line-scdn.net/stf/line-lp/family/en/linecamera_icon_96.png',
    },
    {
      name: 'LINE PLAY',
      logo: 'https://d.line-scdn.net/stf/line-lp/FreeCoin_CHERRY_96_0314.png',
    },
    {
      name: 'LINE Antivirus',
      logo: 'https://d.line-scdn.net/stf/line-lp/family/en/LP_Family_icon_96_LINE-Antivirus.jpg',
    },
    {
      name: 'LINE SHOP',
      logo: 'https://d.line-scdn.net/stf/line-lp/family/en/lineshop_96.png',
    },
  ]
};

const BASE_URL1 = 'https://line.me/en/family-apps';
// const BASE_URL2 = 'https://line.me/en/download';

const fetch = (_url, _options) => Promise.resolve(data);

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

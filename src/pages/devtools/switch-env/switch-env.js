
const ENV_KEY = 'ENV';

const ENV_ARRAY = [{
    name: '线上',
    value: 'prod',
  },
  {
    name: '测试环境',
    value: 'dev',
  }
];

const getQueryVariable = function (url, variable) {
  const index = url.indexOf('?');
  const query = url.substring(index + 1);
  const vars = query.split('&');
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split('=');
    if (pair[0] === variable) {
      return pair[1];
    }
  }
  return (false);
};

const config = {
  data: {
    index: 0,
    array: ENV_ARRAY,
    swimlane: '',
  },
  onLoad(options) {
    const {
      q,
    } = options;

    // 切换env环境
    if (q) {
      const qrcode = decodeURIComponent(q);
      const env = getQueryVariable(qrcode, 'env');

      if (env) {
        this.autoChangeEnv(env);
      }
      this.jumpToIndex();
    }

    // 切换泳道
  },
  autoChangeEnv(env) {
    const envMap = {
      '': 0,
      qa: 1,
      dev: 2,
      st: 3,
    };
    this.changeEnv(envMap[env]);
  },
  onShow() {
    this._getEnvStorage();
  },
  bindPickerChangeEnv({
    detail: {
      value,
    },
  }) {
    this.changeEnv(value);
  },
  changeEnv(value) {
    wx.clearStorageSync();
    setTimeout(()=> {
      wx.setStorageSync('env', ENV_ARRAY[value].value || '');
      wx.setStorageSync('hasVisited', 1);
    }, 500);
    wx.showToast({
      title: `切换到[${ENV_ARRAY[value].name || '线上'}]`,
      icon: 'none',
    });
    this.setData({
      index: value,
    });
  },
  inptSwimLane({
    detail: {
      value,
    },
  }) {
    // this.changeSwimLane(value);
  },
  jumpToIndex() {
    wx.reLaunch({
      url: '/pages/index/index?devtools=1',
    });
  },
  _getEnvStorage() {
    const self = this;
    wx.getStorage({
      key: ENV_KEY,
      success({
        data,
      }) {
        const l = ENV_ARRAY.length;
        for (let i = 0; i < l; i++) {
          const item = ENV_ARRAY[i];
          if (item.value === data) {
            self.setData({
              index: i,
            });
            break;
          }
        }
      },
    });
  }
};

Page(
  config
);

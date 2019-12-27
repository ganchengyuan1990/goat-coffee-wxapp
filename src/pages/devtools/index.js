Page({
  data: {
    SDKVersion: '',
    devRoutes: {
      // envParam: {
      //   name: '环境参数',
      //   url: '/env-param/env-param',
      // },
      // userInfo: {
      //   name: '用户信息',
      //   url: '/user-info/user-info',
      // },
      switchEnv: {
        name: '环境切换',
        url: '/switch-env/switch-env',
      },
      // clearData: {
      //   name: '数据清理',
      //   url: '/clear-data/clear-data',
      // },
      // switchPage: {
      //   name: '页面切换',
      //   url: '/switch-page/switch-page',
      // },
      // catWebview: {
      //   name: '跳转H5',
      //   url: '/cat-webview/cat-webview',
      // },
    },
    networkType: '',
    systemInfo: '',
  },
  onLoad() {
    this._getSystemInfo();
    this._getNetWork();
  },
  navigatorTo({
    currentTarget: {
      dataset: {
        route,
      },
    },
  }) {
    const {
      url,
    } = route;
    wx.navigateTo({
      url: `/pages/devtools${url}?systemInfo=${this.data.systemInfo}&networkType=${this.data.networkType}`,
    });
  },
  _getNetWork() {
    const self = this;
    wx.getNetworkType({
      success(res) {
        self.setData({
          networkType: res.networkType,
        });
      },
    });
  },
  _getSystemInfo() {
    const self = this;
    wx.getSystemInfo({
      success(res) {
        self.setData({
          SDKVersion: res.SDKVersion,
          systemInfo: JSON.stringify(res),
        });
      },
    });
  },
});

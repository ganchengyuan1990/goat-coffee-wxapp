Page({
  data: {
    currentSize: 0,
    limitSize: 0,
    storageArr: [],
    authArr: [],
    locstorage: '',
  },
  onShow() {
    this._getAllStorage();
    this._getAuth();

    wx.getStorage({
      key: 'wxloc-waimai',
      success: (res) => {
        this.setData({
          locstorage: res.data,
        });
      },
    });
  },
  clearAllStorage() {
    const self = this;
    wx.clearStorage({
      success() {
        self.setData({
          currentSize: 0,
          storageArr: [],
        });
      },
    });
  },
  clearStorageItem({
    currentTarget: {
      dataset: {
        key,
      },
    },
  }) {
    const self = this;
    const arr = [...this.data.storageArr];
    arr.splice(arr.indexOf(key), 1);
    wx.removeStorage({
      key,
      success() {
        self.setData({
          storageArr: arr,
        });
      },
    });
  },
  closeAuth({
    detail: {
      authSetting,
    },
  }) {
    this.setData({
      authArr: Object.keys(authSetting).filter((item) => {
        if (authSetting[item]) {
          return true;
        }
        return false;
      }),
    });
  },
  _getAllStorage() {
    const self = this;
    wx.getStorageInfo({
      success({
        keys,
        currentSize,
        limitSize,
      }) {
        self.setData({
          currentSize,
          limitSize,
          storageArr: keys,
        });
      },
    });
  },
  _getAuth() {
    const self = this;
    wx.getSetting({
      success({
        authSetting,
      }) {
        self.setData({
          authArr: Object.keys(authSetting).filter((item) => {
            if (authSetting[item]) {
              return true;
            }
            return false;
          }),
        });
      },
    });
  },
});

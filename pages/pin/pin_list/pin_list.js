import model from '../../../utils/model';

Page({
  data: {
    pinList: [],
    id: 0
  },

  goPinDetail (e) {
    wx.hideTabBar({
      animation: true,
      success() {
                
      },
      fail() {}
    });
    wx.navigateTo({
      url: `../pin_detail/pin_detail?id=${parseInt(e.currentTarget.dataset.id)}`
    });
  },

  onShow () {
    wx.showTabBar({
      animation: true
    });
  },

  onLoad: function (option) {

    model('group/action/list', {
      // openid: wx.getStorageSync('openid')
    }).then(data => {
      if (data.data) {
        let result = data.data;
        this.setData({
          pinList: data.data
        });
      }
    });
  }
});
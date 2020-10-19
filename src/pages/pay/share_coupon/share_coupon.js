const app = getApp();

Page({
  data: {

  },
  onLoad: function (options) {},
  onReady: function () {

  },
  onShow: function () {

  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭
  },

  goShareSuccess () {
    wx.navigateTo({
      url: '/pages/pay/share_success/share_success'
    });
  }
});
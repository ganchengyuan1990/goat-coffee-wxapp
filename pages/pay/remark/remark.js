Page({
  data: {
    content: ''
  },
  onLoad: function (options) {
    this.dealOptions(options);
  },


  dealName(e) {
    this.setData({
      content: e.detail.value
    });
  },

  dealOptions (options) {
    this.setData({
      content: options.remark
    });
  },

  commitRemark() {
    wx.setStorageSync('remark', this.data.content);
    let pages = getCurrentPages();
    let currPage = pages[pages.length - 1]; //当前页面
    let prevPage = pages[pages.length - 2]; //上一个页面
    prevPage.setData({
      goBackFromRemark: true
    });
    wx.navigateBack({
      delta: 1 //返回的页面数，如果 delta 大于现有页面数，则返回到首页,
    });
  },

  onReady: function () {
    // 页面渲染完成

  },
  onShow: function () {

  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  }
});
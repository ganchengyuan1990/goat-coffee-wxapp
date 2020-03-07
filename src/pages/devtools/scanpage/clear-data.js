Page({
  data: {
    url: ''
  },
  onLoad() {
    this.onScanWebview()
  },
  onScanWebview() {
    const self = this;
    wx.scanCode({
      success(res) {
        self.setData({
          url: res.result,
        });
        console.log(res.result);
        wx.redirectTo({
          url: res.result
        })
      },
    });
  },
});

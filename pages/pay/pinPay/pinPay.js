Page({
  data: {
    openid: '',
    appId: '',
    nonceStr: '',
    paySign: '',
    prepayId: '',
    signType: '',
    timeStamp: '',
    price: 0,
    originalPrice: 0,
    number: 0,
    groupName: '',
    type: 'normal',
    activityId: '',
    list: ''
  },
  onLoad: function (option) {
    let openid = wx.getStorageSync('openid');
    this.setData({
      activityId: option.activityId,
      appId: option.appId,
      nonceStr: option.nonceStr,
      paySign: option.paySign,
      prepayId: option.prepayId,
      signType: option.signType,
      timeStamp: option.timeStamp,
      price: option.price,
      originalPrice: option.originalPrice,
      number: option.number,
      groupName: option.groupName,
      type: option.type ? option.type : 'normal',
      list: option.list
    });

    this.payFunc(this);

  },



  payFunc(self) {
    wx.requestPayment({
      'timeStamp': this.data.timeStamp,
      'nonceStr': this.data.nonceStr,
      'package': `prepay_id=${this.data.prepayId}`,
      'signType': this.data.signType,
      'paySign': this.data.paySign,
      'success': function (res) {
        if (self.data.type === 'pin') {
          wx.redirectTo({
            url: `/pages/pin/pay_success/pay_success?activityId=${self.data.activityId}&price=${self.data.price}&originalPrice=${self.data.originalPrice}&number=${self.data.number}&groupName=${self.data.groupName}&list=${self.data.list}`
          });
        } else {
          wx.redirectTo({
            url: `/pages/pay/pay_success/pay_success?price=${self.data.price}`
          });
        }
      },
      'fail': function (res) {
        if (res.errMsg.indexOf('cancel') > 0) {
          wx.navigateBack({
            delta: 1 //返回的页面数，如果 delta 大于现有页面数，则返回到首页,
          });
        }
      },
      'complete': function (res) {

      }
    });
  }
});
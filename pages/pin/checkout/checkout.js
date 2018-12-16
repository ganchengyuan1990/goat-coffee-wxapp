// var util = require('../../../utils/util.js');
// var api = require('../../../config/api.js');
// const pay = require('../../../services/pay.js');
import model from '../../../utils/model';


var app = getApp();

Page({
  data: {
    pinOrderInfo: {},
    groupName: '',
    price: 0,
    originalPrice: 0,
    number: 0,
    isOwner: -1,
    errorToast: false,
    toastInfo: '',
    activityId: ''
  },
  onLoad: function (options) {

    this.setData({
      goodsTotalPrice: parseInt(options.price),
      groupName: options.groupName,
      price: options.price,
      originalPrice: options.originalPrice,
      number: options.number,
      isOwner: options.isOwner,
      activityId: options.activityId
    })

    // 页面初始化 options为页面跳转所带来的参数

    try {
      var addressId = wx.getStorageSync('addressId');
      if (addressId) {
        this.setData({
          'addressId': addressId
        });
      }

      var couponId = wx.getStorageSync('couponId');
      if (couponId) {
        this.setData({
          'couponId': couponId
        });
      }
    } catch (e) {
      // Do something when catch error
    }


  },

  calcTotalWeight () {
    let cartInfo = wx.getStorageSync('chooseCartInfo');
    let total = 0;
    cartInfo.forEach(element => {
      total += parseFloat(element.weight) * parseFloat(element.number)
    });
    return Math.ceil(total);
  },

  chooseSelf () {
    this.setData({
      chooseSelf: true,
      chooseExpress: false
    })
  },

  chooseExpress () {
    this.setData({
      chooseSelf: false,
      chooseExpress: true
    })
  },

  getCheckoutInfo () {
    let pinOrderInfo = wx.getStorageSync('pinOrderInfo');
    this.setData({
      pinOrderInfo: pinOrderInfo
    })
    wx.removeStorageSync('pinOrderInfo');
  },
  selectAddress() {
    wx.navigateTo({
      url: '/pages/address/address',
    })
  },
  addAddress() {
    wx.navigateTo({
      url: '/pages/shopping/addressAdd/addressAdd',
    })
  },
  onReady: function () {
    // 页面渲染完成

  },
  onShow: function () {
    // 页面显示
    this.getCheckoutInfo();
  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  },
  submitOrder: function () {
    let paramStr = this.data.pinOrderInfo.paramStr;
    let paramArr = paramStr.split('&');
    let param = {};
    paramArr.forEach(element => {
      let key = element.split('=')[0];
      let value = element.split('=')[1];
      param[key] = value;
    });
    let voucherParamArr = this.data.pinOrderInfo.voucherParamArr;
    param.list = voucherParamArr;
    if (this.data.isOwner == 1) {
      model(`group/action/start`, param, 'POST').then(data => {
        let order = data.data;
        let _package = order.package;
        let prepayId = _package.split('=')[1];
        wx.navigateTo({
          url: `/pages/pay/pinPay/pinPay?type=pin&activityId=${order.activityId}&timeStamp=${order.timeStamp}&msg=suc&paySign=${order.paySign}&appId=wx95a4dca674b223e1&signType=MD5&prepayId=${prepayId}&nonceStr=${order.nonceStr}&price=${this.data.price}&originalPrice=${this.data.originalPrice}&number=${this.data.number}&groupName=${this.data.groupName}`
        })
      }).catch(e => {
        this.setData({
          errorToast: true,
          toastInfo: e
        })
      });
    } else {
      model(`group/action/join`, param, 'POST').then(data => {
        debugger
        let order = data.data;
        let _package = order.package;
        let prepayId = _package.split('=')[1]
        wx.navigateTo({
          url: `/pages/pay/pinPay/pinPay?type=pin&activityId=${this.data.activityId}&timeStamp=${order.timeStamp}&msg=suc&paySign=${order.paySign}&appId=wx95a4dca674b223e1&signType=MD5&prepayId=${prepayId}&nonceStr=${order.nonceStr}&price=${this.data.price}&originalPrice=${this.data.originalPrice}&number=${this.data.number}&groupName=${this.data.groupName}`
        })
      }).catch(e => {
        this.setData({
          errorToast: true,
          toastInfo: e
        })
      });
    }
    
}
})
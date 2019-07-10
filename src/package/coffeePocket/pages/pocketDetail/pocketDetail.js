// var util = require('../../utils/util.js');
// var api = require('../../config/api.js');

var app = getApp();

import model from '../../utils/model.js'


Page({
  data: {
    cartGoods: [],
    couponDetail: {
      userVouchers: []
    }
  },
  onLoad: function (options) {

    let couponDetail = wx.getStorageSync('couponDetail');

    couponDetail.userVouchers.forEach(item => {
      item.startTime = item.startTime && item.startTime.split(' ')[0];
      item.endTime = item.endTime && item.endTime.split(' ')[0]
    });

    // couponDetail.userVouchers = couponDetail.userVouchers.concat(couponDetail.userVouchers);
    // couponDetail.userVouchers = couponDetail.userVouchers.concat(couponDetail.userVouchers);
    // couponDetail.userVouchers = couponDetail.userVouchers.concat(couponDetail.userVouchers);

    // debugger

    this.setData({
      couponDetail: couponDetail
    });
  },
  onReady: function () {
    // 页面渲染完成

  },
  onShow: function () {
    // 页面显示
    // this.getCartList();
  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  },

  showToast () {
    wx.showModal({
      title: '说明', //提示的标题,
      content: this.data.couponDetail.voucher.voucherBref, //提示的内容,
      showCancel: false, //是否显示取消按钮,
      cancelColor: '#000000', //取消按钮的文字颜色,
      confirmText: '我知道了', //确定按钮的文字，默认为取消，最多 4 个字符,
      confirmColor: '#f50000', //确定按钮的文字颜色,
      success: res => {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    });
  },





  goCart () {
    wx.navigateTo({ url: '/package/coffeePocket/pages/pocketCart/cart' });
  },
})
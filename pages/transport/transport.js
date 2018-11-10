// var util = require('../../../utils/util.js');
// var api = require('../../../config/api.js');
// const pay = require('../../../services/pay.js');
import {wx2promise, showErrorToast} from '../../utils/util';

var app = getApp();

Page({
  data: {
    searchSuggest: [{
      "num": "1",
      "keyword": "龙之梦购物公园",
      "direct": true,
      "shopId": 1860781,
      "distance": "1.1km",
      "shopUuid": "1860781",
      "displayinfo": "1.1km",
      "hasdeals": "0",
      "hasmopay": "0",
      "categoryname": "综合商场",
      "address": "长宁路1018号",
      "reviewCount": "13855条",
      "labels": [],
      "splitName": [{
        "text": "龙之梦",
        "isImportant": true
      }, {
        "text": "购物公园",
        "isImportant": false
      }],
      "shopPower": 45,
      "url": "/pages/detail/detail?shopUuid=1860781&from=search_banner",
      "eventtype": "direct_poi"
    }],
    showSelfGet: true,
    showExpress: false
  },
  onLoad: function (options) {

    this.setData({
      goodsTotalPrice: parseInt(options.price)
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

  goSelfGet () {
    this.setData({
      showSelfGet: true,
      showExpress: false
    })
  },

  goExpress() {
    this.setData({
      showExpress: true,
      showSelfGet: false
    })
  },

  goAddAddress () {
    wx.navigateTo({
      url: `/pages/my/address/address`
    });
  },

  getCheckoutInfo: function () {
    let that = this;

    wx.hideLoading();
    wx2promise(wx.request, {
            url: 'https://www.jasongan.cn/getAddressByOpenId',
            method: 'GET',
            // data:  'appid=1256596722&url=https://www.jasongan.cn/img/fengli.jpeg',
            data: {
                openid: wx.getStorageSync('openid')
            },
            header: {
                //设置参数内容类型为x-www-form-urlencoded
                'Content-Type': 'application/json',
                'Authorization': 'tdpeGHT2XVFmQOVci+vDhRFG6XZhPTEyNTY1OTY3MjImaz1BS0lEUmhpVUZ2b2FjUjFMUUZvQUc2a0FMSzdnejJwTFpZR2gmZT0xNTI5MTM2MTE1JnQ9MTUyOTA0OTcxNSZyPTM0Nzg0ODEwNzMmdT0wJmY9',
                'Host': 'recognition.image.myqcloud.com'
            },
        }).then(function (res) {
      if (res.data.code === 200) {
        console.log(res.data);
        that.setData({
          checkedGoodsList: wx.getStorageSync('chooseCartInfo'),
          checkedAddress: JSON.parse(res.data.resultLists[0].address),
          // actualPrice: res.data.actualPrice,
          // checkedCoupon: res.data.checkedCoupon,
          // couponList: res.data.couponList,
          // couponPrice: res.data.couponPrice,
          // freightPrice: res.data.freightPrice,
          // goodsTotalPrice: res.data.goodsTotalPrice,
          // orderTotalPrice: res.data.orderTotalPrice
        });
      }
    });
    // util.request(`https://www.jasongan.cn/getAddressByOpenId?openid=${wx.getStorageSync('openid')}`).then(function (res) {
    //   if (res.errno === 0) {
    //     console.log(res.data);
    //     that.setData({
    //       checkedGoodsList: res.data.checkedGoodsList,
    //       checkedAddress: res.data.checkedAddress,
    //       actualPrice: res.data.actualPrice,
    //       checkedCoupon: res.data.checkedCoupon,
    //       couponList: res.data.couponList,
    //       couponPrice: res.data.couponPrice,
    //       freightPrice: res.data.freightPrice,
    //       goodsTotalPrice: res.data.goodsTotalPrice,
    //       orderTotalPrice: res.data.orderTotalPrice
    //     });
    //   }
    //   wx.hideLoading();
    // });
  },
  onReady: function () {
    // 页面渲染完成

  },
  onShow: function () {
    // 页面显示
    wx.showLoading({
      title: '加载中...',
    })
    this.getCheckoutInfo();

  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  }
})
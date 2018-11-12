// var util = require('../../../utils/util.js');
// var api = require('../../../config/api.js');
// const pay = require('../../../services/pay.js');
import {wx2promise, showErrorToast} from '../../utils/util';

import model from '../../utils/model';

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
    showExpress: false, 
    from: ''
  },
  onLoad: function (options) {

    if (options.from === 'store') {
      this.setData({
        from: 'selfExtracting'
      })
    }

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
      showExpress: false,
      from: this.data.from === 'delivery' ? 'selfExtracting' : ''
    })
  },

  goExpress() {
    this.setData({
      showExpress: true,
      showSelfGet: false,
      from: this.data.from === 'selfExtracting' ? 'delivery' : ''
    })
  },

  goAddAddress () {
    wx.navigateTo({
      url: `/pages/my/address/address`
    });
  },

  goStore () {
    wx.navigateTo({
      url: `/pages/store/store?from=${this.data.from}`
    });
  },

  getCheckoutInfo: function () {
    let that = this;

    wx.hideLoading();

    model('home/lbs/getStoreListByLocation', {
      // lng: geo.lng,
      // lat: geo.lat,
      lng: 121.483821,
      lat: 31.265335,
      page: 1
    }).then(data => {
      let result = data.data;
      // result = result.concat(result);
      result.forEach(item => {
        item.distance = parseFloat(item.distance).toFixed(2);
      });
      this.setData({
        searchSuggest: result
      })
    })
    
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
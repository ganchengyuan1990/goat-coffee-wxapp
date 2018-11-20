// var util = require('../../../utils/util.js');
// var api = require('../../../config/api.js');
// const pay = require('../../../services/pay.js');
import {wx2promise, showErrorToast} from '../../utils/util';

import model from '../../utils/model';

var app = getApp();

Page({
  data: {
    searchSuggest: [],
    showSearchitem: {},
    showSelfGet: true,
    showExpress: false, 
    from: '',
    init: true,
    type: -1,
    isGeoAuth: true
  },
  onLoad: function (options) {

    if (options.from === 'store') {
      this.setData({
        from: 'selfExtracting',
        isGeoAuth: app.globalData.isGeoAuth
      })
    }

    this.setData({
      goodsTotalPrice: parseInt(options.price),
      type: parseInt(options.type),
      showExpress: parseInt(options.type) === 2,
      showSelfGet: parseInt(options.type) === 1
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
      init: false,
      from: this.data.from === 'delivery' ? 'selfExtracting' : ''
    })
    this.showShopList();
  },

  goExpress() {
    this.setData({
      showExpress: true,
      showSelfGet: false,
      init: false,
      from: this.data.from === 'selfExtracting' ? 'delivery' : ''
    })
    this.showExpressList();
  },

  showExpressList () {
    let addressList = wx.getStorageSync('addressList');
    this.setData({
      searchSuggest: addressList
    });
  },

  showShopList() {
    let addressList = wx.getStorageSync('shopList');
    this.setData({
      searchSuggest: addressList
    });
  },

  goAddAddress () {
    wx.navigateTo({
      url: `/pages/my/address/address`
    });
  },

  goStore (e) {
    var globalData = app.globalData;

    globalData.fromTransport = {
      type: this.data.chooseSelf ? 'selftaking' : 'deliver',
      detail: {
        detail: this.data.searchSuggest[parseInt(e.currentTarget.dataset.idx)]
      }
    }
    wx.switchTab({
      url: `/pages/store/store`
    });
    
  },

  getCheckoutInfo: function () {
    let that = this;

    if (this.data.type === 1) {
      if (this.data.init) {
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
          wx.setStorageSync('shopList', result);
          this.setData({
            searchSuggest: result
          })
        })
      }
    } else {
      this.showExpressList();
    }
  },
  onReady: function () {
    // 页面渲染完成

  },
  onShow: function () {
    // 页面显示
    // wx.showLoading({
    //   title: '加载中...',
    // })
    this.getCheckoutInfo();

  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  }
})
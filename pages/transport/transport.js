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
    isGeoAuth: true,
    fromCheckout: false
  },
  onLoad: function (options) {

    if (options.fromCheckout) {
      this.setData({
        fromCheckout: true
      });
    }

    if (options.from === 'store') {
      this.setData({
        from: options.tab === 'delivery' ? 'delivery' : 'selfExtracting',
        showSelfGet: options.tab !== 'delivery',
        showExpress: options.tab === 'delivery',
        isGeoAuth: app.globalData.isGeoAuth,
        type: options.tab === 'delivery' ? 2 : 1
      })
    } else {
      this.setData({
        goodsTotalPrice: parseInt(options.price),
        type: parseInt(options.type),
        showExpress: parseInt(options.type) === 2,
        showSelfGet: parseInt(options.type) === 1
      })
    }

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
    if (addressList) {
      this.setData({
        searchSuggest: addressList
      });
    } else {
      this.getAllShopList();
    }
    
  },

  goAddAddress () {
    if (wx.getStorageSync('token')) {
      wx.navigateTo({
        url: `/pages/my/address/address`
      });
    } else {
      wx.redirectTo({
        url: `/pages/login/login?fromTransport=1`
      });
    }
    
  },

  goStore (e) {
    var globalData = app.globalData;

    globalData.fromTransport = {
      type: this.data.showSelfGet ? 'selftaking' : 'deliver',
      detail: {
        detail: this.data.searchSuggest[parseInt(e.currentTarget.dataset.idx)]
      },
      idx: parseInt(e.currentTarget.dataset.idx)
    }
    wx.setStorageSync('fromTransport', this.data.showSelfGet ? 'selftaking' : 'deliver');
    if (this.data.fromCheckout && this.data.showSelfGet === false) {
      let pages = getCurrentPages();
      let prevPage = pages[pages.length - 2];
      console.log(pages)
      if (prevPage) {
        prevPage.setData({
          fromAddress: true,
          fromTransportIndex: parseInt(e.currentTarget.dataset.idx)
        });
      }
      wx.navigateBack({
        delta: 1 //返回的页面数，如果 delta 大于现有页面数，则返回到首页,
      });
    } else {
      wx.switchTab({
        url: `/pages/store/store`
      });
    }
    
    
  },

  getCheckoutInfo: function () {
    let that = this;

    if (this.data.type === 1) {
      if (this.data.init) {
        this.getAllShopList();
      } else {
        let addressList = wx.getStorageSync('shopList');
        if (addressList) {
          this.setData({
            searchSuggest: addressList
          });
        }
      }
    } else {
      model('my/address/list', {
        userId: wx.getStorageSync('token').user.id,
      }).then(data => {
        wx.setStorageSync('addressList', data.data);
        this.setData({
          searchSuggest: data.data
        });
      }).catch(e => {
        console.log(e);
      });
    }
  },

  getAllShopList () {
    model('home/lbs/get-store-list-by-location', {
      // lng: geo.lng,
      // lat: geo.lat,
      lng: 121.483821,
      lat: 31.265335,
      page: 1
    }).then(data => {
      let result = data.data;
      // result = result.concat(result);
      result.forEach(item => {
        item.distance = item.distance > 10 ? '>10' : item.distance;
      });
      wx.setStorageSync('shopList', result);
      this.setData({
        searchSuggest: result
      })
    })
  },

  goAddressList () {
    wx.navigateTo({
      url: '/pages/my/address_list/address_list'
    });
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
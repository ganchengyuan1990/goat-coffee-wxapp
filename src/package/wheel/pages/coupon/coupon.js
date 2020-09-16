import model from '../../utils/model'

import {
  mockData,
} from './mockData.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    couponItems: [],
    voucherItems: [],
    type: 1,
    showModal: false,
    page: 1,
    chosenType: 1,
    initLoading: true,
  },

  goNextPage(e) {
    // this.setData({
    //   page: 1
    // })
    const type = (e.currentTarget.dataset.type)
    const item = (e.currentTarget.dataset.item)
    if (type == 1) {
      wx.navigateTo({
        url: '/pages/my/coupon/coupon?type=2',
      });
    } else if (type == 2) {
      // wx.setStorageSync('lastPrizeAddressInfo', item.address_json);
      if (item.address_json) {
        getApp().globalData.lastPrizeAddressInfo = JSON.parse(item.address_json);
      } else {
        getApp().globalData.lastPrizeAddressInfo = null;
      }
      getApp().globalData.lastUserPrizeRecordId = item.id;
      wx.navigateTo({
        url: `/pages/my/address/index?id=${item.id}&noCache=1`,
      });
    } else {
      this.setData({
        showModal: true,
        actImage: item.prize.img
      })
      // wx.navigateToMiniProgram({
      //     appId: 'wx2c348cf579062e56',
      //     path: `/packages/restaurant_bak/restaurant/restaurant?poi_id=${this.data.meituanStoreId}&utm=7001`
      // })
    }
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let type = options.type
    this.setData({
      page:  1,
      type: parseInt(options.type),
      id: options.id
    });

    

    model('base/site/config-list').then(res => {
      wx.setStorageSync('configData', res.data['config-set']);
      this.setData({
          // existLuckActivity: false
          meituanStoreId: res.data['config-set']['meituan-store-id'],
      })
      wx.hideLoading();
      // this.judgeNewUser(res.data);
    }).catch(e => {
        wx.hideLoading();
    });
    
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  onReachBottom() {
    if (this.data.page * 10 < this.data.total) {
      wx.showLoading({
        title: '加载下一页数据中', //提示的内容,
        mask: true, //显示透明蒙层，防止触摸穿透,
        success: res => {}
      });
      this.setData({
        page: this.data.page + 1
      }, () => {
        this.fetchCouponList(2, this.data.page, true)
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      // couponItems: mockData,
      initLoading: true,
    })
    if (this.data.total && (this.data.page * 10 >= this.data.total)) {
      this.setData({
        initLoading: false,
        // couponItems: [],
        page: 1,
      }, () => {
        this.fetchCouponList(1, 1, false)
      })
    } else if (!this.data.total) {
      this.fetchCouponList(1, 1, false)
    }
    

  },


  getVeryMoney(money) {
    let result;
    if (money == parseInt(money)) {
      result = parseInt(money)
    } else {
      result = parseFloat(money).toFixed(1)
    }
    return result;
  },
  fetchCouponList(type, pageId, ifConcat) {
    model(`activity/luck-activity/my-prize?id=${this.data.id}&page=${pageId || 1}`, {
      userId: wx.getStorageSync('token').user.id,
      type: type
    }).then(data => {
      let result = data.data.user_prize_records;
      result.map(element => {
        element.prize_json = JSON.parse(element.prize_json || '{}');
        return element;
      });
      console.log(this.data.couponItems.concat(result), '@@@couponItems');
      this.setData({
        couponItems: ifConcat ? this.data.couponItems.concat(result) : result,
        total: data.data.total,
        initLoading: false,
      })
      wx.hideLoading();
    }).catch(e => {
      this.setData({
        initLoading: false,
      })
      wx.showToast({
        title: e,
        icon: 'none',
        duration: 3000,
      });
    })
  },

  goPrize() {
    wx.navigateTo({
      url: '/package/wheel/pages/index/index'
    });
  },

  goStore () {
    wx.switchTab({ url: '/pages/store/store' });
  },

  showRule(e) {
    let index = e.currentTarget.dataset.index;
    let couponItems = this.data.couponItems;
    couponItems[index].showRule = !couponItems[index].showRule;
    this.setData({
      couponItems: couponItems
    })
  }
})
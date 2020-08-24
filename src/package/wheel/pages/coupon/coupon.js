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
    loading: true,
    showModal: false,
    chosenType: 1
  },

  goNextPage(e) {
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
      }
      
      wx.navigateTo({
        url: `/pages/my/address/index?id=${item.id}`,
      });
    } else {
      this.setData({
        showModal: true,
        actImage: item.prize.img
      })
    }
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let type = options.type
    this.setData({
      page:  1,
      type: parseInt(options.type)
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
        this.fetchCouponList(2, this.data.page)
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      // couponItems: mockData,
      loading: false
    })
    this.fetchCouponList(1)

  },

  chooseTypeFirst(e) {
    this.setData({
      chosenType: 1
    })
    console.log(777)
    this.fetchCouponList(1)
  },

  chooseTypeSecond(e) {
    this.setData({
      chosenType: 2
    })
    console.log(777)
    this.fetchCouponList(2)
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
  fetchCouponList(type, pageId) {
    model(`activity/luck-activity/my-prize?id=118&page=${pageId || 1}`, {
      userId: wx.getStorageSync('token').user.id,
      type: type
    }).then(data => {
      let result = data.data.user_prize_records;
      result.map(element => {
        element.prize_json = JSON.parse(element.prize_json || '{}');
        return element;
      });
      this.setData({
        couponItems: this.data.couponItems.concat(result),
        total: data.data.total,
        loading: false
      })
      wx.hideLoading();
    }).catch(e => {
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
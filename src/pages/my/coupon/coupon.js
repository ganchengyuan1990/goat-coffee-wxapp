import model from '../../../utils/model'

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
    loading: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let type = options.type
    this.setData({
      type: parseInt(options.type)
    });
    if (type == 2) {
      // 优惠券
      this.fetchCouponList()
    } else {
      this.fetchVoucherList()
    }

    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      // couponItems: mockData,
      loading: false
    })

  },
  fetchCouponList() {
    model('my/coupon/list', {
      userId: wx.getStorageSync('token').user.id
    }).then(data => {
      let result = data.data.userCoupons;
      result.map(element => {
        if (element.coupon.discount || element.coupon.discount == 0) {
          element.coupon.discount = parseFloat(element.coupon.discount).toFixed(1);
        }
        if (element.coupon.manjian_cash) {
          element.coupon.manjian_cash = this.getVeryMoney(element.coupon.manjian_cash)
        }
        if (element.coupon.zhigou_cash) {
          element.coupon.zhigou_cash = this.getVeryMoney(element.coupon.zhigou_cash)
        }

        if (element.coupon.manjian_price_available) {
          element.coupon.manjian_price_available = this.getVeryMoney(element.coupon.manjian_price_available)
        }
        // element.couponBref = '21123123123';
        if (element.coupon.availabileStartTime) {
          element.coupon.availabileStartTime = element.coupon.availabileStartTime.split(' ')[0]
        }
        if (element.end_time) {
          element.end_time = element.end_time.split(' ')[0]
        }

        if (element.coupon.classifyNames && element.coupon.classifyNames.length > 0) {
          element.xianzhi = element.coupon.classifyNames[0]
        }

        if (element.coupon.goodsNames && element.coupon.goodsNames.length > 0) {
          element.xianzhi = element.coupon.goodsNames[0]
        }
        return element;
      });
      this.setData({
        couponItems: result,
        loading: false
      })
    })
  },
  fetchVoucherList() {
    // 兑换券
    model('my/voucher/list', {
      userId: wx.getStorageSync('token').user.id
    }).then(data => {
      let result = data.data;
      result.forEach(element => {
        if (element.voucher.discount) {
          element.voucher.discount = parseFloat(element.voucher.discount).toFixed(1);
        }
        if (element.voucher.saveAmount) {
          element.voucher.saveAmount = parseFloat(element.voucher.saveAmount).toFixed(1);
        }

        if (element.voucher.availabileStartTime) {
          element.voucher.availabileStartTime = element.voucher.availabileStartTime.split(' ')[0];
        }
        if (element.voucher.availabileEndTime) {
          element.voucher.availabileEndTime = element.voucher.availabileEndTime.split(' ')[0];
        }
        element.counpon = element.voucher;
      });
      this.setData({
        voucherItems: result,
        loading: false
      })
    })
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
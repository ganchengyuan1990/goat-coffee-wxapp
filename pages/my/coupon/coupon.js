import model from '../../../utils/model'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    couponItems: [],
    voucherItems: [],
    type: 1
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

  },
  fetchCouponList() {
    model('my/coupon/list', {
      userId: wx.getStorageSync('token').user.id
    }).then(data => {
      let result = data.data;
      result.forEach(element => {
        if (element.coupon.availabileStartTime) {
          element.coupon.availabileStartTime = element.coupon.availabileStartTime.split('.')[0]
        }
        if (element.coupon.availabileEndTime) {
          element.coupon.availabileEndTime = element.coupon.availabileEndTime.split('.')[0]
        }
      });
      this.setData({
        couponItems: data.data
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
        if (element.voucher.availabileStartTime) {
          element.voucher.availabileStartTime = element.voucher.availabileStartTime.split('.')[0];
        }
        if (element.voucher.availabileEndTime) {
          element.voucher.availabileEndTime = element.voucher.availabileEndTime.split('.')[0];
        }
        element.counpon = element.voucher;
      });
      this.setData({
        voucherItems: data.data
      })
    })
  }
})
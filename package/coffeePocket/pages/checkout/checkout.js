// var util = require('../../../utils/util.js');
// var api = require('../../../config/api.js');
// const pay = require('../../../services/pay.js');
import {wx2promise, showErrorToast} from '../../utils/util';

import model from '../../utils/model';

import {
  BigNumber
} from '../../utils/bignumber.min';



var app = getApp();

Page({
  data: {
    checkedGoodsList: [],
    checkedAddress: {
      name: 'Jason',
      phone: 17602183915,
      region: '是滴是滴所多',
      address: 'sdsdsdsd'
    },
    checkedCoupon: [],
    couponList: [],
    goodsTotalPrice: 0.00, //商品总价
    freightPrice: 0.00,    //快递费
    couponPrice: 0.00,     //优惠券的价格
    orderTotalPrice: 0.00,  //订单总价
    actualPrice: 0.00,     //实际需要支付的总价
    addressId: 0,
    couponId: 0,
    targetList: [],
    totalAmount: 0,
    totalCount: 0
  },

  onLoad: function (options) {

   let buyCouponLists = wx.getStorageSync('BuyCouponLists');

   this.setData({
     buyCouponLists: buyCouponLists
   })
   this.calcCartTotal(this.data.buyCouponLists);

  },

  calcCartTotal(cartGoods) {
    let totalAmount = 0;
    let totalCount = 0;
    let targetList = [];
    cartGoods.forEach(item => {
      if (!item.additional) {
        totalAmount += parseFloat(item.voucher_price) * item.num;
        targetList.push({
          voucherId: item.id,
          number: item.num
        });
      }
      totalCount += item.num;
    });
    console.log(totalAmount);
    this.setData({
      totalCount:  totalCount,
      totalAmount: parseFloat(totalAmount).toFixed(1),
      targetList: targetList
    })
  },


  onReady: function () {
    // 页面渲染完成

  },
  onShow: function () {
    // 页面显示

    // this.getCheckoutInfo();
    // if (this.data.goBackFromChildPage) {
    //   this.dealChildPageInfo() ;
    // } else if (this.data.fromAddress) {
    //   this.getAddressList();
    //   if (this.data.fromAddress) {
    //     this.chooseExpress(false);
    //   }
    // } else {
    //   this.getAddressList();
    // }

    // if (this.data.goBackFromRemark) {
    //   this.getRemark();
    // }

  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  },


  submit () {
    wx.showLoading({
      title: 'Loading...', //提示的内容,
      mask: true, //显示透明蒙层，防止触摸穿透,
      success: res => {}
    });

    // paramStr = 'storeId=29&userId=1&userAddressId=3&discountType=2&discountIds=1,2,3&deliverFee=6&payAmount=45&orderType=1&payType=1'
    model(`activity/voucher/start`, {
        activityId: wx.getStorageSync('voucherActivityId'),
        openId: wx.getStorageSync('openid'),
        list: JSON.stringify(this.data.targetList)
      }, 'POST').then(data => {
        wx.hideLoading();
        if (data.code === 'suc') {
          wx.setStorageSync('pocketOrder', data.data.order);
          wx.removeStorageSync('voucherActivityId');
          wx.removeStorageSync('BuyCouponLists');
          let payParamStr = '';
          let params = data.data;
          for (let key of Object.keys(params)) {
            if (key === 'package') {
              params[key] = params[key].split('=')[1];
            }
            if (key === 'order') {
              params[key] = params[key].id;
            }
            payParamStr += `${key}=${params[key]}&`;
          }
          payParamStr += `price=${this.data.actualPrice}`
          wx.navigateTo({
            url: `/package/coffeePocket/pages/normalPay/normalPay?${payParamStr}`
          });
          // wx.navigateTo({
          //   url: '/package/coffeePocket/pages/pocket/pocket'
          // });
        }
    }).catch(e => {
      if (e.errMsg && e.errMsg.indexOf('fail') > 0) {
        this.setData({
          errorToast: true,
          toastInfo: '暂无网络，请稍后重试'
        });
        setTimeout(() => {
          this.setData({
            errorToast: false
          });
        }, 1500);
      } else {
        this.setData({
          errorToast: true,
          toastInfo: e
        });
        setTimeout(() => {
          this.setData({
            errorToast: false
          });
        }, 1500);
      }
      wx.hideLoading({
        title: 'Loading...', //提示的内容,
        mask: true, //显示透明蒙层，防止触摸穿透,
      });
      // wx.navigateTo({
      //   url: `/pages/pay/pay_success/pay_success?price=${this.data.actualPrice}`
      // });
    })
  },
  submitOrder: function () {
    this.submit();
  }
})
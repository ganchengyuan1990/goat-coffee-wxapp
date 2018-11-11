// var util = require('../../../utils/util.js');
// var api = require('../../../config/api.js');
// const pay = require('../../../services/pay.js');
import {wx2promise, showErrorToast} from '../../../utils/util';

import model from '../../../utils/model';


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
    chooseSelf: true,
    chooseExpress: false,
    options: {},
    transportFee: 0,
    couponMoney: 0,
    errorToast: false,
    toastInfo: ''
  },
  onLoad: function (options) {

    this.dealOptions(options);

    this.getBestCouponByProduct();


    // this.setData({
    //   goodsTotalPrice: parseInt(options.price)
    // })

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

  getBestCouponByProduct () {

    let product = this.data.options.product;
    product.forEach(item => {
      item.pid = item.productId;
      item.skuid = item.skuId;
      item.num = item.number;
      // delete item.productId;
      // delete item.skuId;
      // delete item.number;
      // delete item.price;
      // delete item.skuName;
      // delete item.productName;
    });
    
    model(`home/coupon/getBestCouponByProduct`, {
      uid: 1,
      list: product
    }).then(data => {
      this.setData({
        couponMoney: data.data[0].discountPrice
      })

    })
  },

  dealOptions (items) {
    if (items.data) {
      let options = JSON.parse(decodeURIComponent(items.data));
      // let transportFee = 0;
      // options.product.forEach(item => {
      //   transportFee += item.transportFee;
      // })
      this.setData({
        options: options,
        actualPrice: options.deliverFee + options.payAmount
      });
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

  chooseSelf () {
    this.setData({
      chooseSelf: true,
      chooseExpress: false
    })
  },

  chooseExpress () {
    this.setData({
      chooseSelf: false,
      chooseExpress: true
    })
  },
  selectAddress() {
    wx.navigateTo({
      url: '/pages/address/address',
    })
  },

  goAddressList () {
    wx.navigateTo({
      url: '/pages/my/address_list/address_list',
    })
  },

  goCoupon () {
    wx.navigateTo({
      url: '/pages/promotion-list/promotion-list?type=1',
    })
  },

  goPromotion () {
    wx.navigateTo({
      url: '/pages/promotion-list/promotion-list?type=2',
    })
  },
  addAddress() {
    wx.navigateTo({
      url: '/pages/shopping/addressAdd/addressAdd',
    })
  },
  onReady: function () {
    // 页面渲染完成

  },
  onShow: function () {
    // 页面显示
    // wx.showLoading({
    //   title: '加载中...',
    // })
    // this.getCheckoutInfo();

  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  },
  submitOrder: function () {
    let param = {
      storeId: this.data.options.storeId,
      userAddressId: 3,
      userId: 1,
      discountType: 0,
      deliverFee: this.data.options.deliverFee,
      payAmount: this.data.options.payAmount,
      orderType: 1,
      payType: 1,
      // discountIds: '1,2,3'
    }
    let paramStr = '';
    let keys = Object.keys(param);
    keys.forEach((item, index) => {
      if (item === 'storeId') {
        param[item] = 29;
      }
      if (item === 'deliverFee') {
        param[item] = 6;
      }
      if (item === 'payAmount') {
        param[item] = 45;
      }
      if (index !== keys.length - 1) {
        paramStr += item + '=' + param[item] + '&';
      } else {
        paramStr += item + '=' + param[item];
      }
    })

    debugger

    // paramStr = 'storeId=29&userId=1&userAddressId=3&discountType=2&discountIds=1,2,3&deliverFee=6&payAmount=45&orderType=1&payType=1'
    model(`order/detail/submit?${paramStr}`, this.data.options.product, 'POST', {
      'authorization': 'Bearer ' + wx.getStorageSync('token').token,
      'Accept': 'application/json'
    }).then(data => {
        if (data.data.code === 'suc') {
          wx.navigateTo({
            url: `/pages/pay/pay_success/pay_success?price=${this.data.actualPrice}`
          });
        }
    }).catch(e => {
      // this.setData({
      //   errorToast: true,
      //   toastInfo: e
      // })
      wx.navigateTo({
        url: `/pages/pay/pay_success/pay_success?price=${this.data.actualPrice}`
      });
    })
    

}
})
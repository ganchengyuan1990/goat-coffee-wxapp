// var util = require('../../../utils/util.js');
// var api = require('../../../config/api.js');
// const pay = require('../../../services/pay.js');
import {wx2promise, showErrorToast} from '../../../utils/util';

import model from '../../../utils/model';

import {
  BigNumber
} from '../../../utils/bignumber.min';



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
    toastInfo: '',
    product: [],
    payAmount: 0,
    discountType: 1,
    couponUserRelation: '',
    checkedExpress: {},
    deliverFee: 0
  },
  onLoad: function (options) {

    this.dealOptions(options);

    this.getBestCouponByProduct();

    this.getAddressList();

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

  getAddressList () {
    model('my/address/list', {
      userId: 1,
      // openid: wx.getStorageSync('openid')
    }).then(data => {
      if (data.data) {
        let list = data.data;
        this.setData({
          checkedExpress: list[0]
        });
      }
    })
  },

  getBestCouponByProduct () {
    
    model(`home/coupon/getBestCouponByProduct`, {
      uid: 1,
      list: this.data.product
    }).then(data => {
      if (data.data) {
        let result = parseFloat(data.data[0].discountPrice).toFixed(2);
        let _a = new BigNumber(this.data.payAmount);
        let _b = new BigNumber(this.data.chooseSelf ? 0 : this.data.options.deliverFee);
        let actualPrice = _a.plus(_b).minus(result);
        let couponArr = data.data[0].solutionList;
        let couponUserRelation = ''
        
        couponArr.forEach(item => {
          couponUserRelation += item.userRelation + ','
        });
        this.setData({
          couponMoney: result,
          actualPrice: parseFloat(actualPrice),
          discountType: 1,
          couponUserRelation: couponUserRelation
        });
      } else {
        let _a = new BigNumber(this.data.payAmount);
        let _b = new BigNumber(this.data.chooseSelf ? 0 : this.data.options.deliverFee);
        let actualPrice = _a.plus(_b);
         this.setData({
           actualPrice: parseFloat(actualPrice),
           discountType: 0
         });
      }
    })
  },

  dealOptions (items) {
    if (items.data) {
      let options = JSON.parse(decodeURIComponent(items.data));
      // let transportFee = 0;
      // options.product.forEach(item => {
      //   transportFee += item.transportFee;
      // })

      let product = options.product;
      let payAmount = 0;
      product.forEach(item => {
        // item.pid = item.productId;
        // item.skuid = item.skuId;
        item.num = item.number;
        item.totalPrice = item.number * item.price;
        payAmount += item.totalPrice;
      });
      this.setData({
        options: options,
        product: product,
        payAmount: payAmount
      });
    }
    if (wx.getStorageSync('STORE_INFO')) {
      this.setData({
        checkedAddress: JSON.parse(wx.getStorageSync('STORE_INFO'))
      })
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
      chooseExpress: false,
      deliverFee: 0,
    })
    this.getBestCouponByProduct();
  },

  chooseExpress () {
    this.setData({
      chooseSelf: false,
      chooseExpress: true,
      deliverFee: this.data.options.deliverFee
    })
    this.getBestCouponByProduct();
  },
  selectAddress() {
    wx.navigateTo({
      url: '/pages/address/address',
    })
  },

  goAddressList () {
    wx.navigateTo({
      url: '/pages/transport/transport',
    })
  },

  goCoupon () {
    wx.navigateTo({
      url: `/pages/pay/promotion-list/promotion-list?type=1&products=${encodeURIComponent(JSON.stringify(this.data.options.product))}`,
    })
  },

  goPromotion () {
    wx.navigateTo({
      url: `/pages/pay/promotion-list/promotion-list?type=2&products=${encodeURIComponent(JSON.stringify(this.data.options.product))}`,
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
      openId: wx.getStorageSync('openid'),
      storeId: this.data.options.storeId,
      userAddressId: 3,
      userId: 1,
      discountType: this.data.discountType,
      deliverFee: this.data.deliverFee,
      payAmount: this.data.actualPrice,
      orderType: 1,
      payType: 1,
      discountIds: this.data.couponUserRelation.substr(0, this.data.couponUserRelation.length - 1)
      // discountIds: '1,2,3'
    }
    if (!param.discountIds) {
      delete param.discountIds;
    }
    let paramStr = '';
    let keys = Object.keys(param);
    keys.forEach((item, index) => {
      if (item === 'storeId') {
        param[item] = 29;
      }
      if (index !== keys.length - 1) {
        paramStr += item + '=' + param[item] + '&';
      } else {
        paramStr += item + '=' + param[item];
      }
    })

    let products = this.data.options.product;
    products.forEach(item => {
      delete item.num;
      delete item.skuName;
      delete item.totalPrice;
      delete item.productName;
      delete item.price;
    })

    // paramStr = 'storeId=29&userId=1&userAddressId=3&discountType=2&discountIds=1,2,3&deliverFee=6&payAmount=45&orderType=1&payType=1'
    model(`order/detail/submit?${paramStr}`, products, 'POST', {
      'authorization': 'Bearer ' + wx.getStorageSync('token').token,
      'Accept': 'application/json'
    }).then(data => {
        if (data.code === 'suc') {
          wx.removeStorageSync('CART_LIST');
          let payParamStr = '';
          let params = data.data;
          for (let key of Object.keys(params)) {
            payParamStr += `${key}=${params[key]}&`;
          }
          payParamStr += `price=${this.data.actualPrice}`
          wx.navigateTo({
            // url: `/pages/pay/pay_success/pay_success?price=${this.data.actualPrice}`
            url: `/pages/pay/normalPay/normalPay?${payParamStr}`
          });
        }
    }).catch(e => {
      this.setData({
        errorToast: true,
        toastInfo: e
      })
      // wx.navigateTo({
      //   url: `/pages/pay/pay_success/pay_success?price=${this.data.actualPrice}`
      // });
    })
    

}
})
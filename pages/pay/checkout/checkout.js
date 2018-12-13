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
    deliverFee: 0,
    couponList: [],
    voucherList: [],
    chosenCoupon: -1,
    chosenVoucher: -1,
    chooseType: -1,
    goBackFromChildPage: false,
    goBackFromRemark: false,
    fromAddress: false,
    chosenInfo: {},
    chooseNoCoupon: false,
    chooseNoVoucher: false,
    tab: '',
    remark: '',
    userAddressId: 0,
  },
  onLoad: function (options) {

    // options.tab = 'delivery';

    this.dealOptions(options);

    this.getBestCouponByProduct();

    this.getAddressList();

    this.getAvailableCoupon();

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
      userId: wx.getStorageSync('token').user.id,
      // openid: wx.getStorageSync('openid')
    }).then(data => {
      if (data.data) {
        let list = data.data;
        wx.setStorageSync('addressList', list);
        this.setData({
          checkedExpress: list[0] || {}
        });
      }
    })
  },

  getAvailableCoupon () {
    model(`home/coupon/getAvailableCoupon`, {
      uid: wx.getStorageSync('token').user.id,
      list: this.data.product
      // list: [{
      //   "productId": 28,
      //   "skuId": 121,
      //   "num": 1
      // }]
    }).then(data => {
      let a = new BigNumber(2048.8);
      let b = a.times(100);
      console.log(parseInt(b));
      console.log(2048.8 * 100);
      if (data.data) {
        let result = data.data;
        let couponList = result.filter(item => {
          return item.type === 1; 
        });
        let voucherList = result.filter(item => {
          return item.type === 2;
        });
        this.setData({
          couponList: couponList,
          voucherList: voucherList
        })
        
      } else {
        
      }
    })
  },

  getBestCouponByProduct () {
    
    model(`home/coupon/get-best-coupon-by-product`, {
      // uid: wx.getStorageSync('token').user.id,
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
        if (data.data[0].type === 1) {
          this.setData({
            chosenCoupon: couponArr[0].id
          })
        } else if (data.data[0].type === 2) {
          this.setData({
            chosenVoucher: couponArr[0].id
          })
        }
        this.setData({
          couponMoney: result,
          actualPrice: parseFloat(actualPrice),
          discountType: data.data[0].type,
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
        // delete item.skuName;
        // delete item.totalPrice;
        // delete item.productName;
        // delete item.price;
        // delete item.number;
        // delete item.productPropIds;
      });
      this.setData({
        options: options,
        product: product,
        payAmount: payAmount,
        tab: items.tab
      });
      if (this.data.tab === 'delivery') {
        this.chooseExpress();
      }
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
  // selectAddress() {
  //   wx.navigateTo({
  //     url: '/pages/address/address',
  //   })
  // },

  goAddressList () {
    wx.navigateTo({
      url: `/pages/transport/transport?type=${this.data.chooseSelf ? 1 : 2}`,
    })
  },

  goRemark () {
    wx.navigateTo({
      url: `/pages/pay/remark/remark?remark=${this.data.remark}`,
    })
  },

  goVoucher () {
    if (this.data.chosenInfo.id) {
      wx.navigateTo({
        url: `/pages/pay/promotion-list/promotion-list?type=2&chosenVoucher=${this.data.chosenInfo && this.data.chosenInfo.id}&list=${JSON.stringify(this.data.voucherList)}`,
      })
    } else {
      wx.navigateTo({
        url: `/pages/pay/promotion-list/promotion-list?type=2&chosenVoucher=${this.data.goBackFromChildPage ? '' : this.data.chosenVoucher}&list=${JSON.stringify(this.data.voucherList)}`,
      })
    }
    
  },

  goCoupon () {
    if (this.data.chosenInfo.id) {
      wx.navigateTo({
        url: `/pages/pay/promotion-list/promotion-list?type=2&chosenVoucher=${this.data.chosenInfo && this.data.chosenInfo.id}&list=${JSON.stringify(this.data.voucherList)}`,
      })
    } else {
      wx.navigateTo({
        url: `/pages/pay/promotion-list/promotion-list?type=1&chosenCoupon=${this.data.goBackFromChildPage ? '' : this.data.chosenCoupon}&list=${JSON.stringify(this.data.couponList)}`,
      })
    }
  },
  addAddress() {
    wx.navigateTo({
      url: '/pages/my/address/address',
    })
  },

  dealChildPageInfo () {
    let products = this.data.product;
    products.forEach(item => {
      delete item.skuName;
      delete item.totalPrice;
      delete item.productName;
      delete item.price;
      delete item.number;
      delete item.productPropIds;
    });
    if (!this.data.chosenInfo.id) {
      this.setData({
        chooseNoCoupon: true,
        chooseNoVoucher: true,
        discountType: 0,
      })
    } else {
      this.setData({
        chooseNoCoupon: false,
        chooseNoVoucher: false
      })
    }
    model(`home/coupon/calculatePriceWithCoupon`, {
      couponList: this.data.chosenInfo.id ? [this.data.chosenInfo] : [],
      productList: this.data.product,
      uid: wx.getStorageSync('token').user.id
    }).then(data => {
      let result = parseFloat(data.data[0].discountPrice).toFixed(2);
      this.setData({
        actualPrice: data.data[0].resultPrice + this.data.deliverFee,
        couponMoney: result,
        couponUserRelation: this.data.chosenInfo.relationId + ',',
        discountType: data.data[0].type,
      })
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
    // this.getCheckoutInfo();
    if (this.data.goBackFromChildPage) {
      this.dealChildPageInfo() ;
    } else if (this.data.fromAddress) {
      this.getAddressList();
    } else if (this.data.goBackFromRemark) {
      this.getRemark();
    }

  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  },

  getRemark () {
    this.setData({
      remark: wx.getStorageSync('remark')
    });
  },

  submit () {
    let userAddressId = this.data.options.userAddressId;
    if (!userAddressId) {
      if (wx.getStorageSync('addressList') && wx.getStorageSync('addressList')[0].id) {
        userAddressId = wx.getStorageSync('addressList')[0].id
      } else {
        userAddressId = 3;
      }
    }
    let param = {
      openId: wx.getStorageSync('openid'),
      storeId: this.data.options.storeId,
      userAddressId: userAddressId,
      userId: wx.getStorageSync('token').user.id,
      discountType: this.data.discountType,
      deliverFee: this.data.deliverFee,
      payAmount: this.data.actualPrice,
      orderType: 1,
      payType: 1,
      remark: this.data.remark,
      discountIds: this.data.couponUserRelation.substr(0, this.data.couponUserRelation.length - 1)
      // discountIds: '1,2,3'
    }
    // if (!this.data.options.userAddressId) {
    //   delete param.userAddressId;
    // }
    if (!param.discountIds) {
      delete param.discountIds;
    }
    let paramStr = '';
    let keys = Object.keys(param);
    keys.forEach((item, index) => {
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
        wx.removeStorageSync('remark');
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
  },
  submitOrder: function () {
    if (this.data.chooseSelf) {
      wx.showModal({
        // title: '提示', //提示的标题,
        content: `是否确认前往${this.data.checkedAddress.storeName}店自提？订单确认后将无法更改`, //提示的内容,
        showCancel: true, //是否显示取消按钮,
        cancelText: '取消', //取消按钮的文字，默认为取消，最多 4 个字符,
        cancelColor: '#000000', //取消按钮的文字颜色,
        confirmText: '确定', //确定按钮的文字，默认为取消，最多 4 个字符,
        confirmColor: '#3CC51F', //确定按钮的文字颜色,
        success: res => {
          if (res.confirm) {
            this.submit();
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      });
    } else {
      this.submit();
    }
}
})
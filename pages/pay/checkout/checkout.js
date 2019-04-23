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
    getTime: '',
    waitProcessTime: '',
    fromTransportIndex: -1,
    fromTransportId: -1,
    timeWords: '',
    type: 0,
    usePromotion: true,
    hasGetBestSolution: false,
    quanqianMoney: 0
  },

  switchChange (e) {
    this.setData({
      usePromotion: e.detail.value
    });
    if (!this.data.usePromotion) {
      model(`home/coupon/calculate-price-with-coupon`, {
        couponList: [],
        productList: this.data.product,
        storeId: this.data.options.storeId,
        uid: wx.getStorageSync('token').user.id
      }).then(data => {
        let result = parseFloat(data.data.discountPrice).toFixed(2);
        this.setData({
          actualPrice: parseFloat(data.data.resultPrice + parseFloat(this.data.deliverFee)).toFixed(2),
          couponMoney: result,
          couponUserRelation: '',
          discountType: data.data.type,
          chosenInfo: {},
          chooseNoCoupon: false,
          chooseNoVoucher: false,
        })
      });
    }  else {
      this.getBestCouponByProduct();
    }
  },
  onLoad: function (options) {

    // options.tab = 'delivery';

    wx.showLoading({
      title: 'Loading...', //提示的内容,
      mask: true, //显示透明蒙层，防止触摸穿透,
    });

    this.dealOptions(options);

    if (!this.data.hasGetBestSolution) {
      this.getBestCouponByProduct();
    }

    this.getAddressList();

    this.getAvailableCoupon();
    this.getWaitTime();
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

  calGetTime (waitTime) {
    let nowTime = Date.parse(new Date());
    waitTime = this.data.chooseSelf ? (waitTime + 5) : (waitTime + 15);
    let getTime = this.calcLeftTime(nowTime + waitTime * 60 * 1000);
    this.setData({
      getTime: getTime
    })
    console.log(getTime);
  },

  calcLeftTime(time) {
    var timeStr = parseFloat(time);
    var left = parseInt((timeStr % 864e5) / 1000);
    var hours = parseInt(left / 3600);
    var realHours = hours + 8;
    var minutes = parseInt((left - hours * 3600) / 60);
    var seconds = parseInt((left - hours * 3600 - minutes * 60));
    return `${realHours < 10 && realHours !== 8 ? ('0' + realHours) : (realHours)}:${minutes < 10 ? ('0' + minutes) : minutes}`;
  },

  getAddressList () {
    model('my/address/list', {
      userId: wx.getStorageSync('token').user.id,
      // openid: wx.getStorageSync('openid')
    }).then(data => {
      if (data.data) {
        let list = data.data;
        wx.setStorageSync('addressList', list);
        let checkedExpress = list[this.data.fromTransportIndex || 0]
        if (this.data.fromTransportId > 0) {
          let chosenAddressItem = list.filter(item => {
            return item.id === this.data.fromTransportId;
          });
          if (chosenAddressItem && chosenAddressItem[0]) {
            checkedExpress = chosenAddressItem[0];
          }
        }
        if (this.data.fromAddress) {
          checkedExpress = list[this.data.fromTransportIndex || 0]
        }
        this.setData({
          checkedExpress: checkedExpress || {}
        });
      }
    })
  },

  getAvailableCoupon () {
    model(`home/coupon/get-available-coupon`, {
      uid: wx.getStorageSync('token').user.id,
      storeId: this.data.options.storeId
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
      wx.hideLoading({
        title: 'Loading...', //提示的内容,
        mask: true, //显示透明蒙层，防止触摸穿透,
      });
    })
  },

  getBestCouponByProduct () {
    
    model(`home/coupon/get-best-coupon-by-product`, {
      uid: wx.getStorageSync('token').user.id,
      // uid: 1,
      storeId: this.data.options.storeId
    }).then(data => {
      if (data.data) {
        // let result = parseFloat(data.data.discountPrice).toFixed(2);
        let result = data.data.discountPrice;
        let _a = new BigNumber(this.data.payAmount);
        let _b = new BigNumber(this.data.chooseSelf ? 0 : this.data.options.deliverFee);
        let actualPrice = _a.plus(_b).minus(result);
        // let actualPrice = _a.plus(_b).minus(parseFloat(result));

        let couponArr = data.data.solutionList;
        let couponUserRelation = []
        
        couponArr.forEach(item => {
          couponUserRelation.push(item.userRelation);
        });
        couponUserRelation = couponUserRelation.join(',');
        if (data.data.type === 1) {
          this.setData({
            chooseNoVoucher: true,
            chosenCoupon: couponArr[0].id,
            chosenInfo: {
              content: [{
                id: couponArr[0].classId,
                relationId: couponArr[0].id,
                type: 1
              }],
              type: 1
            }
          })
        } else if (data.data.type === 2) {
          let contents = [];
          couponArr.forEach(item => {
            contents.push({
              id: item.classId,
              relationId: item.id,
              type: 2
            })
          });
          this.setData({
            chooseNoCoupon: true,
            // chosenVoucher: couponArr[0].id,
            chosenVoucher: couponUserRelation,
            chosenInfo: {
              content: contents,
              type: 2
            }
          })
        }
        this.setData({
          couponMoney: result,
          hasGetBestSolution: true,
          // actualPrice: parseFloat(actualPrice).toFixed(2),
          actualPrice: data.data.resultPrice.toFixed(2),
          discountType: data.data.type,
          couponUserRelation: couponUserRelation,
          quanqianMoney: data.data.resultPrice + data.data.discountPrice
        });
        if (this.data.quanqianMoney > 65) {
          this.setData({
            deliverFee: 0
          });
        }
      } else {
        let _a = new BigNumber(this.data.payAmount);
        let _b = new BigNumber(this.data.chooseSelf ? 0 : this.data.options.deliverFee);
        let actualPrice = _a.plus(_b);
         this.setData({
           // actualPrice: parseFloat(actualPrice),
          actualPrice: data.data.resultPrice.toFixed(2),
           discountType: 0
         });
      }
      this.dealChildPageInfo();
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
        wx.hideLoading();
      }
      let _a = new BigNumber(this.data.payAmount);
      let _b = new BigNumber(this.data.chooseSelf ? 0 : this.data.options.deliverFee);
      let actualPrice = _a.plus(_b);
      this.setData({
        actualPrice: parseFloat(actualPrice),
        discountType: 0
      });
    });
  },

  getWaitTime () {
    model(`home/lbs/get-wait-time`, {
      storeId: this.data.options.storeId,
    }).then(data => {
      let waitProcessTime = data.data.waitProcessTime;
      this.setData({
        waitProcessTime: waitProcessTime
      });
      this.calGetTime(waitProcessTime);
    })
  },

  dealOptions (items) {
    // debugger
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
        item.totalPrice = parseFloat(parseFloat(item.number * parseFloat(item.price).toFixed(2)).toFixed(2));
        payAmount += parseFloat(item.totalPrice);
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
        payAmount: payAmount.toFixed(1),
        tab: items.tab,
        fromTransportIndex: parseInt(items.fromTransportIndex),
        fromTransportId: parseInt(items.fromTransportId)
      });
      if (this.data.tab === 'delivery') {
        this.chooseExpress(false);
      } else {
        this.setData({
          timeWords: '立即取餐'
        });
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

  chooseSelf (notFirstLoad) {
    let STORE_INFO = JSON.parse(wx.getStorageSync('STORE_INFO'))
    this.setData({
      chooseSelf: true,
      chooseExpress: false,
      deliverFee: 0,
      timeWords: '立即取餐',
      // payAmount: !notFirstLoad ? parseFloat(this.data.payAmount).toFixed(1) : (parseFloat(this.data.payAmount) - parseFloat(this.data.deliverFee || this.data.options.deliverFee || STORE_INFO.deliverFee || 0)).toFixed(1)
      payAmount: !notFirstLoad ? parseFloat(this.data.payAmount).toFixed(1) : (parseFloat(this.data.payAmount) - parseFloat(this.data.deliverFee || 0)).toFixed(1)
    })
    // if (!notFirstLoad) {
    //   this.getBestCouponByProduct();
    // }
    this.getBestCouponByProduct();
    // this.dealChildPageInfo();
    // this.getWaitTime();
  },

  chooseExpress (notFirstLoad) {
    let STORE_INFO = JSON.parse(wx.getStorageSync('STORE_INFO'))
    if (this.data.payAmount > 65) {
      this.setData({
        deliverFee: 0
      })
    } else {
      this.setData({
        deliverFee: this.data.options.deliverFee || STORE_INFO.deliverFee || 0
      })
    }
    this.setData({
      chooseSelf: false,
      chooseExpress: true,
      timeWords: '立即配送',
      payAmount: !notFirstLoad ? parseFloat(this.data.payAmount) : (parseFloat(this.data.payAmount) + parseInt(this.data.deliverFee || 0)).toFixed(1)
      // payAmount: !notFirstLoad ? parseFloat(this.data.payAmount) : (parseFloat(this.data.payAmount) + parseInt(this.data.options.deliverFee || STORE_INFO.deliverFee || 0)).toFixed(1)
    });
    // if (!notFirstLoad) {
    //   this.getBestCouponByProduct();
    // }
    this.getBestCouponByProduct();

    // this.dealChildPageInfo();
    this.getWaitTime();
  },
  // selectAddress() {
  //   wx.navigateTo({
  //     url: '/pages/address/address',
  //   })
  // },

  goAddressList () {
    wx.navigateTo({
      url: `/pages/transport/transport?type=${this.data.chooseSelf ? 1 : 2}&fromCheckout=1`,
    })
  },

  goRemark () {
    wx.navigateTo({
      url: `/pages/pay/remark/remark?remark=${this.data.remark}`,
    })
  },

  goVoucher () {
    wx.setStorageSync('voucherList', this.data.voucherList)
    if (this.data.chosenInfo.type == 2) {
      wx.navigateTo({
        // url: `/pages/pay/promotion-list/promotion-list?type=2&chosenVoucher=${this.data.chosenInfo && this.data.chosenInfo.relationId}&list=${JSON.stringify(this.data.voucherList.length >=10 ? this.data.voucherList.slice(0,10) : this.data.voucherList)}`,
        url: `/pages/pay/promotion-list/promotion-list?type=2&chosenVoucher=${this.data.couponUserRelation}&list=${JSON.stringify(this.data.voucherList.length >=10 ? this.data.voucherList.slice(0,10) : this.data.voucherList)}`,
      })
    } else {
      wx.navigateTo({
        url: `/pages/pay/promotion-list/promotion-list?type=2&chosenVoucher=${this.data.goBackFromChildPage ? this.data.chosenInfo && this.data.chosenInfo.relationId : this.data.chosenVoucher}&list=${JSON.stringify(this.data.voucherList.length >=10 ? this.data.voucherList.slice(0,10) : this.data.voucherList)}`,
      })
    }
    
  },

  goCoupon () {
    wx.setStorageSync('couponList', this.data.couponList)
    wx.navigateTo({
      // url: `/pages/pay/promotion-list/promotion-list?type=1&chosenCoupon=${this.data.chosenInfo && this.data.chosenInfo.relationId}&list=${JSON.stringify(this.data.couponList)}`,
      url: `/pages/pay/promotion-list/promotion-list?type=1&chosenCoupon=${this.data.goBackFromChildPage ? this.data.chosenInfo && this.data.chosenInfo.content && this.data.chosenInfo.content[0].relationId : this.data.chosenCoupon}&list=${JSON.stringify(this.data.couponList.length >=10 ? this.data.couponList.slice(0,10) : this.data.couponList)}`,
    })
    // if (this.data.chosenInfo.type == 2) {
    //   wx.navigateTo({
    //     url: `/pages/pay/promotion-list/promotion-list?type=2&chosenVoucher=${this.data.chosenInfo && this.data.chosenInfo.relationId}&list=${JSON.stringify(this.data.couponList.length >=10 ? this.data.couponList.slice(0,10) : this.data.couponList)}`,
    //   })
    // } else {
    //   wx.navigateTo({
    //     // url: `/pages/pay/promotion-list/promotion-list?type=1&chosenCoupon=${this.data.chosenInfo && this.data.chosenInfo.relationId}&list=${JSON.stringify(this.data.couponList)}`,
    //     url: `/pages/pay/promotion-list/promotion-list?type=1&chosenCoupon=${this.data.goBackFromChildPage ? this.data.chosenInfo && this.data.chosenInfo.relationId : this.data.chosenCoupon}&list=${JSON.stringify(this.data.couponList.length >=10 ? this.data.couponList.slice(0,10) : this.data.couponList)}`,
    //   })
    // }
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
      // delete item.productPropIds;
    });
    if (!this.data.chosenInfo.type) {
      this.setData({
        chooseNoCoupon: true,
        chooseNoVoucher: true,
        discountType: 0,
      })
    } else {
      this.setData({
        chooseNoCoupon: this.data.chosenInfo.type === 2,
        chooseNoVoucher: this.data.chosenInfo.type === 1
      })
    }
    model(`home/coupon/calculate-price-with-coupon`, {
      couponList: this.data.chosenInfo.type ? this.data.chosenInfo.content : [],
      productList: this.data.product,
      storeId: this.data.options.storeId,
      uid: wx.getStorageSync('token').user.id
    }).then(data => {
      let result = parseFloat(data.data.discountPrice).toFixed(2);
      let couponUserRelation = [];
      this.data.chosenInfo.content && this.data.chosenInfo.content.length > 0 && this.data.chosenInfo.content.forEach(item => {
        couponUserRelation.push(item.relationId);
      });
      couponUserRelation = couponUserRelation.join(',')
      this.setData({
        actualPrice: parseFloat(data.data.resultPrice + parseFloat(this.data.deliverFee)).toFixed(2),
        couponMoney: result,
        couponUserRelation: couponUserRelation,
        discountType: data.data.type,
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
      if (this.data.fromAddress) {
        this.chooseExpress(false);
      }
    } else {
      this.getAddressList();
    }

    if (this.data.goBackFromRemark) {
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
    wx.showLoading({
      title: 'Loading...', //提示的内容,
      mask: true, //显示透明蒙层，防止触摸穿透,
      success: res => {}
    });
    let userAddressId = this.data.options.userAddressId || this.data.checkedExpress.id;
    if (this.data.chooseSelf) {
      userAddressId = null;
    }
    if (!userAddressId && this.data.chooseExpress) {
      if (wx.getStorageSync('addressList') && wx.getStorageSync('addressList')[0]  && wx.getStorageSync('addressList')[0].id) {
        userAddressId = wx.getStorageSync('addressList')[0].id
      } else {
        // userAddressId = 3;
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
      orderType: this.data.chooseSelf ? 3 : 1,
      payType: 1,
      remark: this.data.remark,
      discountIds: this.data.couponUserRelation
      // discountIds: '1,2,3'
    }
    // if (!this.data.options.userAddressId) {
    //   delete param.userAddressId;
    // }
    if (!param.discountIds || param.discountIds === 'undefined') {
      param.discountIds = '';
    }
    if (!param.userAddressId) {
      delete param.userAddressId;
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
      if (!item.number) {
        item.number = item.num;
      }
      delete item.num;
      delete item.skuName;
      delete item.totalPrice;
      delete item.productName;
      delete item.price;
    })

    // param.list = JSON.stringify(products);

    param.storeId = this.data.options.storeId

    // paramStr = 'storeId=29&userId=1&userAddressId=3&discountType=2&discountIds=1,2,3&deliverFee=6&payAmount=45&orderType=1&payType=1'
    model(`order/detail/submit`, param, 'POST').then(data => {
      wx.hideLoading();
      if (data.code === 'suc') {
        wx.removeStorageSync('remark');
        wx.removeStorageSync('CART_LIST');
        wx.removeStorageSync('remark');

        if (data.data.ifComplete) {
          wx.navigateTo({
            // url: `/pages/pay/pay_success/pay_success?price=${this.data.actualPrice}`
            url: `/pages/order/detail/detail?id=${data.data.order.id}&orderClassify=1`
          });
        } else {
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
            // url: `/pages/pay/pay_success/pay_success?price=${this.data.actualPrice}`
            url: `/pages/pay/normalPay/normalPay?${payParamStr}`
          });
        }
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

  showXieyi () {
    let content = `一、您在同意授权书前应完整、仔细地阅读本授权书您勾选同意将被视为完全理解并接受以下全部授权书条款。您在加油咖啡上勾选同意本支付授权书后，即成为本支付授权书之授权人，该授权即刻发生效力。您如果不同意以下授权书条款，请勿勾选同意，且不要迸行后续操作支付授权书授权人兹授权上海活力山羊餐饮管理有限公司(以下简称“乙方”)通过第三方支付平台划扣服务费。\n

        二、服务費是指授权人通过加油咖啡提交的订单上记载的。\n

        三、总费用、在授权人成功提交订单后，乙方依照加油咖啡上公布的收费规则计算服务费用。授权人应在5分钟内根据页面指示完成支付。\n

        四、如因授权人在第三方支付平台中的支付账户被锁定、无效、盗用、被往来银行拒绝等，以致支付账户请款失败时乙方有权依据与授权人之消费账单要求授权人支付服务费。\n

        五、授权人如有冒用他人支付账户之行为，须自负法律责任。\n

        六、在使用加油咖啡服务的过程中，如授权人未遵从相关规则，则乙方有权拒绝为授权人提供相关服务，且无需承担任何责任。因授权人的过错导致的任何损失由授权人承担，该等过错包括但不限于：不按照交易提示操作，未及时进行交易操作等。`
    wx.showModal({
      title: '咖啡支付协议', //提示的标题,
      content: content, //提示的内容,
      showCancel: false,
      confirmColor: '#f50000',
    });
    
  },
  submitOrder: function () {
    if (this.data.chooseSelf) {
      wx.showModal({
        // title: '提示', //提示的标题,
        content: `是否确认前往【${this.data.checkedAddress.storeName}】自提？订单确认后将无法更改`, //提示的内容,
        showCancel: true, //是否显示取消按钮,
        cancelText: '取消', //取消按钮的文字，默认为取消，最多 4 个字符,
        cancelColor: '#000000', //取消按钮的文字颜色,
        confirmText: '确定', //确定按钮的文字，默认为取消，最多 4 个字符,
        confirmColor: '#f50000', //确定按钮的文字颜色,
        success: res => {
          if (res.confirm) {
            this.submit();
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      });
    } else {
      if (this.data.checkedExpress.id) {
        if (parseFloat(this.data.actualPrice) > 0) {
          this.submit();
        } else {
          console.log(8888);
          wx.showModal({
            // title: '提示', //提示的标题,
            content: `请确认支付订单，订单确认后将无法修改。`, //提示的内容,
            showCancel: true, //是否显示取消按钮,
            cancelText: '取消', //取消按钮的文字，默认为取消，最多 4 个字符,
            cancelColor: '#000000', //取消按钮的文字颜色,
            confirmText: '确定', //确定按钮的文字，默认为取消，最多 4 个字符,
            confirmColor: '#f50000', //确定按钮的文字颜色,
            success: res => {
              if (res.confirm) {
                this.submit();
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          });
        }
        
      }
    }
}
})
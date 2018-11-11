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
    transportFee: 0
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
      delete item.productId;
      delete item.skuId;
      delete item.number;
      delete item.price;
      delete item.skuName;
      delete item.productName;
    });
    
    model(`home/coupon/getBestCouponByProduct`, {
      uid: 1,
      list: product
    }).then(data => {

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

  getCheckoutInfo: function () {
    let that = this;


    that.setData({
      checkedGoodsList: wx.getStorageSync('chooseCartInfo'),
      // checkedAddress: res.data.checkedAddress,
      // actualPrice: res.data.actualPrice,
      // checkedCoupon: res.data.checkedCoupon,
      // couponList: res.data.couponList,
      // couponPrice: res.data.couponPrice,
      // freightPrice: res.data.freightPrice,
      // goodsTotalPrice: res.data.goodsTotalPrice,
      // orderTotalPrice: res.data.orderTotalPrice
    });

    wx.hideLoading();
    wx2promise(wx.request, {
            url: 'https://www.jasongan.cn/getAddressByOpenId',
            method: 'GET',
            // data:  'appid=1256596722&url=https://www.jasongan.cn/img/fengli.jpeg',
            data: {
                openid: wx.getStorageSync('openid')
            },
            header: {
                //设置参数内容类型为x-www-form-urlencoded
                'Content-Type': 'application/json',
                'Authorization': 'tdpeGHT2XVFmQOVci+vDhRFG6XZhPTEyNTY1OTY3MjImaz1BS0lEUmhpVUZ2b2FjUjFMUUZvQUc2a0FMSzdnejJwTFpZR2gmZT0xNTI5MTM2MTE1JnQ9MTUyOTA0OTcxNSZyPTM0Nzg0ODEwNzMmdT0wJmY9',
                'Host': 'recognition.image.myqcloud.com'
            },
        }).then(function (res) {
      if (res.data.code === 200) {
        console.log(res.data);
        that.setData({
          checkedGoodsList: wx.getStorageSync('chooseCartInfo'),
          checkedAddress: JSON.parse(res.data.resultLists[0].address),
          // actualPrice: res.data.actualPrice,
          // checkedCoupon: res.data.checkedCoupon,
          // couponList: res.data.couponList,
          // couponPrice: res.data.couponPrice,
          // freightPrice: res.data.freightPrice,
          // goodsTotalPrice: res.data.goodsTotalPrice,
          // orderTotalPrice: res.data.orderTotalPrice
        });
        wx2promise(wx.request, {
            url: 'https://www.jasongan.cn/getTransportFee',
            method: 'GET',
            // data:  'appid=1256596722&url=https://www.jasongan.cn/img/fengli.jpeg',
            data: {
                weight: that.calcTotalWeight(),
                destionation: that.data.checkedAddress.region.split(',')[0]
            },
            header: {
                //设置参数内容类型为x-www-form-urlencoded
                'Content-Type': 'application/json',
                'Authorization': 'tdpeGHT2XVFmQOVci+vDhRFG6XZhPTEyNTY1OTY3MjImaz1BS0lEUmhpVUZ2b2FjUjFMUUZvQUc2a0FMSzdnejJwTFpZR2gmZT0xNTI5MTM2MTE1JnQ9MTUyOTA0OTcxNSZyPTM0Nzg0ODEwNzMmdT0wJmY9',
                'Host': 'recognition.image.myqcloud.com'
            },
        }).then(function (innerRes) {
            that.setData({
              goodsTotalPrice: that.data.goodsTotalPrice,
              freightPrice: innerRes.data.totalFee,
              actualPrice: that.data.goodsTotalPrice + innerRes.data.totalFee
            })
            wx.hideLoading();
        }); 
      }
    });
    // util.request(`https://www.jasongan.cn/getAddressByOpenId?openid=${wx.getStorageSync('openid')}`).then(function (res) {
    //   if (res.errno === 0) {
    //     console.log(res.data);
    //     that.setData({
    //       checkedGoodsList: res.data.checkedGoodsList,
    //       checkedAddress: res.data.checkedAddress,
    //       actualPrice: res.data.actualPrice,
    //       checkedCoupon: res.data.checkedCoupon,
    //       couponList: res.data.couponList,
    //       couponPrice: res.data.couponPrice,
    //       freightPrice: res.data.freightPrice,
    //       goodsTotalPrice: res.data.goodsTotalPrice,
    //       orderTotalPrice: res.data.orderTotalPrice
    //     });
    //   }
    //   wx.hideLoading();
    // });
  },
  selectAddress() {
    wx.navigateTo({
      url: '/pages/address/address',
    })
  },

  goCoupon () {
    wx.navigateTo({
      url: '/pages/promotion-list/promotion-list',
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
      discountType: 2,
      deliverFee: this.data.options.deliverFee,
      payAmount: this.data.options.payAmount,
      orderType: 1,
      payType: 1,
      discountIds: '1,2,3'
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

    // paramStr = 'storeId=29&userId=1&userAddressId=3&discountType=2&discountIds=1,2,3&deliverFee=6&payAmount=45&orderType=1&payType=1'
    model(`order/detail/submit?${paramStr}`, [{
          "skuId": 24,
          "productPropIds": "33",
          "productId": 12,
          "number": 1
        },
        {
          "skuId": 26,
          "productPropIds": "37",
          "productId": 13,
          "number": 1
        }
      ], 'POST', {
      'authorization': 'Bearer ' + wx.getStorageSync('token'),
      'Accept': 'application/json'
    }, 1).then(data => {
      
    })
    wx.navigateTo({
      url: '/pages/pay/pay_success/pay_success'
    });

}
})
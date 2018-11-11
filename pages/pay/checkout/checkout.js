// var util = require('../../../utils/util.js');
// var api = require('../../../config/api.js');
// const pay = require('../../../services/pay.js');
import {wx2promise, showErrorToast} from '../../../utils/util';

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
    options: {}
  },
  onLoad: function (options) {

    this.dealOptions(options);


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

  dealOptions (items) {
    if (items.data) {
      let options = JSON.parse(decodeURIComponent(items.data));
      this.setData({
        options: options
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
    wx.showLoading({
      title: '加载中...',
    })
    this.getCheckoutInfo();

  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  },
  submitOrder: function () {
    // if (this.data.checkedAddress.name) {
    //   showErrorToast('请选择收货地址');
    //   return false;
    // }
    let product = [];
    this.data.checkedGoodsList.forEach(element => {
      product.push({
        id: element.id,
        number: element.number
      })
    });
    wx.setStorageSync('martProduct', product);
    wx.redirectTo({
      url: `/pages/normalPay/normalPay?isMart=1&price=${this.data.actualPrice}&init=1`
    });
}
})
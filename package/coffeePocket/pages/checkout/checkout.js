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
    // console.log(totalAmount);
    this.setData({
      totalCount:  totalCount,
      totalAmount: parseFloat(totalAmount).toFixed(1),
      targetList: targetList
    })
  },

  showXieyi() {
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
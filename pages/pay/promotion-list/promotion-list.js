'use strict';
import model from '../../../utils/model';


Page({
  data: {
    array: [],
    // activedItems: [{
    //     title: 'ssds',
    //     subtitle: 'ssss',
    //     discountMoney: 50
    // }],
    couponItems: [],
    voucherItems: [{
      'tCoreCoupon': {
        'id': 48,
        'couponName': '八折',
        'couponType': 2,
        'couponIcon': 'http://bds-kafei.oss-cn-shanghai.aliyuncs.com/d29bbeaf6c774ce19ef13fc7db57a728.jpg',
        'couponBref': '描述',
        'discount': 8.00,
        'discountType': 0,
        'classifyId': '8',
        'ableSavePrice': '',
        'saveAmount': '',
        'couponTimeType': 2,
        'availabileStartTime': '2018-01-09T07:01:22.000+0000',
        'availabileEndTime': '',
        'duration': 13,
        'status': 1,
        'createTime': '2018-11-12 15:03:55',
        'updateTime': '2018-11-13 11:36:58'
      },
      'tCoreUserCoupon': {
        'id': 25,
        'userId': 1,
        'couponId': 48,
        'coupon': '',
        'state': 1,
        'createTime': '2018-11-12 15:04:22',
        'updateTime': '',
        'startTime': '',
        'endTime': ''
      },
      'tCoreVoucher': '',
      'tCoreUserVoucher': '',
      'type': 1
    }, {
      'tCoreCoupon': {
        'id': 48,
        'couponName': '八折',
        'couponType': 2,
        'couponIcon': 'http://bds-kafei.oss-cn-shanghai.aliyuncs.com/d29bbeaf6c774ce19ef13fc7db57a728.jpg',
        'couponBref': '描述',
        'discount': 8.00,
        'discountType': 0,
        'classifyId': '8',
        'ableSavePrice': '',
        'saveAmount': '',
        'couponTimeType': 2,
        'availabileStartTime': '2018-01-09T07:01:22.000+0000',
        'availabileEndTime': '',
        'duration': 13,
        'status': 1,
        'createTime': '2018-11-12 15:03:55',
        'updateTime': '2018-11-13 11:36:58'
      },
      'tCoreUserCoupon': {
        'id': 30,
        'userId': 1,
        'couponId': 48,
        'coupon': '',
        'state': 1,
        'createTime': '2018-11-14 18:31:05',
        'updateTime': '',
        'startTime': '',
        'endTime': ''
      },
      'tCoreVoucher': '',
      'tCoreUserVoucher': '',
      'type': 1
    }],
    unActivedItems: [],
    chosenInfo: {},
    canUseRedPacketMeanwhile: false,
    type: 1,
    products: [],
    chosenVoucher: -1,
    chosenCoupon: -1
  },
  onMyEvent: function (e) {
    // 选择一项就返回，并用setData把选中的那项以外的其他项checked设为空
    let idArray = e.detail.value;
    let newValue = idArray.splice(idArray.length - 1, 1);
    let chosenInfo = {};
    console.log(e.target.dataset.id);
    let target = '';
    if (this.data.type === 1) {
      target = 'couponItems';
    } else if (this.data.type === 2) {
      target = 'voucherItems';
    }
    this.data[target].forEach((element, index) => {
      if (index === parseInt(newValue[0])) {
        if (!element.checked) {
          let checkBool = target + '[' + index + '].checked';
          if (this.data.type === 2) {
            chosenInfo = {
              type: this.data.type,
              id: element.tCoreUserVoucher.voucherId,
              relationId: element.tCoreUserVoucher.id
            };
          } else {
            chosenInfo = {
              type: this.data.type,
              id: element.tCoreUserCoupon.couponId,
              relationId: element.tCoreUserCoupon.id
            };
          }
          this.setData({
            [checkBool]: true
          });
        } else {
          let checkBool = target + '[' + index + '].checked';
          this.setData({
            [checkBool]: false
          });
        }
      } else {
        let checkBool = target + '[' + index + '].checked';
        this.setData({
          [checkBool]: false
        });
      }
    });
    this.setData({
      chosenInfo: chosenInfo
    });
    this.backToOrderCreate();
  },

  backToOrderCreate() {
    // wx.setStorageSync('chosenPormotionId', this.data.chosenId)
    let pages = getCurrentPages();
    let currPage = pages[pages.length - 1]; //当前页面
    let prevPage = pages[pages.length - 2]; //上一个页面
    prevPage.setData({
      chosenInfo: this.data.chosenInfo,
      chooseType: this.data.type,
      // canUseDiscountAndRedPacket: this.data.canUseRedPacketMeanwhile,
      goBackFromChildPage: true
      // promotionSubtitle: this.data.array[this.data.chosenId].subtitle
    });
    wx.navigateBack({
      url: '../order-create/order-create'
    });
  },
  onLoad: function (option) {
    // let array = JSON.parse(option.array);
    let chosenId = option.chosenId;
    let activedItems = [];
    let unActivedItems = [];
    this.setData({
      type: parseInt(option.type),
    });
    if (this.data.type === 1) {
      let list = JSON.parse(option.list);
      list.forEach(item => {
        if (item.tCoreUserCoupon.id == option.chosenCoupon) {
          item.checked = true;
        } else {
          item.checked = false;
        }
      });
      this.setData({
        couponItems: list,
        chosenCoupon: parseInt(option.chosenCoupon)
      });
      // 优惠券
      // model('my/coupon/list', {
      //     userId: wx.getStorageSync('token').user.id
      // }).then(data => {
      //     let result = data.data;
      //     result.forEach(element => {
      //         element.coupon.availabileStartTime = element.coupon.availabileStartTime.split('.')[0]
      //         element.coupon.availabileEndTime = element.coupon.availabileEndTime.split('.')[0]
      //     });
      //     this.setData({
      //         couponItems: data.data
      //     })
      // })
    } else {
      let list = JSON.parse(option.list);
      list.forEach(item => {
        if (item.tCoreUserVoucher.id == option.chosenVoucher) {
          item.checked = true;
        } else {
          item.checked = false;
        }
      });
      this.setData({
        voucherItems: list,
        chosenVoucher: parseInt(option.chosenVoucher)
      });
      // 兑换券
      // model('my/voucher/list', {
      //     userId: 1
      // }).then(data => {
      //     let result = data.data;
      //     result.forEach(element => {
      //         element.voucher.availabileStartTime = element.voucher.availabileStartTime.split('.')[0];
      //         element.voucher.availabileEndTime = element.voucher.availabileEndTime.split('.')[0];
      //         element.counpon = element.voucher;
      //     });
      //     this.setData({
      //         voucherItems: data.data
      //     })
      // })
      // model('home/coupon/getAvailableCoupon', {
      //     uid: 1,
      //     list: this.data.products
      // }).then(data => {
      //     let result = data.data;
      //     // result.forEach(element => {
      //     //     element.voucher.availabileStartTime = element.voucher.availabileStartTime.split('.')[0];
      //     //     element.voucher.availabileEndTime = element.voucher.availabileEndTime.split('.')[0];
      //     //     element.counpon = element.voucher;
      //     // });
      //     this.setData({
      //         voucherItems: data.data
      //     })
      // })
    }
        
  }
});
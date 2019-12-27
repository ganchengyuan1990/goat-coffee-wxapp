// var QRCode = require('../../utils/weapp-qrcode.js')

// const QRCode = require('../../utils/qrcode-logo')

// import {wx2promise} from '../../utils/util';

import model from '../../../utils/model';

Page({
    data: {
        openid: '',
        appId: '',
        nonceStr: '',
        paySign: '',
        package: '',
        prepayId: '',
        signType: '',
        timeStamp: '',
        price: '',
        type: 'normal',
        orderId: '',
        fromRecharge: ''
    },
    onLoad: function (option) {

        model('base/site/user-config-list').then(res => {
            wx.setStorageSync('userConfigList', res.data)
        })
        let openid = wx.getStorageSync('openid');
        this.setData({
            orderId: option.order,
            varCode: option.varCode,
            appId: option.appId,
            nonceStr: option.nonceStr,
            paySign: option.paySign,
            prepayId: option.prepayId,
            package: option.package,
            signType: option.signType,
            timeStamp: option.timeStamp,
            price: option.price,
            type: option.type ? option.type : 'normal',
            fromRecharge: option.fromRecharge
        });

        this.payFunc(this);
  
    },



    payFunc(self) {
        wx.requestPayment({
            'timeStamp': this.data.timeStamp,
            'nonceStr': this.data.nonceStr,
            'package': `prepay_id=${this.data.package}`,
            'signType': this.data.signType,
            'paySign': this.data.paySign,
            'success': function (res) {
                wx.setStorageSync('showNoOrder', true);
                model('my/achievement/info', {}, 'POST').then(res => {
                    // debugger
                    let result = res.data;
                    let total;
                    let user_info = result.user_info;
                    if (user_info.member_recharge && user_info.member_gift_recharge) {
                        total = parseFloat(user_info.member_recharge) + parseFloat(user_info.member_gift_recharge);
                        result.member_total_recharge = (total == parseInt(total) ? parseInt(total) : parseFloat(total).toFixed(1))
                    } else if (user_info.member_recharge && !user_info.member_gift_recharge) {
                        total = parseFloat(user_info.member_recharge);
                        result.member_total_recharge = (total == parseInt(total) ? parseInt(total) : parseFloat(total).toFixed(1))
                    }

                    if (result.targetAchievementDesign) {
                        result.capsRate = (result.achievementCups / result.targetAchievementDesign.caps * 100);
                    }
                    wx.setStorageSync('memberData', result);
                });
                if (self.data.fromRecharge) {
                    // let pages = getCurrentPages();
                    // let prevPage = pages[pages.length - 2]; //上一个页面
                    // prevPage.setData({
                    //     paid: true
                    // });
                    // wx.navigateBack({
                    //   delta: 1 //返回的页面数，如果 delta 大于现有页面数，则返回到首页,
                    // });
                    wx.navigateTo({
                        url: `/pages/pay/pay_success/pay_success?from=recharge&orderId=${self.data.orderId}&varCode=${self.data.varCode}`
                    });
                } else {
                    wx.setStorageSync('showNoOrder', true);
                    // wx.navigateTo({
                    //     url: `/pages/order/detail/detail?id=${self.data.orderId}&orderClassify=1&showDialog=1`
                    // });
                    wx.navigateTo({
                        url: `/pages/pay/pay_success/pay_success?price=${self.data.price}&orderId=${self.data.orderId}&varCode=${self.data.varCode}`
                    });
                }
                
                // if (self.data.type === 'pin') {
                //     wx.redirectTo({
                //         url: `/pages/pin/pay_success/pay_success?price=${self.data.price}`
                //     });
                // } else {
                //     wx.redirectTo({
                //         url: `/pages/pay/pay_success/pay_success?price=${self.data.price}&orderId=${self.data.orderId}`
                //     });
                // }
            },
            'fail': function (res) {
                if (self.data.fromRecharge) {
                    let pages = getCurrentPages();
                    let prevPage = pages[pages.length - 2]; //上一个页面
                    prevPage.setData({
                        paid: false
                    });
                    wx.navigateBack({
                        delta: 1 //返回的页面数，如果 delta 大于现有页面数，则返回到首页,
                    });
                } else {
                     wx.redirectTo({
                         url: `/pages/order/detail/detail?id=${self.data.orderId}&orderClassify=1&showDialog=1`
                     });
                }
            },
            'complete': function (res) {

            }
        })
    }
})
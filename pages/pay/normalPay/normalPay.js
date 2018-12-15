// var QRCode = require('../../utils/weapp-qrcode.js')

// const QRCode = require('../../utils/qrcode-logo')

// import {wx2promise} from '../../utils/util';


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
        type: 'normal'
    },
    onLoad: function (option) {
        let openid = wx.getStorageSync('openid');
        this.setData({
            appId: option.appId,
            nonceStr: option.nonceStr,
            paySign: option.paySign,
            prepayId: option.prepayId,
            package: option.package,
            signType: option.signType,
            timeStamp: option.timeStamp,
            price: option.price,
            type: option.type ? option.type : 'normal'
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
                if (self.data.type === 'pin') {
                    wx.redirectTo({
                        url: `/pages/pin/pay_success/pay_success?price=${self.data.price}`
                    });
                } else {
                    wx.redirectTo({
                        url: `/pages/pay/pay_success/pay_success?price=${self.data.price}`
                    });
                }
            },
            'fail': function (res) {
                debugger
                if (res.errMsg.indexOf('cancel') > 0) {
                    wx.navigateBack({
                        delta: 1 //返回的页面数，如果 delta 大于现有页面数，则返回到首页,
                    });
                }
            },
            'complete': function (res) {

            }
        })
    }
})
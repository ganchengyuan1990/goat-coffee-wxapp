// var QRCode = require('../../utils/weapp-qrcode.js')

// const QRCode = require('../../utils/qrcode-logo')

// import {wx2promise} from '../../utils/util';


Page({
    data: {
        openid: '',
        status: '',
        price: 0,
        prepay_id: '',
        orderType: 0,
        isMart: 0
    },
    onLoad: function (option) {
        this.createPoiOrder(this);

    },



    createPoiOrder(self) {
        var prepay_id = ''; //这边填写prepay_id
        var paySign = ''; //这边填写支付签名
        
        wx.requestPayment({
            'timeStamp': timeStamp,
            'nonceStr': '5K8264ILTKCH16CQ2502SI8ZNMTM67VS',
            'package': `prepay_id=${prepay_id}`,
            'signType': 'MD5',
            'paySign': paySign,
            'success': function (res) {
                console.log('success');
            },
            'fail': function (res) {
                console.log('fail');
            },
            'complete': function (res) {

            }
        })
    }
})
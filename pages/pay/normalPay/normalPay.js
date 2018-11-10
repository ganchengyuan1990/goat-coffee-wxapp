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
        let openid = wx.getStorageSync('openid');
        this.setData({
            lesson_id: option.lesson_id || '',
            tool_id: option.tool_id || '',
            groupMember: parseInt(option.groupMember),
            openid: openid,
            status: option.status,
            price: option.price,
            init: option.init,
            pinOrderId: option.pinOrderId,
            timeliness: option.timeLimit,
            orderType: option.lesson_id ? 1 : 2,
            isMart: parseInt(option.isMart)
        });
        if (option.qrcode) {
            this.setData({
                hasQrcode: true
            });
        }
        let self = this;

        this.createPoiOrder(this);
  
    },



    createPoiOrder(self) {
        wx.request({
            url: `https://www.jasongan.cn/createOrder?init=1&price=${self.data.price}&id=${self.data.pinOrderId}&openid=${self.data.openid}&timeliness=${self.data.timeliness > 0 ? self.data.timeliness : 1000}&qrcode=${self.data.qrcodeUrl}`, //开发者服务器接口地址",
            method: 'GET',
            dataType: 'json', //如果设为json，会尝试对返回的数据做一次 JSON.parse
            success: res => {
                let prepay_id = res.data.prepay_id;
                let paySign = res.data.paySign;
                let timeStamp = res.data.timeStamp.toString();
                let out_trade_no = res.data.out_trade_no;
                self.setData({
                    prepay_id: prepay_id
                });
                wx.setStorageSync('prepay_id', prepay_id);
                // prepay_id = prepay_id.replace('<![CDATA[', '');
                // prepay_id = prepay_id.replace(']]>', '');
                wx.requestPayment({
                    'timeStamp': timeStamp,
                    'nonceStr': '5K8264ILTKCH16CQ2502SI8ZNMTM67VS',
                    'package': `prepay_id=${prepay_id}`,
                    'signType': 'MD5',
                    'paySign': paySign,
                    'success': function (res) {
                        wx2promise(wx.request, {
                            url: 'https://www.jasongan.cn/updateOutTradeNo',
                            method: 'GET',
                            data: {
                                out_trade_no: out_trade_no,
                                id: pinOrderId
                            },
                            header: {
                                'content-type': 'application/x-www-form-urlencoded',
                                'Accept': 'application/json'
                            }
                        }).then(res => {
                            console.log(res);
                        });
                        wx2promise(wx.request, {
                            url: 'https://www.jasongan.cn/updatePinOrderPayStatus',
                            method: 'GET',
                            data: {
                                id: pinOrderId,
                                ownerPay: true
                            },
                            header: {
                                'content-type': 'application/x-www-form-urlencoded',
                                'Accept': 'application/json'
                            }
                        }).then(res => {
                            wx.redirectTo({
                                url: '/pages/own_pin_list/own_pin_list'
                            });
                        });
                        // if (self.data.hasQrcode) {
                        //     let pages = getCurrentPages();
                        //     let prevPage = pages[pages.length - 2];
                        //     prevPage.setData({
                        //         paid: true,
                        //         fromPay: true
                        //     });
                        //     wx.navigateBack({
                        //         delta: 1 //返回的页面数，如果 delta 大于现有页面数，则返回到首页,
                        //     });
                        // } else {
                        //     wx.redirectTo({
                        //         url: `/pages/pin/pin?lessonId=${self.data.lesson_id}&owner=${self.data.openid}&qrcode=${self.data.qrcodeUrl}&pinOrderId=${self.data.pinOrderId}&groupMember=${self.data.groupMember}`
                        //     })
                        // }
                    },
                    'fail': function (res) {
                        if (res.errMsg.indexOf('cancel') > 0) {
                            wx.navigateTo({
                                url: '/pages/index/index'
                            });
                        } else {
                            wx.navigateBack({
                                delta: 1 //返回的页面数，如果 delta 大于现有页面数，则返回到首页,
                            });
                        }
                    },
                    'complete': function (res) {

                    }
                })
            },
            fail: () => {},
            complete: () => {}
        });
    }
})
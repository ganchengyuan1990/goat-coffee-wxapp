// var QRCode = require('../../utils/weapp-qrcode.js')

Page({
    data: {
        lesson: '',
        lesson_id: 0,
        qrcodeUrl: '',
        hasQrcode: false,
        groupMember: 0,
        openid: '',
        status: '',
        price: 2,
        prepay_id: '',
        init: 0,
        pinOrderId: '',
        timeliness: '',
        orderType: 0
    },
    onLoad: function (option) {
        wx.showLoading({
          title: 'Loading...', //提示的内容,
          mask: true, //显示透明蒙层，防止触摸穿透,
          success: res => {}
        });
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
            orderType: option.lesson_id ? 1 : 2
        });
        

        wx.request({
            url: `https://www.jasongan.cn/createOrder?price=${this.data.price}&id=${this.data.pinOrderId}&openid=${openid}&timeliness=${this.data.timeliness > 0 ? this.data.timeliness : 1000}`, //开发者服务器接口地址",
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
                wx.hideLoading();
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
                            url: 'https://www.jasongan.cn/updatePinOrderPayStatusMember',
                            method: 'GET',
                            data: {
                                id: self.data.pinOrderId,
                                member: self.data.openid,
                                formId: self.data.prepay_id,
                                status: 'yes'
                            },
                            header: {
                                'content-type': 'application/x-www-form-urlencoded',
                                'Accept': 'application/json'
                            }
                        }).then(res => {
                            console.log(res);
                        });
                        // wx2promise(wx.request, {
                        //     url: 'https://www.jasongan.cn/updateOutTradeNo',
                        //     method: 'GET',
                        //     data: {
                        //         out_trade_no: out_trade_no,
                        //         id: self.data.pinOrderId
                        //     },
                        //     header: {
                        //         'content-type': 'application/x-www-form-urlencoded',
                        //         'Accept': 'application/json'
                        //     }
                        // }).then(res => {
                        //     console.log(res);
                        // });
                        // if (self.data.hasQrcode) {
                        //     let pages = getCurrentPages();
                        //     let prevPage = pages[pages.length - 2];
                        //     prevPage.setData({
                        //         paid: true,
                        //         fromPay: true
                        //     });
                        //     wx.redirectTo({
                        //         url: '/pages/own_pin_list/own_pin_list'
                        //     });
                        // } else {
                        //     // self.uploadQrcode();
                        // }
                    },
                    'fail': function (res) {
                        // wx2promise(wx.request, {
                        //     url: 'https://www.jasongan.cn/updateNeedToPayPrice',
                        //     method: 'GET',
                        //     data: {
                        //         id: self.data.pinOrderId,
                        //         price: self.data.price
                        //     },
                        //     header: {
                        //         'content-type': 'application/x-www-form-urlencoded',
                        //         'Accept': 'application/json'
                        //     }
                        // });
                        // wx.navigateBack({
                        //     delta: 1 //返回的页面数，如果 delta 大于现有页面数，则返回到首页,
                        // });
                        wx.redirectTo({
                            url: '/pages/own_pin_list/own_pin_list'
                        });
                    },
                    'complete': function (res) {

                    }
                })
            },
            fail: () => {},
            complete: () => {}
        });
  
    },

    drawQR(pinOrderId) {
        const rpx = wx.getSystemInfoSync().windowWidth / 750
        let path = `https://www.jasongan.cn/qrcode/index.html?id=${pinOrderId}`

        return new Promise(resolve => {
            QRCode.qrApi.draw(
                path,
                'qrcode',
                300 * rpx,
                300 * rpx,
                null,
                '../../money.png'
            )
            resolve()
        })
    },

    updateOrder(option) {
        let self = this;
        wx.request({
            url: `https://www.jasongan.cn/createOrder?&update=1&price=${option.price}&id=${option.order_id}&openid=${self.data.openid}&timeliness=${self.data.timeliness > 0 ? self.data.timeliness : 1000}&qrcode=${self.data.qrcodeUrl}`, //开发者服务器接口地址",
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
                wx.hideLoading();
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
                                id: option.order_id,
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
                                id: option.order_id,
                                ownerPay: true
                            },
                            header: {
                                'content-type': 'application/x-www-form-urlencoded',
                                'Accept': 'application/json'
                            }
                        }).then(res => {
                            wx.redirectTo({ url: '/pages/own_pin_list/own_pin_list' });
                        });
                        // wx.redirectTo({
                        //     url: `/pages/pin/pin?lessonId=${self.data.lesson_id}&owner=${self.data.openid}&qrcode=${self.data.qrcodeUrl}&pinOrderId=${self.data.pinOrderId}&groupMember=${self.data.groupMember}`
                        // })
                    },
                    'fail': function (res) {
                        if (res.errMsg.indexOf('cancel') > 0) {
                            wx.redirectTo({ url: '/pages/own_pin_list/own_pin_list' });
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
        
    },

    createPoiOrder(self) {
        let data = {};
        let targetUrl = 'addPinOrder'
        if (self.data.orderType === 1) {
            data = {
                lesson_id: self.data.lesson_id,
                owner: wx.getStorageSync('openid'),
                deadline: '2018-09-10',
                qrcode: self.data.qrcodeUrl,
                needAmount: self.data.groupMember,
                owner_avatar: wx.getStorageSync('personal_info').avatarUrl,
                owner_name: wx.getStorageSync('personal_info').user_name,
                pay_status: 'no',
                orderType: 1,
            }
        } else {
            data = {
                tool_id: self.data.tool_id,
                owner: wx.getStorageSync('openid'),
                deadline: '2018-09-10',
                qrcode: self.data.qrcodeUrl,
                needAmount: self.data.groupMember,
                owner_avatar: wx.getStorageSync('personal_info').avatarUrl,
                owner_name: wx.getStorageSync('personal_info').user_name,
                pay_status: 'no',
                orderType: 2
            }
            targetUrl = 'addToolPinOrder';
        }
        wx.request({
            url: `https://www.jasongan.cn/${targetUrl}`,
            data: data,
            header: {
                //设置参数内容类型为x-www-form-urlencoded
                'content-type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            },
            success: function (res) {
                let pinOrderId = res.data.resultLists.insertId;
                self.setData({
                    pinOrderId: pinOrderId
                })
                if (res.data.code == 200) {
                    self.uploadQrcode(pinOrderId);
                    // wx.redirectTo({
                    //     url: `/pages/pin/pin?lessonId=${self.data.lesson_id}&owner=${self.data.openid}&qrcode=${self.data.qrcodeUrl}&pinOrderId=${pinOrderId}&groupMember=${self.data.groupMember}`
                    // })
                }
            }
        });
    },

    uploadQrcode(pinOrderId) {
        console.log(pinOrderId);
        let self = this;
        this.drawQR(pinOrderId).then(() => {
            setTimeout(() => {
                wx.canvasToTempFilePath({
                    canvasId: 'qrcode',
                    success: function(res) {
                        if (res.tempFilePath) {
                            console.log(res.tempFilePath);
                            wx.uploadFile({
                                url: 'https://www.jasongan.cn/upload/profile', //仅为示例，非真实的接口地址
                                filePath: res.tempFilePath,
                                name: 'file',
                                success: function (canvasRes) {
                                    var data = JSON.parse(canvasRes.data)
                                    self.setData({
                                        qrcodeUrl: data.file.url
                                    });
                                    console.log(data);
                                    // self.createPoiOrder(self);
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
                                                        wx.navigateBack({
                                                            delta: 1 //返回的页面数，如果 delta 大于现有页面数，则返回到首页,
                                                        });
                                                        // wx.redirectTo({ url: '/pages/own_pin_list/own_pin_list' });
                                                    });
                                                    if (self.data.hasQrcode) {
                                                        let pages = getCurrentPages();
                                                        let prevPage = pages[pages.length - 2];
                                                        prevPage.setData({
                                                            paid: true,
                                                            fromPay: true
                                                        });
                                                        wx.navigateBack({
                                                            delta: 1 //返回的页面数，如果 delta 大于现有页面数，则返回到首页,
                                                        });
                                                    } else {
                                                        wx.redirectTo({
                                                            url: `/pages/pin/pin?lessonId=${self.data.lesson_id}&owner=${self.data.openid}&qrcode=${self.data.qrcodeUrl}&pinOrderId=${self.data.pinOrderId}&groupMember=${self.data.groupMember}`
                                                        })
                                                    }
                                                },
                                                'fail': function (res) {
                                                    wx2promise(wx.request, {
                                                        url: 'https://www.jasongan.cn/updateNeedToPayPrice',
                                                        method: 'GET',
                                                        data: {
                                                            id: pinOrderId,
                                                            price: self.data.price
                                                        },
                                                        header: {
                                                            'content-type': 'application/x-www-form-urlencoded',
                                                            'Accept': 'application/json'
                                                        }
                                                    });
                                                    if (res.errMsg.indexOf('cancel') > 0) {
                                                        wx.navigateTo({ url: '/pages/own_pin_list/own_pin_list' });
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
                        }
                    },
                    fail: function(err) {
                        // console.log('card page => save qrcode error: ', err)
                        // owl.error.addError('card page => save qrcode error: ', err)
                        // that.drawCard(data.userInfo)
                    }
                })
            }, 300)
        });
        // var qrcode = new QRCode('qrcode', {
        //     text: `https://www.jasongan.cn/qrcode/index.html?id=${pinOrderId}`,
        //     width: 150,
        //     height: 150,
        //     colorDark: "#000000",
        //     colorLight: "#ffffff",
        //     correctLevel: QRCode.CorrectLevel.H,
        // });
        // qrcode.exportImage((res) => {
            
        // })
        // wx.canvasToTempFilePath({
        //     x: 0,
        //     y: 0,
        //     width: 150,
        //     height: 150,
        //     destWidth: 150,
        //     destHeight: 150,
        //     canvasId: 'qrcode',
        //     success: function (res) {
        //         console.log(res);
        //         wx.uploadFile({
        //             url: 'https://www.jasongan.cn/upload/profile', //仅为示例，非真实的接口地址
        //             filePath: res.tempFilePath,
        //             name: 'file',
        //             success: function (canvasRes) {
        //                 var data = JSON.parse(canvasRes.data)
        //                 self.setData({
        //                     qrcodeUrl: data.file.url
        //                 });
        //                 console.log(data);
        //                 // self.createPoiOrder(self);
        //                 wx.request({
        //                     url: `https://www.jasongan.cn/createOrder?price=${self.data.price}&id=${self.data.pinOrderId}&openid=${self.data.openid}&qrcode=${self.data.qrcodeUrl}`, //开发者服务器接口地址",
        //                     method: 'GET',
        //                     dataType: 'json', //如果设为json，会尝试对返回的数据做一次 JSON.parse
        //                     success: res => {
        //                         let prepay_id = res.data.prepay_id;
        //                         let paySign = res.data.paySign;
        //                         let timeStamp = res.data.timeStamp.toString();
        //                         self.setData({
        //                             prepay_id: prepay_id
        //                         });
        //                         wx.setStorageSync('prepay_id', prepay_id);
        //                         // prepay_id = prepay_id.replace('<![CDATA[', '');
        //                         // prepay_id = prepay_id.replace(']]>', '');
        //                         wx.requestPayment({
        //                             'timeStamp': timeStamp,
        //                             'nonceStr': '5K8264ILTKCH16CQ2502SI8ZNMTM67VS',
        //                             'package': `prepay_id=${prepay_id}`,
        //                             'signType': 'MD5',
        //                             'paySign': paySign,
        //                             'success': function (res) {
        //                                 if (self.data.hasQrcode) {
        //                                     let pages = getCurrentPages();
        //                                     let prevPage = pages[pages.length - 2];
        //                                     prevPage.setData({
        //                                         paid: true,
        //                                         fromPay: true
        //                                     });
        //                                     wx.navigateBack({
        //                                     delta: 1 //返回的页面数，如果 delta 大于现有页面数，则返回到首页,
        //                                     });
        //                                 } else {
        //                                     wx.redirectTo({
        //                                         url: `/pages/pin/pin?lessonId=${self.data.lesson_id}&owner=${self.data.openid}&qrcode=${self.data.qrcodeUrl}&pinOrderId=${self.data.pinOrderId}&groupMember=${self.data.groupMember}`
        //                                     })
        //                                 }
        //                             },
        //                             'fail': function (res) {
        //                                 wx.navigateBack({
        //                                     delta: 1 //返回的页面数，如果 delta 大于现有页面数，则返回到首页,
        //                                 });
        //                             },
        //                             'complete': function (res) {

        //                             }
        //                         })
        //                     },
        //                     fail: () => {},
        //                     complete: () => {}
        //                 });
        //             }
        //         })
        //     },
        //     fail: function (res) {
        //         console.log(res)
        //     }
        // })
    },
})
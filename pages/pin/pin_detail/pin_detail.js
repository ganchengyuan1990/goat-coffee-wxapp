// var QRCode = require('../../utils/weapp-qrcode.js');
import {
    calcLeftTime
} from '../../../utils/util';

import model from '../../../utils/model';

// import renderer from '../../../utils/quilljs-renderer/index';

// var Document = renderer.Document;

// // Load the built-in HTML formatter
// renderer.loadFormat('html');

// // Create a document instance
// var doc = new Document([{
//         insert: 'Hello, World!',
//         attributes: {
//             bold: true
//         }
//     },
//     {
//         insert: '\n',
//         attributes: {
//             align: 'right'
//         }
//     },
//     {
//         insert: 'This is a demo of the Quilljs Renderer'
//     },
//     {
//         insert: '\n',
//         attributes: {
//             align: 'left'
//         }
//     },
//     {
//         insert: 1,
//         attributes: {
//             image: 'monkey.png',
//             alt: 'Funny monkey picture'
//         }
//     }
// ]);

// console.log(doc.convertTo('html'));



Page({

    data: {
        detailInfo: {},
        orderInfoArr: [],
        group_voucher: [],
        leftTime: '',
        groupId: 0,
        fromLogin: false,
        pinType: 0,
        errorToast: false,
        toastInfo: ''
    },

    onShareAppMessage: function (res) {
        if (res.from === 'button') {
            // 来自页面内转发按钮
            console.log(res.target)
        }
        return {
            title: `快来参加拼团啦！`,
            path: `pages/pin/pin_detail/pin_detail?id=${this.data.groupId}`,
            success: function (res) {
                // 转发成功
            },
            fail: function (res) {
                // 转发失败
            }
        }
    },

    onShow () {
        if (this.data.isFromAddress) {
            this.getTransFee(this.data.addressObj, this);
        }
        // if (this.data.fromLogin) {
        //     if (this.data.pinType == 1) {
        //         this.goPinCallback();
        //     } else if (this.data.pinType == 2) {
        //         this.goAttendPinCallback();
        //     }
        // }
    },

    goPin () {
        let token = wx.getStorageSync('token').token
        if (!token) {
            wx.setStorageSync('attend_pin', {
                // orderInfo: this.data.orderInfoArr[parseInt(e.currentTarget.dataset.index)],
                group_voucher: this.data.group_voucher,
                detailInfo: this.data.detailInfo,
                isOwner: 1
            });
            // wx.redirectTo({
            //     url: `/pages/login/login?from=pin&pinType=1&pinId=${this.data.groupId}`
            // })
            // return
        }
        this.goPinCallback(token);
    },

    goPinCallback (hasToken) {
        let voucherParamArr = [];

        this.data.group_voucher.forEach(item => {
            if (item.voucher && item.voucher.id && item.num) {
                voucherParamArr.push({
                    voucherId: item.voucher.id,
                    number: item.num
                })
            }
        });
        let _userId, _openid;
        if (!wx.getStorageSync('token')) {
            _userId = '*'
        } else {
            _userId = wx.getStorageSync('token').user.id
        }
        if (!wx.getStorageSync('openid')) {
            _openid = '!'
        } else {
            _openid = wx.getStorageSync('openid')
        }
        let param = {
            userId: _userId,
            groupId: this.data.groupId,
            openId: _openid,
            payAmount: this.data.detailInfo.realAmount,
            remark: '',
            list: voucherParamArr
        };

        let paramStr = '';

        let keys = Object.keys(param);
        keys.forEach((item, index) => {
            if (index !== keys.length - 1) {
                paramStr += item + '=' + param[item] + '&';
            } else {
                paramStr += item + '=' + param[item];
            }
        })


        wx.setStorageSync('pinOrderInfo', {
            paramStr: paramStr,
            voucherParamArr: voucherParamArr
        });

        if (hasToken) {
            wx.navigateTo({
                url: `/pages/pin/checkout/checkout?isOwner=1&groupName=${this.data.detailInfo.groupName}&price=${this.data.detailInfo.realAmount}&originalPrice=${this.data.detailInfo.voucherAmount}&number=${this.data.detailInfo.maxPeople}`
            });
        } else {
            wx.redirectTo({
                url: `/pages/login/login?from=pin&pinType=1&pinId=${this.data.groupId}`
            })
        }  
    },

    onLoad: function (option) {
        wx.showLoading({
          title: 'Loading...', //提示的内容,
          mask: true, //显示透明蒙层，防止触摸穿透,
          success: res => {}
        });
        let self = this;

        this.setData({
            groupId: parseInt(option.id),
            fromLogin: option.fromLogin,
            pinType: option.pinType
        })
        
        model('group/action/info', {
            groupId: parseInt(option.id),
            // userId: wx.getStorageSync('token').user.id
        }).then(data => {
            if (data.data) {
                let endTime = data.data.group.endTime;
                let orderInfoArr = data.data.group_order;
                orderInfoArr.forEach(item => {
                    console.log(item.groupActivity.end_at.replace(/-/g, '/'));
                    item.leftTime = this.calcLeftTime(Date.parse(item.groupActivity.end_at.replace(/-/g, '/'))).time;
                    item.userAvatar = item.userAvatar ? item.userAvatar : wx.getStorageSync('personal_info')  && wx.getStorageSync('personal_info').avatarUrl
                });
                let detailInfo = data.data.group;
                detailInfo.groupBrief = detailInfo.groupBrief.replace(/<img /g, "<img style='width: 100%' ");
                this.setData({
                    detailInfo: data.data.group,
                    orderInfoArr: orderInfoArr.slice(-3),
                    group_voucher: data.data.group_voucher
                })
                setInterval(() => {
                    let orderInfoArr = Object.assign(this.data.orderInfoArr);
                    orderInfoArr.forEach(item => {
                        item.leftTime = this.calcLeftTime(new Date(item.groupActivity.end_at.replace(/-/g, '/')).getTime()).time;
                    });
                    // let calcLeftTime = this.calcLeftTime(new Date(endTime).getTime());
                    this.setData({
                        orderInfoArr: orderInfoArr.slice(-3)
                    })
                }, 1000);
            }
            wx.hideLoading();
        }).catch(e => {
            wx.hideLoading();
            this.setData({
                errorToast: true,
                toastInfo: e
            });
        });
        
    },

    calcLeftTime(time) {
        var timeStr = parseFloat(time) - new Date().getTime();
        var left = parseInt((timeStr % 86400000) / 1000);
        // console.log(left);
        var hours = parseInt(left / 3600);
        var minutes = parseInt((left - hours * 3600) / 60);
        var seconds = parseInt((left - hours * 3600 - minutes * 60));
        var result = {}
        if (left < 0) {
            return {
                left: left,
                time: '即将结束'
            }
        }
        // if (hours < 0 || timeStr < 0) {
        //     return {
        //         left: left,
        //         time: '即将结束'
        //     }
        // } else {
        //     return {
        //         left: left,
        //         time: '即将结束'
        //     }
        // }
        return {
            left: left,
            time: `剩余${hours > 9 ? hours : '0' + hours}:${minutes > 9 ? minutes : '0' + minutes}:${seconds > 9 ? seconds : '0' + seconds}`
        };
    },

    onShare () {
        wx.showShareMenu({
            withShareTicket: true
        })
    },


    goCreateMartOrder () {
        let token = wx.getStorageSync('token').token
        if (!token) {
            wx.redirectTo({
                url: `/pages/login/login`
            })
            return
        }
        this.setData({
            // tokenPrice: this.data.poiInfo.price,
            // totalPrice: this.data.poiInfo.price,
            totalPrice: this.data.poiInfo.price + this.data.transFee,
            showToast: true,
            choosenType: 'normal',
            isMart: 1
        })
    },

    goAttendPin (e) {
        let token = wx.getStorageSync('token').token
        if (!token) {
            wx.setStorageSync('attend_pin', {
                orderInfo: this.data.orderInfoArr[parseInt(e.currentTarget.dataset.index)],
                group_voucher: this.data.group_voucher,
                detailInfo: this.data.detailInfo,
                isOwner: 0
            });
            // wx.redirectTo({
            //     url: `/pages/login/login?from=pin&pinType=2&pinId=${this.data.groupId}`
            // })
            // return
        }
        this.goAttendPinCallback(e, token);
    },

    goAttendPinCallback (e, hasToken) {
        let voucherParamArr = [];
        this.data.group_voucher.forEach(item => {
            voucherParamArr.push({
                voucherId: item.voucher.id,
                number: item.num
            })
        });

        let _userId, _openid;
        if (!wx.getStorageSync('token')) {
            _userId = '*'
        } else {
            _userId = wx.getStorageSync('token').user.id
        }
        if (!wx.getStorageSync('openid')) {
            _openid = '!'
        } else {
            _openid = wx.getStorageSync('openid')
        }

        let param = {
            userId: _userId,
            activityId: this.data.orderInfoArr[parseInt(e.currentTarget.dataset.index)].groupActivity.id,
            openId: _openid,
            payAmount: this.data.detailInfo.realAmount,
            remark: ''
        };

        let paramStr = '';

        let keys = Object.keys(param);
        keys.forEach((item, index) => {
            if (index !== keys.length - 1) {
                paramStr += item + '=' + param[item] + '&';
            } else {
                paramStr += item + '=' + param[item];
            }
        })

        wx.setStorageSync('pinOrderInfo', {
            paramStr: paramStr,
            voucherParamArr: voucherParamArr
        });

        if (hasToken) {
            wx.navigateTo({
                url: `/pages/pin/checkout/checkout?isOwner=0&activityId=${param.activityId}&groupName=${this.data.detailInfo.groupName}&price=${this.data.detailInfo.realAmount}&originalPrice=${this.data.detailInfo.voucherAmount}&number=${this.data.detailInfo.maxPeople}`
            });
        } else {
            wx.redirectTo({
                url: `/pages/login/login?from=pin&pinType=2&pinId=${this.data.groupId}`
            });
        }

        
    },

    goToAddAddress () {
        wx.navigateTo({
            url: `/pages/address/address`
        });
    },

    closeMask () {
        this.setData({
            showToast: false
        })
    }

})
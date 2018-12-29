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
        groupId: 0
    },

    onShow () {
        if (this.data.isFromAddress) {
            this.getTransFee(this.data.addressObj, this);
        }
    },

    goPin () {
        let voucherParamArr = [];

        this.data.group_voucher.forEach(item => {
            if (item.voucher && item.voucher.id && item.num) {
                voucherParamArr.push({
                    voucherId: item.voucher.id,
                    number: item.num
                })
            }
        });

        let param = {
            userId: wx.getStorageSync('token').user.id,
            groupId: this.data.groupId,
            openId: wx.getStorageSync('openid'),
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

        wx.navigateTo({
            url: `/pages/pin/checkout/checkout?isOwner=1&groupName=${this.data.detailInfo.groupName}&price=${this.data.detailInfo.realAmount}&originalPrice=${this.data.detailInfo.voucherAmount}&number=${this.data.detailInfo.maxPeople}`
        });

        // model(`group/action/start?${paramStr}`, voucherParamArr, 'POST', {
        //     'authorization': 'Bearer ' + wx.getStorageSync('token').token,
        //     'Accept': 'application/json'
        // }).then(data => {
        //     debugger
        // }).catch(e => {
        //     debugger
        // });
    },

    onLoad: function (option) {
        let self = this;

        this.setData({
            groupId: parseInt(option.id)
        })
        
        model('group/action/info', {
            groupId: parseInt(option.id),
            userId: wx.getStorageSync('token').user.id
        }).then(data => {
            if (data.data) {
                let endTime = data.data.group.endTime;
                let orderInfoArr = data.data.group_order;
                orderInfoArr.forEach(item => {
                    item.leftTime = this.calcLeftTime(new Date(item.groupActivity.end_at).getTime()).time;
                    item.userAvatar = item.userAvatar ? item.userAvatar : wx.getStorageSync('personal_info').avatarUrl
                });
                let detailInfo = data.data.group;
                detailInfo.groupBrief = detailInfo.groupBrief.replace(/<img /g, "<img style='width: 100%' ");
                this.setData({
                    detailInfo: data.data.group,
                    orderInfoArr: orderInfoArr.slice(-3),
                    group_voucher: data.data.group_voucher
                    // leftTime: calcLeftTime.time
                })
                setInterval(() => {
                    let orderInfoArr = Object.assign(this.data.orderInfoArr);
                    orderInfoArr.forEach(item => {
                        item.leftTime = this.calcLeftTime(new Date(item.groupActivity.end_at).getTime()).time;
                    });
                    // let calcLeftTime = this.calcLeftTime(new Date(endTime).getTime());
                    this.setData({
                        orderInfoArr: orderInfoArr.slice(-3)
                    })
                }, 1000);
            }
        })
        
    },

    calcLeftTime(time) {
        var timeStr = parseFloat(time) - new Date().getTime();
        var left = parseInt((timeStr % 864e5) / 1000);
        var hours = parseInt(left / 3600);
        var minutes = parseInt((left - hours * 3600) / 60);
        var seconds = parseInt((left - hours * 3600 - minutes * 60));
        return {
            left: left,
            time: `${hours > 9 ? hours : '0' + hours}:${minutes > 9 ? minutes : '0' + minutes}:${seconds > 9 ? seconds : '0' + seconds}`
        };
    },

    onShare () {
        wx.showShareMenu({
            withShareTicket: true
        })
    },


    goCreateMartOrder () {
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
        let voucherParamArr = [];
        this.data.group_voucher.forEach(item => {
            voucherParamArr.push({
                voucherId: item.voucher.id,
                number: item.num
            })
        });

        let param = {
            userId: wx.getStorageSync('token').user.id,
            activityId: this.data.orderInfoArr[parseInt(e.currentTarget.dataset.index)].groupActivity.id,
            openId: wx.getStorageSync('openid'),
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

        wx.navigateTo({
            url: `/pages/pin/checkout/checkout?isOwner=0&activityId=${param.activityId}&groupName=${this.data.detailInfo.groupName}&price=${this.data.detailInfo.realAmount}&originalPrice=${this.data.detailInfo.voucherAmount}&number=${this.data.detailInfo.maxPeople}`
        });

        // model(`group/action/start?${paramStr}`, voucherParamArr, 'POST', {
        //     'authorization': 'Bearer ' + wx.getStorageSync('token').token,
        //     'Accept': 'application/json'
        // }).then(data => {
        //     debugger
        // }).catch(e => {
        //     debugger
        // });
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
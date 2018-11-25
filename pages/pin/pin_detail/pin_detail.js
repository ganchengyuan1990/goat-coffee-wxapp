// var QRCode = require('../../utils/weapp-qrcode.js');
import {
    calcLeftTime
} from '../../../utils/util';

import model from '../../../utils/model';



Page({
     onShareAppMessage: function (res) {
        return {
            title: `堤旁树-${this.data.poiInfo.name || this.data.poiInfo.lesson_name}`,
            path: `pages/lesson/lesson?lesson_id=${this.data.lesson_id}`,
            success: function (res) {
                // 转发成功
            },
            fail: function (res) {
                // 转发失败
            }
        }
    },

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
            voucherParamArr.push({
                voucherId: item.voucher.id,
                number: item.number
            })
        });

        let param = {
            userId: wx.getStorageSync('token').user.id,
            groupId: this.data.groupId,
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
            url: `/pages/pin/checkout/checkout?groupName=${this.data.detailInfo.groupName}&price=${this.data.detailInfo.realAmount}&originalPrice=${this.data.detailInfo.voucherAmount}&number=${this.data.detailInfo.maxPeople}`
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
            groupId: parseInt(option.id)
        }).then(data => {
            if (data.data) {
                let endTime = data.data.group.endTime;
                let calcLeftTime = this.calcLeftTime(new Date(endTime).getTime());
                this.setData({
                    detailInfo: data.data.group,
                    orderInfoArr: data.data.group_order,
                    group_voucher: data.data.group_voucher,
                    leftTime: calcLeftTime.time
                })
                setInterval(() => {
                    let calcLeftTime = this.calcLeftTime(new Date(endTime).getTime());
                    this.setData({
                        leftTime: calcLeftTime.time
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
            tokenPrice: this.data.poiInfo.price,
            totalPrice: this.data.poiInfo.price,
            totalPrice: this.data.poiInfo.price + this.data.transFee,
            showToast: true,
            choosenType: 'normal',
            isMart: 1
        })
    },

    goAttendPin (e) {
        let item = this.data.pinOrders[parseInt(e.currentTarget.dataset.index)]
        if (this.data.tool_id) {
            this.setData({
                tokenPrice: this.data.poiInfo.pinPrice,
                totalPrice: this.data.poiInfo.pinPrice,
                totalPrice: this.data.poiInfo.pinPrice + this.data.transFee,
                showToast: true,
                choosenType: 'pin',
                attendOthers: item
            })
        } else {
            wx.navigateTo({
                url: `/pages/pin/pin?name=${this.data.poiInfo.lesson_name}&lessonId=${item.lesson_id}&qrcode=${item.qrcode}&pinOrderId=${item.id}`
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
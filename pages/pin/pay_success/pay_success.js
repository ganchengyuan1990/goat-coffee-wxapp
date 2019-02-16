// var util = require('../../../utils/util.js');
// var api = require('../../../config/api.js');

import model from '../../../utils/model';


var app = getApp();

Page({
    data: {
        teamMembers: [],
        price: 0,
        originalPrice: 0,
        number: 0,
        groupName: '',
        activityId: '',
        type: 1,
        owner: {},
        groupOrder: [],
        errorToast: false,
        toastInfo: '',
        list: {},
        end_at: {},
        couponNum: 0
    },

     onShareAppMessage: function (res) {
         if (res.from === 'button') {
             // 来自页面内转发按钮
             console.log(res.target)
         }
        return {
            title: `快来参加我的拼团啦！`,
            path: `pages/pin/pay_success/pay_success?type=3&price=${this.data.price}&originalPrice=${this.data.originalPrice}&number=${this.data.number}&groupName=${this.data.groupName}&activityId=${this.data.activityId}&list=${JSON.stringify(this.data.list)}`,
            success: function (res) {
                // 转发成功
            },
            fail: function (res) {
                // 转发失败
            }
        }
    },

    goPinList () {
        wx.switchTab({
            url: '/pages/pin/pin_list/pin_list'
        });
    },

    onLoad: function (option) {
        this.setData({
            price: option.price,
            originalPrice: option.originalPrice,
            number: option.number,
            groupName: option.groupName,
            activityId: option.activityId,
            type: parseInt(option.type),
            list: JSON.parse(option.list)
        });
        let couponNum = 0;
        let list = this.data.list;
        if (list && list.length > 0) {
            list.forEach(item => {
                couponNum += item.number;
            });
        }
        this.setData({
            couponNum: couponNum
        });
        model(`group/action/user-list`, {
                activityId: this.data.activityId
            }, 'POST').then(data => {
                let groupOrder = data.data.groupOrder;
                let teamMembers = [];
                let type = 1; //已支付
                if (this.data.type === 3) {
                    type = 3; //分享，邀请好友下单
                }
                if (groupOrder.length >= this.data.number) {
                    type = 2; //已成团
                }
                for (let i = 0; i < this.data.number; i++) {
                    if (groupOrder[i]) {
                        teamMembers.push(groupOrder[i].user);
                    } else {
                        teamMembers.push({
                            empty: true,
                            avatar: "https://wx.qlogo.cn/mmopen/vi_32/UOwK8HSzl0jTn7Lq21cBAwiaictaXJ6T9vRlgCXUrrytk6WHjE0W8en8Dic7FrhmssBBpBQicMhKBg9JOUKPicT6GSQ/132"
                        });
                    }
                }
                this.setData({
                    groupOrder: groupOrder,
                    teamMembers: teamMembers,
                    type: type,
                    end_time: data.data.groupActivity.end_at,
                    end_at: this.calcLeftTime(new Date(data.data.groupActivity.end_at.replace(/-/g, '/')).getTime()).timeObj
                });
                setInterval(() => {
                    let end_at = Object.assign(this.data.end_at);
                    end_at = this.calcLeftTime(new Date(data.data.groupActivity.end_at.replace(/-/g, '/')).getTime()).timeObj;
                    // let calcLeftTime = this.calcLeftTime(new Date(endTime).getTime());
                    this.setData({
                        end_at: end_at
                    })
                }, 1000);
        }).catch(e => {
            let result = data.data
            this.setData({
                errorToast: true,
                toastInfo: e
            });
            setTimeout(() => {
                this.setData({
                    errorToast: false
                });
            }, 1500);
        });
    },

    calcLeftTime(time) {
        var timeStr = parseFloat(time) - new Date().getTime();
        var left = parseInt((timeStr % 864e5) / 1000);
        var hours = parseInt(left / 3600);
        var minutes = parseInt((left - hours * 3600) / 60);
        var seconds = parseInt((left - hours * 3600 - minutes * 60));
        return {
            timeObj: {
                hours: hours > 9 ? hours : '0' + hours,
                minutes: minutes > 9 ? minutes : '0' + minutes,
                seconds: seconds > 9 ? seconds : '0' + seconds
            },
            time: `${hours > 9 ? hours : '0' + hours}:${minutes > 9 ? minutes : '0' + minutes}:${seconds > 9 ? seconds : '0' + seconds}`
        };
    },

    goAttenPin () {
        if (!wx.getStorageSync('token')) {
            wx.navigateTo({ url: '/pages/login/login' });
            return ;
        }
        let param = {
            userId: wx.getStorageSync('token').user.id,
            activityId: this.data.activityId,
            openId: wx.getStorageSync('openid'),
            payAmount: this.data.price,
            remark: '',
            list: this.data.list
        };
        model(`group/action/join`, param, 'POST').then(data => {
            let order = data.data;
            let _package = order.package;
            let prepayId = _package.split('=')[1]
            wx.navigateTo({
                url: `/pages/pay/pinPay/pinPay?type=pin&activityId=${this.data.activityId}&timeStamp=${order.timeStamp}&msg=suc&paySign=${order.paySign}&appId=wx95a4dca674b223e1&signType=MD5&prepayId=${prepayId}&nonceStr=${order.nonceStr}&price=${this.data.price}&originalPrice=${this.data.originalPrice}&number=${this.data.number}&groupName=${this.data.groupName}&list=${JSON.stringify(this.data.list)}`
            })
        }).catch(e => {
            this.setData({
                errorToast: true,
                toastInfo: e
            });
            setTimeout(() => {
                this.setData({
                    errorToast: false
                });
            }, 1500);
            
        });
    },

    onReady: function () {

    },
    onShow: function () {

    },
    onHide: function () {
        // 页面隐藏

    },
    onUnload: function () {
        // 页面关闭
    }
})
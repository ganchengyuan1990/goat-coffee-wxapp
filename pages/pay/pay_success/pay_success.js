// var util = require('../../../utils/util.js');
// var api = require('../../../config/api.js');



var app = getApp();

Page({
    data: {
        price: 0,
        orderId: ''
    },
    onLoad: function (options) {
        this.setData({
            price: options.price,
            orderId: options.orderId
        })
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
    },

    go_share () {
        wx.navigateTo({
            url: '/pages/pay/share_coupon/share_coupon'
        });
    },

    goRedPack () {
        wx.redirectTo({
            url: `/pages/pay/share_success/share_success?orderId=${this.data.orderId}`
        });
    },

    goIndex () {
        wx.switchTab({
            url: '/pages/store/store'
        });
        // wx.showTabBar({
        //     animation: true
        // })
    }
})
// var util = require('../../../utils/util.js');
// var api = require('../../../config/api.js');



var app = getApp();

Page({
    data: {

    },
    onLoad: function (options) {},
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
    }
})
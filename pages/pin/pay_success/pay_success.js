// var util = require('../../../utils/util.js');
// var api = require('../../../config/api.js');



var app = getApp();

Page({
    data: {
        teamMembers: [{
            avatal: "https://wx.qlogo.cn/mmopen/vi_32/UOwK8HSzl0jTn7Lq21cBAwiaictaXJ6T9vRlgCXUrrytk6WHjE0W8en8Dic7FrhmssBBpBQicMhKBg9JOUKPicT6GSQ/132"
        }, {
            avatal: "https://wx.qlogo.cn/mmopen/vi_32/UOwK8HSzl0jTn7Lq21cBAwiaictaXJ6T9vRlgCXUrrytk6WHjE0W8en8Dic7FrhmssBBpBQicMhKBg9JOUKPicT6GSQ/132"
        }, {
            empty: true,
            avatal: "https://wx.qlogo.cn/mmopen/vi_32/UOwK8HSzl0jTn7Lq21cBAwiaictaXJ6T9vRlgCXUrrytk6WHjE0W8en8Dic7FrhmssBBpBQicMhKBg9JOUKPicT6GSQ/132"
        }],
        price: 0,
        originalPrice: 0,
        number: 0,
        groupName: '',
    },

    goPinList () {
        wx.navigateTo({
            url: '/pages/pin/pin_list/pin_list'
        });
    },
    onLoad: function (option) {
        this.setData({
            price: option.price,
            originalPrice: option.originalPrice,
            number: option.number,
            groupName: option.groupName,
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
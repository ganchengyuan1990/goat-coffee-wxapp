// var util = require('../../../utils/util.js');
// var api = require('../../../config/api.js');

import model from '../../utils/model';


var app = getApp();

Page({
    data: {
        banner: 'http://img.goatup.net/img/banner/0322-xianging-yaoqingdebei.jpg',
        extended: true,
        userId: '',
        contents: '<p>范围：全国门店通用。</p><p>规则：新用户首次登陆加油咖啡，可免费获赠新人大礼包，其中包含1张新人免费券+3张五折券，可用于消费饮品系列的产品（仅限1件商品，不找零，不含配送费）。同一手机号，同一手机可领一次。</p><p>期限：新人免费券自领取日起，有效期1年，3张5折券自领取之日起，有效期30天。</p> ',
        people: '',
        rUserInvites: [],
        phone: ''
    },
    onLoad: function (options) {
        let token = wx.getStorageSync('token');
        if (token) {
            let phone = `${token.user.tel.substr(0,3)}******`
            this.setData({
                phone: phone
            })
        }

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

    goShareSuccess () {
        wx.navigateTo({
            url: '/pages/pay/share_success/share_success'
        });
    },

    bindExtend: function (event) {
        this.setData({
            extended: !this.data.extended
        });
    },

    goStore () {
        wx.switchTab({ url: '/pages/store/store' });
    },

    onShareAppMessage () {
        let userid = wx.getStorageSync('token').user.id;
        return {
            title: '请你喝一杯加油咖啡',
            path: `/package/invite/pages/invite/invite?userid=${userid}`,
            imageUrl: 'http://img.goatup.net/img/banner/0322-index-pinpai.jpg',
            success: function (res) {
                
            },
            fail: function (res) {
                // 转发失败
            }
        }
    }
})
// var util = require('../../../utils/util.js');
// var api = require('../../../config/api.js');

import model from '../../utils/model';


var app = getApp();

Page({
    data: {
        banner: 'http://img.goatup.net/img/banner/%E9%A6%96%E9%A1%B5banner.png',
        extended: false,
        userId: '',
        contents: '<p>1.被推荐的新用户输入手机号，即可获赠一张新人免费券（全场通用）+ 3张全场五折券，可用于消费饮品系列和轻食系列中的商品（仅限一件商品，不含配送费），新人免费券有效期1年。（同一手机号，同一手机仅可领取一次）</p><p>2. 您推荐新用户只要产生消费（ 含消费新人免费券）， 您即获得一杯28元体验券， 可用于购买经典咖啡， 经典拿铁系列饮品， 体验券有效期1年</p><p>3. 您推荐的新用户同一手机设备， 同一手机号码仅可领取一次。</p><p>4. 您邀请好友所赠的体验券仅限本人使用， 用于商业牟利将有封号风险。</p> ',
        people: '',
        rUserInvites: []
    },
    onLoad: function (options) {
        let token = wx.getStorageSync('token');
        if (!token) {
            wx.redirectTo({ url: '/pages/login/login?from=invite' });
        }
        model('activity/invite/my-invitees').then(res => {
            this.setData({
                rUserInvites: res.data.rUserInvites
            });
        }).catch(e => {

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

    onShareAppMessage () {
        let userid = wx.getStorageSync('token').user.id;
        return {
            title: '请你喝一杯加油咖啡',
            path: `/package/invite/pages/invite/invite?userid=${userid}`,
            imageUrl: 'http://img.goatup.net/img/banner/%E9%A6%96%E9%A1%B5banner.png',
            success: function (res) {
                
            },
            fail: function (res) {
                // 转发失败
            }
        }
    }
})
// var util = require('../../../utils/util.js');
// var api = require('../../../config/api.js');

import model from '../../utils/model';


var app = getApp();

Page({
    data: {
        banner: 'http://img.goatup.net/img/banner/0322-xianging-yaoqingdebei.jpg',
        extended: false,
        userId: '',
        contents: '<p>1. 被推荐的新用户输入手机号，即可获赠一张新人指定饮品首杯1.8折券+ 3张全场饮品五折券，可用于消费饮品系列（仅限一件商品，不含配送费），新人指定饮品首杯1.8折券有效期1年。（同一手机号，同一手机仅可领取一次）</p><p>2. 您推荐新用户只要产生消费，您即获得一杯25元体验券，可用于购买经典意式咖啡、营养代餐系列饮品，体验券有效期1年</p><p>3. 您推荐的新用户同一手机设备，同一手机号码仅可领取一次。</p><p>4. 您邀请好友所赠的体验券仅限本人使用，用于商业牟利将有封号风险。</p> ',
        people: '',
        rUserInvites: [],
        goBuyMemberNum: 0
    },
    onLoad: function (options) {
        let token = wx.getStorageSync('token');
        if (!token) {
            wx.redirectTo({ url: '/pages/login/login?from=invite' });
        }
        model('activity/invite/my-invitees').then(res => {
            let num = 0;
            res.data.rUserInvites.forEach(element => {
                if (element.first_pay_time) {
                    num += 1;
                }
            });
            this.setData({
                rUserInvites: res.data.rUserInvites,
                goBuyMemberNum: num
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
            imageUrl: 'http://img.goatup.net/img/banner/0322-index-pinpai.jpg',
            success: function (res) {
                
            },
            fail: function (res) {
                // 转发失败
            }
        }
    }
})
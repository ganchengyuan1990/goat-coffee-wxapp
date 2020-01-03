// var util = require('../../../utils/util.js');
// var api = require('../../../config/api.js');

import model from '../../../utils/model';


var app = getApp();

Page({
    data: {
        price: 0,
        orderId: '',
        varCode: '',
        banner: '',
        showModal: false,
        modalTitle: 'sdsdsdsd',
        memberData: {},
        errorToastShown: false,
        errorInfo: {},
        memberResult: {},
        actImage: '',
        from: '',
        newUserFirstPayActivity: {},
        showNewUser: false,
        showWelcome: false,
        level: 1,
        targetAchievementDesign: null,
        drinkGiftPaymentImg: '',
        toastType: 1,
        hasGetAchievementGiftNumber: 0,
        gainValue: 0,
        gainScore: 0,
        existLuckActivity: false
    },

    showModalCups () {
        const achievementCups = this.data.memberData.achievementCups;
        const targetAchievementDesign = this.data.targetAchievementDesign;
        const targetCups = targetAchievementDesign.caps;
        const memberLevel = this.data.level;
        const mayGetAchievementGiftNumber = this.data.memberData.mayGetAchievementGiftNumber;

        if (mayGetAchievementGiftNumber) {
            this.setData({
                // showWelcome: true,
                errorToastShown: true,
                // errorInfo: '<p>您已集满8杯</p>  <p>快去会员卡页面领取一杯吧</p>',
                errorInfo: `<p>您已集满${targetCups}杯</p> <p>快去会员卡页面领取${mayGetAchievementGiftNumber}杯吧！</p>`,
                toastType: 2
            })
        } else {
            if (targetAchievementDesign.unlimit_in_month || this.data.hasGetAchievementGiftNumber == 0) {
                this.setData({
                    // showWelcome: true,
                    errorToastShown: true,
                    // errorInfo: '<p>您已集满8杯</p>  <p>快去会员卡页面领取一杯吧</p>',
                    errorInfo: `<p>再喝${targetCups - achievementCups}杯即可领取1杯</p>`,
                    toastType: 2
                })
            } else {
                this.setData({
                    // showWelcome: true,
                    errorToastShown: true,
                    // errorInfo: '<p>您已集满8杯</p>  <p>快去会员卡页面领取一杯吧</p>',
                    errorInfo: `<p>本月已经领过了</p> <p>请下个月再来吧！</p>`,
                    toastType: 2
                })
            }
            
        }

        // setTimeout(() => {
        //     this.setData({
        //         errorToastShown: false,
        //     });
        // }, 30000);
        
    },

    onLoad: function (options) {
        wx.showLoading({
          title: '加载中...', //提示的内容,
          mask: true, //显示透明蒙层，防止触摸穿透,
          success: res => {}
        });
        let configData = wx.getStorageSync('configData');
        let banner
        if (false) {
            banner = configData.p5Banners[0] && configData.p5Banners[0].pic || 'https://img.goatup.cn/activity/11711111111d1111111f.jpg'
            this.setData({
                price: options.price,
                orderId: options.orderId,
                varCode: options.varCode,
                banner: configData.p5Banners
            })
        } else {
            let _url = `my/achievement/single-order?orderId=${options.orderId}`;
            if (options.from == 'recharge') {
                _url = `my/achievement/single-order?orderId=${options.orderId}&isRecharge=1`;
            }
             Promise.all([model('base/site/config-list'), model(_url)]).then((resArr) => {
                const res = resArr[0];
                const res2 = resArr[1];
                const userRes = wx.getStorageSync('userConfigList');
                 wx.setStorageSync('configData', res.data['config-set'])
                 this.setData({
                     varCode: options.varCode,
                     newUserFirstPayActivity: res.data.newUserFirstPayActivity,
                     showNewUser: userRes['enable-new-user-after-pay-activity'] && (options.from != 'recharge'),
                     price: options.price || 0,
                     orderId: options.orderId || 0,
                     gainValue: res2.data.single_member_energy_score,
                     gainScore: res2.data.single_member_points,
                     existLuckActivity: Boolean(res.data['exist-luck-activity']),
                     // existLuckActivity: false,
                     from: options.from,
                     banner: res.data.p5Banners,
                     drinkGiftPaymentImg: res.data['drink-gift-payment-img']
                 });
                 wx.hideLoading();
             }).catch(e => {
                //  wx.hideLoading();
                this.setData({
                    varCode: options.varCode,
                    price: options.price || 0,
                    orderId: options.orderId || 0,
                    from: options.from,
                    banner: configData.p5Banners,
                })
                wx.hideLoading();
             });
            //  this.getAchievement();
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
        app.globalData.fromPaySuccess = true;
        wx.reLaunch({
            url: '/pages/store/store?from=pay_success'
        })
    },

    go_share () {
        wx.navigateTo({
            url: '/pages/pay/share_coupon/share_coupon'
        });
    },

    goZhuanpan () {
        wx.navigateTo({
            url: `/package/wheel/pages/index/index`
        });
    },

    goIndex () {
        // wx.switchTab({
        //     url: '/pages/store/store'
        // });
        if (this.data.from == 'recharge') {
            wx.redirectTo({
                url: `/pages/recharge/index?success=1`
            });
        } else {
            wx.navigateTo({
                url: `/pages/order/detail/detail?id=${this.data.orderId}&orderClassify=1&showDialog=1&fromPay=1`
            });
        }
        // wx.showTabBar({
        //     animation: true
        // })
    },

    goInvice() {
        // let item = e.currentTarget.dataset.item;
        wx.setStorageSync('martsListArr', [{
            id: this.data.orderId,
            real_due: this.data.price
        }]);
        wx.navigateTo({
            url: `/package/invoice/pages/open/open`
        });
    },

    getAchievement() {
            model('my/achievement/info', {}, 'POST').then(res => {
                // debugger
                let result = res.data;
                let total;
                let user_info = result.user_info;
                if (user_info && user_info.member_energy_score) {
                    result.member_energy_score_rate = parseInt(parseFloat(user_info.member_energy_score) / parseFloat(result.nextDesign.energy_low) * 100)
                }
                if (result.currentDesign) {
                    this.setData({
                        memberData: result,
                        level: result.currentDesign.level,
                        targetAchievementDesign: result.targetAchievementDesign,
                        hasGetAchievementGiftNumber: parseInt(result.hasGetAchievementGiftNumber),
                    })
                }
                if (result.arriveDesign) {
                    this.setData({
                        level: result.arriveDesign.level
                    })
                    this.getAchievement2();
                }

                // wx.setStorageSync('memberData', result);
                wx.hideLoading();
            });
        },

        getAchievement2() {
            model('my/achievement/get-member-level-gift', {}, 'POST').then(res => {
                if (res.code == "suc") {
                    this.setData({
                        showModal: true,
                        actImage: this.data.memberData.arriveDesign.alert_img
                    })
                    this.getAchievement();
                }
            }).catch(e => {
                this.setData({
                    errorToastShown: true,
                    errorInfo: e,
                })
            });
        },
})
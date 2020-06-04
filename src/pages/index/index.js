// var util = require('../../../utils/util.js');
// var api = require('../../../config/api.js');

import model from '../../utils/model';
var ald = require('../../utils/sdk/ald-stat.js');

var app = getApp();


var AObject = function () {
    this.name = "Jason";
}
var A = function () {
    if (!AObject.instance) {
        AObject.instance = new AObject();
    }
    return AObject.instance;
}

// var a = new A();
// var b = new A();

// console.log(a === b, a, a.name)

Page({
    data: {
        tags: '',
        actImage: '',
        isActWrapShow: false,
        banner: [],
        enableWeeklyActivity: false,
        showModal: false,
        modalTitle: 'sdsdsdsd',
        memberData: {},
        errorToastShown: false,
        errorInfo: {},
        memberResult: {},
        everyDayFirstAlert: false,
        activityObj: {},
        subscribe: false,
        isLogin: false,
        canShowSubscribeInOneDay: false,
        actUrl: '',
        actRoute: '',
        existInviteActivity: false,
        existLuckActivity: false,
        continueDrinkActivity: false,
        actualDrinkNum: 0,
        youngHomeOrderImg: ''
        // showModalEmail: false
    },
    onLoad: function (options) {
        this.setUnionId();

        wx.showLoading({
            title: '加载中', //提示的内容,
            mask: true, //显示透明蒙层，防止触摸穿透,
            success: res => {}
        });
        let subscribe = wx.getStorageSync('subscribe');
        let lastUnSubscirbe = wx.getStorageSync('lastUnSubscirbe');
        console.log(new Date().getTime() - lastUnSubscirbe);
        this.setData({
            canShowSubscribeInOneDay: lastUnSubscirbe ? (new Date().getTime() - lastUnSubscirbe > 86400000) : true,
            subscribe: Boolean(subscribe),
            isLogin: wx.getStorageSync('token')
        })


    },
    onReady: function () {

    },

    setFirstAlert (activityId) {
        let indexToastArr = wx.getStorageSync('indexToastArr') || {};
        let toast = false;
        if (!indexToastArr[activityId]) {
            toast = true;
            indexToastArr[activityId] = new Date().getTime();
        } else {
            let now = new Date().getTime();
            if (now - indexToastArr[activityId] > 86400000) {
                indexToastArr[activityId] = now;
                toast = true;
            }
        }
        if (toast) {
            wx.setStorageSync('indexToastArr', indexToastArr);
        }
        return toast;
    },

    setUnionId() {
        let self = this;
        console.log('start');
        console.log(wx.getStorageSync('unionId'));
        console.log(wx.getStorageSync('openid'));
        // wx.removeStorageSync('unionId');
        // wx.removeStorageSync('openid');
        let openid = wx.getStorageSync('openid')
        let token = wx.getStorageSync('token');
        if (token && (!wx.getStorageSync('unionid') || !wx.getStorageSync('unionId') || !wx.getStorageSync('openid') || typeof (openid) !== 'string')) {
            wx.login({
                success: function (res) {
                    if (res.code) {
                        model('my/user/get-open-id', {
                            code: res.code
                        }).then(res => {
                            wx.setStorageSync('openid', res.data.openid);
                            let session_key = res.data.session_key;
                            if (res.data.unionid) {
                                wx.setStorageSync('unionId', res.data.unionid);
                                wx.setStorageSync('unionid', res.data.unionid);
                            }
                            if (session_key) {
                                wx.setStorageSync('session_key', session_key);
                            }
                            console.log(session_key);
                            wx.getUserInfo({
                                withCredentials: true,
                                success: function (res) {
                                    var userInfo = res.userInfo
                                    let iv = res.iv;
                                    let encryptedData = res.encryptedData;
                                    console.log(session_key);
                                    console.log(iv);
                                    console.log(encryptedData);
                                    console.log(123);
                                    // model('my/user/update-user-by-wechat', {
                                    //     encryptedData: encryptedData,
                                    //     iv: iv,
                                    //     sessionKey: session_key
                                    // }, 'POST').then(res => {
                                    //     console.log(res.data.result);
                                    //     if (res.code === 'suc') {
                                    //         wx.setStorageSync('unionId', res.data.result.unionId);
                                    //         wx.setStorageSync('unionid', res.data.result.unionId);
                                    //     }
                                    // }).catch(e => {
                                    //     console.log(e)
                                    // })

                                }
                            })
                        })
                    } else {
                        console.log('登录失败！' + res.errMsg)
                    }
                }
            });
        }
    },

    setTabStatus() {
        if (wx.getStorageSync('token') && wx.getStorageSync('STORE_INFO')) {
            let STORE_INFO = JSON.parse(wx.getStorageSync('STORE_INFO'));
            model(`home/cart/list?storeId=${STORE_INFO.id}`).then(res => {
                let sum = 0;
                res.data.carts && res.data.carts.forEach(item => {
                    sum += item.num;
                })
                wx.setStorageSync('cartSum', sum);
                if (sum) {
                    wx.setTabBarBadge({
                        index: 1,
                        text: sum.toString()
                    });
                } else {
                    wx.removeTabBarBadge({
                        index: 1,
                    });
                }
            }).catch(e => {

            });
        }
    },

    showActivityToast(dailyActivitys, enableMaps) {
        let enableArrs = [];
        let enableMapsArr = Object.keys(enableMaps || {});
        // let firstDailyActivityId = dailyActivitys[0].id;
        if (!wx.getStorageSync('token')) {
            dailyActivitys = dailyActivitys.filter(item => {
                return item['no_login_user_if_alert'] === 1;
            });
        }
        if (!dailyActivitys[0]) {
            return ;
        }
        if (enableMapsArr.length == 0 && this.setFirstAlert(dailyActivitys[0].id)) {
            return dailyActivitys[0];
        } else {
            enableMapsArr.map(item => {
                if (enableMaps[item]) {
                    enableArrs.push(parseInt(item));
                }
                return item;
            })
        }
        let index = -1;

        for (let i = 0; i < dailyActivitys.length; i++) {
            index = enableArrs.indexOf(dailyActivitys[i].id);
            if (index >= 0 && this.setFirstAlert(dailyActivitys[i].id)) {
                return dailyActivitys[i];
            }
        }
        return null;
    },

    judgeNewUser(configDate) {
        let result = false;
        let info = wx.getStorageSync('token') || {}
        let isNew = info.ifNew;
        let configPic = '';
        try {
            configPic = configDate['new-user-alert-img']
        } catch (e) {
            // console.log(e);
        }
        if (isNew && configPic) {
            this.setData({
                actImage: configPic,
                isActWrapShow: true
            });
            result = true;
            try {
                let token = wx.getStorageSync('token')
                token.ifNew = false
                wx.setStorageSync('token', token)
            } catch (e) {
                console.log(e);
            }
        }
        return result;
    },

    handleImage () {

    },

    onShow: function () {
        if (typeof this.getTabBar === 'function' &&
            this.getTabBar()) {
            this.getTabBar().setData({
                selected: 0
            })
        }

        this.setData({
            isLogin: wx.getStorageSync('token')
        })
        wx.removeStorageSync('showNoOrder');
        
        

        if (wx.getStorageSync('token')) {
            Promise.all([model('base/site/config-list'), model('base/site/user-config-list')]).then((resArr) => {
                const res = resArr[0];
                const userRes = resArr[1];
                // const userRes = resArr[1];
                wx.setStorageSync('configData', res.data['config-set']);
                if (res.data.homeBanners && res.data.homeBanners[0] && res.data.homeBanners[0].pic) {
                    let banners = [];
   
                    this.setData({
                        banner: res.data.homeBanners
                        // banner: ['https://img.goatup.cn/img/banner/home-banner-1.png'
                    })
                }
                this.setData({
                    enableWeeklyActivity: userRes.data["enable-weekly-activity"],
                    actualDrinkNum: userRes.data["actual-drink-num"],
                    // existLuckActivity: false
                    youngHomeOrderImg: res.data['young-home-order-img'],
                    existInviteActivity: Boolean(res.data['exist-invite-activity']),
                    existLuckActivity: Boolean(res.data['exist-luck-activity']),
                    continueDrinkActivity: Boolean(res.data['continue-drink-activity']),
                });
                let activityObj = this.showActivityToast(res.data.dailyActivitys, userRes.data['enable-daily-activity-map']);
                if (activityObj) {
                    this.setData({
                        actImage: activityObj.coupon_modal_pic,
                        actUrl: activityObj.redirect_url,
                        actRoute: activityObj.redirect_route,
                        activityObj: activityObj,
                        isActWrapShow: true
                    });
                }
                wx.hideLoading();
            }).catch(e => {
                wx.hideLoading();
            });
            this.getAchievement();
        } else {
            model('base/site/config-list').then(res => {
                wx.setStorageSync('configData', res.data['config-set']);
                if (res.data.homeBanners && res.data.homeBanners[0] && res.data.homeBanners[0].pic) {
                    let banners = [];
                    // res.data.homeBanners.forEach(item => {
                    //     banners.push(item.pic);
                    // })
                    this.setData({
                        banner: res.data.homeBanners
                    })
                }
                this.setData({
                    // existLuckActivity: false
                    youngHomeOrderImg: res.data['young-home-order-img'],
                    existInviteActivity: Boolean(res.data['exist-invite-activity']),
                    existLuckActivity: Boolean(res.data['exist-luck-activity']),
                    continueDrinkActivity: Boolean(res.data['continue-drink-activity']),
                })
                wx.hideLoading();
                // this.judgeNewUser(res.data);
                let activityObj = this.showActivityToast(res.data.dailyActivitys, {});
                if (activityObj) {
                    this.setData({
                        actImage: activityObj.coupon_modal_pic,
                        activityObj: activityObj,
                        isActWrapShow: true
                    });
                }
            }).catch(e => {
                wx.hideLoading();
            });
        }

        this.setTabStatus();
    },

    onHide: function () {
        // 页面隐藏

    },
    onUnload: function () {
        // 页面关闭
    },

    async getConfigList() {
        model('base/site/config-list');
    },

    goShareSuccess() {
        wx.navigateTo({
            url: '/pages/pay/share_success/share_success'
        });
    },

    goPin() {
        // wx.navigateTo({
        //     url: '/pages/pin/pin_list/pin_list'
        // });
        wx.navigateTo({
            url: '/package/invite/pages/inviteOthers/invite'
        });
    },

    goPocket() {
        app.aldstat.sendEvent('点击充值', {
            type: 1
        });
        wx.navigateTo({
            url: '/pages/recharge/index'
        });
    },

    goStore() {
        wx.switchTab({
            url: '/pages/store/store'
        });
    },

    onShareAppMessage() {
        return {
            title: '加油咖啡',
            path: '/pages/store/store',
            success: function (res) {
                console.log('转发失败');
            },
            fail: function (res) {
                // 转发失败
            }
        }

    },

    hideActWrap() {
        this.setData({
            isActWrapShow: false
        })
        model('activity/coupon-activity/weekly-send', {
            id: this.data.activityObj.id
        }, 'POST')
    },

    goPageCoupon() {
        this.setData({
            isActWrapShow: false
        });
        wx.switchTab({
            url: `/pages/store/store`
        });
    },

    closeToast() {
        this.setData({
            isActWrapShow: false
        });
        model('activity/coupon-activity/weekly-send', {
            id: this.data.activityObj.id
        }, 'POST')
    },

    bindGetUserInfo() {
        this.setUnionId();
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
            if (result.arriveDesign) {
                this.setData({
                    memberResult: result
                })
                this.getAchievement2();
            }
            if (result.userCouponCount > 0) {
                let userCouponCountMention = wx.getStorageSync('userCouponCountMention');
                let result = false;
                if (!userCouponCountMention) {
                    result = true;
                } else if (new Date().getTime() - userCouponCountMention > 86400000) {
                    result = true;
                }
                if (result) {
                    wx.showTabBarRedDot({
                        index: 2,
                    });
                }
            }

            // wx.setStorageSync('memberData', result);
            wx.hideLoading();
        });
    },

    getAchievement2() {
        model('my/achievement/get-member-level-gift', {}, 'POST').then(res => {
            if (res.code == "suc") {
                let arriveDesign = this.data.memberResult.arriveDesign
                let actImage;
                if (arriveDesign && arriveDesign.alert_img) {
                    actImage = arriveDesign.alert_img
                } else {
                    actImage = this.data.memberResult.currentDesign.alert_img
                }
                this.setData({
                    showModal: true,
                    actImage: actImage
                })
            }
        }).catch(e => {
            this.setData({
                errorToastShown: true,
                errorInfo: e,
            })
        });
    },

    requestSubscribeMessage() {
        wx.requestSubscribeMessage({
          tmplIds: ['WBJ911eDHmHMi621fNswAGs1szrah_ODpgbdcVk', 'xZQ9X25DVScW_DJUfFwc1Jzcq2ymF0lfBEfPpeazcz8'],
          success(res) {
            console.log(res, 'success')
            wx.setStorageSync('subscribe', true);
          },
          fail(e) {
            console.log(e, 'fail')
          }
        })
    },

    discardSubscribe () {
        this.setData({
            subscribe: true
        })
        // wx.setStorageSync('subscribe', false);
        wx.setStorageSync('lastUnSubscirbe', new Date().getTime());
    },

    goQrcode () {
        if (!wx.getStorageSync('token')) {
            wx.navigateTo({
                url: '/pages/login/login'
            });
        } else {
            wx.navigateTo({
                url: '/pages/member/qrcode/index'
            });
        }
    },

    goZhuanpan() {
        wx.navigateTo({
            url: `/package/wheel/pages/index/index`
        });
    },

    goDaka () {
        if (!wx.getStorageSync('token')) {
            wx.navigateTo({
                url: '/pages/login/login'
            });
        } else {
            wx.navigateTo({
                url: '/pages/punch/index'
            });
        }
    }

    // bindGetUserInfo(e) {
    //     console.log(e.detail.userInfo)
    // }
})
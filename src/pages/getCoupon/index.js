// var util = require('../../../utils/util.js');
// var api = require('../../../config/api.js');

import model from '../../utils/model';
var ald = require('../../utils/sdk/ald-stat.js');
import util from '../../utils/util.js'


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
        id: 0, 
        tags: '',
        actImage: '',
        isActWrapShow: false,
        banner: [],
        enableWeeklyActivity: false,
        showModal: false,
        gettingAjax: false,
        modalTitle: '恭喜您获得奖励',
        memberData: {},
        errorToastShown: false,
        errorInfo: {},
        memberResult: {},
        everyDayFirstAlert: false,
        activity: {},
        subscribe: false,
        isLogin: false,
        canShowSubscribeInOneDay: false,
        actUrl: '',
        actRoute: '',
        existInviteActivity: false,
        existLuckActivity: false,
        continueDrinkActivity: false,
        getSuccess: false,
        actualDrinkNum: 0,
        youngHomeOrderImg: ''
        // showModalEmail: false
    },

    // onUnload: function () {
    //     // 页面关闭
    //     wx.reLaunch({
    //         url: '/pages/store/store?from=pay_success'
    //     })
    // },

    onLoad: function (options) {

        let activityId; 
        if (options.activityId) {
            activityId = options.activityId
        } else if (wx.getStorageSync('couponActivityId')) {
            debugger
            activityId = wx.getStorageSync('couponActivityId');
            wx.removeStorageSync('couponActivityId');
        }


        if (options.scene) {
            const ggg = decodeURIComponent(options.scene);
            console.log(ggg, 'ggg');

            const ttt = ggg.split('&');
            console.log(ttt, 'ddddd');
            let time;
            ttt.map(item => {
                if (item.indexOf('a') >= 0) {
                    const dddd = item.split('=')
                    activityId = dddd[dddd.length - 1];
                } else if (item.indexOf('t') >= 0) {
                    const dddt = item.split('=')
                    time = dddt[dddt.length - 1];
                }
            })

            console.log(options.scene, time, activityId);

            const nowDate = new Date().getTime();

            console.log(nowDate - parseInt(time * 1000), '@@@@')

            if (nowDate - parseInt(time * 1000) > 2 * 60 * 1000) {
                wx.showToast({
                    title: '二维码失效，请重新扫码',
                    icon: 'none',
                    image: '',
                    duration: 2500,
                    mask: false,
                    success: (result) => {
                        
                    },
                    fail: () => {},
                    complete: () => {}
                });
                this.setData({
                    getSuccess: true
                })
                app.globalData.InitCouponTime = nowDate;
                return;
            }
            // const time = new Date().getTime();
            // wx.setStorageSync('lastScanParams', {
            //     storeId: storeId,
            //     tableId: tableId,
            //     time: time
            // });
        }

        wx.showLoading({
            title: '加载中', //提示的内容,
            mask: true, //显示透明蒙层，防止触摸穿透,
            success: res => {}
        });

        model('base/site/config-list').then(resOut => {
            console.log(activityId, 'activityId');
            if (!activityId && resOut.data['config-set']['get-coupon-activity-id']) {
                activityId = resOut.data['config-set']['get-coupon-activity-id']
            }
            model(`my/coupon/get-coupon-index?id=${activityId}`).then(res => {
                this.setData({
                    // existLuckActivity: false
                    activity: res.data.activity,
                    id: activityId
                })
                wx.hideLoading();
            }).catch(e => {
                wx.hideLoading();
            });
        })

        


    },
    onReady: function () {

    },

    getCoupon () {
        const nowDate = new Date().getTime();

        let _time = app.globalData.InitCouponTime;

        if (_time && (nowDate - _time > 10 * 60 * 1000)) {
            wx.showToast({
                title: '二维码失效，请重新扫码',
                icon: 'none',
                image: '',
                duration: 2500,
                mask: false,
                success: (result) => {
                    
                },
                fail: () => {},
                complete: () => {}
            });
            app.globalData.InitCouponTime = null;
            return;
        }
        (util.throttleV2(() => {
            if (getApp().globalData.gettingAjax) {
                return;
            }
            let token = wx.getStorageSync('token');
            if (!token) {
                wx.setStorageSync('couponActivityId', this.data.id);
                wx.navigateTo({
                    url: '/pages/login/login?from=getCoupon'
                })
                getApp().globalData.fromCoupon = true;
            } else {
                if (this.data.getFail || this.data.getSuccess) {
                    return;
                }
                wx.showLoading({
                    title: '正在领取。。', //提示的内容,
                    mask: true, //显示透明蒙层，防止触摸穿透,
                    success: res => {}
                });
                getApp().globalData.gettingAjax = true
                model(`my/coupon/get-coupon`, {
                    id: this.data.activity.id
                }, 'POST').then(res => {
                    wx.hideLoading();
                    getApp().globalData.gettingAjax = false;
                    this.setData({
                        showModal: true,
                        gettingAjax: false,
                        modalTitle: '恭喜您获得奖励',
                        actImage: res.data.get_coupons[0].coupon_avatar,
                        failImage: '',
                        content: '请至“我的优惠券”查看',
                        buttonContent: '立即使用',
                        getSuccess: true,
                        showSmall: false,
                    })
                }).catch(e => {
                    getApp().globalData.gettingAjax = false;
                    wx.hideLoading();
                    this.setData({
                        getFail: true,
                        gettingAjax: false,
                        showModal: true,
                        modalTitle: e || '您来晚了，券已经领光了',
                        showSmall: e && e.length > 15,
                        actImage: '',
                        content: '',
                        failImage: 'https://img.goatup.cn/sorry%402x.png',
                        buttonContent: '知道了'
                    })
                });
    
            }
        }, 300, 1500))()
    },

    handleImage () {

    },

    onShow: function () {
        
        // model(`my/coupon/get-coupon-index?id=${this.data.id}`).then(res => {
        //     this.setData({
        //         // existLuckActivity: false
        //         activity: res.data.activity,
        //     })
        //     wx.hideLoading();
        // }).catch(e => {
        //     wx.hideLoading();
        // });

    },

    onHide: function () {
        // 页面隐藏

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

    // onShareAppMessage() {
    //     return {
    //         title: '加油咖啡',
    //         path: '/pages/store/store',
    //         success: function (res) {
    //             console.log('转发失败');
    //         },
    //         fail: function (res) {
    //             // 转发失败
    //         }
    //     }

    // },


    // onShareTimeline: function () {
	// 	return {
	//       title: '',
	//       query: {
	//         // key: value
	//       },
	//       imageUrl: ''
	//     }
	// },

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
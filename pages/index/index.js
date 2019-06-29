// var util = require('../../../utils/util.js');
// var api = require('../../../config/api.js');

import model from '../../utils/model';


var app = getApp();

Page({
    data: {
        tags: '',
        actImage: '',
        isActWrapShow: false,
        banner: 'http://img.goatup.net/img/banner/%E9%A6%96%E9%A1%B5banner.png',
        enableWeeklyActivity: false
    },
    onLoad: function (options) {
        this.setUnionId();
        
    },
    onReady: function () {

    },

    setUnionId () {
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
                        model('my/user/get-open-id2', {
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
                                    model('my/user/update-user-by-wechat', {
                                        encryptedData: encryptedData,
                                        iv: iv,
                                        sessionKey: session_key
                                    }, 'POST').then(res => {
                                        console.log(res.data.result);
                                        if (res.code === 'suc') {
                                            wx.setStorageSync('unionId', res.data.result.unionId);
                                            wx.setStorageSync('unionid', res.data.result.unionId);
                                        }
                                    }).catch(e => {
                                        console.log(e)
                                    })
                                    
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

    setTabStatus () {
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
                        index: 3,
                        text: sum.toString()
                    });
                } else {
                    wx.removeTabBarBadge({
                        index: 3,
                    });
                }
            }).catch(e => {

            });
        }
    },

    judgeNewUser () {
        let result = false;
        let info = wx.getStorageSync('token') || {}
        let isNew = info.ifNew;
        let configPic = '';
        try {
            configPic = info.config.newUserPic
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

    onShow: function () {
        // let info = wx.getStorageSync('token') || {}
        // let isNew = info.ifNew;
        // let configPic = '';
        // try {
        //     configPic = info.config.newUserPic
        // } catch (e) {
        //     // console.log(e);
        // }
        // if (isNew && configPic) {
        //     this.setData({
        //         actImage: configPic,
        //         isActWrapShow: true
        //     });
        //     try {
        //         let token = wx.getStorageSync('token')
        //         token.ifNew = false
        //         wx.setStorageSync('token', token)
        //     } catch (e) {
        //         console.log(e);
        //     }
        // }
        wx.showLoading({
            title: 'Loading...', //提示的内容,
            mask: true, //显示透明蒙层，防止触摸穿透,
            success: res => {}
        });

        if (wx.getStorageSync('token')) {
            Promise.all([model('base/site/config-list'), model('base/site/user-config-list')]).then((resArr) => {
                const res = resArr[0];
                const userRes = resArr[1];
                wx.setStorageSync('configData', res.data);
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
                    tags: res.data['voucher-text']
                })
                this.setData({
                    enableWeeklyActivity: userRes.data["enable-weekly-activity"]
                });
                if (userRes.data["enable-order-activity"]) {
                    wx.setStorageSync('enable-order-activity', true);
                }
                if (this.judgeNewUser()) {

                } else if (this.data.enableWeeklyActivity) {
                    model('activity/coupon-activity/weekly-send', {}, 'POST').then(res => {
                        //
                    }).catch(e => {
                        console.log(e);
                    });
                    this.setData({
                        actImage: res.data['weekly-activity'] && res.data['weekly-activity'].pic,
                        isActWrapShow: true
                    });
                }
                wx.hideLoading();
            }).catch(e => {
                wx.hideLoading();
            });
        } else {
            model('base/site/config-list').then(res => {
                wx.setStorageSync('configData', res.data);
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
                    tags: res.data['voucher-text']
                })
                wx.hideLoading();
                this.judgeNewUser();
            }).catch(e => {
                wx.hideLoading();
            });
        }
        

        // model('base/site/config-list').then(res => {
        //     wx.setStorageSync('configData', res.data);
        //     if (res.data.homeBanners && res.data.homeBanners[0] && res.data.homeBanners[0].pic) {
        //         let banners = [];
        //         // res.data.homeBanners.forEach(item => {
        //         //     banners.push(item.pic);
        //         // })
        //         this.setData({
        //             banner: res.data.homeBanners
        //         })
        //     }
        //     this.setData({
        //         tags: res.data['voucher-text']
        //     })
        //     wx.hideLoading();
        // }).catch(e => {
        //     wx.hideLoading();
        // });

        // 判断用户是否已参加过周活动
        // this.getUserConfigList();
    
        this.setTabStatus();
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

    goPin () {
        // wx.navigateTo({
        //     url: '/pages/pin/pin_list/pin_list'
        // });
        wx.navigateTo({
            url: '/package/invite/pages/inviteOthers/invite'
        });
    },

    goPocket() {
        wx.navigateTo({
            url: '/package/coffeePocket/pages/pocket/pocket'
        });
    },

    goStore () {
        wx.switchTab({
            url: '/pages/store/store'
        });
    },

    onShareAppMessage() {
        return {
            title: '加油咖啡',
            path: '/pages/index/index',
            success: function (res) {
                console.log('转发失败');
            },
            fail: function (res) {
                // 转发失败
            }
        }

    },

    hideActWrap  () {
        this.setData({
            isActWrapShow: false
        })
    },

    goPageCoupon() {
        this.setData({
            isActWrapShow: false
        });
        wx.switchTab({
            url: `/pages/store/store`
        });
        // model('activity/coupon-activity/weekly-send', {}, 'POST').then(res => {
        //     wx.switchTab({
        //         url: `/pages/store/store`
        //     });
        // }).catch(e => {
        //     console.log(e);
        // });
    },

    bindGetUserInfo() {
        this.setUnionId();
    },

    // bindGetUserInfo(e) {
    //     console.log(e.detail.userInfo)
    // }
})
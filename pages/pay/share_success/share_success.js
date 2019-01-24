// var util = require('../../../utils/util.js');
// var api = require('../../../config/api.js');

import model from '../../../utils/model';


var app = getApp();

Page({
    data: {
        orderId: '',
        activityId: 1,
        errorToast: false,
        toastInfo: '',
        redPackId: -1,
        auth: true,
        canGetVerify: false,
        phoneNum: '',
        placeOrderNotice: '23232323',
        placeOrderNoticeShown: true,
        leftButtonText: '去登录',
        otherFunctionText: '确定',
        leftSeconds: 60,
        errorToastShown: false,
        errorInfo: 'sdsdsds',
        showButtonLineName: false,
        showButtonLinePhone: false,
        phoneCode: '',
        token: '',
        sysinfo: {},
        showSeconds: false,
        actived: false,
        fromPin: false,
        randRedEnvelopeActivitys: [],
        randRedEnvelopeActivity: {
            name: '12元红包，随机出没'
        },
        rRandredenvelopeactUser: {},
        loading: true,
        bigSend: false
    },

    onShareAppMessage: function (res) {
        if (res.from === 'button') {
            // 来自页面内转发按钮
            console.log(res.target)
        }
        return {
            title: `最高${parseInt(this.data.randRedEnvelopeActivity.name)}元红包随机出没，手快有，手慢无～`,
            path: `pages/pay/share_success/share_success?id=${this.data.activityId}&redPackId=${this.data.redPackId}`,
            success: function (res) {
                // 转发成功
            },
            fail: function (res) {
                // 转发失败
            }
        }
    },
    onLoad: function (options) {
        wx.showLoading({
          title: 'Loading...', //提示的内容,
          mask: true, //显示透明蒙层，防止触摸穿透,
        });
        // if (!wx.getStorageSync('token')) {
        if (!wx.getStorageSync('token')) {
            if (options.id) {
                let param = {};
                param.activityId = parseInt(options.id);
                param.redPackId = parseInt(options.redPackId);
                param.orderId = options.orderId;
                this.setData(param);
            }
            this.setData({
                auth: false
            })
            this.dealLogin();
            
        } else {
            let personal_info = wx.getStorageSync('token').user;
            let param = {};
            param.phone = personal_info.tel;
            if (options.id) {
                param.activityId = parseInt(options.id);
                param.redPackId = parseInt(options.redPackId);
                this.setData(param);
                // this.randRedEnvelopeDetail();
                // this.attendRandRed();
            } else {
                param.orderId = options.orderId;
                this.setData(param);
                // this.startRandRed();
            }
            this.dealActor(personal_info);
            // this.randRedEnvelopeDetail();
            
        }
    },

    dealActor(personal_info) {
        let online_info = wx.getStorageSync('token').user;
        if (!online_info.avatar || !online_info.userName) {
            let info = wx.getStorageSync('personal_info');
            this.saveUser(info);
        }
        console.log('dealActor');
        if (this.data.redPackId > 0) {
            this.randRedEnvelopeDetail();
            this.attendRandRed();
        } else {
            this.startRandRed();
        }
    },


    // checkSaveUser() {
    //     let self = this;
    //     let token = wx.getStorageSync('token')
    //     let userName = ''
    //     if (!token) {
    //         return
    //     }
    //     try {
    //         let userInfo = token.user
    //         userName = userInfo.userName
    //     } catch (e) {
    //         console.log(e);
    //     }
    //     if (userName) {
    //         return
    //     }
    //     let info = wx.getStorageSync('personal_info')
    //     if (!info) {
    //         return
    //     }
    //     const {
    //         nickName,
    //         gender
    //     } = info
    //     model('file/qiniu/fetch', {
    //         sourceUrl: info.avatarUrl
    //     }, 'POST').then(res => {
    //         const {
    //             code,
    //             data
    //         } = res
    //         if (code === 'suc') {
    //             let {
    //                 key,
    //                 url
    //             } = data
    //             if (key) {
    //                 model('my/user/update-user', {
    //                     avatar: key,
    //                     userName: nickName,
    //                     sex: gender
    //                 }, 'POST').then(res => {
    //                     console.log(res);
    //                 }).catch(e => {
    //                     console.log(e, '[exception]: my/user/update-user');
    //                 })
    //             }
    //         }
    //     });
    // },

    startRandRed () {
        // this.setData({
        //     randRedEnvelopeActivity: this.data.rRandredenvelopeactUser.randredenvelopeActivity,
        //     rRandredenvelopeactUsers: [this.data.rRandredenvelopeactUser],
        //     redPackId: rRandredenvelopeactUser.id
        // });

        console.log('startRandRed');
        
        model('home/rand-red-envelope/start', {
            activityId: 1,
            orderId: this.data.orderId
        }, 'POST').then(res => {
            console.log(res);
            let result = res.data;
            let rRandredenvelopeactUser = result.rRandredenvelopeactUsers[0]
            if (rRandredenvelopeactUser.coupon) {
                rRandredenvelopeactUser.coupon.voucher_cash = parseInt(rRandredenvelopeactUser.coupon.voucher_cash);
                this.setData({
                    bigSend: result.bigSend,
                    randRedEnvelopeActivity: rRandredenvelopeactUser.randredenvelopeActivity,
                    rRandredenvelopeactUsers: [rRandredenvelopeactUser],
                    redPackId: rRandredenvelopeactUser.id,
                    rRandredenvelopeactUser: rRandredenvelopeactUser,
                    loading: false
                });
                if (result.ifNew) {
                    this.setData({
                        errorToast: true,
                        toastInfo: '成功获得优惠券！'
                    });
                } else {
                    this.setData({
                        errorToast: true,
                        toastInfo: '您已领过此优惠券！'
                    });
                }
            }
            wx.hideLoading();
        }).catch(e => {
            console.log(e);
            this.setData({
                errorToast: true,
                toastInfo: e
            });
            wx.hideLoading();
        })
    },

    attendRandRed () {
        model('home/rand-red-envelope/join', {
            rRandredenvelopeactUserId: this.data.redPackId
        }, 'POST').then(res => {
            console.log(res);
            let result = res.data;
            let rRandredenvelopeactUsers = Object.assign(this.data.rRandredenvelopeactUsers);
            rRandredenvelopeactUsers.forEach(item => {
                item.coupon.voucher_cash = parseInt(item.coupon.voucher_cash);
            });
            rRandredenvelopeactUsers.push(result.rRandredenvelopeactUser);
            let rRandredenvelopeactUser = result.rRandredenvelopeactUser
            rRandredenvelopeactUser.coupon.voucher_cash = parseInt(rRandredenvelopeactUser.coupon.voucher_cash);
            this.setData({
                rRandredenvelopeactUser: rRandredenvelopeactUser,
                rRandredenvelopeactUsers: rRandredenvelopeactUsers,
                loading: false
            })
            this.setData({
                errorToast: true,
                toastInfo: '成功获得优惠券！'
            });
            wx.hideLoading();

        }).catch(e => {
            console.log(e);
            this.setData({
                errorToast: true,
                toastInfo: e
            });
            wx.hideLoading();

        })
    },

    randRedEnvelope () {
        model('home/rand-red-envelope/list', {
        }).then(res => {
            let result = res.data;
            this.setData({
                randRedEnvelopeActivitys: result.randRedEnvelopeActivitys
            })
            
        })
    },

    randRedEnvelopeDetail () {
        model('home/rand-red-envelope/get', {
            activityId: 1,
            rRandredenvelopeactUserId: this.data.redPackId
        }).then(res => {
            let result = res.data;
            this.setData({
                randRedEnvelopeActivity: result.randRedEnvelopeActivity,
                rRandredenvelopeactUsers: result.rRandredenvelopeactUsers
            })

        })
    },

    getUserInfo() {
        let self = this;
        wx.login({
            success: function (res) {
                if (res.code) {
                    model('my/user/get-open-id', {
                        code: res.code
                    }).then(res => {
                        wx.setStorageSync('openid', res.data);
                        wx.getUserInfo({
                            success: function (res) {
                                var userInfo = res.userInfo
                                wx.setStorageSync('personal_info', {
                                    nickName: userInfo.nickName,
                                    avatarUrl: userInfo.avatarUrl,
                                    gender: userInfo.gender,
                                    province: userInfo.province,
                                    city: userInfo.city,
                                    country: userInfo.country
                                });
                                

                                if (!self.data.showSeconds && self.data.phoneNum && self.data.phoneNum.length === 11) {
                                    self.setData({
                                        showSeconds: true
                                    });
                                    let timeRemain = self.data.leftSeconds;
                                    var interval = setInterval(() => {
                                        if (timeRemain > 1) {
                                            timeRemain--;
                                            self.setData({
                                                leftSeconds: timeRemain
                                            })
                                        } else {
                                            self.setData({
                                                showSeconds: false
                                            });
                                            clearInterval(interval);
                                        }
                                    }, 1000);
                                    model('my/sms/send-phone-code', {
                                        phoneNum: self.data.phoneNum
                                    }, 'POST').then(data => {
                                        console.log(data.data.code);
                                        // self.setData({
                                        //     phoneCode: data.data.code
                                        // });
                                    }).catch(e => {
                                        wx.showModal({
                                            title: '提示', //提示的标题,
                                            content: e, //提示的内容,
                                            showCancel: false, //是否显示取消按钮,
                                            cancelColor: '#000000', //取消按钮的文字颜色,
                                            confirmText: '确定', //确定按钮的文字，默认为取消，最多 4 个字符,
                                            confirmColor: '#3CC51F', //确定按钮的文字颜色
                                        });
                                    });
                                }
                            }
                        })
                    })
                } else {
                    console.log('登录失败！' + res.errMsg)
                }
            }
        });
    },


    register() {
        model(`my/user/login`, {
            sysinfo: JSON.stringify(this.data.sysinfo),
            phoneNum: this.data.phoneNum,
            sms_code: this.data.phoneCode,
            openId: wx.getStorageSync('openid'),
            user_name: wx.getStorageSync('personal_info').nickName
        }, 'POST').then(data => {
            this.setData({
                token: data.data,
                auth: true
            })
            try {
                let avatar = data.data.user.avatar
                if (!avatar) {
                    // let imgUrl = wx.getStorageSync('personal_info').avatarUrl
                    let info = wx.getStorageSync('personal_info')
                    this.saveUser(info)
                }
            } catch (e) {
                console.log(e);
            }
            wx.setStorageSync('token', data.data);
            this.dealActor();

            // wx.switchTab({
            //     url: '/pages/store/store'
            // });

        })

    },

    saveUser(info) {
        if (!info) {
            return
        }
        const {
            avatarUrl,
            nickName,
            gender
        } = info
        model('file/qiniu/fetch', {
            sourceUrl: avatarUrl
        }, 'POST').then(res => {
            const {
                code,
                data
            } = res
            if (code === 'suc') {
                let {
                    key,
                    url
                } = data
                if (key) {
                    let _param = {};
                    if (nickName) {
                        _param.userName = nickName
                    }
                    if (gender) {
                        _param.sex = gender
                    }
                    if (key) {
                        _param.avatar = key
                    }
                    model('my/user/update-user', _param, 'POST').then(res => {
                        console.log(res);
                        this.updateCurrentInfo(nickName, gender, url);
                    }).catch(e => {
                        console.log(e, '[exception]: my/user/update-user');
                    })
                }
            }
        })
    },

    updateCurrentInfo(nickName, gender, avatar) {
        if (!nickName && !gender && !avatar) {
            return
        }
        try {
            let token = wx.getStorageSync('token')
            let userInfo = token.user
            let newParam = {};
            if (nickName) {
                newParam.userName = nickName
            }
            if (gender) {
                newParam.sex = gender
            }
            if (avatar) {
                newParam.avatar = avatar
            }
            token.user = Object.assign(userInfo, newParam)
            wx.setStorageSync('token', token)
        } catch (e) {
            console.log(e);
        }
    },

    dealLogin () {
        let self = this;
        wx.getSystemInfo({
            success(res) {
                self.setData({
                    sysinfo: {
                        brand: res.brand,
                        model: res.model,
                        pixelRatio: res.pixelRatio,
                        screenWidth: res.screenWidth,
                        screenHeight: res.screenHeight,
                        statusBarHeight: res.statusBarHeight,
                        windowWidth: res.windowWidth,
                        windowHeight: res.windowHeight,
                        language: res.language,
                        version: res.version,
                        platform: res.platform,
                        fontSizeSetting: res.fontSizeSetting,
                        SDKVersion: res.SDKVersion
                    }
                });
                console.log(self.data.sysinfo);
                wx.hideLoading();
            }
        })
        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            })
        }

        let openid = wx.getStorageSync('openid')
        // this.setData({
        //     auth: openid
        // })
    },

    dealPhone: function (e) {
        this.setData({
            phoneNum: e.detail.value,
            actived: this.data.phoneCode.length > 0 && e.detail.value.length > 0
        });
        if (this.data.phoneNum.length === 11) {
            this.setData({
                canGetVerify: true
            })
        } else {
            this.setData({
                canGetVerify: false
            })
        }
    },

    dealVerify(e) {
        this.setData({
            phoneCode: e.detail.value,
            actived: this.data.phoneNum.length > 0 && e.detail.value.length > 0
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
    goStore () {
        wx.switchTab({ url: '/pages/store/store' });
    },

    // goShare () {

    // }
})
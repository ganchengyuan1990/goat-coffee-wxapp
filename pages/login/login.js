// pages/user/user.js
const app = getApp();

import model from '../../utils/model';

import apiObject from '../../utils/api';
Page({


    getPhoneNum: function () {
        wx.showActionSheet({
            itemList: ['客服电话：101-097-77'],
            success: function (res) {
                wx.makePhoneCall({
                    phoneNumber: '101-097-77',
                })
            }
        })
    },

    dealTapPhone() {
        this.setData({
            showButtonLineName: true,
            showButtonLinePhone: false
        })
    },

    dealTapVerify() {
        this.setData({
            showButtonLineName: false,
            showButtonLinePhone: true
        })
    },

    dealPhone: function(e) {
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

    dealVerify (e) {
        this.setData({
            phoneCode: e.detail.value,
            actived: this.data.phoneNum.length > 0 && e.detail.value.length > 0
        })
    },

    getMessage () {
        if (!this.data.showSeconds && this.data.phoneNum && this.data.phoneNum.length === 11) {
            model('my/sms/send-phone-code', {
                phoneNum: this.data.phoneNum
            }, 'POST').then(data => {
                this.setData({
                    showSeconds: true
                });
                console.log(data.data.code);
                // this.setData({
                //     phoneCode: data.data.code
                // });
                let timeRemain = this.data.leftSeconds;
                var interval = setInterval(() => {
                    if (timeRemain > 1) {
                        timeRemain--;
                        this.setData({
                            leftSeconds: timeRemain
                        })
                    } else {
                        this.setData({
                            showSeconds: false,
                            leftSeconds: 60
                        });
                        clearInterval(interval);
                    }
                }, 1000);
            }).catch(e => {
                if (typeof (e) === 'object') {
                    wx.showModal({
                        title: '提示', //提示的标题,
                        content: '您的网络已断开，请重新连接网络', //提示的内容,
                        showCancel: false, //是否显示取消按钮,
                        cancelColor: '#000000', //取消按钮的文字颜色,
                        confirmText: '确定', //确定按钮的文字，默认为取消，最多 4 个字符,
                        confirmColor: '#f50000', //确定按钮的文字颜色
                    });
                }
                if (e && e.indexOf('mobile number') >= 0) {
                    wx.showModal({
                        title: '提示', //提示的标题,
                        content: '请输入正确手机号', //提示的内容,
                        showCancel: false, //是否显示取消按钮,
                        cancelColor: '#000000', //取消按钮的文字颜色,
                        confirmText: '确定', //确定按钮的文字，默认为取消，最多 4 个字符,
                        confirmColor: '#f50000', //确定按钮的文字颜色
                    });
                } else if (e && e.indexOf('触发天级流控') >= 0) {
                    wx.showModal({
                        title: '提示', //提示的标题,
                        content: '当2日验证码获取超过次数，请24小时以后再试', //提示的内容,
                        showCancel: false, //是否显示取消按钮,
                        cancelColor: '#000000', //取消按钮的文字颜色,
                        confirmText: '确定', //确定按钮的文字，默认为取消，最多 4 个字符,
                        confirmColor: '#f50000', //确定按钮的文字颜色
                    });
                } else if (e && e.indexOf('触发小时级流控') >= 0) {
                    wx.showModal({
                        title: '提示', //提示的标题,
                        content: '验证码获取超过次数，请过1小时再试', //提示的内容,
                        showCancel: false, //是否显示取消按钮,
                        cancelColor: '#000000', //取消按钮的文字颜色,
                        confirmText: '确定', //确定按钮的文字，默认为取消，最多 4 个字符,
                        confirmColor: '#f50000', //确定按钮的文字颜色
                    });
                } else if (e && e.indexOf('触发分钟级流控') >= 0) {
                    wx.showModal({
                        title: '提示', //提示的标题,
                        content: '操作太频繁，请过1分钟再试', //提示的内容,
                        showCancel: false, //是否显示取消按钮,
                        cancelColor: '#000000', //取消按钮的文字颜色,
                        confirmText: '确定', //确定按钮的文字，默认为取消，最多 4 个字符,
                        confirmColor: '#f50000', //确定按钮的文字颜色
                    });
                } else {
                    wx.showModal({
                        title: '提示', //提示的标题,
                        content: e, //提示的内容,
                        showCancel: false, //是否显示取消按钮,
                        cancelColor: '#000000', //取消按钮的文字颜色,
                        confirmText: '确定', //确定按钮的文字，默认为取消，最多 4 个字符,
                        confirmColor: '#f50000', //确定按钮的文字颜色
                    });
                }
            });
        }
    },

    register () {
        if (!this.data.phoneCode) {
            this.setData({
                errorToastShown: true,
                errorInfo: '请输入验证码'
            })
        } else {
            model(`my/user/login`, {
                sysinfo: JSON.stringify(this.data.sysinfo),
                phoneNum: this.data.phoneNum,
                sms_code: this.data.phoneCode,
                openId: wx.getStorageSync('openid'),
                user_name: wx.getStorageSync('personal_info').nickName
            }, 'POST').then(data => {
                this.setData({
                    token: data.data
                })
                try {
                    let avatar = data.data.user && data.data.user.avatar
                    if (!avatar) {
                        // let imgUrl = wx.getStorageSync('personal_info').avatarUrl
                        let info = wx.getStorageSync('personal_info')
                        this.saveUser(info)
                    }
                } catch (e) {
                    console.log(e);
                }
                wx.setStorageSync('token', data.data);
                if (this.data.fromPin) {
                    let pages = getCurrentPages();
                    let prevPage = pages[pages.length - 2];
                    console.log(pages)
                    if (prevPage) {
                        prevPage.setData({
                            fromLogin: true,
                            pinType: this.data.pinType
                        });
                    }
                    
                    // wx.navigateTo({
                    //   url: `/pages/pin/pin_detail/pin_detail?id=${this.data.pinId}&fromLogin=1&pinType=${this.data.pinType}` //返回的页面数，如果 delta 大于现有页面数，则返回到首页,
                    // });
                    wx.redirectTo({
                        url: `/pages/pin/checkout/checkout` //返回的页面数，如果 delta 大于现有页面数，则返回到首页,
                    });
                } else if (this.data.fromTransport) {
                    wx.redirectTo({
                        url: `/pages/my/address/address?fromLogin=1` //返回的页面数，如果 delta 大于现有页面数，则返回到首页,
                    });
                } else if (this.data.fromInvite) {
                    wx.redirectTo({
                        url: `/package/invite/pages/inviteOthers/invite` //返回的页面数，如果 delta 大于现有页面数，则返回到首页,
                    });
                } else if (this.data.fromPocket) {
                    wx.redirectTo({
                        url: '/package/coffeePocket/pages/pocketCart/cart'
                    });
                } else {
                    wx.switchTab({
                        url: '/pages/index/index'
                    });
                }
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
                                self.setData({
                                    auth: true
                                })
                            }
                        })
                    })
                } else {
                    console.log('登录失败！' + res.errMsg)
                }
            }
        });
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
            const {code, data} = res
            if (code === 'suc') {
                let { key, url } = data
                if (key) {
                    model('my/user/update-user', {
                        avatar: key,
                        userName: nickName,
                        sex: gender
                    }, 'POST').then(res => {
                        console.log(res);
                        if (res.code === 'suc') {
                            this.updateCurrentInfo(url)
                        }
                    }).catch(e => {
                        console.log(e, '[exception]: my/user/update-user');
                    })
                }
            }
        })
    },
    updateCurrentInfo(avatar) {
        if (!avatar) {
            return
        }
        try {
            let token = wx.getStorageSync('token')
            let userInfo = token.user
            token.user = Object.assign(userInfo, {avatar: avatar})
            wx.setStorageSync('token', token)
        } catch (e) {
            console.log(e);
        }
    },
    /**
     * 页面的初始数据
     */
    data: {
        title: "hbchjejh",
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
        fromTransport: false,
        phoneCode: '',
        token: '',
        sysinfo: {},
        auth: false,
        showSeconds: false,
        actived: false,
        fromPin: false,
        fromInvite: false,
        fromPocket: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (options.fromTransport) {
            this.setData({
                fromTransport: true
            })
        }
        if (options.from === 'pin') {
            this.setData({
                fromPin: true,
                pinType: options.pinType,
                pinId: options.pinType
            })
        }
        if (options.from === 'invite') {
            this.setData({
                fromInvite: true
            })
        }
        if (options.from === 'pocket') {
            this.setData({
                fromPocket: true
            })
        }
        let self = this;
        if (wx.getStorageSync('token')) {
            wx.switchTab({
                url: '/pages/index/index'
            });
        } else {
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
                }
            })
            if (app.globalData.userInfo) {
                this.setData({
                    userInfo: app.globalData.userInfo,
                    hasUserInfo: true
                })
            }
            
            let openid = wx.getStorageSync('openid')
            this.setData({
                auth: openid
            })
        }
        
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },

})
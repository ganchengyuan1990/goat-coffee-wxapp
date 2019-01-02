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
            this.setData({
                showSeconds: true
            });
            let timeRemain = this.data.leftSeconds;
            var interval = setInterval(() => {
                if (timeRemain > 1) {
                    timeRemain--;
                    this.setData({
                        leftSeconds: timeRemain
                    })
                } else {
                    this.setData({
                        showSeconds: false
                    });
                    clearInterval(interval);
                }
            }, 1000);
            model('my/sms/send-phone-code', {
                phoneNum: this.data.phoneNum
            }, 'POST').then(data => {
                console.log(data.data.code);
                this.setData({
                    phoneCode: data.data.code
                });
            })
        }
    },

    register () {
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
                let avatar = data.data.user.avatar
                if (!avatar) {
                    // let imgUrl = wx.getStorageSync('personal_info').avatarUrl
                    let info = wx.getStorageSync('personal_info')
                    this.saveUserAvatar(info)
                }
            } catch(e) {
                console.log(e);
            }
            wx.setStorageSync('token', data.data);
            if (this.data.fromPin) {
                let pages = getCurrentPages();
                let prevPage = pages[pages.length - 2];
                prevPage.setData({
                    fromLogin: true,
                    pinType: this.data.pinType
                });
                wx.navigateTo({
                  url: `/pages/pin/pin_detail/pin_detail?id=${this.data.pinId}&fromLogin=1&pinType=${this.data.pinType}` //返回的页面数，如果 delta 大于现有页面数，则返回到首页,
                });
            }
            wx.switchTab({
                url: '/pages/store/store'
            });
            
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
    saveUserAvatar(info) {
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
        phoneCode: '',
        token: '',
        sysinfo: {},
        auth: false,
        showSeconds: false,
        actived: false,
        fromPin: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (options.from === 'pin') {
            this.setData({
                fromPin: true,
                pinType: options.pinType,
                pinId: options.pinType
            })
        }
        let self = this;
        if (wx.getStorageSync('token')) {
            wx.switchTab({ url: '/pages/store/store' });
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
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

    dealTapName() {
        this.setData({
            showButtonLineName: true,
            showButtonLinePhone: false
        })
    },

    dealTapPhone() {
        this.setData({
            showButtonLineName: false,
            showButtonLinePhone: true
        })
    },

    getMessage () {
        model('my/sms/sendPhoneCode', {
            phoneNum: 17602183915
        }, 'POST').then(data => {
            this.setData({
                phoneCode: data.data
            })
        })
    },

    register () {
        model('my/user/login', {
            phoneNum: this.data.phoneNum,
            sms_code: this.data.phoneCode,
            openId: wx.getStorageSync('openid'),
            sysinfo: JSON.stringify(this.data.sysinfo)
        }, 'POST').then(data => {
            this.setData({
                token: data.data
            })
            wx.setStorageSync('token', data.data);
        })
    },

    getUserInfo() {
        let self = this;
        wx.login({
            success: function (res) {
                if (res.code) {
                    model('my/user/getOpenId', {
                        code: res.code
                    }).then(res => {
                        wx.setStorageSync('openid', res.data);
                    })
                } else {
                    console.log('登录失败！' + res.errMsg)
                }
            }
        });
    },

    /**
     * 页面的初始数据
     */
    data: {
        title: "hbchjejh",
        phoneNum: 17602183915,
        placeOrderNotice: '23232323',
        placeOrderNoticeShown: true,
        leftButtonText: '去登录',
        otherFunctionText: '确定',
        leftSeconds: 60,
        errorToastShown: true,
        errorInfo: 'sdsdsds',
        showButtonLineName: false,
        showButtonLinePhone: false,
        phoneCode: '',
        token: '',
        sysinfo: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
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
            }
        })
        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            })
        }
        let timeRemain = this.data.leftSeconds;
        var interval = setInterval(() => {
            if (timeRemain > 1) {
                timeRemain--;
                this.setData({
                    leftSeconds: timeRemain
                })
            } else {
                clearInterval(interval);
            }
        }, 1000);
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
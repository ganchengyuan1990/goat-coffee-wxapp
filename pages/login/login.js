// pages/user/user.js
const app = getApp();
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

    /**
     * 页面的初始数据
     */
    data: {
        title: "hbchjejh",
        phoneNum: 15553598117,
        placeOrderNotice: '23232323',
        placeOrderNoticeShown: true,
        leftButtonText: '去登录',
        otherFunctionText: '确定',
        leftSeconds: 60,
        errorToastShown: true,
        errorInfo: 'sdsdsds',
        showButtonLineName: false,
        showButtonLinePhone: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
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
// pages/user/user.js
const app = getApp();
Page({
  getPhoneNum: function() {
    wx.showActionSheet({
      itemList: ['客服电话：101-097-77'],
      success: function(res) {
        wx.makePhoneCall({
          phoneNumber: '101-097-77',
        });
      }
    });
  },

  /**
   * 页面的初始数据
   */
  data: {
    title: 'hbchjejh',
    phoneNum: 15553598117
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

});
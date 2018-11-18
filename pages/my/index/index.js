const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userInfo = wx.getStorageSync('token')
    let userInfoWechat = app.globalData.userInfo
    if (userInfo.token) {
      console.log(userInfo, 'userinfo');
      console.log(userInfoWechat, 'wechat');

      this.setData({
        userInfo: userInfo.user,
        userInfoWechat: userInfoWechat
      })
    } else {
      wx.redirectTo({
        url: '/pages/login/login'
      })
    }
    this.setData({
      name: userInfo.userName ? userInfo.userName : userInfoWechat.nickName,
      gender: userInfo.sex ? userInfo.sex : userInfoWechat.gender,
      img: userInfo.avatar ? userInfo.avatar : userInfoWechat.avatarUrl
    })
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
  goProfile() {
    wx.navigateTo({
      url: '/pages/my/profile/profile'
    })
  }
})
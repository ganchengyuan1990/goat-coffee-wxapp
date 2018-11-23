const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    token: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let token = wx.getStorageSync('token')
    this.setData({
      token: token
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
    this.getProfile()
  },
  onPullDownRefresh() {
    wx.stopPullDownRefresh()
  },
  getProfile() {
    let info = this.data.token
    let userInfo = info.user
    let userInfoWechat = app.globalData.userInfo || {}
    if (info.token) {
      console.log(info.user, 'userinfo');
      console.log(userInfoWechat, 'wechat');

      this.setData({
        userInfo: userInfo,
        userInfoWechat: userInfoWechat
      })
    } else {
      wx.redirectTo({
        url: '/pages/login/login'
      })
      return
    }
    this.setData({
      name: userInfo.userName ? userInfo.userName : userInfoWechat.nickName,
      gender: userInfo.sex ? userInfo.sex : userInfoWechat.gender,
      img: userInfo.avatar ? userInfo.avatar : userInfoWechat.avatarUrl
    })
  },
  goProfile() {
    wx.navigateTo({
      url: '/pages/my/profile/profile'
    })
  },
  goCoupon(e) {
    let type = e.currentTarget.dataset.type
    wx.navigateTo({
      url: `/pages/my/coupon/coupon?type=${type}`
    })
  },
  goAddress() {
    wx.navigateTo({
      url: '/pages/my/address_list/address_list'
    })
  }
})
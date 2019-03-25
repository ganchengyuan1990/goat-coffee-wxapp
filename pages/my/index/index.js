const app = getApp();

import model from '../../../utils/model'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    token: {},
    banner: 'http://img.goatup.net/img/banner/0322-wode-yaoqingdebei.jpg'
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

  setTabStatus() {
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
        }
      }).catch(e => {

      });
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
    console.log('onshow');
    
    this.getProfile()
    this.setTabStatus();
  },
  onPullDownRefresh() {
    wx.stopPullDownRefresh()
  },
  getProfile() {
    let info = wx.getStorageSync('token')
    let userInfo = info.user
    // let userInfoWechat = app.globalData.userInfo || {}
    let userInfoWechat = wx.getStorageSync('personal_info') || {}
    if (info.token) {
      // console.log(info.user, 'userinfo');
      // console.log(userInfoWechat, 'wechat');
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
      name: userInfo.userName || userInfoWechat.nickName || '',
      img: userInfo.avatar || userInfoWechat.avatarUrl
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

  goPocket () {
    wx.navigateTo({
      url: '/package/coffeePocket/pages/pocket/pocket'
    });
  },
  goAddress() {
    wx.navigateTo({
      url: '/pages/my/address_list/address_list'
    })
  },

  goInvite () {
    wx.navigateTo({
      url: "/package/invite/pages/inviteOthers/invite"
    })
  }
})
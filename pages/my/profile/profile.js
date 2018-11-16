const app = getApp()
import model from '../../../utils/model'
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
    if (app.globalData.userInfo) {
      console.log(app.globalData.userInfo);
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
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
  showGenderList() {
    wx.showActionSheet({
      itemList: ['男', '女'],
      success(res) {
        console.log(res.tapIndex)
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
  },
  goEdit() {
    wx.navigateTo({
      url: '/pages/my/profile/edit'
    })
  },
  chooseImage() {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
      }
    })
  },
  saveProfile() {
    let obj = {

    }
    model('my/user/updateUser', obj, 'POST').then(res => {
      wx.showToast({
        title: '修改成功',
        icon: 'success',
        duration: 1500
      })
    }).catch(e => {
      wx.showToast({
        title: '修改失败',
        icon: 'fail',
        duration: 1500
      })
    })
  }

})
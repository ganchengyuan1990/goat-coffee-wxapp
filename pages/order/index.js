import model from '../../utils/model.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.fetchOrderList()
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
  fetchOrderList() {
    let userInfo = wx.getStorageSync('token')
    if (!userInfo.token) {
      wx.navigateTo({
        url: '/pages/login/login'
      })
      return
    }
    model('order/detail/list', {
      page: 1,
      userId: userInfo.user.id
    }).then(res => {
      console.log('order res', res)
      const {data} = res
      if (data && data.length > 0) {
        this.setData({
          orderList: data
        })
      }
    })
  }
})
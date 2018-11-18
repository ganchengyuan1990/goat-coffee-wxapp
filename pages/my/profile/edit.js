import model from '../../../utils/model'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputValue: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let name = options.name
    this.setData({
      inputValue: name
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  saveName() {
    let pages = getCurrentPages()
    let prevPage = pages[pages.length - 2]
    prevPage.setData({ //直接给上移页面赋值
      name: this.data.inputValue
    })
    wx.navigateBack({
      delta: 1
    })
  },
  bindKeyInput(e) {
    this.setData({
      inputValue: e.detail.value
    })
  }
})
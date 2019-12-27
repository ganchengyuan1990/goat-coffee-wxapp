
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
    let iptVal = this.data.inputValue.trim()
    if (!iptVal.trim()) {
      wx.showToast({
        title: '姓名不能为空',
        icon: 'none'
      })
      return
    }
    let pages = getCurrentPages()
    let prevPage = pages[pages.length - 2]
    prevPage.setData({ //直接给上一个页面赋值
      name: iptVal,
      goBackFromName: true
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
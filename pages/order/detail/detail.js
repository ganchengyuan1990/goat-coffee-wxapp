// pages/order/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: {},
    dtype: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let data = decodeURIComponent(options.data)
    if (data) {
      this.formatData(data)
    } else {
      // wx.showModal({
      //   title: '提示',

      // })
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
  formatData(data) {
    let detail = JSON.parse(data || '{}')
    console.log(detail, 'data');
    let dtype = detail.dtype
    if (dtype === 'order') {
      let list = detail.detailList || []
      list.forEach(item => {
        item.spec = item.skuName + '/' + item.props
      })
      this.setData({
        dtype: 'order',
        detail: detail
      })
    }
    if (dtype === 'group') {
      
      this.setData({
        dtype: 'group',
        detail: detail
      })
    }

  }
})
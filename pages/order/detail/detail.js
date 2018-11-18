// pages/order/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: {}
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
    let list = detail.orderDetail_list || []
    list.forEach(item => {
      let props = JSON.parse(item.props || '[]')
      let propArr = props.map(i => {
        return i.val.val
      }, '')
      item.spec = propArr.join('/')
    })
    this.setData({
      detail: detail
    })
  }
})
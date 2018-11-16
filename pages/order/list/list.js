
import model from '../../../utils/model.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList: [],
    page: 1,
    isLoading: false,
    isFilterShow: false,
    isCompleted: false,
    orderType: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let userInfo = wx.getStorageSync('token')
    console.log(userInfo);
    if (!userInfo.token) {
      wx.navigateTo({
        url: '/pages/login/login'
      })
      return
    }
    this.setData({
      userInfo: userInfo
    })
    wx.startPullDownRefresh()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    console.log('fetching');
    this.setData({
      page: 1
    })
    setTimeout(()=>{this.fetchOrderList(1)}, 2000)
    this.fetchOrderList(1)
  },
  onReachBottom() {
    let isCompleted = this.data.isCompleted
    if (isCompleted) {
      return
    }
    let page = this.data.page
    // wx.showLoading({
    //   title: '加载中',
    // })
    this.fetchOrderList(page + 1)
  },
  fetchOrderList(page=1) {
    if (this.data.isLoading) {
      return
    }
    this.setData({
      isLoading: true
    })
    model('order/detail/list', {
      page: page,
      userId: 1 // TODOS
    }).then(res => {
      console.log('order res', res)
      const {data} = res
      if (data && data.length > 0) {
        let list = this.data.orderList
        list = list.concat(data)
        this.setData({
          orderList: list,
          page: page
        })
      } else {
        this.setData({
          isCompleted: true
        })
      }
      this.setData({
        isLoading: false
      })
      wx.stopPullDownRefresh()
    }).catch(e => {
      wx.stopPullDownRefresh()
    })
  },
  showCategory() {

  },
  showDetail(e) {
    let item = e.currentTarget.dataset.item
    if (item) {
      wx.navigateTo({
        url: `/pages/order/detail/detail?data=${encodeURIComponent(JSON.stringify(item))}`
      })
    }
  }
})
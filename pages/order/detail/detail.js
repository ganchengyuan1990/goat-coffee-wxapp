// pages/order/detail.js
import drawQrcode from '../../../utils/qrcode.js'
import model from '../../../utils/model.js';

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
    console.log(this.data.detail.orderNo);
    drawQrcode({
      width: 200,
      height: 200,
      canvasId: 'myQrcode',
      // ctx: wx.createCanvasContext('myQrcode'),
      text: this.data.detail.orderNo,
      // text: 'https://www.jasongan.cn/index.html',
      // v1.0.0+版本支持在二维码上绘制图片
      image: {
        imageResource: '../../images/icon.png',
        dx: 70,
        dy: 70,
        dWidth: 60,
        dHeight: 60
      }
    })
  },
  formatData(data) {
    let detail = JSON.parse(data || '{}')
    // console.log(detail, 'data');
    let dtype = detail.dtype
    if (dtype === 'order') {
      let list = detail.detailList || []
      list.forEach(item => {
        item.spec = item.skuName + (item.props && `/${item.props}`)
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

  },
  fetchOrderDetail() {
    model('/order/detail/detail', {
      orderClassify:2,
      id: 122
    }).then(res => {
      
    })
  },
  goRedPack () {
    wx.navigateTo({
      url: `/pages/pay/share_success/share_success?orderId=${this.data.detail.id}`
    });
  }
})
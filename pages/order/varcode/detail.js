// pages/order/detail.js
import drawQrcode from '../../../utils/qrcode.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderNo: '',
    varCode: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let detail = JSON.parse(options.detail);
    this.setData({
      orderNo: detail.orderNo,
      varCode: detail.orderState === '100' ? '100' : detail.varCode
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
    drawQrcode({
      width: 200,
      height: 200,
      canvasId: 'myQrcode',
      // ctx: wx.createCanvasContext('myQrcode'),
      text: this.data.orderNo,
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
  }
})
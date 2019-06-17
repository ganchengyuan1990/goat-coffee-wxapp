// pages/order/detail.js
// import drawQrcode from '../../../utils/qrcode.js'
const QR = require('../../../utils/weapp-qrcode.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderNo: '',
    varCode: '',
    qrcodeURL: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // let detail = JSON.parse(options.detail);
    this.setData({
      orderNo: options.orderNo,
      varCode: options.varCode
    })
    var imgData = QR.drawImg(this.data.orderNo, {
      typeNumber: 4,
      errorCorrectLevel: 'M',
      size: 200
    })
    console.log(imgData);
    this.setData({
      qrcodeURL: imgData
    })
    // drawQrcode({
    //   width: 200,
    //   height: 200,
    //   canvasId: 'myQrcode',
    //   // ctx: wx.createCanvasContext('myQrcode'),
    //   text: this.data.orderNo
    // })
    
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
  }
})
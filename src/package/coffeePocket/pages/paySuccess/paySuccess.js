// var util = require('../../utils/util.js');
// var api = require('../../config/api.js');

var app = getApp();

import model from '../../utils/model.js'


Page({
  data: {
    cupNumber: 3
  },

  onLoad () {
    let pocketOrder = wx.getStorageSync('pocketOrder');
    let cupNumber = 0;
    pocketOrder.buyMap.forEach(element => {
      cupNumber += parseInt(element.number)
    });
    this.setData({
      cupNumber: cupNumber
    });
  },

  goPocket() {
    wx.navigateTo({
      url: '/package/coffeePocket/pages/pocket/pocket'
    });
  },

  goStore() {
    wx.switchTab({
      url: '/pages/store/store'
    });
  },
})
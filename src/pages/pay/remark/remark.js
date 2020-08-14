// var util = require('../../../utils/util.js');
// var api = require('../../../config/api.js');
// const pay = require('../../../services/pay.js');
import model from '../../../utils/model';

var app = getApp();

Page({
  data: {
    content: '',
    nai: false,
    zhi: false,
    tang: false
  },
  onLoad: function (options) {
    // this.dealOptions(options);
  },

  chooseZhi () {
    this.setData({
      zhi: true
    });
  },

  notChooseZhi() {
    this.setData({
      zhi: false
    });
  },

  chooseNai () {
    this.setData({
      nai: true
    });
  },

  notChooseNai() {
    this.setData({
      nai: false
    });
  },

  chooseTang() {
    this.setData({
      tang: true
    });
  },

  notChooseTang() {
    this.setData({
      tang: false
    });
  },

  dealName(e) {
    this.setData({
      content: e.detail.value
    })
  },

  dealOptions (options) {
    this.setData({
      content: options.remark
    })
  },

  commitRemark() {
    let content = '';
    content += `${this.data.zhi ? '需要纸巾；' : ''}`;
    // content += `${this.data.nai ? '' : '不'}需要奶包；`;
    content += `${this.data.tang ? '需要糖包；' : ''}`;
    
    content += `其他备注：${this.data.content}`;
    wx.setStorageSync('remark', content);
    let pages = getCurrentPages();
    let currPage = pages[pages.length - 1]; //当前页面
    let prevPage = pages[pages.length - 2]; //上一个页面
    prevPage.setData({
      goBackFromRemark: true
    });
    wx.navigateBack({
      delta: 1 //返回的页面数，如果 delta 大于现有页面数，则返回到首页,
    });
  },

  onReady: function () {
    // 页面渲染完成

  },
  onShow: function () {

  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  }
})
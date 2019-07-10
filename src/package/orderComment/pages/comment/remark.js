// var util = require('../../../utils/util.js');
// var api = require('../../../config/api.js');
// const pay = require('../../../services/pay.js');
import model from '../../utils/model';

var app = getApp();

Page({
  data: {
    satisfy: true,
    content: '',
    orderId: '',
    otherQues: '',
    type: 0,
    items: [{
        name: '超时送达',
        value: '超时送达'
      },
      {
        name: '产品口味',
        value: '产品口味',
      },
      {
        name: '服务态度',
        value: '服务态度'
      },
      {
        name: '产品包装',
        value: '产品包装'
      },
      {
        name: '产品洒漏',
        value: '产品洒漏'
      },
      {
        name: '其他问题',
        value: '其他问题'
      },
    ],
    goBackFromRemark: false,
    pics: ''
  },
  onLoad: function (options) {
    // this.dealOptions(options);
    this.setData({
      orderId: options.orderId
    })
  },

  commitRemark() {
    if (this.data.satisfy == 4 && !this.data.otherQues) {
      wx.showToast({
        title: '麻烦请先填写原因，谢谢！', //提示的内容,
        icon: 'none', //图标,
        duration: 2000, //延迟时间,
        mask: true, //显示透明蒙层，防止触摸穿透,
        success: res => {}
      });
      return ;
    }
    let tipsType = 100;
    if (this.data.type === '产品口味') {
      tipsType = 3;
    }
    if (this.data.type === '超时送达') {
      tipsType = 2;
    }
    if (this.data.type === '服务态度') {
      tipsType = 4;
    }
    if (this.data.type === '产品包装') {
      tipsType = 5;
    }
    if (this.data.type === '产品洒漏') {
      tipsType = 6;
    }
    model('order/comment/create', {
        orderId: this.data.orderId,
        evaluate: this.data.satisfy ? 2 : 4,
        commentText: this.data.otherQues,
        tipsType: tipsType,
        pics: this.data.satisfy ? '' : this.data.pics
      }, 'POST').then(res => {
      if (res.code === 'suc') {
        wx.showToast({
          title: '提交成功！', //提示的内容,
          icon: 'none', //图标,
          duration: 2000, //延迟时间,
          mask: true, //显示透明蒙层，防止触摸穿透,
          success: res => {
            setTimeout(() => {
              wx.navigateBack({
                delta: 1 //返回的页面数，如果 delta 大于现有页面数，则返回到首页,
              });
            }, 1500);
          }
        });
      }
    }).catch(e => {
      wx.showToast({
          title: e, //提示的内容,
          icon: 'none', //图标,
          duration: 2000, //延迟时间,
          mask: true, //显示透明蒙层，防止触摸穿透,
          success: res => {}
        });
    });
  },

  onReady: function () {
    // 页面渲染完成

  },
  onShow: function () {
    if (this.data.goBackFromRemark) {
      // this.setData({

      // })
    }
  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  },

  chooseSatisfy () {
    this.setData({
      satisfy: true
    })
  },

  chooseNotSatisfy() {
    this.setData({
      satisfy: false
    })
  },

  radioChange(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);
    this.setData({
      type: e.detail.value
    })
    wx.navigateTo({
      url: `/package/orderComment/pages/remark/remark?orderId=${this.data.orderId}&type=${e.detail.value}`
    });
  },

  
})
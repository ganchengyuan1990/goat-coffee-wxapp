// pages/order/detail.js
import model from '../../../utils/model.js';

import {
  formatTime
} from '../../../utils/util';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: {},
    dtype: '',
    waitTime: '',
    id: '',
    orderClassify: '',
    showDialog: false,
    actImage: 'http://img.goatup.net/image/gzh/gzhtanchuang.png',
    enableOrderActivity: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // let data = decodeURIComponent(options.data)
    let id = options.id
    let orderClassify = options.orderClassify
    if (id && orderClassify) {
      // this.formatData(data)
      this.setData({
        id: id,
        orderClassify: orderClassify,
      });
      model('base/site/user-config-list').then(res => {
        this.setData({
          enableOrderActivity: res.data['enable-order-activity']
        });
        const configData = wx.getStorageSync('configData');
        if (this.data.enableOrderActivity) {
          this.setData({
            actImage: configData['order-activity'].pic,
            showDialog: Boolean(options.showDialog)
          });
        }
      });
      model(`order/detail/detail?orderClassify=${this.data.orderClassify}&id=${this.data.id}`).then(res => {
        let result = res.data.order;
        result.detailList = res.data.order_detail;
        result.dtype = 'order'
        this.formatData(result)
        model(`home/lbs/get-wait-time?storeId=${this.data.detail.storeId}`).then(res => {
          let waitProcessTime = res.data.waitTime;
          let targetTime = formatTime(new Date(new Date().getTime() + waitProcessTime * 60 * 1000))
          console.log(targetTime);
          this.setData({
            waitTime: targetTime
          });
        }).catch(e => {
          console.log(e)
        })
      }).catch(e => {
        console.log(e)
      })
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
  },
  formatData(data) {
    let detail = data;
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
  // fetchOrderDetail() {
  //   model('/order/detail/detail', {
  //     orderClassify:2,
  //     id: 122
  //   }).then(res => {
      
  //   })
  // },
  goRedPack () {
    wx.navigateTo({
      url: `/pages/pay/share_success/share_success?orderId=${this.data.detail.id}`
    });
  },

  goStore () {
    wx.switchTab({ url: '/pages/store/store' });
  },

  goVarcode () {
    wx.navigateTo({
      url: `/pages/order/varcode/detail?orderNo=${this.data.detail.orderNo}&varCode=${this.data.detail.varCode}`
    });
  },

  goComment () {
    wx.navigateTo({
      url: `/package/orderComment/pages/comment/remark?orderId=${this.data.detail.id}`
    });
  },

  previewImage: function (e) {
    var current = e.target.dataset.src;
    // wx.previewImage({
    //   current: current,
    //   urls: [current]
    // })
     wx.navigateTo({
       url: `/pages/my/coupon/coupon?type=2`
     })
  },

  hideActWrap () {
    this.setData({
      showDialog: false
    })
  }
})
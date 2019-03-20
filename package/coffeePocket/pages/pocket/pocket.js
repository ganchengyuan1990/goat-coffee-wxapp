//jigsaw.js
const utils = require('../../utils/util.js')
var app = getApp();

import model from '../../utils/model';

Page({
  /**
   * 页面的初始数据
   */
  data: {
      startTime:null,//总共游戏时间
      counter:0,//总共游戏步数
      des:9,//
      counter:0,
      highscore:0,
      gameController: 'bindtap = "gameCotrol"',
      numArr: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],//初始化显示值数组
      visArr: ['visible', 'visible', 'visible', 'visible', 'visible', 'visible', 'visible', 'visible', 'hidden'],//初始化显示样式visibility的初始化值
      disabled:false,
      btnMsc:'音乐',
      imgs: {},
      imgMater: 'http://img.jasongan.cn/blues.jpg',
      showLoading: false,
      couponLists: [],
      voucherActivitys: []
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh	:function(){
    this.initGame();
  },

  onLoad () {
    let token = wx.getStorageSync('token');
    if (!token) {
      wx.redirectTo({
        url: '/pages/login/login'
      });
    }
    model(`my/voucher/list?userId=${token.user.id}`).then(data => {
      let vouchers = data.data || [];
      let coupons = []
      if (data.data && data.data.length > 1) {
        vouchers.forEach(item => {
          item.voucher.voucherPrice = parseFloat(item.voucher.voucherPrice).toFixed(1);
          // item.userVouchers.forEach(ele => {
          //     ele.voucher = item.voucher;
          //     ele.voucher_price = parseFloat(ele.voucher_price).toFixed(1);
          //     coupons.push(ele);
          // });
        })
      }

      console.log(vouchers);
      
      this.setData({
        couponLists: vouchers,
        voucherActivitys: data.data.voucherActivitys || [],
      })
    })
  },
    /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let imgs = {
      '1': `${this.data.imgMater}-fang?imageMogr2/gravity/NorthWest/crop/200x200`,
      '2': `${this.data.imgMater}-fang?imageMogr2/gravity/North/crop/200x200`,
      '3': `${this.data.imgMater}-fang?imageMogr2/gravity/NorthEast/crop/200x200`,
      '4': `${this.data.imgMater}-fang?imageMogr2/gravity/West/crop/200x200`,
      '5': `${this.data.imgMater}-fang?imageMogr2/gravity/Center/crop/200x200`,
      '6': `${this.data.imgMater}-fang?imageMogr2/gravity/East/crop/200x200`,
      '7': `${this.data.imgMater}-fang?imageMogr2/gravity/SouthWest/crop/200x200`,
      '8': `${this.data.imgMater}-fang?imageMogr2/gravity/South/crop/200x200`
    };
    this.setData({
      imgs: imgs
    })
  },

  showToast () {
    wx.showModal({
      title: '咖啡钱包说明', //提示的标题,
      content: '1. 咖啡钱包是加油咖啡的优惠充赠和储杯方式；\n2. 您可通过优惠活动提前充购饮品券（ 例如买五赠七）， 也可通过其它方式获得饮品券；\n3. 饮品券分为22元/25元/28元/32元四种， 分别对应四档饮品价格， 结算时， 饮品券可抵扣相应面额的商品费用， 但不包含风味糖浆及配送费， 不设找零， 超额需补差价。\n4. 一次可使用多张饮品券；\n5. 饮品券暂不可与折扣优惠券共同使用；\n6. 咖啡钱包饮品券有效期三年', //提示的内容,
      showCancel: false, //是否显示取消按钮,
      confirmText: '我知道了', //确定按钮的文字，默认为取消，最多 4 个字符,
      confirmColor: '#f50000', //确定按钮的文字颜色,
      success: res => {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    });
  },
  
  //  用户点击右上角分享
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    if (!this.data.id) {
      // todo 返回默认分享信息，比如小程序首页
    }

    return {
      title: '咖啡钱包',
      path: '/pages/index/index',
      success: function (res) {
        console.log('转发失败');
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },

  goDetail (e) {
    console.log(e.currentTarget.dataset.index);
    wx.setStorageSync('couponDetail', this.data.couponLists[e.currentTarget.dataset.index])
    wx.navigateTo({
      url: '/package/coffeePocket/pages/pocketDetail/pocketDetail'
    });
  },

  goCart() {
    wx.navigateTo({
      url: '/package/coffeePocket/pages/pocketCart/cart'
    });
  },
})

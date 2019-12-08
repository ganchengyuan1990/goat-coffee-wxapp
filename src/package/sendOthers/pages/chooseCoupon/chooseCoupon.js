// var util = require('../../utils/util.js');
// var api = require('../../config/api.js');

var app = getApp();

import model from '../../utils/model.js'


Page({
  data: {
    cartGoods: [],
    cartTotal: {
      "goodsCount": 0,
      "goodsAmount": 0.00,
      "checkedGoodsCount": 0,
      "checkedGoodsAmount": 0.00
    },
    couponLists: [],
    checkedAllStatus: true,
    isNeedFee: false,
    countGift: 0,
    addtionalLists: [],
    word: '',
    cardIndex: -1
  },
  onLoad: function (options) {
    wx.showLoading({
      title: 'Loading...', //提示的内容,
      mask: true, //显示透明蒙层，防止触摸穿透,
      success: res => {}
    });
    this.setData({
      word: decodeURIComponent(options.word),
      cardIndex: options.cardIndex
    })
    model('activity/voucher/info').then(data => {
      let vouchers = data.data.vouchers;
      vouchers.forEach(item => {
        item.num = 0;
        item.additional = false;
        item.voucher_price = parseFloat(item.voucher_price).toFixed(1);
      })
      this.setData({
        couponLists: vouchers,
        voucherActivitys: data.data.voucherActivitys,
      });
      wx.hideLoading();
    })
  },
  onReady: function () {
    // 页面渲染完成

  },
  onShow: function () {
    // 页面显示
    // this.getCartList();
  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  },

  getCartList: function () {
    let that = this;
    util.request(api.CartList).then(function (res) {
      if (res.errno === 0) {
        console.log(res.data);
        that.setData({
          cartGoods: res.data.cartList,
          cartTotal: res.data.cartTotal
        });
      }

      that.setData({
        checkedAllStatus: that.isCheckedAll()
      });
    });
  },
  isCheckedAll: function () {
    //判断购物车商品已全选
    return this.data.cartGoods.every(function (element, index, array) {
      if (element.checked == true) {
        return true;
      } else {
        return false;
      }
    });
  },

  calcCartTotal(cartGoods) {
    let totalAmount = 0;
    let totalCount = 0;
    cartGoods.forEach(item => {
      totalAmount += parseFloat(item.voucher_price) * item.num;
      totalCount += item.num;
    });
    // console.log(totalAmount);
    return {
      checkedGoodsCount: totalCount,
      checkedGoodsAmount: parseFloat(totalAmount).toFixed(1)
    };
  },

  increaseRoomCount (e) {
    let index = parseInt(e.currentTarget.dataset.index);
    let cartGoods = Object.assign(this.data.couponLists);
    cartGoods[index].num = cartGoods[index].num + 1;
    let list = [];
    cartGoods.forEach(item => {
      list.push({
        voucherId: item.id,
        number: item.num
      });
    })
    model('activity/voucher/cal-gift', {list: list}).then(data => {
      if (data.data.voucher) {
        data.data.voucher.additional = true;
        data.data.voucher.num = data.data.countGift;
        
        this.setData({
          countGift: data.data.countGift,
          addtionalLists: [data.data.voucher]
        });
      }
      if (data.data.voucherActivity) {
        wx.setStorageSync('voucherActivityId', data.data.voucherActivity.id);
      } else {
        this.setData({
          addtionalLists: []
        });
      }
    }).catch(e => {

    });
    this.setData({
      couponLists: cartGoods,
      cartTotal: this.calcCartTotal(cartGoods)
    });
  },

  decreaseRoomCount (e) {
    let index = parseInt(e.currentTarget.dataset.index);
    let cartGoods = Object.assign(this.data.couponLists);
    

    
    if (cartGoods[index].num == 0) {
    } else {
      cartGoods[index].num = cartGoods[index].num - 1;
      let list = [];
      cartGoods.forEach(item => {
        list.push({
          voucherId: item.id,
          number: item.num
        });
      })

      model('activity/voucher/cal-gift', {
        list: list
      }).then(data => {
        if (data.data.voucher) {
          data.data.voucher.additional = true;
          data.data.voucher.num = data.data.countGift;

          this.setData({
            countGift: data.data.countGift,
            addtionalLists: [data.data.voucher]
          });
        } else {
          this.setData({
            addtionalLists: []
          });
        }
      }).catch(e => {

      });
      this.setData({
        couponLists: cartGoods,
        cartTotal: this.calcCartTotal(cartGoods)
      });
    }
  },


  checkedItem: function (event) {
    let itemIndex = event.target.dataset.itemIndex;
    let that = this;
    if (!this.data.isEditCart) {
      let cartGoods = that.data.cartGoods;
      cartGoods[itemIndex].checked = !cartGoods[itemIndex].checked;
      that.setData({
        cartGoods: cartGoods,
        checkedAllStatus: that.isCheckedAll(),
        cartTotal: this.calcCartTotal(cartGoods)
      });

      // that.setData({
      //   checkedAllStatus: that.isCheckedAll()
      // });
      // util.request(api.CartChecked, { productIds: that.data.cartGoods[itemIndex].product_id, isChecked: that.data.cartGoods[itemIndex].checked ? 0 : 1 }, 'POST').then(function (res) {
      //   if (res.errno === 0) {
      //     console.log(res.data);
      //     that.setData({
      //       cartGoods: res.data.cartList,
      //       cartTotal: res.data.cartTotal
      //     });
      //   }

      //   that.setData({
      //     checkedAllStatus: that.isCheckedAll()
      //   });
      // });
    } else {
      //编辑状态
      let tmpCartData = this.data.cartGoods.map(function (element, index, array) {
        if (index == itemIndex) {
          element.checked = !element.checked;
        }

        return element;
      });

      that.setData({
        cartGoods: tmpCartData,
        checkedAllStatus: that.isCheckedAll(),
        'cartTotal.checkedGoodsCount': that.getCheckedGoodsCount()
      });
    }
  },
  getCheckedGoodsCount: function () {
    let checkedGoodsCount = 0;
    this.data.cartGoods.forEach(function (v) {
      if (v.checked === true) {
        checkedGoodsCount += v.number;
      }
    });
    console.log(checkedGoodsCount);
    return checkedGoodsCount;
  },
  checkedAll: function () {
    let that = this;

    if (!this.data.isEditCart) {
      let cartGoods = this.data.cartGoods
      cartGoods.forEach(item => {
        item.checked = !item.checked;
      });
      that.setData({
        checkedAllStatus: that.isCheckedAll(),
        cartGoods: cartGoods,
        cartTotal: this.calcCartTotal(cartGoods)
      });
    } else {
      //编辑状态
      let checkedAllStatus = that.isCheckedAll();
      let tmpCartData = this.data.cartGoods.map(function (v) {
        v.checked = !checkedAllStatus;
        return v;
      });

      that.setData({
        cartGoods: tmpCartData,
        checkedAllStatus: that.isCheckedAll(),
        'cartTotal.checkedGoodsCount': that.getCheckedGoodsCount()
      });
    }

  },

  updateCart: function (productId, goodsId, number, id) {
    let that = this;

    that.setData({
      checkedAllStatus: that.isCheckedAll()
    });

    // util.request(api.CartUpdate, {
    //   productId: productId,
    //   goodsId: goodsId,
    //   number: number,
    //   id: id
    // }, 'POST').then(function (res) {
    //   if (res.errno === 0) {
    //     console.log(res.data);
    //     that.setData({
    //       //cartGoods: res.data.cartList,
    //       //cartTotal: res.data.cartTotal
    //     });
    //   }

    //   that.setData({
    //     checkedAllStatus: that.isCheckedAll()
    //   });
    // });

  },
  
  checkoutOrder(e) {
    let self = this
    let token = wx.getStorageSync('token').token
    if (!token) {
      wx.navigateTo({
        url: '/pages/login/login?from=pocket'
      })
      return
    }

    // if (this.data.cartTotal.checkedGoodsAmount == 0) {
    //   wx.showToast({
    //     icon: 'none',
    //     title: '请选择商品',
    //     duration: 1500
    //   })
    //   return ;
    // }

    
    const url = `/package/sendOthers/pages/success/success`

    // const url = `/packages/coffeePocket/pages/checkout/checkout?fromTransportIndex=${this.data.fromTransport && this.data.fromTransport.idx}&data=${encodeURIComponent(JSON.stringify(obj))}&tab=${isNeedFee?'delivery':'selftaking'}`
    // this.setData({
    //   isCartPanelShow: false
    // })
    // wx.showTabBar()
    // this.toggleCart()
    wx.navigateTo({
      url: url,
      success() {
        self.setData({
          // cartGoods: [],
          // resultPrice: -1,
          isLoadStorageCart: true
        })
      }
    })
  },
  deleteCart: function () {
    //获取已选择的商品
    let that = this;

    // let chosenProduct = this.data.cartGoods.filter((element, index, array) => {
    //   return element.checked == true;
    // });

    // if (chosenProduct.length <= 0) {
    //   return false;
    // }

    let chosenProductIds = [];
    let cartList = [];
    let cartTotal = this.data.cartTotal;
    this.data.cartGoods.forEach(function (element, index, array) {
      if (element.checked == true) {
        chosenProductIds.push(index);
        cartTotal.checkedGoodsCount -= element.number;
        cartTotal.checkedGoodsAmount -= parseFloat(element.price * parseInt(element.number)).toFixed(2);
      } else {
        cartList.push(element);
      }
    });
    

    that.setData({
      cartGoods: cartList,
      cartTotal: cartTotal
    });


    that.setData({
      checkedAllStatus: that.isCheckedAll()
    });


    // util.request(api.CartDelete, {
    //   productIds: productIds.join(',')
    // }, 'POST').then(function (res) {
    //   if (res.errno === 0) {
    //     console.log(res.data);
    //     let cartList = res.data.cartList.map(v => {
    //       console.log(v);
    //       v.checked = false;
    //       return v;
    //     });

        
    // });
  },

  toast (e) {
    let index = e.currentTarget.dataset.index;
    let type = e.currentTarget.dataset.type;
    wx.showModal({
      title: '说明', //提示的标题,
      content: type == 1 ? this.data.couponLists[index].voucher_bref : this.data.addtionalLists[index].voucher_bref, //提示的内容,
      showCancel: false, //是否显示取消按钮,
      cancelColor: '#000000', //取消按钮的文字颜色,
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
  }
})
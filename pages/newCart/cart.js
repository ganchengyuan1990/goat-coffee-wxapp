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
    checkedAllStatus: true,
    isNeedFee: false,
    showImg: true,
    cartImage: '',
    loading: true
  },
  onLoad: function (options) {

    let configData = wx.getStorageSync('configData');
    let token = wx.getStorageSync('token');
    if (!token) {
      wx.hideLoading();
      wx.redirectTo({
        url: '/pages/login/login'
      });
    }
    wx.showLoading({
      title: 'Loading...', //提示的内容,
      mask: true, //显示透明蒙层，防止触摸穿透,
      success: res => {}
    });
    // 页面初始化 options为页面跳转所带来的参数
    let cartInfo = [];
    if (wx.getStorageSync('CART_LIST'))  {
     cartInfo = JSON.parse(wx.getStorageSync('CART_LIST'));
    }
    let fromTransport = wx.getStorageSync('fromTransport');
    debugger
    this.setData({
      isNeedFee: fromTransport == 'deliver',
      cartImage: configData['cart-image']
      // cartGoods: cartInfo,
      // cartTotal: this.calcCartTotal(cartInfo || [])
    });

    wx.removeStorageSync('fromTransport');
  },
  onReady: function () {
    // 页面渲染完成

  },
  onShow: function () {
    this.getCartInfo();
    // 页面显示
    // this.getCartList();
  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  },

  getCartInfo () {
     let storeInfo = wx.getStorageSync('STORE_INFO')
     if (storeInfo) {
       storeInfo = JSON.parse(storeInfo);
     } else {
       storeInfo = {};
     }
     this.setData({
       storeInfo: storeInfo
     })

     model(`home/cart/list?storeId=${this.data.storeInfo.id}`).then(data => {
       let {
         carts
       } = data.data;
       carts.forEach(item => {
         item.unitPrice = parseFloat(item.unitPrice).toFixed(2);
         item.propsStr = [];
         item.rPropGoodsArray.forEach(ele => {
           item.propsStr.push(ele.propValue.prop_value);
         });
         item.propsStr = item.propsStr.join('/');
       });
       this.setData({
         cartGoods: carts,
         cartTotal: this.calcCartTotal(carts),
         loading: false
       });
       wx.hideLoading();
     }).catch(e => {
       wx.hideLoading();
       this.setData({
         loading: false
       });
       console.log(e);
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
      if (item.ifAvailable) {
        totalAmount += parseFloat(item.unitPrice) * item.num;
        totalCount += item.num;
      }
    });
    console.log(totalAmount);
    return {
      checkedGoodsCount: totalCount,
      checkedGoodsAmount: parseFloat(totalAmount).toFixed(2)
    };
  },

  increaseRoomCount (e) {
    if (e.currentTarget.dataset.available !== true) {
      return ;
    }
    let index = parseInt(e.currentTarget.dataset.index);
    let cartGoods = Object.assign(this.data.cartGoods);
    cartGoods[index].num = cartGoods[index].num + 1;
    this.setData({
      cartGoods: cartGoods,
      cartTotal: this.calcCartTotal(cartGoods)
    });
    model(`home/cart/change-number`, {
      skuId: cartGoods[index].sku.id,
      rPropGoodsIds: cartGoods[index].rPropGoodsIds.join(','),
      num: cartGoods[index].num
    }, 'POST').then(data => {
      debugger
      wx.setTabBarBadge({
        index: 3,
        text: sum.toString()
      });
    }).catch(e => {
      console.log(e);
    });
  },

  decreaseRoomCount (e) {
    // if (e.currentTarget.dataset.available !== true) {
    //   return;
    // }
    let index = parseInt(e.currentTarget.dataset.index);
    let cartGoods = Object.assign(this.data.cartGoods);
    // this.setData({
    //   cartGoods: cartGoods
    // });
    
    if (cartGoods[index].num == 1) {
      wx.showModal({
        title: '', //提示的标题,
        content: '确定不要了吗？', //提示的内容,
        showCancel: true, //是否显示取消按钮,
        cancelText: '取消', //取消按钮的文字，默认为取消，最多 4 个字符,
        cancelColor: '#000000', //取消按钮的文字颜色,
        confirmText: '确定', //确定按钮的文字，默认为取消，最多 4 个字符,
        confirmColor: '#f50000', //确定按钮的文字颜色,
        success: res => {
          if (res.confirm) {
            let cartGoods = Object.assign(this.data.cartGoods);
            model(`home/cart/change-number`, {
              skuId: cartGoods[index].sku.id,
              rPropGoodsIds: cartGoods[index].rPropGoodsIds.join(','),
              num: cartGoods[index].num - 1
            }, 'POST').then(data => {}).catch(e => {
              console.log(e);
            });
            cartGoods[index].num = cartGoods[index].num - 1;
            cartGoods.splice(index, 1);
            this.setData({
              cartGoods: cartGoods,
              cartTotal: this.calcCartTotal(cartGoods)
            });
            
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      });
    } else {
      cartGoods[index].num = cartGoods[index].num - 1;
      this.setData({
        cartGoods: cartGoods,
        cartTotal: this.calcCartTotal(cartGoods)
      });
      model(`home/cart/change-number`, {
        skuId: cartGoods[index].sku.id,
        rPropGoodsIds: cartGoods[index].rPropGoodsIds.join(','),
        num: cartGoods[index].num
      }, 'POST').then(data => {
      }).catch(e => {
        console.log(e);
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
        url: '/pages/login/login'
      })
      return
    }
    // let isOpen = this.checkStoreState()
    // if (!isOpen) {
    //   return
    // }
    let info = this.data
    let cartList = info.cartGoods.filter(item => item.ifAvailable);
    let totalPrice = info.cartTotal.checkedGoodsAmount;
    let isNeedFee = info.isNeedFee

    // console.log(cartList, 'cartList')
    if (cartList.length === 0) {
      wx.showToast({
        icon: 'none',
        title: '请选择商品'
      })
      return
    }
    let products = cartList.map(item => {
      return Object.assign({}, {
        productName: item.goods.name,
        productId: item.goods.id,
        skuId: item.sku.id,
        skuName: item.sku.name,
        number: item.num,
        // price: item.sku.sale_price,
        price: item.unitPrice,
        productPropIds: item.rPropGoodsIds.join(','),
        spec: item.propsStr
      })
    })
    let fee = isNeedFee ? this.data.storeInfo.deliverFee : 0
    let obj = {
      storeId: this.data.storeInfo.id,
      userAddressId: this.data.userAddressInfo && this.data.userAddressInfo.id || info.userAddressId,
      deliverFee: fee,
      payAmount: totalPrice,
      orderType: info.isNeedFee ? 2 : 1,
      product: products
    }

    const url = `/pages/pay/checkout/checkout?fromTransportIndex=${this.data.fromTransport && this.data.fromTransport.idx}&data=${encodeURIComponent(JSON.stringify(obj))}&tab=${isNeedFee?'delivery':'selftaking'}`
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

  goStore () {
    wx.switchTab({ url: '/pages/store/store' });
  },

  goInvite () {
    wx.navigateTo({
      url: '/package/invite/pages/inviteOthers/invite'
    });
  }
})
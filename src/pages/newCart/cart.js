var app = getApp();

import model from '../../utils/model.js';

Page({
  data: {
    cartGoods: [],
    cartTotal: {
      'goodsCount': 0,
      'goodsAmount': 0.00,
      'checkedGoodsCount': 0,
      'checkedGoodsAmount': 0.00
    },
    checkedAllStatus: true,
    isNeedFee: false,
    showImg: true,
    cartImage: '',
    loading: true,
    hasLogin: true,
    banners: [],
    deliverFees: [],
    deliverMention: '',
    errorToastShown: false,
    errorInfo: '',
    sum: 0
  },
  onLoad: function (options) {

    
  },

  onClickAvatar () {
    wx.navigateTo({
      url: '/pages/login/login'
    });
  },

  addPriceBuy (e) {
    wx.showLoading({
      title: '加载中', //提示的内容,
      mask: true, //显示透明蒙层，防止触摸穿透,
      success: res => {}
    });
    let {
      cartGoods
    } = this.data;
    let param = {
      checked: true,
      // "id": 32445,
      'num': 1,
      'goods': e.detail,
      'sku': e.detail.default_sku,
      'rPropGoodsIds': [],
      'unitPrice': parseFloat(e.detail.default_sku.member_price).toFixed(2),

      'orinalPrice': parseFloat(e.detail.default_sku.price || e.detail.default_sku.sale_price).toFixed(2),
      'rPropGoodsArray': [],
      'ifAvailable': true
    };
    let key_list = e.detail.key_list;
    let rPropGoodsIdsArr = [];
    key_list.map(item => {
      item.val_list.map(ele => {
        if (ele.isdefault) {
          rPropGoodsIdsArr.push(ele.prop_id);
        }
      });
      return item;
    });

    param = {
      cartId: e.detail.id,
      // skuId: e.detail.default_sku.id,
      // rPropGoodsIds: rPropGoodsIdsArr.join(','),
      num: 1
    };
    model('home/cart/change-number', param, 'POST').then(data => {
      this.getCartInfo();
    }).catch(e => {
      console.log(e);
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
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 3
      });
    }
    let token = wx.getStorageSync('token');
    let recommend = wx.getStorageSync('recommend');
    let configData = wx.getStorageSync('configData');
    let sum = wx.getStorageSync('cartSum');
    this.setData({
      checkedAllStatus: true,
      sum: sum
    });
    // if (!token) {
    //   wx.hideLoading();
    //   wx.redirectTo({
    //     url: '/pages/login/login'
    //   });
    // }
    if (configData) {
      this.setData({
        banners: configData.cartBanners
      });
    }
    if (!token) {
      // wx.hideLoading();
      // wx.navigateTo({
      //   url: '/pages/login/login'
      // });
      this.setData({
        hasLogin: false
      });
      return;
    } else {
      wx.showLoading({
        title: '加载中', //提示的内容,
        mask: true, //显示透明蒙层，防止触摸穿透,
        success: res => {}
      });
      this.setData({
        hasLogin: true
      });
    }
    if (token) {
      this.getCartInfo();
      this.getAchievement();
    }
    if (recommend) {
      recommend.map(item => {
        if (item.default_sku.sale_price) {
          if (item.default_sku.sale_price == parseInt(item.default_sku.sale_price)) {
            item.default_sku.sale_price = parseInt(item.default_sku.sale_price);
          } else {
            item.default_sku.sale_price = parseFloat(item.default_sku.sale_price).toFixed(1);
          }
        }
        if (item.default_sku.price) {
          if (item.default_sku.price == parseInt(item.default_sku.price)) {
            item.default_sku.price = parseInt(item.default_sku.price);
          } else {
            item.default_sku.price = parseFloat(item.default_sku.price).toFixed(1);
          }
        }
        item.num = 0;
        return item;
      });
    }    
    let fromTransport = wx.getStorageSync('fromTransport');
    this.setData({
      isNeedFee: fromTransport == 'deliver',
      recommend: recommend
      // cartGoods: cartInfo,
      // cartTotal: this.calcCartTotal(cartInfo || [])
    });

    let shopClosed = wx.getStorageSync('key');
    //  wx.removeStorageSync('fromTransport');
    // 页面显示
    // this.getCartList();
  },
  onHide: function () {
    // 页面隐藏
    wx.setStorageSync('cartSum', this.data.sum);
  },
  onUnload: function () {
    // 页面关闭
    // wx.setStorageSync('cartSum', this.data.sum)

  },

  openDevByMultyClick() {
    this.clickNum = this.clickNum || 0;
    ++this.clickNum;
    console.log(this.clickNum);

    if (!this.setTimeoutNum) {
      this.setTimeoutNum = setTimeout(() => {
        this.clickNum = 0;
        clearTimeout(this.setTimeoutNum);
        this.setTimeoutNum = 0;
      }, 1000);
    }

    if (this.clickNum > 5) {
      wx.navigateTo({
        url: '/pages/devtools/index',
      });
    }
  },

  getAchievement() {
    model('my/achievement/info', {}, 'POST').then(res => {
      // debugger
      let result = res.data;
      let total;
      let user_info = result.user_info;
      if (user_info.member_recharge && user_info.member_gift_recharge) {
        total = parseFloat(user_info.member_recharge) + parseFloat(user_info.member_gift_recharge);
        result.member_total_recharge = (total == parseInt(total) ? parseInt(total) : parseFloat(total).toFixed(1));
      } else if (user_info.member_recharge && !user_info.member_gift_recharge) {
        total = parseFloat(user_info.member_recharge);
        result.member_total_recharge = (total == parseInt(total) ? parseInt(total) : parseFloat(total).toFixed(1));
      }

      if (result.targetAchievementDesign) {
        result.capsRate = (result.achievementCups / result.targetAchievementDesign.caps * 100);
      }
      this.setData({
        memberData: result
      });
      wx.setStorageSync('memberData', result);
    });
  },

  getCartInfo () {
    wx.showLoading({
      title: '加载中', //提示的内容,
      mask: true, //显示透明蒙层，防止触摸穿透,
      success: res => {}
    });
    let storeInfo = wx.getStorageSync('STORE_INFO');
    if (storeInfo) {
      storeInfo = JSON.parse(storeInfo);
    } else {
      storeInfo = {};
    }
    this.setData({
      storeInfo: storeInfo
    });

    model(`home/cart/list?storeId=${this.data.storeInfo.id}`).then(data => {
      let {
        carts
      } = data.data;
      let sum = 0;
      carts.map(item => {
        //  item.ifAvailable = false;
        //  item.sku.can_distribution = 0;
        item.unitPrice = parseFloat(item.unitPrice).toFixed(1);
        item.orinalPrice = parseFloat(item.sku.price || item.sku.sale_price).toFixed(1);
        item.memberPrice = parseFloat(item.memberUnitPrice).toFixed(1);
        item.propsStr = [];
        item.propsStr.push(item.sku.name);
        item.rPropGoodsArray.forEach(ele => {
          item.propsStr.push(ele.propValue.prop_value);
          if (parseFloat(ele.propValue.price)) {
            item.orinalPrice = parseFloat(item.orinalPrice) + parseFloat(ele.propValue.price);
          }
        });
        item.propsStr = item.propsStr.join('/');
        item.checked = true;
        sum += item.num;
        return item;
      });
      // wx.setStorageSync('cartSum', sum);
      if (sum) {
        wx.setTabBarBadge({
          index: 1,
          text: sum.toString()
        });
      } else {
        wx.removeTabBarBadge({
          index: 1,
        });
      }
      let cartTotal = this.calcCartTotal(carts);
      this.setData({
        cartGoods: carts,
        cartTotal: cartTotal,
        deliverMention: this.getLalaText(cartTotal),
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

  getLalaText(cartTotal) {
    let storeInfo = this.data.storeInfo;
    let _result = true;
    let _string = '';
    if (storeInfo.deliverFees && storeInfo.deliverFees.length > 0 && wx.getStorageSync('fromTransport') == 'deliver') {
      this.setData({
        deliverFees: storeInfo.deliverFees
      });
      // storeInfo.deliverFees = [storeInfo.deliverFees[1]];
      storeInfo.deliverFees.forEach(item => {
        if (item.cup_amount) {
          if (cartTotal.checkedGoodsCount >= item.cup_amount) {
            _result = false;
          } else {
            // _result = true;
            _string = `还差${parseInt(item.cup_amount) - parseInt(cartTotal.checkedGoodsCount)}杯免配送费`;
          }
          return ;
        }
        if (item.money_amount) {
          item.money_amount = (item.money_amountt == parseInt(item.money_amount) ? parseInt(item.money_amount) : parseFloat(item.money_amount).toFixed(1));
          cartTotal.checkedGoodsAmount = (cartTotal.checkedGoodsAmount == parseInt(cartTotal.checkedGoodsAmount) ? parseInt(cartTotal.checkedGoodsAmount) : parseFloat(cartTotal.checkedGoodsAmount).toFixed(1));
          if (cartTotal.checkedGoodsAmount >= item.money_amount) {
            _result = false;
          } else {
            // _result = true;
            let sss = parseFloat(item.money_amount) - parseFloat(cartTotal.checkedGoodsAmount);
            _string = `还差${sss == parseInt(sss) ? parseInt(sss) : parseFloat(sss).toFixed(1)}元免配送费`;
          }
        }
        // return item;
      });
      console.log(_result, 999);
      console.log(_string);
    }
    let fromTransport = wx.getStorageSync('fromTransport');
    if (fromTransport == 'selfTaking') {
      _result = '';
    } else {
      if (cartTotal.checkedGoodsAmount == 0) {
        _result = '';
      }
    }
    return _result ? _string : '';
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
    let totalOriginalAmount = 0;
    cartGoods.forEach(item => {
      if (item.ifAvailable && item.checked) {
        totalAmount += parseFloat(item.memberPrice) * item.num;
        totalOriginalAmount += parseFloat(item.orinalPrice !== 'NaN' ? item.orinalPrice : item.unitPrice) * item.num;
        totalCount += item.num;
      }
    });
    // console.log(totalAmount);
    return {
      checkedGoodsCount: totalCount,
      checkedGoodsAmount: parseFloat(totalAmount).toFixed(1), 
      totalOriginalAmount: parseFloat(totalOriginalAmount).toFixed(1),
    };
  },

  increaseRoomCount (e) {
    let cartGoods = Object.assign(this.data.cartGoods);
    let index = parseInt(e.currentTarget.dataset.index);
    let param = {};
    if (e.currentTarget.dataset.kind !== 'add') {
      // if (e.currentTarget.dataset.available != true ) {
      //   return;
      // }
      cartGoods[index].num = cartGoods[index].num + 1;
      param = {
        cartId: cartGoods[index].id,
        // skuId: cartGoods[index].sku.id,
        // rPropGoodsIds: cartGoods[index].rPropGoodsIds.join(','),
        num: cartGoods[index].num
      };
    } else {
      let recommend = Object.assign(this.data.recommend);
      recommend[index].num = recommend[index].num + 1;
      cartGoods = cartGoods.concat(recommend[index]);
      let cartTotal = this.calcCartTotal(cartGoods);
      this.setData({
        cartGoods: cartGoods,
        cartTotal: cartTotal,
        deliverMention: this.getLalaText(cartTotal),
      });
      param = {
        // skuId: recommend[index].sku_list[0].propSkuId,
        cartId: recommend[index].id,
        // rPropGoodsIds: cartGoods[index].rPropGoodsIds.join(','),
        num: recommend[index].num
      };
    }

    model('home/cart/change-number', param, 'POST').then(data => {
      let sum = this.data.sum;
      sum += 1;
      // wx.setStorageSync('cartSum', sum);
      wx.setTabBarBadge({
        index: 1,
        text: sum.toString()
      });
      let cartTotal = this.calcCartTotal(cartGoods);
      this.setData({
        sum: sum,
        cartGoods: cartGoods,
        cartTotal: this.calcCartTotal(cartGoods),
        deliverMention: this.getLalaText(cartTotal),
      });
    }).catch(e => {
      console.log(e);
      wx.showToast({
        title: e, //提示的内容,
        icon: 'none', //图标,
        duration: 2000, //延迟时间,
        mask: true, //显示透明蒙层，防止触摸穿透,
        success: res => {}
      });
      setTimeout(() => {
        this.setData({
          errorToastShown: false
        });
      }, 3000);
    });
  },

  dealItem (e) {
    let index = parseInt(e.currentTarget.dataset.index);
    let cartGoods = JSON.parse(JSON.stringify(this.data.cartGoods));
    wx.showModal({
      title: '', //提示的标题,
      content: '确定不要了吗？', //提示的内容,
      showCancel: true, //是否显示取消按钮,
      cancelText: '取消', //取消按钮的文字，默认为取消，最多 4 个字符,
      cancelColor: '#000000', //取消按钮的文字颜色,
      confirmText: '确定', //确定按钮的文字，默认为取消，最多 4 个字符,
      confirmColor: '#DE4132', //确定按钮的文字颜色,
      success: res => {
        if (res.confirm) {
          model('home/cart/change-number', {
            cartId: cartGoods[index].id,
            // skuId: cartGoods[index].sku.id,
            // rPropGoodsIds: cartGoods[index].rPropGoodsIds.join(','),
            num: 0
          }, 'POST').then(data => {
            let _orinum = cartGoods[index].num;
            cartGoods[index].num = 0;
            cartGoods.splice(index, 1);
            let cartTotal = this.calcCartTotal(cartGoods);

            let sum = this.data.sum;
            // if (cartGoods && cartGoods[index]) {
            //   sum -= 1;
            // } else {
            //   sum = 0;
            // }
            sum -= _orinum;
            this.setData({
              sum: sum,
              cartGoods: cartGoods,
              cartTotal: this.calcCartTotal(cartGoods),
              deliverMention: this.getLalaText(cartTotal),
            });
            if (sum) {
              wx.setTabBarBadge({
                index: 1,
                text: sum.toString()
              });
            } else {
              wx.removeTabBarBadge({
                index: 1,
              });
            }

          }).catch(e => {
            console.log(e);
            let sum = this.data.sum;
            sum -= cartGoods[index].num;
            cartGoods[index].num = 0;
            // wx.setStorageSync('cartSum', sum);
            if (sum) {
              wx.setTabBarBadge({
                index: 1,
                text: sum.toString()
              });
            } else {
              wx.removeTabBarBadge({
                index: 1,
              });
            }
            let cartTotal = this.calcCartTotal(cartGoods);
            this.setData({
              sum: sum,
              errorToastShown: true,
              errorInfo: e, //提示的内容,
              cartGoods: cartGoods,
              deliverMention: this.getLalaText(cartTotal),
              cartTotal: this.calcCartTotal(cartGoods)
            });
            setTimeout(() => {
              this.setData({
                errorToastShown: false
              });
            }, 3000);
          });


        } else if (res.cancel) {
          console.log('用户点击取消');
        }
      }
    });
  },

  decreaseRoomCount (e) {
    // if (e.currentTarget.dataset.available !== true) {
    //   return;
    // }
    let index = parseInt(e.currentTarget.dataset.index);
    let cartGoods = JSON.parse(JSON.stringify(this.data.cartGoods));
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
        confirmColor: '#DE4132', //确定按钮的文字颜色,
        success: res => {
          if (res.confirm) {
            model('home/cart/change-number', {
              cartId: cartGoods[index].id,
              // skuId: cartGoods[index].sku.id,
              // rPropGoodsIds: cartGoods[index].rPropGoodsIds.join(','),
              num: cartGoods[index].num - 1
            }, 'POST').then(data => {

              cartGoods[index].num = cartGoods[index].num - 1;
              cartGoods.splice(index, 1);
              let cartTotal = this.calcCartTotal(cartGoods);
              
              let sum = this.data.sum;
              // if (cartGoods && cartGoods[index]) {
              //   sum -= 1;
              // } else {
              //   sum = 0;
              // }
              sum -= 1;
              this.setData({
                sum: sum,
                cartGoods: cartGoods,
                cartTotal: this.calcCartTotal(cartGoods),
                deliverMention: this.getLalaText(cartTotal),
              });
              if (sum) {
                wx.setTabBarBadge({
                  index: 1,
                  text: sum.toString()
                });
              } else {
                wx.removeTabBarBadge({
                  index: 1,
                });
              }
              
            }).catch(e => {
              console.log(e);
              let sum = this.data.sum;
              sum -= cartGoods[index].num;
              cartGoods[index].num = 0;
              // wx.setStorageSync('cartSum', sum);
              if (sum) {
                wx.setTabBarBadge({
                  index: 1,
                  text: sum.toString()
                });
              } else {
                wx.removeTabBarBadge({
                  index: 1,
                });
              }
              let cartTotal = this.calcCartTotal(cartGoods);
              this.setData({
                sum: sum,
                errorToastShown: true,
                errorInfo: e, //提示的内容,
                cartGoods: cartGoods,
                deliverMention: this.getLalaText(cartTotal),
                cartTotal: this.calcCartTotal(cartGoods)
              });
              setTimeout(() => {
                this.setData({
                  errorToastShown: false
                });
              }, 3000);
            });
            
            
          } else if (res.cancel) {
            console.log('用户点击取消');
          }
        }
      });
    } else {
      model('home/cart/change-number', {
        cartId: cartGoods[index].id,
        // skuId: cartGoods[index].sku.id,
        // rPropGoodsIds: cartGoods[index].rPropGoodsIds.join(','),
        num: cartGoods[index].num - 1
      }, 'POST').then(data => {
        let sum = this.data.sum;
        sum -= 1;
        cartGoods[index].num = cartGoods[index].num - 1;
        let cartTotal = this.calcCartTotal(cartGoods);
        this.setData({
          sum: sum,
          cartGoods: cartGoods,
          deliverMention: this.getLalaText(cartTotal),
          cartTotal: this.calcCartTotal(cartGoods)
        });
        // wx.setStorageSync('cartSum', sum);
        wx.setTabBarBadge({
          index: 1,
          text: sum.toString()
        });
      }).catch(e => {
        console.log(e);
        let sum = this.data.sum;
        sum -= cartGoods[index].num;
        cartGoods[index].num = 0;
        // wx.setStorageSync('cartSum', sum);
        if (sum) {
          wx.setTabBarBadge({
            index: 1,
            text: sum.toString()
          });
        } else {
          wx.removeTabBarBadge({
            index: 1,
          });
        }
        let cartTotal = this.calcCartTotal(cartGoods);
        this.setData({
          sum: sum,
          errorToastShown: true,
          errorInfo: e, //提示的内容,
          cartGoods: cartGoods,
          deliverMention: this.getLalaText(cartTotal),
          cartTotal: this.calcCartTotal(cartGoods)
        });
        setTimeout(() => {
          this.setData({
            errorToastShown: false
          });
        }, 3000);
      });
    }
  },


  checkedItem: function (event) {
    let itemIndex = event.target.dataset.itemIndex;
    let that = this;
    if (!this.data.isEditCart) {
      let cartGoods = that.data.cartGoods;
      cartGoods[itemIndex].checked = !cartGoods[itemIndex].checked;
      let cartTotal = this.calcCartTotal(cartGoods);
      that.setData({
        cartGoods: cartGoods,
        checkedAllStatus: that.isCheckedAll(),
        cartTotal: this.calcCartTotal(cartGoods),
        deliverMention: this.getLalaText(cartTotal),
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
      let cartGoods = this.data.cartGoods;
      cartGoods.forEach(item => {
        item.checked = !item.checked;
      });
      let cartTotal = this.calcCartTotal(cartGoods);
      that.setData({
        checkedAllStatus: that.isCheckedAll(),
        cartGoods: cartGoods,
        deliverMention: this.getLalaText(cartTotal),
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
    let self = this;
    let token = wx.getStorageSync('token').token;
    if (!token) {
      wx.navigateTo({
        url: '/pages/login/login'
      });
      return;
    }
    // let isOpen = this.checkStoreState()
    // if (!isOpen) {
    //   return
    // }
    let info = this.data;
    let gogogo = true;
    let cartList = info.cartGoods.filter(item => {
      // if (this.data.isNeedFee) {
      //   return item.ifAvailable && item.sku.can_distribution;
      // } else {
      //   return item.ifAvailable;
      // }
      if (!item.sku.can_distribution && this.data.isNeedFee) {
        gogogo = false;
      }
      return item.ifAvailable && item.checked;
    });
    if (!gogogo && !this.data.storeInfo.coffeeMakerId) {
      wx.showModal({
        title: '提醒', //提示的标题,
        content: '某些商品不支持外送哦，麻烦您手动删除标红的商品哦', //提示的内容,
        showCancel: true, //是否显示取消按钮,
        cancelText: '取消', //取消按钮的文字，默认为取消，最多 4 个字符,
        cancelColor: '#000000', //取消按钮的文字颜色,
        confirmText: '确定', //确定按钮的文字，默认为取消，最多 4 个字符,
        confirmColor: '#f50000', //确定按钮的文字颜色,
        success: res => {
          
        }
      });
      return ;
    }
    let totalPrice = info.cartTotal.checkedGoodsAmount;
    let isNeedFee = info.isNeedFee;

    // console.log(cartList, 'cartList')
    if (cartList.length === 0) {
      wx.showToast({
        icon: 'none',
        title: '请选择商品'
      });
      return;
    }
    let products = cartList.map(item => {
      return Object.assign({}, {
        productName: item.goods.name,
        productId: item.goods.id,
        skuId: item.sku.id,
        skuName: item.sku.name,
        number: item.num,
        memberPrice: item.memberPrice,
        price: item.orinalPrice !== 'NaN' ? item.orinalPrice : item.unitPrice,
        productPropIds: item.rPropGoodsIds.join(','),
        spec: item.propsStr,
        banner: item.goods.avatar
      });
    });
    let fee = isNeedFee ? this.data.storeInfo.deliverFee : 0;
    let obj = {
      storeId: this.data.storeInfo.id,
      userAddressId: this.data.userAddressInfo && this.data.userAddressInfo.id || info.userAddressId,
      deliverFee: fee,
      payAmount: totalPrice,
      orderType: info.isNeedFee ? 2 : 1,
      product: products
    };
    if (isNeedFee) {
      let chosenAddress = wx.getStorageSync('chosenAddress');
      this.setData({
        fromTransport: chosenAddress
      });
    }

    if (this.data.deliverMention) {
      wx.setStorageSync('deliverMention', this.data.deliverMention);
    } else {
      wx.removeStorageSync('deliverMention');
    }

    const goDirect = !this.data.checkedAllStatus;

    console.log(goDirect, 777);

    const url = `/pages/pay/checkout/checkout?fromTransportId=${this.data.fromTransport && this.data.fromTransport.id}&fromTransportIndex=${this.data.fromTransport && this.data.fromTransport.idx}&data=${encodeURIComponent(JSON.stringify(obj))}&tab=${isNeedFee?'delivery':'selfTaking'}&goDirect=${Number(goDirect)}`;
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
        });
      }
    });
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

  getUserInfo() {
    let self = this;
    wx.login({
      success: function (res) {
        console.log(res);
        if (res.code) {
          model('my/user/get-open-id', {
            code: res.code
          }).then(res => {
            // wx.setStorageSync('openid', res.data);
            wx.setStorageSync('openid', res.data.openid);
            let session_key = res.data.session_key;
            if (res.data.unionid) {
              wx.setStorageSync('unionId', res.data.unionid);
              wx.setStorageSync('unionid', res.data.unionid);
            }
            if (session_key) {
              wx.setStorageSync('session_key', session_key);
            }
            wx.getUserInfo({
              withCredentials: true,
              success: function (res) {
                var userInfo = res.userInfo;
                let iv = res.iv;
                let encryptedData = res.encryptedData;
                console.log(session_key);
                console.log(iv);
                console.log(encryptedData);
                wx.setStorageSync('personal_info', {
                  nickName: userInfo.nickName,
                  avatarUrl: userInfo.avatarUrl,
                  gender: userInfo.gender,
                  province: userInfo.province,
                  city: userInfo.city,
                  country: userInfo.country
                });
                wx.setStorageSync('encryptedData', res);
                self.onClickAvatar();
                self.setData({
                  auth: true
                });
              }
            });
          });
        } else {
          console.log('登录失败！' + res.errMsg);
        }
      }
    });
  },

  touchstart: function (e) {
    this.setData({
      index: e.currentTarget.dataset.index,
      Mstart: e.changedTouches[0].pageX
    });
  },

  touchmove: function (e) {
    //列表项数组
    let list = this.data.cartGoods;
    //手指在屏幕上移动的距离
    //移动距离 = 触摸的位置 - 移动后的触摸位置
    let move = this.data.Mstart - e.changedTouches[0].pageX;
    // 这里就使用到我们之前记录的索引index
    //比如你滑动第一个列表项index就是0，第二个列表项就是1，···
    //通过index我们就可以很准确的获得当前触发的元素，当然我们需要在事前为数组list的每一项元素添加x属性
    list[this.data.index].x = move > 0 ? -move : 0;
    this.setData({
      cartGoods: list
    });
  },

  touchend: function (e) {
    let list = this.data.cartGoods;
    let move = this.data.Mstart - e.changedTouches[0].pageX;
    list[this.data.index].x = move > 100 ? -180 : 0;
    this.setData({
      cartGoods: list
    });
  },
});
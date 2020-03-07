import {
  BigNumber
} from '../../../utils/bignumber.min';

import model from '../../../utils/model.js'


function BN(...args) {
  return new BigNumber(...args)
}
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isselfTaking: {
      type: Boolean,
      value: false
    },
    info: {
      type: Object,
      value: {}
    },
    salesTotalPrice: {
      type: Number,
      value: -1
    },
    basePrice: {
      type: Number,
      value: -1
    },

    isHigh: {
      type: Boolean,
      value: false
    },
    isShow: {
      type: Boolean,
      value: false,
      observer(newVal, oldVal) {
        if (newVal) {
          this.setDefault()
        }
      }
    },

    type: {
      type: Number,
      value: 1
    },
  },
  /**
   * 组件的初始数据
   * skuid, keyid, number, productid
   */
  data: {
    // 展示规格
    customed: '',
    customedKey: '',
    customedVal: '',
    // 展示价格
    price: 0,
    totalPrice: 0,
    count: 1,
    currentSku: {},
    currentProp: [],
    priceTags: [],
    activityName: '',

    toggled: false
  },
  ready() {
    let configData = wx.getStorageSync('configData');
    if (!configData) {
      model('base/site/config-list').then(res => {
        wx.setStorageSync('configData', res.data['config-set']);
        let configData = res.data;
        this.setData({
          activityName: configData['voucher-text']
        })
      });
    } else {
      this.setData({
        activityName: configData['voucher-text']
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {

    toggleShow() {
      this.setData({
        toggled: !this.data.toggled
      });
    },
    setDefault() {
      // 设置默认价格
      try {
        // let obj = this.data.info.sku_list.find(item => {
        //   return item.isdefault === 1
        // })
        let obj = this.data.info.default_sku;
        if (!obj) {
          let key = `info.sku_list[0].isdefault`
          this.setData({
            [key]:1
          })
          obj = this.data.info.sku_list[0]
        }
        let price = parseFloat(obj.orinalPrice);
        let priceTags = [];

        if (obj.orinalPrice && this.data.info.key_list && this.data.info.key_list.length > 0) {
          this.data.info.key_list.forEach(item => {
            item.val_list && item.val_list.forEach(ele => {
              if (ele.isdefault && ele.price) {
                price += ele.price;
                priceTags.push(ele);
              }
            });
          });
        }
        this.setData({
          price: price || '暂无报价',
          priceTags: priceTags,
          count: 1
        })
        this.setPrice()
      } catch (e) {
        this.setData({
          price: '暂无报价'
        })
      }
      // 设置默认规格
      this.getCustomed()
    },
    toggleMenu() {
      this.setData({
        currentSku: {},
        priceTags: [],
        toggled: false
      });
      if (this.data.info && this.data.info.default_sku && this.data.info.default_sku.orinalPrice) {
        this.setData({
          totalPrice: this.data.info.default_sku.orinalPrice
        });
      }
      this.triggerEvent('togglemenu', 'abc')
    },

    /*
     * 合并相同品类
     */
    mergeCart(list) {
      if (!Array.isArray(list)) {
        return
      }
      // 验证skuid， propids, productId一致性
      // count total price

      let cartList = list
      let obj = {}
      cartList.forEach(item => {
        let key = item.customedKey
        let val = obj[key]
        if (val) {
          val.count = BN(val.count).plus(item.count).valueOf()
          val.totalPrice = BN(val.count).multipliedBy(val.price).valueOf()
        } else {
          obj[key] = item
        }
      })
      // let arr = Object.values(obj)
      let arr = []
      for (let i in obj) {
        if (obj[i]) {
          arr.push(obj[i])
        }
      }
      // this.setData({
      //   cartList: arr
      // })
      wx.setStorage({
        key: 'CART_LIST',
        data: JSON.stringify(arr)
      })
    },

    goOrder() {
      if (!wx.getStorageSync('token')) {
        this.toggleMenu();
        wx.navigateTo({
          url: '/pages/login/login'
        });
        return;
      }
      let info = this.data.info
      let spec = this.data.customed
      let skuList = info.sku_list
      let hasDefault = skuList.filter(item => item.isdefault === 1)
      if (!hasDefault) {
        wx.showToast({
          title: '请选择规格',
          icon: 'none'
        })
        return
      }
      let propList = info.key_list
      let propIds = []
      propList.forEach(i => {
        let idObj = i.val_list.find(j => {
          return parseInt(j.id) === parseInt(i.default_val_id)
        })

        if (idObj) {
          propIds.push(idObj.prop_id)
        }
      })

      model(`home/cart/change-number`, {
        ifClearOther: true,
        skuId: hasDefault[0].id,
        rPropGoodsIds: propIds.join(','),
        delta: this.data.count
      }, 'POST').then(data => {
        // let sum = wx.getStorageSync('cartSum');
        // sum += this.data.count;
        // wx.setStorageSync('cartSum', sum)
        // wx.setTabBarBadge({
        //   index: 1,
        //   text: sum.toString()
        // });
        console.log('请求成功');
        console.log(data.data);
        let {
          resultPrice
        } = data.data;
        if (data.data && data.data.discountPrice > 0) {
          this.setData({
            resultPrice: resultPrice
          })
        }
        this.triggerEvent('goorder')
        this.toggleMenu()
      }).catch(e => {
        console.log('请求失败');
        console.log(JSON.stringify(e));
        wx.showToast({
          title: '加入购物车失败', //提示的内容,
          icon: 'none', //图标,
          duration: 1500, //延迟时间,
          mask: true, //显示透明蒙层，防止触摸穿透,
          success: res => {}
        });
      });
    },
    save() {
      if (!wx.getStorageSync('token')) {
        wx.navigateTo({ url: '/pages/login/login' });
        return ;
      }
      let info = this.data.info
      let spec = this.data.customed
      let skuList = info.sku_list
      let hasDefault = skuList.filter(item => item.isdefault === 1)
      if (!hasDefault) {
        wx.showToast({
          title: '请选择规格',
          icon: 'none'
        })
        return
      }
      console.log(spec, 'spec')
      this.triggerEvent('save', Object.assign({}, info, {
        count: this.data.count,
        totalPrice: this.data.totalPrice,
        price: this.data.price,
        spec: spec,
        customedKey: this.data.customedKey
      }))
      
      // let cart = [];
      // if (info) {
      //   cart.push(info)
      // }
      // this.mergeCart(cart)
      // this.toggleMenu();
      // wx.navigateTo({
      //   url: `/pages/newCart/cart?isNeedFee=${this.data.isselfTaking ? 0: 1}`
      // });
      let propList = info.key_list
      let propIds = []
      propList.forEach(i => {
        let idObj = i.val_list.find(j => {
          return parseInt(j.id) === parseInt(i.default_val_id)
        })

        if (idObj) {
          propIds.push(idObj.prop_id)
        }
      })
      model(`home/cart/change-number`, {
        skuId: hasDefault[0].id,
        rPropGoodsIds: propIds.join(','),
        delta: this.data.count
      }, 'POST').then(data => {
        let sum = wx.getStorageSync('cartSum');
        sum += this.data.count;
        wx.setStorageSync('cartSum', sum)
        wx.setTabBarBadge({
          index: 1,
          text: sum.toString()
        });
        console.log('请求成功');
        console.log(data.data);
        let {
          resultPrice
        } = data.data;
        if (data.data && data.data.discountPrice > 0) {
          this.setData({
            resultPrice: resultPrice
          })
        }
        wx.navigateTo({
          url: `/pages/newCart/cart?isNeedFee=${this.data.isselfTaking ? 0: 1}`
        });
      }).catch(e => {
        console.log('请求失败');
        console.log(JSON.stringify(e));
        wx.showToast({
          title: '加入购物车失败', //提示的内容,
          icon: 'none', //图标,
          duration: 1500, //延迟时间,
          mask: true, //显示透明蒙层，防止触摸穿透,
          success: res => {}
        });
      });
    },
    /**
     * 选择规格
     */
    select(e) {
      // wx.showLoading({
      //   title: '加载中', //提示的内容,
      //   mask: true, //显示透明蒙层，防止触摸穿透,
      //   success: res => {}
      // });
      // this.getCustomed();
      let group = e.currentTarget.dataset.group
      let idx = e.currentTarget.dataset.tagidx
      // 规格
      if (group === 'sku') {
      // if (false) {
        let skuKey = `info.sku_list`
        let skuList = this.data.info.sku_list
        let currentSku = skuList[idx]
        skuList.forEach(item => {
          item.isdefault = item.id === currentSku.id ? 1 : 0
        })

        let finalPrice = currentSku.member_price;
        // let finalPrice = this.data.price;
        let customedKey = this.data.customedKey.split('-');

        this.data.info.key_list.forEach(item => {
          item.val_list.forEach(ele => {
            if (ele.price) {
              if (customedKey.indexOf(ele.prop_id.toString()) > -1) {
                finalPrice = parseFloat(ele.price) + parseFloat(finalPrice);
              }
            }
          });
        });
        this.setData({
          [skuKey]: skuList,
          price: finalPrice,
          currentSku: currentSku
        })
        this.setPrice()
      }
      // 其他属性
      if (group === 'opt') {
      // if (true) {
        let groupIdx = e.currentTarget.dataset.groupidx
        let optKey = `info.key_list[${groupIdx}]`
        try {
          // 全部属性
          let propList = this.data.info.key_list
          // 当前属性组
          let optList = propList[groupIdx]
          // 属性id
          let selectedIdx = optList.val_list[idx].id
          optList.default_val_id = selectedIdx;

          let skuList = this.data.info.sku_list
          let currentSku = skuList.filter(item => {
            return item.isdefault === 1;
          })
          

          let customVal = this.data.customVal.split('-');

          let finalPrice = this.data.price;

          let priceTags = JSON.parse(JSON.stringify(this.data.priceTags));

          if (customVal.indexOf(e.currentTarget.dataset.code.toString()) < 0) {
          // if (true) {
            let targetIndex = -1;
            let deltaPrice = 0;

            this.data.info.key_list.forEach((item, index) => {
              item.val_list.forEach(ele => {
                if (e.currentTarget.dataset.code == ele.prop_id) {
                  targetIndex = index;
                  if (ele.price || true) {
                    let flag = true;
                    priceTags.forEach(lll => {
                      if (lll.prop_id === ele.prop_id) {
                        flag = false
                      }
                    })
                    // flag && priceTags.push(ele);
                    if (flag) {
                      // priceTags.push(ele);
                      priceTags = [ele];
                      deltaPrice += parseFloat(ele.price)
                    }
                    // flag && (deltaPrice += parseFloat(ele.price));
                  }
                }
                // if (ele.price) {
                //   if (e.target.dataset.code == ele.prop_id) {
                //     targetItem = ele;
                //     hasFlag = true;
                //     deltaPrice += parseFloat(ele.price);
                //   } else {
                //     deltaPrice -= parseFloat(ele.price);
                //   }
                // }
              });
            });

            // if (deltaPrice !== 0) {
            //   finalPrice = parseFloat(deltaPrice) + parseFloat(finalPrice);
            // } else {
            //   if (targetIndex >= 0) {
            //     this.data.info.key_list[targetIndex].val_list.forEach((item) => {
            //       priceTags.forEach((ele, index) => {
            //         if (item.prop_id === ele.prop_id) {
            //           priceTags.splice(index, 1);
            //         }
            //       })
            //     });
            //   }
            //   finalPrice = parseFloat(currentSku[0].sale_price);
            //   priceTags.forEach(item => {
            //     finalPrice += parseFloat(item.price);
            //   });
            // }
            
            if (targetIndex >= 0 && priceTags.length > 0) {
              let flag = false;
              let targetKid_id = priceTags[priceTags.length - 1].kid;
              // priceTags.some((ele, index) => {
              //   if (ele.kid === targetKid_id) {
              //     priceTags.splice(index, 1);
              //     flag = true;
              //   }
              //   if (flag) {
              //     return true;
              //   }
              // })
                            // priceTags.forEach((ele, index) => {
                            //   if (ele.prop_id === e.currentTarget.dataset.code) {
                            //     // priceTags.splice(index, 1);
                            //     priceTags = [ele]
                            //     flag = true;
                            //     // return false;
                            //   }
                            //   // if (flag) {
                            //   //   return true;
                            //   // }
                            // })

              // debugger
              // this.data.info.key_list[targetIndex].val_list.some((item) => {
              //   priceTags.some((ele, index) => {
              //     if (item.prop_id === ele.prop_id) {
              //       priceTags.splice(index, 1);
              //       flag = true;
              //     }
              //   })
              //   if (flag) {
              //     return true;
              //   }
              // });
            }
            finalPrice = parseFloat(currentSku[0].member_price);
            priceTags.forEach(item => {
              finalPrice += parseFloat(item.price);
            });
          } else {
            // priceTags.forEach((ele, index) => {
            //   if (ele.prop_id == e.currentTarget.dataset.code) {
            //     priceTags.splice(index, 1);
            //   }
            // })
          }

          
          // let _target = optList.val_list.filter(item => item.prop_id == e.target.dataset.code);
          // if (_target) {
          //   finalPrice = _target[0].price ? (parseFloat(_target[0].price) + parseFloat(finalPrice)) : parseFloat(finalPrice);
          // }

          
          this.setData({
            priceTags: priceTags,
            price: finalPrice,
            [optKey]: optList,
            currentProp: propList
          })
          this.setPrice()
        } catch(e) {
          console.log(e)
        }
      }
      this.getCustomed()
      wx.hideLoading();
    },
    /**
     * 增加数量
    */
    increase() {
      let count = this.data.count
      this.setData({
        count: count + 1,
      })
      this.setPrice()
      this.getCustomed()
    },
    /**
     * 减少数量
    */
    decrease() {
      let count = this.data.count
      if (count > 1) {
        this.setData({
          count: count - 1,
        })
        this.setPrice()
        this.getCustomed()
      }
    },
    /**
     * 计算价格
    */
    setPrice() {
      let count = this.data.count
      let price = Number(this.data.price)
      // console.log(BN('0.98').valueOf());
      
      if (!isNaN(price)) {
        this.setData({
          totalPrice: BN(price).multipliedBy(count).valueOf()
        })
      }
    },

    closeMenu () {
      this.toggleMenu();
    },
    /**
     * 获取默认规格
    */
    getCustomed() {
      const query = wx.createSelectorQuery().in(this);
      query.selectAll(".J_opt_item.active").fields({
        dataset: true
      }, res => {
        let list = res
        let tags = []
        let keys = []
        list.forEach(item => {
          tags.push(item.dataset.val)
          keys.push(item.dataset.code)
        });
        let customed = '';
        if (this.data.currentSku.sale_price || (this.data.info && this.data.info.default_sku)) {
          let _price = parseFloat(this.data.currentSku.member_price ? this.data.currentSku.member_price : this.data.info.default_sku.orinalPrice).toFixed(1);
          if (this.data.info.default_sku.price && this.data.info.default_sku.price != this.data.info.default_sku.orinalPrice) {
            _price = this.data.info.default_sku.price;
          }
          customed = `￥${_price * this.data.count}`;

          // this.data.priceTags.forEach(item => {
          //   customed += ` + ${item.val}${item.price * this.data.count}元`
          // });
        }
        
        this.setData({
          customed: customed,
          customedKey: this.data.info && this.data.info.id + '-' + keys.join('-'),
          customVal: keys.slice(1).join('-'),
        })
      }).exec();
    },

    goPocket() {
      wx.navigateTo({
        url: '/package/coffeePocket/pages/pocketCart/cart'
      });
    },

    previewImage: function (e) {
      var current = e.target.dataset.src;
      wx.previewImage({
        current: current,
        urls: [current]
      })
    },
  }
})

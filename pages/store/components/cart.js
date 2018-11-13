// pages/store/components/cart.js
import util from '../../../utils/util.js'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    info: {
      type: Array,
      value: [],
      observer(newVal, oldVal) {
        if (Array.isArray(newVal)) {
          this.setTotalResult()
        }
      }
    },
    fee: {
      type: String,
      value: ''
    },
    isCartPanelShow: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    totalPrice: 0,
    cartTotalPrice: 0,
    count: 1,
    remain: 0
  },
  attached() {

  },
  /**
   * 组件的方法列表
   */
  methods: {
    toggleCart() {
      // let isShow = this.data.isCartPanelShow
      // let self = this

      // if (!isShow) {
      //   this.toggleTabBar(false, () => {
      //     self.setData({
      //       isCartPanelShow: !isShow
      //     })
      //   })
      // } else {
      //   this.toggleTabBar(true)
      //   self.setData({
      //     isCartPanelShow: !isShow
      //   })
      // }
      this.triggerEvent('togglecart')
    },
    // toggleTabBar(isShow, callback) {
    //   if (!isShow) {
    //     wx.hideTabBar({
    //       animation: true,
    //       success() {
    //         callback && callback()
    //       },
    //       fail() {}
    //     })
    //   } else {
    //     wx.showTabBar({
    //       animation: true,
    //       success() {
    //         callback && callback()
    //       },
    //       fail() {}
    //     })
    //   }
    // },
    /**
     * TODOS, 待优化
     *
     */ 
    increase(e) {
      let idx = e.currentTarget.dataset.idx
      let info = this.data.info
      let count = info[idx].count
      let price = info[idx].price
      count++
      console.log(idx, count, 'count')
      info[idx].count = count
      info[idx].totalPrice = util.mul(price, count)
      // this.setData({
      //   info: info
      // })
      this.saveCart(info)
    },
    decrease(e) {
      let idx = e.currentTarget.dataset.idx
      let info = this.data.info
      let count = info[idx].count
      let price = info[idx].price
      count--
      if (count > 0) {
        info[idx].count = count
        info[idx].totalPrice = util.mul(price, count)
        // this.setData({
        //   info: info
        // })
      } else {
        info.splice(idx,1)
        // this.setData({
        //   info: info
        // })
      }
      this.saveCart(info)
    },
    /** 
     * 清空购物车
    */
    clearCart() {
      // this.setData({
      //   totalPrice: 0,
      //   count: 0,
      //   info: []
      // })
      // wx.removeStorage({
      //   key: 'CART_LIST'
      // })
      this.saveCart([])
    },
    saveCart(info) {
      
      this.triggerEvent('save', {
        cartList: info
      })
    },
    setTotalResult() {
      let val = this.data.info
      if (!val) {
        return
      }

      let count = 0
      let totalPrice = 0
      let cartTotalPrice = 0
      let remain = 0
      val.forEach((item) => {
        totalPrice = util.add(totalPrice, item.totalPrice)
        count = util.add(count, item.count)
      }, 0)
      remain = totalPrice > 30 ? 0 : util.sub(30, totalPrice)
      if (remain > 0 && totalPrice > 0) {
        cartTotalPrice = util.add(totalPrice, this.data.fee)
      } else {
        cartTotalPrice = totalPrice
      }
      this.setData({
        count: count,
        totalPrice: totalPrice,
        cartTotalPrice: cartTotalPrice,
        remain: remain
      })
    },
    /*
     * 结算
     */ 
    checkout() {
      this.triggerEvent('checkout', {
        totalPrice: this.data.totalPrice,
        cart: this.data.info
      })
    }
  }
})

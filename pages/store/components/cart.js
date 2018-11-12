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
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isCartPanelShow: false,
    totalPrice: 0,
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
      let isShow = this.data.isCartPanelShow
      let self = this

      if (!isShow) {
        this.toggleTabBar(false, () => {
          self.setData({
            isCartPanelShow: !isShow
          })
        })
      } else {
        this.toggleTabBar(true)
        self.setData({
          isCartPanelShow: !isShow
        })
      }
    },
    toggleTabBar(isShow, callback) {
      if (!isShow) {
        wx.hideTabBar({
          animation: true,
          success() {
            callback && callback()
          },
          fail() {}
        })
      } else {
        wx.showTabBar({
          animation: true,
          success() {
            callback && callback()
          },
          fail() {}
        })
      }
    },
    /**
     * TODOS, 待优化
     *
     */ 
    increase(e) {
      let idx = e.currentTarget.dataset.idx
      let count = this.data.info[idx].count
      let price = this.data.info[idx].price
      count++
      console.log(idx, count, 'count')
      let path = `info[${idx}]`
      this.setData({
        [`${path}.count`]: count,
        [`${path}.totalPrice`]: util.mul(price, count)
      })
      this.setTotalResult()
    },
    decrease(e) {
      let idx = e.currentTarget.dataset.idx
      let count = this.data.info[idx].count
      let price = this.data.info[idx].price
      let path = `info[${idx}]`
      count--
      if (count > 0) {
        this.setData({
          [`${path}.count`]: count,
          [`${path}.totalPrice`]: util.mul(price, count)
        })
      } else {
        let data = this.data.info
        console.log(data, 'cart data');
        data.splice(idx,1)
        this.setData({
          info: data
        })
      }
      this.setTotalResult()
    },
    /** 
     * 清空购物车
    */
    clearCart() {
      this.setData({
        totalPrice: 0,
        count: 0,
        info: []
      })
      wx.removeStorage({
        key: 'CART_LIST'
      })
    },
    setTotalResult() {
      let val = this.data.info
      if (!val) {
        return
      }
      let count = 0
      let totalPrice = 0
      let remain = 0
      val.forEach((item) => {
        totalPrice = util.add(totalPrice, item.totalPrice)
        count = util.add(count, item.count)
      }, 0)
      remain = totalPrice > 30 ? 0 : util.sub(30, totalPrice)
      totalPrice = util.add(totalPrice, this.data.fee)
      this.setData({
        count: count,
        totalPrice: totalPrice,
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

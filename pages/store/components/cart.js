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
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isCartPanelShow: false,
    totalPrice: 0,
    count: 1
  },
  attached() {
    wx.setStorage({
      key: "key",
      data: "value"
    })
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
        this.setTotalResult()
      }
    },
    clearCart() {
      this.setData({
        totalPrice: 0,
        count: 0,
        info: []
      })
    },
    setTotalResult() {
      let val = this.data.info
      if (!val) {
        return
      }
      console.log(val, 'val')
      let count = 0
      let totalPrice = 0
      val.forEach((item) => {
        totalPrice = util.add(totalPrice, item.totalPrice)
        count = util.add(count, item.count)
      }, 0)
      this.setData({
        count: count,
        totalPrice: totalPrice
      })
    }
  }
})

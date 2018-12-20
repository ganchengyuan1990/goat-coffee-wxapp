// pages/store/components/cart.js
import { BigNumber } from '../../../utils/bignumber.min';

function BN(...args) {
  return new BigNumber(...args)
}
const LIMIT_FEE = 36
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
    },
    isSelfTaking: {
      type: Boolean,
      observer(newVal, oldVal) {
        if (typeof newVal !== 'undefined') {
          this.setTotalResult()
        }
      }
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
      this.triggerEvent('togglecart')
    },
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
      info[idx].totalPrice = BN(price).multipliedBy(count).valueOf()
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
        info[idx].totalPrice = BN(price).multipliedBy(count).valueOf()
      } else {
        info.splice(idx,1)
      }
      this.saveCart(info)
    },
    /** 
     * 清空购物车
    */
    clearCart() {
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
        totalPrice = BN(totalPrice).plus(item.totalPrice).valueOf()
        count = BN(count).plus(item.count).valueOf()
      }, 0)
      remain = totalPrice > LIMIT_FEE ? 0 : BN(LIMIT_FEE).minus(totalPrice).valueOf()
      if (remain > 0 && totalPrice > 0 && !this.data.isSelfTaking) {
        cartTotalPrice = BN(totalPrice).plus(this.data.fee || 0).valueOf()
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

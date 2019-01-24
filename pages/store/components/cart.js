// pages/store/components/cart.js
import { BigNumber } from '../../../utils/bignumber.min';
if (!Array.prototype.includes) {
  Object.defineProperty(Array.prototype, 'includes', {
    value: function (searchElement, fromIndex) {
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }

      var o = Object(this);
      var len = o.length >>> 0;
      if (len === 0) {
        return false;
      }
      var n = fromIndex | 0;
      var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
      while (k < len) {
        if (o[k] === searchElement) {
          return true;
        }
        k++;
      }
      return false;
    }
  });
}
function BN(...args) {
  return new BigNumber(...args)
}
// const LIMIT_FEE = 36
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
    rules: {
      type: Array,
      value: []
    },
    isCartPanelShow: {
      type: Boolean,
      value: false
    }, 
    salesTotalPrice: {
      type: Number,
      value: -1
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
    remain: 0,
    needDeliveryFee: true,
    deliveryMoneyAmount: 36
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
      let price = info[idx].sale_price || info[idx].price
      count++
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
      let price = info[idx].sale_price || info[idx].price
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
      this.setData({
        salesTotalPrice: -1
      })
    },
    saveCart(info) {
      this.triggerEvent('save', {
        cartList: info
      });
    },
    checkDeliverFee(totalPrice=0, idList = [], rules=[]) {
      let isNeedFee = true
      let moneyAmount = this.data.deliveryMoneyAmount
      for (let i = 0; i < rules.length; i++) {
        const rule = rules[i];
        if (rule.money_amount) {
          moneyAmount = rule.money_amount
          if (totalPrice < BN(rule.money_amount).valueOf()) {
            continue
          }
        }
        if (rule.cup_amount) {
          let count = 0
          let cList = rule.classifyIds
          idList.forEach(i => {
            if (cList.includes(i.cid)) {
              count += i.count
            }
          })
          if (count < rule.cup_amount) {
            continue
          }
        }
        isNeedFee = false
      }
      return {
        isNeedFee,
        moneyAmount
      } 
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
      let classifyIds = []
      val.forEach((item) => {
        totalPrice = BN(totalPrice).plus(item.totalPrice).valueOf()
        count = BN(count).plus(item.count).valueOf()
        classifyIds.push({
          cid: item.classifyId+'',
          count: item.count
        })
      }, 0)
      let feeObj = this.checkDeliverFee(totalPrice, classifyIds, this.data.rules)
      
      if (feeObj.isNeedFee) {
        this.setData({
          deliveryMoneyAmount: parseFloat(feeObj.moneyAmount)
        })
        remain = BN(feeObj.moneyAmount).minus(totalPrice).valueOf()
      }
      // remain = totalPrice > LIMIT_FEE ? 0 : BN(LIMIT_FEE).minus(totalPrice).valueOf()
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

// pages/store/components/cart.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    info: {
      type: Array,
      value: []
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
    }
  }
})

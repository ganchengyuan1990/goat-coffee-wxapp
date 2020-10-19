Component({
  data: {
    selected: 0,
    color: '#f50000',
    selectedColor: '#f50000',
    list: [{
      pagePath: '/pages/index/index',
      text: '首页',
      iconPath: '../icons/index.png',
      selectedIconPath: '../icons/index-select.png'
    },
    {
      pagePath: '/pages/store/store',
      text: '菜单',
      iconPath: '../icons/bean.png',
      selectedIconPath: '../icons/bean-select.png'
    },
    {
      pagePath: '/pages/order/list/list',
      text: '订单',
      iconPath: '../icons/list.png',
      selectedIconPath: '../icons/list-select.png'
    },
    {
      pagePath: '/pages/newCart/cart',
      text: '购物车',
      iconPath: '../icons/cart.png',
      selectedIconPath: '../icons/cart-select.png'
    },
    {
      pagePath: '/pages/my/index/index',
      text: '我的',
      iconPath: '../icons/user.png',
      selectedIconPath: '../icons/user-select.png'
    }
    ]
  },
  attached() {
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset;
      const url = data.path;
      wx.switchTab({url});
      this.setData({
        selected: data.index
      });
    }
  }
});
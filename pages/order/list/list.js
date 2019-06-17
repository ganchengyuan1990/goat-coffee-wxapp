import model from '../../../utils/model.js'
const OCLASSIFY = {
  default: 1,
  normal: 1,
  group: 2
}
const OSTATUS = {
  default: -1,
  unfinish: 0,
  finished: 1
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    // 订单列表
    orderList: [],
    // 当前页码
    page: 1,
    // 数据是否请求中
    isLoading: false,
    // 显示筛选面板
    isFilterShow: false,
    // 是否已显示全部数据
    isCompleted: false,
    // 订单类型  1： 普通订单  2： 拼团订单
    orderClassify: OCLASSIFY.default,
    currentPanelList: OCLASSIFY.default,
    // 订单状态 0: 未完成 1： 已完成
    orderState: OSTATUS.default,
    // 显示筛选面板 order/订单类型 state/订单状态
    currentPanel: 'order',
    filterList: [{
        tab: 'order',
        tt: '普通订单',
        cls: 'category',
        list: [{
          tt: '普通订单',
          code: OCLASSIFY.normal,
          active: true
        }, {
          tt: '团购订单',
          code: OCLASSIFY.group,
          active: false
        }]
      },
      {
        tab: 'state',
        tt: '状态',
        cls: 'type',
        list: [{
          tt: '已完成',
          code: OSTATUS.finished,
          active: false
        }, {
          tt: '未完成',
          code: OSTATUS.unfinish,
          active: false
        }]
      }
    ],
    originalObj: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let userInfo = wx.getStorageSync('token')
    // console.log(userInfo);
    if (!userInfo.token) {
      wx.navigateTo({
        url: '/pages/login/login'
      })
      return
    }
    this.setData({
      userInfo: userInfo
    })
  },

  setTabStatus() {
    if (wx.getStorageSync('token') && wx.getStorageSync('STORE_INFO')) {
      let STORE_INFO = JSON.parse(wx.getStorageSync('STORE_INFO'));
      model(`home/cart/list?storeId=${STORE_INFO.id}`).then(res => {
        let sum = 0;
        res.data.carts && res.data.carts.forEach(item => {
          sum += item.num;
        })
        wx.setStorageSync('cartSum', sum);
        if (sum) {
          wx.setTabBarBadge({
            index: 3,
            text: sum.toString()
          });
        } else {
          wx.removeTabBarBadge({
            index: 3,
          });
        }
      }).catch(e => {
    
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    let userInfo = wx.getStorageSync('token')
    if (!userInfo.token) {
      wx.navigateTo({
        url: '/pages/login/login'
      })
      return
    }
    // this.fetchOrderList(1)
    this.refreshList()
    this.setTabStatus();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    // console.log('fetching');
    this.setData({
      page: 1
    })
    setTimeout(() => {
      this.refreshList()
    }, 1500)
  },
  onReachBottom() {
    let isCompleted = this.data.isCompleted
    if (isCompleted) {
      return
    }
    let page = this.data.page
    this.fetchOrderList(page + 1)
  },
  /**
   * 重设列表数据
   */
  refreshList() {
    this.setData({
      orderList: [],
      isCompleted: false
    })
    this.fetchOrderList(1, true)
  },
  fetchOrderList(page = 1, isResetList = false) {
    if (this.data.isLoading) {
      return
    }
    this.setData({
      isLoading: true
    })
    let obj = {
      page: page,
      userId: this.data.userInfo && this.data.userInfo.user.id,
      orderClassify: this.data.orderClassify || OCLASSIFY.normal
    }
    if (this.data.orderState > -1) {
      obj.oStatus = this.data.orderState
    }
    model('order/detail/list', obj).then(res => {
      // console.log('order res', res)
      const {
        data
      } = res
      if (data && Array.isArray(data)) {
        let uid = this.data.userInfo && this.data.userInfo.user.id

        let len = data.length
        let list = isResetList ? [] : this.data.orderList
        let arr = []

        console.log(len);
        // 因为没有判断数据总数量的字段
        // 所以为0的时候认定没有更多
        // 另一种情况，第一页的数据条数少的情况隐藏加载中的状态
        if (len < 5 && page === 1) {
          this.setData({
            isCompleted: true
          })
        }
        if (len === 0) {
          this.setData({
            isCompleted: true
          })
          arr = list
        } else {
          // 普通订单
          if (this.data.orderClassify === OCLASSIFY.normal) {
            arr = list.concat(data)
          }
          // 拼团订单
          if (this.data.orderClassify === OCLASSIFY.group) {
            arr = data.map(item => {
              let groupList = item.group_user_order
              let obj = groupList.find(i => i.userId === uid)
              // obj.payAmount = item.group_order.payAmount
              // obj.state = item.group_order.state
              obj = Object.assign({}, obj, item.group_order)
              return obj
            })
            arr = list.concat(arr)
          }
        }
        this.setData({
          orderList: arr,
          page: page,
          currentPanelList: this.data.orderClassify
        })
      }
      this.setData({
        isLoading: false
      })
      wx.stopPullDownRefresh()
    }).catch(e => {
      this.setData({
        isLoading: false,
        isCompleted: true
      });
      wx.stopPullDownRefresh()
    })
  },
  /*
   * 显示筛选面板
   */
  showCategory(e) {
    let tab = e.currentTarget.dataset.tab
    // 备份选择前的数据
    let originalState = JSON.stringify(this.data.filterList)
    let originalObj = {
      orderClassify: this.data.orderClassify,
      orderState: this.data.orderState,
      filterList: originalState
    }
    this.setData({
      isFilterShow: true,
      currentPanel: tab,
      originalObj: originalObj
    })
  },
  hideCategory(isRollBack = false) {
    if (isRollBack) {
      let obj = this.data.originalObj
      this.setData({
        orderClassify: obj.orderClassify,
        orderState: obj.orderState,
        filterList: JSON.parse(obj.filterList),
        isFilterShow: false
      })
    } else {
      this.setData({
        isFilterShow: false
      })
    }
  },
  /**
   * handler 点击筛选
   */
  chooseFilterItem(e) {
    let dataset = e.currentTarget.dataset
    let code = dataset.code
    let panel = this.data.currentPanel
    if (panel === 'order') {
      this.setData({
        orderClassify: code
      })
    } else if (panel === 'state') {
      this.setData({
        orderState: code
      })
    }
    this.setFilterState()
  },
  /**
   * 重置筛选条件
   */
  resetFilterState() {
    this.setData({
      orderClassify: OCLASSIFY.default,
      orderState: OSTATUS.default
    })
    this.setFilterState()
  },

  setFilterState() {
    let list = this.data.filterList

    list.forEach(i => {
      let arr = i.list
      arr.forEach(j => {
        let code = ''
        if (i.tab === 'order') {
          code = this.data.orderClassify
        } else if (i.tab === 'state') {
          code = this.data.orderState
          code === OSTATUS.default ? i.tt = '状态' : ''
        }
        if (j.code === code) {
          j.active = true
          i.tt = j.tt
        } else {
          j.active = false
        }
      })
    })
    this.setData({
      filterList: list
    })
  },
  goCheckout(e) {
    let token = wx.getStorageSync('token').token
    if (!token) {
      wx.navigateTo({
        url: '/pages/login/login'
      })
      return
    }
    let item = e.currentTarget.dataset.item
    let products = e.currentTarget.dataset.list
    if (!item || !products) {
      wx.showToast({
        title: '获取订单信息失败',
        icon: 'none'
      })
      return
    }
    // console.log(item, products);
    products.forEach(i => {
      i.spec = i.skuName + i.props
      i.price = i.skuPrice
    })
    let obj = {
      storeId: item.storeId,
      userAddressId: item.userAddressId,
      deliverFee: item.deliverFee,
      payAmount: item.payAmount,
      orderType: item.orderType,
      product: products
    }
    // return
    // item.product = item.orderDetail_list
    // item.product.forEach(i => {
    //   i.price = i.skuPrice
    // })
    // return
    const url = `/pages/pay/checkout/checkout?data=${encodeURIComponent(JSON.stringify(obj))}`
    wx.navigateTo({
      url: url
    })
  },
  goPageGroup() {
    if (this.data.currentPanelList === OCLASSIFY.group) {
      wx.switchTab({
        url: '/pages/pin/pin_list/pin_list'
      })
    }
  },
  goPay(e) {
    let order = e.currentTarget.dataset.item
    let type = e.currentTarget.dataset.type
    if (!order) {
      return
    }
    let userInfo = this.data.userInfo
    let {
      wxOpenid
    } = userInfo.user
    let target = type === 'group' ? 'pay/wx/wx-pre-pay-group' : 'pay/wx/wx-pre-pay'
    model(target, {
      openId: wxOpenid,
      orderNo: order.id
      // orderMsg: ''
    }, 'POST').then(res => {
      let obj = res.data
      if (!obj.paySign) {
        // show model
        return
      }
      let prepayId = obj.package.split('=')[1]
      obj.msg = 'suc'
      obj.package = prepayId
      obj.prepayId = prepayId
      obj.price = order.payAmount
      // let str = Object.entries(obj).map(i => `${i[0]&i[1]}`).join('&')
      let str = Object.entries(obj).reduce((acc, arr) => acc + '&' + arr.join('='), '')
      str = str.slice(1)
      // console.log(str);
      // return
      wx.navigateTo({
        url: `/pages/pay/normalPay/normalPay?${str}`
      })
    }).catch(e => {
      // show model
      console.log(e)
    })
    // return

  },
  confirm() {
    this.refreshList()
    this.hideCategory(false)
  },
  cancel() {
    this.hideCategory(true)
  },
  /**
   * 跳转详情页
   */
  showDetail(e) {
    let item = e.currentTarget.dataset.item
    let list = e.currentTarget.dataset.list
    item.detailList = list
    let dtype = e.currentTarget.dataset.dtype
    // console.log(item, 'show detail item');

    if (item) {
      item.dtype = dtype
      wx.navigateTo({
        url: `/pages/order/detail/detail?id=${item.id}&orderClassify=${this.data.orderClassify}`
      })
    }
  }
})
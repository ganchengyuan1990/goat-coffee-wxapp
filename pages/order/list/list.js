
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
      tt: '外卖订单',
      cls: 'category',
      list: [{
        tt: '外卖订单',
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
    }],
    originalObj: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let userInfo = wx.getStorageSync('token')
    console.log(userInfo);
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // this.fetchOrderList(1)
    this.refreshList()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    console.log('fetching');
    this.setData({
      page: 1
    })
    setTimeout(() => {this.refreshList()}, 1500)
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
      isCompleted: false
    })
    this.fetchOrderList(1, true)
  },
  fetchOrderList(page=1, isResetList=false) {
    if (this.data.isLoading) {
      return
    }
    this.setData({
      isLoading: true
    })
    let obj = {
      page: page,
      userId: this.data.userInfo.user.id,
      orderClassify: this.data.orderClassify || OCLASSIFY.normal
    }
    if (this.data.orderState > -1) {
      obj.oStatus = this.data.orderState
    }
    model('order/detail/list', obj).then(res => {
      console.log('order res', res)
      const {data} = res
      if (data && Array.isArray(data)) {
        let uid = this.data.userInfo.user.id
        
        let len = data.length
        let list = isResetList ? [] : this.data.orderList
        if (len === 0) {
          this.setData({
            isCompleted: true
          })
        } else {
          list = list.concat(data)
        }
        let arr = []
        if (this.data.orderClassify === OCLASSIFY.normal) {
          arr = list
        }
        if (this.data.orderClassify === OCLASSIFY.group) {
          arr = list.map(item => {
            let groupList = item.group_user_order
            let obj = groupList.find(i => i.userId === uid)
            obj.payAmount = item.group_order.payAmount
            obj.state = item.group_order.state
            return obj
          })
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
  hideCategory(isRollBack=false) {
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
  // addCart(e) {
  //   let detail = e.currentTarget.dataset.item
  //   console.log(detail, 'detail');
  //   let orders = detail.orderDetail_list
  //   let arr = []
  //   orders.forEach(item => {
  //     let obj = {}
  //     let props = JSON.parse(item.props || '[]')
  //     let key = `${item.productId}-${item.skuId}-${item.productPropIds.replace(/,/g, '-')}`
  //     let val = Object.assign({}, item, {
  //       // spec: 
  //     })
  //   })
  // },
	goCheckout(e) {
	  let token = wx.getStorageSync('token').token
	  if (!token) {
	    wx.navigateTo({
	      url: '/pages/login/login'
	    })
	    return
	  }
    let item = e.currentTarget.dataset.item
    if (!item) {
      return
    }
    item.product = item.orderDetail_list
    item.product.forEach(i => {
      i.price = i.skuPrice
    })
	  // return
	  const url = `/pages/pay/checkout/checkout?data=${encodeURIComponent(JSON.stringify(item))}`
	  wx.navigateTo({
	    url: url
	  })
	},
  goPay(e) {
    let order = e.currentTarget.dataset.item
    if (!order) {
      return
    }

    wx.navigateTo({
      url: `/pages/pay/normalPay/normalPay?timeStamp=${order.timeStamp}&msg=suc&paySign=${order.paySign}&appId=wx95a4dca674b223e1&signType=MD5&prepayId=${order.prepayId}&nonceStr=${order.nonceStr}&price=${order.totalAmount}`
    })
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
    let dtype = e.currentTarget.dataset.dtype
    console.log(item, 'show detail item');
    
    if (item) {
      item.dtype = dtype
      wx.navigateTo({
        url: `/pages/order/detail/detail?data=${encodeURIComponent(JSON.stringify(item))}`
      })
    }
  }
})
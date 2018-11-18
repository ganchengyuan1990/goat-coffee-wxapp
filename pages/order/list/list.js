
import model from '../../../utils/model.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
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
    orderClassify: 1,
    // 订单状态
    orderState: 0,
    // 显示筛选面板 order/订单类型 state/订单状态
    currentPanel: 'order',
    filterList: [{
      tab: 'order',
      tt: '外卖订单',
      cls: 'category',
      list: [{
        tt: '外卖订单',
        code: 1,
        active: true
      }, {
        tt: '团购订单',
        code: 2,
        active: false
      }]
    }, 
    {
      tab: 'state',
      tt: '状态',
      cls: 'type',
      list: [{
        tt: '已完成',
        code: 1,
        active: false
      }, {
        tt: '未完成',
        code: 2,
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
    this.fetchOrderList(1)
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

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    console.log('fetching');
    this.setData({
      page: 1
    })
    setTimeout(() => this.refreshList, 2000)
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
    model('order/detail/list', {
      page: page,
      userId: 1, // TODOS
      orderClassify: this.data.orderClassify || 1
    }).then(res => {
      console.log('order res', res)
      const {data} = res
      if (data && Array.isArray(data)) {
        let len = data.length
        let list = isResetList ? [] : this.data.orderList
        if (len === 0) {
          this.setData({
            isCompleted: true
          })
        } else {
          list = list.concat(data)
        }
        this.setData({
          orderList: list,
          page: page
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
  resetFilterState() {
    this.setData({
      orderClassify: 1,
      orderState: 0
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
          code === 0 ? i.tt = '状态' : ''
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
  addCart(e) {
    let detail = e.currentTarget.dataset.item
    console.log(detail, 'detail');
    let orders = detail.orderDetail_list
    let arr = []
    orders.forEach(item => {
      let obj = {}
      let props = JSON.parse(item.props || '[]')
      let key = `${item.productId}-${item.skuId}-${item.productPropIds.replace(/,/g, '-')}`
      let val = Object.assign({}, item, {
        // spec: 
      })
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
    if (item) {
      wx.navigateTo({
        url: `/pages/order/detail/detail?data=${encodeURIComponent(JSON.stringify(item))}`
      })
    }
  }
})
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
    orderTypeId: 1,
    errorToastShown: '',
    errorInfo: {},
    userInfo: {},
    // 订单列表
    orderList: [],
    // 当前页码
    page: 1,
    curNav: 0,
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
    addressList: [],
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
    originalObj: {},
    index: 1,
    hasLogin: true,
    phoneCall: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

    let configData = wx.getStorageSync('configData');
    this.setData({
      phoneCall: configData['customer-service-tel'] || '17821410731'
    })
    
  }, 

  onClickAvatar () {
    wx.navigateTo({
      url: '/pages/login/login'
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
            index: 1,
            text: sum.toString()
          });
        } else {
          wx.removeTabBarBadge({
            index: 1,
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
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 4
      })
    }
    let userInfo = wx.getStorageSync('token')
    // console.log(userInfo);
    if (!userInfo.token) {
      this.setData({
        // curNav: 0,
        hasLogin: false
      })
      return
    } else {
      this.setData({
        // curNav: 0,
        hasLogin: true
      })
    }
    if (getApp().globalData.goAddress) {
      getApp().globalData.goAddress = null;
      this.setData({
        curNav: 1
      })
    }
    if (this.data.curNav == 1) {
      model('my/address/list', {
        userId: wx.getStorageSync('token').user.id,
      }).then(data => {
        wx.setStorageSync('addressList', data.data);
        this.setData({
          addressList: data.data
        });
      }).catch(e => {
        console.log(e);
      });
    }
    this.setData({
      userInfo: userInfo
    })
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

  goInvice(e) {
    let item = e.currentTarget.dataset.item;
    wx.setStorageSync('martsListArr', [{
      id: item.id,
      real_due: item.totalAmount
    }]);
    wx.navigateTo({
      url: `/package/invoice/pages/open/open`
    });
  },


  switchRightTab(e) {
    var index = e.currentTarget.dataset.index;
    this.setData({
      curNav: index
    })
    if (index == 1) {
      model('my/address/list', {
        userId: wx.getStorageSync('token').user.id,
      }).then(data => {
        wx.setStorageSync('addressList', data.data);
        // data.data = [];

        this.setData({
          addressList: data.data
        });
      }).catch(e => {
        console.log(e);
      });
    }
  },

  setOrderTypeId (e) {
    var index = parseInt(e.currentTarget.dataset.id);
    this.setData({
      orderList: [],
      orderTypeId: index,
      isLoading: true,
      isCompleted: false
    })
    let obj = {
      page: 1,
      userId: this.data.userInfo && this.data.userInfo.user.id,
      type: index
    }
    model('order/detail/list', obj).then(res => {
      // console.log('order res', res)
      let {
        data
      } = res
      if (data && Array.isArray(data)) {
        let uid = this.data.userInfo && this.data.userInfo.user.id

        let len = data.length
        let list = this.data.orderList
        let arr = []

        console.log(len);
        // 因为没有判断数据总数量的字段
        // 所以为0的时候认定没有更多
        // 另一种情况，第一页的数据条数少的情况隐藏加载中的状态
        if (len < 5) {
          this.setData({
            isCompleted: true
          })
        }
        if (len === 0) {
          this.setData({
            isCompleted: true
          })
          arr = []
        } else {
          // 普通订单
          data = data.map(item => {
            if (item.order.orderState == '100' && item.order.isComment) {
              item.order.orderState = '101'
            }
            item.order.payAmount = (item.order.payAmount == parseInt(item.order.payAmount) ? parseInt(item.order.payAmount) : parseFloat(item.order.payAmount).toFixed(2))
            return item;
          })
          arr = data
        }
        this.setData({
          orderList: arr,
          page: 1,
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
      // orderClassify: this.data.orderClassify || OCLASSIFY.normal,
      type: this.data.orderTypeId
    }
    if (this.data.orderState > -1) {
      obj.oStatus = this.data.orderState
    }
    model('order/detail/list', obj).then(res => {
      // console.log('order res', res)
      let {
        data
      } = res
      if (data && Array.isArray(data)) {
        let uid = this.data.userInfo && this.data.userInfo.user.id

        let len = data.length
        let list = isResetList ? [] : this.data.orderList
        let arr = []

        data = data.map(item => {
          item.order.payAmount = (item.order.payAmount == parseInt(item.order.payAmount) ? parseInt(item.order.payAmount) : parseFloat(item.order.payAmount).toFixed(2))
          return item;
        })

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

  goCancel (e) {
    let order = e.currentTarget.dataset.item
    let type = e.currentTarget.dataset.type
    if (!order) {
      return
    }
    model(`order/detail/cancel`, {
      id: order.id
    }, 'POST').then(res => {
      if (res.code == 'suc') {
        wx.showToast({
          title: '取消订单成功', //提示的内容,
          icon: 'none', //图标,
          duration: 2000, //延迟时间,
          mask: true, //显示透明蒙层，防止触摸穿透,
          success: res => {}
        });
        setTimeout(() => {
          this.refreshList()
        }, 1500);
      }
    }).catch(e => {
      console.log(e)
    })
  },

  goQrcode (e) {
    let order = e.currentTarget.dataset.item.order
    wx.navigateTo({
      url: `/pages/order/varcode/detail?orderNo=${order.orderNo}&varCode=${order.varCode}`
    });
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
      openId: wx.getStorageSync('openid'),
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
      obj.varCode = obj.order.verify_code
      obj.order = order.id

      
      
      // let str = Object.entries(obj).map(i => `${i[0]&i[1]}`).join('&')
      let str = Object.entries(obj).reduce((acc, arr) => acc + '&' + arr.join('='), '')
      str = str.slice(1)

      if (order.storeCoffeeMakerId) {
        str += '&coffeeMaker=1'
      }
      // console.log(str);
      // return
      wx.navigateTo({
        url: `/pages/pay/normalPay/normalPay?${str}`
      })
    }).catch(e => {
      // show model
      wx.showToast({
        title: '支付失败', //提示的内容,
        icon: 'none', //图标,
        duration: 2000, //延迟时间,
        mask: true, //显示透明蒙层，防止触摸穿透,
        success: res => {}
      });
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
        /// url: `/pages/order/detail/detail?id=21121&orderClassify=${this.data.orderClassify}`
        url: `/pages/order/detail/detail?id=${item.id}&orderClassify=${this.data.orderClassify}`
      })
    }
  },

  mobilePhone () {
    wx.makePhoneCall({
      phoneNumber: this.data.phoneCall
    });
  },

  goOpen () {
    wx.navigateTo({
      url: `/package/invoice/pages/chooseOrder/chooseOrder?type=1`
    });
  },

  goRechargeOpen() {
    wx.navigateTo({
      url: `/package/invoice/pages/chooseOrder/chooseOrder?type=2`
    });
  },

  goTaitou() {
    wx.navigateTo({
      url: `/package/invoice/pages/taitou-list/taitou-list`
    });
  },

  // goState() {
  //   wx.navigateTo({
  //     url: `/package/invoice/pages/statement/statement`
  //   });
  // },

  goState() {
    let config = wx.getStorageSync('config');
    let url = config.baseUrl[config.env]
    url += 'statement/invoice.html'
    wx.navigateTo({
      url: `/pages/webview/webview?url=${encodeURIComponent(url)}`
    });
  },

  goList () {
    wx.navigateTo({
      url: `/package/invoice/pages/list/list`
    });
  },

  goIndex () {
    wx.switchTab({ url: '/pages/store/store' });
  },

  goAddAddress() {
    if (wx.getStorageSync('token')) {
      wx.navigateTo({
        url: `/pages/my/address/address`
      });
    } else {
      wx.redirectTo({
        url: `/pages/login/login?fromTransport=1`
      });
    }

  },

  goComment(e) {
    let item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: `/package/orderComment/pages/comment/remark?orderId=${item.id}`
    });
  },

  getUserInfo() {
    let self = this;
    wx.login({
      success: function (res) {
        console.log(res);
        if (res.code) {
          model('my/user/get-open-id', {
            code: res.code
          }).then(res => {
            // wx.setStorageSync('openid', res.data);
            wx.setStorageSync('openid', res.data.openid);
            let session_key = res.data.session_key;
            if (res.data.unionid) {
              wx.setStorageSync('unionId', res.data.unionid);
              wx.setStorageSync('unionid', res.data.unionid);
            }
            if (session_key) {
              wx.setStorageSync('session_key', session_key);
            }
            wx.getUserInfo({
              withCredentials: true,
              success: function (res) {
                var userInfo = res.userInfo
                let iv = res.iv;
                let encryptedData = res.encryptedData;
                console.log(session_key);
                console.log(iv);
                console.log(encryptedData);
                wx.setStorageSync('personal_info', {
                  nickName: userInfo.nickName,
                  avatarUrl: userInfo.avatarUrl,
                  gender: userInfo.gender,
                  province: userInfo.province,
                  city: userInfo.city,
                  country: userInfo.country
                });
                wx.setStorageSync('encryptedData', res);
                self.onClickAvatar();
                self.setData({
                  auth: true
                })
              }
            })
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    });
  },
})
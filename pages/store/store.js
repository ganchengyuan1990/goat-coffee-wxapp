// pages/store/store.js
const app = getApp();
import model from '../../utils/model.js';
import util from '../../utils/util.js';
import {
  BigNumber
} from '../../utils/bignumber.min';

function BN(...args) {
  return new BigNumber(...args);
}
let touchTimer = null;
let touchObj = {};
let touchDy = 0;


Page({
  /**
	 * 页面的初始数据
	 */
  data: {
    viewToList: '',
    viewToNav: '',
    scrollTop: 0,
    // scrollview 设定高度
    listHeight: 300,
    activeIndex: 0,
    isCatePanelShow: false,
    isCartPanelShow: false,
    heigthArr: [],
    storeInfo: {
      banners: {
        pic: ''
      }
    },
    menuList: [],
    cartList: [],
    priceMap: {},
    // 当前选中产品定制化
    currentSpecific: {},
    // 配送地址id
    userAddressInfo: {},
    // 是否自提
    isSelfTaking: true,
    isLoadStorageCart: true,
    actImage: '',
    isActWrapShow: false,
    fromTransport: '',
    products: [],
    resultPrice: -1
  },

  /**
	 * 生命周期函数--监听页面加载
	 */
  onLoad(options) {
    let info = wx.getStorageSync('token') || {};
    let isLogin = this.checkLogin();
    // 登录检查逻辑后移
    // if (!isLogin) {
    // 	wx.redirectTo({
    // 		url: '/pages/login/login'
    // 	})
    // 	return
    // }
    let isNew = info.ifNew;
    let configPic = '';

    try {
      configPic = info.config.newUserPic;
    } catch (e) {
      console.log(e);
    }
    if (isNew && configPic) {
      this.setData({
        actImage: configPic,
        isActWrapShow: true
      });
      try {
        let token = wx.getStorageSync('token');
        token.ifNew = false;
        wx.setStorageSync('token', token);
      } catch (e) {
        console.log(e);
      }
    }
    this.fetchLoaction();
    this.checkSaveUser();
  },
  /**
	 * 生命周期函数--监听页面初次渲染完成
	 */
  onReady() {
    let height1, height2;
    let res = wx.getSystemInfoSync();
    let winHeight = res.windowHeight;
    let query = wx.createSelectorQuery();
    query.select('.J_hd_wrap').boundingClientRect();
    query.exec(res => {
      height1 = res[0].height;
      let query1 = wx.createSelectorQuery();
      query1.select('.J_img_wrap').boundingClientRect();
      query1.exec(res => {
        height2 = res[0].height;
        this.setData({
          listHeight: winHeight - height1 - height2
        });
        // this.calculateHeight();
      });
    });
  },

  /**
	 * 生命周期函数--监听页面显示
	 */
  onShow() {
    let isLogin = this.checkLogin();
    if (!isLogin) {
      return;
    }
    // console.log(app.globalData, 'globalData')
    let fromTransport = app.globalData.fromTransport;
    // let isGeoAuth = app.globalData.isGeoAuth
    if (fromTransport) {
      this.loadAddress(fromTransport);
      this.setData({
        fromTransport: fromTransport
      });
      app.globalData.fromTransport = '';
    } else {
      // this.fetchLoaction();
      // if (!isGeoAuth) {
      // 	this.checkAuth()
      // }
      let storeInfo = wx.getStorageSync('STORE_INFO');
      let isGeoAuth = app.globalData.isGeoAuth;
      // if (storeInfo) {
      // 	this.setData({
      // 		storeInfo: JSON.parse(storeInfo)
      // 	})
      // }
      if (!isGeoAuth) {
        this.fetchLoaction();
      }

      if (this.data.isLoadStorageCart) {
        this.getStorageCart();
      }
      this.toggleTabBar(true);
    }
  },

  /**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
  onPullDownRefresh() {},

  /**
	 * 页面上拉触底事件的处理函数
	 */
  onReachBottom() {},

  /**
	 * 用户点击右上角分享
	 */
  onShareAppMessage() {},
  checkLogin() {
    let info = wx.getStorageSync('token') || {};
    return info.token;
  },
  /**
	 * 验证是否获得授权
	 */
  checkAuth() {
    wx.getSetting({
      success(res) {
        const {
          authSetting
        } = res;
        // console.log(authSetting, 'setting');
        if (!authSetting['scope.userLocation']) {
          wx.showModal({
            title: '提示',
            content: '需要您的授权才能推荐附近的店铺信息',
            showCancel: false,
            success(res) {
              if (res.confirm) {
                wx.openSetting();
              }
            }
          });
        }
      }
    });
  },


  getBestCouponByProduct() {
    model('home/coupon/get-best-coupon-by-product', {
      uid: wx.getStorageSync('token').user.id,
      list: this.data.products
    }).then(data => {
      let {
        resultPrice
      } = data.data;
      if (data.data && data.data.discountPrice > 0) {
        this.setData({
          resultPrice: resultPrice
        });
      }
    }).catch(e => {
      debugger;
    });
  },

  /**
	 * 选择地址后重加载
	 */
  loadAddress(data) {
    const {
      type,
      detail
    } = data;
    let info = detail.detail;
    if (type === 'deliver') {
      this.setData({
        userAddressInfo: info || {},
        isSelfTaking: false
      });
      this.fetchLoaction();
    } else if (type === 'selftaking') {
      this.setData({
        isSelfTaking: true
      });
      this.formatStoreInfo(info);
    } else {
      this.fetchLoaction();
    }
  },
  /**
	 * 获取经纬度
	 */
  fetchLoaction() {
    let self = this;
    wx.showLoading({
      title: '加载中',
    });
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        const {
          latitude,
          longitude
        } = res;
        let geo = {
          lng: longitude,
          lat: latitude
        };
        self.fetchStore(geo);
        app.globalData.isGeoAuth = true;
      },
      fail() {
        self.checkAuth();
        app.globalData.isGeoAuth = false;
        wx.hideLoading();
        wx.showToast({
          title: '加载失败',
          icon: 'none',
          duration: 2000
        });
      }
    });
  },
  /**
	 * 获取店铺信息
	 * 
	 */
  fetchStore(geo) {
    model('home/lbs/get-store-list-by-location', {
      lng: geo.lng,
      lat: geo.lat,
      // lng: 121.419114,
      // lat: 31.239629,
      page: 1
    }).then(res => {
      const {
        data
      } = res;
      if (data && data.length > 0) {
        // if (data.length > 1) {
        // 	wx.showModal({
        // 		title: '提示',
        // 		content: '请选择店铺',
        // 		showCancel: false,
        // 		success(res) {
        // 			if (res.confirm) {
        // 				wx.navigateTo({
        // 					url: `/pages/transport/transport?from=store&tab=delivery`
        // 				})
        // 			}
        // 		}
        // 	})
        // } else {
        let storeInfo = data[0];
        this.formatStoreInfo(storeInfo);
        // }
      }
    }).catch(e => {
      console.log(e);
      wx.hideLoading();
      wx.showToast({
        title: '加载失败',
        icon: 'none',
        duration: 2000
      });
    });
  },
  formatStoreInfo(storeInfo) {
    if (!storeInfo) {
      return;
    }
    wx.setStorage({
      key: 'STORE_INFO',
      data: JSON.stringify(storeInfo)
    });
    let distance = storeInfo.distance || 0;
    let formatDistance = '';
    try {
      if (distance < 1000) {
        formatDistance = `${Math.round(distance)}m`;
      } else if (distance < 10000) {
        formatDistance = `${parseFloat(distance/1000).toFixed(1)}km`;
      } else {
        formatDistance = '>10km';
      }
    } catch (e) {
      console.log(e);
    }
    if (parseFloat(storeInfo.distance) > 3000) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: `您与店铺的距离超过3公里，请确认店铺是${storeInfo.storeName}`,
        confirmText: '我知道了'
      });
    }
    storeInfo.distance = formatDistance;
    this.setData({
      storeInfo: storeInfo
    });

    // console.log(storeInfo, 'storeinfo')
    this.fetchProduct(storeInfo.id);
  },
  /**
	 * 获取商品信息
	 */
  fetchProduct(storeId) {
    model('home/product/all', {
      storeId: storeId
    }).then(res => {
      console.log(res, 'detail');
      const {
        data
      } = res;

      const list = data.classify_list;
      this.setData({
        scrollTop: 0,
        menuList: list
      });
      this.generatePriceMap();
      this.calculateHeight();
      wx.hideLoading();
    }).catch(e => {
      console.log(e);
      wx.hideLoading();
      wx.showToast({
        title: '加载失败',
        icon: 'none',
        duration: 2000
      });
    });
  },

  /*
	 * 生成价格信息对照表 
	 */
  generatePriceMap() {
    let list = this.data.menuList;
    let obj = {};
    // 使用 productid-skuid 对应价格map表
    // console.log(list, 'list');

    list.forEach(i => {
      let pList = i.product_list;
      pList.forEach(j => {
        let sList = j.sku_list;
        sList.forEach(k => {
          let key = k.productId + '-' + k.propSkuId;
          obj[key] = k.sale_price;
        });
      });
    });
    this.setData({
      priceMap: obj
    });
    if (this.data.isLoadStorageCart) {
      this.getStorageCart();
    }
  },
  /**
	 *  
	 */
  getStorageCart() {
    let data = wx.getStorageSync('CART_LIST');
    let list = JSON.parse(data || '[]');
    let priceMap = this.data.priceMap;
    this.setData({
      isLoadStorageCart: false
    });
    let remainList = list.filter(item => {
      let customedKey = item.customedKey;
      let key = '';
      let keys = customedKey.match(/\d+-\d+/);
      if (keys) {
        key = keys[0];
      }

      if (key && priceMap[key]) {
        // TODOS 此处可添加重新计算价格逻辑
        // 同时需要计算总价格
        // item.price = priceMap[key]
        // item.totalPrice = BN(item.price).mul...
        return item;
      }
    });

    if (remainList.length !== list.length) {
      wx.showModal({
        title: '提示',
        content: '购物车部分商品缺货',
        confirmText: '我知道了'
      });
    }
    let arr = this.data.cartList;
    arr = arr.concat(remainList);
    this.mergeCart(arr);
    this.getBestPaySolution();
  },
  calculateHeight() {
    let heigthArr = [];
    let height = 0;
    heigthArr.push(height);
    var query = wx.createSelectorQuery();
    query.selectAll('.J_group').boundingClientRect();
    query.exec(res => {
      // console.log(res, 'res')
      for (let i = 0; i < res[0].length; i++) {
        height += parseInt(res[0][i].height);
        heigthArr.push(height);
      }
      this.setData({
        heigthArr: heigthArr
      });
    });

  },
  selectNav(e) {
    // console.log(e.currentTarget.dataset.index, e.currentTarget.dataset.navid)
    this.setData({
      activeIndex: e.currentTarget.dataset.index,
      viewToList: e.currentTarget.dataset.navid
    });
  },

  // 手机端有延迟 节流函数效果不好 用防抖函数凑合
  scroll(e) {
    (util.throttle(() => {
      let srollTop = e.detail.scrollTop;
      for (let i = 0; i < this.data.heigthArr.length; i++) {
        if (
          srollTop >= this.data.heigthArr[i] &&
					srollTop < this.data.heigthArr[i + 1] &&
					this.data.activeIndex != i
        ) {
          this.setData({
            activeIndex: i
          });
          if (i < 3) {
            this.setData({
              viewToNav: 'nav1'
            });
          } else {
            this.setData({
              viewToNav: 'nav' + (i - 2)
            });
          }
          return;
        }
      }
    }, 100))();
  },
  orderProduct(e) {
    let groupIdx = e.currentTarget.dataset.groupidx;
    let productIdx = e.currentTarget.dataset.productidx;
    // let detail = `menuList[${groupIdx}].product_list[${productIdx}]`
    let detail = this.data.menuList[groupIdx].product_list[productIdx];
    this.setData({
      currentSpecific: detail
    });
    this.toggleSpecific();
  },
  toggleSpecific() {
    let isShow = this.data.isCatePanelShow;
    // this.setData({
    // 	isCatePanelShow: !isShow
    // })
    if (isShow) {
      this.toggleTabBar(true);
      this.setData({
        isCatePanelShow: !isShow
      });
    } else {
      this.toggleTabBar(false, () => {
        this.setData({
          isCatePanelShow: !isShow
        });
      });
    }
  },
  /**
	 * 添加到购物车 
	 */
  saveCart(e) {
    let cart = e.detail.cartList;
    if (e.detail) {
      this.mergeCart(cart);
      this.getBestPaySolution();
    }
  },
  addCart(e) {
    let isOpen = this.checkStoreState();
    if (!isOpen) {
      return;
    }
    let cart = this.data.cartList;
    if (e.detail) {
      cart.push(e.detail);
    }
    this.mergeCart(cart);
    this.getBestPaySolution();
  },
  toggleCart() {
    let isShow = this.data.isCartPanelShow;
    let self = this;

    if (!isShow) {
      this.toggleTabBar(false, () => {
        self.setData({
          isCartPanelShow: !isShow
        });
      });
    } else {
      this.toggleTabBar(true);
      self.setData({
        isCartPanelShow: !isShow
      });
    }
  },
  toggleTabBar(isShow, callback) {
    if (!isShow) {
      wx.hideTabBar({
        animation: true,
        success() {
          setTimeout(() => {
            callback && callback();
          }, 200);
        },
        fail() {}
      });
    } else {
      callback && callback();
      setTimeout(() => {
        wx.showTabBar({
          animation: true,
          success() {

          },
          fail() {}
        });
      }, 200);

    }
  },
  checkStoreState() {
    let isOpen = this.data.storeInfo.state === 1;
    if (!isOpen) {
      wx.showModal({
        title: '提示',
        content: '我们已经打烊了呦，请明天再来呦。',
        showCancel: false
      });
      return false;
    }
    return true;
  },
  checkout(e) {
    let self = this;
    let token = wx.getStorageSync('token').token;
    if (!token) {
      wx.navigateTo({
        url: '/pages/login/login'
      });
      return;
    }
    let isOpen = this.checkStoreState();
    if (!isOpen) {
      return;
    }
    let info = this.data;
    let cartList = e.detail.cart;
    let totalPrice = e.detail.totalPrice;
    let isNeedFee = e.detail.isNeedFee;

    // console.log(cartList, 'cartList')
    if (cartList.length === 0) {
      wx.showToast({
        icon: 'none',
        title: '请选择商品'
      });
      return;
    }
    let products = cartList.map(item => {
      let skuList = item.sku_list;
      let obj = skuList.find(item => item.isdefault === 1) || {};
      let propList = item.key_list;
      let propIds = [];
      propList.forEach(i => {
        let idObj = i.val_list.find(j => {
          return parseInt(j.id) === parseInt(i.default_val_id);
        });

        if (idObj) {
          propIds.push(idObj.prop_id);
        }
      });
      return Object.assign({}, {
        productName: item.productName,
        productId: item.id,
        skuId: obj.id,
        skuName: obj.propSkuName,
        number: item.count,
        price: obj.sale_price,
        productPropIds: propIds.join(','),
        spec: item.spec
      });
    });
    let fee = isNeedFee ? info.storeInfo.deliverFee : 0;
    let obj = {
      storeId: info.storeInfo.id,
      userAddressId: this.data.userAddressInfo.id || info.userAddressId,
      deliverFee: fee,
      payAmount: totalPrice,
      orderType: info.isSelfTaking ? 2 : 1,
      product: products
    };

    const url = `/pages/pay/checkout/checkout?fromTransportIndex=${this.data.fromTransport.idx}&data=${encodeURIComponent(JSON.stringify(obj))}&tab=${this.data.isSelfTaking?'selftaking':'delivery'}`;
    this.setData({
      isCartPanelShow: false
    });
    wx.showTabBar();
    // this.toggleCart()
    wx.navigateTo({
      url: url,
      success() {
        self.setData({
          cartList: [],
          resultPrice: -1,
          isLoadStorageCart: true
        });
      }
    });
  },
  selectAddress(e) {
    let type = e.currentTarget.dataset.delivery;
    wx.navigateTo({
      url: `/pages/transport/transport?from=store&tab=${type}`
    });
  },
  /*
	 * 合并相同品类
	 */
  mergeCart(list) {
    if (!Array.isArray(list)) {
      return;
    }
    // 验证skuid， propids, productId一致性
    // count total price

    let cartList = list;
    let obj = {};
    cartList.forEach(item => {
      let key = item.customedKey;
      let val = obj[key];
      if (val) {
        val.count = BN(val.count).plus(item.count).valueOf();
        val.totalPrice = BN(val.count).multipliedBy(val.price).valueOf();
      } else {
        obj[key] = item;
      }
    });
    // let arr = Object.values(obj)
    let arr = [];
    for (let i in obj) {
      if (obj[i]) {
        arr.push(obj[i]);
      }
    }
    this.setData({
      cartList: arr
    });
    wx.setStorage({
      key: 'CART_LIST',
      data: JSON.stringify(arr)
    });
  },

  /**
	 * 实时获取最优下单方案
	 */
  getBestPaySolution() {
    let _cartList = Object.assign(this.data.cartList);
    let products = _cartList.map(item => {
      let skuList = item.sku_list;
      let obj = skuList.find(item => item.isdefault === 1) || {};
      let propList = item.key_list;
      let propIds = [];
      propList.forEach(i => {
        let idObj = i.val_list.find(j => {
          return parseInt(j.id) === parseInt(i.default_val_id);
        });

        if (idObj) {
          propIds.push(idObj.prop_id);
        }
      });
      return Object.assign({}, {
        productName: item.productName,
        productId: item.id,
        skuId: obj.id,
        skuName: obj.propSkuName,
        number: item.count,
        price: obj.sale_price,
        productPropIds: propIds.join(','),
        spec: item.spec,
        num: item.count,
        // totalPrice: item.count * obj.sale_price
      });
    });
    this.setData({
      products: products
    });
    if (wx.getStorageSync('token') && wx.getStorageSync('token').user) {
      this.getBestCouponByProduct();
    }
  },

  /**
	 * 滑动关闭功能
	 */
  handleTouchStart(e) {
    touchTimer = e.timeStamp;
    touchObj = e.touches[0];
    touchDy = 0;
  },
  handleTouchMove(e) {
    let touch = e.touches[0];
    let id = touchObj.identifier;
    let curId = touch.identifier;
    if (curId === id) {
      let pageY = touch.pageY;
      touchDy = pageY - touchObj.pageY;
    }
  },
  handleTouchEnd(e) {
    let touch = e.changedTouches[0];
    let id = touchObj.identifier;
    let curId = touch.identifier;
    let interval = e.timeStamp - touchTimer;
    if (id === curId && interval < 200 && touchDy > 150) {
      if (this.data.isCatePanelShow) {
        this.toggleSpecific();
      }
      if (this.data.isCartPanelShow) {
        this.toggleCart();
      }
    }
  },
  hideActWrap() {
    this.setData({
      isActWrapShow: false
    });
  },
  goPageCoupon() {
    this.setData({
      isActWrapShow: false
    });
    wx.navigateTo({
      url: '/pages/my/coupon/coupon?type=2'
    });
  },
  checkSaveUser() {
    let self = this;
    let token = wx.getStorageSync('token');
    let userName = '';
    let avatar = '';
    if (!token) {
      return;
    }
    try {
      let userInfo = token.user;
      avatar = userInfo.avatar;
      userName = userInfo.userName;
    } catch (e) {
      console.log(e);
    }
    if (userName && avatar) {
      return;
    }
    let info = wx.getStorageSync('personal_info');
    if (!info) {
      return;
    }
    // const { nickName, gender } = info
    const {
      avatarUrl,
      nickName,
      gender
    } = info;
    model('file/qiniu/fetch', {
      sourceUrl: avatarUrl
    }, 'POST').then(res => {
      const {
        code,
        data
      } = res;
      if (code === 'suc') {
        let {
          key,
          url
        } = data;
        if (key) {
          let _param = {};
          if (nickName) {
            _param.userName = nickName;
          }
          if (gender) {
            _param.sex = gender;
          }
          if (key) {
            _param.avatar = key;
          }
          model('my/user/update-user', _param, 'POST').then(res => {
            console.log(res);
            if (res.code === 'suc') {
              self.updateCurrentInfo(nickName, gender, url);
            }
          }).catch(e => {
            console.log(e, '[exception]: my/user/update-user');
          });
        }
      }
    });
  },
  updateCurrentInfo(nickName, gender, avatar) {
    if (!nickName && !gender && !avatar) {
      return;
    }
    try {
      let token = wx.getStorageSync('token');
      let userInfo = token.user;
      let newParam = {};
      if (nickName) {
        newParam.userName = nickName;
      }
      if (gender) {
        newParam.sex = gender;
      }
      if (avatar) {
        newParam.avatar = avatar;
      }
      token.user = Object.assign(userInfo, newParam);
      wx.setStorageSync('token', token);
    } catch (e) {
      console.log(e);
    }
  }
});
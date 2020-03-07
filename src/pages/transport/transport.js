// var util = require('../../../utils/util.js');
// var api = require('../../../config/api.js');
// const pay = require('../../../services/pay.js');
import {wx2promise, showErrorToast} from '../../utils/util';

import model from '../../utils/model';

var app = getApp();

Page({
  data: {
    loading: true,
    searchSuggest: [],
    showSearchitem: {},
    showSelfGet: true,
    showExpress: false, 
    from: '',
    init: true,
    type: -1,
    isGeoAuth: true,
    fromCheckout: false,
    showCities: false,
    cities: [],
    secondCities: [],
    thirdCities: [],
    firstCitySelected: 0,
    secondCitySelected: 0,
    thirdCitySelected: 0,
    city1: '请点击选择您所在的城市',
    city2: '',
    city3: '',
    minIndex: 0,
    zizhuList: [],
    initShopList: [],
    selected: 0,

    showNewModal: false
  },
  onLoad: function (options) {
    var self = this;
    if (!options.from && !options.fromCoffeeMaker) {
      options.fromCoffeeMaker = 1;
      options.from = 'store';
    }
    if (!app.globalData.isGeoAuth || !app.globalData.userGeo) {
      wx.getLocation({
        type: 'wgs84',
        success(res) {
          let {
            latitude,
            longitude
          } = res
          console.log(latitude, longitude, '定位信息');
          // latitude = 31.1949185300
          // longitude = 121.3103584400
          let geo = {
            lng: longitude,
            lat: latitude
          }
          // if (options.fromCoffeeMaker) {
          //   wx.showModal({
          //     title: '提示', //提示的标题,
          //     content: '请选择门店或自助咖啡机自提饮品', //提示的内容,
          //     showCancel: false, //是否显示取消按钮,
          //     cancelColor: '#000000', //取消按钮的文字颜色,
          //     confirmText: '确定', //确定按钮的文字，默认为取消，最多 4 个字符,
          //     confirmColor: '#f50000', //确定按钮的文字颜色
          //   });
          // }
          self.setData({
            gettingLocation: false
          })
          app.globalData.isGeoAuth = true
          app.globalData.userGeo = geo
          self.actionAfterLocation(options)
        },
        fail() {
          self.setData({
            gettingLocation: false
          })
          self.checkAuth()
          app.globalData.isGeoAuth = false
          wx.hideLoading()
          wx.showToast({
            title: '加载失败,请检查是否打开微信及小程序定位权限',
            icon: 'none',
            duration: 3500
          })
        }
      })
    } else {
      this.actionAfterLocation(options)
        // if (options.fromCoffeeMaker) {
        //   wx.showModal({
        //     title: '提示', //提示的标题,
        //     content: '请选择门店或自助咖啡机自提饮品', //提示的内容,
        //     showCancel: false, //是否显示取消按钮,
        //     cancelColor: '#000000', //取消按钮的文字颜色,
        //     confirmText: '确定', //确定按钮的文字，默认为取消，最多 4 个字符,
        //     confirmColor: '#f50000', //确定按钮的文字颜色
        //   });
        // }
    }

  },

  actionAfterLocation(options) {
     if (options.from === 'store') {
       this.setData({
         from: options.tab === 'delivery' ? 'delivery' : 'selfExtracting',
         showSelfGet: options.tab !== 'delivery',
         showExpress: options.tab === 'delivery',
         isGeoAuth: app.globalData.isGeoAuth,
         type: options.tab === 'delivery' ? 1 : 1,
         storeInfo: wx.getStorageSync('STORE_INFO') ? JSON.parse(wx.getStorageSync('STORE_INFO')) : {},
       })
       if (options.tab === 'delivery') {
         this.showExpressList();
       }
       this.getCityList();
     } else {
       this.setData({
         goodsTotalPrice: parseInt(options.price),
         type: parseInt(options.type),
         showExpress: parseInt(options.type) === 2,
         showSelfGet: parseInt(options.type) === 1,
         storeInfo: wx.getStorageSync('STORE_INFO') ? JSON.parse(wx.getStorageSync('STORE_INFO')) : {},

       })
     }

     wx.setNavigationBarTitle({
       title: options.tab !== 'delivery' ? '选择门店' : '选择咖啡机'
     })

     // 页面初始化 options为页面跳转所带来的参数

     try {
       var addressId = wx.getStorageSync('addressId');
       if (addressId) {
         this.setData({
           'addressId': addressId
         });
       }

       var couponId = wx.getStorageSync('couponId');
       if (couponId) {
         this.setData({
           'couponId': couponId
         });
       }
     } catch (e) {
       // Do something when catch error
     }
  },

  calcTotalWeight () {
    let cartInfo = wx.getStorageSync('chooseCartInfo');
    let total = 0;
    cartInfo.forEach(element => {
      total += parseFloat(element.weight) * parseFloat(element.number)
    });
    return Math.ceil(total);
  },

  goSelfGet () {
    this.setData({
      showSelfGet: true,
      showExpress: false,
      init: false,
      from: this.data.from === 'delivery' ? 'selfExtracting' : ''
    })
    this.showShopList();
  },

  getCityList () {
    wx.showLoading({
      title: 'Loading...', //提示的内容,
      mask: true, //显示透明蒙层，防止触摸穿透,
      success: res => {}
    });
    let geo = getApp().globalData.userGeo;
    console.log(geo, 33333);
    var self = this;
    model('home/lbs/get-store-list-with-city', {
      // lat: 31.1949185300,
      // lng: 121.3103584400,
      lng: geo.lng,
      lat: geo.lat,
      // page: 1
    }).then(data => {
      if (data.code == 'suc') {
        var shopList = [];
        let result = data.data.cityMap;
        var list = Object.keys(result).map(function (item) {
          var value = Object.keys(result[item]).map(function (ele) {
            var inner_value = Object.keys(result[item][ele]).map(function (inner) {
              result[item][ele][inner].forEach(itemm => {
                if (itemm.id == self.data.storeInfo.id) {
                  itemm.isSelected = true;
                }
              })
              shopList = shopList.concat(result[item][ele][inner])
              return {
                key: inner,
                value: result[item][ele][inner]
              };
            });
            return {
              key: ele,
              value: inner_value
            };
          });
          return {
            key: item,
            value: value
          };
        });
        // var arr = Object.keys(result).map((k) => result[k])
        // result = result.concat(result);
        // wx.setStorageSync('shopList', shopList);
        const originalShopList = JSON.parse(JSON.stringify(shopList));
        shopList = shopList.filter(item => item.scene === 1);
        let zizhuList = originalShopList.filter(item => item.scene === 2);
        this.setData({
          cities: list,
          initShopList: shopList,
          zizhuList: zizhuList
        })
        this.setAllShopList(shopList, zizhuList);
      }
      
    })
  },

  goExpress() {
    this.setData({
      showExpress: true,
      showSelfGet: false,
      init: false,
      from: this.data.from === 'selfExtracting' ? 'delivery' : ''
    })
    this.showExpressList();
  },

  toggleNav () {
    this.setData({
      showCities: !this.data.showCities
    })
  },

  switchRightTab(e) {
    let index = parseInt(e.target.dataset.index);
    this.setData({
      curNav: index
    });
    this.setData({
      showCities: !this.data.showCities
    })
  },

  switchFirstTab (e) {
     let index = parseInt(e.target.dataset.index);
     this.setData({
       secondCities: this.data.cities[index].value,
       thirdCities: [],
       firstCitySelected: index,
       city1: this.data.cities[index].key
     });
  },

  switchSecondTab(e) {
    let index = parseInt(e.target.dataset.index);
    this.setData({
      thirdCities: this.data.secondCities[index].value,
      secondCitySelected: index,
      city2: this.data.secondCities[index].key
    });
  },

  switchThirdTab(e) {
    let index = parseInt(e.target.dataset.index);
    this.setData({
      thirdCitySelected: index,
      searchSuggest: this.data.thirdCities[index].value,
      showCities: false,
      city3: this.data.thirdCities[index].key
    });
  },

  showExpressList () {
    this.getCityList();
    // let addressList = wx.getStorageSync('addressList');
    // this.setData({
    //   searchSuggest: addressList
    // });
    // let addressList = wx.getStorageSync('shopList');
    // if (addressList) {
    //   this.setData({
    //     searchSuggest: addressList
    //   });
    // } else {
    //   this.getCityList();
    // }
    // let geo = getApp().globalData.userGeo;
    // console.log(geo, 33333);
    // let targetUrl = 'home/lbs/get-store-list-by-location'
    // model(targetUrl, {
    //   lng: geo.lng,
    //   lat: geo.lat,
    //   // lng: 121.419114,
    //   // lat: 31.239629,
    //   page: 1
    // }).then(data => {
    //   let result = data.data;
    //   result = result.filter(item => item.scene === 2);
    //   this.setData({
    //     loading: false,
    //     zizhuList: result
    //   });
    // }).catch(e => {
    //   this.setData({
    //     loading: false
    //   });
    //   console.log(e);
    // });
  },

  showShopList() {
    let addressList = wx.getStorageSync('shopList');
    if (addressList) {
      addressList = addressList.filter(item => {
        return item.area == this.data.city3;
      });
      this.setData({
        searchSuggest: addressList
      });
    } else {
      this.getCityList();
    }
    
  },

  goAddressList() {
    if (wx.getStorageSync('token')) {
      getApp().globalData.goAddress = true;
      // wx.switchTab({
      //   url: `/pages/order/list/list?type=1`
      // });
      wx.navigateTo({
        url: '/pages/my/address/address'
      });
    } else {
      wx.navigateTo({
        url: `/pages/login/login?fromTransport=1`
      });
    }
    
  },

  goAddress(e) {
    let id = e.currentTarget.dataset.id;
    wx.setStorageSync('chosenAddress', e.currentTarget.dataset.info)
    wx.navigateTo({
      url: `/pages/my/address/address?id=${id}`
    });
  },

  goStore (e) {
    var globalData = app.globalData;

    let nowTime = new Date().getTime();
    globalData.lastStoreTime = nowTime;

    globalData.fromTransport = {
      isCoffeeMaker: null,
      type: this.data.showSelfGet ? 'selfTaking' : 'deliver',
      detail: {
        detail: this.data.searchSuggest[parseInt(e.currentTarget.dataset.idx)]
      },
      idx: parseInt(e.currentTarget.dataset.idx)
    }
    wx.setStorageSync('fromTransport', this.data.showSelfGet ? 'selfTaking' : 'deliver');
    wx.setStorageSync('chosenAddress', this.data.searchSuggest[parseInt(e.currentTarget.dataset.idx)]);
    //  暂时屏蔽
    if (false && (this.data.fromCheckout && this.data.showSelfGet === false)) {
      let pages = getCurrentPages();
      let prevPage = pages[pages.length - 2];
      console.log(pages)
      if (prevPage) {
        prevPage.setData({
          fromAddress: true,
          fromTransportIndex: parseInt(e.currentTarget.dataset.idx)
        });
      }
      wx.navigateBack({
        delta: 1 //返回的页面数，如果 delta 大于现有页面数，则返回到首页,
      });
    } else {
      wx.switchTab({
        url: `/pages/store/store`
      });
    }
    
    
  },

  goCoffeemaker(e) {
    var globalData = app.globalData;

    let nowTime = new Date().getTime();
    globalData.lastStoreTime = nowTime;

    globalData.fromTransport = {
      isCoffeeMaker: 1,
      type: this.data.showSelfGet ? 'selfTaking' : 'deliver',
      detail: {
        detail: this.data.zizhuList[parseInt(e.currentTarget.dataset.idx)]
      },
      idx: parseInt(e.currentTarget.dataset.idx)
    }
    wx.setStorageSync('fromTransport', this.data.showSelfGet ? 'selfTaking' : 'deliver');
    wx.setStorageSync('chosenAddress', this.data.zizhuList[parseInt(e.currentTarget.dataset.idx)]);
    if (false && this.data.fromCheckout && this.data.showSelfGet === false) {
      let pages = getCurrentPages();
      let prevPage = pages[pages.length - 2];
      console.log(pages)
      if (prevPage) {
        prevPage.setData({
          fromAddress: true,
          fromTransportIndex: parseInt(e.currentTarget.dataset.idx)
        });
      }
      wx.navigateBack({
        delta: 1 //返回的页面数，如果 delta 大于现有页面数，则返回到首页,
      });
    } else {
      wx.switchTab({
        url: `/pages/store/store`
      });
    }


  },

  getCheckoutInfo: function () {
    let that = this;

    if (this.data.type === 1) {
      if (this.data.init) {
        this.getCityList();
      } else {
        let addressList = wx.getStorageSync('shopList');
        if (addressList) {
          this.setData({
            searchSuggest: addressList
          });
        }
      }
      // let addressList = wx.getStorageSync('shopList');
      // if (addressList) {
      //   this.setData({
      //     searchSuggest: addressList
      //   });
      // }
    } else {
      model('my/address/list', {
        userId: wx.getStorageSync('token') && wx.getStorageSync('token').user.id,
      }).then(data => {
        wx.setStorageSync('addressList', data.data);
        this.setData({
          searchSuggest: data.data
        });
      }).catch(e => {
        console.log(e);
      });
    }
  },

  setAllShopList(shopList, zizhuList) {
    let min = 100000000;
    let minIndex = 0;
    // console.log(result, 33333);
    let initShopList = shopList.map((item, index) => {
      if (parseInt(item.distance) === item.distance && parseInt(item.distance) < min) {
        min = parseInt(item.distance);
        minIndex = index;
      }
      item.distanceReal = item.distance;
      item.distanceStatus = item.distance >= 3000 ? '>3' : item.distance;
      item.distance = item.distance >= 3000 ? '>3' : item.distance;
      return item;
    });

    zizhuList = zizhuList.map((item, index) => {
      if (parseInt(item.distance) === item.distance && parseInt(item.distance) < min) {
        min = parseInt(item.distance);
        minIndex = index;
      }
      item.distanceReal = item.distance;
      item.distanceStatus = item.distance >= 3000 ? '>3' : item.distance;
      item.distance = item.distance >= 3000 ? '>3' : item.distance;
      return item;
    });

    shopList = initShopList.filter(item => {
      return item.prov == initShopList[minIndex].prov && item.city == initShopList[minIndex].city && item.area == initShopList[minIndex].area;
    })

    wx.hideLoading();

    wx.setStorageSync('shopList', initShopList);
    this.setData({
        city1: initShopList[minIndex].prov,
        city2: initShopList[minIndex].city,
        city3: initShopList[minIndex].area,
        minIndex: minIndex,
        searchSuggest: shopList,
        zizhuList: zizhuList,
    });
  },

  // goAddressList () {
  //   wx.navigateTo({
  //     url: '/pages/my/address_list/address_list'
  //   });
  // },
  onReady: function () {
    // 页面渲染完成

  },
  onShow: function () {
    // 页面显示
    // wx.showLoading({
    //   title: '加载中...',
    // })
    this.getCheckoutInfo();

  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  }
})
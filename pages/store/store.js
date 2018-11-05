// pages/store/store.js
const app = getApp();
let timer;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    viewTo: "",
    viewToLeft: "",
    listHeight: 300,
    activeIndex: 0,
    tabIndex: 0,
    isCatePanelShow: false,
    isCartPanelShow: false,
    showCart: false,
    heigthArr: [],
    cart: [],
    totalMoney: 0,
    storeInfo: {
      //服务端获取信息
      storeId: 1,
      storeName: "美式咖啡",
      storeImgUrl: "/images/store.png",
    },
    food: [{
      titleId: "title1",
      title: "大师咖啡",
      foodCount: 0,
      items: [{
        foodId: 1,
        name: '美式咖啡',
        ename: 'Americano',
        price: 23,
        note: '规格/糖/奶/温度',
        count: 0,
        classify: []
      },
      {
        foodId: 2,
        name: "美式咖啡",
        ename: 'Americano',
        price: 23,
        note: '规格/糖/奶/温度',
        zan: 34,
        count: 0,
        classify: []
      },
      {
        foodId: 3,
        name: "美式咖啡",
        ename: 'Americano',
        price: 23,
        count: 0,
        classify: [{
          describe: "大份",
          price: 30
        },
        {
          describe: "中份",
          price: 23
        },
        {
          describe: "小份",
          price: 15
        }
        ]
      }
      ]
    },
    {
      titleId: "title2",
      title: "大师咖啡",
      foodCount: 0,
      items: [{
        foodId: 4,
        name: "美式咖啡",
        ename: 'Americano',
        price: 23,
        note: '规格/糖/奶/温度',
        zan: 34,
        count: 0,
        classify: []
      },
      {
        foodId: 5,
        name: "美式咖啡",
        ename: 'Americano',
        price: 23,
        note: '规格/糖/奶/温度',
        zan: 34,
        count: 0,
        classify: []
      },
      {
        foodId: 6,
        name: "美式咖啡",
        ename: 'Americano',
        price: 23,
        note: '规格/糖/奶/温度',
        zan: 34,
        count: 0,
        classify: [{
          describe: "大份",
          price: 30
        },
        {
          describe: "中份",
          price: 23
        },
        {
          describe: "小份",
          price: 15
        }
        ]
      }
      ]
    },
    {
      titleId: "title3",
      title: "大师咖啡",
      foodCount: 0,
      items: [{
        foodId: 7,
        name: "美式咖啡",
        ename: 'Americano',
        price: 23,
        note: '规格/糖/奶/温度',
        zan: 34,
        count: 0,
        classify: []
      },
      {
        foodId: 8,
        name: "美式咖啡",
        ename: 'Americano',
        price: 23,
        note: '规格/糖/奶/温度',
        zan: 34,
        count: 0,
        classify: []
      },
      {
        foodId: 9,
        name: "美式咖啡",
        ename: 'Americano',
        price: 23,
        note: '规格/糖/奶/温度',
        zan: 34,
        count: 0,
        classify: []
      }
      ]
    },
    {
      titleId: "title4",
      title: "大师咖啡",
      foodCount: 0,
      items: [{
        foodId: 10,
        name: "美式咖啡",
        ename: 'Americano',
        price: 3,
        note: "",
        zan: 34,
        count: 0,
        classify: []
      },
      {
        foodId: 11,
        name: "美式咖啡",
        ename: 'Americano',
        price: 3,
        note: "",
        zan: 34,
        count: 0,
        classify: []
      },
      {
        foodId: 12,
        name: "美式咖啡",
        ename: 'Americano',
        price: 3,
        note: "",
        zan: 34,
        count: 0,
        classify: []
      }
      ]
    },
    {
      titleId: "title5",
      title: "大师咖啡",
      foodCount: 0,
      items: [{
        foodId: 13,
        name: "美式咖啡",
        ename: 'Americano',
        price: 23,
        note: "美式咖啡",
        zan: 34,
        count: 0,
        classify: []
      },
      {
        foodId: 14,
        name: "美式咖啡",
        ename: 'Americano',
        price: 23,
        note: '规格/糖/奶/温度',
        zan: 34,
        count: 0,
        classify: []
      },
      {
        foodId: 15,
        name: "美式咖啡",
        ename: 'Americano',
        price: 23,
        note: '规格/糖/奶/温度',
        zan: 34,
        count: 0,
        classify: [{
          describe: "大份",
          price: 30
        },
        {
          describe: "中份",
          price: 23
        },
        {
          describe: "小份",
          price: 15
        }
        ]
      }
      ]
    }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: this.data.storeInfo.storeName
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let height1, height2;
    let res = wx.getSystemInfoSync();
    let winHeight = res.windowHeight;
    let query = wx.createSelectorQuery();
    query.select(".hd-wrap").boundingClientRect();
    query.exec(res => {
      height1 = res[0].height;
      let query1 = wx.createSelectorQuery();
      query1.select(".img-caption").boundingClientRect();
      query1.exec(res => {
        height2 = res[0].height;
        this.setData({
          listHeight: winHeight - height1 - height2
        });
        this.calculateHeight();
      });
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () { },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () { },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () { },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () { },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () { },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () { },
    /**
   * 获取商品列表
   * 
   */ 
  checkAuth() {
    wx.getSetting({
      success(res) {
        const {authSetting} = res
        if (!authSetting.scope.userLocation) {
          // console.log('need auth')
        }
      },
      fail() {

      }
    })
  },
  fetchLoaction() {
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        const {latitude, longitude} = res
        this.setData({
          geo: {
            lng: longitude,
            lat: latitude
          }
        })
      },
      fail() {
        this.checkAuth()
      }
    })
  },
  fetchProductAll() {
    wx.request({
      url: 'http://47.100.233.24:6688/api/v1/server/home/product/all?storeId=29'
    })
  },
  selectFood(e) {
    this.setData({
      activeIndex: e.target.dataset.index,
      viewTo: e.target.dataset.titleid
    });
  },
  calculateHeight() {
    let heigthArr = [];
    let height = 0;
    heigthArr.push(height);
    var query = wx.createSelectorQuery();
    query.selectAll(".title-group").boundingClientRect();
    query.exec(res => {
      for (let i = 0; i < res[0].length; i++) {
        console.log(res[0][i])
        height += parseInt(res[0][i].height);
        heigthArr.push(height);
      }
      this.setData({
        heigthArr: heigthArr
      });
    });
  },
  // 手机端有延迟 节流函数效果不好 用防抖函数凑合
  scroll(e) {
    clearTimeout(timer);
    timer = setTimeout(() => {
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
              viewToLeft: 'title1left'
            })
          } else {
            this.setData({
              viewToLeft: 'title' + (i - 2) + 'left'
            })
          }
          return;
        }
      }
    }, 100)
  },
  add(e) {
    let groupindex = e.target.dataset.groupindex;
    let index = e.target.dataset.index;
    let countMsg =
      "food[" +
      groupindex +
      "].items[" +
      index +
      "].count";
    let count = this.data.food[groupindex].items[
      index
    ].count;
    let foodCountMsg = "food[" + groupindex + "].foodCount";
    let foodCount = this.data.food[groupindex].foodCount;
    let foodId = this.data.food[groupindex].items[
      index
    ].foodId;
    count += 1;
    foodCount += 1;
    this.setData({
      [countMsg]: count, //数据的局部更新
      [foodCountMsg]: foodCount
    });
    let cart = this.data.cart;
    let hasCart = false;
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].foodId == foodId) {
        hasCart = true;
        break;
      }
    }
    if (hasCart) {
      cart[i].count++;
    } else {
      cart.push({
        ...this.data.food[groupindex].items[index],
        groupindex
      });
    }
    let totalMoney = this.data.totalMoney;
    totalMoney += this.data.food[groupindex].items[
      index
    ].price;
    this.setData({
      cart: cart,
      totalMoney: totalMoney
    });
  },
  reduce(e) {
    let groupindex = e.target.dataset.groupindex;
    let index = e.target.dataset.index;
    let countMsg =
      "food[" +
      groupindex +
      "].items[" +
      index +
      "].count";
    let count = this.data.food[groupindex].items[
      index
    ].count;
    let foodCountMsg = "food[" + groupindex + "].foodCount";
    let foodCount = this.data.food[groupindex].foodCount;
    let foodId = this.data.food[groupindex].items[
      index
    ].foodId;
    count -= 1;
    foodCount -= 1;
    this.setData({
      [countMsg]: count,
      [foodCountMsg]: foodCount
    });
    let cart = this.data.cart;
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].foodId == foodId) {
        if (cart[i].count == 1) {
          cart.splice(i, 1);
        } else {
          cart[i].count--;
        }
        break;
      }
    }
    let totalMoney = this.data.totalMoney;
    totalMoney -= this.data.food[groupindex].items[
      index
    ].price;
    this.setData({
      cart: cart,
      totalMoney: totalMoney
    });
  },
  toggleSpec() {
    let isShow = this.data.isCatePanelShow
    console.log(isShow)
    this.setData({
      isCatePanelShow: !isShow
    });
  },
  toggleCart() {
    let isShow = this.data.isCartPanelShow
    if (!isShow) {
      wx.hideTabBar({
        animation: false,
        success() {},
        fail() {}
      })
    } else {
      wx.hideTabBar({
        animation: false,
        success() {},
        fail() {}
      })
    }
    this.setData({
      isCartPanelShow: !isShow
    })
  }
});
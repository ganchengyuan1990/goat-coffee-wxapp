// pages/aboutus/aboutus.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      region: ['上海市', '上海市', '长宁区'],
      name: '',
      phone: '',
      address: '',
      addline1: false,
      addline2: false,
      addline3: false,
      addline4: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      let self = this;
    // wx.downloadFile({
    wx.request({
        url: 'https://www.jasongan.cn/getAddressByOpenId',
        method: 'GET',
        data: {
            openid: wx.getStorageSync('openid')
        },
        header: {
        //设置参数内容类型为x-www-form-urlencoded
            'content-type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
        },
        success: function (res) {
            let address = res.data.resultLists[0].address;
            if (address) {
                address = JSON.parse(address);
                self.setData({
                    name: address.name,
                    address: address.address,
                    phone: address.phone,
                    region: address.region.split(',')
                })
            }
        }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  bindRegionChange (e) {
    this.setData({
        region: e.detail.value
    })
  },

  updateUserAddress () {
      let self = this;
      if (this.data.name && this.data.phone && this.data.name && this.data.region && this.data.address) {
          wx.request({
                url: 'https://www.jasongan.cn/updateUserAddress',
                method: 'GET',
                data: {
                    region: this.data.region.join(','),
                    phone: this.data.phone,
                    name: this.data.name,
                    address: this.data.address,
                    openid: wx.getStorageSync('openid')
                },
                header: {
                //设置参数内容类型为x-www-form-urlencoded
                    'content-type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json'
                },
                success: function (res) {
                    let pages = getCurrentPages();
                    let currPage = pages[pages.length - 1];   //当前页面
                    let prevPage = pages[pages.length - 2];  //上一个页面
                    prevPage.setData({
                        address: `${self.data.region.join(' ')} ${self.data.address}`,
                        receiver: `联系人：${self.data.name}，联系电话：${self.data.phone}`,
                        isFromAddress: true,
                        addressObj: {
                            region: self.data.region.join(','),
                            phone: self.data.phone,
                            name: self.data.name,
                            address: self.data.address,
                        }
                    })
                    wx.navigateBack({
                        delta: 1
                    })
                }
            })
      }
      
  },

  dealName: function (e) {
        this.setData({
            name: e.detail.value
        })
    },

    dealPhone: function (e) {
        this.setData({
            phone: e.detail.value
        })
    },

    dealAddress: function (e) {
        this.setData({
            address: e.detail.value
        })
    },

    addLine1 () {
        this.setData({
            addline1: true,
            addline2: false,
            addline3: false,
            addline4: false
        })
    },
    addLine2 () {
        this.setData({
            addline2: true,
            addline1: false,
            addline3: false,
            addline4: false
        })
    },
    addLine3 () {
        this.setData({
            addline3: true,
            addline2: false,
            addline1: false,
            addline4: false
        })
    },
    addLine4 () {
        this.setData({
            addline4: true,
            addline2: false,
            addline3: false,
            addline1: false
        })
    }
})
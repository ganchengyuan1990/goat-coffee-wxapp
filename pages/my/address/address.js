// pages/aboutus/aboutus.js

import model from '../../../utils/model';

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
    addline4: false,
    newAdd: true,
    toastShown: false,
    toastInfo: '',
    id: -1,
    gender: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this;
    let chosenAddress = wx.getStorageSync('chosenAddress');
    let personalInfo = wx.getStorageSync('token') && wx.getStorageSync('token').user;
    this.setData({
      phone: personalInfo && personalInfo.tel
    });
    
    if (options.id) {
      this.setData({
        newAdd: false,
        id: parseInt(options.id),
      });
      if (chosenAddress) {
        this.setData({
          name: chosenAddress.contact,
          phone: chosenAddress.tel,
          address: chosenAddress.address,
          region: [chosenAddress.prov, chosenAddress.city, chosenAddress.area],
        });
        wx.removeStorageSync({
          key: 'chosenAddress'
        });
      }
    }
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
    });
  },

  addUserAddress () {
    if (this.data.name && this.data.phone && this.data.name && this.data.region && this.data.address) {
      model('my/address/add', {
        contact: this.data.name,
        tel: this.data.phone,
        userId: wx.getStorageSync('token').user.id,
        prov: this.data.region[0],
        city: this.data.region[1],
        sex: this.data.gender,
        area: this.data.region[2],
        address: this.data.address,
        isdefault: 1
      }, 'POST').then(res => {
        if (res.code === 'suc') {
          this.setData({
            toastShown: true,
            toastInfo: '添加成功'
          });
          setTimeout(() => {
            wx.navigateBack({
              delta: 1 //返回的页面数，如果 delta 大于现有页面数，则返回到首页,
            });
          }, 2000);
          this.setPrevPage();
        }
      }).catch(e => {
        wx.showModal({
          title: '提示', //提示的标题,
          showCancel: false, //是否显示取消按钮,
          content: e, //提示的内容,
          cancelColor: '#000000', //取消按钮的文字颜色,
          confirmText: '确定', //确定按钮的文字，默认为取消，最多 4 个字符,
          confirmColor: '#3CC51F', //确定按钮的文字颜色,
          success: res => {
            if (res.confirm) {
              console.log('用户点击确定');
            } else if (res.cancel) {
              console.log('用户点击取消');
            }
          }
        });
      });
    }
  },

  updateUserAddress () {
    let self = this;
    if (!this.data.newAdd) {
      if (this.data.name && this.data.phone && this.data.name && this.data.region && this.data.address) {
        model('my/address/edit', {
          contact: this.data.name,
          tel: this.data.phone,
          userId: wx.getStorageSync('token').user.id,
          sex: this.data.gender,
          id: this.data.id,
          prov: this.data.region[0],
          city: this.data.region[1],
          area: this.data.region[2],
          address: this.data.address,
          isdefault: 1
        }, 'POST').then(res => {
          if (res.code === 'suc') {
            this.setData({
              toastShown: true,
              toastInfo: '更新成功'
            });
            setTimeout(() => {
              wx.navigateBack({
                delta: 1 //返回的页面数，如果 delta 大于现有页面数，则返回到首页,
              });
            }, 2000);
            this.setPrevPage();
          }
        }).catch(e => {
          wx.showModal({
            title: '提示', //提示的标题,
            showCancel: false, //是否显示取消按钮,
            content: e, //提示的内容,
            cancelColor: '#000000', //取消按钮的文字颜色,
            confirmText: '确定', //确定按钮的文字，默认为取消，最多 4 个字符,
            confirmColor: '#3CC51F', //确定按钮的文字颜色,
            success: res => {
              if (res.confirm) {
                console.log('用户点击确定');
              } else if (res.cancel) {
                console.log('用户点击取消');
              }
            }
          });
        });
      }
    } else {
      this.addUserAddress();
    }
      
      
  },

  changeGender (e) {
    this.setData({
      gender: e.currentTarget.dataset.gender
    });
  },

  deleteUserAddress () {
    model('my/address/del', {
      id: this.data.id
    }, 'POST').then(res => {
      if (res.code === 'suc') {
        this.setData({
          toastShown: true,
          toastInfo: '删除成功'
        });
      }
      setTimeout(() => {
        wx.navigateBack({
          delta: 1 //返回的页面数，如果 delta 大于现有页面数，则返回到首页,
        });
      }, 2000);
      this.setPrevPage();
    });
  },

  setPrevPage () {
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    prevPage.setData({
      fromAddress: true
    });
  },

  dealName: function (e) {
    this.setData({
      name: e.detail.value
    });
  },

  dealPhone: function (e) {
    this.setData({
      phone: e.detail.value
    });
  },

  dealAddress: function (e) {
    this.setData({
      address: e.detail.value
    });
  },

  addLine1 () {
    this.setData({
      addline1: true,
      addline2: false,
      addline3: false,
      addline4: false
    });
  },
  addLine2 () {
    this.setData({
      addline2: true,
      addline1: false,
      addline3: false,
      addline4: false
    });
  },
  addLine3 () {
    this.setData({
      addline3: true,
      addline2: false,
      addline1: false,
      addline4: false
    });
  },
  addLine4 () {
    this.setData({
      addline4: true,
      addline2: false,
      addline3: false,
      addline1: false
    });
  }
});
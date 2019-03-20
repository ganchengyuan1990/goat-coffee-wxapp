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
      gender: 1,
      locked: false,
      fromLogin: false,
      items: [
          {
              name: '设为默认地址',
              value: '设为默认地址',
              checked: true
          }
      ],
      isDefault: true
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
    })
    if (options.fromLogin) {
        this.setData({
            fromLogin: true
        })
    }
    if (options.id) {
        this.setData({
            newAdd: false,
            id: parseInt(options.id),
        })
        if (chosenAddress) {
            let items = [
                {
                    name: '设为默认地址',
                    value: '设为默认地址',
                    checked: chosenAddress.isdefault
                }
            ];
            this.setData({
                name: chosenAddress.contact,
                phone: chosenAddress.tel,
                address: chosenAddress.address,
                region: [chosenAddress.prov, chosenAddress.city, chosenAddress.area],
                isDefault: chosenAddress.isdefault,
                items: items,
                gender: parseInt(chosenAddress.sex)
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
    })
  },

  validate() {
    let result = true;
    let errorInfo = '';
    if (!this.data.name) {
        result = false;
        errorInfo = '请输入收货人姓名'
    } else if (!this.data.phone) {
        result = false;
        errorInfo = '请输入收货人电话'
    } else if (!this.data.address) {
        result = false;
        errorInfo = '请输入收货地址'
    } else if (!this.data.name.match(/^[\u4e00-\u9fa5_a-zA-Z0-9]+$/)) {
        result = false;
        errorInfo = '请输入有效的收货人姓名'
    } else if (!this.data.phone.match(/^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/)) {
        result = false;
        errorInfo = '请输入有效手机号'
    }
    return {
        result: result,
        errorInfo: errorInfo
    }
  },

  checkboxChange (e) {
    this.setData({
        isDefault: !this.data.isDefault
    })
  },

  addUserAddress () {
    if (!this.validate().result) {
        this.setData({
            toastShown: true,
            toastInfo: this.validate().errorInfo
        })
    } else {
        if (!this.data.locked) {
            this.setData({
                locked: true
            });
            model('my/address/add', {
                contact: this.data.name,
                tel: this.data.phone,
                userId: wx.getStorageSync('token').user.id,
                prov: this.data.region[0],
                city: this.data.region[1],
                sex: this.data.gender,
                area: this.data.region[2],
                address: this.data.address,
                isdefault: this.data.isDefault ? 1 : 0
            }, 'POST').then(res => {
                if (res.code === 'suc') {
                    this.setData({
                        toastShown: true,
                        toastInfo: '添加成功'
                    })
                    if (this.data.fromLogin) {
                        wx.navigateTo({
                            url: '/pages/my/address_list/address_list'
                        });
                    } else {
                        setTimeout(() => {
                            wx.navigateBack({
                                delta: 1 //返回的页面数，如果 delta 大于现有页面数，则返回到首页,
                            });
                        }, 1000);
                        this.setPrevPage();
                    }

                }
            }).catch(e => {
                wx.showModal({
                    title: '提示', //提示的标题,
                    showCancel: false, //是否显示取消按钮,
                    content: e, //提示的内容,
                    cancelColor: '#000000', //取消按钮的文字颜色,
                    confirmText: '确定', //确定按钮的文字，默认为取消，最多 4 个字符,
                    confirmColor: '#f50000', //确定按钮的文字颜色,
                    success: res => {
                        this.setData({
                            locked: false
                        });
                        if (res.confirm) {
                            console.log('用户点击确定')
                        } else if (res.cancel) {
                            console.log('用户点击取消')
                        }
                    }
                });
            })
        }
        
    }
  },

  updateUserAddress () {
      let self = this;
      if (!this.data.newAdd) {
        if (!this.validate().result) {
            this.setData({
                toastShown: true,
                toastInfo: this.validate().errorInfo
            })
        } else {
            if (!this.data.locked) {
                this.setData({
                    locked: true
                });
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
                    isdefault: this.data.isDefault ? 1 : 0
                }, 'POST').then(res => {
                    if (res.code === 'suc') {
                        this.setData({
                            toastShown: true,
                            toastInfo: '更新成功'
                        })
                        setTimeout(() => {
                            wx.navigateBack({
                                delta: 1 //返回的页面数，如果 delta 大于现有页面数，则返回到首页,
                            });
                        }, 1000);
                        this.setPrevPage();
                    }
                }).catch(e => {
                    wx.showModal({
                        title: '提示', //提示的标题,
                        showCancel: false, //是否显示取消按钮,
                        content: e, //提示的内容,
                        cancelColor: '#000000', //取消按钮的文字颜色,
                        confirmText: '确定', //确定按钮的文字，默认为取消，最多 4 个字符,
                        confirmColor: '#f50000', //确定按钮的文字颜色,
                        success: res => {
                            this.setData({
                                locked: false
                            });
                            if (res.confirm) {
                                console.log('用户点击确定')
                            } else if (res.cancel) {
                                console.log('用户点击取消')
                            }
                        }
                    });
                })
            }

        }
      } else {
          this.addUserAddress();
      }
      
      
  },

  changeGender (e) {
    this.setData({
        gender: e.currentTarget.dataset.gender
    })
  },

  deleteUserAddress () {
    model('my/address/del', {
        id: this.data.id
    }, 'POST').then(res => {
        if (res.code === 'suc') {
            this.setData({
                toastShown: true,
                toastInfo: '删除成功'
            })
        }
        setTimeout(() => {
            wx.navigateBack({
                delta: 1 //返回的页面数，如果 delta 大于现有页面数，则返回到首页,
            });
        }, 1000);
        this.setPrevPage();
    })
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
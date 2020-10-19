const app = getApp();
import model, {
  BASE_URL
} from '../../../utils/model';

import mockData33  from '../../../components/arrival-time/mock.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    arrivalTime: mockData33,
    region: ['上海市', '上海', '黄浦区'],
    name: '',
    phone: '',
    gender: '',
    address: '',
    img: '',
    imgKey: '',
    userInfo: {},
    goBackFromName: false,
    isBind: true,
    birthday: '完善生日信息, 年年有惊喜',
    work: '请选择',
    index: 0,
    initValue: false,
    submitted: false,
    noCache: false,
    range: ['互联网-软件', '通信-硬件', '房地产-建筑', '文化传媒', '金融类', '消费品', '教育', '贸易', '生物-医疗', '能源-化工', '政府机构', '服务业', '其他行业'],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.noCache) {
      this.setData({
        noCache: true,
      });
    }
  },

  bindPickerChange: function (e) {
    if (!this.data.birthday || this.data.birthday == '完善生日信息, 年年有惊喜') {
      this.setData({
        birthday: e.detail.value
      }, () => {
        this.saveProfile();
      });
    } else {
      wx.showToast({
        title: '生日仅限修改一次，如有疑问请联系客服', //提示的内容,
        icon: 'none', //图标,
        duration: 2000, //延迟时间,
        mask: true, //显示透明蒙层，防止触摸穿透,
        success: res => {}
      });
    }
    
    
  },

  bindWorkChange (e) {
    this.setData({
      index: parseInt(e.detail.value),
      work: this.data.range[parseInt(e.detail.value)]
    }, () => {
      this.saveProfile();
    });
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
    const lastPrizeAddressInfo = getApp().globalData.lastPrizeAddressInfo;
    if (lastPrizeAddressInfo) {
      if (Array.isArray(lastPrizeAddressInfo.area)) {
        lastPrizeAddressInfo.area = lastPrizeAddressInfo.area.join('');
      }
      this.setData({
        lastPrizeAddressInfo: lastPrizeAddressInfo,
        initValue: true
      });
      getApp().globalData.lastPrizeAddressInfo = null;
    }
    let info = wx.getStorageSync('token');
    let userInfo = info.user;
    // let userInfoWechat = app.globalData.userInfo
    let userInfoWechat = wx.getStorageSync('personal_info') || {};
    if (info.token) {
      console.log(userInfo, 'userinfo');
      console.log(userInfoWechat, 'wechat');

      this.setData({
        userInfo: userInfo,
        userInfoWechat: userInfoWechat
      });
    } else {
      wx.redirectTo({
        url: '/pages/login/login'
      });
      return;
    }

    console.log(getApp().globalData.lastUserPrizeRecordId, '@@@lastUserPrizeRecordId');

    const lastUserPrizeRecordId = getApp().globalData.lastUserPrizeRecordId;
    if (lastUserPrizeRecordId) {
      getApp().globalData.lastUserPrizeRecordId = null;
    }

    this.setData({
      id: lastUserPrizeRecordId,
      name: userInfo.userName || userInfoWechat.nickName || '',
      gender: userInfo.sex || userInfoWechat.gender || '',
      img: userInfo.avatar || userInfoWechat.avatarUrl || '',
      birthday: userInfo.birthday || userInfoWechat.birthday || '完善生日信息, 年年有惊喜',
      work: userInfo.work || userInfoWechat.work || '请选择'
    });
  },

  validate() {
    let result = true;
    let errorInfo = '';
    if (this.data.phone.length !== 11) {
      result = false;
      errorInfo = '请正确填写手机号';
    } 
    return errorInfo;
  },

  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    this.setData({
      region: e.detail.value
    });
  },

  showGenderList() {
    let self = this;
    wx.showActionSheet({
      itemList: ['男', '女'],
      success(res) {
        console.log(res.tapIndex);
        self.setData({
          gender: res.tapIndex === 0 ? 1 : 2
        });
        self.saveProfile();
      },
      fail(res) {
        console.log(res.errMsg);
      }
    });
  },
  goEdit() {
    let name = this.data.userInfo.userName || this.data.userInfoWechat.nickName || '';
    wx.navigateTo({
      url: `/pages/my/profile/edit?name=${name}`
    });
  },

  actionSheetImg () {
    var self = this;
    wx.showActionSheet({
      itemList: ['拍照', '从手机相册选择'],
      success(res) {
        if (res.tapIndex == 0) {
          self.takePhoto();
        } else {
          self.chooseImage();
        }
      },
      fail(res) {
        console.log(res.errMsg);
      }
    });

  },

  takePhoto() {
    const ctx = wx.createCameraContext();
    ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        this.setData({
          src: res.tempImagePath
        });
      }
    });
  },

  bindNameInput(e) {
    this.setData({
      name: e.detail.value
    });
  },

  bindPhoneInput(e) {
    this.setData({
      phone: e.detail.value
    });
  },

  bindAddressInput(e) {
    this.setData({
      address: e.detail.value
    });
  },

  uploadFile(path) {
    let self = this;
    // console.log(path, 'path');
    
    let _token = wx.getStorageSync('token');
    wx.uploadFile({
      url: `${BASE_URL}my/user/file-upload`,
      filePath: path,
      name: 'file',
      header: {
        // 'content-type': 'application/x-www-form-urlencoded',
        // 'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Authorization': _token ? `${_token.user.id} ${_token.token}` : '',
      },
      formData: {
        'user': 'avatar'
      },
      success(res) {
        const data = res.data;
        wx.hideLoading();
        // console.log(res, 'load data');
        let detail = JSON.parse(data || '{}');
        if (detail.code === 'suc') {
          const { key, url } = detail.data;
          self.setData({
            img: url,
            imgKey: key
          });
          self.saveProfile();
        } else {
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: '上传失败'
          });
        }
      },
      fail(e) {
        console.log('[exception]: upload fail', e);
        wx.hideLoading();
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '上传失败'
        });
      }
    });
  },
  updateCurrentInfo(obj) {
    if (obj.avatar) {
      obj.avatar = this.data.img;
    }
    try {
      let token = wx.getStorageSync('token');
      let userInfo = token.user;
      token.user = Object.assign(userInfo, obj);
      wx.setStorageSync('token', token);
    } catch (e) {
      console.log(e);
    }
  },


  goIndex () {
    wx.switchTab({
      url: '/pages/store/store'
    });
  },

  saveAddress() {
    let self = this;
    let obj = {};
    let data = this.data;
    let message = '';
    if (data.name) {
      obj.name = data.name;
    } else {
      message = '请输入联系人姓名';
    }
    if (data.phone) {
      obj.phone = data.phone;
    } else {
      message = '请输入手机号';
    }
    if (data.address) {
      obj.address = data.address;
    } else {
      message = '请选择所在地区';
    }
    if (data.region) {
      obj.area = data.region;
    } else {
      message = '请输入详细地址';
    }



    if (message) {
      wx.showToast({
        title: message,
        icon: 'none',
        duration: 3000
      });
      return ;
    } else if (this.validate()) {
      wx.showToast({
        title: this.validate(),
        icon: 'none',
        duration: 3000
      });
      return;
    }
    

    model('activity/luck-activity/edit-address', {
      user_prize_record_id: this.data.id,
      address_json: JSON.stringify(obj)
    }, 'POST').then(res => {
      this.setData({
        submitted: true,
      });
      wx.showModal({
        title: '提示',
        content: '我们已收到您的收货地址，预计将在1-3个工作日内发货，请留意物流信息。',
        showCancel: false,
        confirmText: '确定',
        confirmColor: '#EC0F10',
        success(res) {
          if (res.confirm) {
          } 
        }
      });
    }).catch(e => {
      wx.showToast({
        title: e,
        icon: 'none',
        duration: 1500
      });
    });
  },

  logout () {
    wx.showModal({
      title: '提示',
      content: '我们已收到您的收货地址，预计将在1-3个工作日内发货，请留意物流信息。',
      showCancel: false,
      confirmText: '确定',
      success(res) {
        if (res.confirm) {
          wx.removeStorageSync('token');
          setTimeout(() => {
            wx.switchTab({
              url: '/pages/member/index/index'
            });
          }, 1000);
        } 
      }
    });
  }

});
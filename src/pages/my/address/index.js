const app = getApp()
import model, {
  BASE_URL
} from '../../../utils/model'

import mockData33  from '../../../components/arrival-time/mock.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    arrivalTime: mockData33,
    region: ['广东省', '广州市', '海珠区'],
    name: '',
    gender: '',
    img: '',
    imgKey: '',
    userInfo: {},
    goBackFromName: false,
    isBind: true,
    birthday: '完善生日信息, 年年有惊喜',
    work: '请选择',
    index: 0,
    range: ['互联网-软件', '通信-硬件', '房地产-建筑', '文化传媒', '金融类', '消费品', '教育', '贸易', '生物-医疗', '能源-化工', '政府机构', '服务业', '其他行业'],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let info = wx.getStorageSync('token')
    let userInfo = info.user
    // let userInfoWechat = app.globalData.userInfo
    let userInfoWechat = wx.getStorageSync('personal_info') || {}
    if (info.token) {
      console.log(userInfo, 'userinfo');
      console.log(userInfoWechat, 'wechat');

      this.setData({
        userInfo: userInfo,
        userInfoWechat: userInfoWechat
      })
    } else {
      wx.redirectTo({
        url: '/pages/login/login'
      })
      return
    }

    this.setData({
      name: userInfo.userName || userInfoWechat.nickName || '',
      gender: userInfo.sex || userInfoWechat.gender || '',
      img: userInfo.avatar || userInfoWechat.avatarUrl || '',
      birthday: userInfo.birthday || userInfoWechat.birthday || '完善生日信息, 年年有惊喜',
      work: userInfo.work || userInfoWechat.work || '请选择'
    })
  },

  bindPickerChange: function (e) {
    if (!this.data.birthday || this.data.birthday == '完善生日信息, 年年有惊喜') {
      this.setData({
        birthday: e.detail.value
      }, () => {
        this.saveProfile();
      })
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
    if (this.data.goBackFromName) {
      this.saveProfile();
    }
  },

  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },

  showGenderList() {
    let self = this
    wx.showActionSheet({
      itemList: ['男', '女'],
      success(res) {
        console.log(res.tapIndex)
        self.setData({
          gender: res.tapIndex === 0 ? 1 : 2
        });
        self.saveProfile();
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
  },
  goEdit() {
    let name = this.data.userInfo.userName || this.data.userInfoWechat.nickName || ''
    wx.navigateTo({
      url: `/pages/my/profile/edit?name=${name}`
    })
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
        console.log(res.errMsg)
      }
    })

  },

  takePhoto() {
    const ctx = wx.createCameraContext()
    ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        this.setData({
          src: res.tempImagePath
        })
      }
    })
  },

  chooseImage() {
    let self = this
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFiles = res.tempFiles[0]
            wx.getImageInfo({
              src: res.tempFilePaths[0],
              success(res) {
                console.log(res, 'img info')
              }
            })
        let path = tempFiles.path
        let size = tempFiles.size
        if (size > 1024 * 1024 * 10) {
          wx.showModal({
            title: '提示',
            content: '图片太大了',
            showCancel: false,
            confirmText: '知道了',
            success(res) {
              if (res.confirm) {
                console.log('用户点击确定')
              }
            }
          })
        } else {
          // show loading
          wx.showLoading({
            title: '上传中',
            mask: true
          })
          self.uploadFile(path)
          // const imgData = wx.getFileSystemManager().readFileSync(path, "base64")
        }
      }
    })
  },
  uploadFile(path) {
    let self = this
    // console.log(path, 'path');
    
    let _token = wx.getStorageSync('token')
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
        const data = res.data
        wx.hideLoading()
        // console.log(res, 'load data');
        let detail = JSON.parse(data || '{}')
        if (detail.code === 'suc') {
          const { key, url } = detail.data
          self.setData({
            img: url,
            imgKey: key
          })
          self.saveProfile()
        } else {
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: '上传失败'
          })
        }
      },
      fail(e) {
        console.log('[exception]: upload fail', e);
        wx.hideLoading()
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '上传失败'
        })
      }
    })
  },
  updateCurrentInfo(obj) {
    if (obj.avatar) {
      obj.avatar = this.data.img
    }
    try {
      let token = wx.getStorageSync('token')
      let userInfo = token.user
      token.user = Object.assign(userInfo, obj)
      wx.setStorageSync('token', token)
    } catch (e) {
      console.log(e);
    }
  },


  goIndex () {
    wx.switchTab({
      url: '/pages/store/store'
    });
  },

  saveProfile() {
    let self = this
    let obj = {}
    let data = this.data
    if (data.name) {
      obj.userName = data.name
    }
    if (data.imgKey) {
      obj.avatar = data.imgKey
    }
    if (data.gender) {
      obj.sex = data.gender
    }
    obj.id = this.data.userInfo.id
    obj.work = this.data.work;
    if (this.data.birthday !== '完善生日信息, 年年有惊喜') {
      obj.birthday = this.data.birthday;
    }
    

    model('my/user/update-user', obj, 'POST').then(res => {
      wx.showToast({
        title: '修改成功',
        icon: 'success',
        duration: 1500,
        success() {
          // 更新global data里面的信息
          // 更新localstorage 信息
          self.updateCurrentInfo(obj)
          // setTimeout(() => {
          //   wx.navigateBack({
          //     delta: 1
          //   })
          // }, 1500)
        }
      })
    }).catch(e => {
      wx.showToast({
        title: '修改失败',
        icon: 'none',
        duration: 1500
      })
    })
  },

  logout () {
    wx.showModal({
      title: '提示',
      content: '确定退出吗？',
      showCancel: true,
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
    })
  }

})
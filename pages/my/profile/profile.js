const app = getApp()
import model, { BASE_URL } from '../../../utils/model'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    gender: '',
    img: '',
    userInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let info = wx.getStorageSync('token')
    let userInfo = info.user
    let userInfoWechat = app.globalData.userInfo
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
      name: userInfo.userName ? userInfo.userName : userInfoWechat.nickName,
      gender: userInfo.sex ? userInfo.sex : userInfoWechat.gender,
      img: userInfo.avatar ? userInfo.avatar : userInfoWechat.avatarUrl
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
  showGenderList() {
    let self = this
    wx.showActionSheet({
      itemList: ['男', '女'],
      success(res) {
        console.log(res.tapIndex)
        self.setData({
          gender: res.tapIndex === 0 ? 1 : 2
        })
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
  },
  goEdit() {
    let name = this.data.userInfo.userName
    wx.navigateTo({
      url: `/pages/my/profile/edit?name=${name}`
    })
  },
  chooseImage() {
    let self = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFiles = res.tempFiles[0]
        let path = tempFiles.path
        let size = tempFiles.size
        if (size > 1024 * 1024 * 8) {
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
          wx.uploadFile({
            url: `${BASE_URL}/my/user/fileUpload`,
            filePath: path,
            name: 'file',
            header: {
              'content-type': 'application/x-www-form-urlencoded',
              'Accept': 'application/json',
              'authorization': 'Bearer ' + wx.getStorageSync('token').token || ''
            },
            formData: {
              'user': 'avatar'
            },
            success(res) {
              const data = res.data
              wx.hideLoading()
              
              if (data) {
                let detail = JSON.parse(data || '{}')
                if (detail.data) {
                  self.setData({
                    img: detail.data
                  })
                }
              } else {
                wx.showModal({
                  title: '提示',
                  content: '上传失败'
                })
              }
            },
            fail() {
              wx.hideLoading()
              wx.showModal({
                title: '提示',
                content: '上传失败'
              })
            }
          })
          // const imgData = wx.getFileSystemManager().readFileSync(path, "base64")

        }
      }
    })
  },
  upLoadImg() {

  },
  updateCurrentInfo(obj) {
    try {
      let token = wx.getStorageSync('token')
      let userInfo = token.user
      token.user = Object.assign(userInfo, obj)
      wx.setStorageSync('token', token)
    } catch(e) {
      console.log(e);
      
    }

  },
  saveProfile() {
    let self = this
    let obj = {}
    let data = this.data
    if (data.name) {
      obj.userName = data.name
    }
    if (data.img) {
      obj.avatar = data.img
    }
    if (data.gender) {
      obj.sex = data.gender
    }
    obj.id = this.data.userInfo.id
    console.log(obj, 'objjjj');
    
    model('my/user/updateUser', obj, 'POST').then(res => {
      wx.showToast({
        title: '修改成功',
        icon: 'success',
        duration: 1500,
        success() {
          // 更新global data里面的信息
          // 更新localstorage 信息
          self.updateCurrentInfo(obj)
          setTimeout(()=>{
            wx.navigateBack({
              delta: 1
            })
          }, 1500)
        }
      })
    }).catch(e => {
      wx.showToast({
        title: '修改失败',
        icon: 'fail',
        duration: 1500
      })
    })
  }

})
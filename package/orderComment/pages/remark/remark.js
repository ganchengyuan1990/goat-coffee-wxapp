// var util = require('../../../utils/util.js');
// var api = require('../../../config/api.js');
// const pay = require('../../../services/pay.js');
import model, {
  BASE_URL
} from '../../utils/model';

var app = getApp();

Page({
  data: {
    content: '',
    type: '',
    orderId: '',
    img: [],
    imgKey: ''
  },
  onLoad: function (options) {
    // this.dealOptions(options);
    this.setData({
      type: options.type,
      orderId: options.orderId
    })
  },

  commitRemark() {
    let pages = getCurrentPages();
    let currPage = pages[pages.length - 1]; //当前页面
    let prevPage = pages[pages.length - 2]; //上一个页面
    prevPage.setData({
      goBackFromRemark: true,
      otherQues: this.data.content,
      pics: this.data.img.join(', ')
    });
    wx.navigateBack({
      delta: 1 //返回的页面数，如果 delta 大于现有页面数，则返回到首页,
    });
    // let tipsType = 0;
    // if (this.data.type === '产品口味') {
    //   tipsType = 3;
    // }
    // model('order/comment/create', {
    //   orderId: this.data.orderId,
    //   evaluate: this.data.satisfy ? 2 : 4,
    //   commentText: this.data.content,
    //   tipsType: tipsType
    // }, 'POST').then(res => {
    // }).catch(e => {
    //   wx.showToast({
    //     title: e, //提示的内容,
    //     icon: 'none', //图标,
    //     duration: 2000, //延迟时间,
    //     mask: true, //显示透明蒙层，防止触摸穿透,
    //     success: res => {}
    //   });
    // });
  },

  onReady: function () {
    // 页面渲染完成

  },
  onShow: function () {

  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  },

  dealContent(e) {
    this.setData({
      content: e.detail.value
    });
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
          self.uploadPic(path)
          // const imgData = wx.getFileSystemManager().readFileSync(path, "base64")
        }
      }
    })
  },

  uploadPic (path) {
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
          const {
            key,
            url
          } = detail.data
          let img = self.data.img;
          img.push(url);
          self.setData({
            img: img,
            imgKey: key
          })
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
  }
})
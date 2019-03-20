// var util = require('../../../utils/util.js');
// var api = require('../../../config/api.js');

import model from '../../utils/model';


var app = getApp();

Page({
    data: {
        tags: '',
        actImage: '',
        isActWrapShow: false,
        banner: 'http://img.goatup.net/img/banner/%E9%A6%96%E9%A1%B5banner.png'
    },
    onLoad: function (options) {
        let info = wx.getStorageSync('token') || {}
        let isNew = info.ifNew;
        let configPic = '';
        try {
            configPic = info.config.newUserPic
        } catch (e) {
            // console.log(e);
        }
        if (isNew && configPic) {
            this.setData({
                actImage: configPic,
                isActWrapShow: true
            });
            try {
                let token = wx.getStorageSync('token')
                token.ifNew = false
                wx.setStorageSync('token', token)
            } catch (e) {
                console.log(e);
            }
        }
        wx.showLoading({
          title: 'Loading...', //提示的内容,
          mask: true, //显示透明蒙层，防止触摸穿透,
          success: res => {}
        });

        model('base/site/config-list').then(res => {
            wx.setStorageSync('configData', res.data);
            this.setData({
                tags: res.data['voucher-text']
            })
            wx.hideLoading();
        }).catch(e => {
            wx.hideLoading();
        });
        if (wx.getStorageSync('token') && wx.getStorageSync('STORE_INFO')) {
            let STORE_INFO = JSON.parse(wx.getStorageSync('STORE_INFO'));
            model(`home/cart/list?storeId=${STORE_INFO.id}`).then(res => {
                let sum = 0;
                res.data.carts && res.data.carts.forEach(item => {
                    sum += item.num;
                })
                wx.setTabBarBadge({
                    index: 3,
                    text: sum.toString()
                });
            }).catch(e => {

            });
        }
    },
    onReady: function () {

    },
    onShow: function () {

    },
    onHide: function () {
        // 页面隐藏

    },
    onUnload: function () {
        // 页面关闭
    },

    goShareSuccess () {
        wx.navigateTo({
            url: '/pages/pay/share_success/share_success'
        });
    },

    goPin () {
        // wx.navigateTo({
        //     url: '/pages/pin/pin_list/pin_list'
        // });
        wx.navigateTo({
            url: '/package/invite/pages/inviteOthers/invite'
        });
    },

    goPocket() {
        wx.navigateTo({
            url: '/package/coffeePocket/pages/pocket/pocket'
        });
    },

    goStore () {
        wx.switchTab({
            url: '/pages/store/store'
        });
    },

    onShareAppMessage() {
        return {
            title: '加油咖啡',
            path: '/pages/index/index',
            success: function (res) {
                console.log('转发失败');
            },
            fail: function (res) {
                // 转发失败
            }
        }

    },

    hideActWrap  () {
        this.setData({
            isActWrapShow: false
        })
    },

    goPageCoupon() {
        this.setData({
            isActWrapShow: false
        })
        wx.navigateTo({
            url: `/pages/my/coupon/coupon?type=2`
        })
    },
})
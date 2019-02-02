"use strict";

import model from '../../../utils/model';


Page({
    data: {
        pinList: [],
        id: 0,
        errorToast: false,
        toastInfo: '',
    },

    goPinDetail (e) {
        // let token = wx.getStorageSync('token').token
        // if (!token) {
        //     wx.redirectTo({
        //         url: '/pages/login/login'
        //     })
        //     return
        // }
        wx.hideTabBar({
            animation: true,
            success() {
                
            },
            fail() {}
        })
        wx.navigateTo({
            url: `../pin_detail/pin_detail?id=${parseInt(e.currentTarget.dataset.id)}`
        });
    },

    onShow () {
        wx.showTabBar({
            animation: true
        })
    },

    onLoad: function (option) {

        model('group/action/list', {
            // openid: wx.getStorageSync('openid')
        }).then(data => {
            if (data.data) {
                let result = data.data;
                // result.forEach(item => {
                //     if (item.groupImg) {
                //         item.groupImg = item.groupImg.split(',')[0];
                //     }
                // });
                this.setData({
                    pinList: data.data
                });
                wx.hideLoading();
            }
        }).catch(e => {
            wx.hideLoading();
            this.setData({
                errorToast: true,
                toastInfo: e
            });
        });
        wx.showLoading({
          title: 'Loading...', //提示的内容,
          mask: true, //显示透明蒙层，防止触摸穿透,
          success: res => {}
        });
        // array.forEach(item => {
        //     item.discountMoney = Utils.setDataForm(parseFloat(item.discountMoney / 100), 1);
        //     if (item.checked === undefined) {
        //         item.checked = item.defaultCheck;
        //     }
        //     if (item.active) {
        //         activedItems.push(item);
        //     } else {
        //         unActivedItems.push(item);
        //     }
        // });
        // this.setData({
        //     array: array,
        //     chosenId: chosenId,
        //     activedItems: activedItems,
        //     unActivedItems: unActivedItems
        // });
    }
});
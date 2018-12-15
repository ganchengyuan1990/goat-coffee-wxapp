"use strict";

import model from '../../../utils/model';


Page({
    data: {
        pinList: [],
        id: 0
    },

    goPinDetail (e) {
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
                result.forEach(item => {
                    if (item.groupImg) {
                        item.groupImg = item.groupImg.split(',')[0];
                    }
                });
                this.setData({
                    pinList: data.data
                });
            }
        })
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
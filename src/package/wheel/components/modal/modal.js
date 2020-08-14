"use strict";

// const lx = require('../../utils/npm/lx-analytics')
// const lxBid = {
//     shopInfoMCBid: 'b_7pipq1og'
// }

Component({

    properties: {
        shown: {
            type: Boolean
        },
        // 是否展示大文字样式
        showSmall: {
            type: Boolean
        },
        title: {
            type: String
        },
        content: {
            type: String
        },
        contentArr: {
            type: Array
        },
        okText: {
            type: String
        },
        otherText: {
            type: String
        },
        otherFunctionType: {
            type: Number
        },
        type: {
            type: Number
        },
        leftButtonFunctionType: {
            type: Number
        },
        otherFunction: {
            type: Function
        },
        actImage: {
            type: String
        },
        failImage: {
            type: String
        },
        isCoffeeMaker: {
            type: Boolean
        }
    },

    data: {
       innerShown: true
    },

    methods: {
        close() {
            // if (this.properties.type == 7) {
            //     return ;
            // }
            this.setData({
                shown: false
            });
        },

        otherFunction() {
            this.close();
            this.triggerEvent('customevent', this.data.otherFunctionType);
            // if (this.data.otherFunctionType === -1) {
            //     this.fetchOrderInfo()
            // }
        },

        leftButtonFunction() {
            this.close();
            this.triggerEvent('customevent', this.data.leftButtonFunctionType);
        },

        goJinmai() {
            wx.navigateTo({
                url: '/package/inviteJinmai/pages/invite/invite'
            });
        },

        goTransport () {
            // let item = e.currentTarget.dataset.item;
            // console.log(item);
            wx.navigateTo({
                url: `/pages/transport/transport?from=store&tab=selfTaking`
            });
            this.setData({
                shown: false
            });
        },

        goTransportSecond() {
            wx.navigateTo({
                url: `/pages/transport/transport?from=store&tab=delivery`
            });
            this.setData({
                shown: false
            });
        },

        goStore(e) {
            let item = e.currentTarget.dataset.item;
            console.log(item);
            this.triggerEvent('customevent', item);
            this.setData({
                shown: false
            });
        },

        goBuy(e) {
            wx.switchTab({ url: '/pages/store/store' });
        },

        goRecharge () {
            if (this.data.okText === '立即使用') {
                wx.switchTab({ url: '/pages/store/store' });
            }
            
        }
    }

    // attached () {

    // }

});
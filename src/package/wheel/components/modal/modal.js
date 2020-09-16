"use strict";

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
        },
        getPrize: {
            type: Number
        },
        prizeType: {
            type: Number
        },
        realGift: {
            type: Number
        },
        noMoreChance: {
            type: Number
        },
        userPrizeRecordId: {
            type: Number,
            observer(newId) {
                this.setData({
                    userPrizeRecordId: newId,
                });
            },
        },
        prizeTitle: {
            type: String
        },
        meituanStoreId: {
            type: String
        }
    },

    data: {
       innerShown: true,
       userPrizeRecordId: 0,
    },


    methods: {

        goGetCoupon: function (e) {
            var current = e.target.dataset.src;
            // debugger
            // wx.previewImage({
            //     current: current,
            //     urls: [current]
            // })
            // wx.navigateToMiniProgram({
            //     appId: 'wx2c348cf579062e56',
            //     path: `/packages/restaurant_bak/restaurant/restaurant?poi_id=${this.properties.meituanStoreId}&aas=1003&cat_id=0`
            // })
        },

        goMyCoupon() {
            this.triggerEvent('gomycoupon');
        },

        close() {
            // if (this.properties.type == 7) {
            //     return ;
            // }
            this.setData({
                shown: false
            });
        },

        goAddress() {
            this.close();
            getApp().globalData.lastUserPrizeRecordId = this.data.userPrizeRecordId;
            debugger
            wx.navigateTo({
                url: `/pages/my/address/index?id=${this.data.userPrizeRecordId}`
            });
        },

        prizeAgain() {
            this.close();
            this.triggerEvent('customevent');
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
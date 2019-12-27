"use strict";

// const lx = require('../../utils/npm/lx-analytics')
// const lxBid = {
//     shopInfoMCBid: 'b_7pipq1og'
// }

Component({

    properties: {
        cartGoods: {
            type: Array
        },
        title: {
            type: String
        }
    },

    data: {
        isCatePanelShow: false
    },

    methods: {
        close() {
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

        addCart(e) {
            let index = parseInt(e.currentTarget.dataset.index)
            this.triggerEvent('togglemenu', this.data.cartGoods[index]);
        }
    }

    // attached () {

    // }

});
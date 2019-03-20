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
        title: {
            type: String
        },
        content: {
            type: String
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
        leftButtonFunctionType: {
            type: Number
        },
        otherFunction: {
            type: Function
        }
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

        leftButtonFunction() {
            this.close();
            this.triggerEvent('customevent', this.data.leftButtonFunctionType);
        }
    }

    // attached () {

    // }

});
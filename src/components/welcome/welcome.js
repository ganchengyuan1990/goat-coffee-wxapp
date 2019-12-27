"use strict";

// const lx = require('../../utils/npm/lx-analytics')
// const lxBid = {
//     shopInfoMCBid: 'b_7pipq1og'
// }

Component({

  behaviors: [],

  properties: {
    title: {
      type: String
    },
    disappearSec: {
      type: Number
    },
    from: {
      type: Number
    },
    to: {
      type: Number
    }
  },

  data: {
    toastTimer: null,
    heightNum: 0,
    isShow: true,
    showWord: false
    // showModule: false
  }, // 私有数据，可用于模版渲染

  // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  // ready: function () {
  // },
  moved: function () {},
  ready: function () {
    // this.setData({
    //   heightNum: this.properties.from
    // });
   this.setData({
     heightNum: this.properties.to,
     showWord: true
   });
    
  },

  methods: {
    close() {
      this.setData({
        isShow: false
      });

      // this.$emit('dialog-toast-close')
    },
    showToast(val, delay) {
      this.isShow = true;
      if (this.toastTimer) {
        clearTimeout(this.toastTimer);
      }

      if (val) {
        this.toastTimer = setTimeout(() => {
          this.$bus.$emit('hide-toast');
        }, delay * 1000);
      }
    },
    hideToast() {
      this.isShow = false;
    }
  }

});
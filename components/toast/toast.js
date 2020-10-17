'use strict';

// const lx = require('../../utils/npm/lx-analytics')
// const lxBid = {
//     shopInfoMCBid: 'b_7pipq1og'
// }

Component({

  behaviors: [],

  properties: {
    isShow: {
      type: Boolean
    },
    title: {
      type: String
    },
    disappearSec: {
      type: Number
    }
  },

  data: {
    toastTimer: null
    // showModule: false
  }, // 私有数据，可用于模版渲染

  // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  ready: function () {
    console.log('【popup ready】');
    let delay = this.data.disappearSec || 3;
    setTimeout(() => {
      this.closeToast();
    }, delay * 1000);
  },
  moved: function () {},
  detached: function () {},

  methods: {
    closeToast() {
      if (this.data.toastTimer) {
        clearTimeout(this.data.toastTimer);
      }
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
Component({

  behaviors: [],

  properties: {
    promotions: {
      type: Array
    },
    category: {
      type: String
    }
  },

  data: {},

  methods: {
    // 方法
    radioChange: function (e) {
      var myEventDetail = {
        value: e.detail.value
      };
      this.triggerEvent('myevent', myEventDetail);
    }
  }
});
Component({
  externalClasses: ['view-class', 'navigator-class'],
  properties: {
    redirect_url: {
      type: String,
      value: ''
    },
    redirect_route: {
      type: String,
      value: ''
    }
  },
  methods: {
    // 触发外层事件
    onTab: function () {
      this.triggerEvent('navtap');
    },
    onClick: function () {
      const {
        properties: {
          redirect_url,
          redirect_route
        }
      } = this;
      setTimeout(() => {
        this.triggerEvent('customevent', true);
      }, 500);
            
      if (redirect_route) {
        const _backup = [
          '/pages/store/store',
          '/pages/member/index/index',
          '/pages/newCart/cart'
        ];
        if (_backup.indexOf(redirect_route) >= 0) {
          wx.switchTab({
            url: redirect_route,
          });
        } else {
          wx.navigateTo({
            url: redirect_route,
          });
        }
                
      }
      if (redirect_url) {
        wx.navigateTo({
          url: `/pages/webview/webview?url=${encodeURIComponent(redirect_url)}`
        });
      }
            
    }
  }
});
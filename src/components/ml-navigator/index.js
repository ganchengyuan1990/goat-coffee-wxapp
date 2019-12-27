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
            if (redirect_route) {
                wx.navigateTo({
                    url: redirect_route,
                });
            }
            if (redirect_url) {
                wx.navigateTo({
                    url: `/pages/webview/webview?url=${encodeURIComponent(redirect_url)}`
                });
            }
            
        }
    }
});
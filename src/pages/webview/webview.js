
Page({
    data: {
        src: ''
    },
   
    onLoad: function (option) {
        this.setData({
            src: decodeURIComponent(option.url)
        })
    },

    onShareAppMessage: function (res) {
        if (res.from === 'button') {
            // 来自页面内转发按钮
            console.log(res.target)
        }
        return {
            title: '堤旁树简介',
            path: `pages/webview/webview?url=${encodeURIComponent(this.data.src)}`,
            success: function (res) {
                // 转发成功
            },
            fail: function (res) {
                // 转发失败
            }
        }
    }

})
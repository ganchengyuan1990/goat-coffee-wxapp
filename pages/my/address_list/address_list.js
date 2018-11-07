Page({
    data: {
        lesson: '',
        indicatorDots: false,
        autoplay: true,
        interval: 5000,
        duration: 1000,
        addressList: [],
        noPayIndex: -1,
        loading: true
    },
    onLoad(option) {
        wx.showLoading({
          title: 'Loading...', //提示的内容,
          mask: true, //显示透明蒙层，防止触摸穿透,
          success: res => {}
        });
        let self = this;
        wx.request({
            url: 'http://47.100.233.24:6688/api/v1/server/my/address/list?userId=1',
            method: 'GET',
            data: {
                openid: wx.getStorageSync('openid')
            },
            header: {
                //设置参数内容类型为x-www-form-urlencoded
                'content-type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            },
            success: function (res) {
                if (res.data.data) {
                    let list = res.data.data;
                    self.setData({
                        addressList: list,
                        loading: false
                    });
                    wx.hideLoading();
                }
            }
        });
    },

    changeAddress () {
        wx.navigateTo({
            url: `/pages/address/address`
        })
    }
});
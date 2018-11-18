import model from '../../../utils/model';


Page({
    data: {
        lesson: '',
        indicatorDots: false,
        autoplay: true,
        interval: 5000,
        duration: 1000,
        addressList: [],
        noPayIndex: -1,
        loading: true,
        fromAddress: false,
        goBack: ''
    },
    onLoad(option) {
        if (option.from === 'store') {
            this.setData({
                goBack: '/pages/store/store'
            })
        }
        wx.showLoading({
          title: 'Loading...', //提示的内容,
          mask: true, //显示透明蒙层，防止触摸穿透,
          success: res => {}
        });
        let self = this;
        this.getAddressList();
    },

    onShow () {
        if (this.data.fromAddress) {
            this.getAddressList()
        }
    },

    getAddressList () {
        model('my/address/list', {
            userId: wx.getStorageSync('token').user.id,
            // openid: wx.getStorageSync('token').user.id
        }).then(data => {
            if (data.data) {
                let list = data.data;
                this.setData({
                    addressList: list,
                    loading: false
                });
                wx.hideLoading();
            }
        })
    }
});
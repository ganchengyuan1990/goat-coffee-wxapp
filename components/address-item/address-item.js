Component({

    behaviors: [],

    properties: {
        item: {
            type: Object
        }
    },

    data: {
        // showModule: false
    }, // 私有数据，可用于模版渲染

    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    ready: function () {
    },
    moved: function () {},
    detached: function () {},

    methods: {
        goAddress (e) {
            let id = e.currentTarget.dataset.id;
            wx.setStorageSync('chosenAddress', e.currentTarget.dataset.info)
            wx.navigateTo({
                url: `/pages/my/address/address?id=${id}`
            });
        }
    }

});
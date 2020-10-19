Page({
  data: {
    banner: 'http://img.goatup.net/img/banner/0322-xianging-yaoqingdebei.jpg',
    errorToastShown: false,
    phoneNum: '',
    phoneCode: '',
    actived: false,
    canGetVerify: false,
    extended: false,
    showSeconds: false,
    leftSeconds: 60,
    userId: 0,
    isEdit: true,
    martsList: [{
      'id': 85,
      'name': 'Happy Friend',
      'price': 579,
      'amount': 10,
    }, {
      'id': 85,
      'name': 'Happy Friend',
      'price': 579,
      'amount': 10,
    }, {
      'id': 85,
      'name': 'Happy Friend',
      'price': 579,
      'amount': 10,
    }, {
      'id': 85,
      'name': 'Happy Friend',
      'price': 579,
      'amount': 10,
    }, {
      'id': 85,
      'name': 'Happy Friend',
      'price': 579,
      'amount': 10,
    }, {
      'id': 85,
      'name': 'Happy Friend',
      'price': 579,
      'amount': 10,
    }],
    contents: '<p>1. 被推荐的新用户输入手机号，即可获赠一张新人指定饮品首杯1.8折券+ 3张全场饮品五折券，可用于消费饮品系列（仅限一件商品，不含配送费），新人指定饮品首杯1.8折券有效期1年。（同一手机号，同一手机仅可领取一次）</p><p>2. 您推荐新用户只要产生消费，您即获得一杯25元体验券，可用于购买经典意式咖啡、营养代餐系列饮品，体验券有效期1年</p><p>3. 您推荐的新用户同一手机设备，同一手机号码仅可领取一次。</p><p>4. 您邀请好友所赠的体验券仅限本人使用，用于商业牟利将有封号风险。</p> '
  },
  onLoad: function (options) {
    this.setData({
      userId: parseInt(options.userid)
    });
  },
  onReady: function () {

  },
  onShow: function () {

  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭
  },

  dealVerify(e) {
    this.setData({
      phoneCode: e.detail.value,
      actived: this.data.phoneNum.length > 0 && e.detail.value.length > 0
    });
  },


  goRecords() {
    wx.navigateTo({
      url: '/package/sendOthers/pages/records/records'
    });
  },

  dealTapPhone() {
    this.setData({
      showButtonLineName: true,
      showButtonLinePhone: false
    });
  },

  dealTapVerify() {
    this.setData({
      showButtonLineName: false,
      showButtonLinePhone: true
    });
  },


  goShareSuccess() {
    wx.navigateTo({
      url: '/pages/pay/share_success/share_success'
    });
  },

  goApp() {
    wx.switchTab({
      url: '/pages/store/store'
    });
  },

  bindExtend: function (event) {
    this.setData({
      extended: !this.data.extended
    });
  },

  goMartsDetail({
    currentTarget: {
      dataset: {
        index
      }
    }
  }) {
    wx.navigateTo({
      url: `/package/sendOthers/pages/chooseWords/chooseWords?index=${index}`
    });
  }
});
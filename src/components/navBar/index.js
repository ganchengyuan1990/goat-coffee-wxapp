const app = getApp();

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    styleType: {
      type: String,
      value: 'black',
    },
    title: {
      type: String,
      value: '',
    },
    background: {
      type: String,
      value: '#fff',
    },
    mainfieldNav: {
      type: Boolean,
      value: false,
    },
    isShowNavBubble: {
      type: Boolean,
    },
    isShowNavAppBubble: {
      type: Boolean,
    },
    showTitle: {
      type: Boolean,
      value: true,
    },
  },
  attached() {
    this.setNavSize();
    this.setNavShow();
    // 绑定展示气泡事件
    this.bindShowBubbleEvent();
  },
  data: {
    onlyHome: false,
    onlyBack: false,
    isShow: true,
    bubbleText: '',
    isBubbleShown: false,
  },
  methods: {
    // 通过获取系统信息计算导航栏高度
    setNavSize() {
      // const {
      //   statusBarHeight,
      //   version,
      //   system,
      //   SDKVersion,
      //   windowHeight,
      //   screenHeight,
      // } = wx.getSystemInfoSync();
      // const isiOS = system.indexOf('iOS') > -1;
      // let navHeight;
      // if (!isiOS) {
      //   navHeight = 48;
      // } else {
      //   navHeight = 44;
      // }
      const {
        statusBarHeight,
        version,
        system,
        SDKVersion,
        windowHeight,
        screenHeight,
        screenWidth,
      } = wx.getSystemInfoSync();
      const isiOS = system.indexOf('iOS') > -1;
      const navHeight = !isiOS ? 48 : 44;
      getApp().globalData.system = {
        version,
        SDKVersion,
        statusBarHeight,
        navHeight,
        windowHeight,
        screenHeight,
        screenWidth,
        isShowNavBar: true // 微信版本7.0.0页面配置custom不生效，对应基础版本为2.5.2，兼容开发者工具
      };
      this.setData({
        status: statusBarHeight || 20,
        navHeight: navHeight || 44,
        isShow: getApp().globalData.isShowNavBar === undefined ? true : getApp().globalData.isShowNavBar,
        titleWidth: screenWidth - (100 * 2),
      });
    },
    // 控制导航栏是否显示
    setNavShow() {
      const routes = getCurrentPages();
      // 当页面栈只有一个，且不是首页，不区分分享或消息模板场景
      if (routes.length === 1 && routes[0].route !== 'pages/index/index') {
        this.setData({
          onlyHome: true,
        });
      } else if (!app.globalData.isHeaderShare && routes.length > 1) {
        // 只要不是分享或消息模板场景就显示返回按钮
        this.setData({
          onlyBack: true,
        });
      }
    },
    // 返回事件
    back() {
      wx.navigateBack({
        delta: 1,
      });
      this.triggerEvent('back', { back: 1 });
    },
    home() {
      wx.switchTab({ url: '/pages/store/store' });
      // wx.reLaunch({ url: '/pages/index/index' });
      this.triggerEvent('home', {});
    },
    mainfieldNavExpand() {
      // 气泡展示时
      if (this.data.isBubbleShown) {
        this.setData({
          isBubbleShown: false,
        });
        // 发送气泡被点击事件
        getApp().eventBus.fire('click_nav_bubble');
      }
      this.triggerEvent('mainfieldNavExpand');
    },
    bindShowBubbleEvent() {
      // getApp().eventBus.on('show_nav_bubble', (bubbleText) => {
      //   this.setData({
      //     isBubbleShown: true,
      //     bubbleText,
      //   });
      // });
    },
  },
});

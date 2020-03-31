const DefaultButtonList = [{
  templateName: 'index_item',
  buttonNo: 1,
  buttonPic: '/img/mainfieldNav/home.png',
  buttonText: '返回首页',
  channelSource: false,
  redirectUrl: '',
  isShown: false,
  isRedPointShown: false,
  showSwitch: false,
}, {
  templateName: 'pindan_item',
  buttonNo: 3,
  buttonPic: '/pages/store/img/mainfieldNav/pindan.png',
  buttonText: '我要拼单',
  channelSource: false,
  redirectUrl: '',
  isShown: false,
  isRedPointShown: false,
  showSwitch: true,
  alreadyShared: false,
  hasPopUpImg: false,
  isUserAuthorized: false,
  showLoginLayer: false,
}, {
  templateName: 'invite_item',
  buttonNo: 4,
  buttonPic: '/pages/store/img/mainfieldNav/invite.png',
  buttonText: '我要请客',
  channelSource: false,
  redirectUrl: '',
  isShown: false,
  isRedPointShown: false,
  showSwitch: true,
}, {
  templateName: 'goapp_item',
  buttonNo: 2,
  buttonPic: 'https://p0.meituan.net/travelcube/cf36de1b3acea37e6732e810e5cabc731443.png',
  buttonText: '去App',
  channelSource: false,
  redirectUrl: '',
  isShown: false,
  isRedPointShown: false,
  showSwitch: true,
  // 打开app的app-parameter
  appUrl: '',
}, {
  templateName: 'share_item',
  buttonNo: 5,
  buttonPic: '/pages/store/img/mainfieldNav/share.png',
  buttonText: '分享商家1',
  channelSource: false,
  redirectUrl: '',
  isShown: false,
  isRedPointShown: false,
  showSwitch: false,
}];
Component({
  properties: {
    isShow: {
      type: Boolean,
      value: false,
      observer: 'lxView',
    },
    // 是否在拼单状态中
    isInSharing: {
      type: Boolean,
      value: false,
      // 去app 使用到是否在拼单状态的逻辑
      observer: 'checkAppShown',
    },
    params: {
      type: Object,
      value: {},

      // 检查是否展示 "回首页"
      observer(nv) {
        // this.checkIndexShown(nv);
        // this.checkAppShown(nv);
      },

    },
    // 拼单数据
    shareParams: {
      type: Object,
      value: {},
      // 检查是否展示 "拼单"
      observer: 'checkPindanShown',
    },
    alreadyShared: {
      type: Boolean,

      observer(nv) {
        this.setData({
          'buttonListOptions.pindan_item.alreadyShared': nv,
        });
        this.watchButtonListOptions();
      },

    },
    hasPopUpImg: {
      type: Boolean,

      observer(nv) {
        this.setData({
          'buttonListOptions.pindan_item.hasPopUpImg': nv,
        });
        this.watchButtonListOptions();
      },

    },
    hasShareBtn: {
      type: Boolean,
      value: false,
      observer: 'checkShareShown',
    },
    // 是否在请客状态中
    isInMyTreat: {
      type: Boolean,

      observer() {
        this.checkInviteShown();
        this.checkPindanShown();
        this.checkAppShown();
      },

    },
  },
  data: {
    buttonList: [],
    buttonListOptions: {
      index_item: {
        templateName: 'index_item',
        buttonNo: 1,
        buttonPic: '/pages/store/img/mainfieldNav/home.png',
        buttonText: '返回首页',
        channelSource: false,
        redirectUrl: '',
        isShown: false,
        isRedPointShown: false,
        showSwitch: false,
      },
      pindan_item: {
        templateName: 'pindan_item',
        buttonNo: 3,
        buttonPic: '/pages/store/img/mainfieldNav/pindan.png',
        buttonText: '我要拼单',
        channelSource: false,
        redirectUrl: '',
        isShown: true,
        isRedPointShown: false,
        showSwitch: true,
        alreadyShared: false,
        hasPopUpImg: false,
        isUserAuthorized: false,
        showLoginLayer: false,
      }
    },
    navHeight: 44,
    status: 20,
  },

  created() {
    // 同步数据提前获取，异步数据需要在使用的地方同一个作用域，且在之前
    // this.uuid = getApp().store.getState().dev.uuid;
    // const {
    //   scene,
    // } = getApp().globalData.appShowOption || {};
    // this.scene = scene; // buttonList 配置 Array 转换成 Object

    // // eslint-disable-next-line max-len
    // this.templateNameMap = Object.entries(this.data.buttonListOptions).reduce((pre, entry) => ({ ...pre,
    //   [entry[1].buttonNo]: entry[0],
    // }), {}); // 监听 navBar 点击事件

    // getApp().eventBus.on('click_nav_bubble', this.clickNavBubble.bind(this));
  },

  attached() {
    // this.setNavHeight();

    // try {
    //   const {
    //     buttonInfoList = DefaultButtonList,
    //     bubbleExistTime = 60,
    //     // 气泡展示间隔时间，以分钟为单位
    //     reminderExistTime = 60, // 提示框展示时间，以分钟为单位

    //   } = (await quickNavBtn()) || {}; // 后端接口挂掉时兜底

    //   this.setup(buttonInfoList, bubbleExistTime, reminderExistTime);
    // } catch (e) {
    //   // 后端接口挂掉时兜底
    //   this.setup(DefaultButtonList);
    // }
  },

  // observers: {
  //   'buttonListOptions.**': function () {
  //     // TODO debounce setData
  //     this.watchButtonListOptions();
  //   },
  // },
  methods: {
    setup(buttonInfoList = DefaultButtonList, bubbleExistTime = 60, reminderExistTime = 60) {
      this.reminderExistTime = reminderExistTime;
      wx.setStorageSync('restaurant_nav_goapp_reminderExistTime', reminderExistTime);
      this.formatButtonListOptions(buttonInfoList);
      this.setupShowConfig(bubbleExistTime); // 检查是否展示 "请客"

      this.checkInviteShown(); // 检查是否展示 "去App"

      this.checkAppShown();
      this.checkPindanShown();
    },

    lxView(newVal, oldVal) {
      if (newVal && !oldVal) {
        const bid = {
          share_item: 'b_iITgs',
          pindan_item: 'b_5k9oS',
          goapp_item: 'b_2dst4rvz',
          index_item: 'b_jhb1g7we',
        };
        // Object.entries(bid).forEach((item) => {
        //   if (this.data.buttonListOptions[item[0]].isShown) {
        //     event({
        //       event_type: 'view',
        //       val_bid: item[1],
        //     });
        //   }
        // });
      }
    },

    // 通过获取系统信息计算导航栏高度
    setNavHeight() {
      const {
        statusBarHeight,
        navHeight,
      } = getApp().globalData.system;
      this.setData({
        status: statusBarHeight || 20,
        navHeight: navHeight || 44,
      });
    },

    watchButtonListOptions(nv = this.data.buttonListOptions) {
      // buttonList 配置 Object 转换成 Array
      // eslint-disable-next-line max-len
      const buttonList = Object.keys(nv).map(key => nv[key]).filter(item => item.isShown).sort((a, b) => a.priority - b.priority);
      this.setData({
        buttonList,
      });
    },

    formatButtonListOptions(buttonInfoList) {
      buttonInfoList.forEach((item) => {
        const templateName = this.templateNameMap[item.buttonNo];
        const {
          buttonNo,
          buttonText,
          bubbleName,
          showSwitch,
          priority,
        } = item;
        Object.assign(this.data.buttonListOptions[templateName], {
          buttonNo,
          buttonText,
          bubbleName,
          showSwitch,
          priority,
        });
      });
    },

    setupShowConfig(bubbleExistTime) {
      // 获取展示配置
      this.showConfig = wx.getStorageSync('restaurant_nav_show_config')[this.uuid];
      const preButtonList = wx.getStorageSync('restaurant_nav_config') || [];
      // eslint-disable-next-line max-len
      this.hasBubbleList = Object.keys(this.data.buttonListOptions).map(key => this.data.buttonListOptions[key]).filter(item => item.showSwitch).sort((a, b) => a.priority - b.priority); // 判断是否改变了导航栏排序
      // eslint-disable-next-line max-len
      const isChanged = preButtonList.length !== this.hasBubbleList.length || preButtonList.some((item, index) => item.buttonNo !== this.hasBubbleList[index].buttonNo); // 如果排序改变了，或 this.showConfig 为空，则重置气泡展示顺序

      if (isChanged || !this.showConfig) {
        const item = this.hasBubbleList[0]; // hasBubbleList 为空，则不用展示气泡&红点

        const templateName = item ? item.templateName : '';
        this.showConfig = {
          clickTime: '',
          bubbleItem: templateName,
          redPointItem: {
            [templateName]: true,
          },
        };
        wx.setStorageSync('restaurant_nav_config', this.hasBubbleList);
        wx.setStorageSync('restaurant_nav_show_config', {
          [this.uuid]: this.showConfig,
        });
      }

      // eslint-disable-next-line
      const time = new Date(this.showConfig.clickTime).getTime() + bubbleExistTime * 60 * 1000; // 如果点击气泡时间为空（即初始化时），或点击时间加上 bubbleExistTime 晚于现在，则展示气泡时间到了

      this.isBubbleShowTimeArrived = !this.showConfig.clickTime || new Date().getTime() > time;
    },

    checkIndexShown() {
      // 来自除拼单外的分享场景或满足 quicknav-scene 的场景
      const hasIndex = !!this.data.params.show;
      this.setData({
        'buttonListOptions.index_item.isShown': hasIndex,
      });
      this.watchButtonListOptions();
    },

    checkPindanShown() {
      const {
        shareParams,
      } = this.data;
      const hasPindan = shareParams && shareParams.show && !this.data.isInMyTreat;
      this.showNavBubble(true, 'pindan_item');
      // this.setData({
      //   'buttonListOptions.pindan_item.isShown': hasPindan,
      //   'buttonListOptions.pindan_item.isUserAuthorized': !!shareParams.isUserAuthorized,
      //   'buttonListOptions.pindan_item.showLoginLayer': !!shareParams.showLoginLayer,
      // });
      // this.watchButtonListOptions();
    },

    checkInviteShown() {
      // const hasInvite = isShowInvite() && !this.data.isInMyTreat;
      // this.showNavBubble(hasInvite, 'invite_item');
      // this.setData({
      //   'buttonListOptions.invite_item.isShown': hasInvite,
      // });
      // this.watchButtonListOptions();
    },

    checkAppShown() {
      // 来自 app 分享卡片，且不是拼单和请客
      // TODO 请客状态下不展示
      const isFromAppShare = this.scene === 1036;
      const {
        show,
        ctype,
      } = this.data.params;
      // eslint-disable-next-line max-len
      const hasApp = isFromAppShare && !this.data.isInSharing && show && ctype && !this.data.isInMyTreat;

      this.showNavBubble(hasApp, 'goapp_item');
      const appUrl = this.getAppUrl();
      this.setData({
        'buttonListOptions.goapp_item.appUrl': appUrl,
        'buttonListOptions.goapp_item.isShown': hasApp,
      });
      this.watchButtonListOptions();
    },

    checkShareShown() {
      const hasShare = !!this.data.hasShareBtn;
      this.setData({
        'buttonListOptions.share_item.isShown': hasShare,
      });
      this.watchButtonListOptions();
    },

    showNavBubble(has, templateName) {
      if (!this.showConfig) {
        return;
      }

      // hide：不展示气泡+红点
      // extra：不展示气泡+红点
      // 该导航栏展示，且展示时间已到，则展示气泡

      const bubbleName = this.data.buttonListOptions[templateName].bubbleName; // 通知 navBar 展示气泡

      // getApp().eventBus.fire('show_nav_bubble', bubbleName);


      // eslint-disable-next-line
      const isRedPointShown = bubbleAbTest === 'show' && has && (this.showConfig.bubbleItem !== templateName && this.showConfig.redPointItem[templateName] || this.showConfig.bubbleItem === templateName && this.isBubbleShowTimeArrived);
      this.setData({
        [`buttonListOptions.${templateName}.isRedPointShown`]: isRedPointShown,
      });
      this.watchButtonListOptions();
    },

    clickNavBubble() {
      // 气泡被点击
      // eslint-disable-next-line max-len
      const bubbleItemIndex = this.hasBubbleList.findIndex(item => item.templateName === this.showConfig.bubbleItem); // 查找下一个要展示的气泡文案

      const nextBubbleItem = this.hasBubbleList[bubbleItemIndex + 1] || {};
      this.showConfig.clickTime = new Date();
      this.showConfig.bubbleItem = nextBubbleItem.templateName;
      this.showConfig.redPointItem[nextBubbleItem.templateName] = true;
      wx.setStorageSync('restaurant_nav_show_config', {
        [this.uuid]: this.showConfig,
      });
    },

    onItemTap(e) {
      const {
        name,
      } = e.currentTarget.dataset;
      const {
        isRedPointShown,
      } = this.data.buttonListOptions[name];

      if (isRedPointShown) {
        // 红点消失
        this.showConfig.redPointItem[name] = false;
        wx.setStorageSync('restaurant_nav_show_config', {
          [this.uuid]: this.showConfig,
        });
        this.setData({
          [`buttonListOptions.${name}.isRedPointShown`]: false,
        });
        this.watchButtonListOptions();
      } // 关闭全局导航


      this.onClickNotShow();
    },

    getAppUrl() {
      const {
        sharePoiId,
        ctype,
      } = this.data.params;
      const schema = {
        iphone: `meituanwaimai://waimai.meituan.com/menu?restaurant_id=${sharePoiId}&from_mini_app=mini_program_stores`,
        android: `meituanwaimai://waimai.meituan.com/menu?restaurant_id=${sharePoiId}&from_mini_app=mini_program_stores`,
        mtiphone: `imeituan://www.meituan.com/takeout/foods?poi_id=${sharePoiId}&from_mini_app=mini_program_stores`,
        mtandroid: `imeituan://www.meituan.com/takeout/foods?poi_id=${sharePoiId}&from_mini_app=mini_program_stores`,
      };
      return schema[ctype] || this.data.buttonListOptions.goapp_item.appUrl;
    },

    launchAppError() {
      wx.showToast({
        title: '你还没有下载美团外卖app，请前往应用商店下载吧~',
        icon: 'none',
        duration: 3000,
      });
    },

    launchAppTap() {
      this.triggerEvent('app');
    },

    onClickHomePageNav() {
      this.triggerEvent('home');
      wx.reLaunch({
        url: '/pages/index/index',
      });
    },

    // 取消展示
    onClickNotShow() {
      this.triggerEvent('cancelMainfieldNav');
    },

    // 分享
    onClickShareNav() {
      this.triggerEvent('cancelMainfieldNav');
    },

    // 拼单事件
    onClickBuyTogetherShare() {
      this.triggerEvent('cancelMainfieldNav');
      this.triggerEvent('onClickBuyTogetherShare');
    },

    onClickGetShareWindow() {
      this.triggerEvent('cancelMainfieldNav');
      this.triggerEvent('onClickGetShareWindow');
    },

    toLogin() {
      this.triggerEvent('cancelMainfieldNav');
      this.triggerEvent('toLogin');
    },

    onClickToAuthroize(e) {
      this.triggerEvent('cancelMainfieldNav');
      this.triggerEvent('onClickToAuthroize', e.detail);
    },

    touchmoveHandler() {
      this.onClickNotShow();
    },

  },
});

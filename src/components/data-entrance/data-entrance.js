const DEFAULT_INTERVAL = 3500; // 轮播文案在当前页面停留的时间
const DEFAULT_DURATION = 800; // 轮播文案切换动画执行的时间

Component({
  properties: {
    styles: {
      type: Object,
      value: {
        slide_time: DEFAULT_INTERVAL,
        duration: DEFAULT_DURATION,
      },
    },
    module_list: {
      type: Array,
      value: [],
      observer(newList) {
        this.current = 0;
        this.setData({
          swiperCurrentIndex: newList.length - 1,
        });
      },
    },

    // 调用组件的页面，如果是首页的话，样式需要定制（主要是左右边距）
    page: {
      type: String,
      value: '',
    },
  },
  data: {
    swiperCurrentIndex: 0,
    vertical: true,
    autoplay: true,
    circular: true,
    animationData: {},
  },
  methods: {
    onClickDataEntrance() {
      console.log('click entrance', this.current, this.data.module_list);
      const json_data = this.data.module_list[this.current].json_data;
      const click_url = (json_data || {}).click_url;
      this.triggerEvent('clickDataEntrance', { entry_index: this.current, click_url });
    },
    onViewDataEntrance() {
      this.triggerEvent('viewDataEntrance');
    },
    onCurrentChange({ detail: { current } }) {
      this.current = current;
      this.setData({
        swiperCurrentIndex: current,
      });
    },
    // 避免捕获延续到下面的swiper引发item滑动
    catchTouchStart({ changedTouches }) {
      const { clientX, clientY } = changedTouches[0];
      this.startX = clientX;
      this.startY = clientY;
    },
    catchTouchEnd({ changedTouches }) {
      const { clientX, clientY } = changedTouches[0];
      if (Math.abs(clientX - this.startX) <= 5 || Math.abs(clientY - this.startY) <= 5) {
        this.onClickDataEntrance();
      }
    },
  },
});

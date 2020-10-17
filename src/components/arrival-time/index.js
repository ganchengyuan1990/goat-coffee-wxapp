// import { commonBehavior } from '../../behaviors/index';

Component({
  // behaviors: [commonBehavior],
  properties: {
    arrivalTime: {
      type: Object,
      observer(data) {
        // TDOD... 有优化空间
        if (!data || !data.days) {
          return;
        }

        console.log(JSON.stringify(data), 'arrivalTime');
        this.setData({ data: data });
      },
    },
  },
  data: {
    show: false,
    scrollTop: 0,
    info: null,
    selectedDayIndex: 0,
    unixtime: 0,
    days: [],
    arrivalTimelist: [],
    expected_arrival_timelist: [],
  },
  methods: {
    hideArrivalTime() {
      this.setData({ show: false });
    },
    onClickArrivalTimeDay({ currentTarget: { dataset } }) {
      const { index } = dataset;
      const {
        expected_arrival_timelist: { [index]: arrival_timelist },
      } = this.data;

      const data = {
        dayIndex: index,
        scrollTop: 0,
      };

      if (typeof arrival_timelist === 'string') {
        data.arrival_timelist = null;
        data.info = arrival_timelist;
      } else {
        data.arrival_timelist = arrival_timelist;
        data.info = null;
      }

      this.setData(data);
    },
    onClickArrivalTimeItem({ currentTarget: { dataset } }) {
      const { unixtime } = dataset;
      this.setData({ show: false });
      console.log('========', unixtime);
      this.revoke('refresh', { expected_arrival_time: unixtime, formValidState: '' });
    },
  },
});

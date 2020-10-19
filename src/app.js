//app.js
const ald = require('./utils/sdk/ald-stat.js');

const Bobolink = require('./utils/bobolink/index');
// const assert = require('./utils/assert/build/assert.js');

// create a new queue instance to enable the frequency scheduling mode
const queue = new Bobolink({
  // constants are directly mounted under Bobolink
  scheduleMode: Bobolink.SCHEDULE_MODE_FREQUENCY,
  // set two tasks per second, bobolink calculates a task every 500ms
  countPerSecond: 2
});

// calculate the number of task schedules by this variable
let scheduleCount = 0;

// one task is scheduled every 500ms, and only two tasks should be scheduled after 1200ms.
let t1 = new Promise(resolve => {
  setTimeout(() => {
    // assert.equal(scheduleCount, 2);
    console.log(scheduleCount, 'bobolink');
    resolve();
  }, 1200);
});

// generate task function
function task() {
  return () => {
    return new Promise(resolve => {
      setTimeout(() => {
        scheduleCount++;
        resolve();
      }, 5);
    });
  };
}

// put three tasks into the queue
queue.push([task(), task(), task(), task()]).then((ts) => {
  console.log('The total time spent on this group of tasks:' + ts.runTime);
  // the return value of this group of tasks, res is an array, each element contains the execution status of the corresponding task
  // assert.equal(ts.res.length, 3);
  console.log(ts.res.length, 'bobolink');
  // the first two tasks are executed normally, but the third task is cancelled because the queue is destroyed.
  // assert.equal(ts.res[2].err, Bobolink.DISCARD);
  console.log(ts.res[2].err, Bobolink.DISCARD, 'bobolink');
});

t1.then(() => {
  // after the execution is completed, the resources occupied by the queue can be destroyed if necessary.
  queue.destory();
});



App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || [];
    logs.unshift(Date.now());
    wx.setStorageSync('logs', logs);
    wx.setStorageSync('fromTransport', 'selfTaking');

    // if (!wx.getStorageSync('hasVisited')) {
    //   wx.clearStorage();
    //   setTimeout(() => {
    //     wx.setStorageSync('hasVisited', 1);
    //   }, 3000);
    // }
    // 登录

    // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           debugger
    //           // 可以将 res 发送给后台解码出 unionId
    //           this.globalData.userInfo = res.userInfo

    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res)
    //           }
    //         }
    //       })
    //     }
    //   }
    // })
  },
  globalData: {
    userInfo: null,
    cartFood: [],
    lastStoreTime: null,
    windowHeight:null
  }
});
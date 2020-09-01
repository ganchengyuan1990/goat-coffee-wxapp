// Page({
//     data: {
//       circleList: [],//圆点数组
//       awardList: [],//奖品数组
//       colorCircleFirst: '#FFDF2F',//圆点颜色1
//       colorCircleSecond: '#FE4D32',//圆点颜色2
//       colorAwardDefault: '#F5F0FC',//奖品默认颜色
//       colorAwardSelect: '#ffe400',//奖品选中颜色
//       indexSelect: 0,//被选中的奖品index
//       isRunning: false,//是否正在抽奖
//       imageAward: [
//         '../../images/1.jpg',
//         '../../images/2.jpg',
//         '../../images/3.jpg',
//         '../../images/4.jpg',
//         '../../images/5.jpg',
//         '../../images/6.jpg',
//         '../../images/7.jpg',
//         '../../images/8.jpg',
//       ],//奖品图片数组
//     },

//     onLoad() {
//         this.initGame();
//     },

//     // 初始化游戏
//     initGame() {
//         var _this = this;
//         //圆点设置
//         var leftCircle = 7.5;
//         var topCircle = 7.5;
//         var circleList = [];
//         for (var i = 0; i < 24; i++) {
//           if (i == 0) {
//             topCircle = 15;
//             leftCircle = 15;
//           } else if (i < 6) {
//             topCircle = 7.5;
//             leftCircle = leftCircle + 102.5;
//           } else if (i == 6) {
//             topCircle = 15
//             leftCircle = 620;
//           } else if (i < 12) {
//             topCircle = topCircle + 94;
//             leftCircle = 620;
//           } else if (i == 12) {
//             topCircle = 565;
//             leftCircle = 620;
//           } else if (i < 18) {
//             topCircle = 570;
//             leftCircle = leftCircle - 102.5;
//           } else if (i == 18) {
//             topCircle = 565;
//             leftCircle = 15;
//           } else if (i < 24) {
//             topCircle = topCircle - 94;
//             leftCircle = 7.5;
//           } else {
//             return
//           }
//           circleList.push({ topCircle: topCircle, leftCircle: leftCircle });
//         }
//         this.setData({
//           circleList: circleList
//         })
//         //圆点闪烁
//         setInterval(function () {
//           if (_this.data.colorCircleFirst == '#FFDF2F') {
//             _this.setData({
//               colorCircleFirst: '#FE4D32',
//               colorCircleSecond: '#FFDF2F',
//             })
//           } else {
//             _this.setData({
//               colorCircleFirst: '#FFDF2F',
//               colorCircleSecond: '#FE4D32',
//             })
//           }
//         }, 500)
//         //奖品item设置
//         var awardList = [];
//         //间距,怎么顺眼怎么设置吧.
//         var topAward = 25;
//         var leftAward = 25;
//         for (var j = 0; j < 8; j++) {
//           if (j == 0) {
//             topAward = 25;
//             leftAward = 25;
//           } else if (j < 3) {
//             topAward = topAward;
//             //222是宽.15是间距.下同
//             leftAward = leftAward + 222 + 15;
//           } else if (j < 5) {
//             leftAward = leftAward;
//             //130是高,15是间距,下同
//             topAward = topAward + 130 + 15;
//           } else if (j < 7) {
//             leftAward = leftAward - 222 - 15;
//             topAward = topAward;
//           } else if (j < 8) {
//             leftAward = leftAward;
//             topAward = topAward - 130 - 15;
//           }
//           var imageAward = this.data.imageAward[j];
//           awardList.push({ topAward: topAward, leftAward: leftAward, imageAward: imageAward });
//         }
//         this.setData({
//           awardList: awardList
//         })
//     },


//     //开始游戏
//     startGame: function () {
//       if (this.data.isRunning) return
//       this.setData({
//         isRunning: true
//       })
//       var _this = this;
//       var indexSelect = 0
//       var i = 0;
//       var timer = setInterval(function () {
//         indexSelect++;
//         //这里我只是简单粗暴用y=30*x+200函数做的处理.可根据自己的需求改变转盘速度
//         i += 30;
//         if (i > 1000) {
//           //去除循环
//           clearInterval(timer)
//           //获奖提示

//           wx.showModal({
//             title: '恭喜您',
//             content: '获得了第' + (_this.data.indexSelect + 1) + "个优惠券",
//             showCancel: false,//去掉取消按钮
//             success: function (res) {
//               if (res.confirm) {
//                 _this.setData({
//                   isRunning: false
//                 })
//               }
//             }
//           })
//         }
//         indexSelect = indexSelect % 8;
//         _this.setData({
//           indexSelect: indexSelect
//         })
//       }, (200 + i))
//     }
//   })

function initGame(activity_prizes) {
  //圆点设置
  var leftCircle = 7.5;
  var topCircle = 7.5;
  var circleList = [];
  var _this = this;
  for (var i = 0; i < 24; i++) {
    if (i == 0) {
      topCircle = 15;
      leftCircle = 15;
    } else if (i < 6) {
      topCircle = 7.5;
      leftCircle = leftCircle + 102.5;
    } else if (i == 6) {
      topCircle = 15
      leftCircle = 620;
    } else if (i < 12) {
      topCircle = topCircle + 94;
      leftCircle = 620;
    } else if (i == 12) {
      topCircle = 565;
      leftCircle = 620;
    } else if (i < 18) {
      topCircle = 570;
      leftCircle = leftCircle - 102.5;
    } else if (i == 18) {
      topCircle = 565;
      leftCircle = 15;
    } else if (i < 24) {
      topCircle = topCircle - 94;
      leftCircle = 7.5;
    } else {
      return
    }
    circleList.push({ topCircle: topCircle, leftCircle: leftCircle });
  }
  console.log(this, 'this');
  _this.setData({
    circleList: circleList
  })
  //圆点闪烁
  setInterval( () => {
    if (_this.data.colorCircleFirst == '#FFDF2F') {
      _this.setData({
        colorCircleFirst: '#FE4D32',
        colorCircleSecond: '#FFDF2F',
      })
    } else {
      _this.setData({
        colorCircleFirst: '#FFDF2F',
        colorCircleSecond: '#FE4D32',
      })
    }
  }, 500)
  //奖品item设置
  var awardList = [];
  //间距,怎么顺眼怎么设置吧.
  var topAward = 25;
  var leftAward = 25;
  for (var j = 0; j < 8; j++) {
    if (j == 0) {
      topAward = 25;
      leftAward = 25;
    } else if (j < 3) {
      topAward = topAward;
      //222是宽.15是间距.下同
      leftAward = leftAward + 222 + 8;
    } else if (j < 5) {
      leftAward = leftAward;
      //130是高,15是间距,下同
      topAward = topAward + 130 + 8;
    } else if (j < 7) {
      leftAward = leftAward - 222 - 8;
      topAward = topAward;
    } else if (j < 8) {
      leftAward = leftAward;
      topAward = topAward - 130 - 8;
    }
    var imageAward = activity_prizes[j].prize.icon;
    var _title = activity_prizes[j].prize.title;
    awardList.push({ topAward: topAward, leftAward: leftAward, imageAward: imageAward, title: _title });
  }
  _this.setData({
    awardList: awardList
  })

  console.log(awardList, '@@@');
}

function startGame () {
  var _this = this;
  if (_this.data.isRunning) return
  _this.setData({
    isRunning: true,
    tempI: 0
  })
  var indexSelect = 0
  var i = this.data.tempI;
  var timer = setInterval(function () {
    indexSelect++;
    //这里我只是简单粗暴用y=30*x+200函数做的处理.可根据自己的需求改变转盘速度
    i += 30;
    console.log(i, indexSelect, '@@@i');
    if (i > 500 && (indexSelect % 8 == (_this.data.prizeData.weight - 1))) {
      //去除循环
      clearInterval(timer)
      //获奖提示

      const weight = _this.data.prizeData.weight - 1;
      const ifGetPrize = _this.data.prizeData.prize.if_true_prize;
      const prizeType = _this.data.prizeData.prize.type;

      let modalTitle = 'https://img.goatup.cn/LUCKY.png'

      if (!ifGetPrize) {
        modalTitle = 'https://img.goatup.cn/SORRY.png'
      }


      setTimeout(() => {
        _this.setData({
          tempI: 0,
          modalTitle,
          showModal: true,
          ifGetPrize,
          prizeTitle: _this.data.prizeData.prize.title,
          user_prize_record_id: _this.data.prizeData.user_prize_record_id,
          actImage: _this.data.prizeData.prize.icon,
          realGift: _this.data.prizeData.prize.type == 2,
          noMoreChance: false,
          indexSelect: indexSelect % 8,
          isRunning: false,
          prizeType
        })
      }, 500)



      // wx.showModal({
      //   title: '恭喜您',
      //   content: '获得了第' + (_this.data.indexSelect + 1) + "个优惠券",
      //   showCancel: false,//去掉取消按钮
      //   success: function (res) {
      //     if (res.confirm) {
      //       _this.setData({
      //         isRunning: false
      //       })
      //     }
      //   }
      // })
    }

    // console.log(indexSelect, 'indexSelect');
    // indexSelect = indexSelect % 8;

    _this.setData({
      indexSelect: indexSelect % 8
    })

  }, (150 + i))
}

export {
  initGame,
  startGame
};


// var util = require('../../../utils/util.js');
// var api = require('../../../config/api.js');

import model from '../../../utils/model';
import {
    initGame,
    startGame,
} from './sudoku.js';

var app = getApp();

Page({
    data: {
        circleList: [],//圆点数组
        // awardList: [],//奖品数组
        colorCircleFirst: '#FFDF2F',//圆点颜色1
        colorCircleSecond: '#FE4D32',//圆点颜色2
        colorAwardDefault: '#FFF8DF',//奖品默认颜色
        colorAwardSelect: '#FFEDAB',
        indexSelect: 0,//被选中的奖品index
        isRunning: false,//是否正在抽奖
        imageAward: [
        '../../images/1.jpg',
        '../../images/2.jpg',
        '../../images/3.jpg',
        '../../images/4.jpg',
        '../../images/5.jpg',
        '../../images/6.jpg',
        '../../images/7.jpg',
        '../../images/8.jpg',
        ],//奖品图片数组
        coffeeMaker: false,
        price: 0,
        orderId: '',
        varCode: '',
        banner: '',
        showModal: false,
        showNewModal: false,
        modalTitle: 'sdsdsdsd',
        memberData: {},
        errorToastShown: false,
        errorInfo: {},
        memberResult: {},
        actImage: '',
        from: '',
        newUserFirstPayActivity: {},
        showNewUser: false,
        showWelcome: false,
        level: 1,
        targetAchievementDesign: null,
        drinkGiftPaymentImg: '',
        toastType: 1,
        hasGetAchievementGiftNumber: 0,
        gainValue: 0,
        gainScore: 0,
        existLuckActivity: false
    },

    showModalCups () {
        const achievementCups = this.data.memberData.achievementCups;
        const targetAchievementDesign = this.data.targetAchievementDesign;
        const targetCups = targetAchievementDesign.caps;
        const memberLevel = this.data.level;
        const mayGetAchievementGiftNumber = this.data.memberData.mayGetAchievementGiftNumber;

        if (mayGetAchievementGiftNumber) {
            this.setData({
                // showWelcome: true,
                errorToastShown: true,
                // errorInfo: '<p>您已集满8杯</p>  <p>快去会员卡页面领取一杯吧</p>',
                errorInfo: `<p>您已集满${targetCups}杯</p> <p>快去会员卡页面领取${mayGetAchievementGiftNumber}杯吧！</p>`,
                toastType: 2
            })
        } else {
            if (targetAchievementDesign.unlimit_in_month || this.data.hasGetAchievementGiftNumber == 0) {
                this.setData({
                    // showWelcome: true,
                    errorToastShown: true,
                    // errorInfo: '<p>您已集满8杯</p>  <p>快去会员卡页面领取一杯吧</p>',
                    errorInfo: `<p>再喝${targetCups - achievementCups}杯即可领取1杯</p>`,
                    toastType: 2
                })
            } else {
                this.setData({
                    // showWelcome: true,
                    errorToastShown: true,
                    // errorInfo: '<p>您已集满8杯</p>  <p>快去会员卡页面领取一杯吧</p>',
                    errorInfo: `<p>本月已经领过了</p> <p>请下个月再来吧！</p>`,
                    toastType: 2
                })
            }
            
        }

        // setTimeout(() => {
        //     this.setData({
        //         errorToastShown: false,
        //     });
        // }, 30000);
        
    },

    initGame(activity_prizes) {
        const self = this
        return initGame.call(self, activity_prizes);
    },

    startGame() {
        if (this.data.noMoreChance) {
            this.setData({
                modalTitle: 'SORRY',
                showNewModal: true,
                ifGetPrize: 0,
                noMoreChance: true,
              })
            return ;
        }
        if (!this.data.hasLogin) {
            wx.navigateTo({
                url: '/pages/login/login?from=wheel'
            })
            getApp().globalData.fromWheel = true;
            return ;
        }

        if (this.data.isRunning) {
            return ;
        }

        model(`activity/luck-activity/prize-draw`, {
            id: this.data.activity.id,
            order_id: this.data.orderId,
        }, 'POST').then(res1 => {
            // let activityUser = this.data.activityUser;
            const {
                data: prizeData
            } = res1;
            // activityUser.luck_number = activityUser.luck_number + add_number;
            this.setData({
                prize_count: prizeData.prize_count,
                prizeData: prizeData,
            }, () => {
                // 触发组件开始方法
                const self = this
                return startGame.apply(self);
            });
        }).catch(e => {
            if (e == '抽奖机会用完了') {
                this.setData({
                    modalTitle: 'SORRY',
                    showNewModal: true,
                    ifGetPrize: 0,
                })
            } else {
                wx.showToast({
                    title: e,
                    icon: 'none',
                    duration: 3000,
                    mask: false,
                });    
            }
        });

        // const self = this

        // return startGame.apply(self);
    },

    onLoad: function (options) {
        let configData = wx.getStorageSync('configData');

        console.log(options, '@@@options');

        const token = wx.getStorageSync('token') || null;

        this.setData({
            coffeeMaker: Boolean(options.coffeeMaker),
            price: options.price,
            orderId: options.orderId,
            varCode: options.varCode,
            submitForMachineTypeThird: Boolean(getApp().globalData.submitForMachineTypeThird),
            banner: configData.p5Banners,
            hasLogin: Boolean(token),
            // existLuckActivity: false
        })

        // model('base/site/user-config-list').then(res => {
        //     this.setData({
        //         price: options.price,
        //         orderId: options.orderId,
        //         varCode: options.varCode,
        //         banner: configData.p5Banners,
        //         hasLogin: Boolean(token),
        //         // existLuckActivity: false
        //         enablePrizeActivity: res.data['enable-prize-activity'],
        //     })
        //     if (res.data['enable-prize-activity']) {
        //         this.getInfo();
        //     }
        //     wx.hideLoading();
        // }).catch(e => {
        //     wx.hideLoading();
        // });

        let _url = `my/achievement/single-order?orderId=${options.orderId}`;
        if (options.from == 'recharge') {
            _url = `my/achievement/single-order?orderId=${options.orderId}&isRecharge=1`;
        }

        Promise.all([model('base/site/config-list'), model(_url)]).then((resArr) => {
            const res = resArr[0];
            const res2 = resArr[1];
            const userRes = wx.getStorageSync('userConfigList');
             wx.setStorageSync('configData', res.data['config-set'])
             this.setData({
                 coffeeMaker: Boolean(options.coffeeMaker),
                 varCode: options.varCode,
                 newUserFirstPayActivity: res.data.newUserFirstPayActivity,
                 showNewUser: userRes['enable-new-user-after-pay-activity'] && (options.from != 'recharge'),
                 price: options.price || 0,
                 orderId: options.orderId || 0,
                 gainValue: res2.data.single_member_energy_score,
                 gainScore: res2.data.single_member_points,
                 existLuckActivity: Boolean(res.data['exist-luck-activity']),
                 // existLuckActivity: false,
                 from: options.from,
                 banner: res.data.p5Banners,
                 drinkGiftPaymentImg: res.data['drink-gift-payment-img']
             });
             wx.hideLoading();
         }).catch(e => {
            //  wx.hideLoading();
            this.setData({
                coffeeMaker: Boolean(options.coffeeMaker),
                varCode: options.varCode,
                price: options.price || 0,
                orderId: options.orderId || 0,
                from: options.from,
                banner: configData.p5Banners,
            })
            wx.hideLoading();
         });

        this.getInfo();
    },

    getInfo() {
        wx.showLoading({
            title: '加载中...', //提示的内容,
            mask: true, //显示透明蒙层，防止触摸穿透,
            success: res => {}
        });
        const _JSON = JSON.parse(wx.getStorageSync('STORE_INFO') || "{}")
        model(`activity/luck-activity/index?store_id=${_JSON.id}`).then((res) => {
            let {
                data: {
                    activity,
                    activity_prizes,
                    prize_count,
                    prize_records,
                    enable_prize_activity,
                    // activityUser
                }
            } = res;
            if (activity.begin_time) {
                activity.begin_time = activity.begin_time.replace(/\-/g, '.').split(' ')[0];
            }
            if (activity.end_time) {
                activity.end_time = activity.end_time.replace(/\-/g, '.').split(' ')[0]
            }
            this.initGame(activity_prizes);

            this.setData({
                activity,
                prize_count,
                noMoreChance: prize_count <= 0,
                prize_records,
                enablePrizeActivity: enable_prize_activity,
                storeInfo: _JSON,
                // awardList: activity_prizes,
            }, () => {
            })

            if (enable_prize_activity) {
                model(`activity/luck-activity/stat?id=${activity.id}&source=pay`)
            }

            
            

            wx.hideLoading();
        }).catch(e => {
            wx.hideLoading();
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
        app.globalData.fromPaySuccess = true;
        wx.reLaunch({
            url: '/pages/store/store?from=pay_success'
        })
    },

    go_share () {
        wx.navigateTo({
            url: '/pages/pay/share_coupon/share_coupon'
        });
    },

    goZhuanpan () {
        wx.navigateTo({
            url: `/package/wheel/pages/index/index`
        });
    },

    goStore() {
        wx.switchTab({
            url: '/pages/store/store'
        });
    },

    goIndex () {
        // wx.switchTab({
        //     url: '/pages/store/store'
        // });
        if (this.data.from == 'recharge') {
            wx.redirectTo({
                url: `/pages/recharge/index?success=1`
            });
        } else {
            wx.navigateTo({
                url: `/pages/order/detail/detail?id=${this.data.orderId}&orderClassify=1&showDialog=1&fromPay=1`
            });
        }
        // wx.showTabBar({
        //     animation: true
        // })
    },

    goInvice() {
        // let item = e.currentTarget.dataset.item;
        wx.setStorageSync('martsListArr', [{
            id: this.data.orderId,
            real_due: this.data.price
        }]);
        wx.navigateTo({
            url: `/package/invoice/pages/open/open`
        });
    },

    getAchievement() {
            model('my/achievement/info', {}, 'POST').then(res => {
                // debugger
                let result = res.data;
                let total;
                let user_info = result.user_info;
                if (user_info && user_info.member_energy_score) {
                    result.member_energy_score_rate = parseInt(parseFloat(user_info.member_energy_score) / parseFloat(result.nextDesign.energy_low) * 100)
                }
                if (result.currentDesign) {
                    this.setData({
                        memberData: result,
                        level: result.currentDesign.level,
                        targetAchievementDesign: result.targetAchievementDesign,
                        hasGetAchievementGiftNumber: parseInt(result.hasGetAchievementGiftNumber),
                    })
                }
                if (result.arriveDesign) {
                    this.setData({
                        level: result.arriveDesign.level
                    })
                    this.getAchievement2();
                }

                // wx.setStorageSync('memberData', result);
                wx.hideLoading();
            });
        },

        getAchievement2() {
            model('my/achievement/get-member-level-gift', {}, 'POST').then(res => {
                if (res.code == "suc") {
                    this.setData({
                        showModal: true,
                        actImage: this.data.memberData.arriveDesign.alert_img
                    })
                    this.getAchievement();
                }
            }).catch(e => {
                this.setData({
                    errorToastShown: true,
                    errorInfo: e,
                })
            });
        },

        doRightNow() {
            wx.showModal({
                content: `您是否在${this.data.storeInfo.storeName}自助咖啡机前面？ 如果不在，咖啡可能会被别人取走哟`, //提示的内容,
                showCancel: true, //是否显示取消按钮,
                cancelColor: '#9A9A9A', //取消按钮的文字颜色,
                cancelText: '暂不制作',
                confirmText: '确定', //确定按钮的文字，默认为取消，最多 4 个字符,
                confirmColor: '#F12B23', //确定按钮的文字颜色
                success: res => {
                    if (res.confirm) {
                        model(`order/detail/make-drinks`, {
                            id: orderId
                          }, 'POST').then(res => {
                            if (res.code == 'suc') {
                              wx.showToast({
                                title: '饮品制作中', //提示的内容,
                                icon: 'none', //图标,
                                duration: 2000, //延迟时间,
                                mask: true, //显示透明蒙层，防止触摸穿透,
                                success: res => {}
                              });
                              setTimeout(() => {
                                this.goIndex()
                              }, 1500);
                            }
                          }).catch(e => {
                            console.log(e)
                            wx.showToast({
                              title: e, //提示的内容,
                              icon: 'none', //图标,
                              duration: 2000, //延迟时间,
                              mask: true, //显示透明蒙层，防止触摸穿透,
                              success: res => {}
                            });
                          })
                    }
                }
            })
        },
})
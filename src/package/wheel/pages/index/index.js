// pages/wheel/index.js
import model from '../../utils/model';
import {
    initGame,
    startGame,
} from './sudoku.js';

import util from '../../utils/util.js'


Page({
    /**
     * 页面的初始数据
     */
    data: {
        circleList: [],//圆点数组
        // awardList: [],//奖品数组
        colorCircleFirst: '#FFDF2F',//圆点颜色1
        colorCircleSecond: '#FE4D32',//圆点颜色2
        colorAwardDefault: '#fff',//奖品默认颜色
        colorAwardSelect: '#FDF0C8',
        indexSelect: 0,//被选中的奖品index
        isRunning: false,//是否正在抽奖
        ifGetPrize: 0,
        shownIndex: 0,
        prizeType: 0,
        noMoreChance: false,
        imgBack: "background: url('https://img.goatup.cn/beijing_new.png') no-repeat; background-size: 100%;",
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
        modalTitle: 'lucky',
        showModal: false,
        actImage: 'https://ss1.bdstatic.com/6OF1bjeh1BF3odCf/it/u=2571321855,3454071971&fm=74&app=80&f=GIF&size=f121,90?sec=1880279984&t=83c89d5fc403f779e3104684d7808d4d',
        award: 1,
        mode: 2, // 旋转模式,
        modalType: 1,
        otherFunctionType: '再抽一次',
        hasLogin: false,
        activity: {},
        activityGifts: {},
        activityLuckGiftsGroup: {},
        activityUser: {},
        user_info: {},
        leftScores: 0,
        gotGift: {},
        drawNumber: 0,
        firstStyle: 0,

        awardList: [
            { title: '10个金币' },
            { title: '20个金币' },
            { title: '30个金币' },
            { title: '50个金币' },
            { title: '80个金币' },
            { title: '200个金币' },
            {
                title: '500个金币'
            }, {
                title: '800个金币'
            }
        ] // 顺时针对应每个奖项
    },

    initGame(activity_prizes) {
        const self = this
        return initGame.call(self, activity_prizes);
    },

    startGame() {
        (util.throttleV2(() => {
            if (this.data.noMoreChance) {
                this.setData({
                    modalTitle: 'https://img.goatup.cn/SORRY.png',
                    showModal: true,
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

            if (getApp().globalData.gettingAjax) {
                return;
            }

            getApp().globalData.gettingAjax = true
            model(`activity/luck-activity/prize-draw`, {
                id: this.data.activity.id
            }, 'POST').then(res1 => {
                // let activityUser = this.data.activityUser;
                const {
                    data: prizeData
                } = res1;
                // prizeData.weight = 1;
                // debugger
                // activityUser.luck_number = activityUser.luck_number + add_number;
                this.setData({
                    prize_count: prizeData.prize_count,
                    prizeData: prizeData,
                }, () => {
                    // 触发组件开始方法
                    const self = this
                    return startGame.apply(self);
                });
                getApp().globalData.gettingAjax = false;
            }).catch(e => {
                getApp().globalData.gettingAjax = false;
                if (e == '抽奖机会用完了') {
                    this.setData({
                        modalTitle: 'https://img.goatup.cn/SORRY.png',
                        showModal: true,
                        ifGetPrize: 0,
                        noMoreChance: true,
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
		}, 300, 1500))()
        
    },

    onLoad: function(options) {
        const token = wx.getStorageSync('token') || null;
        this.setData({
            hasLogin: Boolean(token)
        })
        this.getInfo();

    },

    onUnload() {
        clearInterval(this._clock);
    },

    setZoumadeng(obj, i) {
        this.setData({
            zoumadengObj: obj,
            shownIndex: i
        })
    },

    getInfo() {
        wx.showLoading({
            title: '加载中...', //提示的内容,
            mask: true, //显示透明蒙层，防止触摸穿透,
            success: res => {}
        });
        model('activity/luck-activity/index').then((res) => {
            let {
                data: {
                    activity,
                    activity_prizes,
                    prize_count,
                    prize_records,
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
                // awardList: activity_prizes,
            }, () => {
                let i = this.data.shownIndex;
                this.setZoumadeng(this.data.prize_records[i], i)
                this._clock = setInterval(() => {
                    i += 1;
                    i = i % this.data.prize_records.length;
                    this.setZoumadeng(this.data.prize_records[i], i)
                }, 3000);
            })


            model(`activity/luck-activity/stat?id=${activity.id}&source=me`)
            

            wx.hideLoading();
        }).catch(e => {
            wx.hideLoading();
        });
    },

    dealModalFunction () {
        this.wheelStart();
    },
    // 用户点击开始抽奖
    wheelStart() {
        const lastWheel = wx.getStorageSync('lastWheel');
        if (this.data.drawNumber < 1) {
            if (this.data.user_info.member_points < this.data.activity.draw_point) {
                 this.setData({
                     showModal: true,
                     modalType: 4,
                     modalTitle: `还差${this.data.activity.draw_point - this.data.user_info.member_points}积分参与抽奖`,
                 })
            } else if ((lastWheel && new Date().getTime() - lastWheel > 86400000 || !lastWheel)) {
                wx.setStorageSync('lastWheel', new Date().getTime());
                wx.showModal({
                    content: `本次抽奖消耗${this.data.activity.draw_point}积分`, //提示的标题,
                    showCancel: true, //是否显示取消按钮,
                    cancelText: '关闭', //取消按钮的文字，默认为取消，最多 4 个字符,
                    cancelColor: '#000000', //取消按钮的文字颜色,
                    confirmText: '确定', //确定按钮的文字，默认为取消，最多 4 个字符,
                    confirmColor: '#DAA37F', //确定按钮的文字颜色,
                    success: res => {
                        if (res.confirm) {
                            model(`activity/luck-activity/prize-draw`, {
                                activityId: this.data.activity.id
                            }, 'POST').then(res1 => {
                                // let activityUser = this.data.activityUser;
                                const {
                                    data: {
                                        gift: {
                                            luck_number: add_number
                                        }
                                    }
                                } = res1;
                                // activityUser.luck_number = activityUser.luck_number + add_number;
                                this.setData({
                                    activityUser: res1.data.activityUser,
                                    drawNumber: 0,
                                    user_info: res1.data.user_info,
                                    gotGift: res1.data.gift,
                                    award: res1.data.giftIndex //安全起见生成奖项应该由后端完成，生成1到6随机
                                }, () => {
                                    console.log(this.data.award);
                                    // 触发组件开始方法
                                    this.selectComponent('#sol-wheel').begin()
                                });
                            });

                        } else if (res.cancel) {
                            // console.log('查看发票记录')
                        }
                    }
                });
            } else {
                model(`activity/luck-activity/prize-draw`, {
                    activityId: this.data.activity.id
                }, 'POST').then(res1 => {
                    // let activityUser = this.data.activityUser;
                    const {
                        data: {
                            gift: {
                                luck_number: add_number
                            }
                        }
                    } = res1;

                    // activityUser.luck_number = activityUser.luck_number + add_number;
                    this.setData({
                        drawNumber: res1.data.activityUser.draw_number,
                        activityUser: res1.data.activityUser,
                        gotGift: res1.data.gift,
                        user_info: res1.data.user_info,
                        award: res1.data.giftIndex //安全起见生成奖项应该由后端完成，生成1到6随机
                    }, () => {
                        // 触发组件开始方法
                        this.selectComponent('#sol-wheel').begin()
                    });
                }).catch(e => {
                    if (e == '抽奖机会用完了') {

                    }
                });
            }
            
        } else {
            model(`activity/luck-activity/prize-draw`, {
                activityId: this.data.activity.id
            }, 'POST').then(res1 => {
                // let activityUser = this.data.activityUser;
                const {
                    data: {
                        gift: {
                            luck_number: add_number
                        }
                    }
                } = res1;

                // activityUser.luck_number = activityUser.luck_number + add_number;
                this.setData({
                    drawNumber: res1.data.activityUser.draw_number,
                    activityUser: res1.data.activityUser,
                    gotGift: res1.data.gift,
                    user_info: res1.data.user_info,
                    award: res1.data.giftIndex //安全起见生成奖项应该由后端完成，生成1到6随机
                }, () => {
                    // 触发组件开始方法
                    this.selectComponent('#sol-wheel').begin()
                });
            });
        }
         
        
    },
    // 抽奖完成后操作
    wheelSuccess() {
        const index = this.data.award
        console.log('bind:success', this.data.awardList[index])
        // wx.showToast({
        //     title: `恭喜你获得${this.data.awardList[index].title}`,
        //     icon: 'none'
        // })
        if (this.data.gotGift.luck_number == 0) {
            this.setData({
                showModal: true,
                modalType: 1,
                modalTitle: '这次什么也没抽到哦～',
                actImage: '../../images/no_gift.png'
            })
        } else {
            this.setData({
                showModal: true,
                modalType: 1,
                modalTitle: '您获得了以下奖品，请到会员卡页面查看',
                actImage: this.data.gotGift.pic
            })
        }
        
    },
    // 切换模式
    switchMode(e) {
        const { type } = e.currentTarget.dataset
        this.setData({
            mode: type
        })
    },

    getLihe (e) {
        let value = e.currentTarget.dataset.value;
        let item = e.currentTarget.dataset.item;
        this.setData({
            showModal: true,
            modalType: 3,
            modalTitle: `您有${item.name}%概率将直接获得XX券`
        })
    },

    openLihe () {
        model(`activity/luck-activity/open-box`, {
            activityId: this.data.activity.id
        }, 'POST').then(res1 => {
            const {
                data: {
                    gift: {
                        pic
                    }
                }
            } = res1;

            this.setData({
                showModal: true,
                modalType: 1,
                modalTitle: '<p>您打开了幸运礼盒<p> <p>获得了以下奖品，请到会员卡页面查看</p>',
                activityUser: res1.data.activityUser,
                actImage: pic
            });
        });
    },
    /* 转发*/
    // onShareAppMessage() {
    //     if (!this.data.hasLogin) {
    //         wx.showModal({
    //             content: '您还没有登录，请登录后再邀请',
    //             showCancel: true, //是否显示取消按钮,
    //             cancelColor: '#000000', //取消按钮的文字颜色,
    //             confirmText: '登录', //确定按钮的文字，默认为取消，最多 4 个字符,
    //             confirmColor: '#DAA37F', //确定按钮的文字颜色,
    //             success: res => {
    //                 if (res.confirm) {
    //                     wx.navigateTo({
    //                         url: '/pages/login/login?from=goBack'
    //                     });
    //                 } else if (res.cancel) {
    //                     console.log('查看发票记录')
    //                 }
    //             }
    //         })
    //         return;
    //     } else {
    //         let userid = wx.getStorageSync('token').user.id;
    //         return {
    //             title: '麦隆幸运杯，邀您免费喝咖啡！',
    //             path: `/package/invite/pages/invite/invite?userid=${userid}&inviterUserType=luck`,
    //             imageUrl: this.data.activity.avatar,
    //             success: function (res) {

    //             },
    //             fail: function (res) {
    //                 // 转发失败
    //             }
    //         }
    //     }

    // },

    goMyCoupon() {
        wx.navigateTo({
            url: `../coupon/coupon?id=${this.data.activity.id}`
        })
    },

    goRecharge () {
        // wx.showModal({
        //     content: '确定要去充值中心吗？',
        //     showCancel: true, //是否显示取消按钮,
        //     cancelColor: '#000000', //取消按钮的文字颜色,
        //     confirmText: '确定', //确定按钮的文字，默认为取消，最多 4 个字符,
        //     confirmColor: '#DAA37F', //确定按钮的文字颜色,
        //     success: res => {
        //         if (res.confirm) {
        //             wx.navigateTo({
        //                 url: '/pages/recharge/index'
        //             });
        //         } else if (res.cancel) {
        //             console.log('查看发票记录')
        //         }
        //     }
        // })
        wx.switchTab({
            url: '/pages/store/store'
        })
        
    }


})

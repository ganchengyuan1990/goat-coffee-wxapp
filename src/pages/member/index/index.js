const app = getApp();

import model from '../../../utils/model'

Page({

    /**
     * 页面的初始数据
     */
    data: {
        token: {},
        banner: 'http://img.goatup.net/img/banner/0322-wode-yaoqingdebei.jpg',
        showAchive: false,
        curNav: 0,
        memberData: {},
        modalNewContent: '',
        showNewModal: false,
        couponItems: [],
        showMask: false,
        showMaskSheng: false,
        couponType: 1,
        hasLogin: true,
        img: '',
        errorToastShown: false,
        errorInfo: {},
        loading: true,
        showModal: false,
        welfares: [],
        modalContent: 'contentcontentcontent',
        modalTitle: '../../images/clap.png',
        modalType: 8,
        welfaresLength: 0,
        clapIcon: '../../../images/clap.png',
        showDot: false,
        leftDays: 0,
        couponNum: 0,
        showPrizeIntro: false,
        activityCupYesImg: '',
        isActWrapShow: false,
        actImage: '',
        level: 1,
        orderList: [],
        firstClock: true,
        getClockBack: false,
        waitUntilDiffOrderIds: []
    },

    handleSwitch() {
        app.globalData.switchTab = 2;
        wx.switchTab({
            url: 'pages/test2/test2',
        })
    },

    onHide() {
        this.setData({
            getClockBack: false
        })
    },

    onUnload() {
        this.setData({
            getClockBack: false
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

        wx.showLoading({
            title: '加载中', //提示的内容,
            mask: true, //显示透明蒙层，防止触摸穿透,
            success: res => {}
        });

        // wx.showTabBarRedDot({
        //   index: 2,
        // });
        let userCouponCountMention = wx.getStorageSync('userCouponCountMention');
        if (!userCouponCountMention) {
            this.setData({
                showDot: true,
                getClockBack: true
            })
        } else if (new Date().getTime() - userCouponCountMention > 86400000) {
            this.setData({
                showDot: true,
                getClockBack: true
            })
        }
        wx.hideTabBarRedDot({
            index: 2,
        });
        wx.setStorageSync('userCouponCountMention', new Date().getTime())
        this.calcLeftDaysThisMonth();


    },

    dealModalFunction() {
        this.setData({
            showModal: false
        })
    },



    calcLeftDaysThisMonth() {
        let nowDate = new Date();
        const year = nowDate.getFullYear()
        const month = nowDate.getMonth() + 1
        const day = nowDate.getDate();
        let targetMonth, targetYear;
        if (month == 12) {
            targetYear = year + 1;
            targetMonth = 1;
        } else {
            targetYear = year;
            targetMonth = month + 1;
        }
        let targetDate = new Date(`${targetYear}/${targetMonth}/1`);
        let targetDateStamp = targetDate.getTime();
        let gap = targetDateStamp - nowDate.getTime();
        let result = parseInt(gap / 86400000);
        this.setData({
            leftDays: result
        });
    },

    closeToast() {
        this.setData({
            isActWrapShow: false,
        })
        this.getAchievement();
    },

    hideMask() {
        this.setData({
            showMask: false,
            showMaskSheng: false
        })
        this.getAchievement();
    },

    setTabStatus() {
        if (wx.getStorageSync('token') && wx.getStorageSync('STORE_INFO')) {
            let STORE_INFO = JSON.parse(wx.getStorageSync('STORE_INFO'));
            model(`home/cart/list?storeId=${STORE_INFO.id}`).then(res => {
                let sum = 0;
                res.data.carts && res.data.carts.forEach(item => {
                    sum += item.num;
                })
                wx.setStorageSync('cartSum', sum);
                if (sum) {
                    wx.setTabBarBadge({
                        index: 1,
                        text: sum.toString()
                    });
                }
            }).catch(e => {

            });
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        if (typeof this.getTabBar === 'function' &&
            this.getTabBar()) {
            this.getTabBar().setData({
                selected: 2
            })
        }
        wx.removeStorageSync('showNoOrder');

        console.log('onshow');

        let token = wx.getStorageSync('token')
        this.setData({
            token: token
        })
        if (token) {
            this.setData({
                hasLogin: true
            })
            this.getProfile();
            this.getAchievement()
            this.getTodoOrderList();
        } else {
            this.setData({
                curNav: 0,
                hasLogin: false
            })
            wx.hideLoading();
        }


        this.setTabStatus();

        model('activity/luck-activity/index').then((res) => {
            let {
                data: {
                    activity,
                    activity_prizes,
                    prize_count,
                    prize_records,
                    // activityUser
                },
                code,
            } = res;
            if (code == 'suc') {
                this.setData({
                    showPrizeIntro: true
                })
            } else {
                this.setData({
                    showPrizeIntro: false
                })
            }




            wx.hideLoading();
        }).catch(e => {
            this.setData({
                showPrizeIntro: false
            })
            wx.hideLoading();
        });

    },
    onPullDownRefresh() {
        wx.stopPullDownRefresh()
    },

    getTodoOrderList() {
        if (!this.data.firstClock && !this.data.getClockBack) {
            return;
        }
        let obj = {
            page: 1,
            userId: this.data.userInfo && this.data.userInfo.id,
            type: 6,
            waitTime: 30,
            scene: 2,
            waitUntilDiffOrderIds: this.data.waitUntilDiffOrderIds.join(',')
        }
        model('order/detail/list', obj).then(res => {
            // console.log('order res', res)
            let {
                data
            } = res
            if (data && Array.isArray(data)) {

                let len = data.length
                let arr = []
                let _waitUntilDiffOrderIds = []
                if (len < 5) {
                    this.setData({
                        isCompleted: true
                    })
                }
                if (len === 0) {
                    this.setData({
                        isCompleted: true
                    })
                    arr = []
                } else {
                    // 普通订单

                    data = data.map(item => {
                        if (item.order.orderState == '100' && item.order.isComment) {
                            item.order.orderState = '101'
                        }
                        _waitUntilDiffOrderIds.push(item.order.id);
                        item.order.payAmount = (item.order.payAmount == parseInt(item.order.payAmount) ? parseInt(item.order.payAmount) : parseFloat(item.order.payAmount).toFixed(1))
                        return item;
                    })
                    arr = data
                }
                this.setData({
                    orderList: arr.slice(0, 2),
                    getClockBack: true,
                    waitUntilDiffOrderIds: _waitUntilDiffOrderIds
                }, () => {
                    setTimeout(() => {
                        this.getTodoOrderList();
                    }, 0);

                });
            }
            wx.stopPullDownRefresh()
        }).catch(e => {
            this.setData({
                isLoading: false,
                isCompleted: true,
                getClockBack: true
            }, () => {
                setTimeout(() => {
                    this.getTodoOrderList();
                }, 0);
            });
            wx.stopPullDownRefresh()
        })
        this.setData({
            firstClock: false
        });
    },
    getProfile() {
        let info = wx.getStorageSync('token')
        let userInfo = info.user
            // let userInfoWechat = app.globalData.userInfo || {}
        let userInfoWechat = wx.getStorageSync('personal_info') || {}
        if (info.token) {
            // console.log(info.user, 'userinfo');
            // console.log(userInfoWechat, 'wechat');
            this.setData({
                userInfo: userInfo,
                userInfoWechat: userInfoWechat
            })
        } else {
            // wx.navigateTo({
            //   url: '/pages/login/login'
            // })
            this.setData({
                hasLogin: false
            })
            return
        }
        this.setData({
            name: userInfo.userName || userInfoWechat.nickName || '',
            img: userInfo.avatar || userInfoWechat.avatarUrl
        })
    },
    getAchievement() {
        model('my/achievement/info', {}, 'POST').then(res => {
            // debugger
            wx.hideLoading();
            let result = res.data;
            let total;
            let user_info = result.user_info;
            if (user_info && user_info.member_energy_score) {
                result.member_energy_score_rate = parseInt(parseFloat(user_info.member_energy_score) / parseFloat(result.nextDesign.energy_low) * 100)
            }
            console.log(result.member_energy_score_rate, 888)
            if (user_info.member_recharge && user_info.member_gift_recharge) {
                total = parseFloat(user_info.member_recharge) + parseFloat(user_info.member_gift_recharge);
                result.member_total_recharge = (total == parseInt(total) ? parseInt(total) : parseFloat(total).toFixed(1))
            } else if (user_info.member_recharge && !user_info.member_gift_recharge) {
                total = parseFloat(user_info.member_recharge);
                result.member_total_recharge = (total == parseInt(total) ? parseInt(total) : parseFloat(total).toFixed(1))
            }

            // debugger

            result.hasGetAchievementGiftNumber = parseInt(result.hasGetAchievementGiftNumber)

            if (result.targetAchievementDesign) {
                result.capsRate = (result.achievementCups / result.targetAchievementDesign.caps * 100);
                // if (result.targetAchievementDesign.unlimit_in_month) {
                //   result._moreCups = result.achievementCups % result.targetAchievementDesign.caps ; 
                //   result.capsRate = (result._moreCups / result.targetAchievementDesign.caps * 100);
                // }
            }
            this.setData({
                memberData: result,
                loading: false,
                level: result.currentDesign.level,
            });
            if (result.currentDesign.welfares) {
                let _resArr = [];
                _resArr = result.currentDesign.welfares.filter(item => {
                    return item.isAvailable;
                })
                this.setData({
                    welfares: _resArr,
                    welfaresLength: _resArr.length
                });

            }
            wx.setStorageSync('memberData', result);
        }).catch(e => {
            console.log(e, 'getAchievement fail');
            wx.hideLoading();
        });
    },

    onClickAvatar() {
        wx.navigateTo({
            url: '/pages/login/login'
        });
    },

    goState() {
        wx.navigateTo({
            url: `/pages/member/state/index?image=${this.data.img}`
        });
    },

    getAchievement1() {
        model('my/achievement/get-member-level-gift', {}, 'POST').then(res => {
            if (res.code == "suc") {
                // wx.showModal({
                //   title: '提示', //提示的标题,
                //   content: "您已成功升级", //提示的内容,
                //   showCancel: false, //是否显示取消按钮,
                //   cancelColor: '#000000', //取消按钮的文字颜色,
                //   confirmText: '确定', //确定按钮的文字，默认为取消，最多 4 个字符,
                //   confirmColor: '#DAA37F', //确定按钮的文字颜色
                //   success: res => {
                //     if (res.confirm) {
                //       this.getAchievement();
                //     }
                //   }
                // })
                this.setData({
                    // showMask: true
                    isActWrapShow: true,
                    actImage: res.data.nextDesign.alert_img
                })
            }
            // debugger
            // result.capsRate = (result.achievementCups / result.targetAchievementDesign.caps * 100);
            // this.setData({
            //   memberData: result
            // });
            // wx.setStorageSync('memberData', result);
        }).catch(e => {
            wx.showToast({
                title: e, //提示的内容,
                icon: 'none', //图标,
                duration: 2000, //延迟时间,
                mask: true, //显示透明蒙层，防止触摸穿透,
                success: res => {}
            });
        });
    },

    getAchievement2() {
        let configData = wx.getStorageSync('configData');
        model('my/achievement/get-achievement-gift', {}, 'POST').then(res => {
            if (res.code == "suc") {
                this.setData({
                    showMaskSheng: true,
                    activityCupYesImg: configData['activity-cup-yes-img'],
                    couponNum: res.data.coupons && res.data.coupons.length || 1
                })
            }
        }).catch(e => {
            if (e == 'LEVEL_LIMIT') {
                let gap = this.data.memberData.nextDesign.energy_low - this.data.memberData.user_info.member_energy_score
                this.setData({
                    modalTitle: configData['activity-cup-no-img'],
                    showModal: true,
                    modalType: 8,
                    modalContent: '您升级到金麦才能领取该奖励哟！  还差' + gap + '活力值升级到金麦'
                })
            } else {
                wx.showToast({
                    title: e, //提示的内容,
                    icon: 'none', //图标,
                    duration: 2000, //延迟时间,
                    mask: true, //显示透明蒙层，防止触摸穿透,
                    success: res => {}
                });

            }

        });
    },

    getVeryMoney(money) {
        let result;
        if (money == parseInt(money)) {
            result = parseInt(money)
        } else {
            result = parseFloat(money).toFixed(1)
        }
        return result;
    },

    getCouponItems(e) {
        let type = 1;
        if (e) {
            type = parseInt(e.currentTarget.dataset.index);
        }
        this.setData({
                couponType: type
            })
            // https: //heibanbao.wang/api/v1/server/my/coupon/list?userId=7447
        let userId = wx.getStorageSync('token').user.id;
        model(`my/coupon/list?userId=${userId}&type=${type}`).then(res => {
            let result = res.data.userCoupons;
            result.map(element => {
                if (element.coupon.discount || element.coupon.discount == 0) {
                    element.coupon.discount = parseFloat(element.coupon.discount).toFixed(1);
                }
                if (element.coupon.manjian_cash) {
                    element.coupon.manjian_cash = this.getVeryMoney(element.coupon.manjian_cash)
                }
                if (element.coupon.zhigou_cash) {
                    element.coupon.zhigou_cash = this.getVeryMoney(element.coupon.zhigou_cash)
                }

                if (element.coupon.manjian_price_available) {
                    element.coupon.manjian_price_available = this.getVeryMoney(element.coupon.manjian_price_available)
                }
                // element.couponBref = '21123123123';
                if (element.coupon.availabileStartTime) {
                    element.coupon.availabileStartTime = element.coupon.availabileStartTime.split(' ')[0]
                }
                if (element.end_time) {
                    element.end_time = element.end_time.split(' ')[0]
                }

                if (element.coupon.classifyNames && element.coupon.classifyNames.length > 0) {
                    element.xianzhi = element.coupon.classifyNames[0]
                }

                if (element.coupon.goodsNames && element.coupon.goodsNames.length > 0) {
                    element.xianzhi = element.coupon.goodsNames[0]
                }
                // if (element.endTime) {
                //   element.endTime = element.endTime.split(' ')[0]
                // }
                return element;
            });
            this.setData({
                couponItems: result,
                loading: false
            })
        }).catch(e => {
            this.setData({
                loading: false
            })
        });
    },
    goCoupon(e) {
        let type = e.currentTarget.dataset.type
        wx.navigateTo({
            url: `/pages/my/coupon/coupon?type=${type}`
        })
    },

    goAchive() {
        this.setData({
            showAchive: true
        })
    },

    goLicheng() {
        this.setData({
            showAchive: false
        })
    },

    goPocket() {
        wx.navigateTo({
            url: '/package/coffeePocket/pages/pocket/pocket'
        });
    },

    goProfile() {
        if (wx.getStorageSync('token')) {
            // wx.navigateTo({
            //   url: '/pages/my/profile/profile'
            // });
        } else {
            wx.navigateTo({
                url: '/pages/login/login'
            });
        }

    },

    goLogin() {
        wx.navigateTo({
            url: '/pages/login/login'
        });
    },
    goAddress() {
        wx.navigateTo({
            url: '/pages/my/address_list/address_list'
        })
    },


    goQrCode() {
        wx.navigateTo({
            url: "/pages/member/qrcode/index"
        })
    },

    switchRightTab(e) {
        var index = e.currentTarget.dataset.index;
        if (index == 2) {
            this.getCouponItems();
            this.setData({
                showDot: false
            })
        }
        if (index == 0) {
            this.setData({
                loading: false,
                curNav: index
            })
        } else {
            this.setData({
                loading: true,
                curNav: index
            })
        }

    },

    showRule(e) {
        let index = e.currentTarget.dataset.index;
        let couponItems = this.data.couponItems;
        couponItems[index].showRule = !couponItems[index].showRule;
        this.setData({
            couponItems: couponItems,
            clapIcon: couponItems[index].showRule ? '../../../images/clap2.png' : '../../../images/clap.png'
        })
    },

    showCupsRule() {
        this.setData({
            modalType: 9,
            showModal: true,
            modalTitle: this.data.memberData.targetAchievementDesign.rule_img
        })
    },

    goStore() {
        wx.switchTab({ url: '/pages/store/store' });
    },

    goTequan(e) {
        let item = e.currentTarget.dataset.item;
        let modalType = 4;
        if (item.name === '免费赠金麦') {
            modalType = 3
        }
        if (!item.isAvailable) {
            modalType = 5
        }
        this.setData({
            showModal: true,
            modalTitle: modalType == 5 ? '敬请期待' : item.name,
            modalContent: item.description,
            modalType: modalType
        })
    },

    getUserInfo() {
        let self = this;
        wx.login({
            success: function(res) {
                console.log(res);
                if (res.code) {
                    model('my/user/get-open-id', {
                        code: res.code
                    }).then(res => {
                        // wx.setStorageSync('openid', res.data);
                        wx.setStorageSync('openid', res.data.openid);
                        let session_key = res.data.session_key;
                        if (res.data.unionid) {
                            wx.setStorageSync('unionId', res.data.unionid);
                            wx.setStorageSync('unionid', res.data.unionid);
                        }
                        if (session_key) {
                            wx.setStorageSync('session_key', session_key);
                        }
                        wx.getUserInfo({
                            withCredentials: true,
                            success: function(res) {
                                var userInfo = res.userInfo
                                let iv = res.iv;
                                let encryptedData = res.encryptedData;
                                console.log(session_key);
                                console.log(iv);
                                console.log(encryptedData);
                                wx.setStorageSync('personal_info', {
                                    nickName: userInfo.nickName,
                                    avatarUrl: userInfo.avatarUrl,
                                    gender: userInfo.gender,
                                    province: userInfo.province,
                                    city: userInfo.city,
                                    country: userInfo.country
                                });
                                wx.setStorageSync('encryptedData', res);
                                self.goLogin();
                                self.setData({
                                    auth: true
                                })
                            }
                        })
                    })
                } else {
                    console.log('登录失败！' + res.errMsg)
                }
            }
        });
    },

    goMyOrder() {
        if (!wx.getStorageSync('token')) {
            wx.navigateTo({
                url: '/pages/login/login',
            });
            return;
        }
        wx.navigateTo({ url: '/pages/order/list/list' });
    },

    goMyService() {
        wx.navigateTo({
            url: '/pages/my/service/service'
        });
    },

    goMyCoupon() {
        if (!wx.getStorageSync('token')) {
            wx.navigateTo({
                url: '/pages/login/login',
            });
            return;
        }
        wx.navigateTo({
            url: `/pages/my/coupon/coupon?type=2`
        })
    },

    doRightNow(e) {
        const {
            currentTarget: {
                dataset: {
                    item: {
                        order = {}
                    } = {}
                } = {}
            } = {}
        } = e;
        console.log(order, '@@@order');
        wx.showModal({
            content: `您是否在「${order.storeName}」自助咖啡机前面？ 如果不在，咖啡可能会被别人取走哟`, //提示的内容,
            showCancel: true, //是否显示取消按钮,
            cancelColor: '#9A9A9A', //取消按钮的文字颜色,
            cancelText: '暂不制作',
            confirmText: '确定', //确定按钮的文字，默认为取消，最多 4 个字符,
            confirmColor: '#F12B23', //确定按钮的文字颜色
            success: res => {
                if (res.confirm) {
                    model(`order/detail/make-drinks`, {
                        id: order.id
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
                                this.getTodoOrderList();
                            }, 1500);
                        }
                    }).catch(e => {
                        console.log(e, '@@@更酷咖啡机报错')
                        this.setData({
                            modalNewContent: e,
                            showNewModal: true
                        });
                        // wx.showModal({
                        //     title: '提示',
                        //     content: `物料不足，制作失败，10分钟内自动退款\r\n${e}`, //提示的内容,
                        //     showCancel: false, //图标,
                        //     confirmText: '确定', //延迟时间,
                        //     confirmColor: '#F12B23',
                        //     success: res => {
                        //         if (res.confirm) {
                        //             this.getTodoOrderList();
                        //         }
                        //     }
                        // });
                    })
                }
            }
        })

    },

    dealNewModalFunction() {
        this.getTodoOrderList();
    },

    goWheel() {
        if (!wx.getStorageSync('token')) {
            wx.navigateTo({
                url: '/pages/login/login',
            });
            getApp().globalData.fromWheel = true;
            return;
        }
        wx.navigateTo({
            url: '/package/wheel/pages/index/index'
        });
    },

    openDevByMultyClick() {
        this.clickNum = this.clickNum || 0;
        ++this.clickNum;
        console.log(this.clickNum);

        if (!this.setTimeoutNum) {
            this.setTimeoutNum = setTimeout(() => {
                this.clickNum = 0;
                clearTimeout(this.setTimeoutNum);
                this.setTimeoutNum = 0;
            }, 1000);
        }

        if (this.clickNum > 5) {
            wx.navigateTo({
                url: '/pages/devtools/index',
            });
        }
    },
})
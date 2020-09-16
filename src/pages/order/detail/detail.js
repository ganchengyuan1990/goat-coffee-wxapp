// pages/order/detail.js
import model from '../../../utils/model.js';
const QR = require('../../../utils/weapp-qrcode.js')

// const requestJason = require('../../../utils/request.js');
import {
    simpleFormatTime,
    formatTime
} from '../../../utils/util';


Page({

    /**
     * 页面的初始数据
     */
    data: {
        detail: {},
        dtype: '',
        waitTime: '',
        id: '',
        orderClassify: '',
        showDialog: false,
        actImage: 'http://img.goatup.net/image/gzh/gzhtanchuang.png',
        enableOrderActivity: false,
        clockWord: '',
        errorToastShown: '',
        errorInfo: {},
        overtime: false,
        lalaName: '优惠券',
        otherLalaName: [],
        cancled: false,
        fromPay: false,
        qrcodeURL: ''
    },


    onUnload: function() {
        // 页面关闭
        getApp().globalData.fromPaySuccess = true;
        if (this.data.fromPay) {
            wx.reLaunch({
                url: '/pages/store/store?from=pay_success'
            })
        }
        clearInterval(this.clearLll);
    },

    onPullDownRefresh() {
        this.getDetailInfo();
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        // let data = decodeURIComponent(options.data)
        let id = options.id
        let orderClassify = options.orderClassify
        if (id && orderClassify) {
            // this.formatData(data)
            this.setData({
                id: id,
                orderClassify: orderClassify,
                fromPay: Boolean(options.showDialog)
            });
            model('base/site/user-config-list').then(res => {
                this.setData({
                    enableOrderActivity: res.data['enable-order-activity']
                });
                const configData = wx.getStorageSync('configData');
                const enableOrderActivity = wx.getStorageSync('enable-order-activity');
                if (enableOrderActivity) {
                    this.setData({
                        actImage: configData['order-activity'].modal_pic,
                        showDialog: Boolean(options.showDialog)
                    });
                    wx.removeStorageSync('enable-order-activity');
                }
            });
            model(`order/detail/detail?orderClassify=${this.data.orderClassify}&id=${this.data.id}`).then(res => {
                let result = res.data.order;
                result.detailList = res.data.order_detail;
                result.dtype = 'order'
                if (result.orderState == '100' && result.isComment) {
                    result.orderState = '101'
                }
                if (result.deliveryStarttime) {
                    result.deliveryTimeStr = formatTime(new Date(new Date('2019-01-01 11:23:45').getTime() + 1800 * 1000))
                    console.log(result.deliveryTimeStr)
                }
                this.formatData(result)
                if (result.orderState == '00') {
                    result.CreateTime = result.CreateTime.replace(/-/g, "/");
                    let time = (new Date(result.CreateTime).getTime() - new Date().getTime()) / 1000;

                    time = parseInt(time) + 1800;
                    console.log(new Date(result.CreateTime), new Date().getTime(), '镇哥看这儿77')
                    if (time < 0) {
                        this.setData({
                            overtime: true
                        })
                        return;
                    }
                    setInterval(() => {
                        if (time >= 0) {
                            let clockWord = this.setClock(time);
                            time -= 1;
                            this.setData({
                                clockWord: clockWord
                            })
                        } else {
                            this.setData({
                                overtime: true,
                                clockWord: ''
                            })
                        }
                    }, 1000);


                }

                model(`home/lbs/get-wait-time?storeId=${this.data.detail.storeId}`).then(res => {
                    let waitProcessTime = res.data.waitTime;
                    let targetTime = simpleFormatTime(new Date(new Date().getTime() + waitProcessTime * 60 * 1000))
                    console.log(targetTime);
                    this.setData({
                        waitTime: targetTime
                    });
                }).catch(e => {
                    console.log(e)
                })
            }).catch(e => {
                console.log(e)
            })

            this.clearLll = setInterval(() => {
                this.getDetailInfo();
            }, 20000);
        } else {
            // wx.showModal({
            //   title: '提示',

            // })
        }
    },

    getDetailInfo() {
        model(`order/detail/detail?orderClassify=${this.data.orderClassify}&id=${this.data.id}`).then(res => {
            let result = res.data.order;
            result.detailList = res.data.order_detail;
            result.dtype = 'order'
            if (result.orderState == '100' && result.isComment) {
                result.orderState = '101'
            }
            if (result.deliveryStarttime) {
                result.deliveryTimeStr = formatTime(new Date(new Date('2019-01-01 11:23:45').getTime() + 1800 * 1000))
                console.log(result.deliveryTimeStr)
            }
            this.formatData(result)
            if (result.orderState == '00') {
                result.CreateTime = result.CreateTime.replace(/-/g, "/");
                let time = (new Date(result.CreateTime).getTime() - new Date().getTime()) / 1000;

                time = parseInt(time) + 1800;
                console.log(new Date(result.CreateTime), new Date().getTime(), '镇哥看这儿77')
                if (time < 0) {
                    this.setData({
                        overtime: true
                    })
                    return;
                }
                setInterval(() => {
                    if (time >= 0) {
                        let clockWord = this.setClock(time);
                        time -= 1;
                        this.setData({
                            clockWord: clockWord
                        })
                    } else {
                        this.setData({
                            overtime: true,
                            clockWord: ''
                        })
                    }
                }, 1000);


            }

            model(`home/lbs/get-wait-time?storeId=${this.data.detail.storeId}`).then(res => {
                let waitProcessTime = res.data.waitTime;
                let targetTime = simpleFormatTime(new Date(new Date().getTime() + waitProcessTime * 60 * 1000))
                console.log(targetTime);
                this.setData({
                    waitTime: targetTime
                });
            }).catch(e => {
                console.log(e)
            })
            wx.stopPullDownRefresh()
        }).catch(e => {
            console.log(e)
            wx.stopPullDownRefresh()
        })
    },

    goInvice(e) {
        let item = e.currentTarget.dataset.item;
        wx.setStorageSync('martsListArr', [{
            id: this.data.id,
            real_due: this.data.detail.payAmount
        }]);
        wx.navigateTo({
            url: `/package/invoice/pages/open/open`
        });
    },

    setClock(time) {
        let minute, second;
        minute = parseInt(time / 60);
        second = time - 60 * minute
        return `${minute}分钟${second}秒`
    },

    goCancel() {
        model(`order/detail/cancel`, {
            id: this.data.id
        }, 'POST').then(res_o => {
            if (res_o.code == 'suc') {
                this.setData({
                    //  errorToastShown: true,
                    //  errorInfo: '取消订单成功',
                    clockWord: '',
                    cancled: true,
                })

                wx.showToast({
                    title: '取消订单成功', //提示的内容,
                    icon: 'none', //图标,
                    duration: 2000, //延迟时间,
                    mask: true, //显示透明蒙层，防止触摸穿透,
                    success: res => {}
                });

                setTimeout(() => {
                    model(`order/detail/detail?orderClassify=${this.data.orderClassify}&id=${this.data.id}`).then(res => {
                        let result = res.data.order;
                        result.detailList = res.data.order_detail;
                        result.dtype = 'order'
                        this.formatData(result)
                    });
                }, 1500);
            }
        }).catch(e => {
            console.log(e)
        })
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

        getApp().globalData.configData = wx.getStorageSync('configData');
        this.setData({
            scoreTitle: getApp().globalData.configData['Points_deduction_pet_name'] || '',
        })

        console.log(this.data.detail.orderNo);
    },

    getWebsocket(order_num) {
        var self = this;
        // wx.vibrateShort({
        //   complete: () => {
        //     self.getDetailInfo();
        //   }
        // });
        if (this.data.vibrated) {
            return;
        }
        model(`order/detail/verification-code?order_num=${order_num}`).then(res => {
            wx.vibrateLong({
                success: () => {
                    self.setData({
                        vibrated: true
                    }, () => {
                        wx.showToast({
                            title: '核销成功', //提示的内容,
                            icon: 'none', //图标,
                            duration: 2000, //延迟时间,
                            mask: true, //显示透明蒙层，防止触摸穿透,
                            success: res => {
                                self.getDetailInfo();
                            }
                        });
                    })
                }
            });
        }).catch((e, data) => {
            console.log(e, data, '@@@');
            if (e.state == '02' || e.state == '03') {
                this.getWebsocket(order_num);
            }
        })
    },

    calGetTime(waitTime, number) {
        let nowTime = Date.parse(new Date());
        waitTime = waitTime + 5 + number;
        let getTime = this.calcLeftTime(nowTime + waitTime * 60 * 1000);
        return getTime;
    },

    calcLeftTime(time) {
        var timeStr = parseFloat(time);
        var left = parseInt((timeStr % 864e5) / 1000);
        var hours = parseInt(left / 3600);
        var realHours = hours + 8;
        if (realHours >= 24) {
            realHours = realHours - 24;
        }
        var minutes = parseInt((left - hours * 3600) / 60);
        var seconds = parseInt((left - hours * 3600 - minutes * 60));
        return `${realHours < 10 && realHours !== 8 ? ('0' + realHours) : (realHours)}:${minutes < 10 ? ('0' + minutes) : minutes}`;
    },
    formatData(data) {
        let detail = data;
        detail.xiguan = '不需要'
        if (detail.remarkJson) {
            detail.remarkJson = JSON.parse(detail.remarkJson)
            if (detail.remarkJson.xiguan) {
                detail.xiguan = '需要'
            }
        }
        // console.log(detail, 'data');
        let dtype = detail.dtype
        if (detail.couponType == 2) {
            this.setData({
                otherLalaName: [{
                    name: '优惠券',
                    money: 0
                }, {
                    name: '兑换券',
                    money: 0
                }, {
                    name: '满减券',
                    money: detail.discountAmount
                }]
            })
        } else if (detail.couponType == 5) {
            this.setData({
                otherLalaName: [{
                    name: '优惠券',
                    money: 0
                }, {
                    name: '兑换券',
                    money: detail.discountAmount
                }, {
                    name: '满减券',
                    money: 0
                }]
            })
        } else {
            this.setData({
                otherLalaName: [{
                    name: '优惠券',
                    money: detail.discountAmount
                }, {
                    name: '兑换券',
                    money: 0
                }, {
                    name: '满减券',
                    money: 0
                }]
            })
        }
        if (dtype === 'order') {
            let list = detail.detailList || []
            let number = 0;
            let totalPrice = 0;
            list.forEach(item => {
                item.spec = item.skuName + (item.props && `/${item.props}`)
                number += item.number;
                totalPrice += item.number * (item.skuPrice || item.skuSalePrice);
            })
            detail.totalPrice = (totalPrice == parseInt(totalPrice) ? parseInt(totalPrice) : parseFloat(totalPrice).toFixed(2))
            detail.payAmount = (detail.payAmount == parseInt(detail.payAmount) ? parseInt(detail.payAmount) : parseFloat(detail.payAmount).toFixed(2))
            let guaerItems = detail.guaerItems || [];
            var imgData = QR.drawImg(detail.orderNo, {
                typeNumber: 4,
                errorCorrectLevel: 'M',
                size: 500
            })
            if ((detail.orderState == '02' || detail.orderState == '03')) {
                // if ((detail.orderState == '02' || detail.orderState == '03') && wx.getStorageSync('env') !== 'dev' && wx.getStorageSync('env') !== 'test') {
                this.getWebsocket(detail.orderNo);
            }
            this.setData({
                guaerItems: guaerItems || [],
                dtype: 'order',
                detail: detail,
                lineNumber: this.calGetTime(detail['line_number'], number),
                qrcodeURL: imgData
            })
        }
        if (dtype === 'group') {

            this.setData({
                dtype: 'group',
                detail: detail
            })
        }

    },
    // fetchOrderDetail() {
    //   model('/order/detail/detail', {
    //     orderClassify:2,
    //     id: 122
    //   }).then(res => {

    //   })
    // },

    getGifts() {
        model(`home/lbs/get-wait-time?storeId=${this.data.detail.storeId}`).then(res => {
            let waitProcessTime = res.data.waitTime;
            let targetTime = simpleFormatTime(new Date(new Date().getTime() + waitProcessTime * 60 * 1000))
            console.log(targetTime);
            this.setData({
                waitTime: targetTime
            });
        }).catch(e => {
            console.log(e)
        })
    },

    goRedPack() {
        wx.navigateTo({
            url: `/pages/pay/share_success/share_success?orderId=${this.data.detail.id}`
        });
    },

    goStore(e) {
        let userInfo = this.data.userInfo
        let target = 'pay/wx/wx-pre-pay'
        model(target, {
            openId: wx.getStorageSync('openid'),
            orderNo: this.data.id
                // orderMsg: ''
        }, 'POST').then(res => {
            let obj = res.data
            if (!obj.paySign) {
                // show model
                return
            }
            let prepayId = obj.package.split('=')[1]
            obj.msg = 'suc'
            obj.package = prepayId
            obj.prepayId = prepayId
            obj.price = this.data.detail.payAmount
            obj.varCode = obj.order.verify_code
            obj.order = this.data.id
                // let str = Object.entries(obj).map(i => `${i[0]&i[1]}`).join('&')
            let str = Object.entries(obj).reduce((acc, arr) => acc + '&' + arr.join('='), '')
            str = str.slice(1)
            if (this.data.detail.storeCoffeeMakerId) {
                str += '&coffeeMaker=1'
            }

            // console.log(str);
            // return
            wx.navigateTo({
                url: `/pages/pay/normalPay/normalPay?${str}`
            })
        }).catch(e => {
            // show model
            wx.showToast({
                title: '支付失败', //提示的内容,
                icon: 'none', //图标,
                duration: 2000, //延迟时间,
                mask: true, //显示透明蒙层，防止触摸穿透,
                success: res => {}
            });
        })
    },

    goVarcode() {
        wx.navigateTo({
            url: `/pages/order/varcode/detail?orderNo=${this.data.detail.orderNo}&varCode=${this.data.detail.varCode}`
        });
    },

    goComment() {
        wx.navigateTo({
            url: `/package/orderComment/pages/comment/remark?orderId=${this.data.detail.id}`
        });
    },

    previewImage: function(e) {
        var current = e.target.dataset.src;
        // wx.previewImage({
        //   current: current,
        //   urls: [current]
        // })
        wx.navigateTo({
            url: `/pages/my/coupon/coupon?type=2`
        })
    },

    hideActWrap() {
        this.setData({
            showDialog: false
        })
    },

    dealNewModalFunction() {
        this.getDetailInfo();
    },

    doRightNow() {
        wx.showModal({
            content: `您是否在「${this.data.detail.storeName}」自助咖啡机前面？ 如果不在，咖啡可能会被别人取走哟`, //提示的内容,
            showCancel: true, //是否显示取消按钮,
            cancelColor: '#9A9A9A', //取消按钮的文字颜色,
            cancelText: '暂不制作',
            confirmText: '确定', //确定按钮的文字，默认为取消，最多 4 个字符,
            confirmColor: '#F12B23', //确定按钮的文字颜色
            success: res => {
                if (res.confirm) {
                    model(`order/detail/make-drinks`, {
                        id: this.data.detail.id
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
                                this.getDetailInfo()
                            }, 1500);
                        }
                    }).catch(e => {
                        console.log(e, '@@@更酷咖啡机报错')
                        this.setData({
                            modalNewContent: e,
                            showNewModal: true
                        });
                        // wx.showModal({
                        //   title: '提示',
                        //   content: `物料不足，制作失败，10分钟内自动退款\r\n${e}`, //提示的内容,
                        //   showCancel: false, //图标,
                        //   confirmText: '确定', //延迟时间,
                        //   confirmColor: '#F12B23',
                        //   success: res => {
                        //     if (res.confirm) {
                        //       this.getDetailInfo()
                        //     }
                        //   }
                        // });
                    })
                }
            }
        })

    },
})
// var util = require('../../../utils/util.js');
// var api = require('../../../config/api.js');
// const pay = require('../../../services/pay.js');
import { wx2promise, showErrorToast } from '../../../utils/util';

import model from '../../../utils/model';

import {
    BigNumber
} from '../../../utils/bignumber.min';



var app = getApp();
let isOpening = false

Page({
    data: {
        showMemberMoney: true,
        checkedGoodsList: [],
        useScoreFlag: true,
        zunshou: true,
        checkedAddress: {
            name: 'Jason',
            phone: 17602183915,
            region: '是滴是滴所多',
            address: 'sdsdsdsd'
        },
        showScoreToast: false,
        noUsePointsWord: '',
        checkedCoupon: [],
        // couponList: [],
        redPackList: [],
        couponRedpack: [],
        goodsTotalPrice: 0.00, //商品总价
        freightPrice: 0.00, //快递费
        couponPrice: 0.00, //优惠券的价格
        orderTotalPrice: 0.00, //订单总价
        actualPrice: 0.00, //实际需要支付的总价
        actualPriceGap: 0.00,
        actualOriginalPrice: 0.00,
        addressId: 0,
        couponId: 0,
        scoreMention: '使用10积分抵扣¥10',
        chooseSelf: true,
        chooseExpress: false,
        chooseDaodian: false,
        chooseCup: false,
        options: {},
        transportFee: 0,
        couponMoney: 0,
        errorToast: false,
        toastInfo: '',
        product: [],
        payAmount: 0,
        discountType: 1,
        couponUserRelation: '',
        checkedExpress: {},
        deliverFee: 0,
        couponList: [],
        voucherList: [],
        chosenCoupon: -1,
        chosenVoucher: -1,
        chosenRedPack: -1,
        chooseType: -1,
        goBackFromChildPage: false,
        goBackFromRemark: false,
        fromAddress: false,
        chosenInfo: {},
        chooseNoCoupon: true,
        chooseNoVoucher: true,
        chooseNoRedPack: true,
        chooseItemXiguan: -1,
        tab: '',
        remark: '',
        userAddressId: 0,
        getTime: '',
        waitProcessTime: '',
        fromTransportIndex: -1,
        fromTransportId: -1,
        timeWords: '',
        type: 0,
        usePromotion: true,
        hasGetBestSolution: false,
        quanqianMoney: 0,
        showCouponMention: false,
        resultPrice: -1,
        currentSpecific: {},
        isCatePanelShow: false,
        addPriceGoods: [],
        distance: -1,
        addPriceIds: '',
        initProduct: [],
        levelMoney: 0,
        member_recharge: 0,
        useMemberReharge: false,
        actualAfterMemberPrice: 0,
        showNoOrder: false,
        deliverMention: '',
        guaerItems: [],
        zidaibeiMoney: 5,
        animated: false,
        bestCouponArr: [],
        toastTime: 3,
        scrollTop: 0,
        viewToNav: '',
        isCoffeeMaker: false
    },

    showYouGuessItem() {
        this.setData({
            isCatePanelShow: true,
            currentSpecific: {}
        });
    },

    addPriceBuy(e) {
        console.log(e);
        let {
            addPriceIds,
            options,
            product
        } = this.data;
        let addPriceIdsArr = [];
        if (addPriceIds) {
            addPriceIdsArr = addPriceIds.split(',');
        }
        let newOptions = Object.assign({}, options);
        let target = e.detail.addPrice.id;
        let newProduct = {
            banner: e.detail.banner,
            number: 1,
            totalPrice: e.detail.addPrice.coupon.jiagou_price == parseInt(e.detail.addPrice.coupon.jiagou_price) ? parseInt(e.detail.addPrice.coupon.jiagou_price) : parseFloat(e.detail.addPrice.coupon.jiagou_price).toFixed(2),
            productId: 2,
            productName: e.detail.productName,
            // productPropIds: "182,184",
            // skuId: 151,
            skuName: "冷",
            spec: e.detail.default_prop.value.join('/'),
        }
        product.push(newProduct);
        newOptions.product.push(newProduct);
        addPriceIdsArr.push(target);
        let _a = new BigNumber(this.data.actualPrice);
        let _b = new BigNumber(newProduct.totalPrice);
        let actualPrice = _a.plus(_b);
        this.setData({
            product: product,
            options: newOptions,
            actualPrice: actualPrice.toFixed(2),
            addPriceIds: addPriceIdsArr.join(',')
        }, () => {
            this.setData({
                actualAfterMemberPrice: this.data.member_recharge > this.data.actualPrice ? 0 : (this.data.actualPrice - this.data.member_recharge),
                actualOriginalPrice: this.data.actualPriceGap + this.data.actualPrice
            })
        })
    },

    toggleSpecific() {
        if (isOpening) {
            return
        }
        isOpening = true
        let isShow = this.data.isCatePanelShow
        if (isShow) {
            isOpening = false;
            this.setData({
                isCatePanelShow: !isShow
            })
        } else {
            this.setData({
                    isCatePanelShow: !isShow
                })
                // for temp 
            setTimeout(() => {
                isOpening = false
            }, 500);
        }
    },

    onClickStore() {
        wx.switchTab({ url: '/pages/store/store' });
    },

    switchChange(e) {
        this.setData({
            usePromotion: e.detail.value
        });
        let userCouponIds = []
        this.data.chosenInfo.content && this.data.chosenInfo.content.map(item => {
            userCouponIds.push(item.relationId)
            return item;
        });
        const _param = {
            // couponList: [],
            // productList: this.data.product,
            storeId: this.data.options.storeId,
            uid: wx.getStorageSync('token').user.id,
            userCouponIds: this.data.chosenInfo.type ? userCouponIds[0].id : '',
            mockCarts: this.parseProductsParam(),
            useCart: Number(!this.data.goDirect),
        };
        if (this.data.chosenInfo.type) {
            if (this.data.chosenInfo.user_coupon_source == 1) {
                _param.userCouponIds = userCouponIds[0].id
            } else {
                _param.couCodes = userCouponIds[0].id
                _param.userCouponIds = '';
            }
        }
        if (!this.data.usePromotion) {

            if (getApp().globalData.pointBalance) {
                param.pointBalance = getApp().globalData.pointBalance
            }

            model(`home/coupon/calculate-price-with-ded-coupon`, _param).then(data => {
                let result = parseFloat(data.data.discountMoney || 0).toFixed(2);
                let pointDiscountMoney = parseFloat(data.data.pointDiscountMoney || 0).toFixed(2);
                pointDiscountMoney = pointDiscountMoney == parseInt(pointDiscountMoney) ? parseInt(pointDiscountMoney) : (parseFloat(pointDiscountMoney) == parseFloat(pointDiscountMoney).toFixed(1) ? parseFloat(pointDiscountMoney).toFixed(1) : pointDiscountMoney);
                let levelMoney = parseFloat(data.data.levelMoney).toFixed(2);
                this.setData({
                    actualPrice: parseFloat(data.data.resultPrice + parseFloat(this.data.deliverFee)).toFixed(2),
                    couponMoney: result,
                    pointDiscountMoney,
                    scoreMention: `使用${pointDiscountMoney}积分抵扣¥${pointDiscountMoney}`,
                    levelMoney: levelMoney && levelMoney !== 'NaN' ? levelMoney : 0,
                    couponUserRelation: '',
                    discountType: data.data.type,
                    chosenInfo: {},
                    chooseNoCoupon: false,
                    chooseNoVoucher: false,
                    chooseNoRedPack: false,
                }, () => {
                    this.setData({
                        actualAfterMemberPrice: this.data.member_recharge > this.data.actualPrice ? 0 : (this.data.actualPrice - this.data.member_recharge),
                        actualOriginalPrice: this.data.actualPriceGap + this.data.actualPrice
                    })
                })
            }).catch(e => {
                if (e == '未找到对应的积分奖励配置信息') {
                    this.setData({
                        pointDiscountMoney: 0,
                        noUsePointsWord: '当前积分不可用',
                    })
                }
            });

        } else {
            this.getBestCouponByProduct();
        }
    },
    onLoad: function(options) {
        console.log(options, 999);
        model('base/site/user-config-list').then(res => {
            wx.setStorageSync('userConfigList', res.data)
        })
        if (wx.getStorageSync('deliverMention')) {
            this.setData({
                deliverMention: wx.getStorageSync('deliverMention')
            });
        }

        // options.tab = 'delivery';

        wx.showLoading({
            title: '加载中', //提示的内容,
            mask: true, //显示透明蒙层，防止触摸穿透,
        });

        this.dealOptions(options);

        if (!this.data.hasGetBestSolution) {
            this.getBestCouponByProduct();
        }

        this.getAddressList();

        this.getAvailableCoupon();
        this.getWaitTime();
        this.getAddPriceGoods()
            // this.setData({
            //   goodsTotalPrice: parseInt(options.price)
            // })

        this.setDistance()

        // 页面初始化 options为页面跳转所带来的参数

        try {
            var addressId = wx.getStorageSync('addressId');
            if (addressId) {
                this.setData({
                    'addressId': addressId
                });
            }

            var couponId = wx.getStorageSync('couponId');
            if (couponId) {
                this.setData({
                    'couponId': couponId
                });
            }
        } catch (e) {
            // Do something when catch error
        }


    },

    setDistance() {
        let STORE_INFO = wx.getStorageSync('STORE_INFO');
        if (STORE_INFO) {
            STORE_INFO = JSON.parse(STORE_INFO)
            this.setData({
                machine_type: STORE_INFO.machine_type,
                distance: STORE_INFO.distance,
                lineNumber: STORE_INFO['line_number'],
            })
        }
    },

    parseProductsParam() {
        let result = JSON.parse(JSON.stringify(this.data.options.product))
        result.forEach(item => {
            if (item.productPropIds) {
                item.rGoodsPropIds = item.productPropIds.split(',');
            }
            if (item.rPropGoodsIds) {
                item.rGoodsPropIds = item.rPropGoodsIds.split(',');
            }
        });
        return result;
    },

    getAddPriceGoods() {

        model('order/detail/add-price-goods', {
            useCart: Number(!this.data.goDirect),
            mockCarts: this.parseProductsParam(),
            storeId: this.data.options.storeId
                // openid: wx.getStorageSync('openid')
        }).then(res => {
            if (res.code === 'suc') {
                this.setData({
                    addPriceGoods: res.data.addPriceGoods
                })
            }
        })
    },

    checkedItem(e) {
        let index = e.currentTarget.dataset.index;
        if (index == 2) {
            this.setData({
                chooseItemXiguan: true
            })
        } else {
            this.setData({
                chooseItemXiguan: false
            })
        }
    },

    calGetTime(waitTime) {

        let nowTime = Date.parse(new Date());
        if (this.data.checkedAddress.coffeeMakerId) {
            waitTime = 1;
        } else {
            waitTime = waitTime + 5 + this.data.totalNumber;
        }
        let getTime = this.calcLeftTime(nowTime + waitTime * 60 * 1000);
        this.setData({
            getTime: getTime
        })
        console.log(getTime);
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

    getAddressList() {
        model('my/address/list', {
            userId: wx.getStorageSync('token').user.id,
            // openid: wx.getStorageSync('openid')
        }).then(data => {
            if (data.data) {
                let list = data.data;
                wx.setStorageSync('addressList', list);
                let checkedExpress = list[this.data.fromTransportIndex || 0]
                if (this.data.fromTransportId > 0) {
                    let chosenAddressItem = list.filter(item => {
                        return item.id === this.data.fromTransportId;
                    });
                    if (chosenAddressItem && chosenAddressItem[0]) {
                        checkedExpress = chosenAddressItem[0];
                    }
                }
                if (this.data.fromAddress) {
                    checkedExpress = list[this.data.fromTransportIndex || 0]
                }
                this.setData({
                    checkedExpress: checkedExpress || {}
                });
            }
        })
    },

    getAvailableCoupon() {
        model(`home/coupon/get-available-ded-coupon`, {
            useCart: Number(!this.data.goDirect),
            mockCarts: this.parseProductsParam(),
            uid: wx.getStorageSync('token').user.id,
            // storeId: 23
            storeId: this.data.options.storeId
                // list: [{
                //   "productId": 28,
                //   "skuId": 121,
                //   "num": 1
                // }]
        }).then(data => {
            let a = new BigNumber(2048.8);
            let b = a.times(100);
            console.log(data.data, '锐');
            try {
                if (data.data) {
                    // let result = data.data.coupons;
                    let result = data.data.userCoupons;
                    let couponList = result.filter(item => {
                        return item.coupon.coupon_type !== 5 && item.coupon.coupon_type !== 2 && item.coupon.coupon_type !== 11;
                    });
                    let voucherList = result.filter(item => {
                        return item.coupon.coupon_type === 5;
                    });
                    let redPackList = result.filter(item => {
                        return item.coupon.coupon_type === 2 || item.coupon.coupon_type === 11;
                    });

                    const pointBalance = data.data.point_balance || 0;

                    getApp().globalData.pointBalance = pointBalance;

                    let noUsePointsWord = pointBalance < 0 ? '当前积分不可用' : '积分不足'

                    if (!result[0]) {
                        this.setData({
                            pointBalance,
                            noUsePointsWord
                        })
                        return;
                    }

                    const _type = result[0].coupon.coupon_type;
                    // let voucherList = result;

                    let _chosenInfo = {
                        content: []
                    }

                    if (_type === 2 || _type === 11) {
                        _chosenInfo = {
                            content: [{
                                id: redPackList[0].id,
                                relationId: redPackList[0].id,
                                type: 3
                            }],
                            type: 3,
                            user_coupon_source: redPackList[0].user_coupon_source
                        }
                    } else if (_type === 5) {
                        _chosenInfo = {
                            content: [{
                                id: voucherList[0].id,
                                relationId: voucherList[0].id,
                                type: 2
                            }],
                            type: 2,
                            user_coupon_source: voucherList[0].user_coupon_source

                        }
                    } else {
                        _chosenInfo = {
                            content: [{
                                id: couponList[0].id,
                                relationId: couponList[0].id,
                                type: 1
                            }],
                            type: 1,
                            user_coupon_source: couponList[0].user_coupon_source

                        }
                    }



                    // const _chosenInfo = voucherList && voucherList.length > 0 ? {
                    //   content: [{
                    //     id: voucherList[0].couCode,
                    //     relationId: voucherList[0].couCode,
                    //     type: 3
                    //   }],
                    //   type: 3
                    // } : {
                    //   content: []
                    // }
                    console.log(_chosenInfo, '锐3');
                    this.setData({
                        voucherList,
                        couponList,
                        pointBalance,
                        redPackList,
                        chosenInfo: _chosenInfo,
                        noUsePointsWord,
                    })


                } else {

                }
            } catch (e) {
                console.log(e, 'getAvailableCoupon');
            }

            wx.hideLoading({
                title: '加载中', //提示的内容,
                mask: true, //显示透明蒙层，防止触摸穿透,
            });
        }).catch(e => {
            wx.hideLoading();
        })
    },

    getBestCouponByProduct() {

        model(`home/coupon/get-available-ded-coupon`, {
            useCart: Number(!this.data.goDirect),
            mockCarts: this.parseProductsParam(),
            uid: wx.getStorageSync('token').user.id,
            // storeId: 23
            storeId: this.data.options.storeId
        }).then(data => {
            if (data.data) {
                // let result = parseFloat(data.data.discountMoney).toFixed(2);
                // let result = parseFloat(data.data.discountMoney).toFixed(2);
                // let levelMoney = parseFloat(data.data.levelMoney).toFixed(2);
                // let _a = new BigNumber(this.data.payAmount);
                // let _b = new BigNumber(this.data.chooseSelf ? 0 : this.data.deliverFee);
                // let actualPrice = _a.plus(_b).minus(result);
                // let actualPrice = _a.plus(_b).minus(parseFloat(result));

                // let couponArr = data.data.coupons;
                // let couponArr = data.data.userCoupons;
                // let couponUserRelation = []

                // this.setData({
                //   bestCouponArr: couponArr,
                //   zidaibeiMoney: parseFloat(data.data.zidaiOrderCouponMoney).toFixed(2) || 5
                // })

                // let {
                //   couponList,
                //   voucherList,
                //   redPackList
                // } = this.data;

                // couponUserRelation = couponUserRelation.join(',');
                // if (data.data.type === 2) {
                //   this.setData({
                //     chooseNoCoupon: true,
                //     chooseNoVoucher: true,
                //     chosenRedPack: couponArr[0].couCode,
                //     chosenInfo: {
                //       content: [{
                //         id: couponArr[0].couCode,
                //         relationId: couponArr[0].couCode,
                //         type: 3
                //       }],
                //       type: 3
                //     }
                //   })
                // } else if (true) {
                //   let contents = [];
                //   couponArr.forEach(item => {
                //     contents.push({
                //       id: item.couCode,
                //       relationId: item.couCode,
                //       type: 2
                //     })
                //   });
                //   this.setData({
                //     chooseNoRedPack: true,
                //     chooseNoCoupon: true,
                //     chosenVoucher: couponUserRelation,
                //     chosenInfo: {
                //       content: contents,
                //       type: 2
                //     }
                //   })
                // } else {
                //   let contents = [];
                //   couponArr.forEach(item => {
                //     contents.push({
                //       id: item.classId,
                //       relationId: item.id,
                //       type: 1
                //     })
                //   });
                //   this.setData({
                //     chooseNoRedPack: true,
                //     chooseNoCoupon: true,
                //     chosenVoucher: couponUserRelation,
                //     chosenInfo: {
                //       content: contents,
                //       type: 1
                //     }
                //   })
                // } 
                // let deliverFee = this.data.chooseExpress ? this.data.deliverFee : 0;
                // if (!this.data.chooseCup) {
                //   actualPrice = data.data.resultPrice == parseInt(data.data.resultPrice) ? parseInt(data.data.resultPrice) : parseFloat(data.data.resultPrice).toFixed(2)
                // } else {
                //   actualPrice = data.data.resultPrice == parseInt(data.data.resultPrice) ? parseInt(data.data.resultPrice - this.data.zidaibeiMoney) : parseFloat(data.data.resultPrice - this.data.zidaibeiMoney).toFixed(2)
                // }
                // if (actualPrice < 0) {
                //   actualPrice = 0;
                // }
                // actualPrice += deliverFee;
                // data.data.guaerItems && data.data.guaerItems.map(item => {
                //   item.sku.sale_price = parseInt(item.sku.sale_price)
                //   return item;
                // })
                // this.setData({
                //   levelMoney: levelMoney && levelMoney !== 'NaN' ? levelMoney : 0,
                //   couponMoney: result && result !== 'NaN' ? result : 0,
                //   hasGetBestSolution: true,
                //   actualPrice: actualPrice,
                //   discountType: data.data.type,
                //   couponUserRelation: couponUserRelation,
                //   // quanqianMoney: data.data.resultPrice + data.data.discountMoney,
                //   guaerItems: data.data.guaerItems || []
                // }, () => {
                //   this.setData({
                //     actualOriginalPrice: parseFloat(this.data.actualPriceGap) + parseFloat(this.data.actualPrice)
                //   })
                // });
                // if (this.data.quanqianMoney > 65) {
                //   this.setData({
                //     deliverFee: 0
                //   });
                // }
                let result = data.data.userCoupons;

                let couponList = result.filter(item => {
                    return item.coupon.coupon_type !== 5 && item.coupon.coupon_type !== 2 && item.coupon.coupon_type !== 11;
                });
                let voucherList = result.filter(item => {
                    return item.coupon.coupon_type === 5;
                });
                let redPackList = result.filter(item => {
                    return item.coupon.coupon_type === 2 || item.coupon.coupon_type === 11;
                });

                // data.data.point_balance = 0;

                const pointBalance = data.data.point_balance || 0;

                getApp().globalData.pointBalance = pointBalance;

                let noUsePointsWord = pointBalance < 0 ? '当前积分不可用' : '积分不足'


                if (!result[0]) {
                    this.setData({
                        pointBalance,
                        noUsePointsWord
                    })
                    this.dealChildPageInfo();
                    wx.hideLoading();
                    return;
                }

                const _type = result[0].coupon.coupon_type;
                // let voucherList = result;

                let _chosenInfo = {
                    content: []
                }

                if (_type === 2 || _type === 11) {
                    _chosenInfo = {
                        content: [{
                            id: redPackList[0].id,
                            relationId: redPackList[0].id,
                            type: 3
                        }],
                        type: 3,
                        user_coupon_source: redPackList[0].user_coupon_source

                    }
                    this.setData({
                        chooseNoCoupon: true,
                        chosenNoVoucher: true,
                        chosenRedPack: redPackList[0].id
                    })
                } else if (_type === 5) {
                    _chosenInfo = {
                        content: [{
                            id: voucherList[0].id,
                            relationId: voucherList[0].id,
                            type: 2
                        }],
                        type: 2,
                        user_coupon_source: voucherList[0].user_coupon_source

                    }
                    this.setData({
                        chooseNoCoupon: true,
                        chosenNoRedPack: true,
                        chosenVoucher: voucherList[0].id
                    })
                } else {
                    _chosenInfo = {
                        content: [{
                            id: couponList[0].id,
                            relationId: couponList[0].id,
                            type: 1
                        }],
                        type: 1,
                        user_coupon_source: couponList[0].user_coupon_source

                    }
                    this.setData({
                        chosenNoVoucher: true,
                        chosenNoRedPack: true,
                        chosenCoupon: couponList[0].id
                    })
                }


                this.setData({
                    voucherList,
                    pointBalance,
                    couponList,
                    redPackList,
                    chosenInfo: _chosenInfo,
                    noUsePointsWord
                })
            } else {
                let _a = new BigNumber(this.data.payAmount);
                let _b = new BigNumber(this.data.chooseSelf ? 0 : this.data.options.deliverFee);
                let actualPrice = _a.plus(_b);
                if (!this.data.chooseCup) {
                    actualPrice = data.data.resultPrice == parseInt(data.data.resultPrice) ? parseInt(data.data.resultPrice) : parseFloat(data.data.resultPrice).toFixed(2)
                } else {
                    actualPrice = data.data.resultPrice == parseInt(data.data.resultPrice) ? parseInt(data.data.resultPrice - this.data.zidaibeiMoney) : parseFloat(data.data.resultPrice - this.data.zidaibeiMoney).toFixed(2)
                }
                if (actualPrice < 0) {
                    actualPrice = 0
                }
                this.setData({
                    actualPrice: actualPrice,
                    discountType: 0
                }, () => {
                    this.setData({
                        actualAfterMemberPrice: this.data.member_recharge > this.data.actualPrice ? 0 : (this.data.actualPrice - this.data.member_recharge),
                        actualOriginalPrice: parseFloat(this.data.actualPriceGap) + parseFloat(this.data.actualPrice)
                    })
                })
            }
            this.dealChildPageInfo();
        }).catch(e => {
            if (e.errMsg && e.errMsg.indexOf('fail') > 0) {
                this.setData({
                    errorToast: true,
                    toastInfo: '暂无网络，请稍后重试'
                });
                setTimeout(() => {
                    this.setData({
                        errorToast: false
                    });
                }, 1500);
                wx.hideLoading();
            }
            let _a = new BigNumber(this.data.payAmount);
            let _b = new BigNumber(this.data.chooseSelf ? 0 : this.data.options.deliverFee);
            let actualPrice = _a.plus(_b);
            this.setData({
                actualPrice: parseFloat(actualPrice),
                discountType: 0
            }, () => {
                this.setData({
                    actualAfterMemberPrice: this.data.member_recharge > this.data.actualPrice ? 0 : (this.data.actualPrice - this.data.member_recharge),
                    actualOriginalPrice: parseFloat(this.data.actualPriceGap) + parseFloat(this.data.actualPrice)
                })
            })
        });
    },

    getWaitTime() {
        model(`home/lbs/get-wait-time`, {
            storeId: this.data.options.storeId,
        }).then(data => {
            let waitProcessTime = data.data.waitProcessTime;
            this.setData({
                waitProcessTime: waitProcessTime
            });
            this.calGetTime(data.data['line_number'] || 0);
        })
    },

    dealOptions(items) {
        // debugger
        if (items.data) {

            let options = JSON.parse(decodeURIComponent(items.data));
            // let transportFee = 0;
            // options.product.forEach(item => {
            //   transportFee += item.transportFee;
            // })
            let product = JSON.parse(JSON.stringify(options.product));
            let payAmount = 0;
            let memberPayAmount = 0
            let totalNumber = 0;
            product.forEach(item => {
                // item.pid = item.productId;
                // item.skuid = item.skuId;
                item.num = item.number;
                item.memberPrice = parseFloat(parseFloat(item.number * parseFloat(item.memberPrice).toFixed(2)).toFixed(2));
                item.totalPrice = parseFloat(parseFloat(item.number * parseFloat(item.price).toFixed(2)).toFixed(2));
                payAmount += parseFloat(item.totalPrice);
                memberPayAmount += parseFloat(item.memberPrice);
                totalNumber += item.number;
                // delete item.skuName;
                // delete item.totalPrice;
                // delete item.productName;
                // delete item.price;
                // delete item.number;
                // delete item.productPropIds;
            });
            options.product = JSON.parse(JSON.stringify(product));
            this.setData({
                goDirect: parseInt(items.goDirect || 0),
                actualPriceGap: parseFloat(payAmount - memberPayAmount).toFixed(2),
                options: options,
                product: product,
                payAmount: payAmount.toFixed(2),
                tab: items.tab,
                totalNumber: totalNumber,
                fromTransportIndex: parseInt(items.fromTransportIndex),
                fromTransportId: parseInt(items.fromTransportId),
                isCoffeeMaker: Boolean(items.isCoffeeMaker)
            });
            if (this.data.tab === 'delivery') {
                // this.chooseExpress(false);
                this.setData({
                    timeWords: '立即下单'
                });
            } else {
                this.setData({
                    timeWords: '立即下单'
                });
            }
        }
        if (wx.getStorageSync('STORE_INFO')) {
            this.setData({
                checkedAddress: JSON.parse(wx.getStorageSync('STORE_INFO'))
            })
        }
    },

    calcTotalWeight() {
        let cartInfo = wx.getStorageSync('chooseCartInfo');
        let total = 0;
        cartInfo.forEach(element => {
            total += parseFloat(element.weight) * parseFloat(element.number)
        });
        return Math.ceil(total);
    },

    chooseSelf(notFirstLoad) {
        let STORE_INFO = JSON.parse(wx.getStorageSync('STORE_INFO'))
        this.setData({
            chooseSelf: true,
            chooseExpress: false,
            chooseDaodian: false,
            chooseCup: false,
            deliverFee: 0,
            timeWords: '立即下单',
            // payAmount: !notFirstLoad ? parseFloat(this.data.payAmount).toFixed(2) : (parseFloat(this.data.payAmount) - parseFloat(this.data.deliverFee || this.data.options.deliverFee || STORE_INFO.deliverFee || 0)).toFixed(2)
            payAmount: !notFirstLoad ? parseFloat(this.data.payAmount).toFixed(2) : (parseFloat(this.data.payAmount) - parseFloat(this.data.deliverFee || 0)).toFixed(2)
        })
        this.getBestCouponByProduct();
        // this.dealChildPageInfo();
        this.getWaitTime();
    },

    chooseDaodian(notFirstLoad) {
        let STORE_INFO = JSON.parse(wx.getStorageSync('STORE_INFO'))
        this.setData({
            chooseDaodian: true,
            chooseExpress: false,
            chooseSelf: false,
            chooseCup: false,
            deliverFee: 0,
            timeWords: '立即下单',
            // payAmount: !notFirstLoad ? parseFloat(this.data.payAmount).toFixed(2) : (parseFloat(this.data.payAmount) - parseFloat(this.data.deliverFee || this.data.options.deliverFee || STORE_INFO.deliverFee || 0)).toFixed(2)
            payAmount: !notFirstLoad ? parseFloat(this.data.payAmount).toFixed(2) : (parseFloat(this.data.payAmount) - parseFloat(this.data.deliverFee || 0)).toFixed(2)
        })
        this.getBestCouponByProduct();
        this.getWaitTime();
    },

    chooseCup(notFirstLoad) {
        if (this.data.distance <= 800 && this.data.distance > 0) {
            let STORE_INFO = JSON.parse(wx.getStorageSync('STORE_INFO'))
            this.setData({
                chooseDaodian: false,
                chooseExpress: false,
                chooseSelf: false,
                chooseCup: true,
                deliverFee: 0,
                timeWords: '立即下单',
                // payAmount: !notFirstLoad ? parseFloat(this.data.payAmount).toFixed(2) : (parseFloat(this.data.payAmount) - parseFloat(this.data.deliverFee || this.data.options.deliverFee || STORE_INFO.deliverFee || 0)).toFixed(2)
                payAmount: !notFirstLoad ? parseFloat(this.data.payAmount).toFixed(2) : (parseFloat(this.data.payAmount) - parseFloat(this.data.deliverFee || 0) - parseFloat(this.data.zidaibeiMoney || 5)).toFixed(2)
            })
            this.getBestCouponByProduct();
            this.getWaitTime();
        }
    },

    chooseExpress(notFirstLoad, way) {
        let STORE_INFO = JSON.parse(wx.getStorageSync('STORE_INFO'))
        if (this.data.distance < 0) {
            this.setData({
                distance: STORE_INFO.distance
            })
        }
        if (way !== 'deliver') {
            if (STORE_INFO.distance <= 3000 && STORE_INFO.distance >= 0) {
                console.log(STORE_INFO.distance, 'STORE_INFO.distance')
                if (!this.data.deliverMention) {
                    this.setData({
                        deliverFee: 0
                    })
                } else {
                    console.log(this.data.options.deliverFee, 'this.data.options.deliverFee'),
                        console.log(STORE_INFO.deliverFee, 'STORE_INFO.deliverFee')
                    this.setData({
                        deliverFee: this.data.options.deliverFee || STORE_INFO.deliverFee || 0
                    })
                }
                this.setData({
                    chooseSelf: false,
                    chooseExpress: true,
                    chooseDaodian: false,
                    chooseCup: false,
                    timeWords: '立即下单',
                    payAmount: !notFirstLoad ? parseFloat(this.data.payAmount) : (parseFloat(this.data.payAmount) + parseInt(this.data.deliverFee || 0)).toFixed(2)
                        // payAmount: !notFirstLoad ? parseFloat(this.data.payAmount) : (parseFloat(this.data.payAmount) + parseInt(this.data.options.deliverFee || STORE_INFO.deliverFee || 0)).toFixed(2)
                });
                this.getBestCouponByProduct();

                // this.dealChildPageInfo();
                this.getWaitTime();
                this.checkTransportFee(STORE_INFO);
            }
        } else {
            if (wx.getStorageSync('chosenAddress')) {
                let chosenAddress = wx.getStorageSync('chosenAddress')
                model(`my/address/address-distance`, {
                        longitude: STORE_INFO.longitude,
                        latitude: STORE_INFO.latitude,
                        userAddressId: chosenAddress.id,
                    }).then(data => {
                        let distance = data.data.distance;
                        this.setData({
                            distance: distance
                        });
                        if (distance > 3000) {
                            this.chooseSelf(false);
                        }
                    })
                    // this.setData({
                    //   distance: chosenAddress.distance
                    // })
            }
        }


    },

    checkTransportFee(STORE_INFO) {
        let deliverFee = this.data.options.deliverFee || STORE_INFO.deliverFee || 0;
        let actualPrice = deliverFee + this.data.actualPrice;
        this.setData({
            deliverFee: deliverFee,
            actualPrice: actualPrice == parseInt(actualPrice) ? parseInt(actualPrice) : parseFloat(actualPrice).toFixed(2)
        }, () => {
            this.setData({
                actualOriginalPrice: parseFloat(this.data.actualPriceGap) + parseFloat(this.data.actualPrice)
            })
        });
    },
    // selectAddress() {
    //   wx.navigateTo({
    //     url: '/pages/address/address',
    //   })
    // },

    goAddressList() {
        // let type = this.data.isCoffeeMaker ? 'delivery' : 'selfTaking'
        // wx.navigateTo({
        //   url: `/pages/transport/transport?from=store&tab=${type}`,
        // })
    },

    goRemark() {
        wx.navigateTo({
            url: `/pages/pay/remark/remark?remark=${this.data.remark}`,
        })
    },

    goVoucher() {
        wx.setStorageSync('voucherList', this.data.voucherList);
        // getApp().globalData.guaerItems = this.data.guaerItems;
        if (this.data.chosenInfo.type == 2) {
            let couponUserRelation = this.data.useScoreFlag && this.data.pointDiscountMoney > 0 ? '' : this.data.couponUserRelation;
            wx.navigateTo({
                url: `/pages/pay/promotion-list/promotion-list?type=2&chosenVoucher=${couponUserRelation}&list=${JSON.stringify(this.data.voucherList.length >=10 ? this.data.voucherList.slice(0,10) : this.data.voucherList)}`,
            })
        } else {
            let couponUserRelation = this.data.useScoreFlag && this.data.pointDiscountMoney > 0 ? '' : (this.data.goBackFromChildPage ? this.data.chosenInfo && this.data.chosenInfo.relationId : this.data.chosenVoucher);
            wx.navigateTo({
                url: `/pages/pay/promotion-list/promotion-list?type=2&chosenVoucher=${couponUserRelation}&list=${JSON.stringify(this.data.voucherList.length >=10 ? this.data.voucherList.slice(0,10) : this.data.voucherList)}`,
            })
        }

    },

    goCoupon() {
        wx.setStorageSync('couponList', this.data.couponList)
        if (this.data.chosenInfo.type == 1) {
            let couponUserRelation = this.data.useScoreFlag && this.data.pointDiscountMoney > 0 ? '' : this.data.couponUserRelation;
            wx.navigateTo({
                url: `/pages/pay/promotion-list/promotion-list?type=1&chosenCoupon=${couponUserRelation}&list=${JSON.stringify(this.data.couponList.length >=10 ? this.data.couponList.slice(0,10) : this.data.couponList)}`,
            })
        } else {
            let couponUserRelation = this.data.useScoreFlag && this.data.pointDiscountMoney > 0 ? '' : (this.data.goBackFromChildPage ? this.data.chosenInfo && this.data.chosenInfo.relationId : this.data.chosenCoupon);
            wx.navigateTo({
                url: `/pages/pay/promotion-list/promotion-list?type=1&chosenCoupon=${couponUserRelation}&list=${JSON.stringify(this.data.couponList.length >=10 ? this.data.couponList.slice(0,10) : this.data.couponList)}`,
            })
        }
    },

    goRedPack() {
        wx.setStorageSync('redPackList', this.data.redPackList)
        const couponUserRelation = this.data.useScoreFlag && this.data.pointDiscountMoney > 0 ? '' : (this.data.goBackFromChildPage ? this.data.chosenInfo && this.data.chosenInfo.content && this.data.chosenInfo.content[0] && this.data.chosenInfo.content[0].relationId : this.data.chosenRedPack);
        wx.navigateTo({
            url: `/pages/pay/promotion-list/promotion-list?type=3&chosenRedPack=${couponUserRelation}&list=${JSON.stringify(this.data.redPackList.length >=10 ? this.data.redPackList.slice(0,10) : this.data.redPackList)}`,
        })
    },

    addAddress() {
        wx.navigateTo({
            url: '/pages/my/address/address',
        })
    },

    dealChildPageInfo() {
        let products = this.data.product;
        products.forEach(item => {
            delete item.skuName;
            delete item.totalPrice;
            delete item.productName;
            delete item.price;
            delete item.number;
            // delete item.productPropIds;
        });
        if (!this.data.chosenInfo.type) {
            this.setData({
                chooseNoCoupon: true,
                chooseNoVoucher: true,
                chooseNoRedPack: true,
                discountType: 0,
            })
        } else {
            this.setData({
                chooseNoCoupon: this.data.chosenInfo.type === 2 || this.data.chosenInfo.type === 3,
                chooseNoVoucher: this.data.chosenInfo.type === 1 || this.data.chosenInfo.type === 3,
                chooseNoRedPack: this.data.chosenInfo.type === 1 || this.data.chosenInfo.type === 2,
            })
        }
        let userCouponIds = []
        this.data.chosenInfo.content && this.data.chosenInfo.content.map(item => {
            userCouponIds.push(item.relationId)
            return item;
        });

        let param = {
            // couponList: this.data.chosenInfo.type ? this.data.chosenInfo.content : [],
            // couCodes: this.data.chosenInfo.type ? this.data.chosenInfo.content[0].id : '',
            // productList: this.data.product,
            storeId: this.data.options.storeId,
            uid: wx.getStorageSync('token').user.id,
            useCart: Number(!this.data.goDirect),
            mockCarts: this.parseProductsParam()
        }

        let hasChosenCouponFlag = this.data.goBackFromChildPage && this.data.chosenInfo.content && this.data.chosenInfo.content[0] && this.data.hasChosenOne;

        if (getApp().globalData.pointBalance && !hasChosenCouponFlag) {
            param.pointBalance = getApp().globalData.pointBalance
        }

        if (userCouponIds.length > 0 && (hasChosenCouponFlag || getApp().globalData.pointBalance <= 0)) {
            // if (userCouponIds.length > 0 && !(this.data.useScoreFlag && getApp().globalData.pointBalance > 0)) {
            if (this.data.chosenInfo.type) {
                if (this.data.chosenInfo.user_coupon_source == 1) {
                    param.userCouponIds = userCouponIds[0]
                } else {
                    param.couCodes = userCouponIds[0]
                    param.userCouponIds = ''
                }
            }
            // param.userCouponIds = this.data.chosenInfo.type ? userCouponIds[0] : ''
        } else {
            param.userCouponIds = '';
        }


        this.getCalculateMoney(param, hasChosenCouponFlag);

    },

    getCalculateMoney(param, hasChosenCouponFlag, secondTry) {
        model(`home/coupon/calculate-price-with-ded-coupon`, param).then(data => {
            let result = parseFloat(data.data.discountMoney || 0).toFixed(2);
            let pointDiscountMoney = parseFloat(data.data.pointDiscountMoney || 0).toFixed(2);
            pointDiscountMoney = pointDiscountMoney == parseInt(pointDiscountMoney) ? parseInt(pointDiscountMoney) : (parseFloat(pointDiscountMoney) == parseFloat(pointDiscountMoney).toFixed(1) ? parseFloat(pointDiscountMoney).toFixed(1) : pointDiscountMoney);
            let levelMoney = parseFloat(data.data.levelMoney).toFixed(2);
            let toCancelOrders = data.data.toCancelOrders;
            if (toCancelOrders && toCancelOrders.length > 0) {
                this.setData({
                    showCouponMention: true
                })
            }
            let couponUserRelation = [];
            this.data.chosenInfo.content && this.data.chosenInfo.content.length > 0 && this.data.chosenInfo.content.forEach(item => {
                couponUserRelation.push(item.relationId);
            });
            let actualPrice = 0;
            if (!this.data.chooseCup) {
                actualPrice = Number(parseFloat(parseFloat(data.data.resultPrice) + parseFloat(this.data.deliverFee)).toFixed(2))
            } else {
                actualPrice = Number(parseFloat(parseFloat(data.data.resultPrice) + parseFloat(this.data.deliverFee) - parseFloat(this.data.zidaibeiMoney)).toFixed(2))
            }
            if (actualPrice < 0) {
                actualPrice = 0;
            }
            pointDiscountMoney = this.data.pointDiscountMoney > 0 ? this.data.pointDiscountMoney : pointDiscountMoney;
            couponUserRelation = couponUserRelation.join(',')


            let _result_ = {
                pointDiscountMoney: pointDiscountMoney,
                // scoreMention: `使用${pointDiscountMoney}积分抵扣¥${pointDiscountMoney}`,
                // 优惠券和积分，两者只能选1
                useScoreFlag: !hasChosenCouponFlag,
                scoreMention: hasChosenCouponFlag ? `未使用（可用积分${this.data.pointBalance}）` : `使用${pointDiscountMoney}积分抵扣¥${pointDiscountMoney}`,
                actualPrice: actualPrice,
                couponMoney: result,
                levelMoney: levelMoney && levelMoney !== 'NaN' ? levelMoney : 0,
                couponUserRelation: couponUserRelation,
                discountType: data.data.type,
            }

            if (secondTry) {
                _result_.noUsePointsWord = '当前积分不可用'
            }

            this.setData(_result_, () => {
                this.setData({
                    actualAfterMemberPrice: this.data.member_recharge > this.data.actualPrice ? 0 : (this.data.actualPrice - this.data.member_recharge),
                    actualOriginalPrice: parseFloat(this.data.actualPriceGap) + parseFloat(this.data.actualPrice)
                })
            })
        }).catch(e => {
            if (e == '未找到对应的积分奖励配置信息') {
                this.setData({
                    pointDiscountMoney: 0,
                })
                console.log(param, '@@@calculate-price-with-ded-coupon-param@@@');
                delete param.pointBalance;
                this.getCalculateMoney(param, hasChosenCouponFlag, true)
            }
        });
    },

    pageScrollToBottom: function() {
        //  let scrollHeight = wx.getSystemInfoSync().windowHeight;
        //  this.setData({
        //    scrollTop: 500
        //  });
        const query = wx.createSelectorQuery();
        query.select('#container').boundingClientRect();
        query.selectViewport().scrollOffset();
        query.exec((rect) => {
            if (rect && rect[0] && rect[1]) {
                console.log(rect[0].bottom, 'rect[0].bottom');
                wx.pageScrollTo({
                    scrollTop: rect[0].bottom
                });
                this.setData({
                    viewToNav: 'xiguan'
                });
            }
        });
    },

    onReady: function() {
        // 页面渲染完成

    },

    onPageScroll: function(e) {
        // 页面滚动时执行
        console.log(e, 'onPageScroll')
    },

    onShow: function() {
        // 页面显示
        // wx.showLoading({
        //   title: '加载中...',
        // })
        // this.getCheckoutInfo();
        getApp().globalData.configData = wx.getStorageSync('configData');
        this.setData({
            scoreTitle: getApp().globalData.configData['Points_deduction_pet_name'] || '',
        })
        let pages = getCurrentPages();
        let prevPage = pages[pages.length - 2]; //上一个页面
        if (wx.getStorageSync('showNoOrder')) {
            this.setData({
                showNoOrder: true
            });
            wx.removeStorageSync('showNoOrder')
        }
        if (wx.getStorageSync('deliverMention')) {
            this.setData({
                deliverMention: wx.getStorageSync('deliverMention')
            });
        }
        let memberData = wx.getStorageSync('memberData');
        if (memberData) {
            this.setData({
                member_recharge: Number(memberData.member_total_recharge)
            });
            if (memberData.member_total_recharge > 0) {

            }
        }
        let fromTransport = wx.getStorageSync('fromTransport');
        // if (fromTransport == 'deliver') {
        //   this.chooseExpress(false, 'deliver');
        // }
        if (this.data.goBackFromChildPage) {
            this.dealChildPageInfo();
        } else if (this.data.fromAddress) {
            this.getAddressList();
            if (this.data.fromAddress) {
                this.chooseExpress(false);
            }
        } else {
            this.getAddressList();
        }

        if (this.data.goBackFromRemark) {
            this.getRemark();
        }

    },
    onHide: function() {
        // 页面隐藏

    },
    onUnload: function() {
        // 页面关闭

    },

    toggleMemberRecharge() {
        this.setData({
            useMemberReharge: !this.data.useMemberReharge
        });
        if (!this.data.useMemberReharge) {
            this.setData({
                actualAfterMemberPrice: this.data.member_recharge > this.data.actualPrice ? 0 : (this.data.actualPrice - this.data.member_recharge)
            })
        }
    },

    getRemark() {
        this.setData({
            remark: wx.getStorageSync('remark')
        });
    },

    submit() {
        try {
            wx.showLoading({
                title: '加载中', //提示的内容,
                mask: true, //显示透明蒙层，防止触摸穿透,
                success: res => {}
            });
            let userAddressId = this.data.options.userAddressId || this.data.checkedExpress.id;
            if (this.data.chooseSelf || this.data.chooseDaodian || this.data.chooseCup) {
                userAddressId = null;
            }
            if (!userAddressId && this.data.chooseExpress) {
                if (wx.getStorageSync('addressList') && wx.getStorageSync('addressList')[0] && wx.getStorageSync('addressList')[0].id) {
                    userAddressId = wx.getStorageSync('addressList')[0].id
                } else {
                    // userAddressId = 3;
                }
            }
            let orderType = 1;
            if (this.data.chooseCup) {
                orderType = 4;
            } else if (this.data.chooseDaodian) {
                orderType = 2;
            } else if (this.data.chooseSelf) {
                orderType = 3;
            }
            let payType = 1;
            if (this.data.useMemberReharge) {
                payType = 15;
            }
            if (this.data.useScoreFlag && this.data.pointDiscountMoney > 0) {
                if (this.data.actualPrice == 0) {
                    // payType = 20;
                } else {
                    // payType = 120;
                }
                payType = 1;
            }
            let param = {
                openId: wx.getStorageSync('openid'),
                storeId: this.data.options.storeId,
                userAddressId: userAddressId,
                // userId: wx.getStorageSync('token').user.id,
                // discountType: this.data.discountType,
                // deliverFee: this.data.deliverFee,
                // payAmount: this.data.actualPrice,
                orderType: orderType,
                payType: payType,
                remark: this.data.remark ? this.data.remark.replace('其他备注：', '') : '',
                remark_json: JSON.stringify({
                        xiguan: this.data.chooseItemXiguan,
                        other: this.data.remark
                    })
                    // discountIds: '1,2,3'
            }
            if (this.data.useScoreFlag && this.data.pointDiscountMoney > 0) {
                param.available_point = this.data.pointDiscountMoney
            }
            if (this.data.chosenInfo && this.data.chosenInfo.content && this.data.chosenInfo.content[0] && this.data.chosenInfo.content[0].id && !(this.data.useScoreFlag && this.data.pointDiscountMoney > 0)) {
                // param.couCodes = this.data.chosenInfo.content[0].id;
                if (this.data.chosenInfo.user_coupon_source == 1) {
                    param.discountIds = this.data.chosenInfo.content[0].id;
                } else {
                    param.couCodes = this.data.chosenInfo.content[0].id;
                    param.discountIds = '';
                }
                console.log(param.couCodes, '锐');
            }
            // if (this.data.chooseItemXiguan) {
            //   param.remark += ' 需要吸管';
            // }
            // if (!this.data.options.userAddressId) {
            //   delete param.userAddressId;
            // }
            if (!param.discountIds || param.discountIds === 'undefined') {
                param.discountIds = '';
            }
            if (!param.userAddressId) {
                delete param.userAddressId;
            }
            if (this.data.addPriceIds) {
                param.addPriceIds = this.data.addPriceIds
            }
            let paramStr = '';
            let keys = Object.keys(param);
            keys.forEach((item, index) => {
                if (index !== keys.length - 1) {
                    paramStr += item + '=' + param[item] + '&';
                } else {
                    paramStr += item + '=' + param[item];
                }
            })

            let products = this.data.options.product;
            products.forEach(item => {
                if (!item.number) {
                    item.number = item.num;
                }
                delete item.num;
                delete item.skuName;
                delete item.totalPrice;
                delete item.productName;
                delete item.price;
            })

            if (this.data.guaerItems.length > 0) {
                param.guaerUserCouponId = this.data.guaerItems[0].guaerUserCoupon.id
            }
            if (this.data.goDirect) {
                param.useCart = Number(!this.data.goDirect);
                param.mockCarts = JSON.stringify(this.parseProductsParam());
            }

            // param.list = JSON.stringify(products);

            param.storeId = this.data.options.storeId
                // paramStr = 'storeId=29&userId=1&userAddressId=3&discountType=2&discountIds=1,2,3&deliverFee=6&payAmount=45&orderType=1&payType=1'
            model(`order/detail/submit`, param, 'POST').then(data => {
                wx.hideLoading();
                if (data.code === 'suc') {
                    wx.removeStorageSync('remark');
                    wx.removeStorageSync('CART_LIST');
                    wx.removeStorageSync('remark');

                    // 更酷咖啡机增加全局变量
                    if (this.data.machine_type == 3) {
                        getApp().globalData.submitForMachineTypeThird = true;
                    } else {
                        getApp().globalData.submitForMachineTypeThird = null;
                    }

                    if (data.data.ifComplete) {
                        wx.setStorageSync('showNoOrder', true);
                        wx.navigateTo({
                            url: `/pages/pay/pay_success/pay_success?orderId=${data.data.order.id}&varCode=${data.data.order.verify_code}&price=${this.data.actualPrice}`
                                // url: `/pages/order/detail/detail?id=${data.data.order.id}&orderClassify=1`
                        });
                    } else {
                        let payParamStr = '';
                        let params = data.data;
                        for (let key of Object.keys(params)) {
                            if (key === 'package') {
                                params[key] = params[key].split('=')[1];
                            }
                            if (key === 'order') {
                                // params['varCode'] = params[key].varCode;
                                payParamStr += `varCode=${params['order']['verify_code']}&`;
                                params[key] = params[key].id;
                            }
                            payParamStr += `${key}=${params[key]}&`;
                        }
                        payParamStr += `price=${this.data.actualPrice}`
                        if (this.data.checkedAddress.coffeeMakerId) {
                            payParamStr += `&coffeeMaker=1`
                        }
                        wx.navigateTo({
                            // url: `/pages/pay/pay_success/pay_success?price=${this.data.actualPrice}`
                            url: `/pages/pay/normalPay/normalPay?${payParamStr}`
                        });
                    }
                }
            }).catch(e => {
                if (e && e.errMsg && e.errMsg.indexOf('fail') > 0) {
                    this.setData({
                        errorToast: true,
                        toastInfo: '暂无网络，请稍后重试'
                    });
                    setTimeout(() => {
                        this.setData({
                            errorToast: false
                        });
                    }, 1500);
                } else {
                    this.setData({
                        errorToast: true,
                        toastInfo: e || '下单失败'
                    });
                    setTimeout(() => {
                        this.setData({
                            errorToast: false
                        });
                    }, 1500);
                }
                wx.hideLoading({
                    title: '加载中', //提示的内容,
                    mask: true, //显示透明蒙层，防止触摸穿透,
                });
                // wx.navigateTo({
                //   url: `/pages/pay/pay_success/pay_success?price=${this.data.actualPrice}`
                // });
            })
        } catch (e) {
            wx.hideLoading();
            this.setData({
                errorToast: true,
                toastInfo: e
            });
        }
    },

    requestSubscribeAndSubmit() {
        let self = this;
        wx.requestSubscribeMessage({
            tmplIds: ['0N2pBoJ1v4ziWzhcAFfx5WSJby5CDHIv5pgde5qFGRY'],
            success(res) {
                console.log(res, 'success')
                wx.setStorageSync('subscribe', true);
                let reject = Object.keys(res).filter(e => res[e] === 'reject');

                console.log(reject, 'reject');
                if (reject.length === 0) {
                    self.setData({
                        subscribe: true
                    })
                }
                self.submit();
            },
            fail(e) {
                console.log(e, 'fail')
                self.submit();
            }
        });

    },

    goState() {
        let config = wx.getStorageSync('config');
        let url = config.baseUrl[config.env]
        url += 'statement/pay-gas.html'
        wx.navigateTo({
            url: `/pages/webview/webview?url=${encodeURIComponent(url)}`
        });
    },

    chooseXieyi() {
        this.setData({
            zunshou: !this.data.zunshou
        })
    },

    doRightNow() {

        wx.showModal({
            content: `我在「${this.data.checkedAddress.storeName}」自助咖啡机前面等待制作。`, //提示的内容,
            showCancel: true, //是否显示取消按钮,
            cancelColor: '#9A9A9A', //取消按钮的文字颜色,
            cancelText: '否',
            confirmText: '是', //确定按钮的文字，默认为取消，最多 4 个字符,
            confirmColor: '#F12B23', //确定按钮的文字颜色
            success: res => {
                if (res.confirm) {
                    this.submit();
                }
            }
        })
    },

    showScore() {
        this.setData({
            showScoreToast: true
        })
    },

    useScore(use) {
        // console.log(use, '@@@scoreUse');
        // this.setData({
        //   scoreMention: use.detail ? `使用${this.data.pointDiscountMoney}积分抵扣¥${this.data.pointDiscountMoney}` : `未使用（可用积分${this.data.pointBalance}）`
        // })

        let userCouponIds = []
        this.data.chosenInfo.content && this.data.chosenInfo.content.map(item => {
            userCouponIds.push(item.relationId)
            return item;
        });

        const _param = {
            // couponList: [],
            // productList: this.data.product,
            storeId: this.data.options.storeId,
            uid: wx.getStorageSync('token').user.id,
            userCouponIds: this.data.chosenInfo.type ? userCouponIds[0].id : '',
            useCart: Number(!this.data.goDirect),
            mockCarts: this.parseProductsParam(),
        };
        if (this.data.chosenInfo.type) {
            if (this.data.chosenInfo.user_coupon_source == 1) {
                _param.userCouponIds = userCouponIds[0]
            } else {
                _param.couCodes = userCouponIds[0]
                _param.userCouponIds = '';
            }
        }

        if (getApp().globalData.pointBalance && use.detail) {
            _param.pointBalance = getApp().globalData.pointBalance
        }

        model(`home/coupon/calculate-price-with-ded-coupon`, _param).then(data => {
            let result = parseFloat(data.data.discountMoney || 0).toFixed(2);
            let pointDiscountMoney = parseFloat(data.data.pointDiscountMoney || 0).toFixed(2);
            pointDiscountMoney = pointDiscountMoney == parseInt(pointDiscountMoney) ? parseInt(pointDiscountMoney) : (parseFloat(pointDiscountMoney) == parseFloat(pointDiscountMoney).toFixed(1) ? parseFloat(pointDiscountMoney).toFixed(1) : pointDiscountMoney);
            let levelMoney = parseFloat(data.data.levelMoney).toFixed(2);
            this.setData({
                actualPrice: parseFloat(data.data.resultPrice + parseFloat(this.data.deliverFee)).toFixed(2),
                couponMoney: result,
                // pointDiscountMoney,
                // scoreMention: `使用${pointDiscountMoney}积分抵扣¥${pointDiscountMoney}`,
                useScoreFlag: use.detail,
                scoreMention: use.detail ? `使用${this.data.pointDiscountMoney}积分抵扣¥${this.data.pointDiscountMoney}` : `未使用（可用积分${this.data.pointBalance}）`,
                levelMoney: levelMoney && levelMoney !== 'NaN' ? levelMoney : 0,
                // couponUserRelation: '',
                discountType: data.data.type,
                // chooseNoCoupon: false,
                // chooseNoVoucher: false,
                // chooseNoRedPack: false,
            }, () => {
                this.setData({
                    actualAfterMemberPrice: this.data.member_recharge > this.data.actualPrice ? 0 : (this.data.actualPrice - this.data.member_recharge),
                    actualOriginalPrice: this.data.actualPriceGap + this.data.actualPrice
                })
            })
        }).catch(e => {
            if (e == '未找到对应的积分奖励配置信息') {
                this.setData({
                    pointDiscountMoney: 0,
                    noUsePointsWord: '当前积分不可用',
                })
            }
        });

    },

    submitOrder: function() {
        if (!this.data.zunshou) {
            return;
        }
        if (this.data.chooseSelf || this.data.chooseDaodian || this.data.chooseCup) {
            // 如果是更酷咖啡机，就走这个逻辑
            if (this.data.machine_type == 3) {
                this.doRightNow();
                return;
            }
            let content = `是否确认前往【${this.data.checkedAddress.storeName}】自提？订单确认后将无法更改`;
            if (this.data.checkedAddress.coffeeMakerId) {
                content = `是否确认前往【${this.data.checkedAddress.storeName}（编号${this.data.checkedAddress.coffeeMakerId}）】自提？订单确认后将无法更改`;
            }
            wx.showModal({
                // title: '提示', //提示的标题,
                content: content, //提示的内容,
                showCancel: true, //是否显示取消按钮,
                cancelText: '取消', //取消按钮的文字，默认为取消，最多 4 个字符,
                cancelColor: '#000000', //取消按钮的文字颜色,
                confirmText: '确定', //确定按钮的文字，默认为取消，最多 4 个字符,
                confirmColor: '#f50000', //确定按钮的文字颜色,
                success: res => {
                    if (res.confirm) {
                        if (this.data.showCouponMention) {
                            wx.showModal({
                                title: '优惠券说明', //提示的标题,
                                content: '您之前关联了这张优惠券的订单会被取消哦！', //提示的内容,
                                showCancel: true, //是否显示取消按钮,
                                confirmText: '我知道了', //确定按钮的文字，默认为取消，最多 4 个字符,
                                confirmColor: '#f50000', //确定按钮的文字颜色,
                                success: res => {
                                    if (res.confirm) {
                                        // this.requestSubscribeAndSubmit();
                                        this.submit();
                                    } else if (res.cancel) {
                                        console.log('用户点击取消')
                                    }
                                }
                            });
                            this.setData({
                                showCouponMention: false
                            })
                        } else {
                            // this.requestSubscribeAndSubmit();
                            this.submit();
                        }
                    } else if (res.cancel) {
                        console.log('用户点击取消')
                    }
                }
            });
        } else {
            if (this.data.checkedExpress.id) {
                if (parseFloat(this.data.actualPrice) > 0) {
                    // this.requestSubscribeAndSubmit();
                    this.submit();
                } else {
                    console.log(8888);
                    wx.showModal({
                        // title: '提示', //提示的标题,
                        content: `请确认支付订单，订单确认后将无法修改。`, //提示的内容,
                        showCancel: true, //是否显示取消按钮,
                        cancelText: '取消', //取消按钮的文字，默认为取消，最多 4 个字符,
                        cancelColor: '#000000', //取消按钮的文字颜色,
                        confirmText: '确定', //确定按钮的文字，默认为取消，最多 4 个字符,
                        confirmColor: '#f50000', //确定按钮的文字颜色,
                        success: res => {
                            if (res.confirm) {
                                // this.requestSubscribeAndSubmit();
                                this.submit();
                            } else if (res.cancel) {
                                console.log('用户点击取消')
                            }
                        }
                    });
                }

            } else {
                wx.showModal({
                    content: '您还没有收货地址',
                    showCancel: false, //是否显示取消按钮,
                    cancelColor: '#000000', //取消按钮的文字颜色,
                    confirmText: '去添加', //确定按钮的文字，默认为取消，最多 4 个字符,
                    confirmColor: '#DAA37F', //确定按钮的文字颜色,
                    success: res => {
                        if (res.confirm) {
                            wx.navigateTo({
                                url: '/pages/my/address/address',
                            })
                        } else if (res.cancel) {
                            console.log('查看发票记录')
                        }
                    }
                })
            }
        }

    }
})
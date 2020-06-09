"use strict";
import model from '../../../utils/model';
import {
    mockData,
} from './mockData.js';

Page({
    data: {
        array: [],
        // activedItems: [{
        //     title: 'ssds',
        //     subtitle: 'ssss',
        //     discountMoney: 50
        // }],
        couponItems: [],
        voucherItems: [],
        redPackItems: [],
        unActivedItems: [],
        chosenInfo: {},
        canUseRedPacketMeanwhile: false,
        type: 2,
        chosenType: 1,
        products: [],
        chosenVoucher: -1,
        chosenCoupon: -1,
        chosenRedPack: -1,
        couponType: 1,
        totalItems: [],
        guaerItems: []
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
        if (type == 200) {
            Promise.all([model(`my/coupon/list?userId=${userId}&type=1`), model(`my/coupon/list?userId=${userId}&type=3`)]).then(resArr => {
                let res1 = resArr[0];
                let res2 = resArr[1];
                let result = res1.data.userCoupons;
                // let result = res1.data.userCoupons.concat(res2.data.userCoupons);
                result = result.filter(element => {
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
                    if (element.couEndDate) {
                        element.couEndDate = element.couEndDate.split(' ')[0]
                    }

                    if (element.coupon.classifyNames && element.coupon.classifyNames.length > 0) {
                        element.xianzhi = element.coupon.classifyNames[0]
                    }

                    if (element.coupon.goodsNames && element.coupon.goodsNames.length > 0) {
                        element.xianzhi = element.coupon.goodsNames[0]
                    }
                    let _result = true;
                    if (this.data.type == 2) {
                        this.data.voucherItems.map(item => {
                            if (item.coupon.id == element.coupon.id) {
                                _result = false;
                            }
                        })
                        if (element.coupon.coupon_type != 5) {
                            _result = false;
                        }
                        // _result = (element.coupon.coupon_type == 5) && (element.coupon.classifyIds && element.coupon.classifyIds.length > 0)
                    } else if (this.data.type == 3) {
                        this.data.redPackItems.map(item => {
                            if (item.coupon.id == element.coupon.id) {
                                _result = false;
                            }
                        })
                        if (element.coupon.coupon_type != 2) {
                            _result = false;
                        }
                        // _result = (element.coupon.coupon_type == 2)
                    } else if (this.data.type == 1) {
                        this.data.couponItems.map(item => {
                            if (item.coupon.id == element.coupon.id) {
                                _result = false;
                            }
                        })
                        if (element.coupon.coupon_type == 2 || element.coupon.coupon_type == 5) {
                            _result = false;
                        }
                        // _result = (element.coupon.coupon_type != 2 && element.coupon.coupon_type != 5)
                    }
                    return _result;
                });
                this.setData({
                    couponItems: result,
                    voucherItems: result,
                    redPackItems: result,
                    loading: false
                })
            }).catch(e => {
                this.setData({
                    loading: false
                })
            });
        } else {
            this.setData({
                couponItems: this.data.totalItems,
                voucherItems: this.data.totalItems,
                redPackItems: this.data.totalItems,
                loading: false
            })
        }

    },
    onMyEvent: function (e) {
        // 选择一项就返回，并用setData把选中的那项以外的其他项checked设为空
        // if (this.data.couponType !== 1) {
        //     return;
        // }

        let idArray = e.detail.value;
        let newValue;
        if (this.data.type === 3) {
            newValue = idArray.splice(idArray.length - 1, 1);
        } else {
            newValue = idArray;
        }
        let chosenInfo = {};
        console.log(e.target.dataset.couCode);
        let target = '';
        if (this.data.type === 1) {
            target = 'couponItems'
        } else if (this.data.type === 2) {
            target = 'voucherItems'
        } else if (this.data.type === 3) {
            target = 'redPackItems'
        }
        this.data[target].forEach((element, index) => {
            if (this.data.type === 100) {
                if (index === parseInt(newValue[0])) {
                    if (!element.checked) {
                        let checkBool = target + '[' + index + '].checked';
                        if (this.data.type === 1) {
                            chosenInfo = {
                                type: this.data.type,
                                content: [{
                                    type: this.data.type,
                                    id: element.couCode,
                                    relationId: element.couCode
                                }]
                            };
                        } else {
                            chosenInfo = {
                                type: this.data.type,
                                content: [{
                                    type: this.data.type,
                                    id: element.couCode,
                                    relationId: element.couCode
                                }]
                            };
                        }
                        console.log(checkBool, 'checkBooltrue');
                        this.setData({
                            [checkBool]: true
                        });
                    } else {
                        let checkBool = target + '[' + index + '].checked';
                        console.log(checkBool, 'checkBool');
                        this.setData({
                            [checkBool]: false
                        });
                    }
                } else {
                    let checkBool = target + '[' + index + '].checked';
                    console.log(checkBool, 'checkBool2');
                    this.setData({
                        [checkBool]: false
                    });
                }
            } else if (this.data.type === 1 || this.data.type === 3 || this.data.type === 2) {
                // 咖啡钱包逻辑不通
                let checkBool = target + '[' + index + '].checked';
                let newTarget = parseInt(newValue[newValue.length - 1]);
                // newValue.forEach((itm) => {
                //     targetArr.push(parseInt(itm));
                // })

                if (target === 'redPackItems') {
                    let redPackItems = this.data.redPackItems;
                    redPackItems.forEach(item => {
                        item.checked = false;
                    })
                    if (newValue.length > 0) {
                        redPackItems[newTarget].checked = true;
                    }
                    this.setData({
                        redPackItems
                    })
                } else if (target === 'voucherItems') {
                    let voucherItems = this.data.voucherItems;
                    voucherItems.forEach(item => {
                        item.checked = false;
                    })
                    if (newValue.length > 0) {
                        voucherItems[newTarget].checked = true;
                    }
                    this.setData({
                        voucherItems,
                    })
                } else {
                    let couponItems = this.data.couponItems;
                    couponItems.forEach(item => {
                        item.checked = false;
                    })
                    if (newValue.length > 0) {
                        couponItems[newTarget].checked = true;
                    }
                    this.setData({
                        couponItems,
                    })
                }
                
                
                // if (targetArr.indexOf(index) > -1) {
                //     this.setData({
                //         [checkBool]: true
                //     });
                // } else {
                //     this.setData({
                //         [checkBool]: false
                //     });
                // }
            }

        });

        this.commitCoupon();


        if (this.data.type === 3) {
            this.setData({
                chosenInfo: chosenInfo
            });
        }

    },

    commitCoupon() {
        if (this.data.couponItems.length == 0 && this.data.voucherItems.length == 0 && this.data.redPackItems.length == 0) {
            let pages = getCurrentPages();
            let prevPage = pages[pages.length - 2]; //上一个页面
            prevPage.setData({
                goBackFromChildPage: true
            });
            wx.navigateBack({
                delta: 1
            });
            return;
        }
        if (this.data.type === 2 || this.data.type === 1 || this.data.type === 3) {
            let chosenInfoArr = [];
            if (this.data.type === 2) {
                this.data.voucherItems.forEach(element => {
                    if (element.checked) {
                        chosenInfoArr.push({
                            type: this.data.type,
                            id: element.id,
                            relationId: element.id,
                            user_coupon_source: element.user_coupon_source
                        })
                    }
                });
            } else if (this.data.type === 3) {
                this.data.redPackItems.forEach(element => {
                    if (element.checked) {
                        chosenInfoArr.push({
                            type: this.data.type,
                            id: element.id,
                            relationId: element.id,
                            user_coupon_source: element.user_coupon_source
                        })
                    }
                });
            } else {
                this.data.couponItems.forEach(element => {
                    if (element.checked) {
                        chosenInfoArr.push({
                            type: this.data.type,
                            id: element.id,
                            relationId: element.id,
                            user_coupon_source: element.user_coupon_source
                        })
                    }
                });
            }

            if (chosenInfoArr.length > 0) {
                this.setData({
                    chosenInfo: {
                        type: this.data.type,
                        user_coupon_source: chosenInfoArr[0].user_coupon_source,
                        content: chosenInfoArr
                    }
                });
            } else {
                this.setData({
                    chosenInfo: {
                        type: 0,
                        user_coupon_source: '',
                        content: []
                    }
                });
            }
            
        }
        this.backToOrderCreate();
    },

    backToOrderCreate() {
        // wx.setStorageSync('chosenPormotionId', this.data.chosenId)
        let pages = getCurrentPages();
        let currPage = pages[pages.length - 1]; //当前页面
        let prevPage = pages[pages.length - 2]; //上一个页面
        prevPage.setData({
            chosenInfo: this.data.chosenInfo,
            chooseType: this.data.type,
            // canUseDiscountAndRedPacket: this.data.canUseRedPacketMeanwhile,
            goBackFromChildPage: true
            // promotionSubtitle: this.data.array[this.data.chosenId].subtitle
        });
        wx.navigateBack({
            delta: 1
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
    onLoad: function (option) {
        // let array = JSON.parse(option.array);
        let chosenId = option.chosenId;
        let redPackList = [];
        let couponList = [];
        let voucherList = [];
        if (option.type == 3) {
            redPackList = JSON.parse(option.list);
        } else if (option.type == 2) {
             voucherList = JSON.parse(option.list);
        } else {
            couponList = JSON.parse(option.list);
        }
        // let activedItems = [];
        // let unActivedItems = [];
        let guaerItems = getApp().globalData.guaerItems;
        // let voucherList = JSON.parse(JSON.stringify(wx.getStorageSync('voucherList')))
        // guaerItems = sssss.splice(0, 1);
        // guaerItems.forEach(element => {
        //     if (element.coupon.classifyNames && element.coupon.classifyNames.length > 0) {
        //         element.xianzhi = element.coupon.classifyNames[0]
        //     }

        //     if (element.coupon.goodsNames && element.coupon.goodsNames.length > 0) {
        //         element.xianzhi = element.coupon.goodsNames[0]
        //     }
        // });
        this.setData({
            couponType: parseInt(option.type) || 2,
            type: parseInt(option.type) || 2,

            // voucherItems: voucherList,
            // couponItems: couponList,
            // redPackItems: redPackList,
            guaerItems: guaerItems || []
        })

        wx.setNavigationBarTitle({
            title: parseInt(option.type) == 3 ? '可用红包券' : parseInt(option.type) == 2 ? '可用兑换券' : '可用满减券'
        })

        // return ;
        if (option.type == 1) {
            // let list = JSON.parse(option.list);
            let list = couponList;
            let chosenInfo = {
                type: 1,
                contents: []
            };
            let chosenCouponArr = option.chosenCoupon.split(',');
            couponList.map(element => {
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
                let checked = false;
                chosenCouponArr.forEach(ele => {
                    if (element.id == ele) {
                        checked = true;
                    }
                });
                element.checked = checked;
                // if (element.id == option.chosenCoupon) {
                //     element.checked = true;
                //     chosenInfo.contents.push({
                //         type: 1,
                //         id: element.coupon.id,
                //         relationId: element.id
                //     });
                // } else {
                //     element.checked = false;
                // }

                return element;
            });
            this.setData({
                chosenInfo: chosenInfo,
                couponItems: list,
                totalItems: list,
                chosenCoupon: chosenCouponArr
            })
            // 优惠券
            // model('my/coupon/list', {
            //     userId: wx.getStorageSync('token').user.id
            // }).then(data => {
            //     let result = data.data;
            //     result.forEach(element => {
            //         element.coupon.availabileStartTime = element.coupon.availabileStartTime.split('.')[0]
            //         element.coupon.availabileEndTime = element.coupon.availabileEndTime.split('.')[0]
            //     });
            //     this.setData({
            //         couponItems: data.data
            //     })
            // })
        } else if (option.type == 3) {
            // let list = JSON.parse(option.list);
            let list = redPackList;
            let chosenInfo = {
                type: 3,
                contents: []
            };
            redPackList.map(element => {
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
                if (element.id == option.chosenRedPack) {
                    element.checked = true;
                    chosenInfo.contents.push({
                        type: 3,
                        id: element.coupon.id,
                        relationId: element.id
                    });
                } else {
                    element.checked = false;
                }

                return element;
            });
            this.setData({
                chosenInfo: chosenInfo,
                redPackItems: list,
                totalItems: list,
                chosenRedPack: parseInt(option.chosenRedPack)
            })
            // 优惠券
            // model('my/coupon/list', {
            //     userId: wx.getStorageSync('token').user.id
            // }).then(data => {
            //     let result = data.data;
            //     result.forEach(element => {
            //         element.coupon.availabileStartTime = element.coupon.availabileStartTime.split('.')[0]
            //         element.coupon.availabileEndTime = element.coupon.availabileEndTime.split('.')[0]
            //     });
            //     this.setData({
            //         couponItems: data.data
            //     })
            // })
        } else {
            // let list = JSON.parse(option.list);
            let list = voucherList;
            let chosenVoucherArr = option.chosenVoucher.split(',');
            voucherList.forEach(item => {
                if (item.discount) {
                    item.discount = parseFloat(item.discount).toFixed(1);
                }
                if (item.saveAmount) {
                    item.saveAmount = parseFloat(item.discount).toFixed(1);
                }
                if (item.startTime) {
                    item.startTime = item.startTime.split(' ')[0]
                }
                if (item.endTime) {
                    item.endTime = item.endTime.split(' ')[0]
                }
                let checked = (chosenVoucherArr[0] == item.id);
                // chosenVoucherArr.forEach(ele => {
                //     debugger
                //     if (item.couCode == ele) {
                //         checked = true;
                //     }
                // });
                item.checked = checked;
                item.voucherPrice = parseInt(item.voucherPrice);
            })
            this.setData({
                voucherItems: list,
                totalItems: list,
                chosenVoucher: chosenVoucherArr
            })
            // 兑换券
            // model('my/voucher/list', {
            //     userId: 1
            // }).then(data => {
            //     let result = data.data;
            //     result.forEach(element => {
            //         element.voucher.availabileStartTime = element.voucher.availabileStartTime.split('.')[0];
            //         element.voucher.availabileEndTime = element.voucher.availabileEndTime.split('.')[0];
            //         element.counpon = element.voucher;
            //     });
            //     this.setData({
            //         voucherItems: data.data
            //     })
            // })
            // model('home/coupon/getAvailableCoupon', {
            //     uid: 1,
            //     list: this.data.products
            // }).then(data => {
            //     let result = data.data;
            //     // result.forEach(element => {
            //     //     element.voucher.availabileStartTime = element.voucher.availabileStartTime.split('.')[0];
            //     //     element.voucher.availabileEndTime = element.voucher.availabileEndTime.split('.')[0];
            //     //     element.counpon = element.voucher;
            //     // });
            //     this.setData({
            //         voucherItems: data.data
            //     })
            // })
        }

    },

    showRule(e) {
        let index = e.currentTarget.dataset.index;
        let couponItems = this.data.couponItems;
        let redPackItems = this.data.redPackItems;
        let voucherItems = this.data.voucherItems;
        
        if (this.data.type == 1) {
            couponItems[index].showRule = !couponItems[index].showRule;
            this.setData({
                couponItems: couponItems
            })
        } else if (this.data.type == 3) {
            redPackItems[index].showRule = !redPackItems[index].showRule;
            this.setData({
                redPackItems: redPackItems
            })
        } else if (this.data.type == 2) {
            voucherItems[index].showRule = !voucherItems[index].showRule;
            this.setData({
                voucherItems: voucherItems
            })
        }

    }
});
"use strict";
import model from '../../../utils/model';


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
        unActivedItems: [],
        chosenInfo: {},
        canUseRedPacketMeanwhile: false,
        type: 1,
        products: [],
        chosenVoucher: -1,
        chosenCoupon: -1
    },
    onMyEvent: function (e) {
        // 选择一项就返回，并用setData把选中的那项以外的其他项checked设为空
        let idArray = e.detail.value;
        let newValue;
        if (this.data.type === 1) {
            newValue = idArray.splice(idArray.length - 1, 1);
        } else {
            newValue = idArray;
        }
        let chosenInfo = {};
        console.log(e.target.dataset.id);
        let target = '';
        if (this.data.type === 1) {
            target = 'couponItems'
        } else if (this.data.type === 2) {
            target = 'voucherItems'
        }
        this.data[target].forEach((element, index) => {
            if(this.data.type === 1) {
                if (index === parseInt(newValue[0])) {
                    if (!element.checked) {
                        let checkBool = target + '[' + index + '].checked';
                        if (this.data.type === 2) {
                            chosenInfo = {
                                type: this.data.type,
                                content: [{
                                    type: this.data.type,
                                    id: element.tCoreUserVoucher.voucherId,
                                    relationId: element.tCoreUserVoucher.id
                                }]
                            };
                        } else {
                            chosenInfo = {
                                type: this.data.type,
                                content: [{
                                    type: this.data.type,
                                    id: element.tCoreUserCoupon.couponId,
                                    relationId: element.tCoreUserCoupon.id
                                }]
                            };
                        }
                        this.setData({
                            [checkBool]: true
                        });
                    } else {
                        let checkBool = target + '[' + index + '].checked';
                        this.setData({
                            [checkBool]: false
                        });
                    }
                } else {
                    let checkBool = target + '[' + index + '].checked';
                    this.setData({
                        [checkBool]: false
                    });
                }
            } else {
                // 咖啡钱包逻辑不通
                let checkBool = target + '[' + index + '].checked';
                let targetArr = []
                newValue.forEach((itm) => {
                    targetArr.push(parseInt(itm));
                })
                if (targetArr.indexOf(index) > -1) {
                    this.setData({
                        [checkBool]: true
                    });
                } else {
                    this.setData({
                        [checkBool]: false
                    });
                }
            }
            
        });


        if (this.data.type === 1) {
            this.setData({
                chosenInfo: chosenInfo
            });
        }
        
    },

    commitCoupon () {
        if (this.data.type === 2) {
            let chosenInfoArr = [];
            this.data.voucherItems.forEach(element => {
                if (element.checked) {
                    chosenInfoArr.push({
                        type: this.data.type,
                        id: element.tCoreUserVoucher.voucherId,
                        relationId: element.tCoreUserVoucher.id
                    })
                }
            });
            this.setData({
                chosenInfo: {
                    type: this.data.type,
                    content: chosenInfoArr
                }
            });
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
            url: '../order-create/order-create'
        });
    },
    onLoad: function (option) {
        // let array = JSON.parse(option.array);
        let chosenId = option.chosenId;
        let activedItems = [];
        let unActivedItems = [];
        this.setData({
            type: parseInt(option.type),
        })
        if (this.data.type === 1) {
            // let list = JSON.parse(option.list);
            let list = wx.getStorageSync('couponList');
            list.forEach(item => {
                if (item.tCoreCoupon.discount) {
                    item.tCoreCoupon.discount = parseFloat(item.tCoreCoupon.discount).toFixed(1);
                }
                if (item.tCoreCoupon.saveAmount) {
                    item.tCoreCoupon.saveAmount = parseFloat(item.tCoreCoupon.saveAmount).toFixed(1);
                }
                if (item.tCoreUserCoupon.id == option.chosenCoupon) {
                    item.checked = true;
                } else {
                    item.checked = false;
                }
                if (item.tCoreUserCoupon.startTime) {
                    item.tCoreUserCoupon.startTime = item.tCoreUserCoupon.startTime.split(' ')[0]
                }
                if (item.tCoreUserCoupon.endTime) {
                    item.tCoreUserCoupon.endTime = item.tCoreUserCoupon.endTime.split(' ')[0]
                }
            })
            this.setData({
                couponItems: list,
                chosenCoupon: parseInt(option.chosenCoupon)
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
            let list = wx.getStorageSync('voucherList');
            let chosenVoucherArr = option.chosenVoucher.split(',');
            list.forEach(item => {
                if (item.tCoreUserVoucher.discount) {
                    item.tCoreUserVoucher.discount = parseFloat(item.tCoreUserVoucher.discount).toFixed(1);
                }
                if (item.tCoreUserVoucher.saveAmount) {
                    item.tCoreUserVoucher.saveAmount = parseFloat(item.tCoreUserVoucher.discount).toFixed(1);
                }
                if (item.tCoreUserVoucher.startTime) {
                    item.tCoreUserVoucher.startTime = item.tCoreUserVoucher.startTime.split(' ')[0]
                }
                if (item.tCoreUserVoucher.endTime) {
                    item.tCoreUserVoucher.endTime = item.tCoreUserVoucher.endTime.split(' ')[0]
                }
                let checked = false;
                chosenVoucherArr.forEach(ele => {
                    if (item.tCoreUserVoucher.id == ele) {
                        checked = true;
                    }
                });
                item.checked = checked;
                item.tCoreVoucher.voucherPrice = parseInt(item.tCoreVoucher.voucherPrice);
            })
            this.setData({
                voucherItems: list,
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
        
    }
});
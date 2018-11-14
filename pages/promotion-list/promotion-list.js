"use strict";
import model from '../../utils/model';


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
        chosenId: -1,
        canUseRedPacketMeanwhile: false,
        type: 1
    },
    onMyEvent: function (e) {
        // 选择一项就返回，并用setData把选中的那项以外的其他项checked设为空
        let idArray = e.detail.value;
        let newValue = idArray.splice(idArray.length - 1, 1);
        let chosenId = -1;
        console.log(e.target.dataset.id);
        this.data.activedItems.forEach((element, index) => {
            if (index === parseInt(newValue[0])) {
                if (!element.checked) {
                    let checkBool = 'array[' + index + '].checked';
                    chosenId = index;
                    this.setData({
                        [checkBool]: true
                    });
                    lx.lxDotProxy('mc', 'b_fuhac6r2', {
                        status: 1
                    });
                    if (element.canUseRedPacketMeanwhile) {
                        this.setData({
                            canUseRedPacketMeanwhile: true
                        });
                    }
                } else {
                    let checkBool = 'array[' + index + '].checked';
                    this.setData({
                        [checkBool]: false
                    });
                    lx.lxDotProxy('mc', 'b_fuhac6r2', {
                        status: 0
                    });
                }
            } else {
                let checkBool = 'array[' + index + '].checked';
                this.setData({
                    [checkBool]: false
                });
                lx.lxDotProxy('mc', 'b_fuhac6r2', {
                    status: 0
                });
            }
        });
        this.setData({
            chosenId: chosenId
        });
        this.backToOrderCreate();
    },

    backToOrderCreate() {
        // wx.setStorageSync('chosenPormotionId', this.data.chosenId)
        let pages = getCurrentPages();
        let currPage = pages[pages.length - 1]; //当前页面
        let prevPage = pages[pages.length - 2]; //上一个页面
        prevPage.setData({
            chosenPormotionId: this.data.chosenId,
            chooseType: 'promotion',
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
            type: parseInt(option.type)
        })
        if (this.data.type === 2) {
            // 优惠券
            model('my/coupon/list', {
                userId: 1
            }).then(data => {
                let result = data.data;
                result.forEach(element => {
                    element.coupon.availabileStartTime = element.coupon.availabileStartTime.split('.')[0]
                    element.coupon.availabileEndTime = element.coupon.availabileEndTime.split('.')[0]
                });
                this.setData({
                    couponItems: data.data
                })
            })
        } else {
            // 兑换券
            model('my/voucher/list', {
                userId: 1
            }).then(data => {
                let result = data.data;
                result.forEach(element => {
                    element.voucher.availabileStartTime = element.voucher.availabileStartTime.split('.')[0];
                    element.voucher.availabileEndTime = element.voucher.availabileEndTime.split('.')[0];
                    element.counpon = element.voucher;
                });
                this.setData({
                    voucherItems: data.data
                })
            })
        }
        
    }
});
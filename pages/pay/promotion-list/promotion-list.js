Page({
  data: {
    array: [],
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
    let newValue = idArray.splice(idArray.length - 1, 1);
    let chosenInfo = {};
    console.log(e.target.dataset.id);
    let target = '';
    if (this.data.type === 1) {
      target = 'couponItems';
    } else if (this.data.type === 2) {
      target = 'voucherItems';
    }
    this.data[target].forEach((element, index) => {
      if (index === parseInt(newValue[0])) {
        if (!element.checked) {
          let checkBool = target + '[' + index + '].checked';
          if (this.data.type === 2) {
            chosenInfo = {
              type: this.data.type,
              id: element.tCoreUserVoucher.voucherId,
              relationId: element.tCoreUserVoucher.id
            };
          } else {
            chosenInfo = {
              type: this.data.type,
              id: element.tCoreUserCoupon.couponId,
              relationId: element.tCoreUserCoupon.id
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
    });
    this.setData({
      chosenInfo: chosenInfo
    });
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
    });
    if (this.data.type === 1) {
      let list = JSON.parse(option.list);
      list.forEach(item => {
        if (item.tCoreUserCoupon.id == option.chosenCoupon) {
          item.checked = true;
        } else {
          item.checked = false;
        }
      });
      this.setData({
        couponItems: list,
        chosenCoupon: parseInt(option.chosenCoupon)
      });
    } else {
      let list = JSON.parse(option.list);
      list.forEach(item => {
        if (item.tCoreUserVoucher.id == option.chosenVoucher) {
          item.checked = true;
        } else {
          item.checked = false;
        }
      });
      this.setData({
        voucherItems: list,
        chosenVoucher: parseInt(option.chosenVoucher)
      });
    }
        
  }
});
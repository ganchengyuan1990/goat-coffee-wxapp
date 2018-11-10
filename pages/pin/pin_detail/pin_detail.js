// var QRCode = require('../../utils/weapp-qrcode.js');
import {calcLeftTime} from '../../../utils/util';



Page({
     onShareAppMessage: function (res) {
        return {
            title: `堤旁树-${this.data.poiInfo.name || this.data.poiInfo.lesson_name}`,
            path: `pages/lesson/lesson?lesson_id=${this.data.lesson_id}`,
            success: function (res) {
                // 转发成功
            },
            fail: function (res) {
                // 转发失败
            }
        }
    },

    data: {
        poiInfo: '',
        indicatorDots: false,
        autoplay: true,
        interval: 5000,
        duration: 1000,
        lesson_id: 0,
        tool_id: 0,
        pinOrders: [],
        address: '',
        totalPrice: 0,
        count: 1,
        tokenPrice: 0,
        showToast: false,
        transFee: -1,
        receiver: '',
        isFromAddress: false,
        addressObj: {},
        choosenType: 'pin',
        attendOthers: false,
        isMart: 0
    },

    onShow () {
        if (this.data.isFromAddress) {
            this.getTransFee(this.data.addressObj, this);
        }
    },

    onLoad: function (option) {
        let self = this;
        
        wx.showLoading({
          title: 'Loading...', //提示的内容,
          mask: true, //显示透明蒙层，防止触摸穿透,
        });
        if (option.lesson_id) {
            this.setData({
                lesson_id: option.lesson_id
            });
            wx.request({
                url: 'https://www.jasongan.cn/getLessonById',
                method: 'GET',
                // data:  'appid=1256596722&url=https://www.jasongan.cn/img/fengli.jpeg',
                data: {
                    id: this.data.lesson_id
                },
                header: {
                    //设置参数内容类型为x-www-form-urlencoded
                    'content-type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json'
                },
                success: function (res) {
                    self.callBackInfo(res, self);
                }
            });

            wx.request({
                url: 'https://www.jasongan.cn/getPinOrdersBylessonid',
                method: 'GET',
                // data:  'appid=1256596722&url=https://www.jasongan.cn/img/fengli.jpeg',
                data: {
                    lesson_id: this.data.lesson_id,
                    openid: wx.getStorageSync('openid')
                },
                header: {
                    //设置参数内容类型为x-www-form-urlencoded
                    'content-type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json'
                },
                success: function (res) {
                    self.callBackPinOrder(res, self);
                }
            });
        } else {
            this.setData({
                tool_id: option.tool_id
            });
            wx.request({
                url: 'https://www.jasongan.cn/getToolById',
                method: 'GET',
                // data:  'appid=1256596722&url=https://www.jasongan.cn/img/fengli.jpeg',
                data: {
                    id: this.data.tool_id
                },
                header: {
                    //设置参数内容类型为x-www-form-urlencoded
                    'content-type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json'
                },
                success: function (res) {
                    self.callBackInfo(res, self);
                    let personal_info = wx.getStorageSync('personal_info');
                    let addressObj = JSON.parse(personal_info.address);
                    if (addressObj) {
                        self.setData({
                            address: addressObj ? `${addressObj.region} ${addressObj.address}` : '',
                            receiver: `联系人：${addressObj.name}，联系电话：${addressObj.phone}`
                        });
                        self.getTransFee(addressObj, self);
                    }
                }
            });

            wx.request({
                url: 'https://www.jasongan.cn/getPinOrdersByToolid',
                method: 'GET',
                // data:  'appid=1256596722&url=https://www.jasongan.cn/img/fengli.jpeg',
                data: {
                    tool_id: this.data.tool_id,
                    openid: wx.getStorageSync('openid')
                },
                header: {
                    //设置参数内容类型为x-www-form-urlencoded
                    'content-type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json'
                },
                success: function (res) {
                    self.callBackPinOrder(res, self);
                }
            });
        }
        
    },

    getTransFee(addressObj, self) {
        wx.request({
            url: 'https://www.jasongan.cn/getTransportFee',
            method: 'GET',
            // data:  'appid=1256596722&url=https://www.jasongan.cn/img/fengli.jpeg',
            data: {
                weight: self.data.poiInfo.weight,
                destionation: addressObj.region.split(',')[0]
            },
            header: {
                //设置参数内容类型为x-www-form-urlencoded
                'content-type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            },
            success: function (res) {
                let totalFee = self.data.poiInfo.weight > 0 ? res.data.totalFee : 0;
                self.setData({
                    transFee: totalFee,
                    totalPrice: self.data.choosenType === 'pin' ? (self.data.poiInfo.pinPrice + totalFee) : (self.data.poiInfo.price + totalFee),
                })
            }
        });
    },

    callBackInfo (res, self) {
        if (res.data.code == 200 && res.data.resultLists[0]) {
            let result = res.data.resultLists[0];
            if (result.img && !Array.isArray(result.img)) {
                let imgUrl = result.img.split(',');
                result.img = imgUrl;
            }
            self.setData({
                poiInfo: res.data.resultLists[0]
            })
            wx.hideLoading();
        }
    },

    countChange (e) {
        this.setData({
            count: e.detail.value
        });
        if (this.data.count) {
            this.setData({
                totalPrice: parseFloat(this.data.tokenPrice).toFixed(1) * parseInt(this.data.count)
            })
        }
    },

    callBackPinOrder (res, self) {
        if (res.data.code == 200 && res.data.resultLists[0]) {
            let result = res.data.resultLists;
            result = result.filter(item => {
                if (item.owner === wx.getStorageSync('openid')) {
                    item.canNot = 1;
                }
                if (item.deadline && item.deadline.length === 13) {
                    item.leftTime = calcLeftTime(item.deadline).time;
                }
                return item.pay_status.indexOf('yes') >= 0 && !item.status && item.normalPay !== 1;
            })
            self.setData({
                pinOrders: result.slice(0, 3)
            });
            setInterval(() => {
                let result = [];
                self.data.pinOrders.forEach((item,index) => {
                    item.leftTime = calcLeftTime(item.deadline).time;
                    result.push(item);
                });
                self.setData({
                    pinOrders:result
                });
            }, 1000);
        }
    },

    uploadQrcode () {
        let self = this;
        var qrcode = new QRCode('qrcode', {
            text: "https://www.jasongan.cn/qrcode/index.html?id=12",
            width: 150,
            height: 150,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H,
        });
        wx.canvasToTempFilePath({
            x: 0,
            y: 0,
            width: 150,
            height: 150,
            destWidth: 150,
            destHeight: 150,
            canvasId: 'qrcode',
            success: function (res) {
                wx.uploadFile({
                    url: 'https://www.jasongan.cn/upload/profile', //仅为示例，非真实的接口地址
                    filePath: res.tempFilePath,
                    name: 'file',
                    success: function (res) {
                        var data = JSON.parse(res.data)
                        self.setData({
                            qrcodeUrl: data.file.url
                        });
                        self.createPoiOrder(self);
                    }
                })
            },
            fail: function (res) {
                console.log(res)
            }
        })
    },

    onShare () {
        wx.showShareMenu({
            withShareTicket: true
        })
    },

    goOrder () {
        if (this.data.transFee > -1) {
            if (this.data.choosenType === 'pin') {
                if (this.data.attendOthers) {
                    let item = this.data.attendOthers;
                    wx.navigateTo({
                        url: `/pages/pin/pin?name=${this.data.poiInfo.name}&toolId=${item.tool_id}&qrcode=${item.qrcode}&pinOrderId=${item.id}&price=${this.data.totalPrice}`
                    });
                } else {
                    wx.navigateTo({
                        url: `/pages/pay/pay?tool_id=${this.data.tool_id}&groupMember=${this.data.poiInfo.groupMember}&price=${this.data.totalPrice}&init=1&timeLimit=${this.data.poiInfo.timeliness > 0 ? this.data.poiInfo.timeliness : 1000}`
                    });
                }
                 
            } else {
                if (this.data.isMart) {
                    wx.navigateTo({
                        url: `/pages/normalPay/normalPay?isMart=1&price=${this.data.poiInfo.price}&init=1`
                    });
                } else {
                    wx.navigateTo({
                        url: `/pages/normalPay/normalPay?tool_id=${this.data.tool_id}&price=${this.data.totalPrice}&init=1`
                    });
                }
                
            }
           
        }
    },

    checkPhone () {
        let address = JSON.parse(wx.getStorageSync('personal_info').address);
        let result = false;
        if (address && address.phone) {
            result = true;
        }
        return result || this.data.isFromAddress;
    },

    goPin () {
        if (this.data.tool_id) {
            this.setData({
                tokenPrice: this.data.poiInfo.pinPrice,
                totalPrice: this.data.poiInfo.pinPrice,
                totalPrice: this.data.poiInfo.pinPrice + this.data.transFee,
                showToast: true,
                choosenType: 'pin'
            })
        } else {
            if (!this.checkPhone()) {
                wx.showToast({
                  title: '未填写个人信息，即将跳转', //提示的内容,
                  icon: 'none',
                  duration: 2000, //延迟时间,
                  mask: true, //显示透明蒙层，防止触摸穿透,
                  success: res => {
                      
                  }
                });
                setTimeout(() => {
                    wx.navigateTo({
                        url: `/pages/address/address`
                    });
                }, 2000);
            } else {
                wx.navigateTo({
                    url: `/pages/pay/pay?lesson_id=${this.data.lesson_id}&groupMember=${this.data.poiInfo.groupMember}&price=${this.data.poiInfo.pinPrice}&init=1&timeLimit=${this.data.poiInfo.timeliness > 0 ? this.data.poiInfo.timeliness : 1000}`
                });
            }
        }
    },

    goCreate () {
        if (this.data.tool_id) {
            this.setData({
                tokenPrice: this.data.poiInfo.price,
                totalPrice: this.data.poiInfo.price,
                totalPrice: this.data.poiInfo.price + this.data.transFee,
                showToast: true,
                choosenType: 'normal'
            })
        } else {
            if (!this.checkPhone()) {
                wx.showToast({
                    title: '未填写个人信息，即将跳转', //提示的内容,
                    icon: 'none',
                    duration: 2000, //延迟时间,
                    mask: true, //显示透明蒙层，防止触摸穿透,
                    success: res => {

                    }
                });
                setTimeout(() => {
                    wx.navigateTo({
                        url: `/pages/address/address`
                    });
                }, 2000);
            } else {
                wx.navigateTo({
                    url: `/pages/normalPay/normalPay?lesson_id=${this.data.lesson_id}&price=${this.data.poiInfo.price}&init=1`
                });
            }
        }
    },

    goAddCart () {
        let cartStorage = wx.getStorageSync('cartInfo');
        if (cartStorage) {
            let info = this.data.poiInfo;
            info.number = 1;
            info.checked = true;
            let sameIndex = 0;
            
            let sameProduct = cartStorage.filter((item,idx) => {
                return item.id == info.id;
                sameIndex = idx;
            });
            if (sameProduct && sameProduct.length > 0) {
                wx.showToast({
                    title: '购物车内已有', //提示的内容,
                    icon: 'none', //图标,
                    duration: 2000, //延迟时间,
                    mask: true, //显示透明蒙层，防止触摸穿透,
                    success: res => {}
                });
            } else {
                cartStorage.push(info);
                wx.showToast({
                    title: '加入购物车！', //提示的内容,
                    icon: 'success', //图标,
                    duration: 2000, //延迟时间,
                    mask: true, //显示透明蒙层，防止触摸穿透,
                    success: res => {}
                });
            }
            wx.setStorageSync('cartInfo', cartStorage);
        } else {
            let info = this.data.poiInfo;
            info.number = 1;
            info.checked = true;
            wx.setStorageSync('cartInfo', [info]);
            wx.showToast({
                title: '加入购物车！', //提示的内容,
                icon: 'success', //图标,
                duration: 2000, //延迟时间,
                mask: true, //显示透明蒙层，防止触摸穿透,
                success: res => {}
            });
        }
        
        
    },

    goCreateMartOrder () {
        this.setData({
            tokenPrice: this.data.poiInfo.price,
            totalPrice: this.data.poiInfo.price,
            totalPrice: this.data.poiInfo.price + this.data.transFee,
            showToast: true,
            choosenType: 'normal',
            isMart: 1
        })
    },

    goAttendPin (e) {
        let item = this.data.pinOrders[parseInt(e.currentTarget.dataset.index)]
        if (this.data.tool_id) {
            this.setData({
                tokenPrice: this.data.poiInfo.pinPrice,
                totalPrice: this.data.poiInfo.pinPrice,
                totalPrice: this.data.poiInfo.pinPrice + this.data.transFee,
                showToast: true,
                choosenType: 'pin',
                attendOthers: item
            })
        } else {
            wx.navigateTo({
                url: `/pages/pin/pin?name=${this.data.poiInfo.lesson_name}&lessonId=${item.lesson_id}&qrcode=${item.qrcode}&pinOrderId=${item.id}`
            });
        }
    },

    goToAddAddress () {
        wx.navigateTo({
            url: `/pages/address/address`
        });
    },

    createPoiOrder(self) {
        wx.request({
            url: 'https://www.jasongan.cn/addPinOrder',
            data: {
                lesson_id: this.data.poiInfo.id,
                owner: wx.getStorageSync('openid'),
                owner_avatar: wx.getStorageSync('personal_info').avatarUrl,
                owner_name: wx.getStorageSync('personal_info').user_name,
                deadline: '2018-09-10',
                qrcode: self.data.qrcodeUrl,
                needAmount: this.data.poiInfo.groupMember,
                orderType: 1
            },
            header: {
                //设置参数内容类型为x-www-form-urlencoded
                'content-type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            },
            success: function (res) {
                let pinOrderId = res.data.resultLists.insertId;
                if (res.data.code == 200) {
                    wx.navigateTo({
                        url: `/pages/pin/pin?name=${this.data.poiInfo.lesson_name}&lessonId=${self.data.poiInfo.id}&owner=1&qrcode=${self.data.qrcodeUrl}&pinOrderId=${pinOrderId}`
                    })
                }
            }
        });
    },
    sendMessage(e) {
        wx.request({
            url: 'https://www.jasongan.cn/sendMessage',
            method: 'GET',
            // data:  'appid=1256596722&url=https://www.jasongan.cn/img/fengli.jpeg',
            data: {
                formId: e.detail.formId,
                value: JSON.stringify(e.detail.value)
            },
            header: {
                //设置参数内容类型为x-www-form-urlencoded
                'content-type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            },
            success: function (res) {
                
            }
        })
    },

    closeMask () {
        this.setData({
            showToast: false
        })
    }

})
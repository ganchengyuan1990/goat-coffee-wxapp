// var util = require('../../../utils/util.js');
// var api = require('../../../config/api.js');

import model from '../../utils/model';


var app = getApp();

Page({
    data: {
        banner: 'http://img.goatup.net/img/banner/0322-xianging-yaoqingdebei.jpg',
        errorToastShown: false,
        phoneNum: '',
        phoneCode: '',
        actived: false,
        canGetVerify: false,
        extended: false,
        showSeconds: false,
        leftSeconds: 60,
        userId: 0,
        showButtonLineName: false,
        showButtonLinePhone: false,
        martsList: [{
            "id": 85,
            "name": "Happy Friend",
            "price": 579,
            "amount": 10,
            "pinPrice": 1,
            "groupMember": 0,
            "introduction": "<p><img class=\"middle\" src=\"https://img.alicdn.com/imgextra/i2/77696187/TB2N.d.XXXXXXbMaXXXXXXXXXXX_!!77696187.jpg\"></p><p><img class=\"middle\" src=\"https://img.alicdn.com/imgextra/i1/77696187/TB27DyDbFXXXXcjXXXXXXXXXXXX_!!77696187.jpg\"></p><p>肩刨的刨刀和刨身等宽，适用于处理加工木料台阶，修整榫头的平整度，后方的旋钮调节刨刀的进刀量，拧松刨身前方的螺丝，就可以调节刨刀前面的滑块，从而改变刨缝的大小。</p><p><strong>鲁班肩刨</strong></p><p>刨身尺寸230*65mm、高80mm、刃宽19mm、刃倾角25度、刨削角度40度、净重955克</p><p><br></p><p><img class=\"middle\" src=\"https://img.alicdn.com/imgextra/i3/77696187/O1CN01hfHsH11vZgwmBlHEe_!!77696187.jpg\"><img class=\"middle\" src=\"https://img.alicdn.com/imgextra/i2/77696187/O1CN01Yjdbx11vZgwlIwF8v_!!77696187.jpg\"><img class=\"middle\" src=\"https://img.alicdn.com/imgextra/i2/77696187/O1CN01lBePgR1vZgwmTcnGM_!!77696187.jpg\"><img class=\"middle\" src=\"https://img.alicdn.com/imgextra/i2/77696187/O1CN01OnSHZn1vZgwjNFadz_!!77696187.jpg\"></p><p><img class=\"middle\" src=\"https://img.alicdn.com/imgextra/i2/77696187/TB2RbBajeuSBuNjSsziXXbq8pXa_!!77696187.jpg\"><img class=\"middle\" src=\"https://img.alicdn.com/imgextra/i4/77696187/TB2y9WKXpXXXXabXFXXXXXXXXXX_!!77696187.jpg\"></p><p><br></p>",
            "img": "https://www.coffeebeats.cn/uploads/O1CN01Q6X4XT1vZgwiJ6TWt_!!77696187.jpg",
            "isGroup": 1,
            "weight": 1,
            "video": null,
            "isMart": 1,
            "kind": "手动工具",
            "offline": 0,
            "catagory": "刨子和刮刀",
            "salesPrice": 550.05,
            "skuItems": null,
            "quanzhong": null
        }, {
            "id": 85,
            "name": "Happy Friend",
            "price": 579,
            "amount": 10,
            "pinPrice": 1,
            "groupMember": 0,
            "introduction": "<p><img class=\"middle\" src=\"https://img.alicdn.com/imgextra/i2/77696187/TB2N.d.XXXXXXbMaXXXXXXXXXXX_!!77696187.jpg\"></p><p><img class=\"middle\" src=\"https://img.alicdn.com/imgextra/i1/77696187/TB27DyDbFXXXXcjXXXXXXXXXXXX_!!77696187.jpg\"></p><p>肩刨的刨刀和刨身等宽，适用于处理加工木料台阶，修整榫头的平整度，后方的旋钮调节刨刀的进刀量，拧松刨身前方的螺丝，就可以调节刨刀前面的滑块，从而改变刨缝的大小。</p><p><strong>鲁班肩刨</strong></p><p>刨身尺寸230*65mm、高80mm、刃宽19mm、刃倾角25度、刨削角度40度、净重955克</p><p><br></p><p><img class=\"middle\" src=\"https://img.alicdn.com/imgextra/i3/77696187/O1CN01hfHsH11vZgwmBlHEe_!!77696187.jpg\"><img class=\"middle\" src=\"https://img.alicdn.com/imgextra/i2/77696187/O1CN01Yjdbx11vZgwlIwF8v_!!77696187.jpg\"><img class=\"middle\" src=\"https://img.alicdn.com/imgextra/i2/77696187/O1CN01lBePgR1vZgwmTcnGM_!!77696187.jpg\"><img class=\"middle\" src=\"https://img.alicdn.com/imgextra/i2/77696187/O1CN01OnSHZn1vZgwjNFadz_!!77696187.jpg\"></p><p><img class=\"middle\" src=\"https://img.alicdn.com/imgextra/i2/77696187/TB2RbBajeuSBuNjSsziXXbq8pXa_!!77696187.jpg\"><img class=\"middle\" src=\"https://img.alicdn.com/imgextra/i4/77696187/TB2y9WKXpXXXXabXFXXXXXXXXXX_!!77696187.jpg\"></p><p><br></p>",
            "img": "https://www.coffeebeats.cn/uploads/O1CN01Q6X4XT1vZgwiJ6TWt_!!77696187.jpg",
            "isGroup": 1,
            "weight": 1,
            "video": null,
            "isMart": 1,
            "kind": "手动工具",
            "offline": 0,
            "catagory": "刨子和刮刀",
            "salesPrice": 550.05,
            "skuItems": null,
            "quanzhong": null
        }, {
            "id": 85,
            "name": "Happy Friend",
            "price": 579,
            "amount": 10,
            "pinPrice": 1,
            "groupMember": 0,
            "introduction": "<p><img class=\"middle\" src=\"https://img.alicdn.com/imgextra/i2/77696187/TB2N.d.XXXXXXbMaXXXXXXXXXXX_!!77696187.jpg\"></p><p><img class=\"middle\" src=\"https://img.alicdn.com/imgextra/i1/77696187/TB27DyDbFXXXXcjXXXXXXXXXXXX_!!77696187.jpg\"></p><p>肩刨的刨刀和刨身等宽，适用于处理加工木料台阶，修整榫头的平整度，后方的旋钮调节刨刀的进刀量，拧松刨身前方的螺丝，就可以调节刨刀前面的滑块，从而改变刨缝的大小。</p><p><strong>鲁班肩刨</strong></p><p>刨身尺寸230*65mm、高80mm、刃宽19mm、刃倾角25度、刨削角度40度、净重955克</p><p><br></p><p><img class=\"middle\" src=\"https://img.alicdn.com/imgextra/i3/77696187/O1CN01hfHsH11vZgwmBlHEe_!!77696187.jpg\"><img class=\"middle\" src=\"https://img.alicdn.com/imgextra/i2/77696187/O1CN01Yjdbx11vZgwlIwF8v_!!77696187.jpg\"><img class=\"middle\" src=\"https://img.alicdn.com/imgextra/i2/77696187/O1CN01lBePgR1vZgwmTcnGM_!!77696187.jpg\"><img class=\"middle\" src=\"https://img.alicdn.com/imgextra/i2/77696187/O1CN01OnSHZn1vZgwjNFadz_!!77696187.jpg\"></p><p><img class=\"middle\" src=\"https://img.alicdn.com/imgextra/i2/77696187/TB2RbBajeuSBuNjSsziXXbq8pXa_!!77696187.jpg\"><img class=\"middle\" src=\"https://img.alicdn.com/imgextra/i4/77696187/TB2y9WKXpXXXXabXFXXXXXXXXXX_!!77696187.jpg\"></p><p><br></p>",
            "img": "https://www.coffeebeats.cn/uploads/O1CN01Q6X4XT1vZgwiJ6TWt_!!77696187.jpg",
            "isGroup": 1,
            "weight": 1,
            "video": null,
            "isMart": 1,
            "kind": "手动工具",
            "offline": 0,
            "catagory": "刨子和刮刀",
            "salesPrice": 550.05,
            "skuItems": null,
            "quanzhong": null
        }],
        contents: '<p>1. 被推荐的新用户输入手机号，即可获赠一张新人指定饮品首杯1.8折券+ 3张全场饮品五折券，可用于消费饮品系列（仅限一件商品，不含配送费），新人指定饮品首杯1.8折券有效期1年。（同一手机号，同一手机仅可领取一次）</p><p>2. 您推荐新用户只要产生消费，您即获得一杯25元体验券，可用于购买经典意式咖啡、营养代餐系列饮品，体验券有效期1年</p><p>3. 您推荐的新用户同一手机设备，同一手机号码仅可领取一次。</p><p>4. 您邀请好友所赠的体验券仅限本人使用，用于商业牟利将有封号风险。</p> '
    },
    onLoad: function (options) {
        this.setData({
            userId: parseInt(options.userid)
        });
        model('base/site/config-list').then(res => {
            this.setData({
                hotGoods: res.data.hotGoods.slice(0,2)
            })
        })
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
    },

    dealVerify(e) {
        this.setData({
            phoneCode: e.detail.value,
            actived: this.data.phoneNum.length > 0 && e.detail.value.length > 0
        })
    },

    dealPhone: function (e) {
        this.setData({
            phoneNum: e.detail.value,
            actived: this.data.phoneCode.length > 0 && e.detail.value.length > 0
        });
        if (this.data.phoneNum.length === 11) {
            this.setData({
                canGetVerify: true
            })
        } else {
            this.setData({
                canGetVerify: false
            })
        }
    },

    goRecords () {
        wx.navigateTo({
            url: '/package/sendOthers/pages/records/records'
        });
    },

    dealTapPhone() {
        this.setData({
            showButtonLineName: true,
            showButtonLinePhone: false
        })
    },

    dealTapVerify() {
        this.setData({
            showButtonLineName: false,
            showButtonLinePhone: true
        })
    },

    getUserInfo() {
        let token = wx.getStorageSync('token');
        let self = this;
        if (token) {
            self.getMessage();
        } else {
            wx.login({
                success: function (res) {
                    if (res.code) {
                        model('my/user/get-open-id2', {
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
                                success: function (res) {
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
                                    self.getMessage();
                                }
                            })
                        })
                    } else {
                        console.log('登录失败！' + res.errMsg)
                    }
                }
            });
        }
        
    },


    getMessage() {
        if (!this.data.showSeconds && this.data.phoneNum && this.data.phoneNum.length === 11) {
            model('my/sms/send-phone-code', {
                phoneNum: this.data.phoneNum
            }, 'POST').then(data => {
                this.setData({
                    showSeconds: true
                });
                console.log(data.data.code);
                // this.setData({
                //     phoneCode: data.data.code
                // });
                let timeRemain = this.data.leftSeconds;
                var interval = setInterval(() => {
                    if (timeRemain > 1) {
                        timeRemain--;
                        this.setData({
                            leftSeconds: timeRemain
                        })
                    } else {
                        this.setData({
                            showSeconds: false,
                            leftSeconds: 60
                        });
                        clearInterval(interval);
                    }
                }, 1000);
            }).catch(e => {
                if (typeof (e) === 'object') {
                    wx.showModal({
                        title: '提示', //提示的标题,
                        content: '您的网络已断开，请重新连接网络', //提示的内容,
                        showCancel: false, //是否显示取消按钮,
                        cancelColor: '#000000', //取消按钮的文字颜色,
                        confirmText: '确定', //确定按钮的文字，默认为取消，最多 4 个字符,
                        confirmColor: '#f50000', //确定按钮的文字颜色
                    });
                }
                if (e && e.indexOf('mobile number') >= 0) {
                    wx.showModal({
                        title: '提示', //提示的标题,
                        content: '请输入正确手机号', //提示的内容,
                        showCancel: false, //是否显示取消按钮,
                        cancelColor: '#000000', //取消按钮的文字颜色,
                        confirmText: '确定', //确定按钮的文字，默认为取消，最多 4 个字符,
                        confirmColor: '#f50000', //确定按钮的文字颜色
                    });
                } else if (e && e.indexOf('触发天级流控') >= 0) {
                    wx.showModal({
                        title: '提示', //提示的标题,
                        content: '当2日验证码获取超过次数，请24小时以后再试', //提示的内容,
                        showCancel: false, //是否显示取消按钮,
                        cancelColor: '#000000', //取消按钮的文字颜色,
                        confirmText: '确定', //确定按钮的文字，默认为取消，最多 4 个字符,
                        confirmColor: '#f50000', //确定按钮的文字颜色
                    });
                } else if (e && e.indexOf('触发小时级流控') >= 0) {
                    wx.showModal({
                        title: '提示', //提示的标题,
                        content: '验证码获取超过次数，请过1小时再试', //提示的内容,
                        showCancel: false, //是否显示取消按钮,
                        cancelColor: '#000000', //取消按钮的文字颜色,
                        confirmText: '确定', //确定按钮的文字，默认为取消，最多 4 个字符,
                        confirmColor: '#f50000', //确定按钮的文字颜色
                    });
                } else if (e && e.indexOf('触发分钟级流控') >= 0) {
                    wx.showModal({
                        title: '提示', //提示的标题,
                        content: '操作太频繁，请过1分钟再试', //提示的内容,
                        showCancel: false, //是否显示取消按钮,
                        cancelColor: '#000000', //取消按钮的文字颜色,
                        confirmText: '确定', //确定按钮的文字，默认为取消，最多 4 个字符,
                        confirmColor: '#f50000', //确定按钮的文字颜色
                    });
                } else {
                    wx.showModal({
                        title: '提示', //提示的标题,
                        content: e, //提示的内容,
                        showCancel: false, //是否显示取消按钮,
                        cancelColor: '#000000', //取消按钮的文字颜色,
                        confirmText: '确定', //确定按钮的文字，默认为取消，最多 4 个字符,
                        confirmColor: '#f50000', //确定按钮的文字颜色
                    });
                }
            });
        } else if (!this.data.phoneNum) {
            wx.showModal({
                title: '提示', //提示的标题,
                content: '请输入手机号', //提示的内容,
                showCancel: false, //是否显示取消按钮,
                cancelColor: '#000000', //取消按钮的文字颜色,
                confirmText: '确定', //确定按钮的文字，默认为取消，最多 4 个字符,
                confirmColor: '#f50000', //确定按钮的文字颜色
            });
        } else if (this.data.phoneNum && this.data.phoneNum.length !== 11) {
            wx.showModal({
                title: '提示', //提示的标题,
                content: '请输入有效的手机号', //提示的内容,
                showCancel: false, //是否显示取消按钮,
                cancelColor: '#000000', //取消按钮的文字颜色,
                confirmText: '确定', //确定按钮的文字，默认为取消，最多 4 个字符,
                confirmColor: '#f50000', //确定按钮的文字颜色
            });
        }
    },

    register() {
        if (!this.data.phoneCode) {
            this.setData({
                errorToastShown: true,
                errorInfo: '请输入验证码'
            })
        } else {
            model(`my/user/login`, {
                unionId: wx.getStorageSync('unionId'),
                sessionKey: wx.getStorageSync('session_key'),
                sysinfo: JSON.stringify(this.data.sysinfo),
                phoneNum: this.data.phoneNum,
                sms_code: this.data.phoneCode,
                openId: wx.getStorageSync('openid'),
                user_name: wx.getStorageSync('personal_info').nickName,
                inviterUserId: this.data.userId
            }, 'POST').then(data => {
                this.setData({
                    token: data.data
                })
                try {
                    let avatar = data.data.user && data.data.user.avatar
                    if (!avatar) {
                        // let imgUrl = wx.getStorageSync('personal_info').avatarUrl
                        let info = wx.getStorageSync('personal_info')
                        this.saveUser(info)
                    }
                } catch (e) {
                    console.log(e);
                }
                wx.setStorageSync('token', data.data);
                if (data.data.ifNew) {
                    wx.showModal({
                      title: '提示', //提示的标题,
                      content: '您已获得新人大礼包\n快去喝一杯吧', //提示的内容,
                      showCancel: false, //是否显示取消按钮,
                      cancelColor: '#000000', //取消按钮的文字颜色,
                      confirmText: '确定', //确定按钮的文字，默认为取消，最多 4 个字符,
                      confirmColor: '#f50000', //确定按钮的文字颜色
                      success: res => {
                        wx.switchTab({
                            url: '/pages/store/store'
                        });
                      }
                    });
                    setTimeout(() => {
                        wx.navigateTo({
                            url: '/package/invite/pages/inviteResult/invite'
                        });
                    }, 1500);
                } else {
                    wx.showModal({
                        title: '提示', //提示的标题,
                        content: '您已是加油咖啡会员了\n快去喝一杯吧', //提示的内容,
                        showCancel: false, //是否显示取消按钮,
                        cancelColor: '#000000', //取消按钮的文字颜色,
                        confirmText: '确定', //确定按钮的文字，默认为取消，最多 4 个字符,
                        confirmColor: '#f50000', //确定按钮的文字颜色
                        success: res => {
                            wx.switchTab({
                                url: '/pages/store/store'
                            });
                        }
                    });
                }
                
            }).catch(e => {
                // this.setData({
                //     token: e.data
                // })
                // try {
                //     let avatar = e.data.user && e.data.user.avatar
                //     if (!avatar) {
                //         // let imgUrl = wx.getStorageSync('personal_info').avatarUrl
                //         let info = wx.getStorageSync('personal_info')
                //         this.saveUser(info)
                //     }
                // } catch (e) {
                //     console.log(e);
                // }
                // wx.setStorageSync('token', e.data);
                wx.showModal({
                    title: '提示', //提示的标题,
                    content: '您已是加油咖啡会员了\n快去喝一杯吧', //提示的内容,
                    showCancel: false, //是否显示取消按钮,
                    cancelColor: '#000000', //取消按钮的文字颜色,
                    confirmText: '确定', //确定按钮的文字，默认为取消，最多 4 个字符,
                    confirmColor: '#f50000', //确定按钮的文字颜色
                });
            });
        }


    },


    saveUser(info) {
        if (!info) {
            return
        }
        const {
            avatarUrl,
            nickName,
            gender
        } = info
        model('file/qiniu/fetch', {
            sourceUrl: avatarUrl
        }, 'POST').then(res => {
            const {
                code,
                data
            } = res
            if (code === 'suc') {
                let {
                    key,
                    url
                } = data
                if (key) {
                    model('my/user/update-user', {
                        avatar: key,
                        userName: nickName,
                        sex: gender
                    }, 'POST').then(res => {
                        console.log(res);
                        if (res.code === 'suc') {
                            this.updateCurrentInfo(url)
                        }
                    }).catch(e => {
                        console.log(e, '[exception]: my/user/update-user');
                    })
                }
            }
        })
    },

    updateCurrentInfo(avatar) {
        if (!avatar) {
            return
        }
        try {
            let token = wx.getStorageSync('token')
            let userInfo = token.user
            token.user = Object.assign(userInfo, {
                avatar: avatar
            })
            wx.setStorageSync('token', token)
        } catch (e) {
            console.log(e);
        }
    },

    goShareSuccess () {
        wx.navigateTo({
            url: '/pages/pay/share_success/share_success'
        });
    },

    goApp () {
        wx.switchTab({ url: '/pages/store/store' });
    },

    bindExtend: function (event) {
        this.setData({
            extended: !this.data.extended
        });
    },
})
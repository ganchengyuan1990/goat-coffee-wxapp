// pages/store/store.js
const app = getApp();
import model from '../../utils/model.js'
import util from '../../utils/util.js'
import {
	BigNumber
} from '../../utils/bignumber.min';

function BN(...args) {
	return new BigNumber(...args)
}
let touchTimer = null
let touchObj = {}
let touchDy = 0
let isOpening = false
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		viewToList: "",
		viewToNav: "",
		scrollTop: 0,
		// scrollview 设定高度
		listHeight: 500,
		activeIndex: 0,
		// isCatePanelShow: false,
		isCartPanelShow: false,
		heigthArr: [],
		storeInfo: {
			banners: {
				pic: ''
			}
		},
		menuList: [],
		cartList: [],
		priceMap: {},
		// 当前选中产品定制化
		currentSpecific: {},
		// 配送地址id
		userAddressInfo: {},
		// 是否自提
		isselfTaking: true,
		isLoadStorageCart: true,
		actImage: '',
		isActWrapShow: false,
		fromTransport: '',
		products: [],
		resultPrice: -1,
		gettingLocation: false,
		futitle: false,
		isLogin: false,
		memberName: '会员',
		memberTagColor: '',
		tagViewName: '',
		chosenTaglength: 0,
		showStoreModal: false,
		fromShare: false,
		fromPaySuccess: false,
		storeArr: [],
		isHigh: false,
		isCoffeeMaker: false,
		modalTitle: '离您最近的门店&咖啡机'
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {

		const systemInfo = wx.getSystemInfoSync();


		// 感觉跟onShow里的fetchLoaction重合了
		// this.fetchLoaction()  
		this.checkSaveUser()


		var globalData = app.globalData;

		this.setData({
			isCoffeeMaker: Boolean(options.isCoffeeMaker),
			isHigh: systemInfo.screenHeight > 800,
			fromShare: Boolean(options.fromShare),
			fromPaySuccess: options.from == 'pay_success'
		})


	},


	// setTabStatus() {
	// 	if (wx.getStorageSync('token') && wx.getStorageSync('STORE_INFO')) {
	// 		let STORE_INFO = JSON.parse(wx.getStorageSync('STORE_INFO'));
	// 		model(`home/cart/list?storeId=${STORE_INFO.id}`).then(res => {
	// 			let sum = 0;
	// 			res.data.carts && res.data.carts.forEach(item => {
	// 				sum += item.num;
	// 			})
	// 			wx.setStorageSync('cartSum', sum);
	// 			if (sum) {
	// 				wx.setTabBarBadge({
	// 					index: 1,
	// 					text: sum.toString()
	// 				});
	// 			} else {
	// 				wx.removeTabBarBadge({
	// 					index: 1,
	// 				});
	// 			}
	// 		}).catch(e => {

	// 		});
	// 	}
	// },

	setFirstAlert(activityId) {
		let indexToastArr = wx.getStorageSync('indexToastArr') || {};
		let toast = false;
		if (!indexToastArr[activityId]) {
			toast = true;
			indexToastArr[activityId] = new Date().getTime();
		} else {
			let now = new Date().getTime();
			if (now - indexToastArr[activityId] > 86400000) {
				indexToastArr[activityId] = now;
				toast = true;
			}
		}
		if (toast) {
			wx.setStorageSync('indexToastArr', indexToastArr);
		}
		return toast;
	},

	showActivityToast(dailyActivitys, enableMaps) {
		let enableArrs = [];
		let enableMapsArr = Object.keys(enableMaps || {});
		// let firstDailyActivityId = dailyActivitys[0].id;
		if (!wx.getStorageSync('token')) {
			dailyActivitys = dailyActivitys.filter(item => {
				return item['no_login_user_if_alert'] === 1;
			});
		}
		if (!dailyActivitys[0]) {
			return;
		}
		if (enableMapsArr.length == 0 && this.setFirstAlert(dailyActivitys[0].id)) {
			return dailyActivitys[0];
		} else {
			enableMapsArr.map(item => {
				if (enableMaps[item]) {
					enableArrs.push(parseInt(item));
				}
				return item;
			})
		}
		let index = -1;

		for (let i = 0; i < dailyActivitys.length; i++) {
			index = enableArrs.indexOf(dailyActivitys[i].id);
			if (index >= 0 && this.setFirstAlert(dailyActivitys[i].id)) {
				return dailyActivitys[i];
			}
		}
		return null;
	},

	goStoreIndex (e) {
		const item = e.detail;
		if (item.coffeeMakerId) {
			this.setData({
				isCoffeeMaker: true
			}, this.formatStoreInfo(item))
		} else {
			this.setData({
				isCoffeeMaker: false
			}, this.formatStoreInfo(item))
		}
	},

	closeToast(e) {
		this.setData({
			isActWrapShow: false
		});
		if (e && e.detail === true) {
			return ;
		}
		if (this.data.toShowModal) {
			if (this.data.toShowModal.type === 0) {
				wx.showModal({
					title: '提示',
					confirmColor: '#DE4132', //确定按钮的文字颜色,
					showCancel: false,
					content: this.data.toShowModal.content,
					confirmText: '我知道了'
				})
			} else {
				const data = this.data.toShowModal.content;
				this.setData({
					storeArr: data.slice(0, 2),
					showStoreModal: true,
					modalTitle: this.data.isCoffeeMaker ? '离您最近的门店&咖啡机' : '离您最近的门店&咖啡机'
				})
				let storeInfo = data[0]
				this.formatStoreInfo(storeInfo, true)
			}
			this.setData({
				toShowModal: null
			});
		}
	},


	setTabStatus(id) {
		if (wx.getStorageSync('token') && wx.getStorageSync('STORE_INFO')) {
			let STORE_INFO = JSON.parse(wx.getStorageSync('STORE_INFO'));
			model(`home/cart/list?storeId=${id || STORE_INFO.id}`).then(res => {
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
				} else {
					wx.removeTabBarBadge({
						index: 1,
					});
				}
			}).catch(e => {

			});
		}
	},
	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady() {
		let height1, height2;
		let res = wx.getSystemInfoSync();
		let winHeight = res.windowHeight;
		let query = wx.createSelectorQuery();
		query.select(".J_hd_wrap").boundingClientRect();
		query.exec(res => {
			height1 = res[0].height;
			let query1 = wx.createSelectorQuery();
			query1.select(".J_img_wrap").boundingClientRect();
			query1.exec(res => {
				height2 = res[0] && res[0].height;
				console.log(height2);
				this.setData({
					listHeight: winHeight - height1 - (height2 || 0)
				});
				// this.calculateHeight();
			});
		});
	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow() {
		if (this.data.isCoffeeMaker) {
			// this.clearCart();
		}
		if (wx.getStorageSync('token')) {
			Promise.all([model('base/site/config-list'), model('base/site/user-config-list')]).then((resArr) => {
				const res = resArr[0];
				const userRes = resArr[1];
				// const userRes = resArr[1];
				let configSet = res.data['config-set'];
				wx.setStorageSync('configData', res.data['config-set']);
				if (res.data.homeBanners && res.data.homeBanners[0] && res.data.homeBanners[0].pic) {
					let banners = [];

					this.setData({
						banner: res.data.homeBanners
						// banner: ['https://img.goatup.cn/img/banner/home-banner-1.png'
					})
				}
				this.setData({
					youngYshareBanner: configSet['jy-share-banner'],
					enableWeeklyActivity: userRes.data["enable-weekly-activity"],
					actualDrinkNum: userRes.data["actual-drink-num"],
					// existLuckActivity: false
					youngHomeOrderImg: res.data['young-home-order-img'],
					existInviteActivity: Boolean(configSet['exist-invite-activity']),
					existLuckActivity: Boolean(configSet['exist-luck-activity']),
					continueDrinkActivity: Boolean(configSet['continue-drink-activity']),
				});
				let activityObj = this.showActivityToast(res.data.dailyActivitys, userRes.data['enable-daily-activity-map']);
				let extra_config_json = {};
				if (activityObj && activityObj.extra_config_json) {
					extra_config_json = JSON.parse(activityObj.extra_config_json);
				}

				if (activityObj) {
					this.setData({
						actImage: activityObj.coupon_modal_pic,
						actUrl: extra_config_json.redirect_url,
						actRoute: extra_config_json.redirect_route,
						activityObj: activityObj,
						isActWrapShow: true
					});
				}
				wx.hideLoading();
			}).catch(e => {
				wx.hideLoading();
			});
		} else {
			model('base/site/config-list').then(res => {
				let configSet = res.data['config-set'];
				wx.setStorageSync('configData', res.data['config-set']);
				if (res.data.homeBanners && res.data.homeBanners[0] && res.data.homeBanners[0].pic) {
					let banners = [];
					// res.data.homeBanners.forEach(item => {
					//     banners.push(item.pic);
					// })
					this.setData({
						banner: res.data.homeBanners
					})
				}
				this.setData({
					youngYshareBanner: configSet['jy-share-banner'],
					// existLuckActivity: false
					youngHomeOrderImg: res.data['young-home-order-img'],
					existInviteActivity: Boolean(configSet['exist-invite-activity']),
					existLuckActivity: Boolean(configSet['exist-luck-activity']),
					continueDrinkActivity: Boolean(configSet['continue-drink-activity']),
				})
				wx.hideLoading();
				// this.judgeNewUser(res.data);
				let activityObj = {};
				// let activityObj = this.showActivityToast(res.data.dailyActivitys, {});
				if (activityObj && activityObj.extra_config_json) {
					extra_config_json = JSON.parse(activityObj.extra_config_json);
				}
				if (activityObj) {
					this.setData({
						actUrl: extra_config_json.redirect_url,
						actRoute: extra_config_json.redirect_route,
						actImage: activityObj.coupon_modal_pic,
						activityObj: activityObj,
						isActWrapShow: true
					});
				}
			}).catch(e => {
				wx.hideLoading();
			});
		}
		if (typeof this.getTabBar === 'function' &&
			this.getTabBar()) {
			this.getTabBar().setData({
				selected: 1
			})
		}
		wx.removeStorageSync('showNoOrder');
		let isLogin = this.checkLogin()
		this.setData({
			isLogin: isLogin
		})
		let fromTransport = app.globalData.fromTransport
		// let isGeoAuth = app.globalData.isGeoAuth
		if (fromTransport) {
			this.setData({
				fromTransport: fromTransport,
				isCoffeeMaker: Boolean(fromTransport && fromTransport.isCoffeeMaker)
			}, () => {
				if (this.data.isCoffeeMaker) {
					// this.clearCart();
				}
				this.loadAddress(fromTransport);
			})
		} else {
			let fromPaySuccess = app.globalData.fromPaySuccess;
			if (fromPaySuccess || this.data.fromShare || this.data.fromPaySuccess) {
				this.fetchLoaction(null, true);
				app.globalData.fromPaySuccess = '';
			} else {
				this.fetchLoaction(null, false);
			}
			
			// if (!isGeoAuth) {
			// 	this.checkAuth()
			// }
			let storeInfo = wx.getStorageSync('STORE_INFO')
			let isGeoAuth = app.globalData.isGeoAuth
			let addressList = wx.getStorageSync('addressList');
			if (addressList && addressList.length === 0) {
				this.setData({
					userAddressInfo: null
				});
			}
			// if (storeInfo) {
			// 	this.setData({
			// 		storeInfo: JSON.parse(storeInfo)
			// 	})
			// }
			console.log(isGeoAuth, 'isGeoAuth');
			if (!isGeoAuth && !this.data.gettingLocation) {
				this.fetchLoaction(null, false)
			}

			// if (this.data.isLoadStorageCart) {
			// 	this.getStorageCart()
			// }
			// this.toggleTabBar(true);
		}
		if (!isLogin) {
			return
		}
		let info = wx.getStorageSync('token') || {}
		// let isLogin = this.checkLogin()
		// 登录检查逻辑后移
		let isNew = info.ifNew
		let configPic = ''

		try {
			configPic = info.config.newUserPic
		} catch (e) {
			// console.log(e);
		}
		let memberData = wx.getStorageSync('memberData')
		if (memberData) {
			let lalala = {
				"青麦": "linear-gradient(270deg,rgba(191,210,167,1) 0%,rgba(128,155,90,1) 100%)",
				"银麦": "linear-gradient(270deg,rgba(209,209,209,1) 0%,rgba(148,148,148,1) 100%)",
				'金麦': 'linear-gradient(270deg,rgba(216,204,178,1) 0%,rgba(193,175,136,1) 100%)',
				'铂金': 'linear-gradient(270deg,rgba(195,174,214,1) 0%,rgba(124,97,149,1) 100%)',
				'钻石': 'linear-gradient(270deg,rgba(202,155,155,1) 0%,rgba(161,86,86,1) 100%)',
				'黑金': 'linear-gradient(270deg,rgba(132,132,132,1) 0%,rgba(0,0,0,1) 100%)'
			}
			this.setData({
				memberName: memberData.currentDesign.name,
				memberTagColor: lalala[memberData.currentDesign.name]
			});
		}
		if (isNew && configPic) {
			this.setData({
				actImage: configPic,
				isActWrapShow: true
			})
			try {
				let token = wx.getStorageSync('token')
				token.ifNew = false
				wx.setStorageSync('token', token)
			} catch (e) {
				console.log(e);
			}
		}
		// console.log(app.globalData, 'globalData')
		
		this.setTabStatus();
	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh() {},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom() {},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage() {
		return {
			title: '快来喝一杯加油咖啡',
			path: `/pages/store/store?fromShare=1`,

			imageUrl: this.data.youngYshareBanner,
			success: function (res) {

			},
			fail: function (res) {
				// 转发失败
			}
		}

	},

	clearCart() {
		model(`home/cart/change-number`, {
			ifClearOther: true
		}, 'POST').then(data => {
		}).catch(e => {
		});
	},
	checkLogin() {
		let info = wx.getStorageSync('token') || {}
		return info.token
	},
	/**
	 * 验证是否获得授权
	 */
	checkAuth() {
		wx.getSetting({
			success(res) {
				const {
					authSetting
				} = res
				// console.log(authSetting, 'setting');
				if (!authSetting['scope.userLocation']) {
					wx.showModal({
						title: '提示',
						content: '需要您的授权才能推荐附近的店铺信息',
						showCancel: false,
						confirmColor: '#f50000', //确定按钮的文字颜色,
						success(res) {
							if (res.confirm) {
								wx.openSetting()
							}
						}
					})
				}
			}
		})
	},


	getBestCouponByProduct() {
		model(`home/coupon/get-best-coupon-by-product`, {
			uid: wx.getStorageSync('token').user.id,
			list: this.data.products
		}).then(data => {
			let {
				resultPrice
			} = data.data;
			if (data.data && data.data.discountMoney > 0) {
				this.setData({
					resultPrice: resultPrice
				})
			}
		}).catch(e => {
			console.log(e);
		});
	},

	/**
	 * 选择地址后重加载
	 */
	loadAddress(data) {
		const {
			type,
			detail
		} = data
		let info = detail.detail
		if (type === 'deliver') {
			this.setData({
				userAddressInfo: info || {},
				isselfTaking: true
			})
			this.fetchLoaction(info, true)
		} else if (type === 'selfTaking') {
			this.setData({
				isselfTaking: true
			})
			this.setTabStatus(info.id)
			this.formatStoreInfo(info)
		} else {
			this.fetchLoaction(null, true)
		}
	},
	/**
	 * 获取经纬度
	 */
	fetchLoaction(info, forceUpdate) {
		let configData = wx.getStorageSync('configData');
		let token = wx.getStorageSync('token');
		let appCache = configData['wxapp-cache-control'];
		if (!forceUpdate && appCache && token) {
			console.log(app.globalData.lastStoreTime, 888);
			if (app.globalData.lastStoreTime) {
				console.log(app.globalData.lastStoreTime, 99999);
				let lastTime = app.globalData.lastStoreTime;
				let nowTime = new Date().getTime();
				app.globalData.lastStoreTime = nowTime;
				if (nowTime - lastTime <= parseInt(appCache) * 1000) {
					return;
				}
			} else {
				app.globalData.lastStoreTime = new Date().getTime();
			}
		}
		
		let self = this
		this.setData({
			gettingLocation: true
		})
		wx.showLoading({
			title: '加载中',
		})
		if (info) {
			if (self.data.isCoffeeMaker && info.id) {
				self.formatStoreInfo(info, true)
				self.setTabStatus(info.id)
			} else {
				self.setTabStatus(info.id)
				self.fetchStore({
					lng: info.longitude,
					lat: info.latitude
				}, self.data.isCoffeeMaker)
			}
			
		} else {
			if (app.globalData.storeInfo) {
				let _info = app.globalData.storeInfo;
				if (self.data.isCoffeeMaker && _info.id) {
					self.formatStoreInfo(_info, true)
					self.setTabStatus(_info.id)
				} else {
					self.setTabStatus(_info.id)
					self.formatStoreInfo(_info, true)
				}
				return ;
			}
			wx.getLocation({
				type: 'wgs84',
				success(res) {
					let {
						latitude,
						longitude
					} = res
					console.log(latitude, longitude, '定位信息');
					// latitude = 31.1949185300
					// longitude = 121.3103584400
					let geo = {
						lng: longitude,
						lat: latitude
					}
					self.setData({
						gettingLocation: false
					})
					app.globalData.isGeoAuth = true
					app.globalData.userGeo = geo
					console.log(8989);
					self.fetchStore(geo, self.data.isCoffeeMaker)
				},
				fail() {
					self.setData({
						gettingLocation: false
					})
					self.checkAuth()
					app.globalData.isGeoAuth = false
					wx.hideLoading()
					wx.showToast({
						title: '加载失败,请检查是否打开微信及小程序定位权限',
						icon: 'none',
						duration: 3500
					})
				}
			})
		}
		
	},
	/**
	 * 获取店铺信息
	 * 
	 */
	fetchStore(geo, isCoffeeMaker) {
		let targetUrl = 'home/lbs/get-store-list-by-location'
		// if (isCoffeeMaker) {
		// 	targetUrl = 'home/lbs/get-store-list-by-location-for-vmc'
		// }
		model(targetUrl, {
			lng: geo.lng,
			lat: geo.lat,
			// lng: 121.3105785000,
			// lat: 31.1947329100,
			page: 1
		}).then(res => {
			const {
				data
			} = res
			if (data && data.length == 1) {
				// if (data.length > 1) {
				// 	wx.showModal({
				// 		title: '提示',
				// 		content: '请选择店铺',
				// 		showCancel: false,
				// 		success(res) {
				// 			if (res.confirm) {
				// 				wx.navigateTo({
				// 					url: `/pages/transport/transport?from=store&tab=delivery`
				// 				})
				// 			}
				// 		}
				// 	})
				// } else {
				let storeInfo = data[0]
				this.formatStoreInfo(storeInfo)
				// }
			} else if (data && data.length > 1) {
				if (this.data.isActWrapShow) {
					this.setData({
						toShowModal: {
							type: 1,
							content: data.slice(0, 2)
						}
					})
					return;
				}
				this.setData({
					storeArr: data.slice(0,2),
					showStoreModal: true,
					modalTitle: this.data.isCoffeeMaker ? '离您最近的门店&咖啡机' : '离您最近的门店&咖啡机'
				})
				let storeInfo = data[0]
				this.formatStoreInfo(storeInfo, true)
				// wx.hideLoading();
			}
		}).catch(e => {
			console.log(e)
			wx.hideLoading()
			wx.showToast({
				title: '加载失败',
				icon: 'none',
				duration: 2000
			})
		})
	},
	formatStoreInfo(storeInfo, noToast) {
		if (!storeInfo) {
			return
		}
		app.globalData.storeInfo = storeInfo;
		// debugger
		wx.setStorage({
			key: 'STORE_INFO',
			data: JSON.stringify(storeInfo)
		})
		let distance = storeInfo.distance
		let formatDistance = ''
		try {
			if (distance < 1000) {
				formatDistance = `${Math.round(distance)}m`
			} else if (distance < 3000) {
				formatDistance = `${parseFloat(distance/1000).toFixed(1)}km`
			} else {
				formatDistance = `>3km`
			}
			// wx.setStorageSync('distance', distance);
		} catch (e) {
			console.log(e);
		}
		if (parseFloat(storeInfo.distance) > 3000 && !noToast) {
			let fromTransport = wx.getStorageSync('fromTransport');
			let place = this.data.isCoffeeMaker ? '咖啡机' : '店铺';
			let content = `您与${place}的距离超过3公里，请确认${place}是${storeInfo.storeName}`
			// if (fromTransport == 'deliver') {
			// 	content = "您与门店的距离太远了，已超出配送范围~"
			// }
			if (this.data.isActWrapShow) {
				this.setData({
					toShowModal: {
						type: 0,
						content: content
					}
				})
			} else {
				wx.showModal({
					title: '提示',
					confirmColor: '#DE4132', //确定按钮的文字颜色,
					showCancel: false,
					content: content,
					confirmText: '我知道了'
				})
			}
		}
		storeInfo.distance = formatDistance
		this.setData({
			storeInfo: storeInfo,
			isCoffeeMaker: storeInfo.scene === 2
		})

		// console.log(storeInfo, 'storeinfo')
		this.fetchProduct(storeInfo.id)
	},
	/**
	 * 获取商品信息
	 */
	fetchProduct(storeId) {
		wx.showLoading({
			title: '加载中',
		})
		model('home/product/all', {
			storeId: storeId
		}).then(res => {
			console.log(res, 'detail')
			const {
				data
			} = res

			const list = data.classify_list;
			// 计算单品价格
			if (list.length > 0) {
				list.map(item => {
					item.isHeader = true;
					item.product_list.forEach(ele => {
						if (ele.sku_list && ele.sku_list[0]) {
							ele.price = ele.sku_list[0].price;
						}
						if (ele.default_sku) {
							let sss = parseFloat(parseFloat(ele.default_sku.sale_price));
							// let sss = parseFloat(parseFloat(ele.default_sku.sale_price) + parseFloat(ele.default_prop.price)).toFixed(2);
							if (this.data.isLogin) {
								sss = parseFloat(parseFloat(ele.default_sku.member_price));
								// sss = parseFloat(parseFloat(ele.default_sku.member_price) + parseFloat(ele.default_prop.price)).toFixed(2);
							}
							ele.default_sku.orinalPrice = (sss == parseInt(sss) ? parseInt(sss) : parseFloat(sss).toFixed(1));
							if (ele.default_sku.price) {
								ele.default_sku.price = (ele.default_sku.price == parseInt(ele.default_sku.price) ? parseInt(ele.default_sku.price) : parseFloat(ele.default_sku.price).toFixed(1));
							}
							ele.default_sku.sale_price = (ele.default_sku.sale_price == parseInt(ele.default_sku.sale_price) ? parseInt(ele.default_sku.sale_price) : parseFloat(ele.default_sku.sale_price).toFixed(1));
							// if (ele.default_prop.price) {
							// 	let sss_orinals = parseFloat(ele.default_prop.price).toFixed(2);
							// 	console.log(sss_orinals, 999);
							// 	ele.default_sku.price = (sss_orinals == parseInt(sss_orinals) ? parseInt(sss_orinals) : parseFloat(sss_orinals).toFixed(1));
							// }

						}
					})
					if (item.name === '能量包套餐组合') {
						item.product_list.forEach(ele => {
							if (ele.sku_list && ele.sku_list[0]) {
								ele.default_sku.orinalPrice = parseFloat(ele.default_sku.sale_price).toFixed(2);
								if (this.data.isLogin) {
									ele.default_sku.orinalPrice = parseFloat(ele.default_sku.member_price).toFixed(2);
								}
								ele.default_sku.sale_price = (ele.default_sku.sale_price == parseInt(ele.default_sku.sale_price) ? parseInt(ele.default_sku.sale_price) : parseFloat(ele.default_sku.sale_price).toFixed(1));
								var key_list = ele.key_list;
								key_list.forEach(e => {
									e.val_list.forEach(a => {
										if (a.isdefault === 1) {
											ele.default_sku.orinalPrice = parseFloat(parseFloat(ele.default_sku.orinalPrice) + a.price).toFixed(2);
										}
									})
								})
							}
						})
					}
					if (item.tips) {
						// item.tips = item.tips.substr(0, item.tips.length - 1);
					}
					return item;
				});
			} else {
				wx.showModal({
					content: '此店铺目前暂时还未开业，敬请期待！',
					showCancel: false, //是否显示取消按钮,
					cancelColor: '#000000', //取消按钮的文字颜色,
					confirmText: '去别处逛', //确定按钮的文字，默认为取消，最多 4 个字符,
					confirmColor: '#DAA37F', //确定按钮的文字颜色,
					success: res => {
						if (res.confirm) {
							wx.navigateTo({
								url: '/pages/transport/transport?type=1'
							});
						} else if (res.cancel) {
							console.log('查看发票记录')
						}
					}
				})
				wx.hideLoading()
				return;
			}
			

			const recommend = data.recommend
			if (recommend) {
				wx.setStorageSync('recommend', recommend);
			}
			list[0].isHeader = false;
			this.setData({
				scrollTop: 0,
				menuList: list,
				tagViewName: list && list.length > 0 ? list[0].name : '',
				chosenTaglength: list && list.length > 0 ? list[0].product_list.length : 0,
			})
			this.generatePriceMap()
			this.calculateHeight()
			wx.hideLoading()
		}).catch(e => {
			console.log(e)
			wx.hideLoading()
			wx.showToast({
				title: '加载失败',
				icon: 'none',
				duration: 2000
			})
		})
	},

	/*
	 * 生成价格信息对照表 
	 */
	generatePriceMap() {
		let list = this.data.menuList
		let obj = {}
		// 使用 productid-skuid 对应价格map表
		// console.log(list, 'list');

		list.forEach(i => {
			let pList = i.product_list
			pList.forEach(j => {
				let sList = j.sku_list
				sList.forEach(k => {
					let key = k.productId + '-' + k.propSkuId
					obj[key] = k.sale_price
				})
			})
		})
		this.setData({
			priceMap: obj
		})
		wx.setStorageSync('PRICE_MAP', JSON.stringify(obj))
		// if (this.data.isLoadStorageCart) {
		// 	this.getStorageCart()
		// }
	},
	/**
	 *  
	 */
	getStorageCart() {
		let data = wx.getStorageSync('CART_LIST')
		let priceMapString = wx.getStorageSync('PRICE_MAP')
		let list = JSON.parse(data || '[]')
		// let priceMap = this.data.priceMap
		let priceMap = JSON.parse(priceMapString || '{}')
		// console.log(priceMap, 'priceMap');
		
		this.setData({
			isLoadStorageCart: false
		})
		let remainList = list.filter(item => {
			let customedKey = item.customedKey
			let key = ''
			let keys = customedKey.match(/\d+-\d+/)
			if (keys) {
				key = keys[0]
			}

			if (key && priceMap[key]) {
				// TODOS 此处可添加重新计算价格逻辑
				// 同时需要计算总价格
				// item.price = priceMap[key]
				// item.totalPrice = BN(item.price).mul...
				return item
			}
		})
		// console.log(remainList, 'remainList');
		// console.log(list, 'list');
		
		
		// if (remainList.length !== list.length) {
		// 	wx.showModal({
		// 		title: '提示',
		// 		content: '购物车部分商品缺货',
		// 		confirmText: '我知道了'
		// 	})
		// }
		let arr = this.data.cartList
		arr = arr.concat(remainList)
		this.mergeCart(arr)
		// this.getBestPaySolution();
	},
	calculateHeight() {
		let heigthArr = [];
		let height = 0;
		heigthArr.push(height);
		var query = wx.createSelectorQuery();
		query.selectAll(".J_group").boundingClientRect();
		query.exec(res => {
			// console.log(res, 'res')
			for (let i = 0; i < res[0].length; i++) {
				height += parseInt(res[0][i].height);
				let addValue = i > 2 ? (30 * i - 23) : (30 * i + 3);
				heigthArr.push(height + addValue);
			}
			this.setData({
				heigthArr: heigthArr
			});
		});

	},
	selectNav(e) {
		let menulist = JSON.parse(JSON.stringify(this.data.menuList));
		menulist.map(item => {
			item.isHeader = true;
			return item;
		})
		menulist[e.currentTarget.dataset.index].isHeader = false;
		// console.log(e.currentTarget.dataset.index, e.currentTarget.dataset.navid)
		this.setData({
			activeIndex: e.currentTarget.dataset.index,
			viewToList: e.currentTarget.dataset.navid,
			tagViewName: this.data.menuList[e.currentTarget.dataset.index].name,
			chosenTaglength: this.data.menuList[e.currentTarget.dataset.index].product_list.length,
			menuList: menulist
		});
	},

	// 手机端有延迟 节流函数效果不好 用防抖函数凑合
	scroll(e) {
		(util.throttle(() => {
			let srollTop = e.detail.scrollTop;
			// console.log(srollTop, 1000);
			for (let i = 0; i < this.data.heigthArr.length; i++) {
				if (
					srollTop >= this.data.heigthArr[i] &&
					srollTop < this.data.heigthArr[i + 1] &&
					this.data.activeIndex != i
				) {
					let menulist = JSON.parse(JSON.stringify(this.data.menuList));
					menulist.map(item => {
						item.isHeader = true;
						return item;
					})
					menulist[i].isHeader = false;
					this.setData({
						activeIndex: i,
						tagViewName: this.data.menuList[i].name,
						chosenTaglength: this.data.menuList[i].product_list.length,
						menuList: menulist
					});
					if (i < 3) {
						this.setData({
							viewToNav: 'nav16'
						})
					} else {
						this.setData({
							viewToNav: 'nav' + (i - 2)
						})
					}
					return;
				}
			}
		}, 80))()
	},
	orderProduct(e) {

		let groupIdx = e.currentTarget.dataset.groupidx
		let productIdx = e.currentTarget.dataset.productidx
		let skulist = e.currentTarget.dataset.skulist;
		var soldout = true
		skulist.forEach(function (item) {
			if (item.state === 1) {
				soldout = false
			}
		})
		if (soldout) {
			wx.showModal({
				title: '提示', //提示的标题,
				content: '此商品已售罄', //提示的内容,
				showCancel: false,
				confirmText: '确定', //确定按钮的文字，默认为取消，最多 4 个字符,
				confirmColor: '#f50000'
			});
			return;
		}
		// let detail = `menuList[${groupIdx}].product_list[${productIdx}]`
		let detail = this.data.menuList[groupIdx].product_list[productIdx]
		this.setData({
			currentSpecific: detail
		})
		this.toggleSpecific();
	},
	toggleSpecific() {
		if (isOpening) {
			return
		}
		isOpening = true
		let isShow = this.data.isCatePanelShow
		// this.setData({
		// 	isCatePanelShow: !isShow
		// })
		if (isShow) {
			// this.toggleTabBar(true, () => {
			// 	isOpening = false
			// })
			isOpening = false;
			this.setData({
				isCatePanelShow: !isShow
			})
		} else {
			// this.toggleTabBar(false, () => {
			// 	this.setData({
			// 		isCatePanelShow: !isShow
			// 	})
			// })
			this.setData({
				isCatePanelShow: !isShow
			})
			// for temp 
			setTimeout(() => {
				isOpening = false
			}, 500);
		}
	},
	/**
	 * 添加到购物车 
	 */
	saveCart(e) {
		let cart = e.detail.cartList
		if (e.detail) {
			this.mergeCart(cart)
			// this.getBestPaySolution();
		}
		
	},
	addCart(e) {
		let isOpen = this.checkStoreState()
		if (!isOpen) {
			wx.setStorageSync('shopClosed', 1);
			return
		}
		wx.showToast({
			title: '已加入购物车',
			icon: 'none',
			duration: 1500
		})
		this.toggleSpecific()
		let cart = this.data.cartList
		if (e.detail) {
			cart.push(e.detail)
		}
		this.mergeCart(cart)
		// this.getBestPaySolution();
	},

	goOrder(info) {
		wx.showLoading({
			title: '跳转提单页', //提示的内容,
			mask: true, //显示透明蒙层，防止触摸穿透,
			success: res => {}
		});
		model(`home/cart/list?storeId=${this.data.storeInfo.id}`).then(data => {
			let {
				carts
			} = data.data;
			let sum = 0;
			let products = carts.map(item => {
				//  item.ifAvailable = false;
				//  item.sku.can_distribution = 0;
				item.unitPrice = parseFloat(item.unitPrice).toFixed(1);
				item.memberPrice = parseFloat(item.memberUnitPrice).toFixed(1);
				item.propsStr = [];
				item.propsStr.push(item.sku.name);
				item.rPropGoodsArray && item.rPropGoodsArray.forEach(ele => {
					item.propsStr.push(ele.propValue.prop_value);
				});
				item.propsStr = item.propsStr.join('/');
				item.checked = true;
				sum += item.num;
				return Object.assign({}, {
					productName: item.goods.name,
					productId: item.goods.id,
					skuId: item.sku.id,
					skuName: item.sku.name,
					number: item.num,
					memberPrice: item.memberPrice,
					price: item.unitPrice,
					productPropIds: (item.rPropGoodsIds || []).join(','),
					spec: item.propsStr,
					banner: item.goods.avatar
				})
			});
			// wx.setStorageSync('cartSum', sum)


			let obj = {
				storeId: this.data.storeInfo.id,
				payAmount: 0,
				orderType: 1,
				product: products
			}

			const url = `/pages/pay/checkout/checkout?isCoffeeMaker=1&fromTransportId=${this.data.fromTransport && this.data.fromTransport.id}&fromTransportIndex=${this.data.fromTransport && this.data.fromTransport.idx}&data=${encodeURIComponent(JSON.stringify(obj))}&tab=selfTaking`
			wx.navigateTo({
				url: url,
				success() {}
			})

			wx.hideLoading();
		}).catch(e => {
			wx.hideLoading();
			this.setData({
				loading: false
			});
			console.log(e);
		});
	},
	toggleCart() {
		if (isOpening) {
			return
		}
		isOpening = true
		let isShow = this.data.isCartPanelShow
		let self = this

		if (!isShow) {
			self.setData({
				isCartPanelShow: !isShow
			})
			// this.toggleTabBar(false, () => {
			// 	self.setData({
			// 		isCartPanelShow: !isShow
			// 	})
			// })
		} else {
			// this.toggleTabBar(true)
			self.setData({
				isCartPanelShow: !isShow
			})
		}
		// for temp 
		setTimeout(() => {
			isOpening = false
		}, 500);
	},
	toggleTabBar(isShow, callback) {
		if (!isShow) {
			wx.hideTabBar({
				animation: true,
				success() {
					setTimeout(() => {
						callback && callback()
					}, 200)
				},
				fail() {}
			})
		} else {
			callback && callback()
			setTimeout(() => {
				wx.showTabBar({
					animation: true,
					success() {

					},
					fail() {}
				})
			}, 200)

		}
	},
	checkStoreState() {
		let isOpen = this.data.storeInfo.state === 1
		if (!isOpen) {
			wx.showModal({
				title: '提示',
				content: '我们已经打烊了呦，请明天再来呦。',
				showCancel: false,
				confirmColor: '#f50000', //确定按钮的文字颜色,
			})
			return false
		}
		return true
	},
	checkout(e) {
		let self = this
		let token = wx.getStorageSync('token').token
		if (!token) {
			wx.navigateTo({
				url: '/pages/login/login'
			})
			return
		}
		let isOpen = this.checkStoreState()
		if (!isOpen) {
			return
		}
		let info = this.data
		let cartList = e.detail.cart
		let totalPrice = e.detail.totalPrice
		let isNeedFee = e.detail.isNeedFee

		// console.log(cartList, 'cartList')
		if (cartList.length === 0) {
			wx.showToast({
				icon: 'none',
				title: '请选择商品'
			})
			return
		}
		let products = cartList.map(item => {
			let skuList = item.sku_list
			let obj = skuList.find(item => item.isdefault === 1) || {}
			let propList = item.key_list
			let propIds = []
			propList.forEach(i => {
				let idObj = i.val_list.find(j => {
					return parseInt(j.id) === parseInt(i.default_val_id)
				})

				if (idObj) {
					propIds.push(idObj.prop_id)
				}
			})
			return Object.assign({}, {
				productName: item.productName,
				productId: item.id,
				skuId: obj.id,
				skuName: obj.propSkuName,
				number: item.count,
				price: obj.sale_price,
				productPropIds: propIds.join(','),
				spec: item.spec
			})
		})
		let fee = isNeedFee ? info.storeInfo.deliverFee : 0
		let obj = {
			storeId: info.storeInfo.id,
			userAddressId: this.data.userAddressInfo && this.data.userAddressInfo.id || info.userAddressId,
			deliverFee: fee,
			payAmount: totalPrice,
			orderType: info.isselfTaking ? 2 : 1,
			product: products
		}

		const url = `/pages/pay/checkout/checkout?fromTransportIndex=${this.data.fromTransport.idx}&data=${encodeURIComponent(JSON.stringify(obj))}&tab=${this.data.isselfTaking?'selfTaking':'delivery'}`
		// this.setData({
		// 	isCartPanelShow: false
		// })
		// wx.showTabBar()
		// this.toggleCart()
		wx.navigateTo({
			url: url,
			success() {
				self.setData({
					cartGoods: [],
					resultPrice: -1,
					isLoadStorageCart: true
				})
			}
		})
	},
	selectAddress(e) {
		// let type = e.currentTarget.dataset.delivery
		// if (type == 'delivery') {
		// 	return ;
		// }
		let type = this.data.storeInfo.coffeeMakerId ? 'delivery' : 'selfTaking'
		wx.navigateTo({
			url: `/pages/transport/transport?from=store&tab=${type}`
		})
	},
	/*
	 * 合并相同品类
	 */
	mergeCart(list) {
		if (!Array.isArray(list)) {
			return
		}
		// 验证skuid， propids, productId一致性
		// count total price

		let cartList = list
		let obj = {}
		cartList.forEach(item => {
			let key = item.customedKey
			let val = obj[key]
			if (val) {
				val.count = BN(val.count).plus(item.count).valueOf()
				val.totalPrice = BN(val.count).multipliedBy(val.price).valueOf()
			} else {
				obj[key] = item
			}
		})
		// let arr = Object.values(obj)
		let arr = []
		for (let i in obj) {
			if (obj[i]) {
				arr.push(obj[i])
			}
		}
		this.setData({
			cartList: arr
		})
		wx.setStorage({
			key: 'CART_LIST',
			data: JSON.stringify(arr)
		})
	},

	/**
	 * 实时获取最优下单方案
	 */
	getBestPaySolution() {
		let _cartList = Object.assign(this.data.cartList)
		let products = _cartList.map(item => {
			let skuList = item.sku_list
			let obj = skuList.find(item => item.isdefault === 1) || {}
			let propList = item.key_list
			let propIds = []
			propList.forEach(i => {
				let idObj = i.val_list.find(j => {
					return parseInt(j.id) === parseInt(i.default_val_id)
				})

				if (idObj) {
					propIds.push(idObj.prop_id)
				}
			})
			return Object.assign({}, {
				productName: item.productName,
				productId: item.id,
				skuId: obj.id,
				skuName: obj.propSkuName,
				number: item.count,
				price: obj.sale_price,
				productPropIds: propIds.join(','),
				spec: item.spec,
				num: item.count,
				// totalPrice: item.count * obj.sale_price
			})
		})
		this.setData({
			products: products
		});
		if (wx.getStorageSync('token') && wx.getStorageSync('token').user) {
			// this.getBestCouponByProduct();
		}
	},

	/**
	 * 滑动关闭功能
	 */
	handleTouchStart(e) {
		touchTimer = e.timeStamp
		touchObj = e.touches[0]
		touchDy = 0
	},
	handleTouchMove(e) {
		let touch = e.touches[0]
		let id = touchObj.identifier
		let curId = touch.identifier
		if (curId === id) {
			let pageY = touch.pageY
			touchDy = pageY - touchObj.pageY
		}
	},
	handleTouchEnd(e) {
		let touch = e.changedTouches[0]
		let id = touchObj.identifier
		let curId = touch.identifier
		let interval = e.timeStamp - touchTimer
		if (id === curId && interval < 200 && touchDy > 150) {
			if (this.data.isCatePanelShow) {
				this.toggleSpecific()
			}
			if (this.data.isCartPanelShow) {
				this.toggleCart()
			}
		}
	},
	hideActWrap() {
		this.setData({
			isActWrapShow: false
		})
	},
	goPageCoupon() {
		this.setData({
			isActWrapShow: false
		})
		wx.navigateTo({
			url: `/pages/my/coupon/coupon?type=2`
		})
	},
	getAchievement() {
		model('my/achievement/info', {}, 'POST').then(res => {
			// debugger
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

			if (result.targetAchievementDesign) {
				result.capsRate = (result.achievementCups / result.targetAchievementDesign.caps * 100);
			}
			this.setData({
				memberData: result,
				loading: false
			});
			if (result.currentDesign.welfares) {
				let _resArr = [];
				_resArr = result.currentDesign.welfares.filter(item => {
					return item.isAvailable;
				})
				this.setData({
					welfares: result.currentDesign.welfares,
					welfaresLength: _resArr.length
				});

			}

			let lalala = {
				"青麦": "linear-gradient(270deg,rgba(191,210,167,1) 0%,rgba(128,155,90,1) 100%)",
				"银麦": "linear-gradient(270deg,rgba(209,209,209,1) 0%,rgba(148,148,148,1) 100%)",
				'金麦': 'linear-gradient(270deg,rgba(216,204,178,1) 0%,rgba(193,175,136,1) 100%)',
				'铂金': 'linear-gradient(270deg,rgba(195,174,214,1) 0%,rgba(124,97,149,1) 100%)',
				'钻石': 'linear-gradient(270deg,rgba(202,155,155,1) 0%,rgba(161,86,86,1) 100%)',
				'黑金': 'linear-gradient(270deg,rgba(132,132,132,1) 0%,rgba(0,0,0,1) 100%)'
			}
			this.setData({
				memberName: result.currentDesign.name,
				memberTagColor: lalala[result.currentDesign.name]
			});
			wx.setStorageSync('memberData', result);
			wx.hideLoading();
		});
	},
	checkSaveUser() {
		this.getAchievement()
		let self = this;
		let token = wx.getStorageSync('token')
		let userName = '';
		let avatar = '';
		if (!token) {
			return
		}
		try {
			let userInfo = token.user
			avatar = userInfo.avatar;
			userName = userInfo.userName
		} catch (e) {
			console.log(e);
		}
		if (userName && avatar) {
			return
		}
		let info = wx.getStorageSync('personal_info')
		if (!info) {
			return
		}
		// const { nickName, gender } = info
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
					let _param = {};
					if (nickName) {
						_param.userName = nickName
					}
					if (gender) {
						_param.sex = gender
					}
					if (key) {
						_param.avatar = key
					}
					model('my/user/update-user', _param, 'POST').then(res => {
						console.log(res);
						if (res.code === 'suc') {
							self.updateCurrentInfo(nickName, gender, url)
						}
					}).catch(e => {
						console.log(e, '[exception]: my/user/update-user');
					})
				}
			}
		});
	},
	updateCurrentInfo(nickName, gender, avatar) {
		if (!nickName && !gender && !avatar) {
			return
		}
		try {
			let token = wx.getStorageSync('token')
			let userInfo = token.user
			let newParam = {};
			if (nickName) {
				newParam.userName = nickName
			}
			if (gender) {
				newParam.sex = gender
			}
			if (avatar) {
				newParam.avatar = avatar
			}
			token.user = Object.assign(userInfo, newParam)
			wx.setStorageSync('token', token)
		} catch (e) {
			console.log(e);
		}
	}
});
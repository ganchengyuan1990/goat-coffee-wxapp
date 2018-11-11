// pages/store/store.js
const app = getApp();
const model = require('../../utils/model.js')
let timer;
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		viewToList: "",
		viewToNav: "",
		// scrollview 设定高度
		listHeight: 300,
		activeIndex: 0,
		isCatePanelShow: false,
		isCartPanelShow: false,
		heigthArr: [],
		storeInfo: {
			//服务端获取信息
			// storeId: 1,
			// storeName: "美式咖啡",
			storeImgUrl: "/images/store.png",
		},
		menuList: [],
		cartList: [],
		// 当前选中产品定制化
		currentSpecific: {},
		// 配送地址id
		userAddressId: '',
		// 是否自提
		isSelfTaking: true
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		this.fetchLoaction()
		let addrId = options.userAddressId
		let self = this
		if (addrId) {
			this.setData({
				userAddressId: addrId,
				isSelfTaking: false
			})	
		}
		// wx.getStorage({
		// 	key: 'CART_LIST',
		// 	success(res) {
		// 		console.log(res, 'storage');
		// 		let data = JSON.parse(res.data)
		// 		self.mergeCart(data)
		// 	}
		// })
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
				height2 = res[0].height;
				this.setData({
					listHeight: winHeight - height1 - height2
				});
				// this.calculateHeight();
			});
		});
	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow() {},

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
	onShareAppMessage() {},
	/**
	 * 验证是否获得授权
	 */
	checkAuth() {
		wx.getSetting({
			success(res) {
				const { authSetting } = res
				// if (!authSetting.scope.userLocation) {
				// 	// console.log('need auth')
				// 	wx.showModal({
				// 		title: '提示',
				// 		content: '需要您的授权才能推荐附近的店铺信息',
				// 		showCancel: false
				// 	})
				// }
			}
		})
	},
	/**
	 * 获取经纬度
	 */
	fetchLoaction() {
		let self = this
		wx.getLocation({
			type: 'wgs84',
			success(res) {
				const { latitude, longitude } = res
				let geo = {
					lng: longitude,
					lat: latitude
				}
				self.fetchStore(geo)
			},
			fail() {
				self.checkAuth()
			}
		})
	},
	/**
	 * 获取店铺信息
	 * 
	 */
	fetchStore(geo) {
		model('home/lbs/getStoreListByLocation', {
			// lng: geo.lng,
			// lat: geo.lat,
			lng: 121.483821,
			lat: 31.265335,
			page: 1
		}).then(res => {
			console.log(res, 'location')
			const {data} = res
			if (data && data.length > 0) {
				let storeInfo = data[0]
				console.log(storeInfo, 'storeInfo');
				
				let distance = storeInfo.distance
				if (distance) {
					distance = distance > 1 ? `${distance}km` : `${Math.round(distance * 1000)}m`
				}
				storeInfo.distance = distance
				this.setData({
					storeInfo: storeInfo
				})
				this.fetchProduct()
			}
		}).catch(e => {

		})
	},
	/**
	 * 获取商品信息
	 */
	fetchProduct(storeId = 29) {
		model('home/product/all', {
			storeId: storeId 
		}).then(res => {
			console.log(res, 'detail')
			const {data} = res
			const list = data.classify_list
			this.setData({
				menuList: list
			})
			this.calculateHeight()
		}).catch(e => {
			console.log(e)
		})
	},
	calculateHeight() {
		let heigthArr = [];
		let height = 0;
		heigthArr.push(height);
		var query = wx.createSelectorQuery();
		query.selectAll(".J_group").boundingClientRect();
		query.exec(res => {
			console.log(res, 'res')
			for (let i = 0; i < res[0].length; i++) {
				console.log(res[0][i])
				height += parseInt(res[0][i].height);
				heigthArr.push(height);
			}
			this.setData({
				heigthArr: heigthArr
			});
			console.log(heigthArr, 'heightarr');
		});
		
	},
	selectNav(e) {
		console.log(e.currentTarget.dataset.index, e.currentTarget.dataset.navid)
		this.setData({
			activeIndex: e.currentTarget.dataset.index,
			viewToList: e.currentTarget.dataset.navid
		});
	},

	// 手机端有延迟 节流函数效果不好 用防抖函数凑合
	scroll(e) {
		// console.log(e);
		clearTimeout(timer);
		timer = setTimeout(() => {
			let srollTop = e.detail.scrollTop;
			for (let i = 0; i < this.data.heigthArr.length; i++) {
				if (
					srollTop >= this.data.heigthArr[i] &&
					srollTop < this.data.heigthArr[i + 1] &&
					this.data.activeIndex != i
				) {
					this.setData({
						activeIndex: i
					});
					if (i < 3) {
						this.setData({
							viewToNav: 'nav1'
						})
					} else {
						this.setData({
							viewToNav: 'nav' + (i - 2)
						})
					}
					return;
				}
			}
		}, 100)
	},
	orderProduct(e) {
		let groupIdx = e.target.dataset.groupidx
		let productIdx = e.target.dataset.productidx
		// let detail = `menuList[${groupIdx}].product_list[${productIdx}]`
		let detail = this.data.menuList[groupIdx].product_list[productIdx]
		this.setData({
			currentSpecific: detail
		})
		console.log(detail, 'prodde')
		this.toggleSpecific()
	},
	toggleSpecific() {
		let isShow = this.data.isCatePanelShow
		this.setData({
			isCatePanelShow: !isShow
		})
		if (isShow) {
			this.toggleTabBar(true)
			this.setData({
				isCatePanelShow: !isShow
			})
		} else {
			this.toggleTabBar(false, () => {
				this.setData({
					isCatePanelShow: !isShow
				})
			})
		}
	},
	/**
	 * 添加到购物车 
	 */
	saveCart(e) {
		let cart = this.data.cartList

		cart.push(e.detail)
		this.setData({
			cartList: cart
		})
		wx.setStorage({
			key: 'CART_LIST',
			data: JSON.stringify(cart)
		})
	},
	toggleTabBar(isShow, callback) {
		if (!isShow) {
			wx.hideTabBar({
				animation: false,
				success() {
					callback && callback()
				},
				fail() {}
			})
		} else {
			wx.showTabBar({
				animation: false,
				success() {
					callback && callback()
				},
				fail() {}
			})
		}
	},
	checkout(e) {
		let info = this.data
		
		let cartList = e.detail.cart
		let totalPrice = e.detail.totalPrice
		console.log(cartList, 'cartList')
		if (cartList.length === 0) {
			return
		}
		let products = cartList.map(item => {
			let skuList = item.sku_list
			let obj = skuList.find(item => item.isdefault === 1) || {}
			console.log(obj, 'obj obj');
			
			return Object.assign({},{
				productName: item.productName,
				productId: item.id,
				skuId: obj.skuId,
				skuName: obj.skuName,
				number: item.count,
				price: obj.price,
			})
		})
		let obj = {
			storeId: info.storeInfo.id,
			userAddressId: info.userAddressId,
			deliverFee: info.storeInfo.deliverFee,
			payAmount: totalPrice,
			orderType: info.isSelfTaking ? 2 : 1,
			product: products
		}
		const url = `/pages/pay/checkout/checkout?data=${encodeURIComponent(JSON.stringify(obj))}`

		wx.navigateTo({
			url: url
		})
	},
	selectAddress() {
		wx.navigateTo({
			url: '/pages/my/address_list/address_list?from=store'
		})
	},
	// TODOS 合并相同品类
	mergeCart(list) {
		if (!Array.isArray(list)) {
			return 
		}
		let cartList = this.data.cartList
		let arr = cartList.concat(list)
		this.setData({
			cartList: arr
		})
	}
});
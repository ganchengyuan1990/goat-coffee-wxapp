// pages/store/store.js
const app = getApp();
import model from '../../utils/model.js'
import util from '../../utils/util.js'
import { BigNumber } from '../../utils/bignumber.min';
function BN(...args) {
	return new BigNumber(...args)
}
let touchTimer = null
let touchObj = {}
let touchDy = 0


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
		console.log(options, 'options');
		
		let self = this
		let addrId = options.userAddressId
		let fromPage = options.from
		if (fromPage === 'selfExtraction') {
			
			this.setData({
				isSelfTaking: true
			})
			
		}
		if (fromPage === 'delivery') {
			this.setData({
				userAddressId: addrId,
				isSelfTaking: false
			})
		}
		this.fetchLoaction()

		wx.getStorage({
			key: 'CART_LIST',
			success(res) {
				// console.log(res, 'storage');
				let data = JSON.parse(res.data)
				if (data && Array.isArray(data)) {
					let arr = self.data.cartList
					arr = arr.concat(data)
					
					self.mergeCart(arr)
				}
				
			}
		})
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
	onShow() {

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
				app.globalData.isGeoAuth = false
			},
			fail() {
				self.checkAuth()
				app.globalData.isGeoAuth = false
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
			lng: 121.419114,
			lat: 31.239629,
			page: 1
		}).then(res => {
			// console.log(res, 'location')

			const {data} = res
			if (data && data.length > 0) {
				let storeInfo = data[0]
				// console.log(storeInfo, 'storeInfo');
				wx.setStorage({
					key: 'STORE_INFO',
					data: JSON.stringify(storeInfo)
				})
				let distance = storeInfo.distance
				if (distance) {
					distance = distance > 1 ? `${distance.toFixed(1)}km` : `${Math.round(distance * 1000)}m`
				}
				storeInfo.distance = distance
				this.setData({
					storeInfo: storeInfo
				})
				this.fetchProduct()
			}
		}).catch(e => {
			console.log(e)
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
				height += parseInt(res[0][i].height);
				heigthArr.push(height);
			}
			this.setData({
				heigthArr: heigthArr
			});
		});
		
	},
	selectNav(e) {
		// console.log(e.currentTarget.dataset.index, e.currentTarget.dataset.navid)
		this.setData({
			activeIndex: e.currentTarget.dataset.index,
			viewToList: e.currentTarget.dataset.navid
		});
	},

	// 手机端有延迟 节流函数效果不好 用防抖函数凑合
	scroll(e) {
		(util.throttle(() => {
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
		}, 100))()
	},
	orderProduct(e) {
		let groupIdx = e.currentTarget.dataset.groupidx
		let productIdx = e.currentTarget.dataset.productidx
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
		// this.setData({
		// 	isCatePanelShow: !isShow
		// })
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
		let cart = e.detail.cartList
		if (e.detail) {
			this.mergeCart(cart)
		}
	},
	addCart(e) {
		let cart = this.data.cartList
		if (e.detail) {
			cart.push(e.detail)
		}
		this.mergeCart(cart)
	},
    toggleCart() {
    	let isShow = this.data.isCartPanelShow
    	let self = this

    	if (!isShow) {
    		this.toggleTabBar(false, () => {
    			self.setData({
    				isCartPanelShow: !isShow
    			})
    		})
    	} else {
    		this.toggleTabBar(true)
    		self.setData({
    			isCartPanelShow: !isShow
    		})
    	}
    },
	toggleTabBar(isShow, callback) {
		if (!isShow) {
			wx.hideTabBar({
				animation: true,
				success() {
					callback && callback()
				},
				fail() {}
			})
		} else {
			wx.showTabBar({
				animation: true,
				success() {
					callback && callback()
				},
				fail() {}
			})
		}
	},
	checkout(e) {
		let token = wx.getStorageSync('token').token
		if (!token) {
			wx.navigateTo({
				url: '/pages/login/login'
			})
			return
		}
		let info = this.data
		let cartList = e.detail.cart
		let totalPrice = e.detail.totalPrice
		// console.log(cartList, 'cartList')
		if (cartList.length === 0) {
			return
		}
		let products = cartList.map(item => {
			let skuList = item.sku_list
			let obj = skuList.find(item => item.isdefault === 1) || {}
			let propList = item.key_list
			let propIds = []
			propList.forEach(i => {
				// console.log(i, 'i');
				let idObj = i.val_list.find(j => {
					return j.id === i.default_val_id
				})
				
				if (idObj) {
					propIds.push(idObj.prop_id)
				}
			})
			console.log(propIds, 'propdis')
			return Object.assign({},{
				productName: item.productName,
				productId: item.id,
				skuId: obj.id,
				skuName: obj.propSkuName,
				number: item.count,
				price: obj.price,
				productPropIds: propIds.join(',')
			})
		})
		let fee = info.storeInfo.deliverFee
		let obj = {
			storeId: info.storeInfo.id,
			userAddressId: info.userAddressId,
			deliverFee: fee,
			payAmount: totalPrice,
			orderType: info.isSelfTaking ? 2 : 1,
			product: products
		}
		console.log(obj);
		// return
		const url = `/pages/pay/checkout/checkout?data=${encodeURIComponent(JSON.stringify(obj))}`
		this.toggleCart()
		wx.navigateTo({
			url: url
		})
	},
	selectAddress(e) {
		// wx.navigateTo({
		// 	url: '/pages/my/address_list/address_list?from=store'
		// })
		console.log(e, 'select')
		let type = e.target.dataset.delivery
		if (type === 'taking') {
			// TODOS callback set address
			// wx.navigateTo({
			// 	url: '/pages/transport/transport?from=store&type=2'
			// })
			this.setData({
				isSelfTaking: true
			})
		}
		if (type === 'delivery') {
			// wx.navigateTo({
			// 	url: '/pages/transport/transport?from=store&type=1'
			// })
			this.setData({
				isSelfTaking: false
			})
		}
	},
	// TODOS 合并相同品类
	mergeCart(list) {
		if (!Array.isArray(list)) {
			return 
		}
		// 验证skuid， propids, productId一致性

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
		let arr = Object.values(obj)
		this.setData({
			cartList: arr
		})
		wx.setStorage({
			key: 'CART_LIST',
			data: JSON.stringify(arr)
		})
	},
	handleTouchStart(e) {
		// console.log(e, 'touch');
		touchTimer = e.timeStamp
		touchObj = e.touches[0]
		touchDy = 0
	},
	handleTouchMove(e) {
		// console.log(e, 'move')
		let touch = e.touches[0]
		let id = touchObj.identifier
		let curId = touch.identifier
		if (curId === id) {
			let pageY = touch.pageY
			touchDy = pageY - touchObj.pageY
		}
	},
	handleTouchEnd(e) {
		// console.log(e, 'end');
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
	}
});
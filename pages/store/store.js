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
		tabIndex: 0,
		isCatePanelShow: false,
		isCartPanelShow: false,
		showCart: false,
		heigthArr: [],
		cart: [],
		totalMoney: 0,
		storeInfo: {
			//服务端获取信息
			// storeId: 1,
			// storeName: "美式咖啡",
			storeImgUrl: "/images/store.png",
		},
		menuList: [],
		food: [{
				titleId: "title1",
				title: "大师咖啡",
				foodCount: 0,
				items: [{
						foodId: 1,
						name: '美式咖啡',
						ename: 'Americano',
						price: 23,
						note: '规格/糖/奶/温度',
						count: 0,
						classify: []
					},
					{
						foodId: 2,
						name: "美式咖啡",
						ename: 'Americano',
						price: 23,
						note: '规格/糖/奶/温度',
						zan: 34,
						count: 0,
						classify: []
					},
					{
						foodId: 3,
						name: "美式咖啡",
						ename: 'Americano',
						price: 23,
						count: 0,
						classify: [{
								describe: "大份",
								price: 30
							},
							{
								describe: "中份",
								price: 23
							},
							{
								describe: "小份",
								price: 15
							}
						]
					}
				]
			},
			{
				titleId: "title2",
				title: "大师咖啡",
				foodCount: 0,
				items: [{
						foodId: 4,
						name: "美式咖啡",
						ename: 'Americano',
						price: 23,
						note: '规格/糖/奶/温度',
						zan: 34,
						count: 0,
						classify: []
					},
					{
						foodId: 5,
						name: "美式咖啡",
						ename: 'Americano',
						price: 23,
						note: '规格/糖/奶/温度',
						zan: 34,
						count: 0,
						classify: []
					},
					{
						foodId: 6,
						name: "美式咖啡",
						ename: 'Americano',
						price: 23,
						note: '规格/糖/奶/温度',
						zan: 34,
						count: 0,
						classify: [{
								describe: "大份",
								price: 30
							},
							{
								describe: "中份",
								price: 23
							},
							{
								describe: "小份",
								price: 15
							}
						]
					}
				]
			},
			{
				titleId: "title3",
				title: "大师咖啡",
				foodCount: 0,
				items: [{
						foodId: 7,
						name: "美式咖啡",
						ename: 'Americano',
						price: 23,
						note: '规格/糖/奶/温度',
						zan: 34,
						count: 0,
						classify: []
					},
					{
						foodId: 8,
						name: "美式咖啡",
						ename: 'Americano',
						price: 23,
						note: '规格/糖/奶/温度',
						zan: 34,
						count: 0,
						classify: []
					},
					{
						foodId: 9,
						name: "美式咖啡",
						ename: 'Americano',
						price: 23,
						note: '规格/糖/奶/温度',
						zan: 34,
						count: 0,
						classify: []
					}
				]
			},
			{
				titleId: "title4",
				title: "大师咖啡",
				foodCount: 0,
				items: [{
						foodId: 10,
						name: "美式咖啡",
						ename: 'Americano',
						price: 3,
						note: "",
						zan: 34,
						count: 0,
						classify: []
					},
					{
						foodId: 11,
						name: "美式咖啡",
						ename: 'Americano',
						price: 3,
						note: "",
						zan: 34,
						count: 0,
						classify: []
					},
					{
						foodId: 12,
						name: "美式咖啡",
						ename: 'Americano',
						price: 3,
						note: "",
						zan: 34,
						count: 0,
						classify: []
					}
				]
			},
			{
				titleId: "title5",
				title: "大师咖啡",
				foodCount: 0,
				items: [{
						foodId: 13,
						name: "美式咖啡",
						ename: 'Americano',
						price: 23,
						note: "美式咖啡",
						zan: 34,
						count: 0,
						classify: []
					},
					{
						foodId: 14,
						name: "美式咖啡",
						ename: 'Americano',
						price: 23,
						note: '规格/糖/奶/温度',
						zan: 34,
						count: 0,
						classify: []
					},
					{
						foodId: 15,
						name: "美式咖啡",
						ename: 'Americano',
						price: 23,
						note: '规格/糖/奶/温度',
						zan: 34,
						count: 0,
						classify: [{
								describe: "大份",
								price: 30
							},
							{
								describe: "中份",
								price: 23
							},
							{
								describe: "小份",
								price: 15
							}
						]
					}
				]
			}
		]
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		this.fetchLoaction()
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
				if (!authSetting.scope.userLocation) {
					// console.log('need auth')
					wx.showModal({
						title: '提示',
						content: '需要您的授权才能推荐附近的店铺信息',
						showCancel: false
					})
				}
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
			lng: 121.468532,
			lat: 31.244450,
			page: 1
		}).then(res => {
			console.log(res, 'location')
			const {data} = res
			if (data && data.length > 0) {
				let storeInfo = data[0]
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
	add(e) {
		let groupindex = e.target.dataset.groupindex;
		let index = e.target.dataset.index;
		let countMsg =
			"food[" +
			groupindex +
			"].items[" +
			index +
			"].count";
		let count = this.data.food[groupindex].items[
			index
		].count;
		let foodCountMsg = "food[" + groupindex + "].foodCount";
		let foodCount = this.data.food[groupindex].foodCount;
		let foodId = this.data.food[groupindex].items[
			index
		].foodId;
		count += 1;
		foodCount += 1;
		this.setData({
			[countMsg]: count, //数据的局部更新
			[foodCountMsg]: foodCount
		});
		let cart = this.data.cart;
		let hasCart = false;
		for (var i = 0; i < cart.length; i++) {
			if (cart[i].foodId == foodId) {
				hasCart = true;
				break;
			}
		}
		if (hasCart) {
			cart[i].count++;
		} else {
			cart.push({
				...this.data.food[groupindex].items[index],
				groupindex
			});
		}
		let totalMoney = this.data.totalMoney;
		totalMoney += this.data.food[groupindex].items[
			index
		].price;
		this.setData({
			cart: cart,
			totalMoney: totalMoney
		});
	},
	reduce(e) {
		let groupindex = e.target.dataset.groupindex;
		let index = e.target.dataset.index;
		let countMsg =
			"food[" +
			groupindex +
			"].items[" +
			index +
			"].count";
		let count = this.data.food[groupindex].items[
			index
		].count;
		let foodCountMsg = "food[" + groupindex + "].foodCount";
		let foodCount = this.data.food[groupindex].foodCount;
		let foodId = this.data.food[groupindex].items[
			index
		].foodId;
		count -= 1;
		foodCount -= 1;
		this.setData({
			[countMsg]: count,
			[foodCountMsg]: foodCount
		});
		let cart = this.data.cart;
		for (var i = 0; i < cart.length; i++) {
			if (cart[i].foodId == foodId) {
				if (cart[i].count == 1) {
					cart.splice(i, 1);
				} else {
					cart[i].count--;
				}
				break;
			}
		}
		let totalMoney = this.data.totalMoney;
		totalMoney -= this.data.food[groupindex].items[
			index
		].price;
		this.setData({
			cart: cart,
			totalMoney: totalMoney
		});
	},
	toggleSpec() {
		let isShow = this.data.isCatePanelShow
		console.log(isShow)
		this.setData({
			isCatePanelShow: !isShow
		});
	},
	/**
	 * 
	 */  
	toggleCart() {
		let isShow = this.data.isCartPanelShow
		let self = this
		if (!isShow) {
			wx.hideTabBar({
				animation: false,
				success() {
					self.setData({
						isCartPanelShow: !isShow
					})
				},
				fail() {}
			})
		} else {
			wx.showTabBar({
				animation: false,
				success() {},
				fail() {}
			})
			self.setData({
				isCartPanelShow: !isShow
			})
		}

	}
});
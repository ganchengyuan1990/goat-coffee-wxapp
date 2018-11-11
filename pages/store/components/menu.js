import util from '../../../utils/util.js'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    info: {
      type: Object,
      value: {}
    },
    isShow: {
      type: Boolean,
      value: false,
      observer(newVal, oldVal) {
        if (newVal) {
          this.setDefault()
        }
      }
    }
  },
  /**
   * 组件的初始数据
   * skuid, keyid, number, productid
   */
  data: {
    // 展示规格
    customed: '',
    // 展示价格
    price: 0,
    totalPrice: 0,
    count: 1,
    currentSku: {},
    currentProp: []
  },
  attached() {

  },
  /**
   * 组件的方法列表
   */
  methods: {
    setDefault() {
      // 设置默认价格
      try {
        let obj = this.data.info.sku_list.find(item => {
          return item.isdefault === 1
        })
        let price = obj.price || '暂无报价'
        this.setData({
          price: price,
          count: 1
        })
        this.setPrice()
      } catch (e) {
        this.setData({
          price: '暂无报价'
        })
      }
      // 设置默认规格
      this.getCustomed()
    },
    toggleMenu() {
      this.triggerEvent('togglemenu', 'abc')
    },
    save() {
      let info = this.data.info
      let spec = this.data.customed
      console.log(spec, 'spec')
      this.triggerEvent('save', Object.assign({}, info, {
        count: this.data.count,
        totalPrice: this.data.totalPrice,
        price: this.data.price,
        spec: spec
      }))
      this.toggleMenu()
    },
    /**
     * 选择规格
     */
    select(e) {
      let group = e.target.dataset.group
      let idx = e.target.dataset.tagidx
      // 规格
      if (group === 'sku') {
        let skuKey = `info.sku_list`
        let skuList = this.data.info.sku_list
        let currentSku = skuList[idx]
        skuList.forEach(item => {
          item.isdefault = item.id === currentSku.id ? 1 : 0
        })
        this.setData({
          [skuKey]: skuList,
          price: currentSku.price,
          currentSku: currentSku
        })
        this.setPrice()
      }
      // 其他属性
      if (group === 'opt') {
        let groupIdx = e.target.dataset.groupidx
        let optKey = `info.key_list[${groupIdx}]`
        try {
          // 全部属性
          let propList = this.data.info.key_list
          // 当前属性组
          let optList = propList[groupIdx]
          // 属性id
          let selectedIdx = optList.val_list[idx].id
          optList.default_val_id = selectedIdx
          this.setData({
            [optKey]: optList,
            currentProp: propList
          })
        } catch(e) {
          console.log(e)
        }
      }
      this.getCustomed()
    },
    /**
     * 增加数量
    */
    increase() {
      let count = this.data.count
      this.setData({
        count: count + 1,
      })
      this.setPrice()
    },
    /**
     * 减少数量
    */
    decrease() {
      let count = this.data.count
      if (count > 1) {
        this.setData({
          count: count - 1,
        })
        this.setPrice()
      }
    },
    /**
     * 计算价格
    */
    setPrice() {
      let count = this.data.count
      let price = Number(this.data.price)
      if (!isNaN(price)) {
        this.setData({
          totalPrice: util.mul(count, price)
        })
      }
    },
    /**
     * 获取默认规格
    */
    getCustomed() {
      const query = wx.createSelectorQuery().in(this);
      query.selectAll(".J_opt_item.active").fields({
        dataset: true
      }, res => {
        let list = res
        let tags = list.map(item => {
          let tag = item.dataset.val
          return tag
        })
        this.setData({
          customed: tags.join('/')
        })
      }).exec();
    }
  }
})

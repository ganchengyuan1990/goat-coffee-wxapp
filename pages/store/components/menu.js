// pages/store/components/menu.js
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
   */
  data: {
    customed: '',
    price: 0,
    count: 1
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
        
        this.setData({
          price: obj.price || '暂无报价'
        })
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

    },
    // 选择规格
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
          price: currentSku.price
        })
      }
      // 其他选项
      if (group === 'opt') {
        let groupIdx = e.target.dataset.groupidx
        let optKey = `info.key_list[${groupIdx}]`
        try {
          let optList = this.data.info.key_list[groupIdx]
          let selectedIdx = optList.val_list[idx].id
          optList.default_val_id = selectedIdx
          this.setData({
            [optKey]: optList
          })
        } catch(e) {
          console.log(e)
        }
      }
      this.getCustomed()
    },
    increase() {
      let count = this.data.count
      this.setData({
        count: count+1
      })
    },
    decrease() {
      let count = this.data.count
      if (count > 1) {
        this.setData({
          count: count-1
        })
      }
    },
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

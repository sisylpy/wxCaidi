// components/shareButton/mymodal.js

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    //是否显示modal
    show: {
      type: Boolean,
      value: true
    },
   
    item: {
      type: Object,
      value: ""
    },
    standardName: {
      type: String,
      value: ""
    }
   

   
  
   
    
   
  },

  /**
   * 组件的初始数据
   */
  data: {
    showInput: false,
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    clickMask() {
      this.setData({show: false})
    },

    cancel() {
      this.setData({ show: false })
      this.triggerEvent('cancel')
    },

    confirm(e) {
      
      this.triggerEvent('confirm', {
        quantity: this.data.quantity,
        standard: this.data.item.nxDigGoodsStandardname,  
      })

      this.setData({
        show: false,
        standardName: "",
      })
    },

    getQuantity: function (e) {
      console.log(e)
      this.setData({
       
        quantity: e.detail.value
      })
    },

    









  },
  

  
  
})

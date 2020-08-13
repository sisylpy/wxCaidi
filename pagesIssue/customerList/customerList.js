// pages/customerList/customerList.js
import {
 
  disGetAllCustomer,

} from '../../lib/apiDepOrder.js'




Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      disId: options.id,
      disId:2,
    })


    disGetAllCustomer(this.data.disId).then(res => {
      if(res){
        console.log(res.result.data)
        this.setData({
          myCustomerArr: res.result.data
        })
      }
    })

  },

  getCustomerOrders(e){
    console.log(e);
    wx.navigateTo({
      url: '../issuePage/issuePage?depId=' + e.currentTarget.dataset.depid
      + '&fatherDepId=' + e.currentTarget.dataset.depfatherid + '&depHasSubs=' + e.currentTarget.dataset.hassubs ,
      
    })

  },





})
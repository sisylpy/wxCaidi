// pages/saleGoods/saleGoods.js
import apiUrl from '../../config.js'


import {
  getPromoteInfo, 
} from '../../lib/apiCustomer.js'


Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  onShow: function () {

    var user = wx.getStorageSync("userInfo");
    if (user) {
      this.setData({
        userInfo: user
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      nxPromoteId: options.promoteId,
      url: apiUrl.server,
    })
    this._initData();

  },

  _initData: function () {
   
    var id =  this.data.nxPromoteId;
    getPromoteInfo(id)
    .then(res =>{
      if(res) {
        console.log(res)
        this.setData({
          promote: res.result.data
        })
      }
    })



  },
})
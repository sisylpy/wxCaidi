// pages/userGoodsToJoin/userGoodsToJoin.js
const globalData = getApp().globalData;

import {
  getCustomerUserGoods, addUserGoods
} from '../../lib/apiCustomer.js'

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
      windowWidth: globalData.windowWidth * globalData.rpxR,
      windowHeight: globalData.windowHeight * globalData.rpxR,
      url: "http://172.20.10.7:8080/nxl_war_exploded/",
      nxCustomerUserId: options.nxCustomerUserId,
      // nxCustomerUserId: 76,

    })
    this._initData();

   
},

_initData: function(){
  console.log("inittttt")
  var data = {
    nxCugUserId: 76,
    nxCugJoinMyTemplate: 0,
  }

  getCustomerUserGoods(data)
    .then(res => {
      if (res) {
        console.log(res)
        this.setData({
          items: res.result.data,
        })
      }
    })
},

  toAdd: function(e){
    console.log(e);
    var index = e.currentTarget.dataset.index;
    var id = this.data.items[index].nxCugGoodsId;
    var data = {
      nxCugGoodsId: id,
      nxCugOrderQuantity: this.data.items[index].nxCugLastOrderQuantity,
      nxCugOrderStandard:  this.data.items[index].nxCugLastOrderStandard,
    }

    addUserGoods(data)
    .then(res => {
      console.log(res)
      if(res.result.code == 0) {
        this._initData();
      }
    })
  }  



})
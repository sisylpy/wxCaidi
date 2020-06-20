// pagesD/index/index.js

const app = getApp()
const globalData = getApp().globalData;

// import {
//   myApplys
// } from '../../lib/apiStore.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // grouplist: []
    oneName: " 订货群",
    oneUrl: "../../images/addGroup.jpg",
    twoName: "送货单",
    twoUrl: "../../images/goods.jpg",
    threeName: "自采订货",
    threeUrl: "../../images/add.jpg",

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    this.setData({
      windowWidth: globalData.windowWidth * globalData.rpxR,
      windowHeight: globalData.windowHeight * globalData.rpxR,
     
    })
    var now = new Date();
    var day = now.getDay();
    var weeks = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
    var week = weeks[day];
    var date = now.getDate();
    this.setData({
      week: week,
      date: date,
    })


    
  

  },
  onShow:function() {
    //2，获取店内申请列表
  
    // this.getMyApplys(this.data.storeId);
  },

getMyApplys:function(store) {
  myApplys(store)
    .then(res => {
      if (res) {
        console.log(res);
        this.setData({
          applyArr: res.result.data
        })
      }
    })
},

//打开订货商品页面
  addApply: function(e) {
    wx.navigateTo({
      url: '../addOrder/addOrder?storeId=' + this.data.storeId,
    })

  },

  //打开我的订货页面
  storeApplys: function(){
    wx.navigateTo({
      url: '../addOrder/addOrder?storeId=' + this.data.storeId,
    })

  },


})
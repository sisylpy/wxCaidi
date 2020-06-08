// pagesCustomer/userPage/userPage.js

const globalData = getApp().globalData;

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
    var value = wx.getStorageSync("userInfo");
    this.setData({
      userInfo: value
    })

    this.setData({
      windowWidth: globalData.windowWidth * globalData.rpxR,
      windowHeight: globalData.windowHeight * globalData.rpxR,
     
    })

  },




  toMemberInfo: function (e) {
    wx.navigateTo({
      url: '../memberInfo/memberInfo',
    })
  },

  toRegister: function (e) {
    wx.navigateTo({
      url: '../register/register',
    })

  },


  toAnalyse: function (e) {
    wx.navigateTo({
      url: '../memberInfo/memberInfo',
    })
  },


  toFamily: function (e) {
    wx.navigateTo({
      url: '../memberInfo/memberInfo',
    })
  },

})
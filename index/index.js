// pages/business/catalogue/catalogue.js



Page({

   toRes(){
    wx.navigateTo({
      url: '../pagesRes/index/index',
    })
   },

   toOrder(){
    wx.navigateTo({
      url: '../pagesOrder/rIndex/rIndex',
    })
   },

   toIssue(){
    wx.navigateTo({
      url: '../pagesPicker/pIndex/pIndex',
    })
   },

   toComm(){
    wx.navigateTo({
      url: '../pages/index/index',
    })
   },


})
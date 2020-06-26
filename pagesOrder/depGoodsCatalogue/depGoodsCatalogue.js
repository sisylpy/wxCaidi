// pagesOrder/depGoodsCatalogue/depGoodsCatalogue.js

import {depGetFatherGoods, } from  '../../lib/apiRestraunt'
import apiUrl from '../../config.js'
const globalData = getApp().globalData;
var app = getApp()
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
      depId: options.id,

      windowWidth: globalData.windowWidth * globalData.rpxR,
      windowHeight: globalData.windowHeight * globalData.rpxR,
      url: apiUrl.server,
    })

    depGetFatherGoods(this.data.depId).then(res => {
      if(res) {
        console.log(res);
        this.setData({
          goodsList: res.result.data,
        })
      }
    })

  },

  toDepGoods(e){
    console.log(e)
  }

})
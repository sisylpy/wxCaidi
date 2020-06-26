// pagesOrder/rIndex/rIndex.js

const globalData = getApp().globalData;
var app = getApp()

import apiUrl from '../../config.js'
import {userInfo, userGetApplys, } from '../../lib/apiRestraunt'


Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  onShow: function(){

    console.log(this.data.userId)
    if(this.data.userId){
      this._getUserApply();

    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userId: options.userId,
      windowWidth: globalData.windowWidth * globalData.rpxR,
      windowHeight: globalData.windowHeight * globalData.rpxR,
      url: apiUrl.server,
    })

    this._getUserInfo();

  },

  _getUserInfo(){
    userInfo(this.data.userId).then(res =>{
      if(res){
        this.setData({
          user: res.result.data.userInfo,
          dep: res.result.data.depInfo
        })
      }
      wx.setStorageSync('depInfo', res.result.data.depInfo);
      wx.setStorageSync('userInfo', res.result.data.userInfo)
    })
  },

  _getUserApply(){
    userGetApplys(this.data.userId).then(res =>{
      if(res){
        console.log(res)
        this.setData({
          applyArr: res.result.data
        })
      }
    })

  },
  
  toIbookCover(){
    // console.log("haihaia")
    wx.navigateTo({
      url: '/pagesOrder/ibookCover/ibookCover',
    })

  },

  toDepFatherGoods(){
    wx.navigateTo({
      url: '../depGoodsCatalogue/depGoodsCatalogue?id=' + this.data.dep.nxDepartmentId,
    })
  },






})
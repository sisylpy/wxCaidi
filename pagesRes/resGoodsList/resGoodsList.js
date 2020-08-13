// pagesRes/resGoodsList/resGoodsList.js



const app = getApp()
const globalData = getApp().globalData;

var load = require('../../lib/load.js');

import {
  depGetResGoods,
  
} from '../../lib/apiRestraunt'

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
      depId: globalData.groupInfo.groupInfo.nxDepartmentId,
      fatherId: options.fatherId,
      fatherName: options.fatherName,
    })

    this._initData();
  },

  _initData(){

    var data = {
      depId : this.data.depId,
      fatherId: this.data.fatherId,
    }

    depGetResGoods(data).then(res =>{
      if(res) {
        console.log(res);
        this.setData({
          goodsList: res.result.data,
        })
      }
    })
  },

  toDetail(e){
    wx.navigateTo({
      url: '../resGoodsDetail/resGoodsDetail?resGoodsId=' + e.currentTarget.dataset.id,
    })


  },






})
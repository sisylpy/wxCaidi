// pagesRes/disGoodsCata/disGoodsCata.js



const app = getApp()
const globalData = getApp().globalData;

var load = require('../../lib/load.js');


import {
  depGetDisGoods,
  saveDepDisGoods
} from '../../lib/apiRestraunt'
Page({
  
  /**
   * 页面的初始数据
   */

  
   data: {


    totalPage: 0,
    totalCount: 0,
    limit: 20,
    currentPage: 1,
    isLoading: false,
    depStandardArr: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(globalData.groupInfo)

    this.setData({
      windowWidth: globalData.windowWidth * globalData.rpxR,
      windowHeight: globalData.windowHeight * globalData.rpxR,
      disId: 1,
      fatherId: options.fatherId,
      fatherName: options.fatherName,
      depFatherId: globalData.groupInfo.groupInfo.nxDepartmentId,
      
    })

    this._getInitData();

    wx.setNavigationBarTitle({
      "title": "李树国配送",
    })
  },




  _getInitData(){

    var data = {
      limit: this.data.limit,
      page: this.data.currentPage,
      fatherId: this.data.fatherId,
      disId: this.data.disId,
      depFatherId: this.data.depFatherId
    }

    depGetDisGoods(data).then(res =>{
      if(res){
        console.log(res.result.page);
        this.setData({
          goodsList: res.result.page.list,
        })
      }
    })
  },

 
  toAddDepNxGoods(e){
    console.log(globalData)
    var group = globalData.groupInfo.groupInfo;
    var goods = this.data.goodsList[e.currentTarget.dataset.index];
    var standards = this.data.goodsList[e.currentTarget.dataset.index].nxDisStandardEntities;
   
    if(standards.length > 0){
      var temp = [];
      for(var i = 0; i < standards.length; i++){
        var standard = standards[i];
        var depStandard = {
          nxDdsDdsGoodsId: goods.nxDistributerGoodsEntity.nxDistributerGoodsId,
          nxDdsStandardName: standard.nxDsStandardName
        }
        temp.push(depStandard);
      }
       this.setData({
        depStandardArr: temp
       })
    }
   
   
    var dng = {
      nxDdgDepartmentFatherId: group.nxDepartmentId ,
      nxDdgNxGoodsId: goods.nxGoodsId,
      nxDdgDisGoodsId: goods.nxDistributerGoodsEntity.nxDistributerGoodsId,
      nxDdgDisGoodsFatherId: this.data.fatherId,
      nxDdgNxGoodsName: goods.nxGoodsName,
      nxDdgNxGoodsPinyin: goods.nxGoodsPinyin,
      nxDdgNxGoodsPy: goods.nxGoodsPy,
      nxDdgNxGoodsSort: goods.nxGoodsSort,
      nxDdgNxGoodsStandardname: goods.nxGoodsStandardname,
      nxDdgNxGoodsDetail: goods.nxGoodsDetail,
      nxDepStandardEntities: this.data.depStandardArr,

    };
    console.log(dng)
    load.showLoading("保存商品中")

    saveDepDisGoods(dng)
    .then(res => {
      load.hideLoading();
      console.log(res.result)
      if (res.result.data > 0) {
        console.log(res)
       
        var up = "goodsList[" + e.currentTarget.dataset.index + "].isDownload"
        this.setData({
          [up]: 1,
        })
      }
    })

  },




})
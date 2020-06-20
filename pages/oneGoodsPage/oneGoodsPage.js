// pagesCustomer/oneGoodsPage/oneGoodsPage.js

import apiUrl from '../../config.js'
import { getCommunityGoodsDetail } from '../../lib/apiCustomer.js'
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

    this.setData({
      windowWidth: globalData.windowWidth * globalData.rpxR,
      windowHeight: globalData.windowHeight * globalData.rpxR,
      digitBoardHeight: globalData.digitBoardHeight * globalData.rpxR,
      nxCommunityGoodsId: options.nxCommunityGoodsId,
      url: apiUrl.server
    })
    
    
    wx.setNavigationBarTitle({
      title: options.name,
    })

    getCommunityGoodsDetail(this.data.nxCommunityGoodsId)
      .then(res =>{
        if(res){    
          this.setData({
            goods: res.result.data,
            standardArr: res.result.data.nxCommunityStandardEntities,
          }) 

          var goods = this.data.goods;
          var standardArr = this.data.standardArr;

          var price = Number(goods.nxCgGoodsPrice + '.' + goods.nxCgGoodsPriceDecimal);
          console.log(price)
          var scale = Number(standardArr[0].nxCsStandardScale);
          var standardName = standardArr[0].nxCsStandardName;
          var sel = "standardArr[0].isSelect";

          this.setData({
            sub: (price * scale).toFixed(1),
            price: price,
            standardPrice: (price * scale).toFixed(1),
            standardName: standardName, 
            amount: 1,
            current: 0,
            [sel]: true,

          })
          


        }
      })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  changeStandard:function(e){
    var current = e.detail.current;
    var sel = "standardArr["+ current +"].isSelect";
    var lastSel = "standardArr[" + this.data.current + "].isSelect"
   console.log(e.detail.current);
    var amount = Number(this.data.amount) ;
    var scale = Number(this.data.standardArr[current].nxCsStandardScale);
    var sub = (Number(this.data.price) * amount * scale).toFixed(1);
    var standardPrice = Number((this.data.standardArr[current].nxCsStandardScale * this.data.price)).toFixed(1);
    var standardName = this.data.standardArr[current].nxCsStandardName;

    this.setData({
      amount: amount,
      sub: sub,
      [lastSel] : false,
      [sel]: true,
      current: current,
      standardPrice: standardPrice,
      standardName: standardName, 

    })
  },

  
  addOne: function (e) {
    var amount = Number(this.data.amount) + 1;
    var sub = (this.data.standardPrice * amount).toFixed(1);
    this.setData({
      amount: amount,
      sub: sub,
    })
  },
  


  reduceOne: function (e) {
    if (this.data.amount > 1) {
      var amount = this.data.amount - 1;
     
      var sub = (this.data.standardPrice * amount).toFixed(1);
      this.setData({
        amount: amount,
        sub: sub,
      })
    }
  },


  confirm: function (e) {
    var goods = this.data.goods;
    var standardArr = this.data.standardArr;
    var standard = standardArr[this.data.current].nxCsStandardName;
    var price = goods.nxCgGoodsPrice + '.' + goods.nxCgGoodsPriceDecimal;
    var subWeight = 
      (Number(standardArr[this.data.current].nxCsStandardScale) * this.data.amount).toFixed(1);
      var subTotal = (this.data.amount * this.data.standardPrice).toFixed(1)
   
    var apply = {
      nxOsNxGoodsId: goods.nxCgNxGoodsId,
      nxOsQuantity: this.data.amount,
      nxOsStandardPrice: this.data.standardPrice,
      nxOsStandard: standard,
      nxOsPrice: price,
      nxOsCommunityGoodsFatherId: goods.nxCgCfGoodsFatherId,
      nxOsCommunityGoodsId: goods.nxCommunityGoodsId,
      nxOsGoodsSellType: goods.nxCgGoodsSellType,
      nxOsGoodsType: goods.nxCgGoodsType,
      nxOsGoodsSellStandardScale: standardArr[this.data.current].nxCsStandardScale,
      nxOsSubWeight: subWeight,
      nxOsSubtotal: subTotal,
      nxOsSubSupplierId: goods.nxCgSupplierId,
      nxOsCommunityId: goods.nxCgCommunityId,
      nxCommunityGoodsEntity: {
        nxCgGoodsName: goods.nxCgGoodsName,
        nxCgGoodsStandardname: goods.nxCgGoodsStandardname
      }
    }
    var applyArr = wx.getStorageSync("applyArr");
    if (applyArr) {
      applyArr.push(apply);
      wx.setStorageSync("applyArr", applyArr);
      this.setData({
        applyArr: applyArr,
        applyNumber: applyArr.length,
      })
    }else{
      var temp = [];
      temp.push(apply);
    }

    wx.navigateBack({
      delta: 1,
      selectAmount: this.data.amount
    })
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    prevPage.setData({
      state: 1,
      })
  },

})
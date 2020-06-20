
import apiUrl from '../../config.js'
import { getCommunityGoodsDetail } from '../../lib/apiCustomer.js'
const globalData = getApp().globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    amount: '',

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
      .then(res => {
        if (res) {
          this.setData({
            goods: res.result.data,
          })

          var goods = this.data.goods;

          var price = Number(goods.nxCgGoodsPrice + goods.nxCgGoodsPriceDecimal);
          this.setData({
            sub: 0,
            price: price,
          })

        }
      })


  },

  getAmount: function (e) {
    var value = e.detail.value;
    var price = this.data.price;
    var sub = (price * value).toFixed(1);
    this.setData({
      sub: sub,
      amount: value,

    })
  },

  confirm: function (e) {
    var goods = this.data.goods;
    var price = Number(goods.nxCgGoodsPrice) + Number(goods.nxCgGoodsPriceDecimal);
    var standard = goods.nxCgGoodsStandardname;
   ; 

    var apply = {
      nxOsNxGoodsId: goods.nxCgNxGoodsId,
      nxOsQuantity: this.data.amount,
      nxOsStandard: standard,
      nxOsPrice: price,
      nxOsCommunityGoodsFatherId: goods.nxCgCfGoodsFatherId,
      nxOsCommunityGoodsId: goods.nxCommunityGoodsId,
      nxOsSubtotal: this.data.sub,
      nxOsGoodsSellType: goods.nxCgGoodsSellType,
      nxOsGoodsType: goods.nxCgGoodsType,
      nxOsGoodsSellStandardScale: goods.nxCgGoodsSellStandardMinScale,
      nxOsSubWeight: this.data.amount,
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
    } else {
      var temp = [];
      temp.push(apply);
    }

    wx.navigateBack({
      delta: 1
    })
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    prevPage.setData({
      state: 1,
    })


  },



})
// pagesRes/disGoodsCata/disGoodsCata.js



const app = getApp()
const globalData = getApp().globalData;
import apiUrl from '../../config.js'



import {
  getDisGoodsCata
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
      url: apiUrl.server,

      disId: 1,
      
    })

     var value = wx.getStorageSync('userInfo');
     if(value){
      this.setData({
        face : value.nxDuWxAvartraUrl,
        name: value.nxDuWxNickName,
      }) 
     }
     this._getInitData();

     



  },




  _getInitData(){

    getDisGoodsCata(this.data.disId).then(res =>{
      if(res){
        this.setData({
          goodsList: res.result.data,
        })
      }
    })
  },

  toGoodsList(e){

    wx.navigateTo({
      url: '../disGoodsList/disGoodsList?fatherId=' + e.currentTarget.dataset.id 
      +'&fatherName=' + e.currentTarget.dataset.name ,
    })


  },


  showOrHide(e){
    var greatIndex = e.currentTarget.dataset.greatindex;
    var grandIndex = e.currentTarget.dataset.grandindex;
    for( var i = 0; i < this.data.goodsList.length; i ++){
     
      for(var j = 0; j < this.data.goodsList[i].nxGoodsEntityList.length; j++){
        var itemShow = "goodsList["+ i+"].nxGoodsEntityList["+ j+"].isShow";
        console.log(i);
        console.log(greatIndex);
        console.log("<<<<<<<")
        console.log(j);
        console.log(grandIndex);
        console.log(">>>>>>>>>>>>");
         if (i != greatIndex || j != grandIndex) {
          this.setData({
            [itemShow]: false
          })         
         }    
      }  
    }

 
    var show = this.data.goodsList[greatIndex].nxGoodsEntityList[grandIndex].isShow;
    var itemShow = "goodsList["+ greatIndex+"].nxGoodsEntityList["+ grandIndex+"].isShow";
    this.setData({
      [itemShow]: !show
    })

  },


})
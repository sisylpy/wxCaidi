// pages/business/catalogue/catalogue.js
import apiUrl from '../../config.js'
import { getCommunityGoods } from '../../lib/apiCustomer.js'
const globalData = getApp().globalData;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    
    totalPage: 0,
    totalCount: 0,
    limit: 21,
    currentPage: 1,
    isLoading: false,
    goodsList:[],
    index: 0,
    state: 0,



  },

  onShow:function(){
    var index = this.data.index;
    var state = this.data.state;
    var amount = this.data.selectAmount;
    if(index >= 0 && state ==1) {
      var isSelect = "goodsList[" + index +"].isSelected";
      var amount = "goodsList["+ index +"].dgGoodsOrderAmount";
      this.setData({
        [isSelect]: true,
        state: 0,
        index: 0,
        [amount]:amount
      })
    }
   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      windowWidth: globalData.windowWidth * globalData.rpxR,
      windowHeight: globalData.windowHeight * globalData.rpxR,
      digitBoardHeight: globalData.digitBoardHeight * globalData.rpxR,
      communityId: globalData.communityId,
      communityId:1,
    })

    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: options.color,
      animation: {
        duration: 200,
        timingFunc: 'easeIn'
      }
    })
    this.setData({
      fatherId: options.fatherId,
      fatherName: options.fatherName,
      color: options.color,

    })
    
    this._initData()
    this._getDataAndTime();
   
  },
  
  _initData() {

    var data = {
      limit: this.data.limit,
      page: this.data.currentPage,
      nxCommunityFatherGoodsId: this.data.fatherId,
      
    }


    getCommunityGoods(data).
      then(res => {
        if (res) {
          this.setData({
            totalPage: res.result.page.totalPage,
            totalCount: res.result.page.totalCount,
            goodsList: res.result.page.list,
          })
        }
      })
  },



  _getDataAndTime() {

    var date = new Date();
    var min = date.getMinutes();

    date.setMinutes(min + 30);

    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var hours = date.getHours();
    if (hours >= 0 && hours <= 9) {
      hours = "0" + hours;
    }
    var minutes = date.getMinutes();
    if (minutes >= 0 && minutes <= 9) {
      minutes = "0" + minutes;
    }
    var seconds = date.getSeconds();
    if (seconds >= 0 && seconds <= 9) {
      seconds = "0" + seconds;
    }
    var currentdatetime = date.getFullYear() + seperator1 + month + seperator1 + strDate +
      " " + hours + seperator2 + minutes +
      seperator2 + seconds;

    var currentdate = month + seperator1 + strDate;
    this.setData({
      date: currentdate
    })

    wx.setNavigationBarTitle({
      title: currentdate + "价目表"
    })


  },

  

  // onReachBottom  onPullDownRefresh
  onReachBottom: function () {
    let { currentPage, totalPage, isLoading } = this.data
    if (currentPage >= totalPage || isLoading) {
      return
    }
    this.setData({
      isLoading: true
    })
    var data = {
      limit: this.data.limit,
      page: this.data.currentPage + 1,
      fatherId: this.data.fatherId, 
      communityId: this.data.communityId,
    }
    getCommunityGoods(data)
      .then((res) => {
        wx.hideLoading()
        if (typeof cb === 'function') {
          cb()
        }
        if (res.result) {
          var goodsList = res.result.page.list;
          if (goodsList.length > 0) {
            var currentPage = this.data.currentPage; // 获取当前页码
            currentPage += 1; // 加载当前页面的下一页数据
            var now = this.data.goodsList;
            var newdata = now.concat(goodsList)
            this.setData({
              goodsList: newdata,
              currentPage,
              isLoading: false,
              totalPage: res.result.page.totalPage,
              totalCount: res.result.page.totalCount,
            })
          }
        }
      })
  },




  

  showGoodsPage: function(e){
    var index = e.currentTarget.dataset.index;
    var type = e.currentTarget.dataset.type;
    var id = e.currentTarget.dataset.id;
    var name = e.currentTarget.dataset.name;

    this.setData({
      index: index
    })
  
    if (type == 0){
      wx.navigateTo({
        url: '../zeroGoodsPage/zeroGoodsPage?nxCommunityGoodsId=' + id + '&name=' + name,
      })
    }else if(type == 1){
      wx.navigateTo({
        url: '../oneGoodsPage/oneGoodsPage?nxCommunityGoodsId=' + id +'&name='+name,
      })
    }
  },

  promation: function(e){
    console.log(e);
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../saleGoods/saleGoods',
    })
  }

 


})
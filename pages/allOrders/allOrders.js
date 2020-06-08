// pagesCustomer/checkOrder/checkOrder.js

import apiUrl from '../../config.js'
import userTime from '../../lib/userTime.js'
const globalData = getApp().globalData;
import {
  customerGetOrders
} from '../../lib/apiCustomer.js'




Page({

  /**
   * 页面的初始数据
   */
  data: {

    itemIndex: 0,
    totalPage: 0,
    totalCount: 0,
    limit: 21,
    currentPage: 1,

  },

  onShow:function(e){
    var value = wx.getStorageSync("userInfo");
    this.setData({
      userInfo: value
    }) 
    this._initData();  

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({
      windowWidth: globalData.windowWidth * globalData.rpxR,
      windowHeight: globalData.windowHeight * globalData.rpxR,
      // userInfo: globalData.userInfo,

    })
     
  },


  _initData() {

    var data = {
      limit: this.data.limit,
      page: this.data.currentPage,
      nxOrdersUserId: this.data.userInfo.nxCustomerUserEntity.nxCuUserId,
    }
   
    customerGetOrders(data)
      .then(res => {
        if (res) {
          this.setData({
            totalPage: res.result.page.totalPage,
            totalCount: res.result.page.totalCount,
            orderArr: res.result.page.list,
          })
        }
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
      nxOrdersUserId: this.data.nxCustomerUserId,
    }
    customerGetOrders(data)
      .then((res) => {
        wx.hideLoading()
        if (typeof cb === 'function') {
          cb()
        }
        if (res.result) {
          var orderArr = res.result.page.list;
          if (orderArr.length > 0) {
            var currentPage = this.data.currentPage; // 获取当前页码
            currentPage += 1; // 加载当前页面的下一页数据
            var now = this.data.orderArr;
            var newdata = now.concat(orderArr)
            this.setData({
              orderArr: newdata,
              currentPage,
              isLoading: false,
              totalPage: res.result.page.totalPage,
              totalCount: res.result.page.totalCount,
            })
          }
        }
      })
  },

  toDetail:function(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../ordersDetailPage/ordersDetailPage?nxOrdersId=' + id,
    })
  },



})
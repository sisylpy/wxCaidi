// pagesOrder/rIndex/rIndex.js

const globalData = getApp().globalData;
var app = getApp()

import apiUrl from '../../config.js'
import {
  userInfo,
  userGetApplys,
} from '../../lib/apiRestraunt'

import {
  getSubDepartments,
} from '../../lib/apiDepOrder'

Page({

  /**
   * 页面的初始数据
   */
  data: {

    showChoice: false,
    hassubs: 0,

  },

  onShow: function () {
    console.log(this.data.userId)
    if (this.data.userId) {
      this._getUserApply();
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("globbdbddbdbbdbDATA!!!!!")
    console.log(globalData)






    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#1e82b4',
      animation: {
        duration: 200,
        timingFunc: 'easeIn'
      }
    })
    this.setData({
      userId:  globalData.groupInfo.userInfo.nxDepartmentUserId,
      depId: globalData.groupInfo.groupInfo.nxDepartmentId,
      windowWidth: globalData.windowWidth * globalData.rpxR,
      windowHeight: globalData.windowHeight * globalData.rpxR,
      url: apiUrl.server,
      // dep: globalData.groupInfo.groupInfo,
      // user: globalData.groupInfo.userInfo,
    })
    var hassubs = globalData.groupInfo.groupInfo.nxDepartmentHasSubs;
    wx.setNavigationBarTitle({
      "title": globalData.groupInfo.groupInfo.nxDepartmentName,
    })

    if(hassubs == 1){
      this.setData({
        showChoice: true,
        subArr: globalData.groupInfo.groupInfo.nxDepartmentEntities,
        hassubs: 1,
      })
 
    }



  },


  _getUserInfo() {

    userInfo(this.data.userId).then(res => {
      if (res) {

        if (res.result.data.depInfo.nxDepartmentHasSubs !== 0) {
          this.setData({
            showChoice: true,
          })
          this.getSubDep();
        } else {
          this.setData({
            dep: res.result.data.depInfo,
            user: res.result.data.userInfo,

          })
          globalData.depInfo = res.result.data.depInfo;

        }   
      }

    })
   


  },

  _getUserApply() {
    var data = {
      userId: this.data.userId,
      depId: this.data.depId,
    }
   
    userGetApplys(data).then(res => {
      if (res) {
        console.log(res)
        this.setData({
          applyArr: res.result.data
        })
      }
    })

  },


  toDepGoods() {
    wx.navigateTo({
      url: '../depGoods/depGoods?depId=' + this.data.depId,
    })
  },

  toResGoods() {
    wx.navigateTo({
      url: '../resGoodsList/resGoodsList?depId=' + this.data.depId,
    })
  },

  // getSubDep() {
  //   getSubDepartments(this.data.depId).then(res => {
  //     if (res) {
  //       console.log(res)
  //       this.setData({
  //         subArr: res.result.data,
  //         userId: globalData.groupInfo.userInfo.nxDepartmentUserId,

  //       })
  //     }
  //   })

  // },
  selectDepartment(e) {
    console.log(e);
    var depId = e.currentTarget.dataset.id;
    this.setData({
      depId: depId,
      showChoice: false,
      dep: e.currentTarget.dataset.dep,
      user: globalData.groupInfo.userInfo,
      depName: e.currentTarget.dataset.dep.nxDepartmentName

    })
    // globalData.depInfo = e.currentTarget.dataset.dep;

    this._getUserApply();

  }




})
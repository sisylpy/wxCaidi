// pagesRes/inviteAndOrder/inviteAndOrder.js


const app = getApp()
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
    console.log(globalData.groupInfo)
    
    this.setData({
      windowWidth: globalData.windowWidth * globalData.rpxR,
      windowHeight: globalData.windowHeight * globalData.rpxR,
      depId: globalData.groupInfo.groupInfo.nxDepartmentId,
      disId: globalData.groupInfo.groupInfo.nxDepartmentDisId,
      userId: globalData.groupInfo.userInfo.nxDepartmentUserId
    })

  },

  
  toOpenOrder(){

    // wx.navigateToMiniProgram({
    //   appId: 'wx87baf9dcf935518a',
    //   path: 'pagesIssue/customerList/customerList?id=1',
    //   // extraData: {
    //   //   foo: 'bar'
    //   // },
    //   envVersion: 'develop',
    //   success(res) {
    //     // 打开成功
    //   }
    // })

    wx.navigateTo({
      url: '../../pagesOrder/rIndex/rIndex?userId=' + this.data.userId +'&depId=' + this.data.depId,
    })

  },

  
  onShareAppMessage: function (res) {
    return {
      title: '请大家加入手机订货群',    
      path: '/pagesRes/depUserInfo/depUserInfo?depId=' + this.data.depId + '&disId=' + this.data.disId,     // 当前页面 path ，必须是以 / 开头的完整路径
      imageUrl: '../../../images/logo.jpg',
       success: function (res) {
         console.log(res)

       },
    }
  },









})


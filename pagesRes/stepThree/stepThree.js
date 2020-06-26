const app = getApp()
const globalData = app.globalData;
import {restrauntRegist, }  from '../../lib/apiRestraunt'


Page({
  data: {
    second_height: 0,
    inputed: false,

  },

  onLoad: function (options) {
    this.setData({
      url : options.url,  
      second_height: globalData.windowHeight - globalData.windowWidth / 750 * 120 - (globalData.windowWidth / 750) * 94,
      userId: options.id,
      windowWidth: globalData.windowWidth * globalData.rpxR,
      windowHeight: globalData.windowHeight * globalData.rpxR,
      disId: options.disId,
      type: options.type,

    })
   
    
  },



  //群名称输入
  bindKeyInput: function (e) {
    if(e.detail.value)
    this.setData({
      inputValue: e.detail.value,
      inputed: true,
    })
  },


  getUserInfo(e){
 console.log('aaa')

 wx.getUserInfo({
  success: res => {
    wx.login({
      success: (res) => {
       
       var dep = ""
 
 if(this.data.type < 3) {
       
  var value = wx.getStorageSync('deps');
  if(value) {
    dep = {  
      nxDepartmentName: this.data.inputValue,
      nxDepartmentFatherId: 0,
      nxDepartmentType: this.data.type,
      nxDepartmentDisId: this.data.disId,
      nxDepartmentEntities: value,
      nxDepartmentUserEntity: {
       nxDuWxNickName: e.detail.userInfo.nickName,
       nxDuWxAvartraUrl: e.detail.userInfo.avatarUrl,
       nxDuCode:res.code,
       nxDuAdmin: 1,
       nxDuDistributerId: this.data.disId,
      }
    }
  }
 }else{
  dep = {  
    nxDepartmentName: this.data.inputValue,
    nxDepartmentFatherId: 0,
    nxDepartmentType: this.data.type,
    nxDepartmentDisId: this.data.disId,
    nxDepartmentEntities: [],
    nxDepartmentUserEntity: {
     nxDuWxNickName: e.detail.userInfo.nickName,
     nxDuWxAvartraUrl: e.detail.userInfo.avatarUrl,
     nxDuCode:res.code,
     nxDuAdmin: 1,
     nxDuDistributerId: this.data.disId,
    }
  }
 }


 restrauntRegist(dep).then(res => {
   if(res) {
     wx.reLaunch({
      url: '../index/index?userId=' + res.result.data,
     })
    
     // console.log(globalData.socket)
     // var ids =  wx.getStorageSync('socketIds');
     // console.log(ids);

     // globalData.socket.emit('finished', ids );

 
   }
 })
      },
      fail: (res =>{
        console.log(res)
      })
    })

    // /////////



  

  },
  fail: res => {
    console.log("quxiaole userinfo......")
    // 获取失败的去引导用户授权 
  }
})




},
 


})
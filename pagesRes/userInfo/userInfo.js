// pagesRes/userInfo/userInfo.js

import {saveUser} from "../../lib/apiRestraunt"

import {
  getDisInfoByUserId,
} from '../../lib/apiBasic'

const globalData = getApp().globalData;
// var socket = globalData.socket;
var member = {}

// const io = require('../../utils/weapp.socket.io.js')
const io = require("../../utils/weapp.socket.io.js")
// // socket 连接地址
var socketUrl = 'http://localhost:3000'
// var socketUrl = 'https://grainservice.club'
var socketMessage = ''


Page({

  /**
   * 页面的初始数据
   */
  data: {
    storeId: 1,
    show: false,
    showMes: "工作人员将立即为注册，请稍后！",
  

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      windowWidth: globalData.windowWidth * globalData.rpxR,
      windowHeight: globalData.windowHeight * globalData.rpxR,
      // id: options.socketId,
      disUserId: options.disUserId,
      disUserId: 1,
    })

    getDisInfoByUserId(this.data.disUserId).then(res => {
      if (res) {
        console.log(res);
        globalData.userInfo = res.result.data;
        this.setData({
          userInfo: res.result.data
        })

      }
    })

  },

  




  //用户授权中链接socket
  getUserInfo: function(e) {

    //用户点击“确认”
    wx.getUserInfo({
      success: res => {
        wx.login({
          success: (res) => {
            var nxDepartmentUser = {
              nxDuWxNickName: e.detail.userInfo.nickName,
              nxDuWxAvartraUrl: e.detail.userInfo.avatarUrl,
              nxDuCode:res.code,
              nxDuAdmin: 1,
              nxDuDistributerId: this.data.disId,
            }
           
            saveUser(nxDepartmentUser)
              .then((res => {
                console.log(res);
                
                if (res) {
                  wx.redirectTo({
                    url: '../stepOne/stepOne',
                  })

                  // this.socketStart(res.result.data);
                  

                  // this.socket.on('commitSuccess', (data) => {
                  //   insertNewMember(member)
                  //     .then((res => {
                  //       if (res.result) {
                  //         console.log("result  shi  ge sha dognxi ?")
                  //         console.log(res.result)
                  //         wx.setStorageSync("userInfo", res.result.data);
                  //         this.setData({
                  //           show: false
                  //         })
    
                  //         wx.navigateTo({
                  //           url: '../member/member',
                  //         })
                  //         if (this.socket) {
                  //           console.log("guan")
                  //           this.socket.close();
                  //         }
                  //       } else {
    
                  //       }
                  //     }))
                  // })
                 
                } else {
                  wx.showToast({
                    title: '请重新提交',
                  })
                }
              }
              ))
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
  }



})
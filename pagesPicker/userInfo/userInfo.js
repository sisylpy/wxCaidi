// pagesRes/userInfo/userInfo.js

import {savePickerUser} from "../../lib/apiPicker"

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
      id: options.id,
    })

  },






  //用户授权中链接socket
  getUserInfo: function(e) {

    //用户点击“确认”
    wx.getUserInfo({
      success: res => {


// /////////
        wx.login({
          success: (res) => {

             //显示mask
        // this.setData({
        //   show: true
        // })

            var nxDepartmentUser = {
              nxDuWxNickName: e.detail.userInfo.nickName,
              nxDuWxAvartraUrl: e.detail.userInfo.avatarUrl,
              nxDuCode:res.code
            }
            // this.setData({
            //   [aaa]: user,
            //   [customerCode]: code,
            // })

            saveUser(nxDepartmentUser)
              .then((res => {
                console.log(res);
                this.setData({
                  user: res.result.data
                })
                if (res.result.data) {

                  this.socketStart(res.result.data);
                  

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
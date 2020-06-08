// pagesCustomer/register/register.js

import { saveNewUser, communityInfo } from '../../lib/apiCustomer.js'
const globalData = getApp().globalData;
var bmap = require('../../lib/bmap-wx.min.js');
import MapUtil from '../../lib/map.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {

    showSug: false,
    canLogin: false,

  },

  onShow: function () {
    this._getInitData();
  },

  onLoad: function (options) {
    this.setData({
      communityId: options.nxCommunityId,
      customer:{
        nxCustomerCall: 1,
      }
     
    })
  },
// 绑定input输入 
bindKeyInput: function (e) {
  console.log(e);
  var that = this;
  // 新建百度地图对象 
  var BMap = new bmap.BMapWX({
    ak: 'rIwZLlBFGOPxavkl1FGze6VoTVtekEuC'
  });
  var fail = function (data) {
    console.log(data)
  };
  var success = function (data) {
    
    console.log(data.result)
    if(data.result.length > 0){
      that.setData({
        sugData: data.result,
        showSug: true,
      });
    }
   
  }
  // 发起suggestion检索请求 
  BMap.suggestion({
    query: e.detail.value,
    region: '三河市',
    city_limit: true,
    fail: fail,
    success: success
  });
},
  _getInitData: function () {
    communityInfo(this.data.communityId)
      .then(res => {
        if (res) {
          console.log(JSON.parse(res.result.data.nxCommunityPolygon).data )
          this.setData({
            nxCommunityPolygon: JSON.parse(res.result.data.nxCommunityPolygon).data,
          })
        }
      })
  },

  
  clickCommunity: function (e) {
    var lat =  Number(e.currentTarget.dataset.location.lat).toFixed(6) ;
    var lng = Number(e.currentTarget.dataset.location.lng).toFixed(6) ;
    var name = e.currentTarget.dataset.name;

    let point = {lng:Number(lng),lat: Number(lat)};
    this.setData({
      point: point
    })
    
    
    let len = this.data.nxCommunityPolygon.length ;
    let arr = [];
     for( var i = 0; i < len; i++){
       console.log(i);
       var point2 = this.data.nxCommunityPolygon[i];
       var lat = Number(point2.lat) ;
       var lng = Number(point2.lng);
       var one = {
         lng: lng,
         lat: lat
       }
       arr.push(one);

     }
     this.setData({
       polygon: arr
     })



    let oneResult = MapUtil.isPointInPolygon(this.data.point,this.data.polygon)
    console.log(oneResult)
    if(oneResult){
      console.log("zai")
      var customer ={
        nxCustomerCommunityId: this.data.communityId,
        nxCustomerLat: lat,
        nxCustomerLng: lng,
        nxCustomerAddress: name, 
        nxCustomerCall: 1,
      
      }
      this.setData({
        customer: customer,
        showSug: false
      })
    }else{
      console.log("bu zai");
      var that = this;
      wx.showToast({
        title: '抱歉，您对地址超出了目前送货范围，我们以后会逐步服务更大范围对顾客。',
        icon: 'none',
        success:function(){
          that.setData({
            showSug: false,
            customer: {
              nxCustomerCall: 1
            }
          })
         
        },
      })

      // this.setData({
      //   showSug: false
      // })

    }

  },


  // 绑定详细地址输入 
  bindAddressInput: function (e) {
    var value = e.detail.value;
    var address = "customer.nxCustomerDetailAddress";
    this.setData({
      [address]: value,
    })
    this.ifCanLogin();
  },

  //输入名字
  bindNameInput: function (e) {
    var value = e.detail.value;
    var name = "customer.nxCustomerName";
    this.setData({
      [name]: value,
    })
    this.ifCanLogin();
  },
  // 选择性别
  selectCall: function (e) {
    var call = e.currentTarget.dataset.call;
    var cc = "customer.nxCustomerCall"
    this.setData({
      [cc]: call
    })
    this.ifCanLogin();


  },
  //正在输入手机号
  inputPhone: function (e) {
    this.setData({
      tishi: ""
    })
    this.ifCanLogin();
  },
  //输入完成
  getPhone: function (e) {

    var value = e.detail.value;
    var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (!myreg.test(value)) {
      this.setData({
        tishi: "请输入正确手机号",
      })
    } else {
      var phone = "customer.nxCustomerPhone";
      this.setData({
        [phone]: value,
      })
      this.ifCanLogin();
    }
  },



  //用户授权
  getUserInfo: function (e) {

    //用户点击“确认”
    wx.getUserInfo({
      success: res => {
        wx.login({
          success: (res) => {
            var user = {
              nxCuWxNickName: e.detail.userInfo.nickName,
              nxCuWxAvatarUrl: e.detail.userInfo.avatarUrl,
              nxCuWxGender: e.detail.userInfo.gender,
            }
            var aaa = "customer.nxCustomerUserEntity"
            var code = res.code;
            var customerCode = "customer.code";
            this.setData({
              [aaa]: user,
              [customerCode]: code,
            })

            saveNewUser(this.data.customer)
              .then((res => {
                console.log(res);
                if (res.result.data.status == 1) {
                  // 保存全局用户
                  getApp().globalData.userInfo = res.result.data.user;
                  getApp().globalData.nxCommunityId = this.data.nxCommunityId;
                  wx.setStorageSync("userInfo", res.result.data.user);

                  wx.redirectTo({
                    url: '/pages/index/index',
                  })
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
      },
      fail: res => {
        console.log("quxiaole userinfo......")
        // 获取失败的去引导用户授权 
        this._getInitData();

      }
    })

  },



  // 判断是否可以登陆
  ifCanLogin() {
    var address = this.data.customer.nxCustomerAddress;
    var name = this.data.customer.nxCustomerName;
    var call = this.data.customer.nxCustomerCall;
    var phone = this.data.customer.nxCustomerPhone;
    if (address && name && call && phone) {
      this.setData({
        canLogin: true,
      })
    }
  },


  // 获取全局键盘高度
  getDigitHeight: function (e) {
    getApp().globalData.digitBoardHeight = e.detail.height;
  }



})
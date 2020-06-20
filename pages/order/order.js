// pagesCustomer/order/order.js
const globalData = getApp().globalData;
import userTime from '../../lib/userTime.js'
import {
  saveOrder
} from '../../lib/apiCustomer.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    applyArr: [],
    multiIndex: [0, 0, 0],
  },

  onShow:function(e){
    // this.setData({
    //   userInfo: globalData.userInfo
    // })

    var value = wx.getStorageSync("userInfo");
    this.setData({
      userInfo: value
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    this.setData({
      windowWidth: globalData.windowWidth * globalData.rpxR,
      windowHeight: globalData.windowHeight * globalData.rpxR,
    })

    var applyArr = wx.getStorageSync("applyArr");
    if (applyArr.length > 0) {
      this.setData({
        applyArr: applyArr,
      })
      this._getTotal();
    }
   
    var userTime = wx.getStorageSync("userTime");
    if(userTime) {
      this.setData({
        userTime: userTime,
      })
    };
    this._getPickData();
  },



  reduce: function (e) {
    var applyIndex = e.currentTarget.dataset.index;
    var number = this.data.applyArr[applyIndex].nxOsQuantity;
    var sellType = this.data.applyArr[applyIndex].nxOsGoodsSellType;
    var price = this.data.applyArr[applyIndex].nxOsPrice;
    var zeroPrice = Number(price) / 10;
    zeroPrice.toFixed(1);
    var scale = this.data.applyArr[applyIndex].nxOsGoodsSellStandardScale;
    var add = (Number(price) * Number(scale)).toFixed(1);
    var subWeight = this.data.applyArr[applyIndex].nxOsSubWeight;
    var sub = this.data.applyArr[applyIndex].nxOsSubtotal;

    var apply = "applyArr[" + applyIndex + "].nxOsQuantity";
    var nxOsSubtotal = "applyArr[" + applyIndex + "].nxOsSubtotal";
    var nxOsSubWeight = "applyArr[" + applyIndex + "].nxOsSubWeight";
    if (sellType == 0) {
      sub = (Number(sub) - zeroPrice).toFixed(1);
      subWeight = (Number(subWeight) - 0.1).toFixed(1);
      this.setData({
        [apply]: (Number(number) - 0.1).toFixed(1),  
      })
    } else if (sellType == 1) {
      sub = (Number(sub) - Number(add)).toFixed(1);
      subWeight = (Number(subWeight) - Number(scale)).toFixed(1);
      this.setData({
        [apply]: Number(number) - 1,  
      })
    }

    console.log(number);
    if (number == 1) {
      if(this.data.applyArr.length == 1){
        console.log("back le")
        // wx.showToast({
        //   title: 'back',
        //   success:function(){
          
        //   }
        // })
        wx.navigateBack({
          delta: 1
        })
        this.data.applyArr.splice(applyIndex, 1);
        wx.setStorageSync("applyArr", applyArr);

      
      }else{

        var applyArr = this.data.applyArr;
        applyArr.splice(applyIndex, 1);
        this.setData({
          applyArr: applyArr,
        })
        wx.setStorageSync("applyArr", applyArr);
        this._getTotal();
      }
    } else {
      this.setData({
        [nxOsSubtotal]: sub,
        [nxOsSubWeight] : subWeight,
      })
      wx.setStorageSync("applyArr", this.data.applyArr);
      this._getTotal();

    }
  },

  add: function (e) {
    
    var applyIndex = e.currentTarget.dataset.index;
    var apply = "applyArr[" + applyIndex + "].nxOsQuantity";
    var number = this.data.applyArr[applyIndex].nxOsQuantity;
    var sub = this.data.applyArr[applyIndex].nxOsSubtotal;
    var sellType = this.data.applyArr[applyIndex].nxOsGoodsSellType;
    var price = this.data.applyArr[applyIndex].nxOsPrice;
    var nxOsStandardPrice = this.data.applyArr[applyIndex].nxOsStandardPrice;
    var zeroPrice = Number(price) / 10;
    zeroPrice.toFixed(1);
    var scale = this.data.applyArr[applyIndex].nxOsGoodsSellStandardScale;
    var add = (Number(price) * Number(scale)).toFixed(1);
    var subWeight = this.data.applyArr[applyIndex].nxOsSubWeight;
    var nxOsSubtotal = "applyArr[" + applyIndex + "].nxOsSubtotal";
    var nxOsSubWeight = "applyArr[" + applyIndex + "].nxOsSubWeight";

    if(sellType == 0){
      sub = (Number(sub) + zeroPrice).toFixed(1);
      subWeight = (Number(subWeight) + 0.1).toFixed(1);
      this.setData({
        [apply]: (Number(number) + 0.1).toFixed(1),
      })
    }else if (sellType == 1){
      sub  = (Number(sub) + Number(add)).toFixed(1);
      subWeight = (Number(subWeight) + Number(scale)).toFixed(1);
      this.setData({
        [apply]: Number(number) + 1,
      })
    }
    this.setData({
      [nxOsSubtotal]: sub,
      [nxOsSubWeight]: subWeight,
    })
    wx.setStorageSync("applyArr", this.data.applyArr);
    this._getTotal();


  },


  cancelUsertime: function(e){
    wx.removeStorageSync("userTime");
    this.setData({
      userTime: null
    })

  },
  _getTotal:function(e){
    var applyArr = this.data.applyArr;
    var total = 0;
    for (var i = 0; i < applyArr.length; i++) {
      var sub = applyArr[i].nxOsSubtotal;
      total = total + Number(sub);
    }
    this.setData({
      total: total.toFixed(1)
    })

  },


  gorRunnerLobby:function(){
    var data = this._getOrderData();
    saveOrder(data)
    .then(res => {
      if(res) {
        console.log(res)
        var map = res.result.map;
        wx.requestPayment({
          nonceStr: map.nonceStr,
          package: map.package,
          signType: "MD5",
          timeStamp: map.timeStamp,
          paySign: map.paySign,

          success: function(res){
            console.log(res);
            
// wx.removeStorageSync("applyArr");
        // wx.removeStorageSync("userTime");

        // wx.navigateBack({
        //   delta: 1
        // }) 
          },
          fail:function(res){
            console.log(res);

          }
        })

            
         }
    })

  },

  _getOrderData:function(e){
   
    var applyArr = wx.getStorageSync("applyArr");
    var userTime = wx.getStorageSync("userTime");
    var method = userTime.method;
    var dayName = userTime.dayName;
    var serviceTime = userTime.dayTime;

    var service = ""
    var arr = serviceTime.split(":");
    var hour = arr[0];
    if(hour < 10)hour = "0" + hour;
    var min = arr[1];
   
    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth() + 1;
    if (month < 10) month = "0" + month;

    var date = new Date();
    var today = date.getDate();
    // var date1 = new Date();
    var date2 = new Date(date);
    date2.setDate(date.getDate() + 1);
    var tomorrow = date2.getDate();
    var serviceDate = "";
    if(method == "今天"){
      serviceDate = month + '-' + today;
      service = month + today + hour + min;

    }if(method == "明天"){
      service = month + tomorrow + hour + min;
      serviceDate = month + '-' + tomorrow;
    }

    
    var data = {
      nxOrdersCustomerId: this.data.userInfo.nxCustomerId,
      nxOrdersUserId: this.data.userInfo.nxCustomerUserEntity.nxCuUserId,
      nxOrdersDistributerId: this.data.userInfo.nxCustomerDisId,
      nxOrdersCommunityId: this.data.userInfo.nxCustomerCommunityId,
      nxOrdersService: service,
      nxOrdersServiceDate: serviceDate,
      nxOrdersServiceTime: serviceTime,
      nxOrdersSubAmount: applyArr.length,
      nxOrdersSubEntities: applyArr,
      nxOrdersAmount: this.data.total,
      nxOrdersType: 0,
    }
    return data;
  },




//

  toAddressPage:function(){
   wx.navigateTo({
     url: '/pages/customerInfo/customerInfo',
   })
  },


  _getPickData: function (e) {
    var customerChoice = userTime.getPickData();
    this.setData({
      customerChoice: customerChoice
    })

    var multiArray = userTime.getMultiArray();

    this.setData({
      multiArray: multiArray
    })
  },

  bindMultiPickerChange: function (e) {
    this.setData({
      method: this.data.multiArray[0][this.data.multiIndex[0]],
      dayName: this.data.multiArray[1][this.data.multiIndex[1]],
      dayTime: this.data.multiArray[2][this.data.multiIndex[2]]
    })
    var userTime = {
      method: this.data.method,
      dayName: this.data.dayName,
      dayTime: this.data.dayTime,
    }
    wx.setStorageSync("userTime", userTime);
    this.setData({
      userTime: userTime,
    })


  },

  bindMultiPickerColumnChange: function (e) {
   
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;

    //修改第一列---天
    switch (e.detail.column) {
      case 0:
        switch (data.multiIndex[0]) {
          case 0:
            var b = [];
            var lenb = this.data.customerChoice[0].day.length;
            for (var j = 0; j < lenb; j++) {
              var bz = this.data.customerChoice[0].day[j].dayName;
              b.push(bz);
            }
            this.data.multiArray[1] = b;
            data.multiArray[2] = this.data.customerChoice[0].day[0].dayTime;
            break;
          //修改第二列 ---下午
          case 1:
            var b = [];
            var lenb = this.data.customerChoice[1].day.length;
            for (var j = 0; j < lenb; j++) {
              var bz = this.data.customerChoice[1].day[j].dayName;
              b.push(bz);
            }
            data.multiArray[1] = b;
            data.multiArray[2] = this.data.customerChoice[1].day[0].dayTime;
            break;
        }
        data.multiIndex[1] = 0;
        data.multiIndex[2] = 0;
        break;

      //ddd

      case 1:
        switch (data.multiIndex[0]) {
          case 0:
            switch (data.multiIndex[1]) {
              case 0:
                data.multiArray[2] = this.data.customerChoice[0].day[0].dayTime;
                break;
              case 1:
                data.multiArray[2] = this.data.customerChoice[0].day[1].dayTime;
                break;
              case 2:
                data.multiArray[2] = this.data.customerChoice[0].day[2].dayTime;
                break;
              case 3:
                data.multiArray[2] = this.data.customerChoice[0].day[3].dayTime;
                break;
              case 4:
                data.multiArray[2] = this.data.customerChoice[0].day[4].dayTime;
                break;
              case 5:
                data.multiArray[2] = this.data.customerChoice[0].day[5].dayTime;
                break;
              case 6:
                data.multiArray[2] = this.data.customerChoice[0].day[6].dayTime;
                break;

            }
            break;

          case 1:
            switch (data.multiIndex[1]) {
              case 0:
                data.multiArray[2] = this.data.customerChoice[1].day[0].dayTime;
                break;
              case 1:
                data.multiArray[2] = this.data.customerChoice[1].day[1].dayTime;
                break;
              case 2:
                data.multiArray[2] = this.data.customerChoice[1].day[2].dayTime;
                break;
              case 3:
                data.multiArray[2] = this.data.customerChoice[1].day[3].dayTime;
                break;
              case 4:
                data.multiArray[2] = this.data.customerChoice[1].day[4].dayTime;
                break;
              case 5:
                data.multiArray[2] = this.data.customerChoice[1].day[5].dayTime;
                break;
              case 6:
                data.multiArray[2] = this.data.customerChoice[1].day[6].dayTime;
                break;

            }
            break;
        }
        data.multiIndex[2] = 0;
        break;

    }
    this.setData(data);
  },



})
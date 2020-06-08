// pages/business/catalogue/catalogue.js


import apiUrl from '../../config.js'
import userTime from '../../lib/userTime.js'
const globalData = getApp().globalData;
import {
  customerIndexData
} from '../../lib/apiCustomer.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {

    multiIndex: [0, 0, 0],
    applyArr: [],
    method: 0,
    show: false,
    showCar: false,
    itemIndex: 0,
    // tejiaArr: [
    //   {
    //     img: "../../images/teji1.jpg",
    //     name: "裙带菜2袋",
    //     price: "9.0",
    //     yuanPrice: "21.0",
    //     words: "新品"
    //   },
    //   {
    //     img: "../../images/tejia3.jpg",
    //     name: "叶生菜2斤",
    //     price: "2.0",
    //     yuanPrice: "4.0",
    //     words: "今日特价"
    //   }
    // ]

  },


  onShow: function () {

   var value = wx.getStorageSync("userInfo");
   this.setData({
     userInfo: value
   })

    this._getGoods();

    this._getPickData();
   
    var value = wx.getStorageSync("applyArr");
    if (value.length > 0) {
      this.setData({
        applyArr: value,
        applyNumber: value.length,
      })
    } else {
      wx.setStorageSync("applyArr", []);
      this.setData({
        applyArr: [],
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
      url: apiUrl.server,
      userInfo: globalData.userInfo,  
      // communityId: globalData.communityId,
      // disId: 1  ,
      communityId: 1, 
    })



  },


  _getGoods() {
    customerIndexData(this.data.communityId).
      then(res => {
        if (res) {
          console.log(res.result.data)
          this.setData({
            goodsList: res.result.data.fathers,
            adsenseList: res.result.data.adsense,
          })
        }

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
    this.setData({
      userTime: userTime
    })
    wx.setStorageSync("userTime", userTime);


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






  clickFather: function (e) {
    var id = e.currentTarget.dataset.id;
    var fatherName = e.currentTarget.dataset.fathername;
    var color = e.currentTarget.dataset.color;
    wx.navigateTo({
      url: '/pages/sign/sign?fatherId=' + id + '&fatherName=' + fatherName + '&color=' + color,
    })

  },

  showCar: function (e) {
    if (this.data.showCar) {
      this.setData({
        showCar: false,
      })
    } else {
      this.setData({
        showCar: true,
      })
    }
  },

  reduce: function (e) {

    var applyIndex = e.detail.index;
    var apply = this.data.applyArr[applyIndex];
    var applyQuantity = "applyArr[" + applyIndex + "].nxOsQuantity";
    var applySubtotal = "applyArr[" + applyIndex + "].nxOsSubtotal";
    var applySubWeight = "applyArr[" + applyIndex + "].nxOsSubWeight";

    var scale = Number(apply.nxOsGoodsSellStandardScale);
    var quantity = Number(apply.nxOsQuantity);
    var subWeight = Number(apply.nxOsSubWeight);
    var subTotal = Number(apply.nxOsSubtotal);
    var price = Number(apply.nxOsPrice);
    var subWeight = (subWeight - scale).toFixed(1);
    var subTotal = (subTotal - price * scale).toFixed(1);

    if (quantity == 1) {
      var applyArr = this.data.applyArr;
      applyArr.splice(applyIndex, 1);
      this.setData({
        applyArr: applyArr,
      })
      wx.setStorageSync("applyArr", applyArr);
      if (applyArr.length == 0) {
        this.setData({
          showCar: false
        })
      }
    } else {
      console.log("set")
      this.setData({
        [applyQuantity]: Number(quantity) - 1,
        [applySubtotal]: subTotal,
        [applySubWeight]: subWeight
      })
      console.log(this.data.applyArr)
      wx.setStorageSync("applyArr", this.data.applyArr);
    }
  },

  add: function (e) {
    var applyIndex = e.detail.index;
    var apply = this.data.applyArr[applyIndex];
    var applyQuantity = "applyArr[" + applyIndex + "].nxOsQuantity";
    var applySubtotal = "applyArr[" + applyIndex + "].nxOsSubtotal";
    var applySubWeight = "applyArr[" + applyIndex + "].nxOsSubWeight";

    var scale = Number(apply.nxOsGoodsSellStandardScale);
    var quantity = Number(apply.nxOsQuantity);
    var subWeight = Number(apply.nxOsSubWeight);
    var subTotal = Number(apply.nxOsSubtotal);
    var price = Number(apply.nxOsPrice);
    var subWeight = (subWeight + scale).toFixed(1);
    var subTotal = (subTotal + price * scale).toFixed(1);

    this.setData({
      [applyQuantity]: Number(quantity) + 1,
      [applySubtotal]: subTotal,
      [applySubWeight]: subWeight
    })
    wx.setStorageSync("applyArr", this.data.applyArr);

  },

  choiceFinish: function (e) {
    this.setData({
      showCar: false
    })
    this.bindMultiPickerChange();
    wx.navigateTo({
      url: '../../pages/order/order',
    })

  },

  toUserPage: function () {
    wx.navigateTo({
      url: '../userPage/userPage',
    })
  },

  toAllOrders: function () {
    wx.navigateTo({
      url: '../allOrders/allOrders',
    })
  },


  toUserGoodsPage: function (e) {
    wx.navigateTo({
      url: '../templatesPage/templatesPage',
    })
  },

  toCaidiPage: function (e) {
    wx.navigateTo({
      url: '../caidiPage/caidiPage',
    })
  },

  emptyApplyArr: function (e) {
    wx.setStorageSync("applyArr", []);
    this.setData({
      applyArr: [],
      showCar: false,
    })
  },
  clickSale: function(e){
    var id = e.currentTarget.dataset.id;
    console.log(e)
    wx.navigateTo({
      url: '../saleGoods/saleGoods?promoteId=' + id,
    })
  }

})
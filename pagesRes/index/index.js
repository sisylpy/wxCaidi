// pagesD/index/index.js

const app = getApp()
const globalData = getApp().globalData;


import {
  groupInfo,
  copyIndependentOrders,
  shareIndependentOrders,
  finishIndependentOrders
} from '../../lib/apiRestraunt'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // grouplist: []
    oneName: "商品管理",
    oneUrl: "../../images/goods.jpg",
    twoName: "订货",
    twoUrl: "../../images/addGroup.jpg",
   
    userInfo: null,
    showWhich: 1,
    selAmount: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  //   background: #234b50;

  onShow: function () {
    if (this.data.userInfo !== null) {
      this._getGroupInfo();
    }

    if(this.data.isShareing){
      var that = this;
      wx.showModal({
        title: '微信订货',
        content: '确定已经转发给了微信好友？',
        showCancel: true,//是否显示取消按钮
        cancelText:"没有",//默认是“取消”
        cancelColor:'#464545',//取消文字的颜色
        confirmText:"已转发",//默认是“确定”
        confirmColor: '#187e6e',//确定文字的颜色
        success: function (res) {
           if (res.cancel) {
             
              
           } else {
              //点击确定
            
              that._shareOrder();
            }
        },
        fail: function (res) { 

        },//接口调用失败的回调函数
        complete: function (res) {

         },//接口调用结束的回调函数（调用成功、失败都会执行）
        
     })
   
    
    }
   

  },


  onLoad: function (options) {

    this.setData({
      windowWidth: globalData.windowWidth * globalData.rpxR,
      windowHeight: globalData.windowHeight * globalData.rpxR,
      // userId: options.userId,
      userId:1,
    })

    var now = new Date();
    var day = now.getDay();
    var weeks = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
    var week = weeks[day];
    var date = now.getDate();
    this.setData({
      week: week,
      date: date,
    })

    this._getGroupInfo();


  },

  _getGroupInfo() {
    groupInfo(this.data.userId).then(res => {
      if (res) {
        console.log(res)
        var subDeps = res.result.data.groupInfo.nxDepartmentEntities;
        var usersAmount = 0;
        subDeps.forEach(sub => {
          var users = sub.nxDepartmentUserEntities.length;
          console.log(users)
          usersAmount = usersAmount + users;
        });
        this.setData({
          userInfo: res.result.data.userInfo,
          groupInfo: res.result.data.groupInfo,
          ordersArr: res.result.data.orders,
          memberAmount: usersAmount,
          independentArr: res.result.data.independentOrders,
          showOperation: false,
          selAmount: 0,

        })
      }
      wx.setNavigationBarTitle({
        "title": res.result.data.groupInfo.nxDistributerEntity.nxDistributerName,
      })
      globalData.groupInfo = res.result.data;
      wx.setStorageSync('userInfo', res.result.data.userInfo)
    })
  },




  toOrderGroup() {
    wx.navigateTo({
      url: '../orderGroup/orderGroup?depId=' + this.data.groupInfo.nxDepartmentId,
    })
    this.setData({
      showOperation: false,

    })
  },

  toDepartmentGoods() {
    wx.navigateTo({
      url: '../resGoods/resGoods?depId=' + this.data.groupInfo.nxDepartmentId,
    })
    this.setData({
      showOperation: false,

    })
  },

  toOpenOrder() {

    wx.navigateTo({
      url: '../inviteAndOrder/inviteAndOrder',
    })
    this.setData({
      showOperation: false,

    })



  },

  changeShowWhich(e) {
    this.setData({
      showWhich: e.currentTarget.dataset.which,
      showOperation: false,

    })

    this._getGroupInfo()

  },



  selectIndepend(e) {
    console.log(e);
    var index = e.currentTarget.dataset.index;
    var indepen = this.data.independentArr[index];
    console.log(indepen)
    var ind = "independentArr[" + index + "].isSelected";
    var sel = indepen.isSelected;
    var amount = this.data.selAmount;
    this.setData({
      [ind]: !sel,
    })
    if (sel) {
      this.setData({
        selAmount: amount - 1
      })
    } else {
      this.setData({
        selAmount: amount + 1
      })
    }

    if (this.data.selAmount > 0) {
      this.setData({
        showOperation: true,
      })
    } else {
      this.setData({
        showOperation: false,
      })
    }



  },

  //  
  copyText: function (e) {
    console.log(e)
    this._copyIndOrderText();


  },

  _copyIndOrderText() {

    //1,get Arr
    var copyArr = this._getSelectedArr();

    //2, get copyText
    var temp = "";
    for (var i = 0; i < copyArr.length; i++) {
      if (copyArr[i].isSelected) {
        var name = copyArr[i].nxDepIndependentGoodsEntity.nxDigGoodsName;
        var quantity = copyArr[i].nxDioApplyQuantity;
        var standard = copyArr[i].nxDioApplyStandard;
        var str = name + "  " + quantity + standard + '\n';
        temp = temp + str;
      }
    }
    wx.setClipboardData({
      data: temp,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            // console.log("sucess")
            // wx.showToast({
            //   title: '复制成功'
            // })
          }
        })
      },
    })

    //3, change order status
    copyIndependentOrders(copyArr).then(res => {
      if (res) {
        // this.setData({
        //   showOperation: false,
        //   selAmount: 0,
        // })
        this._getGroupInfo();
      }
    })
  },

  finishIndependent() {
    //1,get Arr
    var finishArr = this._getSelectedArr();

    //2, change order status
    finishIndependentOrders(finishArr).then(res => {
      if (res) {
        // this.setData({
        //   showOperation: false
        // })
        this._getGroupInfo();
      }
    })
  },


toShare(){
  this.setData({
    isShareing: true,
  })
  var selArr = this._getSelectedArr();
  this.setData({
    selArr: selArr
  })


},  



  // 
  _getSelectedArr() {
    var arr = this.data.independentArr;
    var temp = "";
    var orderTemp = [];
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].isSelected) {
       

        orderTemp.push(arr[i]);
      }
    }

    return orderTemp;
  },


  onShareAppMessage: function (res) {
    return {
      title: '李沛谊订货',    
      path: '/pagesRes/friendShare/friendShare',     // 当前页面 path ，必须是以 / 开头的完整路径
      imageUrl: '../.././images/add.jpg',
       success: function (res) {
         console.log(res)
         this.setData({
           showOperation: false

         })

       },
    }
  },


  onShareAppMessage(res){
    console.log(res)
    let that = this;
    const obj = {
      title: "发送给好友",
      imageUrl: that.data.erweiCOde,
      path: '/pagesRes/friendShare/friendShare',
      success: function(res) {
        console.log(res, "转发成功")
      },
      fail: function(res) {
        wx.showToast({
          title: '发送失败',
          icon:'none'
        })
      }
    }
    return obj;
  },
  _shareOrder(){
    console.log("share")
    shareIndependentOrders(this.data.selArr).then(res => {
      if(res.result.code == 0) {
        this._getGroupInfo();
        
      }
    })
  }





})

import { updateCustomer } from '../../lib/apiCustomer.js'
const globalData = getApp().globalData;


Page({

  /**
   * 页面的初始数据
   */
  data: {
    

    

  },



  onLoad:function(){
    this.setData({
      userInfo: globalData.userInfo,
    })

   
  },





  // 绑定详细地址输入 
  bindAddressInput: function (e) {
    var value = e.detail.value;
    var address = "userInfo.nxCustomerAddress";
    this.setData({
      [address]: value,
    })
    this.ifCanLogin();
  },

  //输入名字
  bindNameInput: function (e) {
    var value = e.detail.value;
    var name = "userInfo.nxCustomerName";
    this.setData({
      [name]: value,
    })
    this.ifCanLogin();
  },
  // 选择性别
  selectCall: function (e) {
    var call = e.currentTarget.dataset.call;
    var cc = "userInfo.nxCustomerCall"
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
      var phone = "userInfo.nxCustomerPhone";
      this.setData({
        [phone]: value,
      })
      this.ifCanLogin();
    }
  },

  updateMember: function(){

    var userInfo = this.data.userInfo;

    updateCustomer(this.data.userInfo).
    then(res => {
      console.log(res)
      if(res.result){
        var userInfo = globalData.userInfo;
        var community = userInfo.nxCommunityEntity;
        var userEnityt = userInfo.nxCustomerUserEntity;
        var userInfo = res.result.data;
        userInfo.nxCommunityEntity= community;
        userInfo.nxCustomerUserEntity = userEnityt;
        globalData.userInfo = userInfo;
       wx.navigateBack({
         delta: 1
       })  
      }else {
        
      }
    })
  },


  ifCanLogin(){
    /**
     *   
      customerAddress: '',
      customerLat: '',
      customerLng: '',
      customerBuilding: '',
      customerName: '',
      customerCall: 0,
      customerPhone: '',
      customerType: 2,
     */
    var address = this.data.userInfo.customerAddress;
    var lat = this.data.userInfo.customerLat;
    var lng = this.data.userInfo.customerLng;
    var building = this.data.userInfo.customerBuilding;
    var name = this.data.userInfo.customerName;
    var call = this.data.userInfo.customerCall;
    var phone = this.data.userInfo.customerPhone;
    console.log("haiahai")
    if(address && building && name && phone){
      console.log("have phone&&&&&&&&&&&&333")
      this.setData({
        canLogin: true,
      })
    }

    

  },







})
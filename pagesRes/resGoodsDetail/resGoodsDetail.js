// pages/goodsDetail/goodsDetail.js

var load = require('../../lib/load.js');

let windowWidth = 0;
let itemWidth = 0;
const globalData = getApp().globalData;

import {
  depGetResGoodsDetail,
  depSaveStandard,
  depUpdateStandard
} from '../../lib/apiRestraunt'


Page({

  /**
   * 页面的初始数据
   */
  data: {
    showAdd: false,
    showEdit: false,


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      // disId: globalData.userInfo.nxDistributerEntity.nxDistributerId,
      windowWidth: globalData.windowWidth * globalData.rpxR,
      windowHeight: globalData.windowHeight * globalData.rpxR,
      disId: 1,
      depDisGoodsId: options.resGoodsId,
    })

    this._getGoodsDetail()

  },

  _getGoodsDetail(){
    depGetResGoodsDetail(this.data.depDisGoodsId).then(res => {
      if(res) {
        console.log(res);
        this.setData({
          goods: res.result.data[0],
        })
      }
    })
   

  },


  addStandard(e){
    this.setData({
      showAdd: true,
      nxGoodsName: e.currentTarget.dataset.name

    })
},

editStandard(e){
  this.setData({
    showEdit: true,
    nxGoodsName: e.currentTarget.dataset.name,
    item: e.currentTarget.dataset.item
  })

},

confirmAdd: function(e){
  console.log(e);
  console.log("+=======")

  var data = {
    nxDdsDdsGoodsId: this.data.goods.nxDepartmentDisGoodsEntity.nxDepartmentDisGoodsId,
    nxDdsStandardName: e.detail.standardName,
    
  }
  depSaveStandard(data).
    then(res => {
      if (res) {
        this._getGoodsDetail();
      }
    }) 
},

confirmEdit(e){
  var data = {
    nxDepartmentStandardId: this.data.item.nxDepartmentStandardId,
    nxDdsStandardName: e.detail.standardName,
  }

  depUpdateStandard(data).
    then(res => {
      if (res) {
        this._getGoodsDetail();
      }
    })






}




})
// pages/purchase/purchase.js
var load = require('../../lib/load.js');

let windowWidth = 0;
let itemWidth = 0;
const globalData = getApp().globalData;

import {depGetDepDisGoodsCata, 
  depGetIndependentGoods,
  searchDepDisGoodsAndIndependentGoods,
  saveOrder, 
  saveDepIndepOrder,
} from '../../lib/apiRestraunt';

// import {
//   depGetDepNxGoods,
//   depGetIndependentGoods,
//   saveOrder,
//   getDepGoodsInfo,
//   searchDepNxGoodsAndIndependentGoods
// } from '../../lib/apiRestraunt'


Page({
  data: {
    tab1Index: 0,
    itemIndex: 0,
    sliderOffset: 0,
    sliderOffsets: [],
    sliderLeft: 0,
    tabs: [
      {
        amount: 0,
        words: "配送"
      },{
        amount: 0,
        words: "自采购"
      } ],
    limit: 20,
    page: 1,
    isSearching: false
  },

  onLoad: function (options) {
    

    console.log(globalData)
    this.setData({
      depFatherId: globalData.groupInfo.groupInfo.nxDepartmentId,
      // depId: globalData.groupInfo.groupInfo.nxDepartmentId,
      depId: options.depId
    })

    this.clueOffset();


    this._getDepDisGoods();

  },

  
  onShow(){
    if(!this.data.isSearching){
      if(this.data.tab1Index == 0){
        this._getDepDisGoods();
      }
      if(this.data.tab1Index == 1){
        this._getDepIndependentGoods();
      }
    }

  },
  _getDepDisGoods(){
    depGetDepDisGoodsCata(this.data.depFatherId).then(res => {
      if(res) {
        console.log(res);
        this.setData({
          depGoodsArr: res.result.data,
        })
      }
    })
  },

  _getDepIndependentGoods(){
   var data = {
    limit: this.data.limit,
    page: this.data.page,
    depId: this.data.depFatherId,
   }
   depGetIndependentGoods(data).then(res =>{
     if(res){
       console.log(res);
       this.setData({
         independentArr: res.result.data,
       })
     }
   })

  },

  /**
   * 计算偏移量
   */
  clueOffset() {
    var that = this;

    wx.getSystemInfo({
      success: function (res) {
        itemWidth = Math.ceil(res.windowWidth / that.data.tabs.length);
        let tempArr = [];
        for (let i in that.data.tabs) {
          console.log(i)
          tempArr.push(itemWidth * i);
        }
        // tab 样式初始化
        windowWidth = res.windowWidth;
        that.setData({
          sliderOffsets: tempArr,
          sliderOffset: 0,
          sliderLeft: 0,
          windowWidth: globalData.windowWidth * globalData.rpxR,
          windowHeight: globalData.windowHeight * globalData.rpxR,
          disId: 1,
        });



      }
    });
  },

  /**
   * tabItme点击
   */
  onTab1Click(event) {
    let index = event.currentTarget.dataset.index;
    this.setData({
      sliderOffset: this.data.sliderOffsets[index],
      tab1Index: index,
      itemIndex: index,
    })
  },

  /**
   * swiper-item 的位置发生改变
   */
  swiperTran(event) {
    let dx = event.detail.dx;
    let index = event.currentTarget.dataset.index;
    if (dx > 0) { //----->
      if (index < this.data.tabs.length - 1) { //最后一页不能---->
        let ratio = dx / windowWidth; /*滑动比例*/
        let newOffset = ratio * itemWidth + this.data.sliderOffsets[index];
        // console.log(newOffset,",index:",index);
        this.setData({
          sliderOffset: newOffset,
        })
      }
    } else { //<-----------
      if (index > 0) { //最后一页不能<----
        let ratio = dx / windowWidth; /*滑动比例*/
        let newOffset = ratio * itemWidth + this.data.sliderOffsets[index];
        console.log(newOffset, ",index:", index);
        this.setData({
          sliderOffset: newOffset,
        })
      }
    }

  },

  /**
   * current 改变时会触发 change 事件
   */
  swiperChange(event) {
    // this.setData({
    //   sliderOffset: this.data.sliderOffsets[event.detail.current],
    //   tab1Index: event.detail.current,
    //   itemIndex: event.detail.current,
    // })
  },
  /**
   * 动画结束时会触发 animationfinish 事件
   */
  animationfinish(event) {
    this.setData({
      sliderOffset: this.data.sliderOffsets[event.detail.current],
      tab1Index: event.detail.current,
      itemIndex: event.detail.current,
    })
    if(!this.data.isSearching){
      if(this.data.tab1Index == 0){
        this._getDepDisGoods();
      }
      if(this.data.tab1Index == 1){
        this._getDepIndependentGoods();
      }
    }

  },



  // 


  //search-bar
  getGoodsName(e) {
    var value = e.detail.value;
    if(value.length > 0){
      this.setData({
        isSearching: true,
      })
      var data = {
        depId: this.data.depId,
        searchStr: value
      }
      searchDepDisGoodsAndIndependentGoods(data).then(res => {
        if (res) {
          console.log(res.result.data)
      
          var  depArr = res.result.data.depGoodsArr;
          var amountDep = 0;
          for(var i = 0; i < depArr.length;  i++){
            var tempArrLength = depArr[i].nxGoodsEntityList.length;
            amountDep = amountDep + tempArrLength;
          }
          var  indArr = res.result.data.independentArr;
          var amountInd = 0;
          for(var i = 0; i < indArr.length;  i++){
            var tempIndArrLength = indArr[i].list.length;
            amountInd = amountInd + tempIndArrLength;
          }

        
          this.setData({
            depGoodsArr: res.result.data.depGoodsArr,
            independentArr: res.result.data.independentArr,
            tabs: [{
              amount: amountDep ,
              words: "配送"
            },{
              amount: amountInd,
              words: "自采购"
            } ],
          })
        }
      })
    }else{
      this.setData({
        isSearching: false
      })
      this._getDepDisGoods();
      this._getDepIndependentGoods();
    }
   
  },



  applyGoods: function (e) {
    this.setData({
      show: true,
      item: e.currentTarget.dataset.item,
      applyStandardName: e.currentTarget.dataset.standard,
    })
  },

  changeStandard: function (e) {
    console.log(e.detail.applyStandardName)
    this.setData({
      applyStandardName: e.detail.applyStandardName
    })
  },

  // 保存订货订单

  confirm: function (e) {
    var dg = {
      nxDoOrderUserId: globalData.groupInfo.userInfo.nxDepartmentUserId,
      nxDoNxGoodsId: e.detail.applyGoodsId,
      nxDoNxGoodsFatherId: e.detail.nxGoodsFatherId,
      nxDoQuantity: e.detail.applyNumber,
      nxDoStandard: e.detail.applyStandardName,
      nxDoRemark: e.detail.applyRemark,
      nxDoDepartmentId: globalData.depInfo.nxDepartmentId,
      nxDoDistributerId: globalData.depInfo.nxDepartmentDisId,
      nxDoDepartmentFatherId: globalData.depInfo.nxDepartmentFatherId,
      nxDoDepartmentGoodsId: this.data.item.nxDepartmentGoodsId,
      nxDoDepartmentGoodsPrice: this.data.item.nxDepartmentGoodsPrice,
    };


    saveOrder(dg).then(res => {
      console.log(res);
      if (res.result.code == 0) {
        this.setData({
          searchStr: "",
          isSearching: false
          // input: true
        })
        if(this.data.tab1Index == 0){
          this._getDepDisGoods();
        }
        if(this.data.tab1Index == 1){
          this._getDepIndependentGoods();
        }
      }
    })
  },

 

  applyIndependent: function (e) {
    this.setData({
      showMyIndependent: true,
      item: e.currentTarget.dataset.item,
      applyStandardName: e.currentTarget.dataset.standard,
    })
  },

  
  confirmOrderIndenpendent(e){
    console.log(e) 
    console.log(globalData);
    var order = {
      nxDioApplyUserId: globalData.groupInfo.userInfo.nxDepartmentUserId,
      nxDioIndependentGoodsId: this.data.item.nxDepartmentIndependentGoodsId,
      nxDioApplyQuantity: e.detail.quantity,
      nxDioApplyStandard: this.data.item.nxDigGoodsStandardname,
      nxDioApplyRemark: e.detail.remark,
      nxDioDepartmentId: this.data.depId,
      nxDioDepartmentFatherId: globalData.groupInfo.groupInfo.nxDepartmentId,
      nxDioApplyStatus: 0,
    };


    saveDepIndepOrder(order).then(res => {
      console.log(res);
      if (res.result.code == 0) {
        this.setData({
          searchStr: "",
          isSearching: false
          // input: true
        })
        if(this.data.tab1Index == 0){
          this._getDepDisGoods();
        }
        if(this.data.tab1Index == 1){
          this._getDepIndependentGoods();
        }
      }
    })

  },


  showOrHide(e){
    var greatIndex = e.currentTarget.dataset.greatindex;
    var grandIndex = e.currentTarget.dataset.grandindex;
    for( var i = 0; i < this.data.depGoodsArr.length; i ++){
     
      for(var j = 0; j < this.data.depGoodsArr[i].nxGoodsEntityList.length; j++){
        var itemShow = "depGoodsArr["+ i+"].nxGoodsEntityList["+ j+"].isShow";
         if (i != greatIndex || j != grandIndex) {
          this.setData({
            [itemShow]: false
          })         
         }    
      }  
    }

 
    var show = this.data.depGoodsArr[greatIndex].nxGoodsEntityList[grandIndex].isShow;
    var itemShow = "depGoodsArr["+ greatIndex+"].nxGoodsEntityList["+ grandIndex+"].isShow";
    this.setData({
      [itemShow]: !show
    })

  },





})
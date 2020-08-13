// pages/purchase/purchase.js

var load = require('../../lib/load.js');

let windowWidth = 0;
let itemWidth = 0;
const globalData = getApp().globalData;

import {
  depGetDepDisGoodsCata,
  depGetIndependentGoods,
  saveDepIndependentGoods
} from '../../lib/apiRestraunt'


Page({
  data: {
    tab1Index: 0,
    itemIndex: 0,
    sliderOffset: 0,
    sliderOffsets: [],
    sliderLeft: 0,
    tabs: ["配送商品", "自采购商品"],
    limit: 20,
    page: 1,
  },

  onLoad: function (options) {
    console.log("tabl11111Indexxxxx")
    console.log(this.data.tab1Index)
    console.log(globalData)

    this.setData({
      depId: globalData.groupInfo.groupInfo.nxDepartmentId,
      // depId: 7,
    })

    this.clueOffset();


    this._getDepDisGoods();

  },

  onShow() {
    this._getDepDisGoods();

  },
  _getDepDisGoods() {
    depGetDepDisGoodsCata(this.data.depId).then(res => {
      if (res) {
        console.log(res);
        this.setData({
          depGoodsArr: res.result.data,
        })
      }
    })
  },

  _getDepIndependentGoods() {
    var data = {
      limit: this.data.limit,
      page: this.data.page,
      depId: this.data.depId,
    }
    depGetIndependentGoods(data).then(res => {
      if (res) {
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
    if (this.data.tab1Index == 0) {
      this._getDepDisGoods();
    }
    if (this.data.tab1Index == 1) {
      this._getDepIndependentGoods();

    }

  },

  toDistributerGoods(e) {
    wx.navigateTo({
      url: '../disGoodsCata/disGoodsCata',
    })

  },

  toShowIndependent() {

    this.setData({
      showIndependent: true,
    })

  },



  confirmAdd: function (e) {

    var data = {
      nxDigDepartmentId: this.data.depId,
      nxDigGoodsName: e.detail.goodsName,
      nxDigGoodsStandardname: e.detail.standardName
    }
    saveDepIndependentGoods(data).
    then(res => {
      if (res) {
        // console.log(res)
        // var standardlist = this.data.goodsList[index].nxGoodsStandardEntities;
        // console.log(this.data.goodsList[index]);
        // standardlist.push(res.result.data);
        // console.log(standardlist);
        // var up = "goodsList[" + index + "].nxGoodsStandardEntities"

        // this.setData({
        //   [up]: standardlist
        // })

      }
    })
  },

  showOrHide(e) {
    var greatIndex = e.currentTarget.dataset.greatindex;
    var grandIndex = e.currentTarget.dataset.grandindex;
    for (var i = 0; i < this.data.depGoodsArr.length; i++) {

      for (var j = 0; j < this.data.depGoodsArr[i].nxGoodsEntityList.length; j++) {
        var itemShow = "depGoodsArr[" + i + "].nxGoodsEntityList[" + j + "].isShow";
        console.log(i);
        console.log(greatIndex);
        console.log("<<<<<<<")
        console.log(j);
        console.log(grandIndex);
        console.log(">>>>>>>>>>>>");
        if (i != greatIndex || j != grandIndex) {
          this.setData({
            [itemShow]: false
          })
        }
      }
    }


    var show = this.data.depGoodsArr[greatIndex].nxGoodsEntityList[grandIndex].isShow;
    var itemShow = "depGoodsArr[" + greatIndex + "].nxGoodsEntityList[" + grandIndex + "].isShow";
    this.setData({
      [itemShow]: !show
    })

  },

  toGoodsList(e){
    wx.navigateTo({
      url: '../resGoodsList/resGoodsList?fatherId=' + e.currentTarget.dataset.id 
      +'&fatherName=' + e.currentTarget.dataset.name ,
    })

  },



})
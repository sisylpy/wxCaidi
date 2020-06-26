// miniprogram/pages/signe1/enterprisetype.js
const app = getApp()
const globalData = app.globalData;



Page({

  /**
   * 页面的初始数据
   */
  data: {
    second_height: 0,
    showNumber: false,
    selNumber: "",
    addFinished: false,
  
  },


  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
    this.setData({
     
      second_height: globalData.windowHeight - globalData.windowWidth / 750 * 120 - (globalData.windowWidth / 750) * 94,
      type: options.type,
      windowWidth: globalData.windowWidth * globalData.rpxR,
      windowHeight: globalData.windowHeight * globalData.rpxR,
      disId: options.disId
    })

  },

   
  showNumber(e){
    console.log(e)
    this.setData({
      showNumber: true
    })
  },

  selIndex(e){
    console.log(e)
    var num = Number(e.currentTarget.dataset.index) + 1;
    var deps = [];
    for(var i = 0; i < num; i++) {
         var dep = {
          nxDepartmentFatherId: this.data.depId,
           nxDepartmentName: null,
          };
          deps.push(dep);
    }
    
    this.setData({
      selNumber: num,
      showNumber: false,
      departments: deps
    })

  },
  getDepartmentName(e){
    var name = e.detail.value;
    var index = e.currentTarget.dataset.index;
    console.log(name);
    var dep = this.data.departments[index];
    var depNameData = "departments["+index+"].nxDepartmentName"
    console.log(depNameData)
    this.setData({
      [depNameData]: name,
    })
    
    this._ifCanSave();

  },
   _ifCanSave(){
     var num  = this.data.departments.length;
     for (var i = 0; i < num; i++) {
       var name =  this.data.departments[i].nxDepartmentName;
       if(name == null){
         this.setData({
          addFinished: false
         })
          return;
       }else{
         this.setData({
           addFinished: true,
         })
       }
     }
   },


   toGroupName() {
     wx.setStorageSync('deps', this.data.departments);
    
    wx.navigateTo({
      url: '../stepThree/stepThree?disId=' + this.data.disId + '&type=' + this.data.type,
    })
   },





  








  
})
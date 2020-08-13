// miniprogram/pages/order/ordersPage/paymentPage/paymentPage.js


var load = require('../../lib/load.js');

const globalData = getApp().globalData;
var app = getApp()

var tsc = require("../../utils/GPutils/encoding-indexes");
var esc = require("../../utils/GPutils/esc.js");
// var encode = require("../../../utils/GPutils/encoding.js");

var dateUtils = require('../../utils/dateUtil');

// import { getToFillDepOrders, saveBill } from '../../../lib/apiDepOrder.js'
import {getToFillDepOrders, printDepartmentOrders } from '../../lib/apiDepOrder'

// ArrayBuffer转16进度字符串示例
function ab2hex(buffer) {
  var hexArr = Array.prototype.map.call(
    new Uint8Array(buffer),
    function(bit) {
      return ('00' + bit.toString(16)).slice(-2)
    }
  )
  return hexArr.join('');
}


Page({

  /**
   * 页面的初始数据
   */
  data: {
    looptime: 0,
    currentTime: 1,
    lastData: 0,
    oneTimeData: 0,
    buffSize: [],
    buffIndex: 0, //发送字节数下标
    printNum: [],
    printNumIndex: 0,
    printerNum: 1,
    currentPrint: 1,
    isReceiptSend: false,
    isQuery: false,
    imageSrc: '../../imags/wechat.png',
    jpgSrc: '../../imags/flower2.jpg',
    canvasWidth: 100,
    canvasHeight: 100,
    jpgWidth: 200,
    jpgHeight: 200,
  },

  onShow: function(){
    var deviceId = app.BLEInformation.deviceId
    if (deviceId !== null) {
      this.setData({
        setSuccess: true
      })
    } else {
      this.setData({
        setSuccess: false
      })
    }
    var list = []
    var numList = []
    var j = 0
    for (var i = 20; i < 200; i += 10) {
      list[j] = i;
      j++
    }
    for (var i = 1; i < 10; i++) {
      numList[i - 1] = i
    }
    this.setData({
      buffSize: list,
      oneTimeData: list[0],
      printNum: numList,
      printerNum: numList[0]
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    

    // 
  var date =     dateUtils.formatDate(new Date());

    wx.setNavigationBarTitle({
      "title": "送货单",
    }),
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#2d5a5f',
        animation: {
          duration: 200,
          timingFunc: 'easeIn'
        }
      })


    this.setData({
      windowWidth: globalData.windowWidth * globalData.rpxR,
      windowHeight: globalData.windowHeight * globalData.rpxR,
      disId: 1,
      userId: 1,
     
      date: date,

      looptime: 0,
      currentTime: 1,
      lastData: 0,
      // oneTimeData: 0,
      returnResult: "",

      // buffSize: [],
      buffIndex: 0,
      // printNum: [],
      printNumIndex: 0,
      // printerNum: 1,
      currentPrint: 1,
      isReceiptSend: false,
      isLabelSend: false,
    })
 console.log(options);
 console.log("wo dingyi l options")
//  var depId = options.depId;
//  var fatherDepId = options.fatherDepId;
//  var depHasSubs = options.depHasSubs;
 this.setData({
  depId: options.depId,
  fatherDepId: options.fatherDepId,
  depHasSubs: options.depHasSubs,
  depId: 7,
  depHasSubs: 1
 })
    if(this.data.depHasSubs == 0){
      var data = {
        depId: this.data.depId,
        fatherDepId: "null",
        depHasSubs: 0
      }
    }
    
    if(this.data.depHasSubs == 1){
      var data = {
        depId: "null",
        fatherDepId: this.data.depId,
        depHasSubs: 1
      }
    }

    getToFillDepOrders(data)
      .then(res => {
        if (res) {
          console.log(res.result.data);
          var arr = res.result.data;
          var total = 0;
          var finished = 0;
         
          if (this.data.depHasSubs == 0) {
            for(var i = 0; i < arr.length; i++){
              var subtotal = Number(arr[i].nxDoSubtotal);
              if(subtotal > 0 && subtotal !== null){
                total = (total + subtotal);
                finished = finished + 1;
              }
            }
            this.setData({
              applyArr: res.result.data,
              total: total,
              finished: finished,
            })
          }
          if (this.data.depHasSubs == 1) {
            var totalAmount = 0;

            for(var i = 0; i < arr.length; i++){

              for(var j = 0; j < arr[i].depOrders.length; j++){
                totalAmount = totalAmount + 1;

                var subtotal = Number(arr[i].depOrders[j].nxDoSubtotal);
                if(subtotal > 0 && subtotal !== null){
                  total = (total + subtotal);
                  finished = finished + 1;
                }
              }
              }
             
            this.setData({
              depArr: res.result.data,
              total: total,
              finished: finished,
              totalAmount: totalAmount
            })
          }

        
        }
       
      })

  },


  getInputValue:function(e){
    console.log(e);
  
  
    if(e.detail.value > 0 ){
      if(e.currentTarget.dataset.type == 1){
        console.log(1)
        var index = e.currentTarget.dataset.index;
        var nxDoPrice = this.data.applyArr[index].nxDoPrice;
        var subtotal = Number(e.detail.value) * Number(nxDoPrice) ;
       
        var nxDoWeight = "applyArr[" + index + "].nxDoWeight";
        var nxDoSubtotal = "applyArr[" + index + "].nxDoSubtotal";
        this.setData({
          [nxDoWeight]: e.detail.value,
          [nxDoSubtotal]: subtotal.toFixed(1),
        })
        this._getTotal();
      }if(e.currentTarget.dataset.type == 2) {
        console.log(2)
        var index = e.currentTarget.dataset.index;
        // var nxDoPrice = this.data.applyArr[index].nxDoPrice;
        var nxDoWeight = this.data.applyArr[index].nxDoWeight;
        var subtotal = Number(e.detail.value) * Number(nxDoWeight) ;
       
        var nxDoPrice = "applyArr[" + index + "].nxDoPrice";
        var nxDoSubtotal = "applyArr[" + index + "].nxDoSubtotal";
        this.setData({
          [nxDoPrice]: e.detail.value,
          [nxDoSubtotal]: subtotal.toFixed(1),
        })
      }
       this._getTotal();
    }

  },
  _getTotal(){
    var arr = this.data.applyArr;
    var temp = 0;
    for(var i = 0; i < arr.length; i++){
      var subtotal = Number(arr[i].nxDoSubtotal);
      if(subtotal > 0){
           temp = temp + subtotal
      }
    }
    this.setData({
      total: temp
    })
  },

  _getSubmitOrder(){
    var arr = this.data.applyArr;
    var temp = [];
    for(var i = 0; i < arr.length; i++){
      var price = Number(arr[i].nxDoPrice);
      var weight = Number(arr[i].nxDoWeight);
      if(price > 0 && weight > 0){

        temp.push(arr[i]);
      }

    }
    return temp;

  },


  saveAndPrint:function(e){


    this.printPickData();

    // var arr = this._getSubmitOrder();

    // var bill = {
    //   nxDbDisId: this.data.disId,
    //   nxDbTotal: this.data.total,
    //   nxDepartmentOrdersEntities: arr,
    //   nxDbIssueUserId: this.data.userId,
    // }
    // saveBill(bill).then(res =>{
    //   if(res) {
    //     console.log(res)
    //   }
    // })
      
  },

  toSetPrint() {
    wx.navigateTo({
      url: '../pSearchPrinter/pSearchPrinter',
    })
  },


    // ///================================




    printBLEData: function (e) {
      var that = this
      // wx.stopBluetoothDevicesDiscovery({
      //   success: function (res) { console.log(res) },
      // })
      that.setData({
        serviceId: 0,
        writeCharacter: false,
        readCharacter: false,
        notifyCharacter: false
      })
      // console.log(e.currentTarget.dataset.title)
      wx.showLoading({
        title: '正在连接',

      })
      wx.createBLEConnection({
        deviceId: app.BLEInformation.deviceId,
        success: function (res) {
          console.log(res)
          // app.BLEInformation.deviceId = e.currentTarget.dataset.title

          that.getSeviceId()
        },
        fail: function (e) {
          wx.showModal({
            title: '提示',
            content: '连接失败',
            showCancel: false
          })
          console.log(e)
          wx.hideLoading()
        },
        complete: function (e) {
          console.log(e)
        }
      })
    },
    getSeviceId: function () {
      var that = this
      var platform = app.BLEInformation.platform
      console.log(app.BLEInformation.deviceId)
      wx.getBLEDeviceServices({
        deviceId: app.BLEInformation.deviceId,
        success: function (res) {
          that.setData({
            services: res.services
          })
          that.getCharacteristics()
        },
        fail: function (e) {
          console.log(e)
        },
        complete: function (e) {
          console.log(e)
        }
      })
    },
    getCharacteristics: function () {
      var that = this
      var list = that.data.services
      var num = that.data.serviceId
      var write = that.data.writeCharacter
      var read = that.data.readCharacter
      var notify = that.data.notifyCharacter
      wx.getBLEDeviceCharacteristics({
        deviceId: app.BLEInformation.deviceId,
        serviceId: list[num].uuid,
        success: function (res) {
          console.log(res)
          for (var i = 0; i < res.characteristics.length; ++i) {
            var properties = res.characteristics[i].properties
            var item = res.characteristics[i].uuid
            if (!notify) {
              if (properties.notify) {
                app.BLEInformation.notifyCharaterId = item
                app.BLEInformation.notifyServiceId = list[num].uuid
                notify = true
              }
            }
            if (!write) {
              if (properties.write) {
                app.BLEInformation.writeCharaterId = item
                app.BLEInformation.writeServiceId = list[num].uuid
                write = true
              }
            }
            if (!read) {
              if (properties.read) {
                app.BLEInformation.readCharaterId = item
                app.BLEInformation.readServiceId = list[num].uuid
                read = true
              }
            }
          }
          if (!write || !notify || !read) {
            num++
            that.setData({
              writeCharacter: write,
              readCharacter: read,
              notifyCharacter: notify,
              serviceId: num
            })
            if (num == list.length) {
              wx.showModal({
                title: '提示',
                content: '找不到该读写的特征值',
                showCancel: false
              })
            } else {
              that.getCharacteristics()
            }
          } else {
            wx.showToast({
              title: '连接成功',
            })

            that.receiptTest();
            // that.openControl()
          }
        },
        fail: function (e) {
          console.log(e)
        },
        complete: function (e) {
          console.log("write:" + app.BLEInformation.writeCharaterId)
          console.log("read:" + app.BLEInformation.readCharaterId)
          console.log("notify:" + app.BLEInformation.notifyCharaterId)
        }
      })
    },
    //  openControl: function () {//连接成功返回主页
    //   wx.navigateTo({
    //     url: '../home/home',
    //   })
    // },

    receiptTest: function () { //票据测试

      var that = this;

      var command = esc.jpPrinter.createNew();
      command.init()
      command.setSelectJustification(1)
      command.setCharacterSize(17);
      command.setText("拣货单");
      command.setPrint();
      // command.setCharacterSize(0);
      // command.setSelectJustification(0) //设置居左
      // var customer = that.data.customerArr[that.data.customerIndex];
      // var depName = customer.depName;
      // console.log(depName)

      // command.setText(depName);
      // command.setPrint();
      // command.setText("=================")
      // command.setPrint();
      // if (that.data.customerType == 0) {
      //   var ordersArr = customer.depOrders;
      //   for (var i = 0; i < ordersArr.length; i++) {
      //     var goodsName = ordersArr[i].nxGoodsEntity.nxGoodsName;
      //     var quantity = ordersArr[i].nxDoQuantity;
      //     var standard = ordersArr[i].nxDoStandard;
      //     command.setText(goodsName + "   " + quantity + " " + standard);
      //     command.setPrint();
      //   }
      //   that.setData({
      //     orderArr : customer.depOrders,
      //   })

      // }
      // if (that.data.customerType == 1) {
      //   var arr = customer.subDeps;
      //   var temp = [];
      //   for (var i = 0; i < arr.length; i++) {
      //     var subName = arr[i].nxDepartmentName;
      //     command.setText(subName);
      //     command.setPrint();

      //     var ordersArr = arr[i].nxDepartmentOrdersEntities;
      //     console.log(arr[i].nxDepartmentOrdersEntities)
      //     for (var j = 0; j < ordersArr.length; j++) {
      //       temp.push(ordersArr[j]);

      //       var goodsName = ordersArr[j].nxGoodsEntity.nxGoodsName;
      //       var quantity = ordersArr[j].nxDoQuantity;
      //       var standard = ordersArr[j].nxDoStandard;
      //       command.setText(goodsName + "   " + quantity + " " + standard);
      //       command.setPrint();
      //     }
      //     that.setData({
      //       orderArr: temp
      //     })
      //   }
       
      // }



      // command.setText(this.data.sendContent);
      command.setPrint() //打印并换行
      command.setSelectJustification(0) //设置居左
      command.setText(this.data.abc);
      command.setPrint();

      command.setPrint()
      command.setPrint()
      command.setPrint()
      command.setPrint()
      that.prepareSend(command.getData()) //准备发送数据

    },


    prepareSend: function (buff) { //准备发送，根据每次发送字节数来处理分包数量
      console.log(buff)
      console.log("wo kannkan  buff ????")

      var that = this
      var time = that.data.oneTimeData;
      console.log(that)
      console.log(that.data)

      var looptime = parseInt(buff.length / time);
      var lastData = parseInt(buff.length % time);
      //console.log(looptime + "---" + lastData)
      that.setData({
        looptime: looptime + 1,
        lastData: lastData,
        currentTime: 1,
      })
      that.Send(buff)
    },

    queryStatus: function () { //查询打印机状态
      var that = this
      var buf;
      var dateView;
      /*
      n = 1：传送打印机状态
      n = 2：传送脱机状态
      n = 3：传送错误状态
      n = 4：传送纸传感器状态
      */
      buf = new ArrayBuffer(3)
      dateView = new DataView(buf)
      dateView.setUint8(0, 16)
      dateView.setUint8(1, 4)
      dateView.setUint8(2, 2)
      wx.writeBLECharacteristicValue({
        deviceId: app.BLEInformation.deviceId,
        serviceId: app.BLEInformation.writeServiceId,
        characteristicId: app.BLEInformation.writeCharaterId,
        value: buf,
        success: function (res) {
          console.log("发送成功")
          that.setData({
            isQuery: true
          })
        },
        fail: function (e) {
          wx.showToast({
            title: '发送失败',
            icon: 'none',
          })
          console.log(e)
          return;
        },
        complete: function () {

        }
      })

      wx.notifyBLECharacteristicValueChange({
        deviceId: app.BLEInformation.deviceId,
        serviceId: app.BLEInformation.notifyServiceId,
        characteristicId: app.BLEInformation.notifyCharaterId,
        state: true,
        success: function (res) {
          wx.onBLECharacteristicValueChange(function (r) {
            console.log(`characteristic ${r.characteristicId} has changed, now is ${r}`)
            var result = ab2hex(r.value)
            console.log("返回" + result)
            var tip = ''
            if (result == 12) { //正常
              tip = "正常"
            } else if (result == 32) { //缺纸
              tip = "缺纸"
            } else if (result == 36) { //开盖、缺纸
              tip = "开盖、缺纸"
            } else if (result == 16) {
              tip = "开盖"
            } else if (result == 40) { //其他错误
              tip = "其他错误"
            } else { //未处理错误
              tip = "未知错误"
            }
            wx.showModal({
              title: '打印机状态',
              content: tip,
              showCancel: false
            })

          })
        },
        fail: function (e) {
          wx.showModal({
            title: '打印机状态',
            content: '获取失败',
            showCancel: false
          })
          console.log(e)
        },
        complete: function (e) {
          that.setData({
            isQuery: false
          })
          console.log("执行完成")
        }
      })
    },


    Send: function (buff) { //分包发送
      var that = this
      var currentTime = that.data.currentTime
      var loopTime = that.data.looptime
      var lastData = that.data.lastData
      var onTimeData = that.data.oneTimeData
      var printNum = that.data.printerNum
      var currentPrint = that.data.currentPrint
      var buf
      var dataView
      if (currentTime < loopTime) {
        buf = new ArrayBuffer(onTimeData)
        dataView = new DataView(buf)
        for (var i = 0; i < onTimeData; ++i) {
          dataView.setUint8(i, buff[(currentTime - 1) * onTimeData + i])
        }
      } else {
        buf = new ArrayBuffer(lastData)
        dataView = new DataView(buf)
        for (var i = 0; i < lastData; ++i) {
          dataView.setUint8(i, buff[(currentTime - 1) * onTimeData + i])
        }
      }
      console.log("第" + currentTime + "次发送数据大小为：" + buf.byteLength)
      wx.writeBLECharacteristicValue({
        deviceId: app.BLEInformation.deviceId,
        serviceId: app.BLEInformation.writeServiceId,
        characteristicId: app.BLEInformation.writeCharaterId,
        value: buf,
        success: function (res) {
          if (currentTime <= loopTime) {
            // wx.showLoading({
            //   title: '传输中...',
            // })
          } else {
            wx.showToast({
              title: '已打印第' + currentPrint + '张成功',
            })
          }
          console.log(res)

          that.setData({
            showOperation: false
          })

          that._savePrintOrders();
        },
        fail: function (e) {
          wx.showToast({
            title: '打印第' + currentPrint + '张失败',
            icon: 'none',
          })
          // console.log(e)
        },
        complete: function () {
          currentTime++
          if (currentTime <= loopTime) {
            that.setData({
              currentTime: currentTime
            })
            that.Send(buff)
          } else {
            if (currentPrint == printNum) {
              that.setData({
                looptime: 0,
                lastData: 0,
                currentTime: 1,
                isReceiptSend: false,
                currentPrint: 1
              })

            } else {
              currentPrint++
              that.setData({
                currentPrint: currentPrint,
                currentTime: 1,
              })
              that.Send(buff)
            }
          }
          // wx.navigateBack({
          //   complete: (res) => {
          //     delta: 2
          //   },
          // })

        }
        
      })

    },

    // ============================================


    _savePrintOrders(){
      
      console.log("save.......................")
         
          
            load.showLoading("保存订单中")
            var bill = {
              nxDbDisId: this.data.disId,
              nxDbDepId: this.data.depId,
              nxDbTotal: this.data.total,
              nxDbIssueUserId: 1,
              nxDepartmentOrdersEntities: this.data.applyArr,

            }

            printDepartmentOrders(bill)
            .then(res => {
              load.hideLoading();
              console.log(res)
              if(res.result.code == 0) {
                wx.showToast({
                  title: 'chenggong',
                })
                // this._getTodayCustomer();
                // wx.navigateBack({
                //   delta: 2
                // })
      
              }
            })
        },

  




})
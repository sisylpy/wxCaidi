import Promise from './bluebird'
import apiUrl from '../config.js'




//


//获取申请列表
export const restrauntGetGoodsByFatherId = (data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'nxgoods/restrauntGetGoodsByFatherId',
      method: 'POST',
      data: {
        "fatherId": data.fatherId,
        "limit": data.limit,
        "page": data.page,
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      },
      success: (res) => {
        resolve({ result: res.data })
      },
      fail: (e) => {
        reject(e)
      }
    })
  })
}

export const addNewStandard = (filePathList, nxStandardName, nxStandardScale, nxStandardError,
  nxSGoodsId) => {
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: apiUrl.apiUrl + 'nxstandard/save',
      filePath: filePathList[0],
      name: 'file',
      header: {
        "Content-Type": "multipart/form-data"
      },
      formData: {
        nxStandardName: nxStandardName,
        nxStandardScale: nxStandardScale,
        nxStandardError: nxStandardError,
        nxSGoodsId: nxSGoodsId,

      },
      success: function (res) {
        resolve({ result: res.data })
      },
      fail: function (e) {
        reject(e)
      },

    })
  })
}
//
export const getStandardList = (data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'nxstandard/list/' + data,
      method: 'GET',
      success: (res) => {
        resolve({ result: res.data })
      },
      fail: (e) => {
        reject(e)
      }
    })
  })
}

export const saveStandard = (data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'nxstandard/save',
      method: 'POST',
      data: data,
      success: (res) => {
        resolve({ result: res.data })
      },
      fail: (e) => {
        reject(e)
      }
    })
  })
}



export const downGoods = (data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'nxcommunitygoods/postDgGoods',
      method: 'POST',
      data: data,
      success: (res) => {
        resolve({ result: res.data })
      },
      fail: (e) => {
        reject(e)
      }
    })
  })
}

//
export const getSubNameByFatherId = (data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'nxgoods/getGoodsSubNamesByFatherId',
      method: 'POST',
      data: {
        "fatherId": data.fatherId,
        "limit": data.limit,
        "page": data.page
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      },
      success: (res) => {
        resolve({ result: res.data })
      },
      fail: (e) => {
        reject(e)
      }
    })
  })
}


//获取申请列表
export const getIbookGoodsByFatherId = (data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'nxgoods/getIbookGoodsByFatherId',
      method: 'POST',
      data: {
        "fatherId": data.fatherId,
        "limit": data.limit,
        "page": data.page,
        "disId": data.disId,
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      },
      success: (res) => {
        resolve({ result: res.data })
      },
      fail: (e) => {
        reject(e)
      }
    })
  })
}

//获取申请列表
export const initCataloguePage = (data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'nxgoods/getCatalogue',
      method: 'POST',
      data: {
        "limit": data.limit,
        "page": data.page
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      },
      success: (res) => {
        resolve({ result: res.data })
      },
      fail: (e) => {
        reject(e)
      }
    })
  })
}

//获取申请列表
export const getiBook = () => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'nxgoods/getiBookCover',
      method: 'GET',
      success: (res) => {
        resolve({ result: res.data })
      },
      fail: (e) => {
        reject(e)
      }
    })
  })
}

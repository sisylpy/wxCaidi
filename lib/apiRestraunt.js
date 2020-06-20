import Promise from './bluebird'
import apiUrl from '../config.js'


//


export const saveUser = (data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'nxdepartmentuser/save' ,
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



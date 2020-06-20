import Promise from './bluebird'
import apiUrl from '../config.js'



export const savePickerUser = (data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl.apiUrl + 'nxdistributeruser/save' ,
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

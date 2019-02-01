const App = getApp()
Page({
  data: {
    baseurl: App.globalData.globalUrl,
    buy_name: '',
    buy_phone: '',
    buy_address: '',
    options: {}
  },
  onLoad (options) {
    this.setData({
      options: options
    })
    // 获取本地缓存
    var self = this;
    wx.getStorage({
      key: 'buy_message',
      success(res) {
        try {
          const msg = JSON.parse(res.data);
          self.setData({
            buy_name: msg.buy_name,
            buy_phone: msg.buy_phone,
            buy_address: msg.buy_address
          })
        } catch(e) {

        }
      }
    })
  },
  setName (e) {
    this.setData({
      buy_name: e.detail.value
    })
  },
  setPhone (e) {
    this.setData({
      buy_phone: e.detail.value
    })
  },
  setAddress (e) {
    this.setData({
      buy_address: e.detail.value
    })
  },
  submit () {
    if (this.data.buy_name.replace(/(^\s*)|(\s*$)/g, "") == "") {
      wx.showModal({
        title: '提示',
        content: '收件人不能为空',
        showCancel: false
      })
      return; 
    }
    if(!(/^1[34578]\d{9}$/.test(this.data.buy_phone))){ 
      wx.showModal({
        title: '提示',
        content: '电话号码格式错误',
        showCancel: false
      })
      return; 
    }
    if (this.data.buy_address.replace(/(^\s*)|(\s*$)/g, "") == "") {
      wx.showModal({
        title: '提示',
        content: '收货地址不能为空',
        showCancel: false
      })
      return; 
    }
    // 保存在本地缓存
    wx.setStorage({
      key: 'buy_message',
      data: JSON.stringify({
        buy_name: this.data.buy_name,
        buy_phone: this.data.buy_phone,
        buy_address: this.data.buy_address
      })
    })
    // 将本页面的参数，传递给下一个页面(buy)
    let params = '?'
    for (let key in this.data.options) {
      params += '&' + key + '=' + this.data.options[key];
    }
    wx.navigateTo({
      url: '../buy/buy' + params
    })
  }
})

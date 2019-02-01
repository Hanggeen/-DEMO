const App = getApp()
Page({
  data: {
    tradeId: null,
    productId: null,
    justbuy: 0,
    baseurl: App.globalData.globalUrl,
    status: {
      going: '进行中',
      bingo: '已达到',
      timeout: '已结束',
      bought: '已购买',
      justbuy: '直接购买'
    },
    buy_name: '',
    buy_phone: '',
    buy_address: '',
    showProduct: {}
  },
  onLoad (options) {
    this.setData({
      tradeId: options.tradeId || 0,
      productId: options.productId || null,
      justbuy: options.justbuy || 0,
      userId: App.globalData.userId
    })
    // 如果是直接购买的，请求商品信息，否则，请求交易信息
    if (options.justbuy == 1) {
      this.getProductMsg(options.productId);
    } else {
      this.getTradeList(options.tradeId);
    }
    // 获取本地缓存，即上一个页面的地址信息
    const self = this;
    wx.getStorage({
      key: 'buy_message',
      success(res) {
        try {
          const msg = JSON.parse(res.data);
          console.log(msg)
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
  // 获取商品信息
  getProductMsg (productId) {
    wx.request({
      url: App.globalData.globalUrl + '/wxapp/product',
      method: 'GET',
      dataType: 'json',
      data: {
        id: productId
      },
      success: ret => {
        this.setData({
          showProduct: {
            picture: ret.data.data[0].picture,
            name:ret.data.data[0].name,
            status: 'justbuy',
            initial_price: ret.data.data[0].price,
            current_price: ret.data.data[0].price
          }
        })
      },
      fail: ret => {
        console.log(ret)
      }
    })
  },
  // 获取交易信息
  getTradeList (tradeId) {
    wx.request({
      url: App.globalData.globalUrl + '/wxapp/trade',
      method: 'GET',
      dataType: 'json',
      data: {
        id: Number(tradeId)
      },
      success: ret => {
        if (ret.data.status == 'ok') {
          this.setData({
            showProduct: {
              picture: ret.data.data[0].picture,
              name:ret.data.data[0].name,
              status: ret.data.data[0].status,
              initial_price: ret.data.data[0].initial_price,
              current_price: ret.data.data[0].current_price
            }
          })
        }
      },
      fail: ret => {
        console.log(ret)
      }
    })
  },
  // 购买商品
  buyProduct () {
    if (this.data.justbuy == 1) {
      wx.request({
        url: App.globalData.globalUrl + '/wxapp/trade',
        method: 'POST',
        dataType: 'json',
        data: {
          id: this.data.tradeId,
          user_id: Number(this.data.userId),
          product_id: Number(this.data.productId),
          status: 'bought',
          buy_name: this.data.buy_name,
          buy_phone: this.data.buy_phone,
          buy_address: this.data.buy_address,
          buy_time: new Date().valueOf(),
          justbuy: 1
        },
        success: ret => {
          if (ret.data.status == 'ok') {
            wx.showModal({
              title: '购买成功',
              content: '将在7个工作日发货',
              showCancel: false,
              success(res) {
                if (res.confirm) {
                  wx.navigateBack({
                    delta: 4
                  })
                }
              }
            })
          }
        },
        fail: ret => {
          console.log(ret)
        }
      })
    } else {
      wx.request({
        url: App.globalData.globalUrl + '/wxapp/trade',
        method: 'PUT',
        dataType: 'json',
        data: {
          id: this.data.tradeId,
          status: 'bought',
          buy_name: this.data.buy_name,
          buy_phone: this.data.buy_phone,
          buy_address: this.data.buy_address,
          buy_time: new Date().valueOf()
        },
        success: ret => {
          if (ret.data.status == 'ok') {
            wx.showModal({
              title: '购买成功',
              content: '将在7个工作日发货',
              showCancel: false,
              success(res) {
                if (res.confirm) {
                  wx.navigateBack({
                    delta: 4
                  })
                }
              }
            })
          }
        },
        fail: ret => {
          console.log(ret)
        }
      })
    }
  }
})

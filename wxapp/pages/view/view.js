const App = getApp()
Page({
  data: {
    productId: null,
    productMessage: {},
    btnText: '马上砍价',
    shareAble: false,
    baseurl: App.globalData.globalUrl,
    joinCount: 0,
    tradeId: null
  },
  onLoad (options) {
    this.setData({
      productId: options.id,
      userId: App.globalData.userId
    })
    this.getProductMessage(options.id)
    this.getProductWhetherOnBargain(this.data.productId, this.data.userId);
    this.getTradeList();
  },
  onShareAppMessage (res) {
    var that = this;
    console.log('转发信息：')
    console.log('userId=' + App.globalData.userId + '&tradeId=' + this.data.tradeId);
    return {
      title: '好友' + App.globalData.userInfo.nickName +'邀请你砍价！帮他砍一刀吧！',
      path: '/pages/share/share?userId=' + App.globalData.userId + '&tradeId=' + this.data.tradeId,
      withShareTicket: true
    }
  },
  // 获取商品信息
  getProductMessage (productId) {
    wx.request({
      url: App.globalData.globalUrl + '/wxapp/product',
      method: 'GET',
      dataType: 'json',
      data: {
        id: productId
      },
      success: ret => {
        let term = ret.data.data[0].term;
        ret.data.data[0].term = Math.floor(term/36)/100
        this.setData({
          productMessage: ret.data.data[0]
        })
      },
      fail: ret => {
        console.log(ret)
      }
    })
  },
  // 检查该商品在当前是否在砍价
  getProductWhetherOnBargain (productId, userId) {
    wx.request({
      url: App.globalData.globalUrl + '/wxapp/trade',
      method: 'GET',
      dataType: 'json',
      data: {
        user_id: userId,
        product_id: productId,
        status: 'going'
      },
      success: ret => {
        if (ret.data.data.length !== 0) {
          wx.showModal({
            title: '提示',
            content: '当前正在砍价',
            showCancel: false
          })
          this.setData({
            shareAble: true,
            tradeId: ret.data.data[0].id
          })
        }
      },
      fail: ret => {
        console.log(ret)
      }
    })
  },
  // 发起砍价
  goBargain () {
    wx.request({
      url: App.globalData.globalUrl + '/wxapp/trade',
      method: 'POST',
      dataType: 'json',
      data: {
        user_id: Number(this.data.userId),
        product_id: Number(this.data.productId)
      },
      success: ret => {
        if (ret.data.status == 'ok') {
          wx.showModal({
            title: '发起成功',
            content: '已帮自己砍了一刀，砍了' + ret.data.data.bargain + '元，转发给好友继续砍价！',
            showCancel: false
          })
          this.setData({
            shareAble: true,
            tradeId: ret.data.data.tradeId
          })
        } else {
          wx.showModal({
            title: '错误',
            content: ret.data.msg,
            showCancel: false
          })
        }
      },
      fail: ret => {
        console.log(ret)
      }
    })
  },
  // 获取该产品有多少人参与
  getTradeList () {
    var self = this;
    wx.request({
      url: App.globalData.globalUrl + '/wxapp/trade',
      method: 'GET',
      dataType: 'json',
      data: {
        product_id: Number(self.data.productId)
      },
      success: ret => {
        if (ret.data.status == 'ok') {
          this.setData({
            joinCount: ret.data.data.length
          })
        }
      },
      fail: ret => {
        console.log(ret)
      }
    })
  },
  // 去购买
  goBuy () {
    wx.navigateTo({
      url: '../address/address?justbuy=1&productId=' + this.data.productId
    })
  }
})

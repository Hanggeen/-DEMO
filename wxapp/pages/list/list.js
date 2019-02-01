const App = getApp()
Page({
  data: {
    list: [],
    status: {
      going: '进行中',
      bingo: '已达到',
      timeout: '已结束',
      bought: '已购买'
    },
    baseurl: App.globalData.globalUrl
  },
  onLoad () {
    this.getTrade()
  },
  goDetail (event) {
    if (event.currentTarget.dataset.id) {
      wx.navigateTo({
        url: '../detail/detail?id=' + event.currentTarget.dataset.id
      })
    }
  },
  getTrade () {
    wx.request({
      url: App.globalData.globalUrl + '/wxapp/trade',
      method: 'GET',
      dataType: 'json',
      data: {
        user_id: App.globalData.userId
      },
      success: ret => {
        if (ret.data.data.length !== 0) {
          this.setData({
            list: ret.data.data.reverse()
          })
        }
      },
      fail: ret => {
        console.log(ret)
      }
    })
  }
})

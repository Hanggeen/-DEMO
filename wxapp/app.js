//app.js
App({
  globalData: {
    userInfo: null,
    globalUrl: 'http://127.0.0.1:3000',
    statusMap: {
      going: '进行中',
      bingo: '已达到',
      timeout: '已结束',
      bought: '已购买'
    }
  }
})
const App = getApp()
Page({
  data: {
    tradeId: null,
    tradeMsg: {},
    bargainerList: [],
    dataReady: false,
    statusDetail: '',
    leftPercent: 495,
    clock: '',
    baseurl: App.globalData.globalUrl
  },
  onLoad (options) {
    wx.showLoading()
    this.setData({
      tradeId: options.id
    })
    this.getTrade()
    this.getBargainerList();
  },
  onShareAppMessage (res) {
    console.log('转发的地址信息：');
    console.log('userId=' + App.globalData.userId + '&tradeId=' + this.data.tradeId);
    return {
      title: '好友' + App.globalData.userInfo.nickName +'邀请你砍价！帮他砍一刀吧！',
      path: '/pages/share/share?userId=' + App.globalData.userId + '&tradeId=' + this.data.tradeId
    }
  },
  // 获取交易
  getTrade () {
    wx.request({
      url: App.globalData.globalUrl + '/wxapp/trade',
      method: 'GET',
      dataType: 'json',
      data: {
        id: this.data.tradeId
      },
      success: ret => {
        if (ret.data.data.length !== 0) {
          let obj = ret.data.data[0]
          this.setData({
            tradeMsg: obj,
            dataReady: true,
            statusDetail: App.globalData.statusMap[obj.status],
            leftPercent: (obj.current_price - obj.floor_price) / (obj.initial_price - obj.floor_price) * 530 - 35
          })
          // 如果是进行中，设置倒计时
          if (obj.status == 'going') {
            let interval = setInterval(() => {
              if (this.data.tradeMsg.deadline) {
                let ret = this.getDeadline(this.data.tradeMsg.deadline);
                if (ret == false) {
                  clearInterval(interval);
                  this.getTrade()
                } else {
                  this.setData({
                    clock:ret
                  })
                }
              }
            }, 1000)
          }
          wx.hideLoading();
        }
      },
      fail: ret => {
        console.log(ret)
      }
    })
  },
  // 获取砍价列表
  getBargainerList () {
    wx.request({
      url: App.globalData.globalUrl + '/wxapp/user',
      method: 'GET',
      dataType: 'json',
      data: {
        tradeid: this.data.tradeId
      },
      success: ret => {
        if (ret.data.data.length !== 0) {
          for (var i = 0; i < ret.data.data.length; i++) {
            ret.data.data[i].time = this.getDistance(ret.data.data[i].time)
          }
          ret.data.data[0].name = "自己"
          ret.data.data = ret.data.data.reverse()
          this.setData({
            bargainerList: ret.data.data
          })
        }
      },
      fail: ret => {
        console.log(ret)
      }
    })
  },
  // 传入时间戳，返回剩余时间，如果超过则返回false，用于倒计时
  getDeadline (deadline) {
    let now = new Date();
    let endtime = new Date(deadline * 1000);
    if (endtime - now < 0) {
      return false;
    }
    let diff = Math.floor((endtime - now)/1000);
    let day = Math.floor(diff/86400);
    diff = Math.floor(diff%86400);
    let hour = Math.floor(diff/3600);
    diff = Math.floor(diff%3600);
    let minute = Math.floor(diff/60);
    diff = Math.floor(diff%60);
    let second = diff;
    hour = hour > 9 ? hour : '0' + hour;
    minute = minute > 9 ? minute : '0' + minute;
    second = second > 9 ? second : '0' + second;
    return day + '天' + hour + ':' + minute + ':' + second 
  },
  // 获取多久前，用于砍价列表显示
  getDistance (d) {
    const now = new Date();
    const time = new Date(d);
    const diff = Math.floor((now - time)/1000)
    if (diff/60 < 1) {
      return diff + '秒'
    }
    if (diff/3600 < 1) {
      return Math.floor(diff/60) + '分钟'
    }
    if (diff/86400 < 1) {
      return Math.floor(diff/3600) + '小时'
    }
    return Math.floor(diff/86400) + '天'
  },
  buyProduct () {
    wx.navigateTo({
      url: '../address/address?tradeId=' + this.data.tradeId
    })
  }
})

const App = getApp()
Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    authorize: false,
    tradeId: null,
    tradeMsg: {},
    bargainerList: [],
    dataReady: false,
    statusDetail: '',
    leftPercent: 495,
    clock: '',
    sharerMsg: {},
    hadBargain: false,
    baseurl: App.globalData.globalUrl
  },
  onLoad (options) {

    // 微信定义的登录 调用接口获取登录凭证，通过凭证获取到唯一标识(openid)
    wx.login({
      success: res => {
        App.globalData.loginCode = res.code
        wx.request({
          url: App.globalData.globalUrl + '/wxapp/getOpenId',
          method: 'POST',
          dataType: 'json',
          data: {
            code: res.code
          },
          success: ret => {
            App.globalData.openid = ret.data.data;
            this.getUserId(); 
          },
          fail: ret => {
            console.log(ret)
          }
        })
      },
      fail: ret => {
        console.log(ret)
      }
    })


    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              App.globalData.userInfo = res.userInfo;
              this.getUserId();
            }
          })
        } else {
          // 用户没授权
        }
      },
      fail: res => {
        // 用户没授权
      }
    })

    this.setData({
      tradeId: options.tradeId,
      userId: options.userId
    })
    this.getTrade()
    wx.showLoading()
    this.getBargainerList();
    this.getSharerMessage();
  },
  bindGetUserInfo (res) {
    if (res.detail.errMsg == 'getUserInfo:ok') {
      wx.showLoading();
      // 获取用户信息
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            wx.getUserInfo({
              success: res => {
                App.globalData.userInfo = res.userInfo;
                this.getUserId();
              }
            })
          } else {
            // 用户没授权
          }
        },
        fail: res => {
          // 用户没授权
        }
      })
    }
  },
  // 获取后台的用户id，需要用户信息后才能获取，需要网络请求
  getUserId () {
    if (App.globalData.openid && App.globalData.userInfo) {    
      wx.request({
        url: App.globalData.globalUrl + '/wxapp/user',
        method: 'POST',
        dataType: 'json',
        data: {
          openid: App.globalData.openid,
          avatar: App.globalData.userInfo.avatarUrl,
          gender: App.globalData.userInfo.gender,
          nickname: App.globalData.userInfo.nickName
        },
        success: ret => {
          if (ret.data.status == 'ok') {
            this.setData({
              authorize: true
            })
            App.globalData.userId = ret.data.data.id;
            console.log('已部署所需信息')
            wx.hideLoading();
          }
        },
        fail: ret => {
          console.log(ret)
        }
      })
    }
  },
  // 帮砍价
  bargain () {  
    if (this.data.hadBargain) {
      wx.showModal({
        title: '提示',
        content: '你已砍过价了~',
        showCancel: false
      });
      return ;
    }
    if (this.data.tradeMsg.status == 'timeout') {
      wx.showModal({
        title: '提示',
        content: '砍价活动已结束~',
        showCancel: false
      });
      return;
    }
    if (this.data.tradeMsg.status == 'bought') {
      wx.showModal({
        title: '提示',
        content: '商品已被购买',
        showCancel: false
      });
      return;
    }
    if (this.data.tradeMsg.status == 'bingo') {
      wx.showModal({
        title: '提示',
        content: '商品已达到底价',
        showCancel: false
      });
      return;
    }
    wx.request({
      url: App.globalData.globalUrl + '/wxapp/record',
      method: 'POST',
      dataType: 'json',
      data: {
        bargainer_id: App.globalData.userId,
        trade_id: this.data.tradeId
      },
      success: ret => {
        if (ret.data.status == 'ok') {
          this.setData({
            showPopup: true,
            killPrice: ret.data.data.bargainPrice,
            hadBargain: true
          })

          wx.showModal({
            title: '砍价成功',
            content: '你已成功帮好友砍价' + ret.data.data.bargainPrice + '元',
            showCancel: false
          })
          // 重新获取此交易的信息，还有砍价人员
          this.getTrade();
          this.getBargainerList();
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
  // 获取分享者的个人信息
  getSharerMessage () {
    wx.request({
      url: App.globalData.globalUrl + '/wxapp/user',
      method: 'GET',
      dataType: 'json',
      data: {
        id: this.data.userId
      },
      success: ret => {
        if (ret.data.data.length !== 0) {
          this.setData({
            sharerMsg: ret.data.data[0]
          })
        }
      },
      fail: ret => {
        console.log(ret)
      }
    })
  },
  // 获取此交易信息
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
          if (obj.status == 'going') {
            var interval = setInterval(() => {
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
  // 获取当前交易的砍价者列表
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
  // 跳转到我的砍价列表
  goHome () {
    wx.navigateTo({
      url: '../index/index'
    })
  }
})

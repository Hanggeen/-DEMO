const App = getApp()

Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    productList: [],
    authorize: false,
    baseurl: App.globalData.globalUrl
  },
  // 页面代码加载完毕执行
  onLoad (res) {

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
    // 调用获取产品列表
    this.getProductList()
  },
  // 绑定获取用户信息
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
  // 通过请求获取产品列表
  getProductList () {
    wx.request({
      url: App.globalData.globalUrl + '/wxapp/product?able=1',
      method: 'GET',
      dataType: 'json',
      success: ret => {
        this.setData({
          productList: ret.data.data.reverse()
        })
      },
      fail: ret => {
        console.log(ret)
      }
    })
  },
  // 选中商品去砍价
  goBargin (event) {
    if (event.currentTarget.dataset.id) {
      wx.navigateTo({
        url: '../view/view?id=' + event.currentTarget.dataset.id
      })
    }
  },
  // 跳转到我的砍价列表
  goMyList () {
    wx.navigateTo({
      url: '../list/list'
    })
  }
})

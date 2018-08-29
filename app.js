//app.js
App({
    onLaunch: function() {
        // 展示本地存储能力
        var logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)

        // 登录
        wx.login({
            success: res => {
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
            }
        })
        // 获取用户信息
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                        success: res => {
                            // 可以将 res 发送给后台解码出 unionId
                            this.globalData.userInfo = res.userInfo

                            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                            // 所以此处加入 callback 以防止这种情况
                            if (this.userInfoReadyCallback) {
                                this.userInfoReadyCallback(res)
                            }
                        }
                    })
                }
            }
        })
    },
    globalData: {
        userInfo: null,
        mapKey: '37de9cc9ea07b85469c150ea1bcbee07',
        // domain: 'https://qcwx.glsx.com.cn/qurong/',   //测试环境
        // nodata: 'https://qcwx.glsx.com.cn/qurong/images/nodata.png',  //测试环境
        // ajaxurl: 'https://qcwx.glsx.com.cn/qurong/',     //测试环境
        
        domain: 'https://devwx.glsx.com.cn/qurong/',      //开发环境
        ajaxurl: 'https://devwx.glsx.com.cn/qurong/',     //开发环境
        nodata: 'https://devwx.glsx.com.cn/qurong/images/nodata.png'  //开发环境

        // domain: 'https://wx.glsx.com.cn/qurong/',   //生产环境
        // nodata: 'https://wx.glsx.com.cn/qurong/images/nodata.png',  //生产环境
        // ajaxurl: 'https://wx.glsx.com.cn/qurong/',     //生产环境
    }
})
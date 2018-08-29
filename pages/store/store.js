//add.js
/**
 * 新增区域经理
 */
//获取应用实例
const app = getApp()
const domain = app.globalData.domain;
const Util = require('../../utils/util.js');
Page({
    data: {
        idCardFont: domain + 'images/id_front.png',
        idCardBack: domain + 'images/id_back.png',
        storeFront: domain + 'images/store_front.png',
        storeBack: domain + 'images/store_back.png'
    },
    onLoad: function(options) {
        var that = this;
        var id = options.id;
        console.log(options);
        options.Interfaces = app.globalData.Interfaces;
        //设置页面标题
        wx.setNavigationBarTitle({
            title: '门店管理'
        });
        that.setData(options);
        that.getStoreInfo();
        Util.getEchartInfo({
            that: that,
            id:id
        });
    },
    onPullDownRefresh: function() {
        // 显示顶部刷新图标
        wx.showNavigationBarLoading();
        var that = this;
        // setTimeout(function() {
        //     wx.stopPullDownRefresh();
        //     wx.hideNavigationBarLoading()
        // }, 2000);
        Util.getEchartInfo({
            that: that,
            id: that.data.id,
            callBack: function() {
                that.getStoreInfo();
                wx.stopPullDownRefresh();
                wx.hideNavigationBarLoading()
            }
        });
    },
    getStoreInfo: function(callBack) {
        //获取门店信息
        var that = this;
        var id = that.data.id;
        if (!id) {
            Util.Info({
                message: '缺少参数'
            });
            return false;
        };
        Util.ajax({
            url: that.data.Interfaces.GETSTOREINFO,
            data: {
                'id': id
            },
            success: function(res) {
                console.log(res);
                if (callBack) {
                    callBack();
                };
                if (res.code == 200) {
                    var user = res.data.user;
                    var userStore = res.data.userDetail;
                    var list = Object.assign(user, userStore);
                    that.setData({
                        storeInfo: list
                    });
                } else {
                    Util.Info({
                        message: res.message
                    });
                    return false;
                }
            }
        })
    }
});
//index.js
//获取应用实例
const app = getApp()
const domain = app.globalData.domain;
const url = app.globalData.ajaxurl;
const Util = require('../../utils/util.js');
Page({
    data: {
        Interfaces: app.globalData.Interfaces,
        lockIcon: domain + 'images/lock.png',
        banner: domain + 'images/banner.png',
        icon01: domain + 'images/icon_01.png',
        icon02: domain + 'images/icon_02.png',
        icon03: domain + 'images/icon_03.png',
        icon04: domain + 'images/icon_04.png',
        icon05: domain + 'images/icon_05.png',
        icon06: domain + 'images/icon_06.png',
        currentPage:0,
        nPerPageSize:10
    },
    onPullDownRefresh: function () {
        // 显示顶部刷新图标
        wx.showNavigationBarLoading();
        var that = this;
        //获取报表信息
        Util.getEchartInfo({
            that:that,
            callBack:function(){
                wx.stopPullDownRefresh();
                wx.hideNavigationBarLoading();
            }
        });
    },
    onLoad: function(options) {
        var user = wx.getStorageSync('user');
        var that = this;
        //设置账号类型
        that.setData({
            userType: user.userType,
            Interfaces: app.globalData.Interfaces
        })
        //设置标题
        wx.setNavigationBarTitle({
            title: '趣融商户',
        });

        //获取报表信息
        Util.getEchartInfo({
            that: that
        });
        
    },
    wxQuit:function(){
        //退出登录
        wx.reLaunch({
            url: '../login/login',
        })
    }
})
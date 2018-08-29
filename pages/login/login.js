//index.js
//获取应用实例
const app = getApp()
const domain = app.globalData.domain;
const url = app.globalData.ajaxurl;
const Interfaces = require('../../utils/interfaces.js');
const Util = require('../../utils/util.js');
Page({
    data: {
        logoImg: domain + 'images/logo.png',
        userIcon: domain + 'images/user.png',
        lockIcon: domain + 'images/lock.png',
        //userPassword: '123456',
        //userName: 'admin', //admin
        //userName: '18207445656', //区域经理账号
        //userName:'18207441523',   //店面账号
        //userName: '18207448565',   //业务员账号
        isshow:true
    },
    setUser: function(e) {
        this.data.userName = e.detail.value;
    },
    setPassword: function(e) {
        this.data.userPassword = e.detail.value;
    },
    onLoad:function(){
        
    },
    login: function(e) {
        var userName = this.data.userName;
        var password = this.data.userPassword;
        var pagram = {};
        if (!userName) {
            Util.Info({
                message:'用户名不能为空!'
            });
            return false;
        };

        if (!password) {
            Util.Info({
                message: '密码不能为空!'
            });
            return false;
        };

        pagram.userName = userName;
        pagram.userPwd = password;
        
        wx.showLoading({ title: '加载中...' });
        wx.request({
            url: Interfaces.LOGIN,
            data: pagram,
            success: function(res) {
                wx.hideLoading();
                var o = res.data;
                if(o.code == 200){
                    wx.setStorageSync('user', o.data);
                    //登录成功，把cookie存起来
                    app.globalData.cookie = { 'Cookie': 'JSESSIONID=' + o.data.sessionId };
                    app.globalData.Interfaces = Interfaces;
                    wx.setStorageSync('Interfaces', Interfaces);
                    wx.navigateTo({
                        url: '../index/index'
                    });
                }else{
                    wx.hideLoading();
                    Util.Info({
                        message: o.message || Util.ERRTIPMSG
                    })
                }
            }
        });

    }
})
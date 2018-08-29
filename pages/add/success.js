//add.js
/**
 * 新增区域经理
*/
//获取应用实例
const app = getApp();
const domain = app.globalData.domain;
var misSecond = '';
Page({
    data: {
        buttonText:'关闭',
        second:5
    },
    
    onLoad: function() {
        var that = this;
        wx.setNavigationBarTitle({
            title: '提交成功'
        })
        var a = that.data.second;
        misSecond = setInterval(function(){
            if (a>0){
                a--;
                that.setData({
                    second: a
                })
            }else{
                clearInterval(misSecond);
                that.closePage();
            }
        },1000);
    },

    closePage:function(){
        wx.redirectTo({
            url: '../index/index',
        })
        if (misSecond){
            clearInterval(misSecond);
        }
    }

});
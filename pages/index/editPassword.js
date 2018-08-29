/**
 * 修改密码
 */
const app = getApp()
const domain = app.globalData.domain;
const Util = require('../../utils/util.js');
Page({
    data: {
        buttonText:'确认'
    },
    onLoad: function() {
        //设置标题
        wx.setNavigationBarTitle({
            title: '修改密码',
        });

        this.setData({
            Interfaces: app.globalData.Interfaces
        })
    },
    setInputInfo:function(e){
        //输入input绑定事件
        var id = e.currentTarget.id;
        var that = this;
        if (id) {
            (that.data)[id] = e.detail.value;
        };
    },
    editPassword:function(){
        //修改密码方法
        var that = this;
        if (!that.data.userPwd){
            Util.Info({
                message:'请输入原始密码'
            });
            return false;
        };

        if (!that.data.newPassword) {
            Util.Info({
                message: '请输入新密码'
            });
            return false;
        };

        if ((that.data.newPassword).length<6) {
            Util.Info({
                message: '请输入6位以上新密码'
            });
            return false;
        };

        if (!that.data.reNewPassword) {
            Util.Info({
                message: '请填写确认新密码'
            });
            return false;
        };

        if (that.data.newPassword != that.data.reNewPassword) {
            Util.Info({
                message: '两次新密码不一致'
            });
            return false;
        };

        var pragam = {};
        pragam.newPassword = that.data.newPassword;
        pragam.userPwd = that.data.userPwd;

        Util.ajax({
            url: that.data.Interfaces.EDITPASSWORD,
            data: pragam,
            success:function(res){
                if (res.code == 200) {
                    Util.Info({
                        message: '修改成功',
                        success: function () {
                            wx.redirectTo({
                                url: '../index/index',
                            });
                        }
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
})
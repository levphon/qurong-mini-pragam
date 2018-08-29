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
        defaultPic: domain + '/images/userPic.png',
        userName: '',
        userStatus: '',
        userPhone: '',
        userIdCard: '',
        acountType: {
            0: '正常',
            3: '待审批',
            2: '已拒单',
            4: '审批不通过'
        }
    },
    onLoad: function(options) {
        var that = this;
        var pageType = options.pageType;
        var pageTitle = '区域经理管理';
        var Interfaces = app.globalData.Interfaces;
        if (pageType && pageType == 102) {
            pageTitle = '业务员管理';
        };
        wx.setNavigationBarTitle({
            title: pageTitle
        });
        options['Interfaces'] = Interfaces;
        that.setData(options);
        that.getUserInfo();
        Util.getEchartInfo({
            that: that,
            id: options.id
        });

    },
    onPullDownRefresh: function() {
        // 显示顶部刷新图标
        wx.showNavigationBarLoading();
        var that = this;
        that.getUserInfo(function() {
            Util.getEchartInfo({
                that: that,
                id: that.data.id,
                callBack: function() {
                    wx.stopPullDownRefresh();
                    wx.hideNavigationBarLoading();
                }
            })
        });
    },
    getUserInfo: function(callBack) {
        var that = this;
        var id = that.data.id;
        if (!id) {
            Util.Info({
                message: '缺少参数!'
            });
            return false;
        }
        Util.ajax({
            url: that.data.Interfaces.GETUSERDETAIL,
            data: {
                id: id
            },
            success: function(res) {
                if (callBack) {
                    callBack();
                };
                if (res.code == 200) {
                    var o = res.data;
                    if (o) {
                        var user = o.user;
                        var detail = o.userDetail;

                        that.setData({
                            userName: user.name,
                            userStatus: user.userStatus,
                            userPhone: user.userPhone,
                            userIdCard: detail.certCode,
                            userPic: detail.photo
                        });
                    }
                } else {
                    Util.Info({
                        message: res.message
                    });
                }
            }
        })
    }
});
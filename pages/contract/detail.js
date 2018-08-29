/**
 * 合同管理-合同详情 
 */
const app = getApp()
const domain = app.globalData.domain;
const Util = require('../../utils/util.js');
Page({
    data: {
        SERVICETYPE: Util.SERVICETYPE,
        LOANCOMPANYSWITCH: Util.LOANCOMPANYSWITCH,
        APPROVALTYPE: Util.APPROVALTYPE,
        PBOCSTATUS: Util.PBOCSTATUS
    },
    onLoad: function(options) {
        var that = this;
        options.Interfaces = app.globalData.Interfaces;
        that.setData(options);
        wx.setNavigationBarTitle({
            title: '合同管理'
        });

        this.getContractInfo();

    },
    onPullDownRefresh: function() {
        // 显示顶部刷新图标
        wx.showNavigationBarLoading();
        var that = this;
        that.getContractInfo(function() {
            wx.stopPullDownRefresh();
            wx.hideNavigationBarLoading();
        });
    },
    getContractInfo: function(callBack) {
        //获取合同详情
        var that = this;
        var id = that.data.tigerContractId;
        if (!id) {
            Util.Info({
                message: '缺少参数'
            });
            return false;
        }
        Util.ajax({
            url: that.data.Interfaces.GETCONTRACTINFO,
            data: {
                'tigerContractId': id
            },
            success: function(res) {
                console.log(res);
                //contractInfo
                if (callBack) {
                    callBack();
                };
                if (res.code == 200) {
                    var itemList = res.data;
                    that.setData({
                        'contractInfo': itemList
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
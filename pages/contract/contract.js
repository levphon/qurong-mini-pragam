//index.js
/**
 * 合同管理 
 */
const app = getApp()
const domain = app.globalData.domain;
const sliderWidth = 94;
const Util = require('../../utils/util.js');
Page({
    data: {
        inputShowed: false,
        inputVal: "",
        tabs: [{
                id: '1',
                name: '全部'
            },
            {
                id: '2',
                name: '已放款'
            },
            {
                id: '3',
                name: '审核中'
            },
            {
                id: '4',
                name: '已拒单'
            }
        ],
        activeIndex: 0,
        sliderOffset: 0,
        sliderLeft: 0,
        sliderLineWidth: 0,
        status: 1,
        currentPage: 0,
        nPerPageSize: 10,
        hasNext: true,
        PRODUCTTYPE: Util.SERVICETYPE,
        list: [],
        serchList: [],
        isAjax: ''

    },
    showInput: function() {
        this.setData({
            inputShowed: true
        });
    },
    hideInput: function() {
        this.setData({
            inputVal: "",
            inputShowed: false,
            serchList: []
        });
        this.getContractList();
    },
    clearInput: function() {
        this.setData({
            inputVal: "",
            serchList: []
        });
        this.getContractList();
    },
    inputTyping: function(e) {
        //搜索
        var txt = e.detail.value;
        this.setData({
            inputVal: txt
        });
        this.getContractList('', txt);
    },
    onLoad: function() {
        var that = this;

        wx.setNavigationBarTitle({
            title: '合同管理'
        })
        wx.getSystemInfo({
            success: function(res) {
                that.setData({
                    sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
                    sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex,
                    sliderLineWidth: parseFloat(res.windowWidth / that.data.tabs.length)
                });
            }
        });

        that.setData({
            Interfaces: app.globalData.Interfaces
        })

        //获取合同信息
        that.getContractList();

    },
    tabClick: function(e) {
        this.getContractList(e.currentTarget.id);
        this.setData({
            sliderOffset: e.currentTarget.offsetLeft,
            activeIndex: e.currentTarget.id

        });
    },
    onReachBottom: function() {
        //上拉加载
        wx.showNavigationBarLoading();
        this.getContractList(this.data.activeIndex,'',true,function() {
            wx.hideNavigationBarLoading();
        });
    },
    lookDetai: function(e) {
        //查看更多
        console.log(e);
        var id = e.currentTarget.dataset.tigerContractId;
        if (!id) {
            return false;
        };
        wx.navigateTo({
            url: '../contract/detail?tigerContractId=' + id,
        })
    },
    getContractList: function(status,sTxt,bottomLoad,callBack) {
        //获取合同列表
        var that = this;
        var txt = that.data.inputVal;
        var oList = that.data.list;
        var ajaxing = that.data.isAjax;
        var pageType = that.data.activeIndex;

        if (status){
            pageType = status;
        };
        
        if (sTxt){
            txt = sTxt;
            that.setData({
                currentPage: 0,
            })
        };
        
        if (!bottomLoad){
            if (status != that.data.activeIndex) {
                that.setData({
                    currentPage: 0,
                    list:[]
                });
            };
        };
        

        //var hasNext = that.data.hasNext;
        var op = {
            pageIndex: that.data.currentPage + 1,
            pageSize: that.data.nPerPageSize,
            tigerSerialNum: txt,
            queryType: pageType
        };
       
        if (ajaxing) {
            ajaxing.abort();
        };
        var requestTask = Util.ajax({
            url: that.data.Interfaces.GETCONTRACTLIST,
            data: op,
            success: function(res) {
                if (callBack) {
                    callBack();
                };
                that.setData({
                    isAjax: ''
                });
                if (res.code == 200) {
                    var list = that.data.list;
                    var sList = that.data.serchList;
                    var itemList = res.data.items;
                    var newList = '';
                    var page = res.data.page;

                    if (bottomLoad) {
                        if (!itemList || itemList.length <= 0) {
                            Util.Info({
                                message: '没有数据了'
                            });
                            return false;
                        };

                        if (txt) {
                            newList = sList.concat(itemList);
                        } else {
                            newList = list.concat(itemList);
                        };

                    }else{
                        newList = itemList;
                    };
                    
                    that.setData({
                        'list': newList,
                        'currentPage': page.pageIndex,
                        'totalCount': page.totalCount,
                        'hasNext': page.hasNext
                    });
                } else {
                    Util.Info({
                        message: res.message
                    });
                    return false;
                }
            },
            fail: function(res) {
                that.setData({
                    isAjax: ''
                });
            }
        });

        that.setData({
            isAjax: requestTask
        });

    }
});
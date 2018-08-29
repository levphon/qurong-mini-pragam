//index.js
//获取应用实例
const app = getApp()
const domain = app.globalData.domain;
const sliderWidth = 94;
const Util = require('../../utils/util.js');
Page({
    data: {
        inputShowed: false,
        inputVal: "",
        tabs: [{
                id: 1,
                name: '全部'
            },
            {
                id: 2,
                name: '正常'
            },
            {
                id: 3,
                name: '待审核'
            },
            {
                id: 4,
                name: '审核不通过'
            }
        ],
        activeIndex: 0,
        sliderOffset: 0,
        sliderLeft: 0,
        sliderLineWidth: 0,
        iphoneIcon: domain + 'images/iphone.png',
        status: 3,
        currentPage: 0,
        nPerPageSize: 10,
        list: [],
        serchList:[],
        buttonText: '新增区域经理',
        hasNext: true
    },
    showInput: function() {
        this.setData({
            inputShowed: true
        });
    },
    hideInput: function() {
        //取消搜索
        this.setData({
            inputVal: "",
            inputShowed: false,
            serchList: []
        });
        this.getList();
    },
    clearInput: function() {
        //清除搜索输入
        this.setData({
            inputVal: "",
            serchList: []
        });
        this.getList();
    },
    inputTyping: function(e) {
        this.setData({
            inputVal: e.detail.value
        });
        this.getList('', e.detail.value);
    },
    onLoad: function(options) {
        var that = this;
        var uType = options.userType;
        var pageTitle = '区域经理管理';
        var buttonText = '新增区域经理';
        if (uType) {
            switch (uType) {
                case '101':
                    //门店管理
                    pageTitle = '门店管理';
                    buttonText = '新增门店';
                    break;
                case '102':
                    //业务员管理
                    pageTitle = '业务员管理';
                    buttonText = '新增业务员';
                    break;
                default:
                    //区域经理
                    pageTitle = '区域经理管理';
                    buttonText = '新增区域经理';
                    break;
            };
            that.setData({
                'buttonText': buttonText,
                'pageType': uType
            });
        }
        wx.setNavigationBarTitle({
            title: pageTitle
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
        });

        //获取用户列表
        that.getList();

    },
    tabClick: function(e) {
        this.getList(e.currentTarget.id);
        this.setData({
            sliderOffset: e.currentTarget.offsetLeft,
            activeIndex: e.currentTarget.id
        });
    },
    onReachBottom: function() {
        wx.showNavigationBarLoading();
        this.getList(this.data.activeIndex, '', true,function() {
            wx.hideNavigationBarLoading();
        });
    },
    addAcount: function() {
        //新增区域经理
        var pageType = this.data.pageType;
        var pageUrl = '../add/add';
        if (pageType && pageType == 101){
            //如果是店面，则跳转到不同的页面
            pageUrl = '../store/addStore'
        }
        wx.navigateTo({
            url: pageUrl + '?pageType=' + pageType
        });

    },
    lookDetai: function(e) {
        var id = e.currentTarget.id;
        var status = e.currentTarget.dataset.status;
        var pageUrl = '../detail/detail';
        var that = this;
        var pageType = that.data.pageType;
        if (status == 4) {
            pageUrl = '../add/add';
        };

        //店面管理查看详情
        if (pageType && pageType == 101){
            pageUrl = '../store/store';
            if (status == 4){
                pageUrl = '../store/addStore';
            }
        };

        //待审核的账号不能点击查看
        if (status != 3) {
            wx.navigateTo({
                url: pageUrl + '?id=' + id + '&pageType=' + pageType
            });
        }


    },
    getList: function (status, sTxt,bottomLoad,callBack) {
        var that = this;
        var cPage = that.data.currentPage;
        var txt = that.data.inputVal;
        var ajaxing = that.data.isAjax;
        var arr = { '0': '', '1': '0', '2': '3', '3': '4' };
        var pageType = arr[that.data.activeIndex];
        
        if (status) {
            pageType = arr[status];
        };
        if (sTxt) {
            txt = sTxt;
            that.setData({
                currentPage: 0,
            })
        };

        console.log(arr[status] + '--' + arr[that.data.activeIndex]);
        if (!bottomLoad) {
            if (arr[status] != arr[that.data.activeIndex]) {
                that.setData({
                    currentPage: 0,
                    list: []
                });
            };
        };

        var op = {
            pageIndex: that.data.currentPage + 1,
            pageSize: that.data.nPerPageSize,
            queryContent: txt,
            userStatus: pageType
        };
        if (ajaxing) {
            ajaxing.abort();
        };
        var requestTask = Util.ajax({
            url: that.data.Interfaces.GETUSERLIST,
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
                    var page = res.data.page;
                    var newList = '';

                    if (bottomLoad){
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
            fail:function(){
                that.setData({
                    isAjax: ''
                });
            }
        })
    }
});
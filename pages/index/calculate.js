//index.js
//获取应用实例
const app = getApp()
const domain = app.globalData.domain;
const Util = require('../../utils/util.js');
Page({
    data: {
        productList: [
        ],
        buttonText: '下一步',
        location:domain + 'images/location.png'
    },
    onPullDownRefresh: function() {
        // 显示顶部刷新图标
        wx.showNavigationBarLoading();
        var that = this;
        setTimeout(function() {
            wx.stopPullDownRefresh();
            wx.hideNavigationBarLoading()
        }, 2000);
    },
    onLoad: function() {
        var that = this;
        //设置标题
        wx.setNavigationBarTitle({
            title: '趣融商户',
        });
        that.setData({
            Interfaces:app.globalData.Interfaces
        });
        that.getOrgAndProduct();
        that.getWxSetting();
        that.getUserStoreInfo();
    },
    getAddress: function(pagram) {
        var that = this;
        //根据经纬度解析地址
        Util.ajax({
            url: 'https://restapi.amap.com/v3/geocode/regeo',
            data: pagram,
            success: function (res) {
                console.log(res);
                if (res.status == 1) {
                    var o = res.regeocode;
                    if (o) {
                        that.setData({
                            address: o.formatted_address
                        })
                    }
                } else {
                    Util.Info({
                        message: res.info
                    });
                    return false;
                }
            }
        })
    },
    bindChangeEvent: function(e) {
        //公用切换下拉框方法
        var _name = e.currentTarget.dataset.name;
        var that = this;
        var o = {};
        if (_name) {
            o[_name + 'Index'] = e.detail.value;
            that.setData(o);
        }
    },
    goNextStep: function(e) {
        var pro = '';
        var uStoreInfo = this.data.userStore;
        var pragam = {};

        if(!this.data.latitude){
            Util.Info({
                message: '请获取提报地址'
            });
            return false;
        };

        if (!this.data.productIndex) {
            Util.Info({
                message: '请选择产品'
            });
            return false;
        };
        
        pro = (this.data.productList)[this.data.productIndex].key;
        pragam.serviceType = pro;
        pragam.orgId = uStoreInfo.orgId;
        pragam.channel = uStoreInfo.orgName;
        pragam.distributor = uStoreInfo.storeName;
        pragam.salesmanLongitude = this.data.longitude;
        pragam.salesmanLatitude = this.data.latitude;
        wx.setStorageSync('storeInfo', pragam);
        wx.navigateTo({
            url: '../index/product'
        })

    },
    getUserStoreInfo:function(){
        //报价器获取店面信息
        var that = this;
        Util.ajax({
            url: that.data.Interfaces.GETUSERSTOREINFO,
            data:{},
            success:function(res){
                console.log(res);
                if(res.code == 200){
                    that.setData({
                        userStore:res.data
                    })
                }else{
                    Util.Info({
                        message: res.message||Util.ERRTIPMSG
                    });
                    return false;
                }
            }
        })
    },
    getWxSetting:function(){
        //判断用户是否授权获取地理位置
        var that = this;
        wx.getSetting({
            success: function (res) {
                if (!res.authSetting['scope.userLocation']) {
                    //未授权
                    wx.authorize({
                        scope: 'scope.userLocation',
                        success() {
                            // 用户已经同意小程序使用地理位置，后续调用 wx.getWxLocation 接口不会弹窗询问
                            that.getWxLocation();
                        }
                    })
                } else {
                    //已经授权
                    that.getWxLocation();
                }
            }
        });
    },
    getWxLocation:function(){
        //获取微信GPS点
        var that = this;
        wx.getLocation({
            success: function (res) {
                var latitude = res.latitude; //维度
                var longitude = res.longitude; //经度
                var oInfo = {
                    key: app.globalData.mapKey,
                    location: longitude + ',' + latitude
                }
                that.getAddress(oInfo);
                that.setData({
                    longitude: longitude,
                    latitude: latitude
                })
            }
        });
        
    },
    getOrgAndProduct:function(){
        //获取产品列表
        var that = this;
        Util.ajax({
            url: that.data.Interfaces.GETORGANDPRODUCTLIST,
            data:{},
            success:function(res){
                console.log(res);
                if(res.code == 200){
                    var list = res.data;
                    var arr = ['10','18','25'];
                    var pro = [];
                    if(list&&list.length>0){
                        for (var i=0;i<list.length;i++) {
                            var o = list[i].key;
                            if (arr.indexOf(o)>=0){
                                pro.push(list[i]);
                            }
                        };
                        that.setData({
                            productList: pro
                        })
                    }
                    
                }else{
                    Util.Info({
                        message:res.message||Util.ERRTIPMSG
                    });
                    return false;
                }
            }
        })

    }

})
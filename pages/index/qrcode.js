// pages/index/qrcode.js
/**
 * 二维码页面
 */
//获取应用实例
const app = getApp()
const domain = app.globalData.domain;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        qrImg: domain + 'images/qrcode.png'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        //设置标题
        wx.setNavigationBarTitle({
            title: '生成二维码',
        });

        //获取存储的产品信息
        var proInfo = wx.getStorageSync('proInfo');

        //获取二维码图片信息
        var qrcodeImg = wx.getStorageSync('ewm');
        this.setData({
            'proInfo': proInfo,
            'qrcodeImg': 'data:image/jpg;base64,' + qrcodeImg
        });


    }

})
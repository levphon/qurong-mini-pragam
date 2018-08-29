//add.js
/**
 * 新增区域经理
 */
//获取应用实例
const app = getApp()
const domain = app.globalData.domain;
const Util = require('../../utils/util.js');
var misSecond = '';
Page({
    data: {
        userBackground: domain + 'images/picBg.png',
        closeIcon: domain + 'images/fail.png',
        isDel: false,
        buttonText: '提交审核',
        imgId: '',
        isEdit: false,
        second: 60,
        msgCodeText: '获取验证码',
        isDisabled: false
    },

    onLoad: function(options) {
        var that = this;
        var isEdit = that.data.isEdit;
        var id = options.id;
        var pageType = options.pageType;
        var pageTitle = '新增区域经理';

        that.setData({
            Interfaces: app.globalData.Interfaces
        });

        //如果进入该页面带有参数ID，则是编辑页面
        if (id) {
            switch (pageType) {
                case '102':
                    //业务员管理
                    pageTitle = '业务员管理';
                    break;
                default:
                    //区域经理
                    pageTitle = '区域经理管理';
                    break;
            }
            that.setData({
                isEdit: true,
                id: id
            });
            that.getUserInfo();
        } else {
            switch (pageType) {
                case '102':
                    //业务员管理
                    pageTitle = '新增业务员';
                    break;
                default:
                    //区域经理
                    pageTitle = '新增区域经理';
                    break;
            }
        };

        wx.setNavigationBarTitle({
            title: pageTitle
        });

        
    },
    chooseImg: function() {
        const that = this;
        const imgId = that.data.imgId;
        //如果已经上传过图片，则必须先删除才能再上传新的，
        if (imgId) {
            return false;
        };
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function(res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                var tempFilePaths = res.tempFilePaths
                console.log(res);
                //选择完本地图片以后，调取一下上传图片接口，把图片上传到服务器
                // that.setData({
                //     isDel: true,
                //     photo: tempFilePaths[0]
                // });
                that.uploadFileToServer(tempFilePaths[0]);

            }
        })
    },
    uploadFileToServer: function (filePath){
        //上传图片到服务器
        var that = this;
        Util.uploadFile({
            url: that.data.Interfaces.UPLOADFILE,
            filePath: filePath,
            name: 'file',
            success: function (res) {
                if(res.code == 200){
                    that.setData({
                        photo:res.data,
                        isDel: true,
                        imgId:res.data
                    })
                }else{
                    Util.Info({message: res.message});
                    return false;
                }
            }
        })
    },
    delImg: function() {
        //删除上传的图片
        this.setData({
            isDel: false,
            imgId: '',
            photo:''
        });
    },
    setInputInfo: function(e) {
        var id = e.currentTarget.id;
        var that = this;
        console.log(id);
        if (id) {
            (that.data)[id] = e.detail.value;
        };
    },
    getMsgCode: function(e) {
        //获取验证码
        var that = this;
        var mobile = that.data.userPhone;
        var txt = that.data.msgCodeText;
        var a = that.data.second;
        if (!mobile) {
            Util.Info({
                message: '请输入手机号码'
            });
            return false;
        };

        if (!Util.validationMobile(mobile)) {
            Util.Info({
                message: '手机号格式不正确'
            });
            return false;
        };

        misSecond = setInterval(function() {
            if (a > 0) {
                a--;
                that.setData({
                    second: a,
                    msgCodeText: '再发送(' + a + ')',
                    isDisabled: true
                });
            } else {
                clearInterval(misSecond);
                that.setData({
                    second: 60,
                    msgCodeText: '获取验证码',
                    isDisabled: false
                });
            }
        }, 1000);

        if (txt != '获取验证码') {
            return false;
        }

        Util.ajax({
            url: that.data.Interfaces.SENDPHONECODE,
            data: { mobile: mobile} ,
            success: function(res) {
                if(res.code != 200){
                    Util.Info({
                        message:res.message
                    });
                    return false;
                }
            }
        })
    },
    getUserInfo: function() {
        //编辑用户初始化获取用户信息
        var that = this;
        var id = that.data.id;
        console.log(id);
        if (!id) {
            Util.Info({
                message: '缺少参数'
            });
            return false;
        }
        console.log(that.data.Interfaces.GETUSERDETAIL);
        Util.ajax({
            url: that.data.Interfaces.GETUSERDETAIL,
            data: {
                id: id
            },
            success: function(res) {
                if (res.code == 200) {
                    var o = res.data;
                    if (o) {
                        var user = o.user;
                        var detail = o.userDetail;
                        that.setData({
                            name: user.name,
                            userStatus: user.userStatus,
                            userPhone: user.userPhone,
                            certCode: detail.certCode,
                            isDel: true,
                            imgId: detail.photo,
                            photo: detail.photo,
                            remark: user.remark
                            //userBackground: detail.photo
                        });
                    }
                } else {
                    Util.Info({
                        message: res.message
                    });
                }
            }
        })
    },
    saveUserInfo: function() {
        //新增区域经理
        var that = this;
        var userName = that.data.name;
        var phone = that.data.userPhone;
        var yzm = that.data.verifyCode;
        var idCard = that.data.certCode;
        var imgId = that.data.photo;
        var pragam = {};
        var idEdit = that.data.isEdit;
        var ajaxUrl = that.data.Interfaces.SAVEUSERINFO;

        if (!userName) {
            Util.Info({
                message: '请输入姓名'
            });
            return false;
        };

        if (Util.isSpecialLetter(userName)) {
            Util.Info({
                message: '姓名不能包含特殊字符'
            });
            return false;
        };

        if (!phone) {
            Util.Info({
                message: '请输入手机号'
            });
            return false;
        };

        if (!Util.validationMobile(phone)) {
            Util.Info({
                message: '手机号格式不正确'
            });
            return false;
        };

        if (!yzm) {
            Util.Info({
                message: '请输入验证码'
            });
            return false;
        };

        if (!Util.checkIsNum(yzm)) {
            Util.Info({
                message: '验证码只能为纯数字'
            });
            return false;
        };

        if (!idCard) {
            Util.Info({
                message: '请输入身份证号'
            });
            return false;
        };

        if (!Util.isCardId(idCard)) {
            Util.Info({
                message: '身份证格式不正确'
            });
            return false;
        };

        if (!imgId) {
            Util.Info({
                message: '请上传个人照片'
            });
            return false;
        };

        if (idEdit) {
            ajaxUrl = that.data.Interfaces.UPDATEUSERINFO;
            pragam.id = that.data.id;
        }

        pragam.name = userName;
        pragam.userPhone = phone;
        pragam.verifyCode = yzm;
        pragam.certCode = idCard;
        pragam.photo = imgId;
        console.log(pragam);

        Util.ajax({
            url: ajaxUrl,
            data: pragam,
            success: function(res) {
                if (res.code == 200) {
                    Util.Info({
                        message: res.message || '操作成功',
                        success: function() {
                            wx.redirectTo({
                                url: '../add/success',
                            })
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
});
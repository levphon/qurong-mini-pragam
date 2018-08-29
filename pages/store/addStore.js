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
        errTipMsg: '门店信息有误',
        customItem: '请选择',
        openDate: '',
        carList: [{
            'brand': '请选择'
        }],
        carIndex: 0,
        orgList: ['汇通', '易鑫', '平安', '海通', '中远', '先锋', '汽车金融', '其他'],
        financeName1Index: 0,
        company: ['0-50', '51-100', '101-200', '201以上'],
        idCardFont: domain + 'images/id_front.png',
        idCardBack: domain + 'images/id_back.png',
        storeFront: domain + 'images/store_front.png',
        storeBack: domain + 'images/store_back.png',
        closeIcon: domain + 'images/fail.png',
        second: 60,
        msgCodeText: '获取验证码',
        isDisabled: false,
        region: ['请选择省', '市', '区'],
        storeInfo: {
            financeName1: '汇通',
        },
        // brandId:'1046',
        // cartypeId:'3333',
        // seriesId:'17940'
    },

    onLoad: function(options) {
        var that = this;
        var isEdit = that.data.isEdit;
        var id = options.id;
        var pageTitle = '新增店面';

        that.setData({
            Interfaces: app.globalData.Interfaces
        })

        that.getCarBrandList(function(){
            //如果进入该页面带有参数ID，则是编辑页面
            if (id) {
                pageTitle = '店面管理';
                that.setData({
                    isEdit: true,
                    id: id
                });
                that.getStoreInfo();
            };
        });

        wx.setNavigationBarTitle({
            title: pageTitle
        });




        that.getStroeLocation();

    },
    getStroeLocation: function(e) {
        //获取经纬度
        var that = this;
        wx.getLocation({
            success: function(res) {
                that.setData({
                    longitude: res.longitude,
                    latitude: res.latitude
                })
            },
        })
    },
    chooseImg: function(e) {
        var that = this;
        var imgType = e.currentTarget.dataset.type;
        var imgId = (that.data)[imgType + 'ImgId'];
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
                //选择完本地图片以后，调取一下上传图片接口，把图片上传到服务器
                Util.uploadFileToServer({
                    filePath: tempFilePaths[0],
                    success: function(res) {
                        var o = {};
                        var oa = that.data.storeInfo;
                        var ba = {};
                        if (oa) {
                            o = oa;
                        };
                        o[imgType] = res.data;
                        ba['storeInfo'] = o;
                        ba[imgType + 'ImgId'] = res.data;
                        that.setData(ba);
                    }
                })
            }
        })
    },

    deleteImg: function(e) {
        //删除上传的图片
        var imgType = e.currentTarget.dataset.type;
        var oa = this.data.storeInfo;
        var o = {};
        var ba = {};
        if (oa) {
            o = oa;
        };
        o[imgType] = '';
        ba[imgType + 'ImgId'] = '';
        ba['storeInfo'] = o;
        this.setData(ba);
    },
    setInputInfo: function(e) {
        var id = e.currentTarget.id;
        var that = this;
        var oa = that.data.storeInfo;
        var o = {};
        if (oa) {
            o = oa;
        };
        o[id] = e.detail.value;
        that.setData({
            storeInfo: o
        })
    },
    bindRegionChange: function(e) {
        //选择门店地址
        var a = e.detail.value;
        var oa = this.data.storeInfo;
        var o = {};
        if (oa) {
            o = oa;
        };
        o['province'] = a[0];
        o['city'] = a[1];
        o['district'] = a[2];
        this.setData({
            region: a,
            storeInfo: o
        })
    },
    bindDateChange: function(e) {
        //选择开业时间
        var oa = this.data.storeInfo;
        var o = {};
        if (oa) {
            o = oa;
        }
        o.openningTime = e.detail.value;
        this.setData({
            storeInfo: o
        });
    },
    bindCarTypeChange: function(e) {
        //选择主营汽车品牌
        var that = this;
        var arr = that.data.carList;
        that.setData({
            carIndex: e.detail.value,
            brandId: arr[e.detail.value].bid
        });
    },
    bindOrgChange: function(e) {
        //选择金融机构1
        this.setData({
            orgIndex: e.detail.value
        })
    },
    bindCompanyChange: function(e) {
        //选择
    },
    bindChangeEvent: function(e) {
        //公用切换下拉框方法
        var _name = e.currentTarget.dataset.name;
        var that = this;
        var oa = that.data.storeInfo;
        var o = {};
        var ba = {};
        var arr = that.data.orgList;
        if (oa) {
            o = oa;
        };

        if (_name == 'employeeNum') {
            arr = that.data.company;
        };

        if (_name) {
            o[_name] = arr[e.detail.value];
            ba[_name + 'Index'] = e.detail.value;
            ba['storeInfo'] = o;
            that.setData(ba);
        }
    },
    getCarBrandList: function(callBack) {
        //获取主营汽车品牌
        var that = this;
        Util.ajax({
            url: that.data.Interfaces.GETBRANDLIST,
            data: {},
            success: function(res) {
                if (res.code == 200) {
                    var obj = res.data;
                    if (obj) {
                        var oList = obj.item;
                        oList.unshift({
                            bid: '',
                            brand: "请选择",
                            brandCode: "",
                            identifyingPhoto: ""
                        });
                        that.setData({
                            carList: oList
                        });

                        if (callBack){
                            callBack();
                        }

                        //获取默认车系数据
                        // var bId = (obj.item)[0].bid;
                        // that.getCarseriesList(bId);
                    }
                } else {
                    Util.Info({
                        message: res.message
                    });
                    return false;
                }
            }
        })

    },
    getCarseriesList: function(id, tId, callBack) {
        //根据Id获取车系列表   
        //此方法暂时废弃，不需要展示车系
        var that = this;
        var bandList = that.data.carBrandList;
        if (!id) {
            var list = ['暂无车系'];
            // oList.unshift({
            //     bid: '',
            //     brand: "车系",
            //     brandCode: "",
            //     identifyingPhoto: ""
            // });
            that.setData({
                carList: [bandList, list, ['暂无车型']],
                carTypeList: [],
                carseriesList: []
            });
            return false;
        };
        Util.ajax({
            url: that.data.Interfaces.GETCARSERIESLIST,
            data: {
                'brandId': id
            },
            success: function(res) {
                if (res.code == 200) {
                    var obj = res.data;
                    if (obj) {
                        var list = obj.item.map(function(data) {
                            return data.carseries
                        });
                        if (!list || list.length <= 0) {
                            list = ['车系'];
                        }
                        that.setData({
                            carList: [bandList, list, []],
                            carseriesList: obj.item,
                            seriesList: list
                        });

                        //获取默认车型
                        if (tId) {
                            that.getCarTypeList(tId);
                        } else {
                            if ((obj.item)[0]) {
                                var csid = (obj.item)[0].csid;
                                if (csid) {
                                    that.getCarTypeList(csid);
                                }
                            } else {
                                that.getCarTypeList('');
                            };
                        }

                        if (callBack) {
                            callBack();
                        };
                    }
                } else {
                    Util.Info({
                        message: res.message
                    });
                    return false;
                }
            }
        })
    },
    getCarTypeList: function(id, callBack) {
        //根据Id获取车型列表
        //此方法暂时废弃，不需要展示车型
        var that = this;
        var bandList = that.data.carBrandList;
        var carseriesList = that.data.seriesList;
        if (!id) {
            var list = ['暂无车型'];
            that.setData({
                carList: [bandList, carseriesList, list],
                carTypeList: []
            });
            return false;
        };
        Util.ajax({
            url: that.data.Interfaces.GETCARTYPELIST,
            data: {
                'seriesId': id
            },
            success: function(res) {
                if (res.code == 200) {
                    var obj = res.data;
                    if (obj) {

                        var list = obj.item.map(function(data) {
                            return data.name
                        });

                        if (!list || list.length <= 0) {
                            list = ['暂无车型'];
                        };

                        that.setData({
                            carList: [bandList, carseriesList, list],
                            carTypeList: obj.item
                        });

                        if (callBack) {
                            callBack();
                        };

                    }
                } else {
                    Util.Info({
                        message: res.message
                    });
                    return false;
                }
            }
        })
    },
    getMsgCode: function(e) {
        //获取验证码
        var that = this;
        var mobile = that.data.storeInfo.userPhone;
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
            data: {
                mobile: mobile
            },
            success: function(res) {
                if (res.code != 200) {
                    Util.Info({
                        message: res.message
                    });
                    return false;
                }
            }
        })
    },
    checkInfo: function() {
        var that = this;
        var storeInfo = that.data.storeInfo;
        var url = that.data.Interfaces.SAVESTOREINFO;
        var pragam = {};

        if (!storeInfo.storeName) {
            Util.Info({
                message: '请输入门店全称'
            });
            return false;
        };

        if ((that.data.region)[0] == '请选择省') {
            Util.Info({
                message: '请选择门店地址'
            });
            return false;
        };

        if (!storeInfo.address) {
            Util.Info({
                message: '请输入详细地址'
            });
            return false;
        };

        if (!storeInfo.openningTime) {
            Util.Info({
                message: '请选择门店开业时间'
            });
            return false;
        };

        if (!that.data.brandId) {
            Util.Info({
                message: '请选择主营汽车品牌'
            });
            return false;
        };

        if (!storeInfo.monthlySales) {
            Util.Info({
                message: '请输入月销量'
            });
            return false;
        };

        if (storeInfo.monthlySales > 10000) {
            Util.Info({
                message: '月销量请输入0-10000的数字'
            });
            return false;
        };

        if (!storeInfo.financeName1) {
            Util.Info({
                message: '请选择合作金融机构1'
            });
            return false;
        };

        // if (!storeInfo.financeName2) {
        //     Util.Info({
        //         message: '请选择合作金融机构2'
        //     });
        //     return false;
        // };

        // if (!storeInfo.financeName3) {
        //     Util.Info({
        //         message: '请选择合作金融机构3'
        //     });
        //     return false;
        // };

        if (!storeInfo.employeeNum) {
            Util.Info({
                message: '请选择公司人数'
            });
            return false;
        };

        if (!storeInfo.name) {
            Util.Info({
                message: '请输入门店负责人姓名'
            });
            return false;
        };

        if (!storeInfo.leaderCertCode) {
            Util.Info({
                message: '请输入门店负责人身份证号'
            });
            return false;
        };

        if (!Util.isCardId(storeInfo.leaderCertCode)) {
            Util.Info({
                message: '身份证格式不正确'
            });
            return false;
        };

        if (!storeInfo.userPhone) {
            Util.Info({
                message: '请输入门店负责人手机号'
            });
            return false;
        };

        if (!Util.validationMobile(storeInfo.userPhone)) {
            Util.Info({
                message: '手机号格式不正确'
            });
            return false;
        };

        if (!storeInfo.verifyCode) {
            Util.Info({
                message: '请输入验证码'
            });
            return false;
        };

        if (!Util.checkIsNum(storeInfo.verifyCode)) {
            Util.Info({
                message: '验证码只能为纯数字'
            });
            return false;
        };

        if (!storeInfo.legalPersonCertCodeFront) {
            Util.Info({
                message: '请上传法人代表身份证正面'
            });
            return false;
        };

        if (!storeInfo.legalPersonCertCodeReverse) {
            Util.Info({
                message: '请上传法人代表身份证反面'
            });
            return false;
        };

        if (!storeInfo.storeImagePath) {
            Util.Info({
                message: '请上传门店照片'
            });
            return false;
        };

        if (!storeInfo.businessLicenseImg) {
            Util.Info({
                message: '请上传营业执照'
            });
            return false;
        };

        pragam.address = storeInfo.address;

        pragam.brandId = that.data.brandId;

        // if (that.data.cartypeId){
        //     pragam.cartypeId = that.data.cartypeId;
        // };

        // if (that.data.seriesId){
        //     pragam.seriesId = that.data.seriesId;
        // };

        pragam.businessLicenseImg = storeInfo.businessLicenseImg;
        pragam.employeeNum = storeInfo.employeeNum;
        pragam.financeName1 = storeInfo.financeName1;

        if (storeInfo.financeName2) {
            pragam.financeName2 = storeInfo.financeName2;
        };

        if (storeInfo.financeName3) {
            pragam.financeName3 = storeInfo.financeName3;
        }

        pragam.latitude = that.data.latitude;
        pragam.leaderCertCode = storeInfo.leaderCertCode;
        pragam.legalPersonCertCodeFront = storeInfo.legalPersonCertCodeFront;
        pragam.legalPersonCertCodeReverse = storeInfo.legalPersonCertCodeReverse;
        pragam.longitude = that.data.longitude;
        pragam.monthlySales = storeInfo.monthlySales;
        pragam.name = storeInfo.name;
        pragam.openningTime = storeInfo.openningTime;
        pragam.storeImagePath = storeInfo.storeImagePath;
        pragam.storeName = storeInfo.storeName;
        pragam.userPhone = storeInfo.userPhone;
        pragam.verifyCode = storeInfo.verifyCode;
        pragam.region = (that.data.region)[0] + (that.data.region)[1] + (that.data.region)[2];
        pragam.province = (that.data.region)[0];
        pragam.city = (that.data.region)[1];
        pragam.district = (that.data.region)[2];

        console.log(pragam);

        //编辑门店
        if (that.data.id) {
            url = that.data.Interfaces.UPDATESTOREINFO;
            pragam.id = that.data.userId;
        };

        Util.ajax({
            url: url,
            data: pragam,
            success: function(res) {
                if (res.code == 200) {
                    Util.Info({
                        message: that.data.isEdit ? '编辑' : '新增' + '成功',
                        success: function() {
                            wx.redirectTo({
                                url: '../add/success',
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

    },
    getStoreInfo: function(callBack) {
        //获取门店信息
        var that = this;
        var id = that.data.id;
        if (!id) {
            Util.Info({
                message: '缺少参数'
            });
            return false;
        };
        Util.ajax({
            url: that.data.Interfaces.GETSTOREINFO,
            data: {
                'id': id
            },
            success: function(res) {
                if (callBack) {
                    callBack();
                };
                if (res.code == 200) {
                    var user = res.data.user;
                    var userStore = res.data.userDetail;
                    var userId = user.id;
                    var list = Object.assign(user, userStore);
                    var cList = that.data.carList;
                    var wxObj = {};

                    var cIndex = cList.findIndex(function(n) {
                        return n.brand == list.brandName
                    });

                    console.log(cIndex);

                    that.setData({
                        storeInfo: list,
                        errTipMsg: list.remark,
                        region: [list.province, list.city, list.district],
                        financeName1Index: (that.data.orgList).findIndex(function(n) {
                            return n == list.financeName1
                        }),
                        financeName2Index: (that.data.orgList).findIndex(function(n) {
                            return n == list.financeName2
                        }),
                        financeName3Index: (that.data.orgList).findIndex(function(n) {
                            return n == list.financeName3
                        }),
                        employeeNumIndex: (that.data.company).findIndex(function(n) {
                            return n == list.employeeNum
                        }),
                        carIndex: cIndex,
                        brandId: list.brandId,
                        // seriesId: list.seriesId,
                        // cartypeId: list.cartypeId,
                        userId: userId
                    });
                    //!that.data.brandId && !that.data.seriesId && !that.data.typeId
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
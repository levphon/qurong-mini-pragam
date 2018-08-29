    const formatTime = date => {
        const year = date.getFullYear()
        const month = date.getMonth() + 1
        const day = date.getDate()
        const hour = date.getHours()
        const minute = date.getMinutes()
        const second = date.getSeconds()

        return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
    }

    const formatNumber = n => {
        n = n.toString()
        return n[1] ? n : '0' + n
    }

    const Util = {
        ERRTIPMSG: '出错了，请联系管理员'
    };
    const app = getApp();

    /**
     * 提示
     */
    Util.Info = function(options) {
        if (!options) {
            return false;
        };
        wx.showToast({
            title: options.message || Util.ERRTIPMSG,
            icon: options.icon || 'none',
            mask: options.mask || true,
            duration: options.time || 3000,
            success: function() {
                setTimeout(function() {
                    wx.hideToast();
                }, options.time || 3000);

                if (options.success) {
                    (options.success)();
                }
            },
            fail: function() {
                setTimeout(function() {
                    wx.hideToast();
                }, options.time || 3000);
                if (options.fail) {
                    (options.fail)();
                }
            }
        });
    };

    /**
     * js保留两位小数，(备注：js原生的toFixed方法计算精度不准确，例如：55.555，toFixed计算的的结果为55.55)
     */
    Util.saveDecimal = function(num, type) {
        if (num) {
            var numType = 2;
            var afterNum = '';
            var result = '';
            if (type) {
                numType = type;
            };
            result = Math.round(num * 100) / 100;
            result = result.toString();
            if (result.indexOf('.') >= 0) {
                afterNum = result.split('.');
                if (afterNum[1].length == 1) {
                    result = result + '0';
                };
            } else {
                result = result + '.00';
            }
            return result;
        } else {
            return '0.00';
        };
    };

    /**
     * 字符串截取
     */
    Util.strSlice = function(str, maxLen) {
        var num = 6;
        var newStr = str;
        if (!str) {
            return false;
        };
        if (maxLen) {
            num = maxLen;
        };
        if (str.length > num) {
            newStr = str.slice(0, num) + '...';
        };
        return newStr;

    };

    /**
     * 只能输入数字和小数点
     * 只能输入两位小数
     */
    Util.clearNoNum = function(obj) {
        //先把非数字的都替换掉，除了数字和.
        obj.replace(/[^\d.]/g, "");
        //必须保证第一个为数字而不是.
        obj.replace(/^\./g, "");
        //保证只有出现一个.而没有多个.
        obj.replace(/\.{2,}/g, ".");
        //保证.只出现一次，而不能出现两次以上
        obj.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
        //只能输入两位小数
        obj.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
        return obj;
    };

    /**
     * 验证手机号码
     */
    Util.validationMobile = function(mobile) {
        var myreg = /^(13[0-9]|15[0-35-9]|16[6]|17[0-9]|18[0-9]|19[9]|14[0-35-9])[0-9]{8}$/;
        return myreg.test(mobile);
    };

    /**
     * 是否特殊字符
     */
    Util.isSpecialLetter = function(str) {
        var reg = new RegExp("[`~!@#$^&*=|{}':;',\\[\\]<>?~！@#￥……&*——|{}【】‘；：”“'。，、？ ]");
        return reg.test(str);
    };

    /**
     * 校验是否为纯数字
     */
    Util.checkIsNum = function(txt) {
        var reg = /^[0-9]*$/;
        return reg.test(txt);
    };

    /**
     * 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
     */
    Util.isCardNo = function(card) {
        var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        return reg.test(card);
    };

    /**
     * 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
     */
    Util.isCardId = function(sId) {
        var iSum = 0; 
        var info = ""; 
        var sBirthday = '';
        var aCity = {
            11: "北京",
            12: "天津",
            13: "河北",
            14: "山西",
            15: "内蒙古",
            21: "辽宁",
            22: "吉林",
            23: "黑龙江",
            31: "上海",
            32: "江苏",
            33: "浙江",
            34: "安徽",
            35: "福建",
            36: "江西",
            37: "山东",
            41: "河南",
            42: "湖北",
            43: "湖南",
            44: "广东",
            45: "广西",
            46: "海南",
            50: "重庆",
            51: "四川",
            52: "贵州",
            53: "云南",
            54: "西藏",
            61: "陕西",
            62: "甘肃",
            63: "青海",
            64: "宁夏",
            65: "新疆",
            71: "台湾",
            81: "香港",
            82: "澳门",
            91: "国外"
        };
        if (!/^\d{17}(\d|x)$/i.test(sId)) {
            //return "你输入的身份证长度或格式错误"; 
            return false;
        }
        sId = sId.replace(/x$/i, "a"); 
        if (aCity[parseInt(sId.substr(0, 2))] == null) {
            //return "你的身份证地区非法"; 
            return false;
        }
        sBirthday = sId.substr(6, 4) + "-" + Number(sId.substr(10, 2)) + "-" + Number(sId.substr(12, 2)); 
        var d = new Date(sBirthday.replace(/-/g, "/")); 
        if (sBirthday != (d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate())) {
            //return "身份证上的出生日期非法"; 
            return false;
        }
        for (var i = 17; i >= 0; i--) {
            iSum += (Math.pow(2, i) % 11) * parseInt(sId.charAt(17 - i), 11); 
        }
        if (iSum % 11 != 1) {
            //return "你输入的身份证号非法";
            return false;
            //aCity[parseInt(sId.substr(0,2))]+","+sBirthday+","+(sId.substr(16,1)%2?"男":"女");
            //此次还可以判断出输入的身份证号的人性别
        } 
        return true;
    }

    /**
     * 封装微信发送请求方法
     */
    Util.ajax = function(options) {
        var header = app.globalData.cookie;
        wx.showLoading({
            title: '加载中...',
        });
        var requestTask = wx.request({
            url: options.url,
            data: options.data,
            header: header,
            method: options.method || 'GET',
            success: function(res) {
                //收到开发者服务成功返回的回调函数
                var obj = res.data;
                setTimeout(function() {
                    //增加setTimeout,防止wx.hideLoading 关闭掉wx.showToast
                    if (obj.code == 101) {
                        wx.switchTab({
                            url: '../login/login',
                        })
                    } else {
                        if (options.success) {
                            (options.success)(res.data);
                        }
                    }
                }, 0);
            },
            fail: function(res) {
                //接口调用失败的回调函数
                setTimeout(function(){
                    //增加setTimeout,防止wx.hideLoading 关闭掉wx.showToast
                    Util.Info({
                        message: res.message || Util.ERRTIPMSG
                    });
                    if (options.fail) {
                        (options.fail)(res.data);
                    }
                },0)
            },
            complete: function(res) {
                //接口调用结束的回调函数（调用成功、失败都会执行）
                wx.hideLoading();
                if (options.complete) {
                    (options.complete)(res.data);
                }
            }
        });
        return requestTask;
    };

    /**
     * 上传图片
     */
    Util.uploadFile = function(options) {
        var header = app.globalData.cookie;
        //content - type: 'multipart/form-data',
        header['content-type'] = 'multipart/form-data';
        wx.showLoading({
            title: '加载中...',
        });
        var requestTask = wx.uploadFile({
            url: options.url,
            data: options.data,
            filePath: options.filePath,
            header: header,
            name: options.name,
            formData: options.formData,

            success: function(res) {
                //收到开发者服务成功返回的回调函数
                wx.hideLoading();
                var obj = res.data;
                if (obj.code == 101) {
                    wx.switchTab({
                        url: '../login/login',
                    })
                } else {
                    if (options.success) {
                        (options.success)(JSON.parse(res.data));
                    }
                }
            },
            fail: function(res) {
                //接口调用失败的回调函数
                wx.hideLoading();
                if (options.fail) {
                    (options.fail)(JSON.parse(res.data));
                }
            },
            complete: function(res) {
                //接口调用结束的回调函数（调用成功、失败都会执行）
                wx.hideLoading();
                if (options.complete) {
                    (options.complete)(JSON.parse(res.data));
                }
            }
        });
        return requestTask;
    }


    /**
     * 产品名称类型
     */
    Util.SERVICETYPE = {
        '10': '衍生付A',
        '11': '衍生付C',
        '12': '续保付',
        '13': '银行产品1',
        '14': '银行产品2',
        '15': '广联车贷+衍生付A',
        '16': '畅享付A',
        '17': '畅享付B',
        '18': '衍生付(18期)',
        '19': '畅享付C',
        '20': '衍生付C-安邦专项方案',
        '21': '畅享付',
        '22': '储蓄卡分期',
        '23': '开鑫付',
        '24': '衍生付滴滴专用',
        '25': '趣融车',
        '26': '好车常规方案',
        '27': '好车低首付方案',
        '28': '好车创优方案',
        'null': '--',
        '1': '--',
        '2': '--',
        '3': '--',
        '4': '--'
    };

    /**
     * 资金方
     */
    Util.LOANCOMPANYSWITCH = {
        '0': '趣融',
        '1': '汇融易',
        '2': '汇享融',
        '3': '君乘达',
        '4': '安信',
        null: '--'
    };

    /**
     * 当前节点
     */
    Util.APPROVALTYPE = {
        '0': '合同初审',
        '10': '合同信审',
        '20': '合同电审',
        '30': '合同人工复审',
        '40': '合同预约电审',
        '50': '合同已审批',
        '60': '放款资料审批',
        '70': '放款前电审',
        '80': '客户确认',
        '90': '财务初审',
        '100': '财务复审',
        '110': '合同待放款',
        '111': '合同已放款'
    };

    /**
     * 征信状态
     */
    Util.PBOCSTATUS = {
        '0': '无记录',
        '1': '未授权',
        '2': '成功',
        '3': '失败'
    };

    /**
     * 获取报表数据
     */
    Util.getEchartInfo = function(options) {
        var Interfaces = app.globalData.Interfaces;
        if (!options) {
            return false;
        };
        var that = options.that;
        var pragam = {};
        if (options.id) {
            pragam.id = options.id;
        };
        //获取报表统计信息
        Util.ajax({
            url: Interfaces.GETECHARTINFO,
            data: pragam,
            success: function(res) {
                if (options.callBack) {
                    (options.callBack)();
                }
                if (res.code == 200) {
                    var list = res.data;
                    that.setData(list);
                } else {
                    Util.Info({
                        message: res.message
                    });
                    return false;
                }
            },
            fail: function(res) {

                if (options.callBack) {
                    (options.callBack)();
                }
            }
        })
    }

    /**
     * 上传图片到公共服务器接口
     */
    Util.uploadFileToServer = function(options) {
        //上传图片到服务器
        var Interfaces = app.globalData.Interfaces;
        Util.uploadFile({
            url: Interfaces.UPLOADFILE,
            filePath: options.filePath,
            name: 'file',
            success: function(res) {
                if (res.code == 200) {
                    if (options.success) {
                        (options.success)(res);
                    };
                } else {
                    Util.Info({
                        message: res.message
                    });
                    return false;
                }
            }
        })
    };
    module.exports = Util;
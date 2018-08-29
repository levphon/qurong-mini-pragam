//index.js
//获取应用实例
const app = getApp()
const domain = app.globalData.domain;
const Util = require('../../utils/util.js');
Page({
    data: {
        buttonText: '生成二维码',
        carMonth: ['12', '24', '36'],
        creditCarMonth: ['12', '18', '24', '36', '42', '48', '60'],
        qrMonth: ['24', '36'],
        qurongIndex: 1,
        carIndex: 0,
        qrCarIndex: 2,
        creditCarIndex: 0,
        plan: 1,
        priceHolder: '6万-100万',
        invoiceHolder: '6万-100万',
        minSlider: 10000,
        maxSlider: 10000,
        driveRecord: 0,
        hasRzService: true,
    },
    onLoad: function() {
        var that = this;
        var pageTitle = '趣融车报价器';
        var options = wx.getStorageSync('storeInfo');
        console.log(options);
        that.setData({
            storeInfo: options,
            serviceType: options.serviceType,
            Interfaces: app.globalData.Interfaces
        });
        switch (options.serviceType) {
            case '10':
                pageTitle = '衍生付A报价器';
                break;
            case '18':
                pageTitle = '衍生付18期报价器';
                break;
            default:
                pageTitle = '趣融车报价器';
                break
        }
        //设置标题
        wx.setNavigationBarTitle({
            title: pageTitle,
        });

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
        //切换下拉选项触发计算
        that.commonCalculate();
    },
    bindPlanEvent: function(e) {
        //切换方案
        var _type = e.currentTarget.dataset.type;
        var _txt = '5万-100万';
        if (_type) {
            this.setData({
                plan: _type
            })
        };

        if (_type == 1) {
            _txt = '6万-100万';
        }
        this.setData({
            priceHolder: _txt,
            invoiceHolder: _txt
        });
        this.calculate();
    },
    setInputInfo: function(e) {
        //绑定input输入方法
        var _name = e.currentTarget.id;
        var that = this;
        var txt = e.detail.value;
        var o = {};
        if (_name) {
            o[_name] = txt;
            that.setData(o);
        }

        //输入绑定触发计算
        that.commonCalculate();

        return {
            value: txt
        };
    },
    sliderChange: function(e) {
        //自定义 客户融资额
        this.setData({
            customize: e.detail.value
        });
        this.calculate(e.detail.value);
    },
    switchChange: function(e) {
        this.setData({
            hasRzService: e.detail.value
        });
        this.commonCalculate();
    },
    calculate: function(txt) {
        //趣融车计算公式
        var that = this;
        var cPrice = Number(this.data.vehiclePrice); //车辆发票金额
        var wPrice = Number(this.data.carLoanPrincipal); //车贷本金
        var calInput = Number(this.data.monthlySupply); //月供金额
        var carMonth = (this.data.carMonth)[this.data.qrCarIndex]; //车辆贷款期数
        var qr = (that.data.qrMonth)[that.data.qurongIndex]; //趣融分期期数
        var fan = that.data.plan;
        var hasRzService = that.data.hasRzService;
        var pragam = {};

        var tigerLoan = 0; //客户融资额
        var firstPay = 0; //客户首付
        var monthPay = 0; //月供
        var glNum = 0; //驾宝无忧盗抢保障
        var monthInterest = 0; //综合月息
        var rzServiceMoney = 0; //融资服务费
        var channelCommission = 0; //渠道基础佣金
        var storeReceiptAmount = 0; //	门店实收金额
        var total = 0; //合同总额
        var clientMonthPay = 0; //每期还款
        var payPercent = 0; //首付比例

        var minPrice = 50000;

        var isAllow = cPrice && wPrice && calInput;

        if (!isAllow) {
            return false;
        };

        // if (fan == 1) {
        //     minPrice = 60000;
        // };

        // if (cPrice > 1000000) {
        //     Util.Info({ message: '车辆发票金额输入有误，请重新输入' });
        //     return false;
        // };

        // if (cPrice < minPrice) {
        //     Util.Info({ message: '车辆发票金额输入有误，请重新输入' });
        //     return false;
        // }; 

        // if (wPrice > 1000000) {
        //     Util.Info({ message: '车贷本金输入有误，请重新输入' });
        //     return false;
        // };

        // if (wPrice < minPrice) {
        //     Util.Info({ message: '车贷本金输入有误，请重新输入' });
        //     return false;
        // };

        // if (calInput > 50000) {
        //     Util.Info({ message: '车贷月供输入有误，请重新输入' });
        //     return false;
        // };

        // if (that.data.driveRecord > 5000) {
        //     Util.Info({ message: '联网隐藏式行车记录仪输入有误，请重新输入' });
        //     return false;
        // };


        /**
         * V4.21版本修改
         * 客户融资额
         * 车辆发票金额大于等于50000，小于100000，则取车辆发票金额*25%；
         * 车辆发票金额大于等于100000，小于150000，则取车辆发票金额*22%
         * 车辆发票金额大于等于150000，小于200000，则取车辆发票金额*20%；
         * 车辆发票金额大于等于200000，小于等于500000，则取车辆发票金额*18%；
         * 车辆发票金额大于500000，则取固定值100000
         * */
        var aLoan = 0;
        if (cPrice >= 50000 && cPrice < 100000) {
            aLoan = cPrice * 0.25;
        } else if (cPrice >= 100000 && cPrice < 150000) {
            aLoan = cPrice * 0.22;
        } else if (cPrice >= 150000 && cPrice < 200000) {
            aLoan = cPrice * 0.20;
        } else if (cPrice >= 200000 && cPrice <= 500000) {
            aLoan = cPrice * 0.18;
        } else {
            aLoan = 100000;
        };



        /**
         * 4.21 需求变更
         * 客户融资额最大60000
         * */
        if (aLoan > 60000) {
            aLoan = 60000;
        };

        /**
         * 常规方案
         * 客户融资额计算
         */
        tigerLoan = Math.min(aLoan, cPrice * 1.1 - wPrice);

        /**
         * 工行联合贷方案
         * 取“车辆发票金额*18%（超过6万按6万来算）”和“车辆发票金额*110%-车贷本金”计算结果的最小值
         */
        if (fan == 1) {
            tigerLoan = Math.min(cPrice * 0.18 < 60000 ? cPrice * 0.18 : 60000, cPrice * 1.1 - wPrice);
        };

        /**
         * 手动拖动修改客户融资额
         */
        if (txt) {
            tigerLoan = txt;
        };

        /**
         * 渠道基础佣金
         * 24期：取客户融资额*3%；
         * 36期：取客户融资额*4%
         */
        channelCommission = tigerLoan * 0.03;
        if (qr == 36) {
            channelCommission = tigerLoan * 0.04;
        };


        /**
         * 客户首付
         * “车辆发票金额-车贷本金-客户融资额”和“车辆发票金额*0.1”的最大值
         */
        firstPay = Math.max(cPrice - wPrice - tigerLoan, cPrice * 0.1);

        /**
         * 驾宝无忧盗抢保障
         * 计算公式：
         * 第一年：85.68+0.41%*车辆发票金额*12.7/11.7
         * 第二年：85.68+0.41%*车辆发票金额*12.7/11.7*(1-7.2%)
         * 第三年：85.68+0.41%*车辆发票金额*12.7/11.7*(1-7.2%*2)
         * (第一年+第二年+第三年)*1.2
         */
        var one = 85.68 + 0.41 / 100 * cPrice * 12.7 / 11.7;
        var two = 85.68 + 0.41 / 100 * cPrice * 12.7 / 11.7 * (1 - 7.2 / 100);
        var three = 85.68 + 0.41 / 100 * cPrice * 12.7 / 11.7 * (1 - 7.2 / 100 * 2);
        glNum = (one + two + three) * 1.2;


        /**
         * 月供
         * 计算公式：客户每期还款金额+车贷月供
         * 客户每期还款金额计算公式：（客户融资额*(1+1.2%*趣融车分期期数)）/趣融车分期期数
         */

        var customerMonthPay = (tigerLoan * (1 + 1.2 / 100 * qr)) / qr;
        monthPay = customerMonthPay + Number(calInput);

        /**
         * 综合月息
         * 计算公式：((总还款金额-总本金)/车贷期数)/(车贷本金+客户融资额)
         * 其中 总还款金额 = 车贷月供*车贷期数+（客户融资额*(1+1.2%*趣融车分期期数)）
         * 其中 总本金 = 车贷本金 + 客户融资额
         */
        var wxTotal = calInput * carMonth + (tigerLoan * (1 + 1.2 / 100 * qr)); //总还款金额
        var wxTotalCapital = wPrice + tigerLoan; //总本金
        monthInterest = ((wxTotal - wxTotalCapital) / carMonth) / (wPrice + tigerLoan) * 100;

        /**
         * 融资服务费
         * 计算公式：客户融资额*4%;
         */
        if (hasRzService) {
            rzServiceMoney = tigerLoan * 4 / 100;
        };

        /**
         * 门店实收金额
         * 计算公式=客户融资额-融资服务费；
         */
        storeReceiptAmount = tigerLoan - rzServiceMoney;

        /**
         * 合同总额
         * 计算公式=客户融资额*(1+1.2%*趣融车分期期数);
         * */
        total = tigerLoan * (1 + 1.2 / 100 * qr);

        /**
         * 客户每期还款
         * 金额计算公式=合同总额/趣融车分期期数
         * */
        clientMonthPay = total / qr;


        /**
         * 首付比例
         * 融资首付款/车辆发票金额
         * */
        payPercent = firstPay / cPrice * 100;


        pragam.vehiclePrice = cPrice.toFixed(2);
        pragam.carLoanPrincipal = wPrice.toFixed(2);
        pragam.derivativeCost = tigerLoan.toFixed(2);
        pragam.financePrincipal = firstPay.toFixed(2);
        pragam.monthlySupply = monthPay.toFixed(2);
        pragam.glCareFree = glNum.toFixed(2);
        pragam.comprehenMonthInterest = monthInterest.toFixed(2);
        pragam.financeServiceFee = rzServiceMoney.toFixed(2);
        pragam.networkHiddenRecorder = that.data.driveRecord;
        pragam.downPayFinance = firstPay.toFixed(2);
        pragam.channelBaseCommission = channelCommission.toFixed(2);
        pragam.productSolution = fan;
        pragam.storeReceiptAmount = storeReceiptAmount.toFixed(2);
        pragam.tigerCreditPeriod = qr;
        pragam.installments = clientMonthPay.toFixed(2);
        pragam.creditAmount = total.toFixed(2);
        pragam.creditPeriod = carMonth;
        pragam.creditMonthlyRent = calInput.toFixed(2);
        pragam.glCareFreeValidPeriod = 3;
        pragam.serviceType = 25;

        if (!txt) {
            that.setData({
                maxSlider: tigerLoan.toFixed(2)
            });
        };

        //oInfo[a] = calInput;
        that.setData({
            proInfo: pragam
        })
        return pragam;
    },
    aCalculate: function() {
        //衍生付A计算公式
        var that = this;
        var price = that.data.vehiclePrice;
        var month = 12;
        var derivedCost, recost, total, monthPay, glNum;

        if (!price) {
            Util.Info({
                'message': '请输入车辆销售价'
            });
            return false;
        };

        /*
         ** 手续费
         ** 计算公式：开票价*0.35%，最低300，最高800
         */
        var cost = price * 0.0035;
        if (cost > 800) {
            cost = 800;
        } else if (cost < 300) {
            cost = 300;
        };

        /**
         * 提车衍生费用
         * 计算公式：开票价*15%（开票价<=10w)
         * 计算公式：开票价*13.5%（10w<开票价<=18w)
         * 计算公式：开票价*12%（18w<开票价<=35w)
         * 计算公式：开票价*9%（35w<开票价<=100w)
         * */
        if (price <= 100000) {
            derivedCost = price * 0.15;
        } else if (100000 < price && price <= 180000) {
            derivedCost = price * 0.135;
        } else if (180000 < price && price <= 350000) {
            derivedCost = price * 0.12;
        } else if (price > 350000) {
            derivedCost = price * 0.09;
        };

        /**
         * 广联无忧
         * 计算公式：提车衍生费用*0.198
         **/
        glNum = derivedCost * 0.198;


        /**
         * 续保费用(剩余服务费)
         * 计算公式：开票价*5.5%*（趣融期数-12）/12
         **/
        recost = price * 0.055 * (month - 12) / 12;

        /**
         * 衍生贷总额 total(服务费总额（贷款金额）)
         * 计算公式：广联无忧+续保费用+提车衍生费用
         **/
        total = glNum + recost + derivedCost;

        /**
         * 服务费总额（贷款金额）
         * 如果超过6万，则显示为6万
         **/
        if (total > 60000) {
            total = 60000;
        };

        /**
         * 月还款额 monthPay
         * 计算公式：衍生贷总额/趣融期数
         **/
        monthPay = total / month;

        var serviceType = that.data.serviceType;
        //var distributor = that.data.distributor;
        //var orgId = that.data.orgId;
        //var channel = that.data.channel;
        var oInfo = {
            creditAmount: total.toFixed(2),
            derivativeCost: derivedCost.toFixed(2),
            glCareFree: glNum.toFixed(2),
            installments: monthPay.toFixed(2),
            vehiclePrice: price,
            glCareFreeValidPeriod: 3,
            tigerCreditPeriod: 12,
            creditPeriod: 36,
            serviceType: serviceType,
            downPayFinance: derivedCost.toFixed(2)
            //distributor: distributor,
            //orgId: orgId,
            //channel: channel
        }

        that.setData({
            proInfo: oInfo
        });
        return oInfo;



    },
    eightteenCalculate: function() {
        //衍生付18期计算
        var that = this;
        var price = that.data.vehiclePrice;
        var month = 18;
        var derivedCost, total, monthPay, glNum;

        if (!price) {
            Util.Info({
                'message': '请输入车辆开票价'
            });
            return false;
        };


        /*
         ** 手续费
         ** 计算公式：开票价*0.35%，最低300，最高800
         */
        var cost = price * 0.0035;
        if (cost > 800) {
            cost = 800;
        } else if (cost < 300) {
            cost = 300;
        };

        /**
         * 提车衍生费用
         * 计算公式：开票价*15%（开票价<=10w)
         * 计算公式：开票价*13.5%（10w<开票价<=18w)
         * 计算公式：开票价*12%（18w<开票价<=35w)
         * 计算公式：开票价*9%（35w<开票价<=100w)
         * */
        if (price <= 100000) {
            derivedCost = price * 0.15;
        } else if (100000 < price && price <= 180000) {
            derivedCost = price * 0.135;
        } else if (180000 < price && price <= 350000) {
            derivedCost = price * 0.12;
        } else if (price > 350000) {
            derivedCost = price * 0.09;
        };

        /**
         * 智能车联网服务费
         * 智能车联网服务费= 提车衍生费用*1.2%*趣融贷款期数（18）
         **/
        glNum = derivedCost * 1.2 / 100 * 18;


        /**
         * 衍生贷总额 total(服务费总额（贷款金额）)
         * 服务费总额（贷款金额）=智能车联网服务费+提车衍生费用
         **/
        total = glNum + derivedCost;


        /**
         * 服务费总额（贷款金额）
         * 如果超过6万，则显示为6万
         **/
        if (total > 60000) {
            total = 60000;
        };


        /**
         * 月还款额 monthPay
         * 计算公式：衍生贷总额/趣融期数
         **/
        monthPay = total / month;

        var serviceType = that.data.serviceType;
        //var distributor = that.data.distributor;
        //var orgId = that.data.orgId;
        //var channel = that.data.channel;
        var oInfo = {
            creditAmount: total.toFixed(2),
            derivativeCost: derivedCost.toFixed(2),
            glCareFree: glNum.toFixed(2),
            installments: monthPay.toFixed(2),
            vehiclePrice: price,
            glCareFreeValidPeriod: 3,
            tigerCreditPeriod: 18,
            serviceType: serviceType,
            creditPeriod: 36,
            downPayFinance: that.data.downPayFinance
            //distributor: distributor,
            //orgId: orgId,
            //channel: channel
        };

        that.setData({
            proInfo: oInfo
        });
        return oInfo;
    },
    commonCalculate: function() {
        var that = this;
        var pro = that.data.serviceType;
        var txt = that.data.customize;
        var result = '';
        switch (pro) {
            case '10':
                result = that.aCalculate()
                break;
            case '18':
                result = that.eightteenCalculate();
                break;
            default:
                result = that.calculate(txt);
                break;
        }
        return result;
    },
    checkInfo: function() {
        //信息校验
        var that = this;
        var pro = Number(that.data.serviceType); //产品类型
        var price = Number(that.data.vehiclePrice); //车辆开票价
        var rPrice = Number(that.data.downPayFinance); //提车首付款(衍生付A特有)
        var wPrice = Number(that.data.carLoanPrincipal); //车贷本金(趣融车)
        var calInput = Number(that.data.monthlySupply); //月供金额(趣融车)
        var fan = that.plan;
        var tipMsg = '车辆开票价';
        var downMsg = '提车首付款';
        var min = 50000;
        if (pro == 25) {
            tipMsg = '车辆发票金额';
            if (fan == 1) {
                min = 60000;
            };
        };
        if (pro == 18) {
            downMsg = '融资首付款';
        };
        if (!price) {
            Util.Info({
                'message': '请输入' + tipMsg
            });
            return false;
        };

        if (price > 1000000) {
            Util.Info({
                'message': tipMsg + '不能大于1000000'
            });
            return false;
        };

        if (price < min) {
            Util.Info({
                'message': tipMsg + '不能小于' + min
            });
            return false;
        }

        if (pro != 25) {
            if (!rPrice) {
                Util.Info({
                    'message': '请输入' + downMsg
                });
                return false;
            };
            if (rPrice > price) {
                Util.Info({
                    'message': downMsg + '不能大于车辆开票价'
                });
                return false;
            }
        };

        if (pro == 25) {
            if (!wPrice) {
                Util.Info({
                    'message': '请输入车贷本金'
                });
                return false;
            };

            if (wPrice < 0 || wPrice>1000000){
                Util.Info({
                    'message': '车贷本金输入有误，请重新输入'
                });
                return false;
            }

            if (!calInput) {
                Util.Info({
                    'message': '请输入月供金额'
                });
                return false;
            };

            if (calInput > 50000) {
                Util.Info({
                    message: '车贷月供输入有误，请重新输入'
                });
                return false;
            };

            if (that.data.driveRecord > 5000) {
                Util.Info({
                    message: '联网隐藏式行车记录仪输入有误，请重新输入'
                });
                return false;
            };
        };

        return true;
    },
    goNextStep: function(e) {
        var that = this;
        var result = that.commonCalculate();
        var store = that.data.storeInfo;
        var oInfo = Object.assign(result, store);
        var isTrue = that.checkInfo();
        if (isTrue) {
            wx.setStorageSync('proInfo', oInfo);
            Util.ajax({
                url: that.data.Interfaces.GETPRODUCTQRCODE,
                data: oInfo,
                success: function(res) {
                    console.log(res);
                    if (res.code == 200) {
                        wx.setStorageSync('ewm', res.data);
                        wx.navigateTo({
                            url: '../index/qrcode',
                        })
                    } else {
                        Util.Info({
                            message: res.message || Util.ERRTIPMSG
                        });
                        return false;
                    }
                },
                fail:function(res){
                    console.log(res);
                }
            })
        }
    }
})
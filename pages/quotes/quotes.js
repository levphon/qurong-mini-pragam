/**
 * 首页报价器
 */
const app = getApp()
const domain = app.globalData.domain;
const Util = require('../../utils/util.js');
const sliderWidth = 93; // 需要设置slider的宽度，用于计算中间位置
Page({
    data: {
        buttonText: '开始测算',
        productList: [{
                "id": "25",
                "name": "趣融车"
            },
            {
                "id": "10",
                "name": "衍生付"
            }
        ],
        priceHolder: '6万-100万',
        invoiceHolder: '6万-100万',
        plan: 2,
        activeIndex: 0,
        sliderOffset: 0,
        sliderLeft: 0,
        carMonth: ['12', '24', '36'],
        creditCarMonth: ['12', '18', '24', '36', '42', '48', '60'],
        qrMonth: ['24', '36'],
        qurongIndex: 1,
        carIndex: 2,
        creditCarIndex: 0,
        driveRecord:0,
        hasRzService:true,
        minSlider:10000,
        maxSlider:10000
    },
    onLoad: function(options) {
        var that = this;
        var pageTitle = '趣融车报价器';
        //设置标题
        wx.setNavigationBarTitle({
            title: pageTitle,
        });
        wx.getSystemInfo({
            success: function(res) {
                var w = parseFloat(res.windowWidth / that.data.productList.length);

                that.setData({
                    sliderLeft: (res.windowWidth / that.data.productList.length - w) / 2,
                    sliderOffset: res.windowWidth / that.data.productList.length * that.data.activeIndex,
                    sliderLineWidth: w
                });
            }
        });

    },
    tabClick: function(e) {
        this.setData({
            sliderOffset: e.currentTarget.offsetLeft,
            activeIndex: e.currentTarget.id
        });
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

        if (_type == 2) {
            _txt = '6万-100万';
        }
        this.setData({
            priceHolder: _txt,
            invoiceHolder:_txt
        });
        this.calculate();
    },
    bindChangeEvent: function(e) {
        //公用切换下拉框方法
        var _name = e.currentTarget.dataset.name;
        var that = this;
        var o = {};
        if (_name) {
            o[_name + 'Index'] = e.detail.value;
            that.setData(o);
        };
        that.calculate();
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
    inputFocusEvent:function(e){
        //input 获取焦点事件  特殊处理
        var id = e.currentTarget.id;
        if (id == 'vehiclePrice'){
            this.setData({
                invoiceHolder: '',
                priceFocusIsTure:true
            })
        }else{
            this.setData({
                priceHolder: ''
            })
        };
    },
    inputBlurEvent: function (e) {
        //input 失去焦点事件  特殊处理
        var wPlan = this.data.plan;
        var _txt = '5万-100万';
        if (wPlan == 2) {
            _txt = '6万-100万';
        };
        this.setData({
            invoiceHolder: _txt,
            priceHolder: _txt
        })
    },
    switchChange: function(e) {
        this.setData({
            hasRzService: e.detail.value
        });

        this.calculate();
    },
    sliderChange:function(e){
        this.calculate(e.detail.value);
    },
    calculate: function(txt) {
        //趣融车计算公式
        var that = this;
        var cPrice = Number(this.data.vehiclePrice); //车辆发票金额
        var wPrice = Number(this.data.carLoanPrincipal); //车贷本金
        var calInput = Number(this.data.monthlySupply); //月供金额
        var carMonth = (this.data.carMonth)[this.data.carIndex]; //车辆贷款期数
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

        var minPrice = 50000; 

        var isAllow = cPrice && wPrice && calInput;

        if (!isAllow) {
            return false;
        };

        if (fan == 2){
            minPrice = 60000;
        };

        if (cPrice>1000000){
            Util.Info({ message:'车辆发票金额输入有误，请重新输入'});
            return false;
        };

        if (cPrice < minPrice) {
            Util.Info({ message: '车辆发票金额输入有误，请重新输入' });
            return false;
        };

        if (wPrice > 1000000) {
            Util.Info({ message: '车贷本金输入有误，请重新输入' });
            return false;
        };

        if (wPrice < 0) {
            Util.Info({ message: '车贷本金输入有误，请重新输入' });
            return false;
        };

        if (calInput>50000) {
            Util.Info({ message: '车贷月供输入有误，请重新输入' });
            return false;
        };

        if (that.data.driveRecord>5000){
            Util.Info({ message: '联网隐藏式行车记录仪输入有误，请重新输入' });
            return false;
        };
        

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
        if (fan == 2) {
            tigerLoan = Math.min(cPrice * 0.18 < 60000 ? cPrice * 0.18 : 60000, cPrice * 1.1 - wPrice);
        };

        /**
         * 手动拖动修改客户融资额
         */
        if (txt) {
            tigerLoan = txt;
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
        monthInterest = ((wxTotal - wxTotalCapital) / carMonth) / (wPrice + tigerLoan)*100;

        /**
         * 融资服务费
         * 计算公式：客户融资额*4%;
         */
        if (hasRzService) {
            rzServiceMoney = tigerLoan * 4 / 100;
        };
        pragam.tigerLoan = tigerLoan.toFixed(2);
        pragam.firstPay = firstPay.toFixed(2);
        pragam.monthPay = monthPay.toFixed(2);
        pragam.glNum = glNum.toFixed(2);
        pragam.monthInterest = monthInterest.toFixed(2);
        pragam.rzServiceMoney = rzServiceMoney.toFixed(2);
        pragam.driveRecord = that.data.driveRecord;

        if(!txt){
            that.setData({
                maxSlider: tigerLoan.toFixed(2)
            });
        };
        console.log(pragam);
        that.setData({
            productInfo: pragam
        });
        return pragam;





    },
    commonCalculate: function() {
        var that = this;
        var pro = that.data.serviceType;
        var result = '';
        switch (pro) {
            case '10':
                result = that.aCalculate()
                break;
            case '18':
                result = that.eightteenCalculate();
                break;
            default:
                result = that.calculate();
                break;
        }
        return result;
    },
    checkInfo: function() {
        //信息校验
        var that = this;
        var pro = that.data.serviceType; //产品类型
        var price = that.data.vehiclePrice; //车辆开票价
        var rPrice = that.data.downPayFinance; //提车首付款(衍生付A特有)
        var wPrice = that.data.carLoanPrincipal; //车贷本金(趣融车)
        var calInput = that.data.monthlySupply; //月供金额(趣融车)
        var tipMsg = '请输入车辆开票价';
        if (pro == 25) {
            tipMsg = '请输入车辆发票金额';
        };
        if (!price) {
            Util.Info({
                'message': tipMsg
            });
            return false;
        };


        if (pro == 10) {
            if (!rPrice) {
                Util.Info({
                    'message': '请输入提车首付款'
                });
                return false;
            };
        };

        if (pro == 25) {
            if (!wPrice) {
                Util.Info({
                    'message': '请输入车贷本金'
                });
                return false;
            };

            if (!calInput) {
                Util.Info({
                    'message': '请输入月供金额'
                });
                return false;
            };
        };

        return true;
    },
    goNextStep: function(e) {
        var that = this;
        var result = that.commonCalculate();
        var isTrue = that.checkInfo();
        if (isTrue) {
            wx.setStorageSync('proInfo', result);
            wx.navigateTo({
                url: '../index/qrcode',
            })
        }
    }
})
/**
 * 所有模块的接口路径
 */
const app = getApp();
const domain = app.globalData.ajaxurl;
const Interfaces = {};
const random = '?Random=' + Math.random();

/**
 * 登录接口
 */
Interfaces.LOGIN = domain + 'user/login' + random;

/**
 * 修改密码
 */
Interfaces.EDITPASSWORD = domain + 'user/updatePassword' + random;

/**
 * SP,区域经理，门店分页获取下面的区域经理，门店，业务员用户列表接口
 */
Interfaces.GETUSERLIST = domain + 'user/list' + random;

/**
 * 修改区域经理或业务员接口
 */
Interfaces.UPDATEUSERINFO = domain + 'user/updateAreaManagerOrSalesman' + random;

/**
 * 获取合同列表接口
 */
Interfaces.GETCONTRACTLIST = domain + 'contract/list' + random;

/**
 * 获取合同报表统计
 */
Interfaces.GETECHARTINFO = domain + 'contractStatistics/count' + random;

/**
 * 增加区域经理或业务员接口
 */
Interfaces.SAVEUSERINFO = domain + 'user/saveAreaManagerOrSalesman' + random;

/**
 * 获取区域经理或业务员用户信息
 */
Interfaces.GETUSERDETAIL = domain + 'user/getUserDetail' + random;

/**
 * 获取合同详情数据
 */
Interfaces.GETCONTRACTINFO = domain + 'contract/getDetail' + random;

/**
 * 业务员获取对应的门店信息
 */
Interfaces.GETUSERSTOREINFO = domain + 'user/getUserStoreDetail' + random;

/**
 * 生成报价器二维码
 */
Interfaces.GETPRODUCTQRCODE = domain + 'contract/getProductOrderQRCode' + random;

/**
 * 上传图片接口
 */
Interfaces.UPLOADFILE = domain + 'common/uploadFile' + random;

/**
 * 发送短信验证码
 */
Interfaces.SENDPHONECODE = domain + 'common/sendVerificationCode' + random;

/**
 * 获取汽车品牌列表
 */
Interfaces.GETBRANDLIST = domain + 'car/getCarbrandList' + random;

/**
 * 根据品牌id，获取车系列表
 */
Interfaces.GETCARSERIESLIST = domain + 'car/getCarseriesList' + random;

/**
 * 根据车系id，获取车型列表
 */
Interfaces.GETCARTYPELIST = domain + 'car/getCartypeList' + random;

/**
 * 添加门店
 */
Interfaces.SAVESTOREINFO = domain + 'user/saveStore' + random;

/**
 * 修改门店信息
 */
Interfaces.UPDATESTOREINFO = domain + 'user/updateStore' + random;

/**
 * 获取门店信息
 */
Interfaces.GETSTOREINFO = domain + 'user/getStoreDetail' + random;

/**
 * 获取产品列表
 */
Interfaces.GETORGANDPRODUCTLIST = domain + 'user/getOrgAndProducts' +random;

module.exports = Interfaces;
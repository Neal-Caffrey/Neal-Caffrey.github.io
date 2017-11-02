"use strict";
const _gol = window || this;
var Mock = {
	"merchantNo": "这里是测试字段merchantNo", // 商户编号
	"merchantName": "这里是测试字段merchantName", // 商户名称
	"merchantNameLocal": "这里是测试字段merchantNameLocal", // 商户当地语言名称
	"tradeingAreaNo": 1, // 商圈编号
	"tradeingAreaName": "这里是测试字段tradeingAreaName", //商圈名称
	"merchantCategoryNo": 1, //商户分类编号
	"merchantCategoryName": "这里是测试字段merchantCategoryName", // 商户分类名称
	"subCategoryNo": 2, // 二级分类编号 
	"subCategoryName": "这里是测试字段subCategoryName", //二级分类名称
	"cityId": 217, //城市ID
	"cityName": "这里是测试字段cityName", //城市名称
	"perConsumerPrice": "这里是测试字段perConsumerPrice", //人均消费
	"merchantAddress": "这里是测试字段merchantAddress", // 商户地址
	"merchantAddressLocal": "这里是测试字段merchantAddressLocal", // 商户当地语言地址
	"businessTime": "这里是测试字段businessTime", // 营业时间
	"contactAreaCode": "86", // 联系电话区号
	"contactTelNo": "18600862042", // 联系电话
	"parkInfo": "这里是测试字段parkInfo", // 停车信息
	"merchantInfo": "这里是测试字段merchantInfo", // 商户简介
	"fxMerchantTagList": [
		'标签1',
		'标签2',
		'gjsdlkflgjfdklgkdfgiufdghidfgkfjjgfdgjfdkgjjkgjfdlgjdflgjdfklgjdfklgjdfklgjkdfghfdijghfdkjghkjfdgfgjsdlkflgjfdklgkdfgiufdghidfgkfjjgfdgjfdkgjjkgjfdlgjdflgjdfklgjdfklgjdfklgjkdfghfdijghfdkjghkjfdgf'
	], // 商户标签
	"guidePerfitInfo": "赚¥500", // 司导收入信息，           例如：赚¥500           feeRateGuide //司导返佣比例  serviceGuidePrice//司导费用
	"preMinute": 150, // preMinute 提前预定时间，分钟
	"lng": 8, // 经度
	"lat": 45, // 纬度
	"merchantPicUrl": "这里是测试字段merchantPicUrl", // 商户图片
	"merchantPicList": [
		'http://image.didatravel.com/Image/JP/5461/Guestroom/3078411_30_b.jpg',
		'http://image.didatravel.com/Image/JP/5461/Guestroom/3078411_30_b.jpg',
		'http://image.didatravel.com/Image/JP/5461/Guestroom/3078411_29_b.jpg',
		'http://image.didatravel.com/Image/JP/5461/Guestroom/3078411_28_b.jpg',
		'http://mt1.google.cn/vt/lyrs=m@142&hl=zh-CN&gl=cn&x=227&y=101&z=8&s=Galil',
		'http://image.didatravel.com/Image/JP/5461/Featured%20Image/3078411_2_b.jpg'
	], // 商户图片列表
	"merchantDetail": "这里是测试字段merchantDetail", //商户详情
	"fxMerchantConf": {
		/**
		 *  商户号
		 */
		"merchantNo": "4567897979",

		/**
		 *  商户名称
		 */
		"merchantName": "这里是测试字段merchantName",

		/**
		 *  人均消费
		 */
		"perConsumerPrice": "这里是测试字段perConsumerPrice",

		/**
		 *  开启订座标识
		 */
		"seatOpenFlag": "这里是测试字段seatOpenFlag",

		/**
		 *  开始预定人数
		 */
		"startSeatNum": 2,

		/**
		 *  结束预定人数
		 */
		"endSeatNum": 20,

		/**
		 *  是否支付定金
		 */
		"openDepositFlag": 1,

		/**
		 *  需支付定金金额
		 */
		"depositPerPrice": 200,

		/**
		 *  二次确认
		 */
		"reConfirm": 1,

		/**
		 *  提起预定时间 分钟
		 */
		"preMinute": 150,

		/**
		 *  最远可定
		 */
		"maxDay": 12,

		/**
		 *  可定开始时间点
		 */
		"startHour": 1,

		/**
		 *  结束时间点
		 */
		"endHour": 23,

		/**
		 *  免费 服务费 商户返佣
		 */
		"saleType": 3,

		/**
		 *  服务费每位
		 */
		"servicePerPrice": 100,

		/**
		 *  司导费用
		 */
		"serviceGuidePrice": "这里是测试字段serviceGuidePrice",

		/**
		 *  供应商费用
		 */
		"serviceProviderPrice": "这里是测试字段serviceProviderPrice",

		/**
		 *  皇包车价格
		 */
		"serviceHbcPrice": "这里是测试字段serviceHbcPrice",

		/**
		 *  商户返佣比例
		 */
		"feeRateMerchant": "这里是测试字段feeRateMerchant",

		/**
		 *  司导返佣比例
		 */
		"feeRateGuide": "这里是测试字段feeRateGuide",

		/**
		 *  供应商返佣比例
		 */
		"feeRateProvider": "这里是测试字段feeRateProvider",

		/**
		 *  皇包车返佣比例
		 */
		"feeRateHbc": "这里是测试字段feeRateHbc",

		/**
		 *  创建时间
		 */
		"createTime": "2017-06-18 12:00:00",

		/**
		 *  更新时间
		 */
		"updateTime": "2017-06-19 12:00:00",
	}
}

if (typeof define === "function" && define.amd) define(function() {
	return Mock
});
else if (typeof exports === "object") module.exports = Mock;
else _gol.Mock = Mock;
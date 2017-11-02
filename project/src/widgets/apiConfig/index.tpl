/**
 * Created by Gorden on 16/6/2.
 */
const MODIFYHOST = ((domain)=>{
  let reg = /www-dev|localhost/;
  let isDemo = reg.test(domain);
  if(isDemo){
    return "<%- domainHost %>"
    //白费：妈的不能跨域
    //return "//szgl.dev.yundijie.com/"
  }else{
    return "/"
  }
})(document.domain)
module.exports = {
  "domainHost": MODIFYHOST,
  "subRoot": "/webapp",
  "apiHost": MODIFYHOST,
  'frHost': '<%- frHost %>',
  'openApiHost': '<%- openApiHost %>',
  'wxPay': '<%- openApiHost %>gateway/v1.0/web/wchat/oauthUrl',
  'alipay': MODIFYHOST+'trade/v1.0/c/pay/getwappayurl',
  'toPay': '<%- pay %>', // 支付
  'cdnHost' : '<%- cdnHost %>',
  "wxAuth": "<%- wxAuth %>",
  "wxAppId": "<%- wxAppId %>",
  "getWxData" : "<%- wxApiHost %>/marketing/v1.0/e/openapi/shares/conf", // 获取微信配置
  "captcha": "<%- openApiHost %>/file/v1.0/captcha",
  'storagePrefix': '<%- storagePrefix %>', // storage前缀
  'appInfo' : MODIFYHOST+'api/index/v1.1/info',
  'hotelSearch' : MODIFYHOST+'api/hotel/v1.0/list',
  'hotelDestination' : MODIFYHOST+'api/search/v1.0/hotel/destination',
  'hotelKeyword' : MODIFYHOST+'api/search/v1.0/hotel/bykeyword',
  'hotelHot' : MODIFYHOST+'api/search/v1.0/hotel/hotcitys',
  'orderAdd' : MODIFYHOST+'api/hotel/v1.0/order/add',
  'aliPay' : MODIFYHOST+'api/pay/v1.0/hotel/alipay',
  'accountPay' : MODIFYHOST+'api/pay/v1.0/hotel/accountpay',
  'canOrder' : MODIFYHOST+'api/hotel/v1.0/order/cancel',
  'editPassword' : MODIFYHOST+'api/account/v1.0/operator/resetpwd',
  'orderDetail': MODIFYHOST+'api/hotel/v1.0/order/detail',
  'orderList': MODIFYHOST+'api/hotel/v1.0/order/list',
  'hotelDetail': MODIFYHOST+'api/hotel/v1.0/detail',
  'getRoomPrice': MODIFYHOST+'api/price/v1.1/hotel',
  'checkRoomPrice': MODIFYHOST+'api/price/v1.1/confirmHotelQuote',
  'updateOrder' : MODIFYHOST+'api/hotel/v1.0/order/update',
  'countryHotel' : MODIFYHOST+'api/search/v1.0/hotel/countries',
  'indexMenu': MODIFYHOST+'api/index/v1.0/menu',
  'cateringOrder': MODIFYHOST+'api/distribution/v1.0/order/submitFxOrder',
  'cateringDetail': MODIFYHOST+'api/distribution/v1.0/merchant/detail',
  'cateringCity': MODIFYHOST+'api/distribution/v1.0/base/citys',
  'cateringOrderDetail': MODIFYHOST+'api/distribution/v1.0/order/detail',//餐厅订单详情
  'cateringTicketPrice': MODIFYHOST+'api/distribution/v1.0/order/update',//餐厅订单修改票面价
  'fxAccountPay': MODIFYHOST+'api/distribution/v1.0/fx/accountpay', // 账户支付
  'fxCanOrder' : MODIFYHOST+'api/distribution/v1.0/order/cancel', // 取消订单
  'fxAliPay': MODIFYHOST+'api/distribution/v1.0/fx/alipay', // 支付宝支付
  'cateringOrderList': MODIFYHOST+'api/distribution/v1.0/order/list', // 订座订单列表
  'cateringOrderCount': MODIFYHOST+'api/distribution/v1.0/order/count', // 订座数量统计
  'logout' : MODIFYHOST+'cloud/logout',
  'error' : MODIFYHOST+'api/test/error',
  'cateringCitys' : MODIFYHOST+'api/distribution/v1.0/base/citys',
  'cateringType' : MODIFYHOST+'api/distribution/v1.0/base/querySubMerchantCategoryList',
  'cateringDistrict' : MODIFYHOST+'api/distribution/v1.0/base/queryCityBusinessDistrictList',
  'cateringTags' : MODIFYHOST+'api/distribution/v1.0/merchant/tags',
  'cateringList' : MODIFYHOST+'api/distribution/v1.0/merchant/list',
  //司兼导包车
  'hottestCity' : MODIFYHOST+'api/search/v1.0/hottest',//热门城市
  'byinitial' : MODIFYHOST+'api/search/v1.0/byinitial',//根据首字母查询城市
  'queryCityRoute' : MODIFYHOST+'api/search/v1.0/queryCityRoute',//地理围栏
  'searchDailyStartCitys' :MODIFYHOST+'api/search/v1.0/dailyStartCitys',//搜索开始城市
  'queryCityScopes' : MODIFYHOST+'api/search/v1.0/queryCityRoute',//查询城市范围
  'dailyDistance' : MODIFYHOST+'api/search/v1.0/daily/distance',//包车每日行程距离
  'airportPickupPrice' : MODIFYHOST+'api/price/v1.0/airportPickupPrice', //接机查价
  'airportTransferPrice' : MODIFYHOST+'api/price/v1.0/airportPickupPrice', //送机查价
  'searchPlace' : MODIFYHOST+'api/search/v1.0/places', //地址搜索 POI
  'searchGroups' : MODIFYHOST + 'api/search/v1.0/dailyCityGroups',//周边城市
  'searchFlightNo' : MODIFYHOST + 'api/search/v1.0/flightNos',//搜索航班号
  'searchFlight' : MODIFYHOST + 'api/search/v1.0/flights',//搜索航班号
  'searchPassCityAirPort' : MODIFYHOST + 'api/search/v1.0/passCityAirports',//搜素城市圈中的机场
  'searchCitiesOfPassCity': MODIFYHOST + 'api/search/v1.0/serviceCitiesOfPassCity',//查询可途径服务城市
  'searchDailyCarList' : MODIFYHOST + 'api/price/v1.0/batchPrice',//组合单查价
  'setFill' : MODIFYHOST + 'api/cache/v1.0/setDailyData',//缓存数据
  'getFill' : MODIFYHOST + 'api/cache/v1.0/getDailyData',//缓存数据
  'searchPickupPrice' : MODIFYHOST + 'api/price/v1.0/airportPickupPrice',//接机查价
  'searchDropoffPrice' : MODIFYHOST + 'api/price/v1.0/airportTransferPrice',//送机查价
  'getCityScopes' : MODIFYHOST + 'api/search/v1.0/daily/distance',//查询城市范围
  'searchPathByPos' : MODIFYHOST + 'api/search/v1.0/direction',//根据经纬度查路线
  'addDailyOrder' : MODIFYHOST + 'api/order/v1.0/addGroupOrder',//组合单下单
  "storageKey": {
    'hotel_list_date': '<%- storagePrefix %>list-date',
    'hotel_detail_data': '<%- storagePrefix %>detail-data',
    'hotel_app_info': '<%- storagePrefix %>app-info'
  },
  'upload': MODIFYHOST+'api/file/v1.0/upload',//填单页上传PDF文件
  'fileHost': '<%- fileHost%>',
  'cancelTips': MODIFYHOST+'api/hotel/v1.0/order/cancelTips',//酒店取消订单，扣款说明
  'operators': MODIFYHOST+'api/account/v1.0/operators',//操作员列表
  'updatePassword': MODIFYHOST+'api/account/v1.0/operator/resetpwd',//修改操作员密码
  'updateAggents': MODIFYHOST+'api/account/v1.0/operator/update ',//修改操作员信息
  'addAggents': MODIFYHOST+'api/account/v1.0/operator/add ',//添加操作员
  'myAccount': MODIFYHOST+'api/account/v1.0/operator/mine',//我的账户
  'ossToken': '<%- api7Host %>passport/v1.0/ossToken', // 阿里云上传，获取oss token
  'editWatermarkImg': MODIFYHOST + 'api/settle/v1.0/editWatermarkImg',  // 上传水单
  'sendWatermarkImg': MODIFYHOST + 'api/settle/v1.0/sendWatermarkImg',  // 发送水单
  'createBills': MODIFYHOST + 'api/bills/v1.0/createBills',  // 创建发票
  'updateBills': MODIFYHOST + 'api/bills/v1.0/updateBills',  // 更新发票
  'invoiceShenQing': MODIFYHOST + 'api/bills/v1.0/billsOrderList', //发票申请
  'invoiceList': MODIFYHOST + 'api/bills/v1.0/billsList', //发票查询
  'billList': MODIFYHOST + 'api/settle/v1.0/sbills',//账单结算列表
  'billDetail': MODIFYHOST + 'api/settle/v1.0/sbill',//账单结算详情
  'billSearch': MODIFYHOST + 'api/settle/v1.0/sorders',//账单结算详情
  'viewInvoice': MODIFYHOST + 'api/bills/v1.0/viewBills', //查看发票信息
  'guideIndex': MODIFYHOST + 'api/guide/v1.0/personalInfo',//司导个人页
  'guideIndexComment': MODIFYHOST + 'api/guide/v1.0/comments',//司导个人页评论列表
  // 妙计
  'tripOrderList': MODIFYHOST + 'api/dz/v1.0/order/route/list', // 行程列表
  'tripDetail': MODIFYHOST + 'api/dz/v1.0/order/route/detail', // 行程详情
  'updateDetail': MODIFYHOST + 'api/dz/v1.0/order/route/update', // 更新行程信息
  'payAirAlipay': MODIFYHOST + 'api/dz/v1.0/order/ticket/pay', // 妙计机票支付
  'updateCarUser': MODIFYHOST + 'api/dz/v1.0/suborder/car/update', //更新用车用户信息
  'updateHotelGuest': MODIFYHOST + 'api/dz/v1.0/suborder/hotel/update', // 更新酒店入住人信息
  'updateAirPassenger': MODIFYHOST + 'api/dz/v1.0/suborder/ticket/update', // 更新乘机人信息
  'addOrder': MODIFYHOST + 'api/dz/v1.0/order/route/addOrder', // 下单
}

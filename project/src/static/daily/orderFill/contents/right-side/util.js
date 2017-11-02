import moment from 'moment';
const  getDailyParam = (arr,first,last,flightBrandSign)=>{
    let {orderIndex,pickupVo,cityId,cityName,date,time,startObj} = first;
    startObj = startObj || {};
    let {dropoffVo,priceInfo,endCity,date:lastDate,startCity:lastStartCity} = last;
    let {hasMeal,hasStay,mealPrice,stayPrice,priceWithAddition,pricemark,hasPickup,hasCheckin,additionalServicePrice:{pickupSignPrice,checkInPrice}} = priceInfo;
    let complexType = (()=>{
      if(pickupVo && dropoffVo){
        return 3
      }
      if(pickupVo){
        return 1;
      }
      if(dropoffVo){
        return 2;
      }
      return 0;
    })();
    let mealFlag = hasMeal ? 1 : 0;
    let stayFlag = hasStay ? 1 : 0;
    let pickupFlag = hasPickup ? 1 : 0;
    let checkInFlag = hasCheckin ? 1 : 0;
    let priceChannel = (()=>{
      let res = priceWithAddition
      if(mealFlag == 0){
          res -= mealPrice
      }
      if(stayFlag == 0){
        res -= stayPrice;
      }
      if(pickupFlag === 0){
        res -= (pickupSignPrice || 0);
      }
      if(checkInFlag === 0){
        res -= (checkInPrice || 0)
      }
      return res;
    })();
    let serviceEndObj = (()=>{
      return {
        serviceEndCityid : endCity ? endCity.cityId : lastStartCity.cityId,
        serviceEndCityname : endCity ? endCity.cityName : lastStartCity.cityName
      }
    })()
    // let serviceTime = pickupVo ? `${moment(pickupVo.date).format('YYYY-MM-DD')} ${pickupVo.time}:00`  : `${date} ${time}:00`;
    let serviceTime = `${date} ${time}:00`;
    let startVo = (()=>{
      //todo 接机情况
      if(!pickupVo){
        return {
          startAddress: startObj.placeName, // 出发地地址 // 必填
          startAddressPoi: startObj.placeLat ? `${startObj.placeLat},${startObj.placeLng}` : '', // 出发地点POI //M
          startAddressDetail: startObj.placeAddress, // 出发地详情(上车地点)
        }
      }
      let flightVo = pickupVo.flightVo;
      let flightDestCode = flightVo.arrAirportCode || flightVo.airportCode || '';
      let startAddress = flightVo.arrAirport || flightVo.airportName || '';
      let startAddressPoi = flightVo.arrLocation || flightVo.location || '';
      return {
        startAddress, // 出发地地址 // 必填
        startAddressPoi, // 出发地点POI //M
        startAddressDetail:startAddress, // 出发地详情(上车地点)
      }
    })();
    let desVo = (()=>{
      if(!dropoffVo){
        let city = endCity || lastStartCity;
        return {
          // destAddress: city.cityName, // 目的地address //市内包车O 跨市M
          // destAddressDetail: city.cityName, // 目的地address详情 //市内包车O 跨市M
          destAddressPoi: city.cityLocation, // 目的地POI //市内包车O 跨市M
        }
      }
      let flightVo = dropoffVo.flightVo;
      return {
        // destAddress: flightVo.airportName, // 目的地address //市内包车O 跨市M
        // destAddressDetail: flightVo.airportName, // 目的地address详情 //市内包车O 跨市M
        destAddressPoi: flightVo.airportLocation, // 目的地POI //市内包车O 跨市M
      }
    })();
    let halfDaily = (()=>{
      return (arr.length === 0 && first.cityRoute[0].routeType === '102') ? 1 : 0;
    })();
    let servicePassCitys = (()=>{
      return arr.map((val) => {
        let {startCity,endCity,routeType} = val;
        let city = endCity || startCity;
        let type = 1;
        // let halfType = 1 ;//0：半日包，1：非半日包
        if(routeType === 201)type=2;
        if(routeType === 301)type=3;
        if(routeType === 102){
          type = 0
        }
        return city.cityId+'-1'+'-'+type
      }).join(',')
    })();
    let servicePassDetailList = (()=>{
      return arr.map((item) => {
        let {startCity,endCity,routeType,pickupVo,dropoffVo,cityRoute,date,travelArr} = item;
        let type = 1
        if(routeType === 201)type=2;
        if(routeType === 301)type=3;
        if(routeType === 102)type=0
        let city = endCity || startCity;
        let flight = (pickupVo || dropoffVo);
        let airportCode = flight ? (flight.flightVo.arrAirportCode || flight.flightVo.airportCode || '') : '';
        let airportLocation = flight ? (flight.flightVo.airportLocation || flight.flightVo.arrLocation || '') : '';
        return {
          //行程信息  必填
          cityId:city.cityId ,//结束城市ID 必填
          cityName: city.cityName,//结束城市名
          startCityId:startCity.cityId,//开始城市Id 必填
          startCityName:startCity.cityName, //开始城市名
          days: 1,// 天数
          cityType: type,// 0半日包 1 市内 2 周边 3 其它城市  必填
          airportCode,//包含接送机的时候机场三字节码 当天有接机 必填
          airportLocation,
          scenicDesc : cityRoute[0].routePlaces,
          scopeDesc:cityRoute[0].routeTitle,
          // serviceData : moment(date).format('YYYY-MM-DD'),
          serviceDate : `${date} ${item.time}:00`,
          complexType : pickupVo ? 1 : (dropoffVo ? 2 : ''),
          description: travelArr,
          distanceDesc: item.distanceDesc,
          distance: item.distanceDesc,//为了兼容mis
          dayDesc: item.dayDesc
        }
          
      })
    })();
    let travelRaidersInfo = (()=>{
      let pickupObj,dropoffObj,res = {};
      if(pickupVo){
        let {flightVo,date,time,type} = pickupVo;
        // let serviceTime = type === 0 ? moment(date).format('YYYY-MM-DD HH:mm:ss') : `${first.date} ${time}:00`;
        let serviceTime = `${first.date} ${first.time}:00`;
        let flightDestCode = flightVo.arrAirportCode || flightVo.airportCode || '';
        let flightDestName = flightVo.arrAirport || flightVo.airportName || '';
        let flightDestPoi = flightVo.arrLocation || flightVo.location || '';
        let flightNo = flightVo.flightNo || '';
        let flightArriveTime = flightVo.arrDate ? `${flightVo.arrDate} ${flightVo.arrTime}:00` : '';
        let flightAirportCode = flightVo.depAirportCode ? flightVo.depAirportCode : '';
        let flightFlyTime = flightVo.depDate ? `${flightVo.depDate} ${flightVo.depTime}:00` : '';
        let flightAirportName = flightVo.depAirport ? flightVo.depAirport : '';
        let flightAriportPoi = flightVo.depLocation ? flightVo.depLocation : '';
        let flightAirportBuiding = flightVo.depTerminal ? flightVo.depTerminal : '';
        let flightDestBuilding = flightVo.arrTerminal ? flightVo.arrTerminal : '';
        pickupObj = {
          pickupFlag :pickupFlag,
          serviceTime,
          flightDestCode, // 降落机场三字码 接机必填
          flightDestName, // 降落机场名称 接机必填
          flightDestPoi,//降落机场poi
          flightNo,//接送机必填  @todo 没有航班号
          flightArriveTime,//yyyy-MM-dd HH:mm:ss
          flightAirportCode, // 起飞机场三字码 送机必填
          flightFlyTime,//yyyy-MM-dd HH:mm:ss
          flightAirportName,
          flightAriportPoi,//起飞机场poi
          flightAirportBuiding,
          flightDestBuilding, // 降落机场航站楼
          flightIsCustom : flightNo ? 0 : 1,
          serviceCityName: flightVo.cityName || flightVo.arrCityName,
        }
        if(pickupFlag === 1){
            pickupObj.pickupSignPrice = pickupSignPrice;
        }
        res.pickup = pickupObj;
      }
      if(dropoffVo){
        let {flightVo,date,time,type} = dropoffVo;
        let serviceTime = `${last.date} ${time}:00`;//@todo,包车中的送机
        let flightAirportCode = flightVo.airportCode || '';
        let flightAirportName = flightVo.airportName
        dropoffObj = {
          checkInFlag:checkInFlag,     //是否协助checkin  0 或 1
          serviceTime,//服务开始时间  必填 yyyy-MM-dd HH:mm:ss
          // flightDestCode: "", // 降落机场三字码 接机必填
          // flightDestName: "", // 降落机场名称 接机必填
          // flightDestPoi:"",//降落机场poi
          flightNo: "",//接送机必填
          flightArriveTime: "",//yyyy-MM-dd HH:mm:ss
          flightAirportCode, // 起飞机场三字码 送机必填
          flightFlyTime: "",//yyyy-MM-dd HH:mm:ss
          flightAirportName,
          flightAriportPoi:flightVo.airportLocation,//起飞机场poi
          flightAirportBuiding: "",
          flightDestBuilding: "", // 降落机场航站楼
          serviceCityName: flightVo.cityName
        }
        if(pickupFlag === 1){
            dropoffObj.checkInPrice = checkInPrice;
        }
        res.transfer = dropoffObj;
      }
      return res;
    })();
    let attachmentList = [];
    arr.map((val,oIndex)=>{
      val.bookInfo.map((item,index)=>{
        let newItem = {
          attachmentType: item.bookType,     //协助项类型  1:代订 2:代办 3:代付
          attachmentTypeId: item.bookItemId,  //协助项类型Id  1:酒店 2:
          attachmentTypeName: item.bookItem,   //协助项类型名称
          attachmentName: item.hotelName,    //协助项名称
          attachmentDemand: item.attachmentDemand,   //协助项详细需求
          beginTime: val.date,    //开始时间
          endTime: val.date,     //结束时间
          priceSell: Math.ceil(item.priceSell*item.currencyRate),              //销售价
          priceSellLocal: item.priceSell,          //当地销售价格
          pricePurchase: Math.ceil(item.priceSell*item.currencyRate),          //采购价
          pricePurchaseLocal: item.priceSell,    //当地采购价
          sellRate: item.currencyRate, //价格汇率
          sellCurrency: item.priceType,    //价格币种
          receiptUrl: item.fileObj.uploadFilePath,         //凭证地址
          modifyType:1,          //修改类型 1:单个 2:批量
          remark: item.remark    //备注
        };
        attachmentList.push(newItem);
      })
    });
    let res = {
      index : orderIndex+1,
      complexType,
      mealFlag,
      stayFlag,
      priceChannel,
      serviceCityId : cityId,
      serviceCityName : cityName,
      ...serviceEndObj,
      serviceTime,
      serviceEndTime : `${lastDate} 23:59:59`,
      ...startVo,
      ...desVo,
      pricemark,
      halfDaily,
      servicePassCitys,
      servicePassDetailList,
      totalDays:arr.length,
      travelRaidersInfo,
      //@todo
      isCheckin : checkInFlag,
      // checkInPrice : 0,
      // priceFlightBrandSign: "",//接机举牌费用
      // isFlightSign: 1,//是否举牌接机 1 需要
      isFlightSign : pickupFlag,
      // flightBrandSign: flightBrandSign, // 接机牌 存在机场禁止举接机牌，因此不是必填
      attachmentList
    }
    if(res.mealFlag === 1){
      res.priceMeal = mealPrice;
    }
    if(res.stayFlag === 1){
      res.priceStay = stayPrice;
    }
    if(res.isFlightSign === 1){
      res.priceFlightBrandSign = pickupSignPrice;
      res.flightBrandSign = flightBrandSign;
    }
    if(res.isCheckin === 1){
      res.checkInPrice = checkInPrice;
    }

    return res
  }

const getParentParam = (quoteInfo,formData,agentInfo,demandInfo,serviceObj,pickupInfo)=>{
  let guideLabel = demandInfo.guideTags.join(',');
  if(!formData.realUserMobile){
    formData.realAreaCode = '';
  }
  if(!formData.usermobile_1){
    formData.areacode_1 = '';
  }
  if(!formData.usermobile_2){
    formData.areacode_2 = '';
  }
  let realUserInfo = {   //乘车人信息 为他人下单必填
          name: formData.realUserName,
          areacode: formData.realAreaCode,
          mobile: formData.realUserMobile,
          areaCode2: formData.areacode_1,
          mobile2: formData.usermobile_1,
          areaCode3: formData.areacode_2,
          mobile3: formData.usermobile_2,
          wechatNo: formData.realUserWechat
        }
  if(!formData.realUserName && !formData.realUserMobile){
    realUserInfo = null
  }
  //commission
  let obj = {
    carTypeId: quoteInfo.carType, //车型 如果不是特殊车型必填
    carName: quoteInfo.carDesc,//车型名称
    carSeatNum: quoteInfo.seatType,//车座数 不是特殊车型必填
    carDesc: quoteInfo.carDesc,//车型描述
    carModelId: quoteInfo.carId,//车型idv2 必填
    isSpecialCar: quoteInfo.special, // 必填 是否特殊车型 0 不是 1 是
    capOfLuggage: quoteInfo.capOfLuggage, //行李数最大限制
    orderChannel: agentInfo.agentId,//订单渠道  必填
    orderChannelName: agentInfo.agentName, //渠道名称 必填
    agentId: agentInfo.agentId,  //订单渠道  必填
    agentName: agentInfo.agentName, //渠道名称 必填
    agentOpid: agentInfo.agentUserId,  //操作员id
    agentOpname: agentInfo.agentUserName,  //操作员name
    urgentFlag: quoteInfo.urgentFlag, // 是否急单 必填
    guideLabel: guideLabel,//司导标签
    adultNum: formData.adultNum,//成人数 必填 大于0
    childNum: formData.childNum || 0,//儿童数 大于0
    capOfPerson: quoteInfo.capOfPerson, //可乘坐人数 必填 大于0
    luggageNumber: formData.luggageNumber, //行李数@todo
    childSeatInfo: {//儿童座椅
        childSeatPrice1Count: formData.childSeatNum || 0,   //第一个儿童座椅个数
        childSeatPrice2Count:0   //大于1的儿童座椅个数
    },
    //realSendSms:1,//是否给乘车人发送短信 1 发送
    isRealUser: 2,//1:自己下单 2:为他人下单 为其他人下单必填
    userExInfo: [//下单人信息 必填
      {
        name: formData.userName,//姓名 必填
        areaCode: formData.areaCode,//区号 必填
        mobile: formData.userMobile,//电话 必填
        wechatNo: formData.userWechat,//微信号
      }
    ],
    userRemark: formData.userRemark,//用户备注
    userEmail: agentInfo.agentUserEmail,//下单人email
    priceChannel: serviceObj.priceChannel,//订单价格
    totalDays: serviceObj.totalDays,//订单天数 必填
    serviceCityId: serviceObj.serviceCityId,//服务城市Id 必填
    serviceCityName: serviceObj.serviceCityName,//服务城市名 必填
    serviceTime: serviceObj.serviceTime,//服务开始时间 yyyy-MM-dd HH:mm:ss 必填  如果第一个订单包含接机 填写接机时间
    serviceEndCityid:serviceObj.serviceEndCityid,
    serviceEndCityname:serviceObj.serviceEndCityname,
    serviceEndTime: serviceObj.serviceEndTime,//服务结束时间 yyyy-MM-dd HH:mm:ss 必填
    priceMark: quoteInfo.batchNo,//报价的batchNo
    journeyFilePath: demandInfo.uploadFilePath,  //pdf path
    csRemark: demandInfo.csRemark,
    orderSource:9,
    isFlightSign : pickupInfo.isFlightSign,
    // flightBrandSign: pickupInfo.flightBrandSign,
    thirdTradeNo: formData.thirdTradeNo,
    priceTicket: formData.priceTicket,  //票面价
    bestoneSaleId: agentInfo.bestoneSaleId || '', //百事通id  有就传没有不传
    bestoneId: agentInfo.bestoneId || '',//百事通id  有就传没有不传
  }
  realUserInfo && (obj.realUserExInfo = [
    realUserInfo
  ]);
  if(obj.isFlightSign == 1){
    obj.flightBrandSign = pickupInfo.flightBrandSign
  }
  return obj;
}

const getPickupParam = (pickupList,flightBrandSign)=>{
  if(pickupList.length < 1) return null
  let priceInfo = pickupList[0].priceInfo;
  let priceChannel = priceInfo.additionalServicePrice.pickupSignPrice && priceInfo.hasPickup ? priceInfo.priceWithAddition : priceInfo.price;
  let pickupVo = pickupList[0].pickupVo;
  let attachmentList = [];
  if(pickupList[0].bookInfo.length > 0){
    pickupList[0].bookInfo.map((item,index)=>{
      let newItem = {
        attachmentType: item.bookType,     //协助项类型  1:代订 2:代办 3:代付
        attachmentTypeId: item.bookItemId,  //协助项类型Id  1:酒店 2:
        attachmentTypeName: item.bookItem,   //协助项类型名称
        attachmentName: item.hotelName,    //协助项名称
        attachmentDemand: item.attachmentDemand,   //协助项详细需求
        beginTime: pickupList[0].date,    //开始时间
        endTime: pickupList[0].date,     //结束时间
        priceSell: Math.ceil(item.priceSell*item.currencyRate),              //销售价
        priceSellLocal: item.priceSell,          //当地销售价格
        pricePurchase: Math.ceil(item.priceSell*item.currencyRate),          //采购价
        pricePurchaseLocal: item.priceSell,    //当地采购价
        sellRate: item.currencyRate, //价格汇率
        sellCurrency: item.priceType,    //价格币种
        receiptUrl: item.fileObj.uploadFilePath,         //凭证地址
        modifyType:1,          //修改类型 1:单个 2:批量
        remark: item.remark    //备注
      };
      attachmentList.push(newItem);
    })
  }

  let obj = {
    priceChannel: priceChannel,//订单价格 必填
    priceFlightBrandSign: priceInfo.additionalServicePrice.pickupSignPrice || '',//接机牌价格
    serviceCityId: pickupVo.flightVo.cityId || pickupVo.flightVo.arrCityId,//服务城市Id  必填
    serviceCityName: pickupVo.flightVo.cityName || pickupVo.flightVo.arrCityName,//服务城市名  必填
    serviceTime: moment(pickupVo.date).format('YYYY-MM-DD') + ' '+pickupVo.time + ':00',//服务开始时间  必填 yyyy-MM-dd HH:mm:ss
    serviceEndTime: `${pickupList[0].date} 23:59:59`,//服务结束时间 必填 yyyy-MM-dd HH:mm:ss
    startAddress: pickupVo.flightVo.airportName || pickupVo.flightVo.arrAirport, // 出发地地址 // 必填
    startAddressPoi: pickupVo.flightVo.airportLocation || pickupVo.flightVo.arrLocation, // 出发地点POI //
    startAddressDetail: pickupVo.flightVo.airportName || pickupVo.flightVo.arrAirport, // 出发地详情(上车地点)
    destAddress: pickupVo.placeVo.placeName,// 目的地address // 必填
    destAddressDetail: pickupVo.placeVo.placeAddress, // 目的地address详情 //市内包车O 跨市M
    destAddressPoi: `${pickupVo.placeVo.placeLat},${pickupVo.placeVo.placeLng}`, // 目的地POI //市内包车O 跨市M
    priceMark: priceInfo.pricemark,// 必填
    flightDestCode: pickupVo.flightVo.airportCode || pickupVo.flightVo.arrAirportCode, // 降落机场三字码 必填
    flightDestName: pickupVo.flightVo.airportName || pickupVo.flightVo.arrAirport, // 降落机场名称 必填
    flightNo: pickupVo.flightVo.flightNo || "",// 必填
    flightArriveTime: `${pickupList[0].date} ${pickupVo.time}:00`,// 降落时间 必填 yyyy-MM-dd HH:mm:ss
    flightAirportCode:  '', // 起飞机场三字码
    flightFlyTime: "",//yyyy-MM-dd HH:mm:ss
    flightAirportName: "",
    flightAirportBuiding: "",
    flightDestBuilding: '',// 降落机场航站楼
    distance: pickupVo.lines.distance, // 服务距离  必填
    isArrivalVisa: "",//是否落地签 @todo
    expectedCompTime: pickupVo.lines.duration/60, // 预计服务完成时间 接送次 必填
    // flightBrandSign: flightBrandSign, // 接机牌 存在机场禁止举接机牌，因此不是必填
    isFlightSign: priceInfo.hasPickup ? 1 : 0,//是否举牌接机
    journeyComment: "",//行程描述
    attachmentList: attachmentList,
    flightIsCustom : pickupVo.flightVo.flightNo ? 0 : 1
  }
  if(obj.isFlightSign == 1){
    obj.flightBrandSign = flightBrandSign
  }
  return obj;
}

const getTransParam = (transList)=>{
  if(transList.length < 1) return null;
  let priceInfo = transList[0].priceInfo;
  let priceChannel = priceInfo.additionalServicePrice.checkInPrice && priceInfo.hasCheckin ? priceInfo.priceWithAddition : priceInfo.price;
  let dropoffVo = transList[0].dropoffVo;
  let attachmentList = [];
  if(transList[0].bookInfo > 0){
    transList[0].bookInfo.map((item,index)=>{
      let newItem = {
        attachmentType: item.bookType,     //协助项类型  1:代订 2:代办 3:代付
        attachmentTypeId: item.bookItemId,  //协助项类型Id  1:酒店 2:
        attachmentTypeName: item.bookItem,   //协助项类型名称
        attachmentName: item.hotelName,    //协助项名称
        attachmentDemand: item.attachmentDemand,   //协助项详细需求
        beginTime: transList[0].date,    //开始时间
        endTime: transList[0].date,     //结束时间
        priceSell: Math.ceil(item.priceSell*item.currencyRate),              //销售价
        priceSellLocal: item.priceSell,          //当地销售价格
        pricePurchase: Math.ceil(item.priceSell*item.currencyRate),          //采购价
        pricePurchaseLocal: item.priceSell,    //当地采购价
        sellRate: item.currencyRate, //价格汇率
        sellCurrency: item.priceType,    //价格币种
        receiptUrl: item.fileObj.uploadFilePath,         //凭证地址
        modifyType:1,          //修改类型 1:单个 2:批量
        remark: item.remark    //备注
      };
      attachmentList.push(newItem);
    })
  }

  let obj = {
    priceChannel: priceChannel,//订单价格 必填
    checkInPrice: priceInfo.additionalServicePrice.checkInPrice || '',//接机牌价格
    serviceCityId: dropoffVo.flightVo.cityId,//服务城市Id  必填
    serviceCityName: dropoffVo.flightVo.cityName,//服务城市名  必填
    serviceTime: moment(dropoffVo.date).format('YYYY-MM-DD') + ' '+dropoffVo.time + ':00',//服务开始时间  必填 yyyy-MM-dd HH:mm:ss
    serviceEndTime: `${transList[0].date} 23:59:59`,//服务结束时间 必填 yyyy-MM-dd HH:mm:ss
    startAddress: dropoffVo.placeVo.placeName, // 出发地地址 // 必填
    startAddressPoi: `${dropoffVo.placeVo.placeLat},${dropoffVo.placeVo.placeLng}`, // 出发地点POI //
    startAddressDetail: dropoffVo.placeVo.placeAddress, // 出发地详情(上车地点)
    destAddress: dropoffVo.flightVo.airportName,// 目的地address // 必填
    destAddressDetail: dropoffVo.flightVo.airportName, // 目的地address详情 //市内包车O 跨市M
    destAddressPoi: dropoffVo.flightVo.airportLocation, // 目的地POI //市内包车O 跨市M
    priceMark: priceInfo.pricemark,// 必填
    flightDestCode: '', // 降落机场三字码 必填
    flightDestName: '', // 降落机场名称 必填
    flightNo: dropoffVo.flightVo.flightNo || "",// 必填
    flightArriveTime: '',// 降落时间 必填 yyyy-MM-dd HH:mm:ss
    flightAirportCode: dropoffVo.flightVo.airportCode, // 起飞机场三字码
    flightFlyTime: `${transList[0].date} ${dropoffVo.time}:00`,//yyyy-MM-dd HH:mm:ss
    flightAirportName: dropoffVo.flightVo.airportName,
    flightAirportBuiding: "",
    flightDestBuilding: '',// 降落机场航站楼
    distance: dropoffVo.lines.distance, // 服务距离  必填
    expectedCompTime: dropoffVo.lines.duration/60, // 预计服务完成时间 接送次 必填
    isCheckin: priceInfo.hasCheckin ? 1 : 0,//是否协助checkin
    journeyComment: "",//行程描述
    attachmentList: attachmentList
  }
  return obj
}

export {getDailyParam,getParentParam,getPickupParam,getTransParam}

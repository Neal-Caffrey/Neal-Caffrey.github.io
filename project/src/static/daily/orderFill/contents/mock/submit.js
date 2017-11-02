{
    parent:{ //父单 必填orderType
        carId:"";//车ID 指定司导下单必填
        carTypeId:3//车型 如果不是特殊车型必填
        carName:"",//车型名称
        carSeatNum:"",//车座数 不是特殊车型必填
        carDesc:"",//车型描述
        carModelId;//车型idv2 必填
        isSpecialCar:1// 必填 是否特殊车型 0 不是 1 是
        capOfLuggage;//行李数最大限制
        orderChannel:"",//订单渠道  必填
        orderChannelName;//渠道名称 必填
        agentId:1231123,  //订单渠道  必填
        agentName:1231123, //渠道名称 必填
        agentOpid:1231123,  //操作员id
        agentOpname:1231123,  //操作员name
        urgentFlag; // 是否急单 必填
        guideLabel;//司导标签
        adultNum:1,//成人数 必填 大于0
        childNum:"",//儿童数 大于0
        capOfPerson:10//可乘坐人数 必填 大于0
        luggageNumber:0//行李数
        childSeatInfo: {//儿童座椅
            childSeatPrice1:1.0, //第一个儿童座椅价格
            childSeatPrice2:2.1, //大于1的儿童座椅价格
            childSeatPrice1Count:1,   //第一个儿童座椅个数
            childSeatPrice2Count:2   //大于1的儿童座椅个数
        },
        //realSendSms:1,//是否给乘车人发送短信 1 发送
        isRealUser:2,//1:自己下单 2:为他人下单 为其他人下单必填
        userExInfo: [//下单人信息 必填
            {
                name:"",//姓名 必填
                areaCode:"",//区号 必填
                mobile:"",//电话 必填
                wechatNo:"",//微信号
            }
        ],
        realUserExInfo:[
            {   //乘车人信息 为他人下单必填
                "name":"乘车人",
                "areacode":"86",
                "mobile":"17888825946",
                "areaCode2":"86",
                "mobile2":"17888825946",
                "areaCode3":"86",
                "mobile3":"17888825946",
                "wechatNo":"17888825946"
            }
        ],
        userRemark:"",//用户备注
        userEmail:"",//下单人email
        priceChannel:1.2,//订单价格
        totalDays:1//订单天数 必填
        serviceCityId:"",//服务城市Id 必填
        serviceCityName:"",//服务城市名 必填
        serviceTime:"",//服务开始时间 yyyy-MM-dd HH:mm:ss 必填  如果第一个订单包含接机 填写接机时间
        serviceEndTime:"",//服务结束时间 yyyy-MM-dd HH:mm:ss 必填
        priceMark:"",//报价的batchNo
        serviceAddressTel:"",// 目的地酒店或者区域电话号码
        serviceAreaCode:"",// 目的地区号
        journeyFilePath:"",  //pdf path
        "csRemark":"给司导捎句话",
        "orderSource":9,
        "thirdTradeNo":"第三方订单号（团号）",
        "priceTicket":"1227",  //票面价
        "bestoneSaleId":123123123, //百事通id  有就传没有不传
        "bestoneId":123,//百事通id  有就传没有不传
    },
    pickupList:[//接机订单列表
        {
            priceChannel: ,//订单价格 必填
            priceFlightBrandSign: 12,//接机牌价格
            serviceCityId: 1,//服务城市Id  必填
            serviceCityName: "",//服务城市名  必填
            serviceTime: "",//服务开始时间  必填 yyyy-MM-dd HH:mm:ss
            serviceEndTime: "",//服务结束时间 必填 yyyy-MM-dd HH:mm:ss
            startAddress: "", // 出发地地址 // 必填
            startAddressPoi: "", // 出发地点POI //
            startAddressDetail: "", // 出发地详情(上车地点)
            destAddress: "",// 目的地address // 必填
            destAddressDetail: "", // 目的地address详情 //市内包车O 跨市M
            destAddressPoi: "", // 目的地POI //市内包车O 跨市M
            priceMark: "",// 必填
            flightDestCode: "", // 降落机场三字码 必填
            flightDestName: "", // 降落机场名称 必填
            flightNo: "",// 必填
            flightArriveTime: "",// 降落时间 必填 yyyy-MM-dd HH:mm:ss
            flightAirportCode:"" , // 起飞机场三字码
            flightFlyTime: "",//yyyy-MM-dd HH:mm:ss
            flightAirportName: "",
            flightAirportBuiding: "",
            flightDestBuilding: , ""// 降落机场航站楼
            distance: 1, // 服务距离  必填
            isArrivalVisa: "",//是否落地签
            expectedCompTime: "", // 预计服务完成时间 接送次 必填
            isFlightSign: "",//是否举牌接机
            flightBrandSign: "", // 接机牌 存在机场禁止举接机牌，因此不是必填
            journeyComment: "",//行程描述
            childSeatInfo: {//儿童座椅
                childSeatPrice1:1.0,
                childSeatPrice2:2.1,
                childSeatPrice1Count:1,
                childSeatPrice2Count:2
            },
            attachmentList:[
                {
                    "attachmentType":1,     //协助项类型  1:代订 2:代办 3:代付
                    "attachmentTypeId":"1",  //协助项类型Id  1:酒店 2:
                    "attachmentTypeName":"酒店",   //协助项类型名称
                    "attachmentName":"酒店名称",    //协助项名称
                    "attachmentDemand":"房间要求",   //协助项详细需求
                    "beginTime":"2017-09-08",    //开始时间
                    "endTime":"2017-09-08",     //结束时间
                    "priceSell":0,              //销售价
                    "priceSellLocal":0,          //当地销售价格
                    "pricePurchase":0,          //采购价
                    "pricePurchaseLocal":0,    //当地采购价
                    "sellRate":"0.061",      //价格汇率
                    "sellCurrency":"JPY",    //价格币种
                    "receiptUrl":"",         //凭证地址
                    "modifyType":1,          //修改类型 1:单个 2:批量
                    "remark":"备注备注备注"    //备注
                },
                {
                    "attachmentType":3,   //协助项类型  1:代订 2:代办 3:代付
                    "attachmentTypeId":"1",
                    "attachmentTypeName":"酒店",
                    "attachmentName":"备注备注备注",
                    "attachmentDemand":"备注备注备注",
                    "beginTime":"2017-09-08",
                    "endTime":"2017-09-08",
                    "priceSell":76,
                    "priceSellLocal":"1231",
                    "pricePurchase":76,
                    "pricePurchaseLocal":"1231",
                    "sellRate":"0.061",
                    "sellCurrency":"JPY",
                    "receiptUrl":"",
                    "modifyType":1,
                    "remark":"备注备注备注"
                },
                {
                    "attachmentType":2,   //协助项类型  1:代订 2:代办 3:代付
                    "attachmentTypeId":"1",
                    "attachmentTypeName":"酒店",
                    "attachmentName":"123",
                    "attachmentDemand":"123",
                    "beginTime":"2017-09-05",
                    "endTime":"2017-09-05",
                    "priceSell":0,
                    "priceSellLocal":0,
                    "pricePurchase":0,
                    "pricePurchaseLocal":0,
                    "sellRate":"0.061",
                    "sellCurrency":"JPY",
                    "receiptUrl":"",
                    "modifyType":1,
                    "remark":"123"
                }
            ]
         }
    ],
    dailyList:[//日租订单列表
        {
            complexType: 1,//0 默认只 1 包含接机 2 包含送机 3 接机和送机 必填
            "mealFlag":1,   //是否包含餐补
            "stayFlag":0,   //是否包含住宿补助
            priceChannel: 1,//订单价格  必填
            serviceCityId: 1,//服务城市Id 必填
            serviceCityName: "",//服务城市名 必填
            serviceEndCityid: 1,//服务结束城市ID 必填
            serviceEndCityname: "",//服务结束城市Id 必填
            serviceTime: "",//服务开始时间  必填 yyyy-MM-dd HH:mm:ss
            serviceEndTime: "",//服务结束时间  必填 yyyy-MM-dd HH:mm:ss
            startAddress: "", // 出发地地址 // 必填
            startAddressPoi: "", // 出发地点POI //M
            startAddressDetail: "", // 出发地详情(上车地点)
            destAddress: "", // 目的地address //市内包车O 跨市M
            destAddressDetail: "", // 目的地address详情 //市内包车O 跨市M
            destAddressPoi: "", // 目的地POI //市内包车O 跨市M
            priceMark: "",// 必填
            halfDaily: 1, // 是否半日包车 0:不是半日包车 1:是半日包车 // 必填
            servicePassCitys: "",// 途经城市291-1-3,292-1-3,287-1-3 :城市id-1-类型  类型：1 市内 2 周边 3 其它城市  // 必填
            servicePassDetailList: [{//行程信息  必填
                cityId:1 ,//结束城市ID 必填
                cityName: "",//结束城市名
                startCityId:2,//开始城市Id 必填
                startCityName:"", //开始城市名
                days: 1,// 天数
                cityType: 1,// 0半日包 1 市内 2 周边 3 其它城市  必填
                airportCode:"",//包含接送机的时候机场三字节码 当天有接机 必填
                description: "",//行程安排
                distance: "",
            }],
            totalDays: 1,//订单天数  必填
            userRemark: "", // 客人备注
            priceHotel: 1, // 酒店总费用
            hotelRoom: 1, // 房间数
            hotelDays: 1, // 几晚
            childSeatInfo: {//儿童座椅
                childSeatPrice1:1.0,
                childSeatPrice2:2.1,
                childSeatPrice1Count:1,
                childSeatPrice2Count:2
            },
            travelRaidersInfo: {
                pickup: {
                    serviceTime: "",//服务开始时间  必填 yyyy-MM-dd HH:mm:ss
                    flightDestCode: "", // 降落机场三字码 接机必填
                    flightDestName: "", // 降落机场名称 接机必填
                    flightDestPoi:"",//降落机场poi
                    flightNo: "",//接送机必填
                    flightArriveTime: "",//yyyy-MM-dd HH:mm:ss
                    flightAirportCode: "", // 起飞机场三字码 送机必填
                    flightFlyTime: "",//yyyy-MM-dd HH:mm:ss
                    flightAirportName: "",
                    flightAriportPoi:"",//起飞机场poi
                    flightAirportBuiding: "",
                    flightDestBuilding: "", // 降落机场航站楼
                },
                transfer: {
                    serviceTime: "",//服务开始时间  必填 yyyy-MM-dd HH:mm:ss
                    flightDestCode: "", // 降落机场三字码 接机必填
                    flightDestName: "", // 降落机场名称 接机必填
                    flightDestPoi:"",//降落机场poi
                    flightNo: "",//接送机必填
                    flightArriveTime: "",//yyyy-MM-dd HH:mm:ss
                    flightAirportCode: "", // 起飞机场三字码 送机必填
                    flightFlyTime: "",//yyyy-MM-dd HH:mm:ss
                    flightAirportName: "",
                    flightAriportPoi:"",//起飞机场poi
                    flightAirportBuiding: "",
                    flightDestBuilding: "", // 降落机场航站楼
                }
            },
            isCheckin = 0: ,//1需要  协助checkin
            checkInPrice: 1, // 帮办理登机手续
            priceFlightBrandSign: "",//接机举牌费用
            isFlightSign: 1,//是否举牌接机 1 需要
            flightBrandSign: "", // 接机牌 存在机场禁止举接机牌，因此不是必填
            attachmentList:[
                {
                    "attachmentType":1,
                    "attachmentTypeId":"1",
                    "attachmentTypeName":"酒店",
                    "attachmentName":"酒店名称",
                    "attachmentDemand":"房间要求",
                    "beginTime":"2017-09-08",
                    "endTime":"2017-09-08",
                    "priceSell":0,
                    "priceSellLocal":0,
                    "pricePurchase":0,
                    "pricePurchaseLocal":0,
                    "sellRate":"0.061",
                    "sellCurrency":"JPY",
                    "receiptUrl":"",
                    "modifyType":1,
                    "remark":"备注备注备注"
                },
                {
                    "attachmentType":3,
                    "attachmentTypeId":"1",
                    "attachmentTypeName":"酒店",
                    "attachmentName":"备注备注备注",
                    "attachmentDemand":"备注备注备注",
                    "beginTime":"2017-09-08",
                    "endTime":"2017-09-08",
                    "priceSell":76,
                    "priceSellLocal":"1231",
                    "pricePurchase":76,
                    "pricePurchaseLocal":"1231",
                    "sellRate":"0.061",
                    "sellCurrency":"JPY",
                    "receiptUrl":"",
                    "modifyType":1,
                    "remark":"备注备注备注"
                }
            ]
        }
    ],
    transList:[//送机子单列表
        {
            childSeatInfo{//儿童座椅
                childSeatPrice1:1.0,
                childSeatPrice2:2.1,
                childSeatPrice1Count:1,
                childSeatPrice2Count:2
            },
            priceChannel: 1,//订单价格 必填
            serviceCityId: 1,//服务城市Id 必填
            serviceCityName: "",//服务城市名 必填
            serviceTime: "",//服务开始时间 必填 yyyy-MM-dd HH:mm:ss
            serviceEndTime: "",//服务结束时间 必填 yyyy-MM-dd HH:mm:ss
            startAddress: "", // 出发地地址  必填
            startAddressPoi: "", // 出发地点POI
            startAddressDetail: "", // 出发地详情(上车地点)
            destAddress: "", // 目的地address  必填
            destAddressDetail: "", // 目的地address详情 M
            destAddressPoi: "", // 目的地POI
            priceMark: "",// 必填
            flightDestCode: "", // 降落机场三字码
            flightDestName: "", // 降落机场名称
            flightNo: "",// 必填
            flightArriveTime: "",//落地时间 yyyy-MM-dd HH:mm:ss
            flightAirportCode: "", // 起飞机场三字码 必填
            flightFlyTime: "",//  必填 yyyy-MM-dd HH:mm:ss
            flightAirportName: "",//
            flightAirportBuiding: "",// 必填 起飞机场航站楼
            flightDestBuilding: "", // 降落机场航站楼
            isCheckin : 0,//1 需要
            checkInPrice: , // 帮办理登机手续
            expectedCompTime: 1, // 预计服务完成时间 接送次 必填
            distance: 1, // 服务距离  必填
            attachmentList:[
                {
                    "attachmentType":1,
                    "attachmentTypeId":"1",
                    "attachmentTypeName":"酒店",
                    "attachmentName":"酒店名称",
                    "attachmentDemand":"房间要求",
                    "beginTime":"2017-09-08",
                    "endTime":"2017-09-08",
                    "priceSell":0,
                    "priceSellLocal":0,
                    "pricePurchase":0,
                    "pricePurchaseLocal":0,
                    "sellRate":"0.061",
                    "sellCurrency":"JPY",
                    "receiptUrl":"",
                    "modifyType":1,
                    "remark":"备注备注备注"
                },
                {
                    "attachmentType":3,
                    "attachmentTypeId":"1",
                    "attachmentTypeName":"酒店",
                    "attachmentName":"备注备注备注",
                    "attachmentDemand":"备注备注备注",
                    "beginTime":"2017-09-08",
                    "endTime":"2017-09-08",
                    "priceSell":76,
                    "priceSellLocal":"1231",
                    "pricePurchase":76,
                    "pricePurchaseLocal":"1231",
                    "sellRate":"0.061",
                    "sellCurrency":"JPY",
                    "receiptUrl":"",
                    "modifyType":1,
                    "remark":"备注备注备注"
                }
            ]
        }     
    ]
｝
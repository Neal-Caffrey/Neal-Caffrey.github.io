"use strict";
const _gol = window || this;
var Mock = {
	confireFaild:{
	    "data":{
	        "confirmQuoteId":"DHB170414154702858",
	        "confrimValue":"0",
	        "quoteValue":"1",
	        "status":4
	    },
	    "status":200
	},
	confireOk:{
	    "data":{
	        "confirmQuoteId":"DHB170414184220987",
	        "lastPayTime":"2017-04-14 19:02:20",
	        "status":0
	    },
	    "status":200
	},
	hotelBase: {
		"hotelDescription": {
			"description": "<p><b>出行提示</b> <br /><ul>  <li>17 岁及以下的儿童如果与父母或监护人同住一房并使用现有床铺，可免费入住。</li><li>旅客可以使用预订确认信息上的联系方式直接与酒店联系，协商有关携带宠物的事宜（需要收费，可以在“费用\"部分找到具体收费事宜）。</li>  </ul></p><p><b>费用</b> <br /><p>以下费用和押金由酒店在提供服务、办理入住或退房手续时收取。</p> <ul>         <li>宠物费：每间住处 USD25，（每次住宿最多 USD150）</li>      <li>现金押金：每次住宿 USD 100</li>       </ul> <p>上面所列内容可能并不完整。这些费用和押金可能不包括税款，并且可能会随时发生变化。</p></p>",
		},
		"hotelFacilities": [{
			"description": "电梯",
			"descriptionEn": "Elevator/lift",
			"hotelId": 10000001,
			"type": 10
		}, {
			"description": "房间总数 -103",
			"descriptionEn": "Total number of rooms - 103",
			"hotelId": 10000001,
			"type": 10
		}, {
			"description": "楼层数 -3",
			"descriptionEn": "Number of floors - 3",
			"hotelId": 10000001,
			"type": 10
		}, {
			"description": "洗衣设施",
			"descriptionEn": "Laundry facilities",
			"hotelId": 10000001,
			"type": 10
		}, {
			"description": "免费早餐",
			"descriptionEn": "Free breakfast",
			"hotelId": 10000001,
			"type": 10
		}, {
			"description": "前台保险箱",
			"descriptionEn": "Safe-deposit box at front desk",
			"hotelId": 10000001,
			"type": 10
		}, {
			"description": "前台限时服务",
			"descriptionEn": "Front desk (limited hours)",
			"hotelId": 10000001,
			"type": 10
		}, {
			"description": "免费 Wi-Fi",
			"descriptionEn": "Free WiFi",
			"hotelId": 10000001,
			"type": 10
		}, {
			"description": "建造年份：1999",
			"descriptionEn": "Year Built1999",
			"hotelId": 10000001,
			"type": 10
		}, {
			"description": "免费自助停车设施",
			"descriptionEn": "Free self parking",
			"hotelId": 10000001,
			"type": 10
		}],
		"hotelImages": [{
			"hotelId": 10000001,
			"imageOrder": 2,
			"imageUrl": "http://image.didatravel.com/Image/US/804/Exterior/282248_37_b.jpg"
		}, {
			"hotelId": 10000001,
			"imageOrder": 4,
			"imageUrl": "http://image.didatravel.com/Image/US/804/Guestroom/282248_38_b.jpg"
		}, {
			"hotelId": 10000001,
			"imageOrder": 4,
			"imageUrl": "http://image.didatravel.com/Image/US/804/Guestroom/282248_39_b.jpg"
		}, {
			"hotelId": 10000001,
			"imageOrder": 4,
			"imageUrl": "http://image.didatravel.com/Image/US/804/Guestroom/282248_32_b.jpg"
		}, {
			"hotelId": 10000001,
			"imageOrder": 4,
			"imageUrl": "http://image.didatravel.com/Image/US/804/Guestroom/282248_28_b.jpg"
		}, {
			"hotelId": 10000001,
			"imageOrder": 4,
			"imageUrl": "http://image.didatravel.com/Image/US/804/Guestroom/282248_27_b.jpg"
		}, {
			"hotelId": 10000001,
			"imageOrder": 4,
			"imageUrl": "http://image.didatravel.com/Image/US/804/Guestroom/282248_23_b.jpg"
		}, {
			"hotelId": 10000001,
			"imageOrder": 99,
			"imageUrl": "http://image.didatravel.com/Image/US/804/Miscellaneous/282248_36_b.jpg"
		}, {
			"hotelId": 10000001,
			"imageOrder": 99,
			"imageUrl": "http://image.didatravel.com/Image/US/804/Miscellaneous/282248_40_b.jpg"
		}, {
			"hotelId": 10000001,
			"imageOrder": 99,
			"imageUrl": "http://image.didatravel.com/Image/US/804/Lobby/282248_25_b.jpg"
		}, {
			"hotelId": 10000001,
			"imageOrder": 99,
			"imageUrl": "http://image.didatravel.com/Image/US/804/Lobby/282248_24_b.jpg"
		}, {
			"hotelId": 10000001,
			"imageOrder": 99,
			"imageUrl": "http://image.didatravel.com/Image/US/804/In-Room Kitchen/282248_26_b.jpg"
		}, {
			"hotelId": 10000001,
			"imageOrder": 99,
			"imageUrl": "http://image.didatravel.com/Image/US/804/Bathroom/282248_22_b.jpg"
		}, {
			"hotelId": 10000001,
			"imageOrder": 99,
			"imageUrl": "http://image.didatravel.com/Image/US/804/Coffee Service/282248_21_b.jpg"
		}, {
			"hotelId": 10000001,
			"imageOrder": 99,
			"imageUrl": "http://image.didatravel.com/Image/US/804/Restaurant/282248_31_b.jpg"
		}],
		"hotelImagesCount": 15,
		"hotelPolicyMap": {
			"Pets": [{
				"description": "宠物可入住",
				"descriptionEn": "Pets allowed",
				"hotelId": 10000001,
				"type": "Pets"
			}, {
				"description": "仅限宠物狗和猫",
				"descriptionEn": "Only dogs and cats are allowed",
				"hotelId": 10000001,
				"type": "Pets"
			}, {
				"description": "每间客房最多允许寄宿的宠物数2",
				"descriptionEn": "Maximum number of pets per room2",
				"hotelId": 10000001,
				"type": "Pets"
			}, {
				"description": "服务类动物豁免收费/限制",
				"descriptionEn": "Service animals exempt from fees/restrictions",
				"hotelId": 10000001,
				"type": "Pets"
			}],
			"Payment": [{
				"description": "美国运通卡 (American Express)",
				"descriptionEn": "American Express",
				"hotelId": 10000001,
				"type": "Payment"
			}, {
				"description": "大来卡 (Diners Club)",
				"descriptionEn": "Diners Club",
				"hotelId": 10000001,
				"type": "Payment"
			}, {
				"description": "发现卡 (Discover)",
				"descriptionEn": "Discover",
				"hotelId": 10000001,
				"type": "Payment"
			}, {
				"description": "JCB 国际卡",
				"descriptionEn": "JCB International",
				"hotelId": 10000001,
				"type": "Payment"
			}, {
				"description": "万事达卡 (MasterCard)",
				"descriptionEn": "MasterCard",
				"hotelId": 10000001,
				"type": "Payment"
			}, {
				"description": "维萨卡 (Visa)",
				"descriptionEn": "Visa",
				"hotelId": 10000001,
				"type": "Payment"
			}],
			"CheckInOut": [{
				"description": "入住时间开始于3 PM",
				"descriptionEn": "Check-in time starts at3 PM",
				"hotelId": 10000001,
				"type": "CheckInOut"
			}, {
				"description": "退房时间11 AM",
				"descriptionEn": "Check-out time is11 AM",
				"hotelId": 10000001,
				"type": "CheckInOut"
			}, {
				"description": "入住时间结束于11 PM",
				"descriptionEn": "Check-in time ends at11 PM",
				"hotelId": 10000001,
				"type": "CheckInOut"
			}],
			"General": [{
				"description": "<p><b>出行提示</b> <br /><ul>  <li>17 岁及以下的儿童如果与父母或监护人同住一房并使用现有床铺，可免费入住。</li><li>旅客可以使用预订确认信息上的联系方式直接与酒店联系，协商有关携带宠物的事宜（需要收费，可以在“费用\"部分找到具体收费事宜）。</li>  </ul></p><p><b>费用</b> <br /><p>以下费用和押金由酒店在提供服务、办理入住或退房手续时收取。</p> <ul>         <li>宠物费：每间住处 USD25，（每次住宿最多 USD150）</li>      <li>现金押金：每次住宿 USD 100</li>       </ul> <p>上面所列内容可能并不完整。这些费用和押金可能不包括税款，并且可能会随时发生变化。</p></p>",
				"descriptionEn": "<p><b>Know Before You Go</b> <br /><ul>  <li>Children 17 years old and younger stay free when occupying the parent or guardian's room, using existing bedding. </li><li>Guests can arrange to bring pets by contacting the property directly, using the contact information on the booking confirmation (surcharges apply and can be found in the Fees section). </li>  </ul></p><p><b>Fees</b> <br /><p>The following fees and deposits are charged by the property at time of service, check-in, or check-out. </p> <ul>         <li>Pet fee: USD 25 per accommodation, per day (maximum USD 150 per stay)</li>      <li>Cash deposit: USD 100 per stay</li>       </ul> <p>The above list may not be comprehensive. Fees and deposits may not include tax and are subject to change. </p></p>",
				"hotelId": 10000001,
				"type": "General"
			}],
			"Other": [{
				"description": "不提供折叠床",
				"descriptionEn": "No rollaway/extra beds available",
				"hotelId": 10000001,
				"type": "Other"
			}, {
				"description": "不提供婴儿床",
				"descriptionEn": "No cribs (infant beds) available",
				"hotelId": 10000001,
				"type": "Other"
			}]
		},
		"hotelVo": {
			"address": "1075 E Lake St",
			"airportCode": "ORD",
			"askingPrice": "490",
			"category": "22",
			"cityId": 47,
			"cityName": "芝加哥",
			"commentCount": 220,
			"commentRating": 5,
			"countryId": 4,
			"countryName": "美国",
			"defaultHotelImage": "http://image.didatravel.com/Image/US/804/Exterior/282248_37_b.jpg",
			"hotLevel": 0,
			"hotelId": 10000001,
			"latitude": "41.97754",
			"longitude": "-88.13134",
			"name": "芝加哥汉诺威公园美国长住酒店",
			"nameEn": "Extended Stay America - Chicago - Hanover Park",
			"regionId": 55959,
			"regionName": "汉诺威公园",
			"starRating": "2",
			"telephone": "+16308934823",
			"zipCode": "60133"
		},
		"roomFacilities": [{
			"description": "空调",
			"descriptionEn": "Air conditioning",
			"hotelId": 10000001,
			"type": 20
		}, {
			"description": "冰箱",
			"descriptionEn": "Refrigerator",
			"hotelId": 10000001,
			"type": 20
		}, {
			"description": "咖啡机/茶具",
			"descriptionEn": "Coffee/tea maker",
			"hotelId": 10000001,
			"type": 20
		}, {
			"description": "免费市话",
			"descriptionEn": "Free local calls",
			"hotelId": 10000001,
			"type": 20
		}, {
			"description": "私人浴室",
			"descriptionEn": "Private bathroom",
			"hotelId": 10000001,
			"type": 20
		}, {
			"description": "免费洗浴用品",
			"descriptionEn": "Free toiletries",
			"hotelId": 10000001,
			"type": 20
		}, {
			"description": "熨斗/熨衣板",
			"descriptionEn": "Iron/ironing board",
			"hotelId": 10000001,
			"type": 20
		}, {
			"description": "书桌",
			"descriptionEn": "Desk",
			"hotelId": 10000001,
			"type": 20
		}, {
			"description": "温度控制",
			"descriptionEn": "Climate control",
			"hotelId": 10000001,
			"type": 20
		}, {
			"description": "独立的休息区",
			"descriptionEn": "Separate sitting area",
			"hotelId": 10000001,
			"type": 20
		}, {
			"description": "微波炉",
			"descriptionEn": "Microwave",
			"hotelId": 10000001,
			"type": 20
		}, {
			"description": "厨房用具",
			"descriptionEn": "Cookware, dishware, and utensils",
			"hotelId": 10000001,
			"type": 20
		}, {
			"description": "付费电视频道",
			"descriptionEn": "Premium TV channels",
			"hotelId": 10000001,
			"type": 20
		}, {
			"description": "遮光窗帘",
			"descriptionEn": "Blackout drapes/curtains",
			"hotelId": 10000001,
			"type": 20
		}, {
			"description": "厨房",
			"descriptionEn": "Kitchen",
			"hotelId": 10000001,
			"type": 20
		}, {
			"description": "吹风机(按需求提供)",
			"descriptionEn": "Hair dryer (on request)",
			"hotelId": 10000001,
			"type": 20
		}, {
			"description": "浴缸和淋浴组合",
			"descriptionEn": "Shower/tub combination",
			"hotelId": 10000001,
			"type": 20
		}, {
			"description": "炉灶",
			"descriptionEn": "Stovetop",
			"hotelId": 10000001,
			"type": 20
		}, {
			"description": "有线电视服务",
			"descriptionEn": "Cable TV service",
			"hotelId": 10000001,
			"type": 20
		}, {
			"description": "平面电视",
			"descriptionEn": "Flat-panel TV",
			"hotelId": 10000001,
			"type": 20
		}, {
			"description": "免费 Wi-Fi",
			"descriptionEn": "Free WiFi",
			"hotelId": 10000001,
			"type": 20
		}, {
			"description": "每周提供一次客房清洁服务",
			"descriptionEn": "Weekly housekeeping provided",
			"hotelId": 10000001,
			"type": 20
		}]
	},
	hotelRoom: [{
		"quoteItems": [{
			"bedTypeId": 1002,
			"bedTypeName": "1 大床",
			"breakfastTypeId": 1,
			"breakfastTypeName": "含早餐",
			"cancelPolicys": [{
				"desc": "免费取消:2017年07月19日00:00:00前",
				"toTime": "2017年07月19日00:00:00",
				"type": 2
			}, {
				"amount": "3585",
				"fromTime": "2017年07月19日00:00:00",
				"type": 3
			}],
			"quoteId": "16:200779713:206478434:S",
			"totalPrice": "3585",
			"vendorId": 800001,
			"vendorName": "道旅",
			"vendorRoomName": "Traditional Room, 1 King Bed"
		}, {
			"bedTypeId": 1002,
			"bedTypeName": "1 大床",
			"breakfastTypeId": 1,
			"breakfastTypeName": "含早餐",
			"cancelPolicys": [{
				"desc": "免费取消:2017年07月19日00:00:00前",
				"toTime": "2017年07月19日00:00:00",
				"type": 2
			}, {
				"amount": "3603",
				"fromTime": "2017年07月19日00:00:00",
				"type": 3
			}],
			"quoteId": "16:200779713:206478434:P",
			"totalPrice": "3603",
			"vendorId": 800001,
			"vendorName": "道旅",
			"vendorRoomName": "Traditional Room, 1 King Bed"
		}, {
			"bedTypeId": 1009,
			"bedTypeName": "1 大床 或 1 双床",
			"breakfastTypeId": 1,
			"breakfastTypeName": "含早餐",
			"cancelPolicys": [{
				"desc": "免费取消:2017年07月19日00:00:00前",
				"toTime": "2017年07月19日00:00:00",
				"type": 2
			}, {
				"amount": "4689",
				"fromTime": "2017年07月19日00:00:00",
				"type": 3
			}],
			"quoteId": "16:200779717:206478436:S",
			"totalPrice": "4689",
			"vendorId": 800001,
			"vendorName": "道旅",
			"vendorRoomName": "Club Room"
		}, {
			"bedTypeId": 1009,
			"bedTypeName": "1 大床 或 1 双床",
			"breakfastTypeId": 1,
			"breakfastTypeName": "含早餐",
			"cancelPolicys": [{
				"desc": "免费取消:2017年07月19日00:00:00前",
				"toTime": "2017年07月19日00:00:00",
				"type": 2
			}, {
				"amount": "4710",
				"fromTime": "2017年07月19日00:00:00",
				"type": 3
			}],
			"quoteId": "16:200779717:206478436:P",
			"totalPrice": "4710",
			"vendorId": 800001,
			"vendorName": "道旅",
			"vendorRoomName": "Club Room"
		}],
		"roomName": "Standard"
	}, {
		"quoteItems": [{
			"bedTypeId": 1006,
			"bedTypeName": "2 大床",
			"breakfastTypeId": 1,
			"breakfastTypeName": "含早餐",
			"cancelPolicys": [{
				"desc": "免费取消:2017年04月25日00:00:00前",
				"toTime": "2017年04月25日00:00:00",
				"type": 2
			}, {
				"amount": "3093",
				"fromTime": "2017年04月25日00:00:00",
				"type": 3
			}],
			"quoteId": "16:200779710:203855035:S",
			"totalPrice": "3093",
			"vendorId": 800001,
			"vendorName": "道旅",
			"vendorRoomName": "Traditional Room, 2 Queen Beds"
		}, {
			"bedTypeId": 1002,
			"bedTypeName": "1 大床",
			"breakfastTypeId": 1,
			"breakfastTypeName": "含早餐",
			"cancelPolicys": [{
				"desc": "免费取消:2017年04月25日00:00:00前",
				"toTime": "2017年04月25日00:00:00",
				"type": 2
			}, {
				"amount": "3093",
				"fromTime": "2017年04月25日00:00:00",
				"type": 3
			}],
			"quoteId": "16:200779713:203855055:S",
			"totalPrice": "3093",
			"vendorId": 800001,
			"vendorName": "道旅",
			"vendorRoomName": "传统客房, 1 张特大床(Traditional Room, 1 King Bed)"
		}, {
			"bedTypeId": 1003,
			"bedTypeName": "1 双床",
			"breakfastTypeId": 1,
			"breakfastTypeName": "含早餐",
			"cancelPolicys": [{
				"desc": "免费取消:2017年04月25日00:00:00前",
				"toTime": "2017年04月25日00:00:00",
				"type": 2
			}, {
				"amount": "3183",
				"fromTime": "2017年04月25日00:00:00",
				"type": 3
			}],
			"quoteId": "1:326336:TWN-U10:Q2-TD:RO",
			"totalPrice": "3183",
			"vendorId": 800001,
			"vendorName": "道旅",
			"vendorRoomName": "TWIN TWO QUEEN BEDS-TRADITIONAL"
		}, {
			"bedTypeId": 1002,
			"bedTypeName": "1 大床",
			"breakfastTypeId": 1,
			"breakfastTypeName": "含早餐",
			"cancelPolicys": [{
				"desc": "免费取消:2017年04月25日00:00:00前",
				"toTime": "2017年04月25日00:00:00",
				"type": 2
			}, {
				"amount": "3183",
				"fromTime": "2017年04月25日00:00:00",
				"type": 3
			}],
			"quoteId": "1:326336:DBL-U10:KN-TD:RO",
			"totalPrice": "3183",
			"vendorId": 800001,
			"vendorName": "道旅",
			"vendorRoomName": "DOUBLE KING-TRADITIONAL"
		}, {
			"bedTypeId": 1002,
			"bedTypeName": "1 大床",
			"breakfastTypeId": 1,
			"breakfastTypeName": "含早餐",
			"cancelPolicys": [{
				"desc": "免费取消:2017年04月25日00:00:00前",
				"toTime": "2017年04月25日00:00:00",
				"type": 2
			}, {
				"amount": "3240",
				"fromTime": "2017年04月25日00:00:00",
				"type": 3
			}],
			"quoteId": "12:54482:4daa3336d81fa6e8f9ad1fba6928ad55:2:3:1:0",
			"totalPrice": "3240",
			"vendorId": 800001,
			"vendorName": "道旅",
			"vendorRoomName": "传统客房, 1 张特大床"
		}, {
			"bedTypeId": 1006,
			"bedTypeName": "2 大床",
			"breakfastTypeId": 1,
			"breakfastTypeName": "含早餐",
			"cancelPolicys": [{
				"desc": "免费取消:2017年04月25日00:00:00前",
				"toTime": "2017年04月25日00:00:00",
				"type": 2
			}, {
				"amount": "3240",
				"fromTime": "2017年04月25日00:00:00",
				"type": 3
			}],
			"quoteId": "12:54482:a04997336b30728e026a8710aa7356d5:6:4:1:0",
			"totalPrice": "3240",
			"vendorId": 800001,
			"vendorName": "道旅",
			"vendorRoomName": "传统客房, 2 张大床"
		}, {
			"bedTypeId": 1006,
			"bedTypeName": "2 大床",
			"breakfastTypeId": 1,
			"breakfastTypeName": "含早餐",
			"cancelPolicys": [{
				"desc": "免费取消:2017年07月14日00:00:00前",
				"toTime": "2017年07月14日00:00:00",
				"type": 2
			}, {
				"amount": "21",
				"fromTime": "2017年07月14日00:00:00",
				"toTime": "2017年07月16日00:00:00",
				"type": 3
			}, {
				"amount": "1132",
				"fromTime": "2017年07月16日00:00:00",
				"toTime": "2017年07月19日00:00:00",
				"type": 3
			}, {
				"amount": "3396",
				"fromTime": "2017年07月19日00:00:00",
				"type": 3
			}],
			"quoteId": "2:667262:DB:N",
			"totalPrice": "3396",
			"vendorId": 800001,
			"vendorName": "道旅",
			"vendorRoomName": "Traditional 2 queen"
		}, {
			"bedTypeId": 1002,
			"bedTypeName": "1 大床",
			"breakfastTypeId": 1,
			"breakfastTypeName": "含早餐",
			"cancelPolicys": [{
				"desc": "免费取消:2017年07月14日00:00:00前",
				"toTime": "2017年07月14日00:00:00",
				"type": 2
			}, {
				"amount": "21",
				"fromTime": "2017年07月14日00:00:00",
				"toTime": "2017年07月16日00:00:00",
				"type": 3
			}, {
				"amount": "1132",
				"fromTime": "2017年07月16日00:00:00",
				"toTime": "2017年07月19日00:00:00",
				"type": 3
			}, {
				"amount": "3396",
				"fromTime": "2017年07月19日00:00:00",
				"type": 3
			}],
			"quoteId": "2:1093929:DB:N",
			"totalPrice": "3396",
			"vendorId": 800001,
			"vendorName": "道旅",
			"vendorRoomName": "Traditional King Non Smoking"
		}, {
			"bedTypeId": 1006,
			"bedTypeName": "2 大床",
			"breakfastTypeId": 1,
			"breakfastTypeName": "含早餐",
			"cancelPolicys": [{
				"desc": "免费取消:2017年07月19日00:00:00前",
				"toTime": "2017年07月19日00:00:00",
				"type": 2
			}, {
				"amount": "3585",
				"fromTime": "2017年07月19日00:00:00",
				"type": 3
			}],
			"quoteId": "16:200779710:206478433:S",
			"totalPrice": "3585",
			"vendorId": 800001,
			"vendorName": "道旅",
			"vendorRoomName": "Traditional Room, 2 Queen Beds"
		}, {
			"bedTypeId": 1006,
			"bedTypeName": "2 大床",
			"breakfastTypeId": 1,
			"breakfastTypeName": "含早餐",
			"cancelPolicys": [{
				"desc": "免费取消:2017年07月19日00:00:00前",
				"toTime": "2017年07月19日00:00:00",
				"type": 2
			}, {
				"amount": "3603",
				"fromTime": "2017年07月19日00:00:00",
				"type": 3
			}],
			"quoteId": "16:200779710:206478433:P",
			"totalPrice": "3603",
			"vendorId": 800001,
			"vendorName": "道旅",
			"vendorRoomName": "Traditional Room, 2 Queen Beds"
		}, {
			"bedTypeId": 1002,
			"bedTypeName": "1 大床",
			"breakfastTypeId": 1,
			"breakfastTypeName": "含早餐",
			"cancelPolicys": [{
				"desc": "免费取消:2017年04月25日00:00:00前",
				"toTime": "2017年04月25日00:00:00",
				"type": 2
			}, {
				"amount": "4086",
				"fromTime": "2017年04月25日00:00:00",
				"type": 3
			}],
			"quoteId": "16:200779717:203855073:S",
			"totalPrice": "4086",
			"vendorId": 800001,
			"vendorName": "道旅",
			"vendorRoomName": "俱乐部客房(Club Room)"
		}],
		"roomName": "其它"
	}],
}

if (typeof define === 'function' && define.amd) define(function() {
	return Mock
});
else if (typeof exports === 'object') module.exports = Mock;
else _gol.Mock = Mock;



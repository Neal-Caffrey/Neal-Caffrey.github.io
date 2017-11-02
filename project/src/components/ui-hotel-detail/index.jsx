import React, {
  Component,
  PropTypes
} from 'react';
import { connect } from 'react-redux';
import {_extend} from 'local-Utils/dist/main.js';
import {Affix,Anchor, Button, Spin, Progress,Checkbox} from 'local-Antd';
import Stars from "components/ui-star/index.jsx";
import Score from "components/ui-score/index.jsx";
import DatePickerGroup from 'components/ui-date-picker/index.jsx';
import RoomSelect from 'components/ui-number-select/index.jsx';
import GuestSelect from 'components/ui-hotel-guest/index.jsx';
import Storage from 'local-Storage/dist/main.js';
import YdjAjax from 'components/ydj-Ajax/index.jsx';
// import CheckLogin from 'widgets/ydj-Ajax/index.js';
import './sass/index.scss';
import moment from 'moment';
import 'moment/locale/zh-cn';
import UIMap from 'components/ui-detail-map/index.js';
moment.locale('zh-cn');
const momentFormat = 'YYYY-MM-DD';
import Request from 'local-Ajax/dist/main.js';
import ApiConfig from 'widgets/apiConfig';
import Msg from 'components/ui-msg/index.jsx';
import Loading from 'components/ui-loading/index.jsx';
import SimulateProgrss from 'components/ui-simulate-progress/index.jsx';
import CountrySelect from 'components/country-select/index.jsx';
import $ from 'local-Zepto/dist/main.js'
/**
* 通用弹框
* arguments {
* 		info 		// 详情
* 		hotelId		// 酒店Id
* 		wrap 		// 滚动容器
* }
**/
class UiHotelDetail extends Component {
	constructor(props, context) {
		super(props, context);
		this.storage;
		this._state = {
			baseInfo: this.props.info ? {
				hotelVo: this.props.info.hotelVo ? this.props.info.hotelVo : false,
				hotelImages: this.hotelImages.splice(0, 5),
				hotelDescription: this.props.info.hotelDescription ? this.props.info.hotelDescription : false,
				hotelFacilities: this.props.info.hotelFacilities ? this.props.info.hotelFacilities : false,
				roomFacilities: this.props.info.roomFacilities ? this.props.info.roomFacilities : false,
				hotelPolicies: this.props.info.hotelPolicyMap ? this.props.info.hotelPolicyMap : false,
			} : false,
			wrap: this.props.wrap
		};

		this._state.navList = function(){
			let list = [];
			list.concat([{roomPriceSection: '预订房型'}]);
			this._state.hotelDescription && (list.concat([{descriptionSection: '酒店介绍'}]));
			this._state.facilitiesSection && (list.concat([{facilitiesSection: '酒店设施'}]));
			this._state.roomSection && (list.concat([{roomSection: '房间设施'}]));
			this._state.roomPriceSection && (list.concat([{roomPriceSection: '酒店政策'}]));
			return list;
		};
		this._formData = {
			hotelId: this.props.hotelId,
			checkInDate: this.roomDate[0],
			checkOutDate: this.roomDate[1],
			days: moment(this.roomDate[1]).diff(moment(this.roomDate[0]), 'days'),
			roomNum: 1,
			adultNum: 2,
			childNum: 0,
			childAges: []
		};
		this.state = {
			hotelId: this.props.hotelId,
			roomInfo: false,
			loading: true, // room
			days: this._formData.days,
			isOnPriceError: false,
			isOnHomeError: false,
			isBooking: '',
			isBookLoading: false,
			isSearchLoading: false,
			openClass: [],
			activeNav: '',
			roomPercent: 10,
			hasBreakfast : false,
			canCancel : false,
			countryCode : {
				code : 'CN',
				countryName : '中国'
			}
		};
	}
	getHotelPosition(){
		let hotelVo = this._state.baseInfo.hotelVo;
		hotelVo.hotelLatitude = hotelVo.latitude;
		hotelVo.hotelLongitude = hotelVo.longitude;
		hotelVo.hotelNameEn = hotelVo.nameEn;
		hotelVo.hotelName = hotelVo.name;
		return [
			hotelVo
		]
	}
	componentWillMount() {
		if(this.props.header.info) {
	      this._getRoomData();
	    }
	}
	componentWillReceiveProps(nextProps) {
		// debugger
	    if(!this.props.header.info && nextProps.header.info) {
	      this._getRoomData();
	    }
	  }

	componentDidMount() {
		this._state.wrap.addEventListener('scroll', this._scrollHandle.bind(this));
		$(document).on('mouseover','td.cancel-policy',function(){
			$(this).addClass('cancel-policy-show')
		}).on('mouseout','td.cancel-policy',function(){
			$(this).removeClass('cancel-policy-show')
		})
	}

	// 初始化storage
	get storage() {
		this._storage = new Storage();
	}

	// 获取默认的日期
	get roomDate() {
		let dates = this._storage.get(ApiConfig.storageKey.hotel_list_date);
		const NOW = moment();
		let start = moment().add(2, 'days').format(momentFormat);
		let end = moment().add(3, 'days').format(momentFormat);
		if (!dates || !dates.length || dates.length < 2) {
			return [start, end]
		} else {
			return [dates[0], dates[1]];
		}
	}

	// 初始化显示的图片链接
	get hotelImages() {

		let list = [];
		if(this.props.info && this.props.info.hotelImages) {
			list = [].concat(this.props.info.hotelImages);
			list.forEach(function(item, index) {
				if (item.imageUrl) {
					// tip: 图片路径空格替换
					item.imageUrl = item.imageUrl.replace(/\s/g, '%20');
				}

			});
		}

		for (let i = list.length; i < 9; i++) {
			list.push({
				"hotelId": this.props.info.hotelVo.hotelId,
				"imageOrder": 0,
				"imageUrl": false
			});
		}
		return list;
	}

	// 日历组件初始化数据
	get dateInit() {
		return [this._formData.checkInDate, this._formData.checkOutDate];
	}

	// 房间选择组件初始化数据
	get roomInit() {
		return {
			defValue: `${this._formData.roomNum}`,
			minNum: 1,
			maxNum: 5,
			uiClassName: "room-select",
			uiPlaceholder: "选择房间数",
			postfix: "间",
			selectedHandler: this._cbChangeRoom.bind(this)
		}
	}

	// 人数组件初始化数据
	get guestInit() {
		return {
			childAges: this._formData.childAges,
			adultMin: 1,
			adultMax: 8,
			adultNum: this._formData.adultNum,
			childMin: 0,
			childMax: 3,
			childNum: this._formData.childNum,
			ageMin: 0,
			ageMax: 17,
			ageDef: 1,
			confirmHandler: this._cbChangeGuest.bind(this),
		}
	}

	// 房间报价信息重组 for展示
	_roomInfos(dataa,breakfast,cancel) {
		let roomInfo = []; // 房型列表
		let rowInfo = []; // tr列表
		let data = this._getRoomFilter(dataa,breakfast,cancel);
		if (data && data.length) {
			let count = 0;
			data.forEach((item, index) => {
				let childNum = data[index].quoteItems.length;
				let showNum = data[index].quoteItems.length > 3 ? 3 : data[index].quoteItems.length;
				data[index].quoteItems.forEach((room, roomIndex) => {
					let row = {};
					if(roomIndex == 0) {
						row.showNum = showNum;
						row.childNum = childNum;
					}
					row.key = room.qouteId;
					row.isBtn = false;
					row.row1 = index;
					row.row2 = roomIndex;
					row.rowClass = `room-${index}`;
					row.matrix = `room-${index}-${roomIndex}`;
					row.roomName = item.roomName;
					row.hide = (roomIndex > 2 ? true: false);
					row.roomIndex = count;
					rowInfo = rowInfo.concat(row);
					count++;
				});
				if(childNum > showNum) {
					rowInfo = rowInfo.concat({
						isBtn: true,
						row1: index,
						showNum: showNum,
						childNum: childNum,
						rowClass: `room-${index}`,
					});
				}
				roomInfo = roomInfo.concat(data[index].quoteItems);
			})
			return {
				rooms: roomInfo,
				rowInfo: rowInfo
			}
		}
		return false;
	}

	// 获取房间报价
	_search() {
		// 搜索
		this._getRoomData();
	}

	// 验价通过处理
	_goToOrder(room) {
		// 写缓存并跳转页面
		// debugger
		let data = {
			hotelVersion: this._state.baseInfo.hotelVo.hotelVersion,
			totalPrice: room.totalPrice, // 1间多晚价
			totalRoomPrice:  room.totalRoomPrice,// 多间多晚价
			priceChannel: room.totalRoomPrice, // 渠道价格
			ratePlanId: room.quoteId, // 价格计划 ID
			quoteMark: this.state.quoteMark, // 查价标识
			vendorId: room.vendorId, // 供应商Id
			vendorName: room.vendorName, // 供应商名称
			checkinDate: this._queryDatas.checkInDate, // 入住日期
			checkoutDate: this._queryDatas.checkOutDate, // 离开日期
			numOfRooms: this._queryDatas.roomNum,// 房间数,
			numOfStay: this._queryDatas.days,// 入住天数
			adultNum: this._queryDatas.adultNum,// 成人数
			childNum: this._queryDatas.childNum, // 儿童数
			childAges: this._queryDatas.childAges, // 儿童年龄
			hotelId: this._queryDatas.hotelId, // 酒店Id
			countryObj : this.state.countryCode,
			hotelInfo: {
				cnname: this._state.baseInfo.hotelVo.name,
				enname: this._state.baseInfo.hotelVo.nameEn,
				starRating: this._state.baseInfo.hotelVo.starRating,
				address: this._state.baseInfo.hotelVo.address,
				telephone: this._state.baseInfo.hotelVo.telephone,
				defaultHotelImage: this._state.baseInfo.hotelVo.defaultHotelImage,
			},
			roomBedBreakfastInfo: {
				roomType: '', // 房间类型
				roomTypeName: room.vendorRoomName, // 房间类型中文
				roomTypeNameEn: '', // 房间类型英文
				bedType: room.bedTypeId, // 床型
				bedTypeName: room.bedTypeName, // 床型描述中文
				bedTypeNameEn: '', // 床型描述英文
				breakfastType: room.breakfastTypeId, // 早餐类型
				breakfastTypeName: room.breakfastTypeName, // 早餐类型名中文
				breakfastTypeNameEn: '', // 早餐类型名英文
			},
			hotelCancelPolicy: room.channelCancelPolicys, // 展示用，已添加利润
			checkCancelPolicy: room.cancelPolicys, // 验价用，未添加利润
		};
		this._storage.set(`${ApiConfig.storageKey.hotel_detail_data}_${room.quoteId}`, data);
	}
	get checkQueryAttr() {
		return {
			queryParam: {
				type: 'POST',
				headers:{'Content-Type': 'application/json'},
				url: ApiConfig.checkRoomPrice,
				// url: 'http://api6-dev.huangbaoche.com/ota/v1.0/cla/confirmHotelQuote',
			},
			name: '酒店房型验价',
		}
	}
	_cbPriceChangeHandle(key) {
		let states = {
			isOnPriceError: false
		}
		this.setState(states);
		if(key == 'confirm'){
			window.location.href = `${ApiConfig.subRoot}/hotel/order.html?qouteId=${this._state.room.quoteId}`;
		}
	}

	_cbCheckSuccess(res) {
		let states = {};
		let room = {};
		this._state.room = res.data.confirmQuoteItem;
		states.isBookLoading = false;
		states.isBooking = '';
		if (res.status == 200 && res.data && res.data.status != undefined) {
			// 0: 匹配
			// 1：价格变更
			// 2：房间变更
			// 3：床型变更
			// 4：早餐变更
			// 5：退款变更
			// res.data.status = 5;
			// res.data.status = 4;
			// res.data.status = 3;
			// res.data.status = 2;
			// res.data.status = 1;
			switch(res.data.status){
				case 0:
					// room = this._state.room;
					room = res.data.confirmQuoteItem;
					room.quoteId = JSON.parse(this.checkQueryData).quoteId;
					this._goToOrder(room);
					window.location.href = `${ApiConfig.subRoot}/hotel/order.html?qouteId=${room.quoteId}`;
					return;
					break;
				case 1:
					room = res.data.confirmQuoteItem;
					room.quoteId = JSON.parse(this.checkQueryData).quoteId;
					this._goToOrder(room);

					states.isOnPriceError = true;
					this.priceErrInfo = {
						content: `房间总价已发生变化，最新房价已变为 <span style="color: red;">￥${room.totalRoomPrice}</span>。是否继续?`,
					}
					break;
				case 2:
					room = res.data.confirmQuoteItem;
					room.quoteId = JSON.parse(this.checkQueryData).quoteId;
					this._goToOrder(room);

					states.isOnPriceError = true;
					this.priceErrInfo = {
						content: `该房型已变为 <span style="color: red;">【${room.vendorRoomName}】</span>。是否继续?`,
					}
					break;
				case 3:
					room = res.data.confirmQuoteItem;
					room.quoteId = JSON.parse(this.checkQueryData).quoteId;
					this._goToOrder(room);

					states.isOnPriceError = true;
					this.priceErrInfo = {
						content: `该房间的床型已变为 <span style="color: red;">【${room.bedTypeName}】</span>。是否继续?`,
					}
					break;
				case 4:
					room = res.data.confirmQuoteItem;
					room.quoteId = JSON.parse(this.checkQueryData).quoteId;
					this._goToOrder(room);

					states.isOnPriceError = true;
					this.priceErrInfo = {
						content: `该房型的早餐情况已变为 <span style="color: red;">【${room.breakfastTypeName}】</span>。是否继续?`,
					}
					break;
				case 5:
					room = res.data.confirmQuoteItem;
					room.quoteId = JSON.parse(this.checkQueryData).quoteId;
					this._goToOrder(room);

					states.isOnPriceError = true;
					let cancelStr = function(){
						let str = '';
						// room.cancelPolicys.map((item, index)=>{
						room.channelCancelPolicys.map((item, index)=>{
							if(item.type == 1) {
								if(item.fromTime) {
									str+=`<p style="color: red;">【${item.fromTime}后${item.desc}】</p>`
								}else {
									str+=`<p style="color: red;">【${item.desc}】</p>`
								}
							}else if(item.type == 2){
								if(item.toTime) {
									str+=`<p style="color: red;">【${item.toTime}前免费取消】</p>`
								}else {
									str+=`<p style="color: red;">【免费取消】</p>`
								}

							}else if(item.type == 3) {
								if(item.fromTime && item.toTime) {
									str+=`<p style="color: red;">【${item.fromTime}至${item.toTime}取消，扣款￥${item.totalRoomAmount}】</p>`
								} else {
									if(item.fromTime){
									str+=`<p style="color: red;">【${item.fromTime}后取消，扣款￥${item.totalRoomAmount}】</p>`
									}
									if(item.toTime){
										str+=`<p style="color: red;">【${item.fromTime}前取消，扣款￥${item.totalRoomAmount}】</p>`
									}
								}
							}

						})
						return str;
					}
					this.priceErrInfo = {
						content: `该房型的取消政策已发生变化，最新政策为：${cancelStr()}`,
					}
					break;
			}
			this.priceErrInfo = {
				...this.priceErrInfo,
				showFlag: true,
				showType: 'confirm',
				title: '提醒',
				disabled: true,
				backHandle: this._cbPriceChangeHandle.bind(this)
			}
			this.setState(states);

		}
	}
	get checkQueryData() {
		return this._state.checkQueryData;
	}
	_checkQueryData(room) {
		// debugger
		let that = this;
		let hotelQuoteItem = {
			'vendorId': room.vendorId,
			'vendorName': room.vendorName,
			'vendorRoomName': room.vendorRoomName,
			'bedTypeId': room.bedTypeId,
			'bedTypeName': room.bedTypeName,
			'breakfastTypeId': room.breakfastTypeId,
			'breakfastTypeName': room.breakfastTypeName,
			'cancelPolicys': room.cancelPolicys, // 验价用
			'totalPrice': room.totalPrice
		};
		let data = {
			'hotelQuoteItem': hotelQuoteItem,
			'adultNum': this._queryDatas.adultNum,
			'childAges': this._queryDatas.childAges,
			'checkInDate': this._queryDatas.checkInDate,
			'checkOutDate': this._queryDatas.checkOutDate,
			'hotelId': this._queryDatas.hotelId,
			'quoteId': room.quoteId,
			'quoteMark': this.state.quoteMark,
			'roomNum': this._queryDatas.roomNum,
			'countryCode' : that.state.countryCode.code
		};
		return JSON.stringify(data);
	}

	// 预订处理
	_booking(room) {
		this._state.checkQueryData = this._checkQueryData(room);
		this._state.room = room;
		this.setState({
			isBookLoading: true,
			isBooking: room.quoteId,
		})
	}

	get roomQueryAttr() {
		return {
			queryParam: {
				url: ApiConfig.getRoomPrice,
				// url: 'http://api6-dev.huangbaoche.com/ota/v1.0/cla/queryHotelQuote',
			},
			name: '酒店房型',
		}
	}

	_cbRoomSuccess(res) {
		let states = {};
		let that = this;
		states.loading = false;
		states.isSearchLoading = false;
		states.days = moment(this._formData.checkOutDate).diff(moment(this._formData.checkInDate), 'days');
		that._formData.days = states.days;
		if (res.status == 200 && res.data && res.data.roomQuotes) {
			// console.log('_cbRoomSuccess', JSON.stringify(res));
			// states._roomIno = that._getRoomFilter(res.data.roomQuotes);
			// debugger
			that.ORIROOM = res.data.roomQuotes;
			states.quoteMark = res.data.quoteMark;
			states.roomInfo = that._roomInfos(res.data.roomQuotes);
			that.setState(states);
		}
	}

	get roomQueryData() {
		let that = this;
		return {
			hotelId: that.state.hotelId,
			checkInDate: that._formData.checkInDate,
			checkOutDate: that._formData.checkOutDate,
			roomNum: that._formData.roomNum,
			adultNum: that._formData.adultNum,
			childAges: that._formData.childAges.join(','),
			countryCode : that.state.countryCode.code,
			channelId: this.props.header.info.agentInfo.agentId
		}
	}

	// 查询房间报价
	_getRoomData() {
		let that = this;
		this._queryDatas = {
			hotelId: that.state.hotelId,
			checkInDate: that._formData.checkInDate,
			checkOutDate: that._formData.checkOutDate,
			roomNum: that._formData.roomNum,
			adultNum: that._formData.adultNum,
			childAges: that._formData.childAges,
			childNum: that._formData.childNum,
			days: that._formData.days,
		};
		this.setState({
			isSearchLoading: true,
			loading: true,
			canCancel: false,
			hasBreakfast: false
		})
	}

	// 切换日期回调
	_cbSelectDate(dates, dataStrings) {
		this._formData.checkInDate = dataStrings[0];
		this._formData.checkOutDate = dataStrings[1];
		this._formData.days = moment(dataStrings[1]).diff(moment(dataStrings[0]), 'days');
	}

	// 切换房间数回调
	_cbChangeRoom(val) {
		this._formData.roomNum = parseInt(val);
	}

	// 重组儿童年龄返回值
	_getChildAges(data) {
		let result = [];
		if (data && data.length) {
			data.forEach((item, index) => {
				result.push(item.defValue!=undefined ? parseInt(item.defValue) : parseInt(item));
			})
		}
		return result;
	}

	// 切换人数+儿童年龄回调
	_cbChangeGuest(val) {
		this._formData.adultNum = parseInt(val.adultNum);
		this._formData.childNum = parseInt(val.childNum);
		this._formData.childAges = this._getChildAges(val.childAges);
	}

	// 房间设施
	_renderRoomDes(){
		if(this._state.baseInfo &&  this._state.baseInfo.roomFacilities && this._state.baseInfo.roomFacilities.length) {
			return(
				<div className="room-info" id="roomSection" ref="roomSection">
					<h3>房间设施</h3>
					<ul>
					{
						this._state.baseInfo.roomFacilities.map((item, key) => {
							return (
								<li key={key}><span className="icon-checd"></span>{item.description}</li>
							)
						})
					}

					</ul>
				</div>
			)
		} else {
			return ""
		}
	}

	// 酒店设施
	_renderFacilities() {
	  	if(this._state.baseInfo && this._state.baseInfo.hotelFacilities && this._state.baseInfo.hotelFacilities.length) {
	  		return (
	  			<div className="facilities-info" id="facilitiesSection" ref="facilitiesSection">
					<h3>酒店设施</h3>
					<ul>
					{
						this._state.baseInfo.hotelFacilities.map((item, key) => {
							return (
								<li key={key}><span className="icon-checd"></span>{item.description}</li>
							)
						})
					}
					</ul>
				</div>
			)
	  	}else {
	  		return ""
	  	}
	}

	// 酒店介绍
	_renderHotelDescription() {

	  	if(this._state.baseInfo && this._state.baseInfo.hotelDescription && this._state.baseInfo.hotelDescription.description) {
	  		return (
				<div className="hotel-info" id="descriptionSection" ref="descriptionSection">
					<h3>酒店介绍</h3>
					{this._disclaimer()}
					<div dangerouslySetInnerHTML={{__html: this._state.baseInfo.hotelDescription.description || ''}}></div>
				</div>
			)
	  	}else {
	  		return ""
	  	}
	}

	// 酒店政策
	_renderPolicies() {
		if(this._state.baseInfo && this._state.baseInfo.hotelPolicies && Object.keys(this._state.baseInfo.hotelPolicies).length > 0) {
			return (
				<div className="book-info" id="bookSection" ref="bookSection">
					<h3>酒店政策</h3>
					{this._state.baseInfo.hotelPolicies.CheckInOut && this._state.baseInfo.hotelPolicies.CheckInOut.length? this._renderCheckInOut():null}
					{this._state.baseInfo.hotelPolicies.General && this._state.baseInfo.hotelPolicies.General.length? this._renderGeneral():null}
					{this._state.baseInfo.hotelPolicies.Payment && this._state.baseInfo.hotelPolicies.Payment.length? this._renderPayment():null}
					{this._state.baseInfo.hotelPolicies.Other && this._state.baseInfo.hotelPolicies.Other.length? this._renderOthers() : null}
					{this._state.baseInfo.hotelPolicies.Pets && this._state.baseInfo.hotelPolicies.Pets.length? this._renderPets() : null}
				</div>
		)
		}else {
			return null
		}
	}

    // 免责声明
    _disclaimer() {
		return (
			<div className="disclaimer-info">
				<span>* 如酒店设施和入住政策调整，导致信息更新不及时、介绍略有出入，请以实际入住为准。</span>
			</div>
		)
    }

	// 酒店政策-宠物
	_renderPets() {
		return (
			<div className="pets">
				<h5>宠物</h5>
				<ul>
				{this._state.baseInfo.hotelPolicies.Pets.map((item, key) => {
					return (
						<li key={key} dangerouslySetInnerHTML={{__html: item.description || ''}}></li>
					)
				})}
				</ul>
			</div>
		)
	}

	// 酒店政策-其他
	_renderOthers() {

		return (
			<div className="others">
				<h5>其他</h5>
				<ul>
				{this._state.baseInfo.hotelPolicies.Other.map((item, key) => {
					return (
						<li key={key} dangerouslySetInnerHTML={{__html: item.description || ''}}></li>
					)
				})}
				</ul>
			</div>
		)
	}

	// 酒店政策-支付方式
	_renderPayment() {
		return (
			<div className="payment">
				<h5>支付方式</h5>
				<ul>
					{this._state.baseInfo.hotelPolicies.Payment.map((item, key) => {
						return (
							<li key={key} dangerouslySetInnerHTML={{__html: item.description || ''}}></li>
						)
					})}
				</ul>
			</div>
		)
	}

	// 酒店政策-入住须知
	_renderGeneral() {
		return (
			<div className="general" id="generalSection">
				<h5>入住须知</h5>
				<ul>
					{this._state.baseInfo.hotelPolicies.General.map((item, key) => {
						return (
							<li key={key} dangerouslySetInnerHTML={{__html: item.description || ''}}></li>
						)
					})}

				</ul>
			</div>
		)
	}

	// 酒店政策-入住/离店
	_renderCheckInOut() {
		return (
			<div className="checkinout">
				<h5>入住/退房</h5>
				<ul>
					{this._state.baseInfo.hotelPolicies.CheckInOut.map((item, key) => {
						return (
							<li key={key} dangerouslySetInnerHTML={{__html: item.description || ''}}></li>
						)
					})}

				</ul>
			</div>
		)
	}

	// // 取消规则
	// _renderCancelPolicy(data) {
	// 	let policy = new Array(3);
	// 	data.forEach((item, key)=>{
	// 		if (item.type == 1) {
	// 			policy[0] = {txt: item.desc};
	// 		}
	// 		if (item.type == 2) {
	// 			let tmp = item.desc.split(':');
	// 			let txt = tmp[0];
	// 			policy[1] = {txt: txt, date: `${item.toTime}前`};
	// 		}
	// 		if (item.type == 3 && (!policy[2] || !policy[2].txt)) {
	// 			policy[2] = {txt: `有偿退款${item.desc}`, date: `${item.fromTime}后`};
	// 		}
	// 	});
	// 	let showItem = (policy[0] && policy[0].txt)? policy[0] : ((policy[1] && policy[1].txt)? policy[1] : ((policy[2] && policy[2].txt)?policy[2] : {txt: '未填写'}));
	// 	return (
	// 		<span>
	// 			{showItem.txt}
	// 			{showItem.date ? <span>{showItem.date}</span> : null}
	// 		</span>
	// 	)
	// }
	_renderAllCancelPolicy(data) {
		let re = /(\d{4}).(\d{2}).(\d{2}).((\d{2}):(\d{2}):(\d{2}))/g;
		let showItem = {};
		let item = data;
		let now = moment();
		if (item.type == 1) {
			showItem = {
				txt: '• 不可取消',
			};
			if(item.fromTime) {
				let timeArray = re.exec(item.fromTime);
				let fromTime = timeArray[1] + '-' + timeArray[2] + '-' + timeArray[3] + ' ' + timeArray[4];
				let diff = moment(fromTime).diff(moment(now), 'seconds');
				if(diff > 0) {
					showItem.from = `${item.fromTime}之后`;
				}else {
					// 已过时不显示
					return null;
				}
			}else{
				showItem.from = '如果取消入住或未如期入住，酒店将收取全额订单费用';
			}
		} else if (item.type == 2) {
			showItem = {
				txt: '• 免费取消',
			};
			if(item.toTime) {
				let timeArray = re.exec(item.toTime);
				let toTime = timeArray[1] + '-' + timeArray[2] + '-' + timeArray[3] + ' ' + timeArray[4];
				let diff = moment(toTime).diff(moment(now), 'seconds');
				if(diff > 0) {
					showItem = {
						txt: '• 免费取消',
					};
					if (item.toTime) {
						showItem.to = `${item.toTime}之前`
					}
				} else {
					// 已过时不显示
					return null;
				}
			}
		} else if (item.type == 3) {
			showItem = {
				txt: '• 付费取消',
			};
			if (item.fromTime) {
				let fromTimeArray = re.exec(item.fromTime);
				let fromTime = fromTimeArray[1] + '-' + fromTimeArray[2] + '-' + fromTimeArray[3] + ' ' + fromTimeArray[4];
				let fromDiff = moment(fromTime).diff(moment(now), 'seconds');

				if(fromDiff > 0){
					// 起始点晚于当前
					showItem.from = `${item.fromTime}之后`;
					if (item.toTime) {
						showItem.to = `${item.toTime}之前取消，扣款￥${item.totalRoomAmount}`;
					} else {
						showItem.from = `${item.fromTime}后取消，扣款￥${item.totalRoomAmount}`;
					}
				} else {
					// 起始点早于当前
					if (item.toTime) {
						let toTimeArray = re.exec(item.toTime);
						let toTime = toTimeArray[1] + '-' + toTimeArray[2] + '-' + toTimeArray[3] + ' ' + toTimeArray[4];
						let toDiff = moment(toTime).diff(moment(now), 'seconds');
						if(toDiff > 0){
							// 结束晚于当前
							showItem.from = `${item.fromTime}之后`;
							showItem.to = `${item.toTime}之前取消，扣款￥${item.totalRoomAmount}`;
						}else {
							// 取消政策已过时不显示
							return null;
						}
					}else {
						showItem.from = `${item.fromTime}后取消，扣款￥${item.totalRoomAmount}`;
					}
				}

			} else {
				// 无fromTime
				if (item.toTime) {
					let toTimeArray = re.exec(item.toTime);
					let toTime = toTimeArray[1] + '-' + toTimeArray[2] + '-' + toTimeArray[3] + ' ' + toTimeArray[4];
					let toDiff = moment(toTime).diff(moment(now), 'seconds');
					if(toDiff > 0){
						// 结束晚于当前
						showItem.to = `${item.toTime}之前取消，扣款￥${item.totalRoomAmount}`;
					}else {
						// 取消政策已过时不显示
						return null;
					}
				}
			}
		}
		return (
			<div>
				{showItem.txt}
				{showItem.from ? <span>{showItem.from}</span> : null}
				{showItem.to ? <span>{showItem.to}</span> : null}
			</div>
		)
	}

	// 取消规则
	_renderCancelPolicy(data) {
		let len = data.length;
		let re = /(\d{4}).(\d{2}).(\d{2}).((\d{2}):(\d{2}):(\d{2}))/g;
		let now = moment();
		let formate = 'YYYY-MM-DD hh:mm:ss';
		let showItem = {};
		for (let i = 0; i < len; i++) {
			let item = data[i];
			let fromTime, toTime;
			if (item.type == 1) {
				if (item.fromTime) {
					let timeArray = re.exec(item.fromTime);
					fromTime = timeArray[1] + '-' + timeArray[2] + '-' + timeArray[3] + ' ' + timeArray[4];
					let diff = moment(fromTime).diff(moment(now), 'seconds');
					if (diff < 1) {
						showItem = {
							txt: '不可取消',
							from: `${item.fromTime}之后`
						};
						break;
					}
				} else {
					showItem = {
						txt: '不可取消',
					};
					break;
				}

			} else if (item.type == 2) {
				if (item.toTime) {
					let timeArray = re.exec(item.toTime);
					toTime = timeArray[1] + '-' + timeArray[2] + '-' + timeArray[3] + ' ' + timeArray[4];
					let diff = moment(toTime).diff(moment(now), 'seconds');
					if (diff > 0) {
						showItem = {
							txt: '免费取消',
							to: `${item.toTime}之前`
						};
						break;
					}
				} else {
					showItem = {
						txt: '免费取消',
					};
					break;
				}
			} else if (item.type == 3) {
				let fromDiff, toDiff;
				if (item.fromTime) {
					let timeArray = re.exec(item.fromTime);
					fromTime = timeArray[1] + '-' + timeArray[2] + '-' + timeArray[3] + ' ' + timeArray[4];
					fromDiff = moment(fromTime).diff(moment(now), 'seconds');
				}
				if (item.toTime) {
					let timeArray = re.exec(item.toTime);
					toTime = timeArray[1] + '-' + timeArray[2] + '-' + timeArray[3] + ' ' + timeArray[4];
					toDiff = moment(toTime).diff(moment(now), 'seconds');
				}

				if (fromDiff != undefined && fromDiff < 1) {
					if (toDiff == undefined) {
						// 无底线
						showItem = {
							txt: '付费取消',
							from: `${item.fromTime}后取消，扣款￥${item.totalRoomAmount}`
						};
						break;
					} else if (toDiff > 0) {
						// 在此时间段以内
						showItem = {
							txt: '付费取消',
							from: `${item.fromTime}之后取消`,
							to: `${item.fromTime}之前取消，扣款￥${item.totalRoomAmount}`
						};
						break;
					}
				}
			}
		}

		return (
			<span>
				{showItem.txt}
				{showItem.from ? <span>{showItem.from}</span> : null}
				{showItem.to ? <span>{showItem.to}</span> : null}
			</span>
		)
	}

	// 展开更多房型
	_showRoom(rowClass, key) {
		// debugger;
		let old = this.state.openClass[key];
		let cls = old ==  rowClass ? '' : rowClass;
		this.state.openClass[key] = cls;
		this.setState({
			openClass: this.state.openClass
		})
	}

	// 获取room row class
	_getRoomRowClass(room){
		// room.rowClass = `room-${index}`;
		// room.matrix = `room-${index}-${roomIndex}`;
		room.row1 // HBC room row
		room.row2 // 渠道 room row
		room.rowClass = `room-${room.row1}-${room.row2}`;
	}

	_getRoomFilter(arr, breakfast, cancel){
		// debugger;
		if(!arr) return;
		let res = [];
		breakfast = breakfast === null ? this.state.hasBreakfast : breakfast;
		cancel = cancel === null ? this.state.canCancel : cancel;
		arr.forEach((val,index)=>{
			 let resObj = {
				 roomName : val.roomName
			 };
			 resObj.quoteItems = Object.assign(val.quoteItems.filter((item)=>{
			 	let hasBreakfast = true, hasCancel = true;
				if(breakfast && item.breakfastTypeId !== 1){
					hasBreakfast = false;
				}
				if(cancel && item.cancelableStatus !== 1){
					hasCancel = false;
				 }
				 if(breakfast && cancel ) return  hasBreakfast && hasCancel;
				 if(breakfast) return hasBreakfast;
				 if(cancel) return hasCancel;
				 return true;
			}));
			res.push(resObj);

		});
		return res
	}

	_renderRoomRows() {

		if(this.state.roomInfo && this.state.roomInfo.rooms && this.state.roomInfo.rooms.length) {
			return (
				this.state.roomInfo.rowInfo.map((row, rowkey)=>{
					let room = this.state.roomInfo.rooms[row.roomIndex];
					if(row.isBtn) {
						return (
							<tr key={`btn-${row.row1}`}>
								<td colSpan="8" className="show-btn"><Button onClick={this._showRoom.bind(this, row.rowClass, row.row1)}>{this.state.openClass[row.row1]!=row.rowClass? `展开更多${row.childNum - row.showNum}种价格`: '收起'}</Button></td>
							</tr>
						)
					} else if (row.childNum){
						return (
							<tr key={`${rowkey}-${room.quoteId}`} className={`${row.rowClass}`}>
								<td className="room-name" rowSpan={this.state.openClass[row.row1]==row.rowClass?row.childNum: row.showNum}>{row.roomName}</td>
								<td className="room-vendor max-15em">{room.vendorRoomName}</td>
								<td className="bed">{room.bedTypeName && room.bedTypeName.replace(/\s+/g, '')}</td>
								<td className="breakfast">{room.breakfastTypeName}</td>
								<td className="cancel-policy">{this._renderCancelPolicy(room.channelCancelPolicys)}
									<div className="cancel-inner">
									{
										room.channelCancelPolicys.map((item,key)=>{
											return (
												<p key={key}>{this._renderAllCancelPolicy(item)}</p>
											)
										})
									}</div>
								</td>
								<td className="per-price"><span className="cn-yen">{room.perDayPriceOneRoom}</span></td>
								<td className="total"><span className="cn-yen">{room.totalRoomPrice}</span><br/><span className="local-price">{room.currency}:{room.totalRoomPriceLocal}</span></td>
								<td className="action"><Button className="book-btn" onClick={this._booking.bind(this, room)} loading={this.state.isBookLoading && this.state.isBooking == room.quoteId}>预订</Button></td>
							</tr>
						)
					} else {
						return (
							<tr key={`${rowkey}-${room.quoteId}`} className={`${row.rowClass} ${this.state.openClass[row.row1]!=row.rowClass && row.hide ? 'room-hide':''}`}>
								<td className="room-vendor max-15em">{room.vendorRoomName}</td>
								<td className="bed">{room.bedTypeName && room.bedTypeName.replace(/\s+/g, '')}</td>
								<td className="breakfast">{room.breakfastTypeName}</td>
								<td className="cancel-policy">{this._renderCancelPolicy(room.channelCancelPolicys)}
									<div className="cancel-inner">
									{
										room.channelCancelPolicys.map((item,key)=>{
											return (
												<p key={key}>{this._renderAllCancelPolicy(item)}</p>
											)
										})
									}</div></td>
								<td className="per-price"><span className="cn-yen">{room.perDayPriceOneRoom}</span></td>
								<td className="total"><span className="cn-yen">{room.totalRoomPrice}</span><br/><span className="local-price">{room.currency}:{room.totalRoomPriceLocal}</span></td>
								<td className="action"><Button className="book-btn" onClick={this._booking.bind(this, room)} loading={this.state.isBookLoading && this.state.isBooking == room.quoteId}>预订</Button></td>
							</tr>
						)
					}
				})
			)
		} else {
			return (
				<tr>
					<td colSpan="8" className="non-room">抱歉！您所查询的酒店暂没有合适报价或已满房，建议选择其他酒店查询实时报价。</td>
				</tr>
			)

		}
	}
	_renderRooms() {
		return (
			<table>
				<thead>
					<tr>
						<th colSpan="2">房型信息</th>
						<th className="room-vendor">床型</th>
						<th className="bed">早餐</th>
						<th className="breakfast">取消规则</th>
						<th className="per-price">均价/间/晚</th>
						<th className="total">{this.state.days}晚含税总价<br/>／当地货币</th>
						<th className="action"></th>
					</tr>
				</thead>
				{
					this.state.loading?
						<tbody>
							<tr className="progress-wrap">
								<td className="progress" colSpan="8">
									<SimulateProgrss auto={true} stop={80}/>
								</td>
							</tr>
							<tr><td className="tac" colSpan="8"><Spin tip="加载中，请稍后"></Spin></td></tr>
						</tbody> :
						<tbody>
							{this._renderRoomRows()}
						</tbody>
				}
				<tfoot></tfoot>
			</table>
		)
	}



	// fix-nav
	_scroll(section) {
		let ref,ele,offsetTop,scrollTop,top;
		let refs = this.refs;

		switch(section) {
			case 'roomPriceSection':
				ref = refs.roomPriceSection;
				break;
			case 'descriptionSection':
				ref = refs.descriptionSection;
				break;
			case 'facilitiesSection':
				ref = refs.facilitiesSection;
				break;
			case 'roomSection':
				ref = refs.roomSection;
				break;
			case 'bookSection':
				ref = refs.bookSection;
				break;
		}
		scrollTop = this._state.wrap.scrollTop;
		top = 128;
		offsetTop = ref.offsetTop;
		this.setState({
			activeNav: section
		}, ()=> {
			this._state.wrap.scrollTop = offsetTop - top;
		})
	}

	// fix-nav
	_scrollHandle() {
		let top = 128;
		let range = 80;
		let activeNav = 'roomPriceSection';
		let refsInfo = [];
		let scrollTop = this._state.wrap.scrollTop;

		!this.navScrollTop && (this.navScrollTop = scrollTop);

		let dir = 'B';
		if(this.navScrollTop > scrollTop) {
			dir = 'T';
		}

		this.navScrollTop = scrollTop;
		this.refs.roomPriceSection && (refsInfo.push({key: 'roomPriceSection', offsetTop: this.refs.roomPriceSection.offsetTop, offsetHeight: this.refs.roomPriceSection.offsetHeight}));
		this.refs.descriptionSection && (refsInfo.push({key: 'descriptionSection', offsetTop: this.refs.descriptionSection.offsetTop, offsetHeight: this.refs.descriptionSection.offsetHeight}));
		this.refs.facilitiesSection && (refsInfo.push({key: 'facilitiesSection', offsetTop: this.refs.facilitiesSection.offsetTop, offsetHeight: this.refs.facilitiesSection.offsetHeight}));
		this.refs.roomSection && (refsInfo.push({key: 'roomSection', offsetTop: this.refs.roomSection.offsetTop, offsetHeight: this.refs.roomSection.offsetHeight}));
		this.refs.bookSection && (refsInfo.push({key: 'bookSection', offsetTop: this.refs.bookSection.offsetTop, offsetHeight: this.refs.bookSection.offsetHeight}));


		let len = refsInfo.length;
		if (len > 1) {
			for(let i = 0; i<len; i++){
				let item = refsInfo[i];

				if(dir == 'B') {
					if(scrollTop + top < item.offsetTop + item.offsetHeight) {
						activeNav = item.key;
						break;
					}
					if(scrollTop + top > refsInfo[len-1].offsetTop - (refsInfo[len - 2].offsetHeight > range ? refsInfo[len - 1].offsetHeight / 2 : range/2)) {
						activeNav = refsInfo[len-1].key;
					}

				} else {
					if(i < len -1) {
						if(scrollTop + top < refsInfo[i + 1].offsetTop - (item.offsetHeight > range ? range : item.offsetHeight / 2) && scrollTop + top > item.offsetTop - (refsInfo[len - 1].offsetHeight > range ? range : refsInfo[len - 1].offsetHeight / 2)) {
							activeNav = item.key;
							break;
						}
					} else {
						if(scrollTop + top > refsInfo[i - 1].offsetTop + (refsInfo[len - 1].offsetHeight > range ? refsInfo[len - 1].offsetHeight / 2 : range/2)) {
							activeNav = item.key;
						}
					}
				}
			}
		}

		if (this._state.activeNav == activeNav) {
			return;
		}

		this._state.activeNav = activeNav;
		if (this.state.activeNav != activeNav) {
			this.setState({
				activeNav: activeNav
			});
		}
	}

	_getReal(imgArr){
		var real = false;
		imgArr.forEach((item, key) => {
			if(item.imageUrl) real = true;
		});
		return real;
	}
	_showHotelAblum(index) {
		if (!this.props.info.hotelImages.length) {
			return;
		}
		let imgIndex = (this.props.info.hotelImages.length > index + 1)? index: 0;
		this.props.doSomething({type: 'showAblum', index: imgIndex});
	}
	selectCountry(val,object){
		this.setState({
			countryCode : object
		})
	}
	onChangeCheck(tag,e){
		// debugger;
		if(tag === 'hasBreakfast'){
			this.setState({
				hasBreakfast : e.target.checked,
				roomInfo : this._roomInfos(this.ORIROOM, e.target.checked, null)
			});

		}
		if(tag === 'canCancel'){
			this.setState({
				canCancel : e.target.checked,
				roomInfo : this._roomInfos(this.ORIROOM, null, e.target.checked)
			})
		}

	}
    render() {

    	return (
    		<div className="ui-hotel-main">
    		{this._state.baseInfo?
				<div className="base-info clearfix">
					<div className="info">
						<div className="grade-info">
						{(this._state.baseInfo.hotelVo && this._state.baseInfo.hotelVo.commentRating)?
							<div className='mty'>
		                      <Score num={this._state.baseInfo.hotelVo.commentRating} half={true} width={66}/>
		                    </div>: null}
	                    </div>
	                    <div className={this._state.baseInfo.hotelVo.askingPrice == 0 ? 'price no-price' : 'price'}>
	                    	{
	                    		this._state.baseInfo.hotelVo.askingPrice == 0 ?
	                    		<span className="cn-yen">暂无最低价</span>:
	                    		<span className="cn-yen">{this._state.baseInfo.hotelVo.askingPrice}</span>
	                    	}
	                    </div>
						<div className="cnname">{this._state.baseInfo.hotelVo.name}
							{(this._state.baseInfo.hotelVo && this._state.baseInfo.hotelVo.starRating)? <Stars score={this._state.baseInfo.hotelVo.starRating}/> : null}
						</div>
						<div className="enname">{this._state.baseInfo.hotelVo.nameEn}</div>
						<div className="addr">{this._state.baseInfo.hotelVo.address?`地址：${this._state.baseInfo.hotelVo.address}`:""}</div>
						{
							this._getReal(this._state.baseInfo.hotelImages) ?
		                    <div className="img-wrap">
		                    	<div className="img-num">{this.props.info.hotelImages.length}</div>
		                    	{
		                    		this._state.baseInfo.hotelImages.map((item, index)=>{
			                    		return (
												<div key={`detail-img-${index}`} className={`img img${index+1}`} style={{backgroundImage: item.imageUrl? `url(${item.imageUrl})` : 'none'}} onClick={this._showHotelAblum.bind(this, index)}></div>
		                    			)
			                    	})
			                    }
							</div>: <div className="img-wrap img-empty"></div>
						}
						<div className="map-container">
							<UIMap list={this.getHotelPosition()} markerSelIndex={0}/>
						</div>
					</div>
				</div> : null
			}
			<div className="room-nav-fixed">
			<Affix target={() => this._state.wrap} offsetTop={68} onChange={affixed => {this.setState({
			affixed: affixed
			})}}>
				<ul>
					<li className={!this.state.activeNav || this.state.activeNav == 'roomPriceSection'?'active': ''} onClick={this._scroll.bind(this, 'roomPriceSection')}>预订房型</li>
					{
						this._state.baseInfo && this._state.baseInfo.hotelDescription && this._state.baseInfo.hotelDescription.description?
						<li className={this.state.activeNav == 'descriptionSection'?'active': ''} onClick={this._scroll.bind(this, 'descriptionSection')}>酒店介绍</li>: null
					}
					{
						this._state.baseInfo &&  this._state.baseInfo.hotelFacilities && this._state.baseInfo.hotelFacilities.length?
						<li className={this.state.activeNav == 'facilitiesSection'?'active': ''} onClick={this._scroll.bind(this, 'facilitiesSection')}>酒店设施</li>:null
					}
					{
						this._state.baseInfo &&  this._state.baseInfo.roomFacilities &&  this._state.baseInfo.roomFacilities.length?
						<li className={this.state.activeNav == 'roomSection'?'active': ''} onClick={this._scroll.bind(this, 'roomSection')}>房间设施</li>: null
					}
					{
						this._state.baseInfo &&  this._state.baseInfo.hotelPolicies && Object.keys(this._state.baseInfo.hotelPolicies).length > 0?
						<li className={this.state.activeNav == 'bookSection'?'active': ''} onClick={this._scroll.bind(this, 'bookSection')}>酒店政策</li>: null
					}
				</ul>
			</Affix>
			</div>

			<div className="rooms-info from-group" id="roomPriceSection" ref="roomPriceSection">
				<div className="room-search">
					<DatePickerGroup placeholder={['请选择入住日期', '请选择离店日期']} step={1} defaultValue={this.dateInit} disabledDate={1} onHandle={this._cbSelectDate.bind(this)}/>
					<RoomSelect {...this.roomInit}/>
    				<GuestSelect initData={this.guestInit} outsideClickIgnoreClass={'ant-select-dropdown'}/>
    				<CountrySelect selectCountry={this.selectCountry.bind(this)}/>
					<span className="button-group">
    					<Button type='submit' className='btn-default' loading={this.state.isSearchLoading} onClick={this._search.bind(this)}>搜索</Button>
    				</span>

				</div>
				<div className="check-group">
					<Checkbox onChange={this.onChangeCheck.bind(this,'hasBreakfast')} checked={this.state.hasBreakfast}>仅看含早餐</Checkbox>
					<Checkbox onChange={this.onChangeCheck.bind(this,'canCancel')} checked={this.state.canCancel}>仅看可取消</Checkbox>
				</div>
				<div className="rooms-table">
				{this._renderRooms()}
				</div>
			</div>
			{this._renderHotelDescription()}
			{this._renderFacilities()}
			{this._renderRoomDes()}
			{this._renderPolicies()}
			{this.state.isOnPriceError && this.priceErrInfo? <Msg  initData={this.priceErrInfo}><div dangerouslySetInnerHTML={{__html: this.priceErrInfo.content}}></div></Msg> : null}
			{this.state.isSearchLoading?<YdjAjax queryAttr={this.roomQueryAttr} successHandle={this._cbRoomSuccess.bind(this)} bErrorHandle={()=>{this.setState({isSearchLoading: false,})}} queryData={this.roomQueryData} />:null}
		    {this.state.isBookLoading?<YdjAjax queryAttr={this.checkQueryAttr} successHandle={this._cbCheckSuccess.bind(this)} bErrorHandle={()=>{this.setState({isBookLoading: false,isBooking: ''})}} queryData={this.checkQueryData} />:null}

		</div>
		)
    }
}
const mapStateToProps = (state) => {
	// debugger
  return {
    header: state.header
  }
}

export default connect(mapStateToProps)(UiHotelDetail);

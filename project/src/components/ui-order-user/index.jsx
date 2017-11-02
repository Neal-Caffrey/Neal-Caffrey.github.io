import React, {Component, PropTypes} from "react";
import Marks from 'components/ui-mark/index.jsx';
import ApiConfig from "widgets/apiConfig/index.js";
import Message from 'components/ui-msg/index.jsx';
import Storage from 'local-Storage/dist/main.js';
import AreaCode from "components/ui-code/index.jsx";
import Request from "local-Ajax/dist/main.js";
import Submit from 'components/ui-submit/index.jsx';
import House from 'components/ui-house/index.jsx';
import Input from 'components/ui-input/index.jsx';
import FromOrder from "./js/index.jsx";
import userCss from "./sass/index.scss";
const $ = window.jQuery || window.$;
const ORDERADD = ApiConfig.orderAdd;
const ORDERCHECK = ApiConfig.checkRoomPrice;
const APPINFO = ApiConfig.storageKey.hotel_app_info;
const DETAILDATA = ApiConfig.storageKey.hotel_detail_data;
class UIOrderUser extends Component {
	static propTypes = {
		info : PropTypes.object
	}
	constructor(props, context) {
		super(props, context);
		this.request;
		this.storage;
		this.defaultObj = this.defaultState;
		this.state= {
			isLoading : false,
			msgOpt : null,
			confirmOpt : null
		}

	}

	get request(){
		return this._request = new Request();
	}

	get defaultState(){
		const { info } = this.props;

		let obj =  {
			isForm : false,
			isLoading : false,
			forms : FromOrder,
			msgOpt : null,
			detailData : info || this._storage.get(DETAILDATA),
			appInfo : this._storage.get(APPINFO),
		};
		let _forms = obj.forms;
		// if(obj.appInfo.agentInfo.industryType == 3) {
		if(obj.appInfo.agentInfo.industryType != 7 && obj.appInfo.agentInfo.industryType != 5 && obj.appInfo.agentInfo.industryType != 2) {
			_forms.priceTicket.reg = true;
			obj.forms = _forms;
		}

		//初始化联系人信息
        if(obj.appInfo.agentInfo && obj.appInfo.agentInfo.agentUserName){
            obj.forms.hotelContactInfo.contactName.reg = true;
            obj.forms.hotelContactInfo.contactName.val = obj.appInfo.agentInfo.agentUserName;
        }
        if(obj.appInfo.agentInfo && obj.appInfo.agentInfo.agentUserPhone){
            obj.forms.hotelContactInfo.contactMobile.reg = true;
            obj.forms.hotelContactInfo.contactMobile.val = obj.appInfo.agentInfo.agentUserPhone;
        }
        if(obj.appInfo.agentInfo && obj.appInfo.agentInfo.agentUserEmail){
            obj.forms.hotelContactInfo.contactEmail.reg = true;
            obj.forms.hotelContactInfo.contactEmail.val = obj.appInfo.agentInfo.agentUserEmail;
        }
		console.log('order defaultState', JSON.stringify(obj));
		return obj
	}

	get storage() {
		return this._storage = new Storage(DETAILDATA);
	}

	get isForm(){
		return this.defaultObj.isForm;
	}

	get appInfo(){
		return this.defaultObj.appInfo;
	}

	get forms(){
		return this.defaultObj.forms;
	}
	set forms(obj){
		// this.forms = obj;
	}

	get detailData(){
		return this.defaultObj.detailData;
	}

	get hotelContactInfo(){
		return this.forms.hotelContactInfo;
	}

	get customerRequest(){
		return this.forms.customerRequest;
	}
	get isLoading(){
		return this.state.isLoading;
	}
	get msgOpt(){
		return this.state.msgOpt;
	}

	get confirmOpt(){
		return this.state.confirmOpt;
	}

	submits(){
		
		if(this.state.isForm) this.postForm();
	}

	getRealVal(obj){
		let _obj = {};
		for(let n in obj){
			_obj[n] = obj[n].val;
		}
		return _obj;
	}

	getRealGuestInfo(info, val){
		info.forEach((item, key) => {
			try{delete item.reg} catch(e){item.reg = null};
		});
		return info;
	}

	setData(){
		// debugger
		let _forms = this.forms;
		let _detailData = this.detailData;
		let _info = this.appInfo;
		debugger
		return {
			agentOrderNo : _forms.agentOrderNo,
			vendorId : _detailData.vendorId,
			vendorName : _detailData.vendorName,
			// priceChannel : _detailData.priceChannel || _detailData.totalRoomAmount || _detailData.totalPrice,
			priceChannel : _detailData.priceChannel || _detailData.totalRoomPrice,
			totalPrice: _detailData.totalPrice,
			totalRoomPrice: _detailData.totalRoomPrice,
			priceTicket : _forms.priceTicket.val,
			orderChannel : _info.agentInfo.agentId,
			orderChannelName : _info.agentInfo.agentName,
			ratePlanId : _detailData.ratePlanId,
			quoteMark: _detailData.quoteMark,
			checkinDate : _detailData.checkinDate,
			checkoutDate : _detailData.checkoutDate,
			numOfRooms : _detailData.numOfRooms,
			numOfStay : _detailData.numOfStay,
			adultNum : _detailData.adultNum,
			childNum : _detailData.childNum,
			customerRequest : _forms.customerRequest,
			hotelId : _detailData.hotelId,
			roomBedBreakfastInfo : _detailData.roomBedBreakfastInfo,
			hotelContactInfo : this.getRealVal(_forms.hotelContactInfo),
			childAgeList : _detailData.childAges,
			roomGuestList : this.getRealGuestInfo(_forms.roomGuestInfo),
			optId : _info.agentInfo.agentUserId,
			optName : _info.agentInfo.agentUserName,
			channelCancelPolicys : _detailData.hotelCancelPolicy, // 展示用
			cancelPolicys : _detailData.checkCancelPolicy, // 验价用
			hotelVersion : _detailData.hotelVersion,
			guestNationalityCode : _detailData.countryObj.code,
			guestNationalityName : _detailData.countryObj.countryName,

		};
	}

	setCancel(cel){
		cel = typeof cel == 'object' ? cel : JSON.parse(cel);
		let _cel = [];
		cel.forEach((item, key) => {
			if(item.type == 1) _cel.push('<em>【不可取消】</em>');
			if(item.type == 2) _cel.push('<em>【' + item.toTime + '前免费取消】</em>');
			if(item.type == 3) _cel.push('<em>【 ' + item.fromTime + '后取消，扣款￥' + item.amount +'】</em>');
		});
		return _cel;
	}

	setPriceData(){
		// debugger
		let _detailData = this.detailData;
		
		return {
			'hotelQuoteItem': {
				'vendorId': _detailData.vendorId,
				'vendorName': _detailData.vendorName,
				'vendorRoomName': _detailData.roomBedBreakfastInfo.roomTypeName,
				'bedTypeId': _detailData.roomBedBreakfastInfo.bedType,
				'bedTypeName': _detailData.roomBedBreakfastInfo.bedTypeName,
				'breakfastTypeId': _detailData.roomBedBreakfastInfo.breakfastType,
				'breakfastTypeName': _detailData.roomBedBreakfastInfo.breakfastTypeName,

				'cancelPolicys': _detailData.checkCancelPolicy,
				'totalPrice': _detailData.totalPrice
			},
		    'adultNum': _detailData.adultNum,
		    'childAges': _detailData.childAges,
		    'checkInDate': _detailData.checkinDate,
		    'checkOutDate': _detailData.checkoutDate,
		    'hotelId': _detailData.hotelId,
		    'quoteMark': _detailData.quoteMark,
		    'quoteId': _detailData.ratePlanId,
		    'roomNum': _detailData.numOfRooms,
		    'countryCode' : _detailData.countryObj.code
		}
	}



	checkPrice(){
		// debugger
		let opt = {
			url : ORDERCHECK,
			type : 'POST',
			data : JSON.stringify(this.setPriceData()),
			headers : {
				'Content-Type' : 'application/json',
			}
		};
		return this._request.ajax(opt);
	}

	addForm(opts = {}){
		debugger
		let datas = JSON.stringify(Object.assign(this.setData(), opts));
		console.log('addForm', datas);
		let opt ={
			url : ORDERADD,
			type : 'POST',
			// data : JSON.stringify(Object.assign(this.setData(), opts)),
			data : datas,
			headers : {
				'Content-Type' : 'application/json',
			}
		};
		return this._request.ajax(opt);
	}

	postForm(){
		
		this.setState({
			isLoading : true,
		})
		this.checkPrice()
		.then((res) => {
			debugger
			console.log('checkPrice1', JSON.stringify(res));
			if(res.status == 200 && res.data){
				console.log('postForm', JSON.stringify(res));
				
				let _confirm = res.data.confirmQuoteItem;
				let _detailData = this.detailData;
				switch(res.data.status){
					case 0:
						return {
							msg : '',
							status : true,
							change : {}
						};
						break;
					case 1:
						return {
							msg : `房间总价已发生变化，最新房价已变为<em>￥${res.data.confirmQuoteItem.totalRoomPrice}</em>。是否继续?`,
							status : false,
							change : {priceChannel : res.data.confirmQuoteItem.totalRoomPrice, totalPrice: res.data.confirmQuoteItem.totalPrice, totalRoomPrice: res.data.confirmQuoteItem.totalRoomPrice}
						};
						break;
					case 2:
						return {
							status : false,
							msg : `该房型已变为<em>【${res.data.confirmValue}】</em>。是否继续？`,
							change : {roomBedBreakfastInfo : Object.assign(_detailData.roomBedBreakfastInfo, {roomTypeName : res.data.confirmValue})}
						}
						break;
					case 3:
						return {
							status : false,
							msg : `该房间的床型已变为<em>【${_confirm.bedTypeName}】</em>。是否继续？`,
							change : {roomBedBreakfastInfo : Object.assign(_detailData.roomBedBreakfastInfo, {bedTypeName : _confirm.bedTypeName})}
						};
						break;
					case 4:
						return {
							status : false,
							msg : `该房型的早餐情况已变为<em>【${res.data.confirmValue == 1 ? '含早餐' : '不含早'}】</em>。是否继续？`,
							change : {roomBedBreakfastInfo : Object.assign(_detailData.roomBedBreakfastInfo, {breakfastType : res.data.confirmValue})}
						}
						break;
					case 5:
						return {
							status : false,
							msg : `该房型的取消政策已发生变化，最新政策为：${this.setCancel(_confirm.channelCancelPolicys)}。是否继续？`,
							change : {orderCancelPolicys : _confirm.channelCancelPolicys}
						}
						break;
				}
			} else {
				debugger
				this.setState({
					msgOpt : {
						content: res.message || '下单失败，请返回酒店详情页重新下单或联系客服人员',
						showFlag: true,
						showType: 'alert',
						title: '错误',
						backHandle : ()=>{this.setState({msgOpt:{content:'',showFlag:false}})}
					}
				});
			}
		})
		.then((check) => {
			console.log('checkPrice2', JSON.stringify(check));
			if(!check) return null;
			if(check.status) return this.addForm();
			else {
				this.setState({
					confirmOpt : {
						content: check.msg || '下单失败，请联系客服人员',
						showFlag: true,
						showType: 'confirm',
						title: '提醒',
						disabled : true,
						backHandle : this.confirm.bind(this, check)
					}
				});
				return null;
			}
		})
		.then((res) => {
			console.log('checkPrice3', JSON.stringify(res));
			if(!res) return null;
			this.setState({
				isLoading : false,
			});
			this.actionForm(res);
		}, (err) => {
			console.log('checkPrice4', JSON.stringify(err));
			debugger
			this.setState({
				msgOpt : {
					content: err.message || '下单失败，请联系客服人员',
					showFlag: true,
					showType: 'alert',
					title: '错误',
					backHandle : ()=>{this.setState({msgOpt:{content:'',showFlag:false}})}
				}
			});
		});

	}

	confirm(check, type){
		this.setState({
			isLoading : false,
			confirmOpt : {
				showFlag: false,
			}
		})
		debugger
		switch(type){
			case 'close':
			case 'cancel':
				break;
			case 'confirm':
			case 'ok':
				this.addForm(check.change)
				.then((res) => {
					console.log('actionForm', JSON.stringify(res));
					this.actionForm(res);
				});
				break;
		}
	}

	actionForm(res){
		debugger
		console.log('actionForm', JSON.stringify(res));
		if(res.status == 200){
				window.location.href = `/webapp/hotel/orderDetail.html?orderNo=${res.data}`;
		}else{
			this.setState({
				msgOpt : {
					content: res.message || '下单失败，请联系客服人员',
					showFlag: true,
					showType: 'alert',
					title: '下单',
					backHandle : ()=>{this.setState({msgOpt:{content:'',showFlag:false}})}
				}
			});
		}
	}

	checkForm(){
		let _forms = this.forms;
		let _isForm = true;
		let info = null;
		for(let i in _forms){
			if(i == 'hotelContactInfo'){
				info = _forms[i];
				if(info instanceof Array && info.length == 0){
                    _isForm = false;
				}else{
                    for(let j in info){
                        if(info[j].reg === false){
                            _isForm = false;
                            // return;
                        }
                    }
				}
			}else if(i == 'roomGuestInfo'){
				// debugger
				info = _forms[i];
				if(info instanceof Array && info.length == 0){
                    _isForm = false;
				}else{
                    for(let j in info){
                    	let room = info[j]; // room
                    	let guests = room.guestList; // guest
                    	// debugger
                    	if(guests instanceof Array && guests.length == 0){
		                    _isForm = false;
						}else {
							// debugger
							for(let m in guests) {
								if(guests[m].reg === false){
		                            _isForm = false;
		                        }
							}
						}  
                    }
				}

			}else if(_forms[i].reg != undefined){
				if(_forms[i].reg === false ){
					_isForm = false;
					// return;
				}
			}
		}
		if(_isForm){
            _isForm = !!$('[name="is_reade"]').is(":checked");
		}
		if(_isForm !== this.state.isForm){
			this.setState({
				isForm : _isForm,
			});
		}

		//@TODO check ok
	}

	getRoomGuestInfo(house) {
		let _forms = this.forms;
		let arr = [];
		house.forEach((item, key) => {
			let guests = [];
			item.guest.forEach((guest, key)=> {
				// debugger
				guests.push({
					reg: !guest.fames.error && !guest.names.error,
					firstName: guest.names.value.toUpperCase(),
					lastName: guest.fames.value.toUpperCase(),
				})
			})
			arr.push({
				roomNum: item.room + 1,
				guestList: guests
			});
		});

		Object.assign(_forms.roomGuestInfo, arr);
		this.forms = _forms;
		// debugger
		this.checkForm();
		// this.setState({
		// 	forms : _forms,
		// }, this.checkForm);
	}

	getPriceTicket(price){
		let _forms = this.forms;
		Object.assign(_forms, {
			priceTicket : {
				reg : !price.error,
				val : price.value,
			}
		});
		this.forms = _forms;
		this.checkForm();
	}

	getAgentOrderNo(no){
		let _forms = this.forms;
		Object.assign(_forms, {
			agentOrderNo : no.value,
		});
		this.forms = _forms;
		this.checkForm();
		// this.setState({
		// 	forms : _forms,
		// }, this.checkForm);
	}

	getCustomerRequest(mark){
		let _forms = this.forms;
		Object.assign(_forms, {
			customerRequest : mark.value,
		})
		this.forms = _forms;
		this.checkForm();
	}


	getContactInfo(info){
		let _forms = this.forms;
		switch(info.name){
			case 'linkname':
				Object.assign(_forms.hotelContactInfo, {
                    contactName : {
					 	reg  : !info.error,
					 	val : info.value,
					 }
				 });
				break;
			case 'linkcode':
				Object.assign(_forms.hotelContactInfo, {
			 		contactAreaCode : {
					 	reg  : !info.error,
					 	val : info.code.areaCode,
					 }
				 });
				break;
			case 'linkphone':
				Object.assign(_forms.hotelContactInfo, {
			 		contactMobile : {
					 	reg  : !info.error,
					 	val : info.value,
					 }
				 });
				break;
			case 'linkemail':
				Object.assign(_forms.hotelContactInfo, {
			 		contactEmail : {
					 	reg  : !info.error,
					 	val : info.value,
					 }
				 });
				break;
		}
		// this.setState({
		// 	forms : _forms
		// }, this.checkForm);
		this.forms = _forms;
		this.checkForm();
	}

	render(){

		return (
			<div className='ui-order-user'>
				<div className='ui-user-list'>
					<h5>住客信息</h5>
					<dl className='line num-info'>
						<dt>入住人数</dt>
						<dd>
							{this.detailData.adultNum}成人&nbsp;&nbsp;{this.detailData.childNum}儿童（{this.detailData.numOfRooms}间）
						</dd>
					</dl>
					<dl className='line country-info'>
						<dt>国籍</dt>
						<dd>
							{this.detailData.countryObj.countryName}
						</dd>
					</dl>
					<House
					number={this.detailData.numOfRooms}
					onHandle={this.getRoomGuestInfo.bind(this)}
					max={this.detailData.adultNum}>
					</House>
					<dl>
						<dt className='tops'>
							入住说明
						</dt>
						<dd>
							<p>1.客人国籍：如实际入住人与订单国籍不符，可能导致无法入住。</p>
							<p>2.入住人数：每间房间价格仅适用于<em>{this.detailData.adultNum}成人</em> <em>{this.detailData.childNum}儿童</em>，如果实际入住人数与订单不符，需客人与酒店前台协商解决。</p>
							<p>3.入住人姓名：请务必按照实际入住人证件上的英文/拼音姓名填写。</p>
							<p>4.主入住人：办理入住时，酒店以此姓名进行预订查询，如填写错误酒店查无预订会导致客人无法入住。</p>
							<p>5.其他入住人：其他入住人姓名仅在入住凭证上展示，不能独自到酒店办理入住。</p>
						</dd>
					</dl>
					<dl>
						<dt className='tops'>
							特殊需求
						</dt>
						<dd>
							<Marks
							placeholder='其他要求会发送到酒店，但无法保证一定满足，实际以酒店当天安排为准。请使用英文填写'
							onHandle={this.getCustomerRequest.bind(this)}
							name='userMark'
							/>
						</dd>
					</dl>
					{
						/*
						酒店 票面价填写：
							1.API ：非必填
							2.SKU：必填
							3.云地接：非必填
							4.其他：非必填
							5.CAPP：必填
							6.二转：非必填
							7.天猫：必填
							8.分销：
						 */
						(this.appInfo.agentInfo.industryType == 7 || this.appInfo.agentInfo.industryType == 5 || this.appInfo.agentInfo.industryType == 2 ) &&
						<dl>
							<dt>
								票面价
							</dt>
							<dd className="userprice-wrap">
								<del className='fixed'>*</del>
								<code className="hack-code-display">&yen;</code>
								<Input
								className='price'
								name='userprice'
								sign='票面价'
								placeholder='票面价'
								onHandle={this.getPriceTicket.bind(this)}
								reg={/^\d+$/}
								/>
								<s>用于显示给客人，建议修改为实付金额</s>
							</dd>
						</dl>
					} 
					{
						(this.appInfo.agentInfo.industryType != 7 && this.appInfo.agentInfo.industryType != 5 && this.appInfo.agentInfo.industryType != 2) &&
						<dl>
							<dt>
								票面价
							</dt>
							<dd className="userprice-wrap">
								<del className='fixed'></del>
								<code className="hack-code-display">&yen;</code>
								<Input
								className='price'
								name='userprice'
								sign='票面价'
								placeholder='票面价'
								onHandle={this.getPriceTicket.bind(this)}
								/>
								<s>用于显示给客人，建议修改为实付金额</s>
							</dd>
						</dl>
					}
					<dl>
						<dt>
							第三方订单号
						</dt>
						<dd className="usernumber-wrap">
							<Input
							name='usernumber'
							onHandle={this.getAgentOrderNo.bind(this)}
							maxLength={100}
							placeholder='记录您在其它平台的订单号，多个以“，”间隔'
							className='order'/>
						</dd>
					</dl>
				</div>
				<div className='ui-user-list'>
					<h5>联系人信息</h5>
					<dl>
						<dt>
							姓名
						</dt>
						<dd className="linkname-wrap">
							<del className='fixed'>*</del>
							<Input
							labelClass='ui-input margin'
							className='linkname'
							name='linkname'
							onHandle={this.getContactInfo.bind(this)}
							value={this.appInfo.agentInfo ? this.appInfo.agentInfo.agentUserName : null}
							reg={/^[^\s]+$/}
							sign='姓名'
							placeholder='姓名'/>
						</dd>
					</dl>
					<dl>
						<dt>
							电话
						</dt>
						<dd className="linkphone-wrap">
							<del className='fixed'>*</del>
							<AreaCode
							labelClass='ui-input margin'
							className='code'
							onHandle={this.getContactInfo.bind(this)}
							/>
							<Input
							className='price'
							name='linkphone'
							sign='手机号'
							reg={/^\d+$/}
							onHandle={this.getContactInfo.bind(this)}
							placeholder='手机号'
							value={this.appInfo.agentInfo ? this.appInfo.agentInfo.agentUserPhone : null}
							/>
							<s>*酒店预订成功后会发送短信通知</s>
						</dd>
					</dl>
					<dl>
						<dt>
							邮箱
						</dt>
						<dd className="linkemail-wrap">
							<Input
								className="email"
								name='linkemail'
								placeholder='请填写联系人邮箱'
								// sign='邮箱'
								// reg={/^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/}
								onHandle={this.getContactInfo.bind(this)}
								value={this.appInfo.agentInfo ? this.appInfo.agentInfo.agentUserEmail : null}
							/>
							<s>*酒店预订成功后会将确认单发送至您邮箱中</s>
						</dd>
					</dl>
				</div>
				<div className='ui-user-list'>
					<h5>注意事项</h5>
					<dl className="ui-line-height">
						<dd>
							<p>1.首晚不能到店入住或延后入住，请务必提前联系我方客服通知酒店，否则会有被酒店整单取消并不退费的风险。</p>
							<p>2.重大节日或庆典期间，酒店有可能向客人直接收取强制性消费项目。</p>
						</dd>
					</dl>
					<dl className="ui-line-height">
						<dd>
							<p>下单问题请联系客服，客服联系方式：</p>
							<p>电话：<span className="tel-num">400-060-0766</span>（7X24小时）     邮箱：<a href="mailto:hotelservice@yundijie.com">hotelservice@yundijie.com</a></p>
						</dd>
					</dl>
					<dl>
						<dd>
							<input
								type="checkbox"
								className="reade"
								name='is_reade'
								onChange={this.checkForm.bind(this)}
							/> 我已阅读并确认以上订单信息和注意事项
						</dd>
					</dl>
				</div>
				<Submit
				text='提交订单'
				onHandle={this.submits.bind(this)}
				status={this.state.isForm}
				loading={this.isLoading} />
				{
					this.msgOpt && <Message
					initData={this.msgOpt}
					>
						<p>{this.msgOpt.content}</p>
					</Message>
				}
				{
					this.confirmOpt && <Message
					initData={this.confirmOpt}
					>
						<p dangerouslySetInnerHTML={{__html: this.confirmOpt.content}}></p>
					</Message>
				}
			</div>
			)
	}
}

export default UIOrderUser;

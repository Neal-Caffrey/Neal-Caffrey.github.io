import React, {Component, PropTypes} from "react";
import { connect } from 'react-redux';
import Marks from 'components/ui-mark/index.jsx';
import ApiConfig from "widgets/apiConfig/index.js";
import Message from 'components/ui-msg/index.jsx';
import Storage from 'local-Storage/dist/main.js';
import Request from "local-Ajax/dist/main.js";
import AreaCode from "components/ui-code/index.jsx";
import Submit from 'components/ui-submit/index.jsx';
import House from 'components/ui-house/index.jsx';
import Input from 'components/ui-input/index.jsx';
import FromOrder from "./js/index.jsx";
import userCss from "./sass/index.scss";

const ORDERUPDATE = ApiConfig.updateOrder;
const APPINFO = ApiConfig.storageKey.hotel_app_info;
class UIOrderUser extends Component {
	constructor(props, context) {
		super(props, context);
		this.request;
		this.storage;
		this.defaultObj = this.defaultState;
		this.state= {
			isLoading : false,
			msgOpt : null,
			isForm : true,
			detailInfo : {},
		}
		
	}

	get request(){
		return this._request = new Request();
	}

	get storage(){
		return this._storage = new Storage();
	}
	get defaultState(){
		let obj =  {
			forms : FromOrder,
			appInfo : this._storage.get(APPINFO),
		}
		
		return obj;
	}

	get isForm(){
		return this.state.isForm;
	}

	get appInfo(){
		return this.defaultObj.appInfo;
	}

	get detailInfo(){
		return this.state.detailInfo;
	}

	get forms(){
		return this.defaultObj.forms;
	}

	set forms(fm){
		 this.defaultObj.forms = fm;
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

	submits(){
		if(this.isForm) this.postForm();
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

	componentWillReceiveProps(nextProps){
		if(nextProps.edit){
			this.setState({
				detailInfo : nextProps.edit.info
			}, this.setDefault);
		}
	}

	setDefault(){
		let _forms = this.forms
		for(let i in _forms){
			if(i == 'hotelContactInfo'){
				let objs = _forms[i];
				for(let j in objs){
					objs[j].reg = true,
					objs[j].val = this.detailInfo[j];
				}
			}else if(i == 'roomGuestInfo'){
				_forms[i] = this.detailInfo['roomGuestList'];
			}else if(_forms[i].reg != undefined){
				_forms[i].reg = true,
				_forms[i].val = this.detailInfo[i];
			}else{
				_forms[i] = this.detailInfo[i];
			}
		}
		this.forms = _forms;
	}

	setData(){
		let _forms = this.forms;
		let _info = this.appInfo;
		let _detailInfo = this.detailInfo;
		return {
			orderNo : _detailInfo.orderNo,
			contactInfo : this.getRealVal(_forms.hotelContactInfo),
			roomGuestList : this.getRealGuestInfo(_forms.roomGuestInfo),
			agentOrderNo : _forms.agentOrderNo,
			priceTicket : _forms.priceTicket.val,
			customerRequest : _forms.customerRequest,
			optId : _info.agentInfo.agentUserId,
			optName : _info.agentInfo.agentUserName,
		}
	}

	postForm(){
		let opt ={
			url : ORDERUPDATE,
			type : 'POST',
			data : JSON.stringify(this.setData()),
			headers : {
				'Content-Type' : 'application/json',
			}
		}
		this.setState({
			isLoading : true,
		})
		this._request.ajax(opt)
		.then((res) => {
			this.setState({
				isLoading : false,
			});
			if(res.status == 200) window.location.href = `/webapp/hotel/orderDetail.html?orderNo=${this.detailInfo.orderNo}`;
			else this.setState({
				msgOpt : {
					content: res.message || '下单失败，请联系客服人员',
					showFlag: true,
					showType: 'alert', 
					title: '下单',
				}
			});
		}, (err) => {
			window.location.href='/';
		});

	}

	checkForm(){
		let _forms = this.forms;
		let _isForm = true;
		let info = null;
		for(let i in _forms){
			if(i == 'hotelContactInfo' || i == 'roomGuestInfo'){
				info = _forms[i];
				for(let j in info){
					if(info[j].reg === false){
						_isForm = false;
						// return;
					}
				}
			}else if(_forms[i].reg != undefined){ 
				if(_forms[i].reg === false ){
					_isForm = false;
					// return;
				}
			}
		}
		if(_isForm !== this.state.isForm){
			this.setState({
				isForm : _isForm,
			});
		}

		//@TODO check ok
	}

	getRoomGuestInfo(house){
		let _forms = this.forms;
		let arr = [];
		house.forEach((item, key) =>{
			arr.push({
			roomNum : item.room + 1,
			reg : !item.fames.error && !item.names.error,
			guestList : [{
				firstName: item.names.value.toUpperCase(),
				lastName : item.fames.value.toUpperCase(),
			}]
			});
		});
		Object.assign(_forms.roomGuestInfo, arr);
		this.forms = _forms;
		this.checkForm();
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
		this.forms = _forms;
		this.checkForm();
	}

	render(){
		return (
			<div className='ui-order-user'>
				<div className='ui-user-list'>
					<h5>住客信息</h5>
					<dl className='line'>
						<dt>入住人数</dt>
						<dd>
							{this.detailInfo.adultNum}成人&nbsp;&nbsp;{this.detailInfo.childNum}儿童（{this.detailInfo.numOfRooms}间）
						</dd>
					</dl>
					<dl className='line'>
						<dt>国籍</dt>
						<dd>
							{this.detailInfo.guestNationalityName}
						</dd>
					</dl>
					{
						this.detailInfo.roomGuestList != undefined && 
						<House
						number={this.detailInfo.numOfRooms}
						onHandle={this.getRoomGuestInfo.bind(this)}
						data={this.detailInfo.roomGuestList}
						/>
					}
					<dl>
						<dt className='tops'>
							入住说明
						</dt>
						<dd>
							<p>1.客人国籍：如实际入住人与订单国籍不符，可能导致无法入住。</p>
							<p>2.入住人数：每间房间价格仅适用于<em>{this.detailInfo.adultNum}成人</em> <em>{this.detailInfo.childNum}儿童</em>，如果实际入住人数与订单不符，需客人与酒店前台协商解决。</p>
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
						{
							this.detailInfo.customerRequest != undefined &&
							<Marks
							placeholder='其他要求会发送到酒店，但无法保证一定满足，实际以酒店当天安排为准。请使用英文填写'
							onHandle={this.getCustomerRequest.bind(this)}
							name='userMark'
							value={this.detailInfo.customerRequest}
							/>
						}
						</dd>
					</dl>
					{
						this.detailInfo.priceTicket != undefined &&
						<dl>
							<dt>
								票面价
							</dt>
							<dd>
								<del className='fixed'>*</del>
								<code className="hack-code-display">&yen;</code>
								<Input
								className='price'
								name='userprice'
								onHandle={this.getPriceTicket.bind(this)}
								reg={/^\d+$/}
								value={this.detailInfo.priceTicket}
								/>
								<s>用于显示给客人，建议修改为实付金额</s>
							</dd>
						</dl>
					}
					<dl>
						<dt>
							第三方订单号
						</dt>
						<dd>
						{
							this.detailInfo.agentOrderNo != undefined &&
							<Input
							name='usernumber'
							onHandle={this.getAgentOrderNo.bind(this)}
							maxLength={100}
							placeholder='记录您在其它平台的订单号，多个以“，”间隔'
							className='order'
							value={this.detailInfo.agentOrderNo}
							/> 
						}
						</dd>
					</dl>
				</div>
				<div className='ui-user-list'>
					<h5>联系人信息</h5>
					<dl>
						<dt>
							姓名
						</dt>
						<dd>
							<del className='fixed'>*</del>
							{
								this.detailInfo.contactName != undefined &&
								<Input
								labelClass='ui-input margin'
								className='linkname'
								name='linkname'
								onHandle={this.getContactInfo.bind(this)}
								reg={/^[^\s]+$/}
								sign='姓名'
								value={this.detailInfo.contactName}
								placeholder='姓名'/>
							}
						</dd>
					</dl>
					<dl>
						<dt>
							电话
						</dt>
						<dd>
							<del className='fixed'>*</del>
							{
								this.detailInfo.contactAreaCode != undefined &&
								<AreaCode
								labelClass='ui-input margin'
								onHandle={this.getContactInfo.bind(this)}
								value={this.detailInfo.contactAreaCode}
								/>
							}
							{
								this.detailInfo.contactMobile != undefined &&
								<Input
								className='price'
								name='linkphone'
								sign='手机号'
								reg={/^\d+$/}
								onHandle={this.getContactInfo.bind(this)}
								placeholder='手机号'
								value={this.detailInfo.contactMobile}
								/>
							}
							<s>*酒店预订成功后会发送短信通知</s>
						</dd>
					</dl>
					<dl>
						<dt>
							邮箱
						</dt>
						<dd>
                            {
                                this.detailInfo.contactEmail != undefined &&
								<Input
									labelClass='ui-input margin'
									className='email'
									name='linkemail'
									onHandle={this.getContactInfo.bind(this)}
									// reg={/^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/}
									// sign='邮箱'
									value={this.detailInfo.contactEmail}
									placeholder='请填写联系人邮箱'/>
                            }
							<s>*酒店预订成功后会将确认单发送至您邮箱中</s>
						</dd>
					</dl>
				</div>
				<Submit
				text='保存修改'
				onHandle={this.submits.bind(this)}
				status={this.isForm}
				loading={this.isLoading} />
				{
					this.msgOpt &&
					<Message 
					initData={this.msgOpt}
					>
						<p>{this.msgOpt.content}</p>
					</Message>
				}
			</div>
			)
	}
}

function mapStateToProps(state) {
	return {
		edit: state.edit,
	}
}

export default connect(mapStateToProps)(UIOrderUser);
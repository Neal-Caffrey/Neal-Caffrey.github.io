import React, {
	Component
} from 'react';
import {
  _extend
} from 'local-Utils/dist/main.js';
import {
  connect
} from 'react-redux';

import {Form, Row, Col, Input, Button, Icon} from 'local-Antd';
const FormItem = Form.Item;
import NumberSelect from 'components/ui-number/index.jsx';
import Checkbox from 'components/ui-checkbox/index.jsx';
import Marks from 'components/ui-mark/index.jsx';
import AreaCode from "components/ui-code/index.jsx";
import MInput from 'components/ui-input/index.jsx';
import YdjAjax from 'components/ydj-Ajax/index.js';
import ApiConfig from 'widgets/apiConfig/index.js';
import HourPicker from 'components/ui-hour-picker/index.jsx';
const Moment = require('moment');
import $ from 'local-Zepto/dist/main.js';
import {showOrderForm, showLoading, showAlert} from '../../action/index.js';
import './sass/index.scss';
class OrderForm extends Component {
	constructor(props, context) {
		super(props, context);
		this.bookInfo = {
			'demandCount': this.props.detail.fxMerchantConf.startSeatNum,
			'contactsAreaCode': 86,
			'isAdjustTime': 2,
			'isAdjustAddress': 2
		};
		this.state = this.defaultStatus;
	}
	get defaultStatus() {
		return {
			'showAdjustTime': false,
			'showAdjustAddr': false,
			'canSubmit': false,
			'priceInfo': this._getPrices()
		}
	}
	get _handleErrors() {
		let handles = {
			failedHandle: (res) => {
				this.props.dispatch(showAlert(res.message));
			},
			errorHandle: (xhr, errorType, error, errorMsg) => {
				this.props.dispatch(showAlert(errorMsg));
			}
		};
		return handles;
	}
	_changeSeats(info) {
		this.bookInfo.demandCount = info;
		this.setState({
			'priceInfo': this._getPrices()
		}, () => {
			this._checkForm();
		});
	}
	_getBookInfo(info) {
		if (info.name == 'contactsAreaCode') {
			this.bookInfo.contactsAreaCode = info.code.areaCode;
		} else {
			this.bookInfo[info.name] = info.value;
		}
		this._checkForm();

	}
	_changeAdjustTimeFlag(info) {
		this.setState({
			'showAdjustTime': !!info,
		}, () => {
			this.bookInfo.isAdjustTime = info === true ? 1 : 2;
			this._checkForm();
		});
	}
	_changeAdjustAddrFlag(info) {
		this.setState({
			'showAdjustAddr': !!info,
		}, () => {
			this.bookInfo.isAdjustAddress = info === true ? 1 : 2;
			this._checkForm();
		});

	}
	_changeServiceTime(type, moment) {
		//变化需要验证
		// if(!moment) {
		// 	return;
		// }
		// debugger
		switch (type) {
			case 'service':
				this.bookInfo.serviceTime = moment ? moment.format('YYYY-MM-DD HH:mm') + ':00' : '';
				break;
			case 'adjust':
				this.bookInfo.adjustTimeRemark = moment ? moment.format('YYYY-MM-DD HH:mm') + ':00' : '';
		}
		this._checkForm();
	}

	_checkForm() {
		// debugger
		if (!this.bookInfo.serviceTime) {
			this._switchCanSubmit();
			return;
		}
		if (!this.bookInfo.isAdjustTime) {
			this._switchCanSubmit();
			return;
		}
		if (this.bookInfo.isAdjustTime == 1 && !this.bookInfo.adjustTimeRemark) {
			this._switchCanSubmit();
			return;
		}

		if (!this.bookInfo.isAdjustAddress) {
			this._switchCanSubmit();
			return;
		}
		if (this.bookInfo.isAdjustAddress == 1 && !this.bookInfo.adjustAddressRemark) {
			this._switchCanSubmit();
			return;
		}
		if (!this.bookInfo.demandCount) {
			this._switchCanSubmit();
			return;
		}
		if (!this.bookInfo.contactsName) {
			this._switchCanSubmit();
			return;
		}
		if (!this.bookInfo.contactsAreaCode) {
			this._switchCanSubmit();
			return;
		}
		if (!this.bookInfo.contactsMobile) {
			this._switchCanSubmit();
			return;
		}

		if (this.props.header.info.agentInfo.industryType == 7 && !this.bookInfo.priceTicket) {
			this._switchCanSubmit();
			return;
		}

		this._switchCanSubmit(true);
	}
	_switchCanSubmit(flag) {
		this.setState({
			'canSubmit': flag === true ? true : false
		});
	}
	_close() {
		this._handle({
			opType: 'close'
		});
	}
	_submit() {
		if (!this.state.canSubmit) {
			return;
		}

		let params = {
			'serviceTime': this.bookInfo.serviceTime, //预订服务时间   必填
			'isAdjustTime': this.bookInfo.isAdjustTime, // 是否愿意调整时间：1-愿意；2-不愿意
			'isAdjustAddress': this.bookInfo.isAdjustAddress, //是否愿意调整餐厅：1-愿意；2-不愿意
			'demandCount': this.bookInfo.demandCount, //订单要求数量（订座数）   必填
			'userRemark': this.bookInfo.userRemark || '', //用户备注
			'contactsName': this.bookInfo.contactsName, //联系人姓名   必填
			'contactsAreaCode': this.bookInfo.contactsAreaCode, //联系人电话区号   必填
			'contactsMobile': this.bookInfo.contactsMobile, //联系人电话号码   必填
			'contactsWechat': this.bookInfo.contactsWechat, //联系人微信号
		};
		(this.props.header.info.agentInfo.industryType == 7) && (params.priceTicket = this.bookInfo.priceTicket); //票面价,只天猫渠道有

		params.isAdjustTime && (params.adjustTimeRemark = this.bookInfo.adjustTimeRemark);
		params.isAdjustAddress && (params.adjustAddressRemark = this.bookInfo.adjustAddressRemark);

		this._handle({
			opType: 'submit',
			params: _extend(params, this.state.priceInfo)
		});
	}


	_handle(data) {
		let info = this.props.header.info;
		switch (data.opType) {
			case 'close':
				this.props.dispatch(showOrderForm(false));
				$('body').css({
					'overflow': 'scroll'
				});
				break;
			case 'submit':
				let merDetail = this.props.detail;
				let merConfig = merDetail.fxMerchantConf;
				let params = {
					'orderChannel': info.agentInfo.agentId, //订单渠道Id 必填
					'orderType': 1, //订单类型：1-餐厅订座
					'agentOpname': info.agentInfo.agentUserName, //代理商操作人姓名 必填
					'agentOpid': info.agentInfo.agentUserId, //代理商操作人Id必填
					'agentName': info.agentInfo.agentName, //代理商名称  必填
					'agentId': info.agentInfo.agentId, //代理商Id必填
					'merchantNo': merDetail.merchantNo, // 商户Id
					'demandCount': merConfig.startSeatNum, // 订座数量默认最小可订数量
				};

				let bookInfo = data.params || {};
				this._submitOrder(_extend(params, bookInfo));
				break;
		}
	}
	_submitOrder(params) {
		let opt = {
			type: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			url: ApiConfig.cateringOrder,
			// url: 'http://api6-dev.huangbaoche.com/trade/fx/v1.0/cla/submitFxOrder',
			data: JSON.stringify(params),
			successHandle: (res) => {
				window.location.href = '/webapp/catering/orderDetail.html?orderNo=' + res.data.orderInfo.orderNo;
			},
			...this._handleErrors
		}
		this.props.dispatch(showLoading(true));
		new YdjAjax(opt);
	}
	_getPrices() {
		let merConfig = this.props.detail.fxMerchantConf;
		let others = {};
		switch (merConfig.saleType) {
			case 1:
				// 免费预订
				others.priceChannel = 0;
				break;
			case 2:
				// 订座服务费
				others.priceService = merConfig.servicePerPrice * this.bookInfo.demandCount;
				others.priceChannel = others.priceService;
				break;
			case 3:
				// 佣金模式
				if (merConfig.openDepositFlag == 1) {
					// 开启订座押金
					others.pricePledge = merConfig.depositPerPrice;
					others.priceChannel = others.pricePledge;
				} else {
					others.priceChannel = 0;
				}
				break;
		}
		return others;
	}

	_getDateRange(beforeTime = 120, maxDay = 10) {
		// debugger
		let today = new Moment.utc().add(this.props.detail.utcTimeSpan || 0, 'milliseconds'); // 
		// debugger
		let minDayTime = Moment(today, 'YYYY-MM-DD HH:mm:ss').add(beforeTime, 'minutes').format('YYYY-MM-DD');
		let maxDate = Moment(today, 'YYYY-MM-DD').add(maxDay, 'days').format('YYYY-MM-DD');
		
		return [minDayTime, maxDate];
	}

	_get24Hour(data) {
		let time = "00:00";
		if (data && data < 10) {
			time = `0${data}:00`;
		} else if (data < 24) {
			time = `${data}:00`;
		} else {
			time = `23:59`;
		}
		return time;
	}

	render(){
		const formItemLayout = {
	      labelCol: { span: 8 },
	      wrapperCol: { span: 16 },
	    };
		return (
			<div>
				{(()=>{
					let res =[];
					if(this.props.renderOrderForm) {
						res.push(
							<div className="order-form">
								<div className="mask"></div>
								<div className="order-wrap">
									<div className="head">填写订单信息<Icon className="close" type="close" onClick={this._close.bind(this)}/></div>
									<Form>
										<div className="cont">
											<div className="left-cont">

												<div className="order-row">
													<label>用餐时间:</label>
													<div className="service-time">
														<HourPicker
														range={this._getDateRange(this.props.detail.fxMerchantConf.preMinute, this.props.detail.fxMerchantConf.maxDay)}
														start={this._get24Hour(this.props.detail.fxMerchantConf.startHour)}
														end={this._get24Hour(this.props.detail.fxMerchantConf.endHour)}
														period={(this.props.detail.fxMerchantConf.preMinute || 0) % (60 * 24)}
														local={null}
														step={30 * 60}
														placeholder="用餐时间" 
														onHandle={this._changeServiceTime.bind(this, 'service')}/></div>
													<div><Checkbox text="若该时间订不上，愿意更改用餐时间" name="isAdjustTime" checked={this.state.showAdjustTime} onHandle={this._changeAdjustTimeFlag.bind(this)}/></div>
													{
														(()=>{
															let res = [];
															if(this.state.showAdjustTime) {
																res.push(
																	<div className="service-time">
																	<HourPicker
																	range={this._getDateRange(this.props.detail.fxMerchantConf.preMinute, this.props.detail.fxMerchantConf.maxDay)}
																	start={this._get24Hour(this.props.detail.fxMerchantConf.startHour)}
																	end={this._get24Hour(this.props.detail.fxMerchantConf.endHour)}
																	period={(this.props.detail.fxMerchantConf.preMinute || 0) % (60 * 24)}
																	local={null}
																	step={30 * 60}
																	placeholder="用餐时间" 
																	onHandle={this._changeServiceTime.bind(this, 'adjust')}/></div>
																)
															}
															return res;
														})()
													}
													<div><Checkbox text="若该餐厅订不上，愿意更改至其他餐厅" name="isAdjustAddress" checked={this.state.showAdjustAddr} onHandle={this._changeAdjustAddrFlag.bind(this)}/></div>
													{
														(()=>{
															let res = [];
															if(this.state.showAdjustAddr) {
																res.push(
																	<Marks
																		placeholder='在这里填写餐厅名称／要求'
																		onHandle={this._getBookInfo.bind(this)}
																		name='adjustAddressRemark'/>
																)
															}
															return res;
														})()
													}
												</div>
												<div className="order-row">
													<label>用餐人数:</label>
													{
														(()=>{
															let res = [];
															let ic = {
													            defValue: this.props.detail.fxMerchantConf.startSeatNum || 1,
													            selectedHandler: this._changeSeats.bind(this),
													            uiClassName: "seats-select",
													            uiPlaceholder: "座位数",
													            minNum: this.props.detail.fxMerchantConf.startSeatNum || 1,
													            maxNum: this.props.detail.fxMerchantConf.endSeatNum || 10,
													        }
															res.push(<NumberSelect {...ic}/>);
															return res;
														})()
													}
												</div>
												<div className="order-row">
													<label>备注:</label>
													<Marks
													placeholder='如有附加要求，请填写，会尽量帮您安排'
													onHandle={this._getBookInfo.bind(this)}
													name='userRemark'/>
												</div>
											</div>
											<div className="right-cont">
												<div className="order-row">
													<label>联系人:</label>
													<MInput 
														className='contact-name'
														name='contactsName'
														sign='联系人姓名'
														reg={/^.+$/}
														onHandle={this._getBookInfo.bind(this)}
														placeholder='联系人姓名'/>
												</div>
												<div className="order-row">
													<label>联系电话:</label>
													<AreaCode
														name='contactsAreaCode'
														labelClass='area-code'
														onHandle={this._getBookInfo.bind(this)}
														/>
													<MInput
														className='mobile'
														name='contactsMobile'
														sign='联系人电话'
														reg={/^\d+$/}
														onHandle={this._getBookInfo.bind(this)}
														placeholder='手机号'
														/>
												</div>
												<div className="order-row">
													<label>微信号:</label>
													<MInput 
														className='wechat'
														name='contactsWechat'
														sign='常用微信号'
														reg={/^.+$/}
														onHandle={this._getBookInfo.bind(this)}
														placeholder='常用微信号'/>
												</div>
											</div>
										</div>
									
										<div className="bottom">
											<Row gutter={16}>
											  <Col span={12}>{(()=>{
											  	let res =[];
											  	if(this.props.header.info.agentInfo.industryType == 7) {
											  		res.push(
												  		<div className="order-row price-ticket-wrap">
															<label>票面价</label>
															<MInput
															className='price-ticket'
															name='priceTicket'
															sign='票面价'
															reg={/^\d+$/}
															onHandle={this._getBookInfo.bind(this)}
															placeholder='票面价'
															/>
														</div>
													)
											  	}
											  	
												return res;
										  	  })()}</Col>
											  <Col span={8}>{(()=>{
											  	let res =[];
											  	let labelTxt = '预订金额';
											  	let moneyTxt = 'RMB';
											  	let priceTxt = this.state.priceInfo.priceChannel;
											  	if(this.state.priceInfo.priceChannel == 0) {
											  		labelTxt = '';
											  		moneyTxt = '';
											  		priceTxt = '免费预订';
											  	}
										  		res.push(<div className="order-price">{labelTxt}<span>{moneyTxt}<span>{priceTxt}</span></span></div>)
											  	return res;
											  })()}</Col>
											  <Col span={4}><Button disabled={!this.state.canSubmit} className="submit-btn" onClick={this._submit.bind(this)}>提交订单</Button></Col>
											</Row>
										</div>
									</Form>
								</div>
							</div>
						)
					}
					return res;
				})()}
			</div>
			
		)
	}
}

const mapStateToProps = (state) => {
	// debugger
  return {
  	renderOrderForm: state.main.renderOrderForm,
    detail: state.main.detail,
    header: state.header
  }
}

export default connect(mapStateToProps)(OrderForm);
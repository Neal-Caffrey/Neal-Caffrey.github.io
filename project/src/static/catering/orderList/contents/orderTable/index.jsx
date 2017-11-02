import React, {
	Component
} from 'react';
import {
	connect
} from 'react-redux';
import {
    _extend,
} from 'local-Utils/dist/main.js';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
const momentFormat = 'YYYY-MM-DD';
import {changeFormData, showAlert, changePage} from '../../action/index.js';

import {Row, Col, Spin} from 'local-Antd';
import Page from 'components/ui-page/index.jsx';
import Sortor from '../sortor/index.jsx';
import YdjAjax from 'components/ydj-Ajax/index.js';
import ApiConfig from 'widgets/apiConfig/index.js';
class OrdersTable extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			loading: false,
		};
		
	}

	componentWillMount() {
		if(this.props.header.info) {
			this.agentInfo = {};
			this.agentInfo.agentId = this.props.header.info.agentInfo.agentId; //渠道 必填
			(this.props.header.info.agentInfo.agentUserType == 1) && (this.agentInfo.agentOpId = this.props.header.info.agentInfo.agentUserId); //下单人Id  ，非管理员必填
			this._doRequest(this.props);
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.header.info) {
			if(!this.props.header.info) {
				this.agentInfo = {};
				this.agentInfo.agentId = nextProps.header.info.agentInfo.agentId; //渠道 必填
				(nextProps.header.info.agentInfo.agentUserType == 1) && (this.agentInfo.agentOpId = nextProps.header.info.agentInfo.agentUserId); //下单人Id  ，非管理员必填
				this._doRequest(nextProps);
			} else {
				// // 重置分页
				let pagination = {
						'limit': this.props.pagination.limit,
						'current': 1,
						'offset': 0
					};
					// 校验查询条件是否变更
					if(this._checkChange(this.props.fxOrderStatus, nextProps.fxOrderStatus)) {
						// 订单状态变更，清除其他条件
						let props = {
							'fxOrderStatus': nextProps.fxOrderStatus,
							'pagination': pagination
						};
						this._doRequest(props);
					} else {
						if(nextProps.quickSearch) {
							// 快速搜索
							let props = {
								'fxOrderStatus': nextProps.fxOrderStatus,
								'formData': _extend(nextProps.formData, {
									'startTime': moment().add(-7, 'days').format(momentFormat),
									'endTime': moment().format(momentFormat),
								}),
								'pagination': pagination
							};
							this._doRequest(props);
						} else {
							if(this._checkChange(this.props.formData, nextProps.formData)) {
								// 表单数据变更，清理排序
								let props = {
									'fxOrderStatus': nextProps.fxOrderStatus,
									'formData': nextProps.formData,
									'pagination': pagination
								};
								this._doRequest(props);
							}else {
								if(this._checkChange(this.props.sortor, nextProps.sortor)) {
									// 排序变更
									let props = _extend({}, nextProps, {
										'pagination': pagination
									});
									this._doRequest(props);
								} else {
									// 分页变更
									if(this._checkChange(this.props.pagination, nextProps.pagination)) {
										this._doRequest(nextProps);
									}
								}
							}
						}
						
					}
			// 	});
			}
		}
	}

	get _handleErrors() {
		let handles = {
			failedHandle: (res) => {
				this.setState({
					loading: false,
					...res.data
				});
				this.props.dispatch(showAlert(res.message));
			},
			errorHandle: (xhr, errorType, error, errorMsg) => {
				this.setState({
					loading: false
				});
				this.props.dispatch(showAlert(errorMsg));
			}
		};
		return handles;
	}
	_checkChange(a, b) {
		let flag = Object.is(a, b);
		return !flag;
	}

	_doRequest(props) {
		let params = this._getParams(props);
		this._getList(params);
	}

	_getList(data = {}) {
		let params = _extend({}, this.agentInfo, data);

		let opt = {
			url: ApiConfig.cateringOrderList,
			data: params,
			successHandle: (res) => {
				// debugger
				this.setState({
					loading: false,
					...res.data
				});
			},
			...this._handleErrors
		}
		this.setState({
			loading: true
		}, ()=> {
			new YdjAjax(opt);
		});
	}
	_getParams(props) {
		let params = {};
		props.fxOrderStatus && (params.fxOrderStatus = props.fxOrderStatus);
		if(props.formData) {
			for(let key in props.formData) {
				params[key] = props.formData[key];
			}
		}

		// 校验只有有日期是才传类型
		(!params.startTime || !params.endTime) && params.timeQueryType && (delete params.timeQueryType);

		if(props.sortor) {
			for(let key in props.sortor) {
				params[key] = props.sortor[key];
			}
		}
		params.startTime && (params.startTime += ' 00:00:00');
		params.endTime && (params.endTime += ' 23:59:59');
		_extend(params, props.pagination);
		return params;
	}
	_getDate(str = '') {
    	let result = {
    		'date': '',
    		'time': ''
    	}
    	if(str) {
    		result = {
    			'date': str.substr(0, 10),
    			'time': str.replace(/\s/g, '').substr(10)
    		}
    	}
        return result;
    }

    // 分页
	_changePage(data) {
		if(!data || !data.current) {
			return;
		}
		if(data.current == this.props.pagination.current) {
			return;
		}
		let page = {
			'current': data.current,
			'offset': (data.current - 1) * this.props.pagination.limit,
			'limit': this.props.pagination.limit,
		};
		this.props.dispatch(changePage(page));			
	}
	_renderOrderRows() {
		if(this.state.loading) {
			return (
				<Spin tip="加载中，请稍后"></Spin>
			)
		} else {
			if(this.state.orders && this.state.totalSize){
				return (
					<div className="list-body">
					{
						this.state.orders.map((order, index)=>{
							return (
								<div key={order.orderNo} className="list-item">
				        			<Row className="order-head" >
				        				<Col span={24}>订单号：
				        					<a target="_blank" href={`/webapp/catering/orderDetail.html?orderNo=${order.orderNo}`}> {order.orderNo}</a>
				        					<span className="order-status">{order.orderStatusName}</span></Col>
						        	</Row>
						        	<Row className="list-main" type="flex" justify="space-around" align="middle">
							        	<Col className="mer-name" span={8}>{order.merchantName || '未填写'}</Col>
						        		<Col className="contact" span={3}>{order.agentOpname || '未填写'}</Col>
						        		<Col className="check-date" span={4}>
						        			<span>{this._getDate(order.serviceTime).date}</span>
						        			<span>{this._getDate(order.serviceTime).time}</span>
						        		</Col>
						        		<Col span={3}>{order.serviceCityName}</Col>
						        		<Col className="price" span={3}>￥{order.priceChannel}</Col>
						        		<Col className="btns" span={3}>
						        			{
						        				order.fxGOrderStatus == 1?
						        				<a target="_blank" className="pay-btn" href={`/webapp/catering/orderDetail.html?orderNo=${order.orderNo}`}>立即支付</a>:
						        				<a target="_blank" href={`/webapp/catering/orderDetail.html?orderNo=${order.orderNo}`}>查看订单</a>
						        			}
					        			</Col>
						        	</Row>
						        	<Row className="order-foot">
						        		<Col span={14}>客人信息：{order.contactsName} <span className="phone">+{order.contactsAreaCode} {order.contactsMobile}</span></Col>
				        				<Col className="order-time" span={10}>下单时间<span className="tip">(北京时间)</span>：<b>{order.createTime || '无记录'}</b></Col>
						        	</Row>
					        	</div>
							)
						})
					}
					{
						this.state.totalSize ? 
						<Page
							total={this.state.totalSize}
							onHandle={this._changePage.bind(this)}
							current={this.props.pagination.current}
							limit={this.props.pagination.limit} /> : null
					}
					
					</div>
				)
			} else {
				return (
					<div className="non-orders">暂无相关订单</div>
				)
			}
		}
		
	}
	render() {
		return (
			<div className="list-table">
				{
					this.state.totalSize ? <Sortor/> : null
				}
				{this._renderOrderRows()}
        	</div>
		)
	}
}
const mapStateToProps = (state) => {
	return {
		fxOrderStatus: state.main.fxOrderStatus,
		formData: state.main.formData,
		sortor: state.main.sortor,
		header: state.header,
		quickSearch: state.main.quickSearch,
		pagination: state.main.pagination
	}
}

export default connect(mapStateToProps)(OrdersTable);
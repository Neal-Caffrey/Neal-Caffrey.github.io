import React, {
	Component,
	PropTypes
} from 'react';
import {
	connect
} from 'react-redux';
import {
	_extend,
	_getQueryObjJson
} from 'local-Utils/dist/main.js';
import Header from 'components/header/index.jsx';
import YdjAjax from 'components/ydj-Ajax/index.jsx';
import LeftMenu from 'contents/leftMenu/index.jsx';
import OrdersTable from 'components/ui-orders-table/index.jsx';
import OrderStatusSelect from 'components/ui-status-nav-select/index.jsx';
import OrderSearch from 'components/ui-order-filter/index.jsx';
import Msg from 'components/ui-msg/index.jsx';
import Storage from 'local-Storage/dist/main.js';

import BaseCss from 'local-BaseCss/dist/main.css';
import BaseHotelCss from '../../sass/index.scss';
import './sass/index.scss';
import {
	Row,
	Col,
	Input,
	Button,
	Icon
} from 'local-Antd';
import ApiConfig from 'widgets/apiConfig/index.js';

class App extends Component {
	constructor(props, context) {

		super(props, context);
		this.storage;
		// this.userInfo = this.appInfo;
		// this._formData = this.formInit;
		this.state = this.defaultState;

		this.orderStatusList = this.orderStatus;
		// this.leftMenuList = this.leftMenu;
	}
	componentWillMount() {
		if (this.props.header.info) {
			// debugger
			this.userInfo = this.props.header.info;
			this._formData = this.formInit;
			this.setState({
				formData: this._formData,
				leftMenuList: this.userInfo.menuInfo.leftMenu_a ? this.userInfo.menuInfo.leftMenu_a : []
			}, () => {
				this._getOrderList();
			})
		}
	}
	componentWillReceiveProps(nextProps) {
		if (!this.props.header.info && nextProps.header.info) {
			// debugger
			this.userInfo = nextProps.header.info;
			this._formData = this.formInit;
			this.setState({
				formData: this._formData,
				leftMenuList: this.userInfo.menuInfo.leftMenu_a ? this.userInfo.menuInfo.leftMenu_a : []
			}, () => {
				this._getOrderList();
			})
		}
	}
	get formInit() {
		let state = {
			limit: 5,
			offset: 0,
		};

		state.orderChannel = this.userInfo.agentInfo.agentId;
		if (this.userInfo.agentInfo.agentUserType == 1) {
			state.opId = this.userInfo.agentInfo.agentUserId;
		}
		return state;
	}
	get defaultState() {
			return {
				data: [],
				isOnOrderError: false,
				loading: false,
				resetForm: false,
				pagination: {},
				leftMenuList: [],
			};
		}
		// 初始化storage
	get storage() {
		this._storage = new Storage();
	}

	// get appInfo() {
	//        return this._storage.get(ApiConfig.storageKey.hotel_app_info);
	//    }

	get orderStatus() {

		}
		// get leftMenu() {
		// 	return this.userInfo && this.userInfo.menuInfo && this.userInfo.menuInfo.leftMenu_a ?  this.userInfo.menuInfo.leftMenu_a : [];
		// }
	get listQueryAttr() {
		return {
			queryParam: {
				url: ApiConfig.orderList,
				// url: `http://api6-dev.huangbaoche.com/trade/v1.0/cla/hotel/list`,
			},
			name: '订单列表',
		}
	}

	_cbListSuccess(res) {
		// debugger
		let states = {
			loading: false,
		};
		if (res.status === 200) {
			states.data = res.data.hotelOrder;
			states.dateAll = res.data;
			states.pagination = {
				limit: this._formData.limit,
				total: res.data.totalSize,
				current: this._getPage(this._formData.offset)
			};
			this.setState(states);
		}
	}

	_getPage(offset) {
		let page = 1;
		if (offset) {
			page = Math.floor(offset / this._formData.limit) + 1
		}
		return page;
	}
	_getOrderList() {

		this.lastFormDate = this._formData;
		this.setState({
			loading: true,
			formData: this._formData
		});
	}
	_cbCloseOrderErr() {
		this.setState({
			isOnOrderError: false
		}, () => {
			this.orderErrInfo = null;
		});
	}
	_checkFormChange(cur) {

		let flag = false;
		let keys1 = Object.keys(this.lastFormDate || {});
		let keys2 = Object.keys(cur);
		let len1 = keys1.length;
		let len2 = keys2.length;
		if (len1 != len2) {
			return true;
		}
		for (let i = 0; i < len1; i++) {
			if (!Object.is(this.lastFormDate[keys1[i]], cur[keys1[i]])) {
				flag = true;
				break;
			}
		}
		return flag;
	}
	_changeOrderForm(type, data, searchFlag) {

		if (!type) {
			return;
		}
		switch (type) {
			case 'pageIndex':
				this._formData.offset = (data.pageIndex - 1) * this._formData.limit;
				this._getOrderList();
				break;
			case 'status':
				if (data.status) {
					this._formData.orderStatus = data.status;
				} else {
					this._formData.orderStatus && (delete this._formData.orderStatus);
				}
				this._formData.offset = 0;
				this._getOrderList();
				break;
			case 'form':
				let last = this._formData;
				let orderStatus = this._formData.orderStatus;
				let pageSize = this._formData.limit;
				let orderChannel = this._formData.orderChannel;
				let opId = this._formData.opId;
				this._formData = {
					...data,
					offset: 0,
					limit: pageSize,
					orderChannel: orderChannel
				}
				opId && (this._formData.opId = opId);
				if (orderStatus) {
					this._formData.orderStatus = orderStatus;
				} else {
					this._formData.orderStatus && (delete this._formData.orderStatus);
				}
				// if(searchFlag && this._checkFormChange(this._formData)) {
				if (searchFlag) {
					this._getOrderList();
				}
				break;
			case 'reset':
				this._formData = this.formInit;
				this.setState({
					resetForm: !!!this.state.resetForm,
				})
				break;
		}
	}
	render() {
		return (
			<div id='ui-wrap'>
		        <Header active={-1}/>
		        <div className="ui-main ui-order-list ui-fixed-footer">
		        	<LeftMenu dataSource={this.state.leftMenuList} curMenuUrl={`webapp/hotel/orderList.html`}/>
		        	<div className="list-cont">
		        		<h2>酒店订单</h2>
						<OrderStatusSelect dataAll={this.state.dateAll} dataSource={this.orderStatusList} reset={this.state.resetForm} changeHandle={this._changeOrderForm.bind(this)}/>
		        		<OrderSearch resetForm={this.state.resetForm} changeHandle={this._changeOrderForm.bind(this)} loading={this.state.loading}/>
		        		<OrdersTable dataSource={this.state.data} pageSource={this.state.pagination} changeHandle={this._changeOrderForm.bind(this)} loading={this.state.loading}/>
		        	</div>
		        	{this.state.isOnOrderError && this.orderErrInfo? <Msg initData={this.orderErrInfo}><p>{this.orderErrInfo.content}</p></Msg> : null}
		        </div>
		        {this.state.loading?<YdjAjax queryAttr={this.listQueryAttr} successHandle={this._cbListSuccess.bind(this)} queryData={this.state.formData} />:null}
	        </div>
		)
	}
}
const mapStateToProps = (state) => {
	return {
		header: state.header
	}
}

export default connect(mapStateToProps)(App);
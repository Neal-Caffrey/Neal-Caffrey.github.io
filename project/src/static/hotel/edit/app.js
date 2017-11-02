import React, {
	Component,
} from "react";

import {
	connect
} from 'react-redux';

import {
	_getQueryObjJson
} from 'local-Utils/dist/main.js';

import Header from 'contents/header/index.jsx';
import EditMain from "components/edit-main/index.jsx";
import OrderInfo from "components/ui-order-info/indexd.jsx";
import Footer from 'contents/footer/index.jsx';
import Request from 'local-Ajax/dist/main.js';
import ApiConfig from 'widgets/apiConfig/index.js';
import UiConsult from "components/ui-consult/index.jsx";

import {
	updateInfo
} from 'ACTIONS/editAction.js';
import './sass/index.scss'
import BaseCss from 'local-BaseCss/dist/main.css';
import GlobleCss from 'components/globleCss/index.scss';
import BaseHotelCss from '../sass/index.scss';
import Message from 'components/ui-msg/index.jsx';


class App extends Component {
	constructor(props, context) {
		super(props, context);
		this.request;
		this.state = this.defaultState;
		this.detailInfo;
	}
	get defaultState() {
		return {
			showOpt: {
				content: '',
				showFlag: false,
				title: '下单',
				showType: 'alert',
			},
		};
	}

	get request() {
		return this._request = new Request;
	}

	get orderNo() {
		return _getQueryObjJson().orderNo;
	}

	get detailInfo() {
		let opt = {
			url: ApiConfig.orderDetail,
			data: {
				orderNo: this.orderNo
			}
		}
		this._request.ajax(opt)
			.then((res) => {
				debugger
				if (res.status == 200) this.props.dispatch(updateInfo(res.data.hotelOrder))
				else this.setState({
					showOpt: {
						content: res.message || '获取订单信息失败，请联系客服人员',
						showFlag: true,
					}
				})
			}, (err) => {
				window.location.href = '/';
			})
	}

	render() {
		return (
			<div id='ui-wrap'>
				<Header active={-1}/>
				<div className='ui-main ui-fixed-footer'>
					<div className='ui-order-main'>
						<EditMain />
						<OrderInfo />
					</div>
				</div>
				<UiConsult />
				<Footer />
				<Message
				initData={this.state.showOpt}>
					<p>{this.state.showOpt.content}</p>
				</Message>
			</div>
		)
	}
}

function mapStateToProps(state) {
	return {
		edit: state.edit,
	}
}

export default connect(mapStateToProps)(App);
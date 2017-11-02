import React, {
	Component,
} from "react";

import {
	connect
} from 'react-redux';

import Header from 'contents/header/index.jsx';
import OrderMain from "components/order-main/index.jsx";
import OrderInfo from "components/ui-order-info/index.jsx";
import Footer from 'contents/footer/index.jsx';
import UiConsult from "components/ui-consult/index.jsx";
import Storage from "local-Storage/dist/main.js";
import {
	updateDetail
} from "ACTIONS/orderAction.js";
import ApiConfig from "widgets/apiConfig/index.js";
import {
	_getQueryObjJson
} from 'local-Utils/dist/main.js';

import BaseCss from 'local-BaseCss/dist/main.css';
import 'components/globleCss/index.scss';
import '../sass/index.scss';
import './sass/index.scss';
const ISShowConsult = ((domain)=>{
  let reg = /www/;
  return reg.test(domain);
})(document.domain);
const DETAILDATA = ApiConfig.storageKey.hotel_detail_data;
const QOUTEID = _getQueryObjJson().qouteId;

class App extends Component {
	constructor(props, context) {
		super(props, context);
		this.storage;
		this.state = this.defaultState;
	}

	get storage() {
		return this._storage = new Storage(DETAILDATA);
	}
	get defaultState() {
		if (!QOUTEID) return alert('请求参数错误');
		return {
			detail: this._storage.get(`${DETAILDATA}_${QOUTEID}`) || {},
		};
	}

	componentWillMount() {
		this.props.dispatch(updateDetail(this.info));
	}

	get info() {
		return this.state.detail;
	}

	render() {
		// console.log(this.info)
		return (
			<div id='ui-wrap'>
				<Header active={-1}/>
				<div className='ui-main ui-fixed-footer'>
					<div className='ui-order-main'>
						<OrderMain/>
						<OrderInfo
						info={this.info}
						/>
					</div>
				</div>
				{ISShowConsult ? <UiConsult /> : null}
        {ISShowConsult ? <Footer /> : null}
			</div>
		)
	}
}

function mapStateToProps(state) {
	return {
		order: state.order,
	}
}

export default connect(mapStateToProps)(App);

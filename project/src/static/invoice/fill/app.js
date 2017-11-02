import React, {
	Component,
} from "react";
import {
    connect
} from 'react-redux';

import Header from 'contents/header/index.jsx';
import Footer from 'contents/footer/index.jsx';
import LeftMenu from 'contents/leftMenu/index.jsx';

import UiConsult from "components/ui-consult/index.jsx";
import InvoiceInfo from "./contents/invoiceInfo/index.jsx";
import AddressInfo from "./contents/addressInfo/index.jsx";
import ButtonRow from "./contents/buttonRow/index.jsx";

import {
  _extend,
  _getQueryObjJson
} from 'local-Utils/dist/main.js';
import Storage from 'local-Storage/dist/main.js';
import {updateTotal} from './action/index.js';

import BaseCss from 'local-BaseCss/dist/main.css';
import 'components/globleCss/index.scss';
import './sass/index.scss';

const ISShowConsult = ((domain)=>{
  let reg = /www/;
  return reg.test(domain);
})(document.domain);

class App extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			leftMenuList: [],
		}

		this.queryStringObj = this.getQueryStringObj;
		this.storage;
		this.data = {
			...this._storage.get(this.queryStringObj.invoiceKey)
		}
		if(!this.queryStringObj.invoiceKey || !this.data.billAmount || !this.data.orderNoList) {
			window.history.back();
		}
		this.props.dispatch(updateTotal(this.data));
	}
	get storage() {
		this._storage = new Storage();
		// this._storage.set(this.queryStringObj.invoiceKey, {
		// 		billAmount: 2000,
		// 		orderNoList: 'H91154616919'
		// });
		return this._storage;
	}

	get getQueryStringObj() {
		return _getQueryObjJson();
	}

	componentWillMount() {
		if (this.props.header.info) {
			this.setState({
				leftMenuList: this.props.header.info.menuInfo.leftMenu_a ? this.props.header.info.menuInfo.leftMenu_a : []
			})
		}
	}
	componentWillReceiveProps(nextProps) {
		if (!this.props.header.info && nextProps.header.info) {
			this.setState({
				leftMenuList: nextProps.header.info.menuInfo.leftMenu_a ? nextProps.header.info.menuInfo.leftMenu_a : []
			})
		}
	}

	render() {
		return (
			<div id='ui-wrap'>
				<Header active={-1}/>
				{
        			this.props.header.info ?
        			<div className="ui-main invoice-wrap ui-fixed-footer">
						<LeftMenu dataSource={this.state.leftMenuList} curMenuUrl={`webapp/invoice/fill.html`}/>
						<div className="invoice-cont">
			        		<h2>发票申请</h2>

							<InvoiceInfo/>
							<AddressInfo/>
							<ButtonRow/>
						</div>
					</div> :  null
		        }
				{ISShowConsult ? <UiConsult /> : null}
        		{ISShowConsult ? <Footer /> : null}
			</div>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		header: state.header,
	}
}

export default connect(mapStateToProps)(App);

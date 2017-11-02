import React, {
	Component,
} from "react";
import {
    connect
} from 'react-redux';

import Header from 'contents/header/index.jsx';
import Footer from 'contents/footer/index.jsx';
import LeftMenu from 'contents/leftMenu/index.jsx';

import ApiConfig from 'widgets/apiConfig/index.js';
import UiConsult from "components/ui-consult/index.jsx";
import InvoiceInfo from "./contents/invoiceInfo/indexd.jsx";
import AddressInfo from "./contents/addressInfo/indexd.jsx";
import ButtonRow from "./contents/buttonRow/indexd.jsx";
import Msg from 'components/ui-msg/index.jsx';

import YdjAjax from 'components/ydj-Ajax/index.js';

import {
  _extend,
  _getQueryObjJson
} from 'local-Utils/dist/main.js';
import Storage from 'local-Storage/dist/main.js';
import {updateTotal,updateDetail} from './action/index.js';

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

		this.queryStringObj = this.getQueryStringObj;
		this.state = {
			leftMenuList: [],
		}

		if(!this.queryStringObj.billNo) {
			window.history.back();
		}
	}

	get getQueryStringObj() {
		return _getQueryObjJson();
	}

	componentWillMount() {
		if (this.props.header.info) {
			this.setState({
				leftMenuList: this.props.header.info.menuInfo.leftMenu_a ? this.props.header.info.menuInfo.leftMenu_a : []
			});
			this._getInvoiceInfo(this.props.header.info.agentInfo.agentId,(res)=>{
				let data = this._getRealInvoice(res.data);
				this.props.dispatch(updateDetail(data));
			});
		}
	}
	componentWillReceiveProps(nextProps) {
		if (!this.props.header.info && nextProps.header.info) {
			this.setState({
				leftMenuList: nextProps.header.info.menuInfo.leftMenu_a ? nextProps.header.info.menuInfo.leftMenu_a : []
			});
			this._getInvoiceInfo(nextProps.header.info.agentInfo.agentId, (res)=>{

				let data = this._getRealInvoice(res.data);
				this.props.dispatch(updateDetail(data));
			});
		}
	}

	get errHandler() {
		return {
			failedHandle: (res) => {

				this.setState({
					isAlert: true,
					alertMsg: {
						msg: res.message
					},
					sending: false,
				})
			},
			errorHandle: (xhr, errorType, error, errorMsg) => {

				this.setState({
					isAlert: true,
					alertMsg: errorMsg,
					sending: false,
				})
			}
		}
	}

	_getRealInvoice(data) {
		let addressInfo = {'billContactsAddress': data.billContactsAddress,};
		if(data.billType == 2) {

		}
		return {
			'invoiceInfo': {
				'billNo': data.billNo,
				'billHeaderType': data.billHeaderType, // 抬头类型 1 公司 2 个人
				'billHeader': data.billHeader, // 抬头
				'billTaxpayerNum': data.billTaxpayerNum, // 纳税人识别号
				'billContent': data.billContent, // 发票内容
				'billType': data.billType, // 发票类型 1 电子 2纸质
				'remark': data.remark, // 备注
			},
			'addressInfo': {
				'billContactsAddress': data.billContactsAddress,
		  		'billContactsName': data.billContactsName,
		  		'billContactsPhone': data.billContactsPhone,
			},
			'totalInfo': {
				billAmount: data.billAmount,
				orderNoList: data.orderNoList
			}
		}

	}
	_getInvoiceInfo(agentId, back) {

		let opt = {
			url: ApiConfig.viewInvoice,
			type: 'GET',
			data: {
				billNo: this.queryStringObj.billNo,
				agentId: agentId,
			},
			successHandle: (res) => {
				if (back) {
					back(res);
				}
			},
			...this.errHandler
		}
		new YdjAjax(opt);
	}
	_showMsg() {

      	if (this.state.isAlert) {
			let attr = {
				showFlag: true,
				showType: 'alert', // info alert confirm
				backHandle: () => {
					if (this.state.alertMsg.loginErr) {

						window.location.href = '/';
					}
					this.setState({
						isAlert: false
					})

				}
			};
			return (
				<Msg initData={attr}>
					<p>{this.state.alertMsg.msg}</p>
				</Msg>
			)
		}
		return null;
	}

	render() {
		return (
			<div id='ui-wrap'>
				<Header active={-1}/>
				<div className="ui-main invoice-wrap ui-fixed-footer">
					<LeftMenu dataSource={this.state.leftMenuList} curMenuUrl={`webapp/invoice/fill.html`}/>
					{
	        			this.props.main.detail ?
						<div className="invoice-cont">
			        		<h2>发票申请</h2>
			        		 <InvoiceInfo/>
			        		 <AddressInfo/>
			        		 <ButtonRow/>
						</div> : null
					}
				</div>
				{ISShowConsult ? <UiConsult /> : null}
        		{ISShowConsult ? <Footer /> : null}
        		{this._showMsg()}
			</div>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		header: state.header,
		main: state.main
	}
}

export default connect(mapStateToProps)(App);

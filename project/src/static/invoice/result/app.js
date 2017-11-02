import React, {
	Component,
} from "react";
``
import {
    connect
} from 'react-redux';

import {Icon} from 'local-Antd';

import Header from 'contents/header/index.jsx';
import Footer from 'contents/footer/index.jsx';
import LeftMenu from 'contents/leftMenu/index.jsx';

import UiConsult from "components/ui-consult/index.jsx";

import {
  _extend,
  _getQueryObjJson
} from 'local-Utils/dist/main.js';


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
		this.invoiceNo = this.getQueryStringObj.invoiceNo;
		if(!this.invoiceNo) {
			window.location.href = '/webapp/invoice/list.html';
		}
		this.state = {};
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
	get getQueryStringObj() {
		return _getQueryObjJson();
	}

	render() {
		return (
			<div id='ui-wrap'>
				<Header active={-1}/>
				<div className="ui-main invoice-wrap ui-fixed-footer">
					<LeftMenu dataSource={this.state.leftMenuList} curMenuUrl={`webapp/invoice/result.html`}/>
					<div className="invoice-cont">
						<div className="result-block">
							<div className="result-status"><span className="status-ok"></span></div>
							<div className="status-txt">
								<h3>恭喜您，您的发票申请已提交</h3>
								<span>申请单号为：{this.invoiceNo}</span>
							</div>
						</div>
						<div className="button-row">
							<button onClick={()=>{window.location.href = '/webapp/invoice/list.html'}}>返回发票列表</button>
						</div>
					</div>
				</div>
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

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
import Header from 'contents/header/index.jsx';
import YdjAjax from 'components/ydj-Ajax/index.jsx';
import LeftMenu from 'contents/leftMenu/index.jsx';
import UiConsult from "components/ui-consult/index.jsx";
import BaseCss from 'local-BaseCss/dist/main.css';
// import Footer from 'contents/footer/index.jsx';
import GlobleCss from 'components/globleCss/index.scss';
import Msg from 'components/ui-msg/index.jsx';
import Loading from 'components/ui-loading/index.jsx';
import './sass/index.scss';

const ISShowConsult = ((domain)=>{
  let reg = /www/;
  return reg.test(domain);
})(document.domain);
import {Row,Col} from 'local-Antd';
import ApiConfig from 'widgets/apiConfig/index.js';

class App extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = this.defaultState;
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
				this._getVoiceDetail();
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
				this._getVoiceDetail();
			})
		}

	}
	get formInit() {
		let data = {
			agentId: _getQueryObjJson().agentId,
            billNo: _getQueryObjJson().billNo
		};
		return data;
	}
	get defaultState() {
		return {
            data: {},
			loading: false,
			leftMenuList: [],
		};
	}
	get listQueryAttr() {
		return {
			queryParam: {
				url: ApiConfig.viewInvoice,
			},
			name: '发票详情',
		}
	}
	//列表拉取成功回调
	_cbListSuccess(res) {
		// debugger
		let states = {
			loading: false,
		};
		if (res.status === 200) {
			states.data = res.data;
			this.setState(states);
		}
	}

	//拉取列表
	_getVoiceDetail() {
		this.setState({
			loading: true,
			formData: this._formData
		});
	}

	render() {
		let DATA = this.state.data;
		return (
			<div id='ui-wrap'>
		        <Header active={-1}/>
		        <div className="ui-main ui-order-list ui-fixed-footer">
		        	<LeftMenu dataSource={this.state.leftMenuList} curMenuUrl={`webapp/invoice/list.html`}/>
		        	<div className="list-cont">
		        		<h2>发票详情</h2>
						{
							DATA.billStatus == -1 ?
							<div className="status reject">
	                            {DATA.billStatusName}
								<a href={`/webapp/invoice/edit.html?billNo=${this._formData.billNo}&agentId=${this._formData.agentId}`}>修改申请信息</a>
	                        </div>:
							<div className="status">
	                            {DATA.billStatusName}
	                        </div>
						}

						<div className="invoice-info info">
							<h4>发票信息</h4>
							<div className="cont">
								<div className="item">
									<span>发票抬头：</span>{DATA.billHeader}
								</div>
								<div className="item">
									<span>抬头类型：</span>{DATA.billHeaderTypeName}
								</div>
								<div className="item">
									<span>发票内容：</span>{DATA.billContentName}
								</div>
								<div className="item">
									<span>发票类型：</span>{DATA.billTypeName}
									{
										DATA.billType == 2 ?
										<i>(纸质发票寄出时间大约为20个工作日，建议使用电子发票)</i> : null
									}
								</div>
								<div className="item">
									<span>纳税人识别号：</span>{DATA.billTaxpayerNum}
								</div>
								<div className="item">
									<span>备注：</span>{DATA.remark || '未填写'}
								</div>
								<div className="item">
									<span>开票金额：</span><em>￥{DATA.billAmount}</em>
								</div>
								{
									DATA.billStatus == -1 ?
									<div className="item">
										<span>驳回原因：</span>{DATA.rejectRemark}
									</div> : null
								}
							</div>

						</div>
						<div className="receiver-info info">
							<h4>快递/收件信息</h4>
							{DATA.billType == 2 ?
							<div className="cont">
								<div className="item">
									<span>收件人地址：</span>{DATA.billContactsAddress}
								</div>
								<div className="item">
									<span>收件人姓名：</span>{DATA.billContactsName}
								</div>
								<div className="item">
									<span>收件人电话：</span>{DATA.billContactsPhone}
								</div>
								{
									DATA.billStatus == 3 ?
									<div>
										<div className="item">
											<span>快递公司：</span>{DATA.expressTypeName || '暂无信息'}
										</div>
										<div className="item">
											<span>快递单号：</span>{DATA.expressNo || '暂无信息'}
										</div>
									</div> : null
								}
							</div> :
							<div className="cont">
								<div className="item">
									<span>邮箱地址：</span>{DATA.billContactsAddress}
								</div>
							</div>
							}
						</div>
		        	</div>

		        </div>
		        {this.state.loading?<YdjAjax queryAttr={this.listQueryAttr} successHandle={this._cbListSuccess.bind(this)} queryData={this.state.formData} />:null}
				{ISShowConsult ? <UiConsult /> : null}
                {this.state.loading ? <Loading/> : null}

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

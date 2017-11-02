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
import VoiceTable from './contents/voiceTable/index.jsx';
import SearchVoice from './contents/SearchVoice/index.jsx';
import UiConsult from "components/ui-consult/index.jsx";
import BaseCss from 'local-BaseCss/dist/main.css';
// import Footer from 'contents/footer/index.jsx';
import GlobleCss from 'components/globleCss/index.scss';
import Msg from 'components/ui-msg/index.jsx';
// import {removeAlert,showAdd} from './action/alertAction.js';
import './sass/index.scss';

const ISShowConsult = ((domain)=>{
  let reg = /www/;
  return reg.test(domain);
})(document.domain);
import {Row,Col,Input,Button,Icon} from 'local-Antd';
import ApiConfig from 'widgets/apiConfig/index.js';

class App extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = this.defaultState;
	}
	componentWillMount() {
		if (this.props.header.info) {
			this.userInfo = this.props.header.info;
			this._formData = this.formInit;
			this.setState({
				formData: this._formData,
				leftMenuList: this.userInfo.menuInfo.leftMenu_a ? this.userInfo.menuInfo.leftMenu_a : []
			}, () => {
				this._getVoiceList();
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
				this._getVoiceList();
			})
		}


	}
	get formInit() {
		let state = {
			limit: 10,
			offset: 0
		};
		state.agentId = this.userInfo.agentInfo.agentId;
		// state.agentId = '1117527018'
		return state;
	}
	get defaultState() {
		return {
			data: [],
			loading: false,
			pagination: {},
			leftMenuList: [],
		};
	}
	get listQueryAttr() {
		return {
			queryParam: {
				url: ApiConfig.invoiceList,
			},
			name: '发票列表',
		}
	}
	//列表拉取成功回调
	_cbListSuccess(res) {
		// debugger
		let states = {
			loading: false,
		};
		if (res.status === 200) {
			states.data = res.data.resultBean;
			// states.dateAll = res.data;
			states.pagination = {
				limit: this._formData.limit,
				total: res.data.totalSize,
				current: this._getPage(this._formData.offset)
			};
			this.setState(states);
		}
	}
	//获取当前页码
	_getPage(offset) {
		let page = 1;
		if (offset) {
			page = Math.floor(offset / this._formData.limit) + 1
		}
		return page;
	}
	//拉取列表
	_getVoiceList() {
		this.setState({
			loading: true,
			formData: this._formData
		});
	}
	//根据分页、搜索拉列表
	_changeAgentForm(type, data) {
		if (!type) {
			return;
		}
		switch (type) {
			case 'pageIndex':
				this._formData.offset = (data.pageIndex - 1) * this._formData.limit;
				this._getVoiceList();
				break;
			case 'form':
				let pageSize = this._formData.limit;
				let agentId = this._formData.agentId;
				this._formData = {
					...data,
					offset: 0,
					limit: pageSize,
					agentId: agentId
					// agentId: '1117527018'
				}
                this._getVoiceList();

				break;
		}
	}

	render() {
		return (
			<div id='ui-wrap'>
		        <Header active={-1}/>
		        <div className="ui-main ui-order-list ui-fixed-footer">
		        	<LeftMenu dataSource={this.state.leftMenuList} curMenuUrl={`webapp/invoice/list.html`}/>
		        	<div className="list-cont">
		        		<h2>发票列表</h2>
						<SearchVoice  changeHandle={this._changeAgentForm.bind(this)} loading={this.state.loading}/>
		        		<VoiceTable dataSource={this.state.data} pageSource={this.state.pagination} changeHandle={this._changeAgentForm.bind(this)} loading={this.state.loading}/>
		        	</div>
		        </div>
		        {this.state.loading?<YdjAjax queryAttr={this.listQueryAttr} successHandle={this._cbListSuccess.bind(this)} queryData={this.state.formData} />:null}
				{ISShowConsult ? <UiConsult /> : null}
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

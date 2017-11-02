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
import AgentsTable from './contents/agentsTable/index.jsx';
import SearchAgent from './contents/searchAgent/index.jsx';
import UiConsult from "components/ui-consult/index.jsx";
import BaseCss from 'local-BaseCss/dist/main.css';
// import Footer from 'contents/footer/index.jsx';
import GlobleCss from 'components/globleCss/index.scss';
import Msg from 'components/ui-msg/index.jsx';
import ResetPwd from './contents/resetPwd/index.jsx';
import AddAgent from './contents/addAgent/index.jsx';
import {removeAlert,showAdd} from './action/alertAction.js';
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
			 debugger
			this.userInfo = this.props.header.info;
			this._formData = this.formInit;
			this.setState({
				formData: this._formData,
				leftMenuList: this.userInfo.menuInfo.leftMenu_a ? this.userInfo.menuInfo.leftMenu_a : []
			}, () => {
				this._getAgentList();
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
				this._getAgentList();
			})
		}
		this.setState({
			showPassword: nextProps.showPassword,
			showAdd: nextProps.showAdd
		})

	}
	get formInit() {
		let state = {
			limit: 10,
			offset: 0
		};
		state.agentId = this.userInfo.agentInfo.agentId;
		return state;
	}
	get defaultState() {
		return {
			data: [],
			// isOnOrderError: false,
			loading: false,
			showPassword: false,
			showAdd: false,
			pagination: {},
			leftMenuList: [],
		};
	}
	get listQueryAttr() {
		return {
			queryParam: {
				url: ApiConfig.operators,
			},
			name: '操作员列表',
		}
	}
	//列表拉取成功回调
	_cbListSuccess(res) {
		// debugger
		let states = {
			loading: false,
		};
		if (res.status === 200) {
			states.data = res.data.listData;
			// states.dateAll = res.data;
			states.pagination = {
				limit: this._formData.limit,
				total: res.data.listCount,
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
	_getAgentList() {
		this.setState({
			loading: true,
			formData: this._formData
		});
	}
	//根据分页、搜索拉列表
	_changeAgentForm(type, data, searchFlag) {
		if (!type) {
			return;
		}
		switch (type) {
			case 'pageIndex':
				this._formData.offset = (data.pageIndex - 1) * this._formData.limit;
				this._getAgentList();
				break;
			case 'form':
				let pageSize = this._formData.limit;
				let agentId = this._formData.agentId;
				this._formData = {
					...data,
					offset: 0,
					limit: pageSize,
					agentId: agentId
				}

				if (searchFlag) {
					this._getAgentList();
				}
				break;
		}
	}
	//新增操作员
	_showAdd(val) {
		let obj = {
			show: true,
			model: 1,
			info: {}
		}
		this.props.dispatch(showAdd(obj));
	}
	//添加成功，刷新列表
	addSucc() {
		this._getAgentList();
	}
	render() {
		return (
			<div id='ui-wrap'>
		        <Header active={-1}/>
		        <div className="ui-main ui-order-list ui-fixed-footer">
		        	<LeftMenu dataSource={this.state.leftMenuList} curMenuUrl={`webapp/account/operator.html`}/>
		        	<div className="list-cont">
		        		<h2>操作员管理</h2>
						<SearchAgent  changeHandle={this._changeAgentForm.bind(this)} loading={this.state.loading}/>
						<Button className="add-agent" onClick={this._showAdd.bind(this)}>新增</Button>
		        		<AgentsTable dataSource={this.state.data} pageSource={this.state.pagination} changeHandle={this._changeAgentForm.bind(this)} loading={this.state.loading}/>
		        	</div>
		        	{this.state.isOnOrderError && this.orderErrInfo? <Msg initData={this.orderErrInfo}><p>{this.orderErrInfo.content}</p></Msg> : null}
		        </div>
		        {this.state.loading?<YdjAjax queryAttr={this.listQueryAttr} successHandle={this._cbListSuccess.bind(this)} queryData={this.state.formData} />:null}
				{ISShowConsult ? <UiConsult /> : null}

				{this.state.showPassword.show ? <ResetPwd /> : null}
				{this.state.showAdd.show ? <AddAgent sucHandle={this.addSucc.bind(this)}/> : null}
				{
		          (() => {
		              let res = [];
		              if (this.props.isAlert) {
		                let attr = {
		                  showFlag: true,
		                  showType: 'alert', // info alert confirm
		                  backHandle: () => {
		                    this.props.dispatch(removeAlert());
		                    if (this.props.alertMsg.goLogin) {
		                      window.location.href = '/';
		                    }
		                  }
		                };
		                res.push(<Msg initData = {attr}><p>{this.props.alertMsg.msg}</p></Msg>)
		              }
		              return res;
		            })()
		        }
	        </div>
		)
	}
}
const mapStateToProps = (state) => {
	return {
		header: state.header,
		isAlert: state.alert.isAlert,
		alertMsg: state.alert.alertMsg,
		showPassword: state.alert.showPassword,
		showAdd : state.alert.showAdd
	}
}

export default connect(mapStateToProps)(App);

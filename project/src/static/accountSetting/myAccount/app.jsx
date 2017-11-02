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

	}
	get formInit() {
		let data = {
			agentId: this.userInfo.agentInfo.agentId
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
				url: ApiConfig.myAccount,
			},
			name: '我的账户',
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
	_getAgentList() {
		this.setState({
			loading: true,
			formData: this._formData
		});
	}

	render() {
		return (
			<div id='ui-wrap'>
		        <Header active={-1}/>
		        <div className="ui-main ui-order-list ui-fixed-footer">
		        	<LeftMenu dataSource={this.state.leftMenuList} curMenuUrl={`webapp/account/mine.html`}/>
		        	<div className="list-cont">
		        		<h2>我的账户</h2>
                        <div className="inner">
                            <Row className="inner-item" >
                                <Col span={8}>公司名称：{this.state.data.agentName}</Col>
                                <Col span={16}>账户类型：{this.state.data.accountTypeName}</Col>
                            </Row>
                            <Row className="inner-item" >
                                <Col span={8}>联系人姓名：{this.state.data.contactName}</Col>
                                <Col span={8}>联系电话：{this.state.data.contactMobile}</Col>
                                <Col span={8}>电子邮箱：{this.state.data.email}</Col>
                            </Row>
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

import React, {
  Component,
  PropTypes
} from 'react';
import Request from 'local-Ajax/dist/main.js';
import CheckLogin from 'components/check-Login/index.jsx';
import Msg from 'components/ui-msg/index.jsx';
export default class YdjAjax extends Component {
	constructor(props,context){
    	super(props,context);
		this.request;
		this.data = this.props.queryAttr;
		this.props.queryData && (this.data.queryParam.data = this.props.queryData);
		this.state = {
			checkLogin: {
				isLogout: false,
				msg: '',
				businessError: false,
				isOtherError: false,
			}
		};
	}
	componentWillMount() {
		this.doAjax(this.props.dataSource);
	}
	get request() {
		this._request = new Request();
	}
	checkLogin() {
		let xhr = this._state.xhr;
		let states = {};
		if (xhr.status == 302 || xhr.status == 420 || xhr.status == 421 || xhr.status == 404 || xhr.status == 200) {
			states.isLogout = true;
			states.businessError = false;
			states.isOtherError = false;
			switch (xhr.status) {
				case 200:
					states.msg = '请先登录，如有疑问，请联系云地接客服：400-060-0766';
					break;
				case 302:
					states.msg = '服务器异常，请重新登录，如有疑问，请联系云地接客服：400-060-0766';
					break;
				case 420:
					states.msg = '会话已失效，请重新登录！';
					break;
				case 421:
					states.msg = '您的账号已被封禁，如有疑问，请联系云地接客服：400-060-0766';
					break;
				case 404:
					states.msg = '服务器异常，请重新登录，如有疑问，请联系云地接客服：400-060-0766';
					break;
			}
		} else {
			states.isLogout = false;
			states.businessError = false;
			states.isOtherError = true;
			states.msg = `请求发送失败 ${xhr.status}`;
		}
		return states;
	}
	doAjax() {
		let data = this.data;
		this._request.ajax(data.queryParam).then(res => {
			if (res.status === 200) {
				this.props.successHandle && this.props.successHandle(res);
			} else {
				this._state = res;
				// TODO: 统一提示业务异常 + 是否已在错误状态
				// throw (res.message || `${data.name}查询，业务处理异常${res.status}, 请联系研发人员`);
				this.setState({
					isLogout: false,
					businessError: true,
					isOtherError: false,
					msg: (res.message || `${data.name}查询，业务处理异常${res.status}, 请联系研发人员`)
				});
			}
		}, (xhr, errorType, error) => {
			console.log(xhr, errorType, error);
			// 统一处理checkLogout + 是否已在错误状态
			this._state = {xhr: xhr, errorType: errorType, error: error};
			this.setState(this.checkLogin());
		});
	}
	_handle() {
		this.props.errorHandle && this.props.errorHandle(this._state);
	}
	_goTologin() {
		window.location.href = '/cloud';
	}
	_businessError() {
		this.props.bErrorHandle && this.props.bErrorHandle(this._state);
	}
	_renderResult() {
		let attr = false;
		if (this.state.isLogout === true) {
			attr = {
				showFlag: true,
				showType: 'alert', // info alert confirm
				backHandle: this._goTologin.bind(this)
			};
		} else if (this.state.isOtherError === true) {
			attr = {
				showFlag: true,
				showType: 'alert', // info alert confirm
				backHandle: this._handle.bind(this)
			};
		} else if (this.state.businessError === true) {
			attr = {
				showFlag: true,
				showType: 'alert', // info alert confirm
				backHandle: this._businessError.bind(this)
			};
		}
		if(attr) {
			return (
				<Msg initData = {attr}><p>{this.state.msg}</p></Msg>
			)
		} else {
			return null;
		}

	}
	render() {
		return (
			<div>{this._renderResult()}</div>
		)
	}
}

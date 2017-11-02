import React, {Component, PropTypes} from "react";
import ApiConfig from 'widgets/apiConfig/index.js';
import Request from "local-Ajax/dist/main.js";
import Message from "components/ui-msg/index.jsx";
import Input from "components/ui-input/index.jsx";
import RegPassword from "./js/index.jsx";
import UserNavMsg from "./js/message.jsx";
import UserNavList from "./js/list.jsx";

import userNavCss from "./sass/index.scss";

const USERICON = ['icon-order', 'icon-card', 'icon-account', 'icon-fan', 'icon-lock', 'icon-quit'];
const PASSWORDS = ApiConfig.editPassword;
const LOGOUT = ApiConfig.logout;

class UIUserNav extends Component {

	static propTypes = {
		message : PropTypes.object,
		menu : PropTypes.array,
		agent : PropTypes.object
	}
	constructor(props, context) {
		super(props, context);
		this.request;
		this.state = this.defaultState;
	}

	get defaultState(){
		return {
			messageShow : false,
			menuShow : false,
			isEditPassword: false,
			password: RegPassword.pass,
			rePassword : RegPassword.repass,
			isForm : false,
		};
	}

	get request(){
		return this._request = new Request();
	}

	get agent(){
		return this.props.agent;
	}

	get password(){
		return this.state.password;
	}

	get rePassword(){
		return this.state.rePassword;
	}

	get isEditPassword(){
		return this.state.isEditPassword;
	}

	get messageShow(){
		return this.state.messageShow;
	}

	get menuShow(){
		return this.state.menuShow;
	}

	get message(){
		return this.props.message;
	}

	get menu(){
		return this.props.menu;
	}

	get messageList(){
		let _message = this.message.list || [];
		if(_message.length >= 5) _message.length = 5;
		return _message;
	}

	get isForm(){
		return this.state.isForm;
	}


	get menuList(){
		let _navbar = this.menu || [];
		_navbar.map((item, key) => {
			return item.icon = USERICON[key]
		})
		return _navbar;
	}

	componentWillReceiveProps(nextProps){
	    this.setState({
    		messageShow : false,
			menuShow : false,
	    })
	}

	eiditPassword(res){
		let states = {}
		if(res.name == 'password') Object.assign(states, {
			password : {
				val : res.value,
				reg : !res.error
			},

		})
		if(res.name == 'repassword') Object.assign(states, {
			rePassword : {
				val : res.value,
				reg : !res.error
			}
		})
		this.setState(states, this.checkPassword);
	}

	checkPassword(){
		let reg = false;
		if(this.password.reg && this.rePassword.reg && this.rePassword.val == this.password.val) reg = true;
		this.setState({
			isForm : reg,
		})
	}

	showConfirm(type){
		if(type == 'confirm' || type == 'ok'){
			if(!this.isForm) return true;
			else {

				this.editPassword();
				this.setState({
					isEditPassword : false
				})
			}
		}else{
			this.setState({
					isEditPassword : false
				})
		}
	}

	editPassword(){
		let opt = {
			url : PASSWORDS,
			type: 'POST',
			// headers:{'Content-Type': 'application/json'},
			data : {
				agentUserId : this.agent.agentUserId,
				password : this.password.val
			},
		}
		this.setState({
			isForm : false
		});
		this._request.ajax(opt)
		.then((res) => {
			this.setState({
				isForm : true
			});
			if(res.status == 200) window.location.href = LOGOUT;
			else alert(res.message);
		}, (err) => {
			window.location.href='/';
		})

	}

	menuClick(key, tag){
		if(key == 4) {
			this.setState({
				isEditPassword : true
			});

		}
		this.setState({
			menuShow : false
		})
	}

	showMessage(e){
		debugger
		let show = this.state.messageShow;
		if(show) {
			this.setState({
				messageShow : false,
			});
		} else {
			this.setState({
				messageShow : true,
				menuShow : false,
			});
		}
	}

	showMenu(){
		this.setState({
			menuShow : true,
			messageShow : false,
		})
	}

	render(){
		return (
			<div
			className='ui-user-nav'>
				<div
				className='ui-message'>
					<span
					onClick={this.showMessage.bind(this)}
					>
						<i className='icon-notice'></i>
						<code
						className={(this.message.total > 0 || this.message.total == '···') && 'show'}
						>{this.message.total}</code>
						通知
					</span>
					<UserNavMsg
					message={this.messageList}
					show={this.messageShow}
					/>
				</div>
				<div
				className='ui-user'>
					<span
					onClick={this.showMenu.bind(this)}>
						<i></i>
						<code></code>
					</span>
					<UserNavList
					show={this.menuShow}
					list={this.menuList}
					onHandle={this.menuClick.bind(this)}
					/>
				</div>
				{
					<Message
					initData={{
						title : '修改密码?',
						showType : 'confirm',
						okText : '修改',
						asyn : true,
						showFlag : this.isEditPassword,
						backHandle :this.showConfirm.bind(this)
					}}
					disabled={this.isForm}
					>
						<dl>
							<dt><i>*</i>新密码</dt>
							<dd>
								<Input
								name='password'
								type='password'
								reg={/\S{6,}/}
								sign='新密码'
								placeholder='请输入新密码'
								onHandle={this.eiditPassword.bind(this)}
								/>
							</dd>
						</dl>
						<dl>
							<dt><i>*</i>确认新密码</dt>
							<dd>
								<Input
								sign='确认新密码'
								name='repassword'
								type='password'
								reg={/\S{6,}/}
								placeholder='请输入确认新密码'
								onHandle={this.eiditPassword.bind(this)}
								/>
							</dd>
						</dl>
					</Message>
				}
			</div>
			)
	}
}

export default UIUserNav;


import React, {Component, PropTypes} from "react";
import { connect } from 'react-redux';
import ApiConfig from 'widgets/apiConfig/index.js';
import Message from "components/ui-msg/index.jsx";
import YdjAjax from 'components/ydj-Ajax/index.js';
import Input from "components/ui-input/index.jsx";
import {showAlert,showPassword} from '../../action/alertAction.js';
import './sass/index.scss';

class ResetPwd extends Component {
    constructor(props,context) {
        super(props, context);
        this.state = {
            canSubmit: false, //是否可以提交
            password: {},
            rePassword: {}
        }
    }
    /**
     * 存输入的密码，@todo 没必要放在state里，后期优化
     * @param  {[type]} res [description]
     * @return {[type]}     [description]
     */
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
    /**
     * 检查密码输入是否正确
     * @return {[type]} [description]
     */
    checkPassword(){
		let reg = false;
		if(this.state.password.reg && this.state.rePassword.reg && this.state.rePassword.val == this.state.password.val) reg = true;
		this.setState({
			canSubmit : reg,
		})
	}
    /**
     * 修改密码/取消
     * @param  {[type]} type [description]
     * @return {[type]}      [description]
     */
    showConfirm(type){
		if(type == 'confirm' || type == 'ok'){
			if(!this.state.canSubmit) return true;
			else {
				this.gotoChange();
			}
		}else{
            let obj = {
                show: false,
                loginName: '',
                agentUserId: ''
            }
            this.props.dispatch(showPassword(obj));
		}
	}
    /*修改密码*/
    gotoChange() {
        let opt = {
            url: ApiConfig.updatePassword,
            type: 'POST',
            data: {
                agentUserId: this.props.showPassword.agentUserId,
                password: this.state.password.val
            },
            successHandle: (res)=>{
                let obj = {
        			show: false,
        			loginName: '',
        			agentUserId: ''
        		}
        		this.props.dispatch(showPassword(obj))
            },
            ...this.errorHanlde()
        }
        new YdjAjax(opt)
    }
    /*错误处理*/
    errorHanlde(res){
		let handles = {
			failedHandle: (res) => {
				this.props.dispatch(showAlert(res.message));
			},
			errorHandle: (xhr, errorType, error, errorMsg) => {
				this.props.dispatch(showAlert(errorMsg));
			}
		};
		return handles;
    }
    render(){
        return(
            <div>
            {
                <Message
                initData={{
                    title : '修改密码',
                    showType : 'confirm',
                    okText : '修改',
                    asyn : true,
                    showFlag : true,
                    disabled: this.state.canSubmit,
                    backHandle :this.showConfirm.bind(this)
                }}

                uiClassName = 'resetPwd'
                >
                    <dl>
                        <dt>登录名：<i>*</i></dt>
                        <dd>
                            <Input
                            name='loginName'
                            type='text'
                            readonly='true'
                            value={this.props.showPassword.loginName}
                            />
                        </dd>
                    </dl>
                    <dl>
                        <dt>新密码：<i>*</i></dt>
                        <dd>
                            <Input
                            name='password'
                            type='password'
                            reg={/^(?!(?:\d+|[a-zA-Z]+)$)[\da-zA-Z]{6,}$/}
                            sign='密码(6位以上数字加字母组合)'
                            placeholder='请输入新密码'
                            onHandle={this.eiditPassword.bind(this)}
                            />
                        </dd>
                    </dl>
                    <dl>
                        <dt>确认新密码：<i>*</i></dt>
                        <dd>
                            <Input
                            sign='确认密码'
                            name='repassword'
                            type='password'
                            reg={/^(?!(?:\d+|[a-zA-Z]+)$)[\da-zA-Z]{6,}$/}
                            sign='密码(6位以上数字加字母组合)'
                            placeholder='请输入确认密码'
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

function mapStateToProps(state) {
    return {
        showPassword: state.alert.showPassword
    }
}

export default connect(mapStateToProps)(ResetPwd)

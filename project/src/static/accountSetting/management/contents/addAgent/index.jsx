
import React, {Component} from "react";
import { connect } from 'react-redux';
import ApiConfig from 'widgets/apiConfig/index.js';
import Message from "components/ui-msg/index.jsx";
import YdjAjax from 'components/ydj-Ajax/index.js';
import Input from "components/ui-input/index.jsx";
import {showAlert,showAdd} from '../../action/alertAction.js';
import {Icon, Radio, Select} from 'local-Antd';
const RadioGroup = Radio.Group;
const Option = Select.Option;
import './sass/index.scss';

class AddAgent extends Component {
    constructor(props,context) {
        super(props, context);
        let {loginName,agentUserName,phone,email} = props.showAdd.info;
        this.data = {
            loginName,
            agentUserName,
            phone,
            email
        }
        this.state = {
            canSubmit: props.showAdd.model == 2 ? true : false, //是否可以提交
            model: props.showAdd.model,//模式：2编辑/1新增
            type: props.showAdd.info.type || 1,//账户类型,1：操作员，2：管理员
            status: props.showAdd.info.status == 0 ? 0 : 1,//账户状态
            supportBalancePay: props.showAdd.info.supportBalancePay == 0 ? 0 : 1, //余额支付
        }
    }
    getBookInfo(info) {
		this.data[info.name] = info.value;
        if(info.name == 'loginName' || info.name == 'agentUserName'){
            this.checkSubmit();
        }
	}

    /**
     * 检查是否可提交
     * @return {[type]} [description]
     */
    checkSubmit(){
		let reg = false;
		if(this.data.loginName && this.data.agentUserName) reg = true;
		this.setState({
			canSubmit : reg,
		})
	}
    /**
     * 提交/取消
     * @param  {[type]} type [description]
     * @return {[type]}      [description]
     */
    showConfirm(type){
		if(type == 'confirm' || type == 'ok'){
			if(!this.state.canSubmit) return true;
			else {
				this.gotoAdd();
			}
		}else{
            let obj = {
                show: false,
                model: 1,
                info: {}
            }
            this.props.dispatch(showAdd(obj));
		}
	}
    /*提交*/
    gotoAdd() {
        let url = this.state.model == 1 ? ApiConfig.addAggents : ApiConfig.updateAggents;
        let opt = {
            url: url,
            type: 'POST',
            data: {
                agentId: window.__AGENT_INFO.agentId,
                loginName: this.data.loginName,
                agentUserName: this.data.agentUserName,
                phone: this.data.phone,
                email: this.data.email,
                type: this.state.type,
                status: this.state.status,
                supportBalancePay: this.state.supportBalancePay
            },
            successHandle: (res)=>{
                let obj = {
                    show: false,
                    model: 1,
                    info: {}
        		}
        		this.props.dispatch(showAdd(obj));
                this.props.sucHandle && this.props.sucHandle();
            },
            ...this.errorHanlde()
        }
        if(this.state.model == 2){
            opt.data.agentUserId = this.props.showAdd.info.agentUserId
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
    changePay(e) {
        // console.log(this.data.supportBalancePay,e.target.value)
        this.setState({
            supportBalancePay: e.target.value
        })
    }
    changeStatus(e) {
        this.setState({
            status: e.target.value
        })
    }
    changeType(value) {
        this.setState({
            type: value
        })
    }
    render(){
        let _title = this.state.model == 1 ? '新增操作员' : '编辑操作员';
        let _txt = this.state.model == 1 ? '增加' : '修改';
        let onlyRead = this.state.model == 1 ? false : true;
        return(
            <div>
            {
                <Message
                initData={{
                    title : _title,
                    showType : 'confirm',
                    okText : _txt,
                    asyn : true,
                    showFlag : true,
                    disabled: this.state.canSubmit,
                    backHandle :this.showConfirm.bind(this)
                }}
                uiClassName = 'resetPwd'
                >
                    <div>
                        {
                            this.state.model == 1 ?
                            <div className="password-tips">
                                注意：新建账号默认密码为：hbc123456，请提示使用者及时修改。
                            </div> : null
                        }
                    </div>
                    <dl>
                        <dt>登录名：<i>*</i></dt>
                        <dd>
                            <Input
                            name='loginName'
                            type='text'
                            readonly={onlyRead}
                            sign='用户名'
                            placeholder="请输入您的用户名"
                            value={this.props.showAdd.info.loginName}
                            onHandle={this.getBookInfo.bind(this)}
                            />
                        </dd>
                    </dl>
                    <dl>
                        <dt>姓名：<i>*</i></dt>
                        <dd>
                            <Input
                            name='agentUserName'
                            type='text'
                            reg={/^.+$/}
                            sign='姓名'
                            placeholder='请输入您的姓名'
                            value={this.props.showAdd.info.agentUserName}
                            onHandle={this.getBookInfo.bind(this)}
                            />
                        </dd>
                    </dl>
                    <dl>
                        <dt>联系电话：<i></i></dt>
                        <dd>
                            <Input
                            sign='联系电话'
                            name='phone'
                            type='tel'
                            reg={/^\d+$/}
                            placeholder='请输入您的联系电话'
                            value={this.props.showAdd.info.phone}
                            onHandle={this.getBookInfo.bind(this)}
                            />
                        </dd>
                    </dl>
                    <dl>
                        <dt>邮箱：<i></i></dt>
                        <dd>
                            <Input
                            sign='邮箱'
                            name='email'
                            type='email'
                            placeholder='请输入您的邮箱'
                            value={this.props.showAdd.info.email}
                            onHandle={this.getBookInfo.bind(this)}
                            />
                        </dd>
                    </dl>
                    <dl>
                        <dt>余额支付：<i>*</i></dt>
                        <dd>
                            <RadioGroup onChange={this.changePay.bind(this)} value={this.state.supportBalancePay} style={{lineHeight:'36px'}}>
                                <Radio  value={1}>启用</Radio>
                                <Radio  value={0}>禁用</Radio>
                            </RadioGroup>
                        </dd>
                    </dl>
                    <dl>
                        <dt>状态：<i>*</i></dt>
                        <dd>
                            <RadioGroup onChange={this.changeStatus.bind(this)} value={this.state.status} style={{lineHeight:'36px'}}>
                                <Radio  value={1}>启用</Radio>
                                <Radio  value={0}>禁用</Radio>
                            </RadioGroup>
                        </dd>
                    </dl>
                    <dl>
                        <dt>账户类型：<i>*</i></dt>
                        <dd>
                            <Select defaultValue={this.state.type}  onChange={this.changeType.bind(this)} style={{width:'100%'}}>
                                <Option value={1}>操作员</Option>
                                <Option value={2}>管理员</Option>
                            </Select>
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
        showAdd: state.alert.showAdd
    }
}

export default connect(mapStateToProps)(AddAgent)

import React, {
	Component
} from 'react';
// import DatePickerGroup from 'components/ui-date-picker/index.jsx';
import {Form, Input, Button, Icon} from 'local-Antd';
// const FormItem = Form.Item;

export default class SearchAgent extends Component {
	constructor(props, context) {
		super(props, context);
		// this.doms = {};
		this._formData = {};
		this.state = {
			searching: false
		};
	}
	_confirmHandle(searchFlag){
		this.setState({
			searching: true,
		}, ()=> {
			(this._formData.loginName ==undefined || this._formData.loginName =="") && (delete this._formData.loginName);
			(this._formData.agentUserName ==undefined || this._formData.agentUserName=="") && (delete this._formData.agentUserName);
			this.props.changeHandle && this.props.changeHandle('form', this._formData, searchFlag);
		})

	}
	_handleReset() {
		this._formData.loginName && (delete this._formData.loginName);
		this._formData.agentUserName && (delete this._formData.agentUserName);
	}

	_changeHandle(name, value){
		if(!name) {
			return;
		}
		this._formData[name] = (value == undefined || value=="")? null : value;
		// this._confirmHandle(false);
	}

	render() {
		return (
			<Form className="ant-advanced-search-form">
        		<div className="order-search">
					<Input className="order-no" name="loginName" onChange={(event)=>{this._changeHandle('loginName', event.target.value)}} placeholder="请输入登录名查询"/>
					<Input className="hotel-name" name="agentUserName" placeholder="请输入姓名查询" onChange={(event)=>{this._changeHandle('agentUserName', event.target.value)}}/>
					<Button className="submit-btn" onClick={this._confirmHandle.bind(this, true)} loading={this.state.searching && this.props.loading}>搜索</Button>
					<Button htmlType="reset" className="reset-btn" onClick={this._handleReset.bind(this)}>重置</Button>
	        	</div>
        	</Form>
		)
	}
}

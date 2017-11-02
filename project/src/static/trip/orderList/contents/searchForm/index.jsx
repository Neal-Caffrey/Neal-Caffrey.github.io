import React, {
	Component
} from 'react';
import {
	connect
} from 'react-redux';
import {
  _extend
} from 'local-Utils/dist/main.js';
import $ from 'local-Zepto/dist/main.js';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
const momentFormat = 'YYYY-MM-DD';
import {Form, Row, Col, Input, Button, Icon, Select} from 'local-Antd';
const FormItem = Form.Item;
const Option = Select.Option;

import DatePickerGroup from 'components/ui-date-picker/index.jsx';
import {changeFormData, quickSearch} from '../../action/index.js';

class OrderFilter extends Component {
	constructor(props, context) {
		super(props, context);
		this.sourceFormData = {
			'timeQueryType': 1, // 时间过滤类型  1-下单日期；2-出发日期
		};
		this._formData = _extend({}, this.sourceFormData);
		this.state= {
			'reset': false,
			'expand': false,
			'timeQueryType': this.sourceFormData.timeQueryType
		};
	}

	// 日历组件初始化数据
	get dateInit() {
		let start = moment().add(0, 'days').format(momentFormat);
		let end = moment().add(1, 'days').format(momentFormat);
		return [start, end];
	}

	_toggleBtn() {
		const { expand } = this.state;
    	this.setState({ expand: !expand }, ()=>{
    		this._formData = this._checkFormData();
    	});
	}

	_confirmHandle(){
		// 点击搜索
		if(this._formData.timeQueryType == 1){
			this.startTime && (this._formData.createTimeStart = this.startTime);
			this.endTime && (this._formData.createTimeEnd = this.endTime);
		}
		else if(this._formData.timeQueryType == 2){
			this.startTime && (this._formData.serviceTimeStart = this.startTime);
			this.endTime && (this._formData.serviceTimeEnd = this.endTime);
		}
	  	let data = this._checkFormData();
		this.props.dispatch(changeFormData(data));
	}

	_handleReset() {
		// 点击重置 只重置表单数据 不影响订单状态
		// this._orderData = {
		// 	'routeNo': this._formData.routeNo,//订单号
		// 	'timeQueryType': this._formData.timeQueryType,//时间过滤类型  1-下单时间；2-预约时间
		// 	'startTime': this._formData.startTime, //开始时间
		// 	'endTime': this._formData.endTime, //结束时间
		// 	'routeName;': this._formData.routeName;,/商户名称
		// 	'userName': this._formData.userName,//客人姓名
		// 	'userAreaCode': this._formData.userAreaCode,//客人手机区号
		// 	'userMobile': this._formData.userMobile,//客人手机号
		// 	'agentOpName': this._formData.agentOpName,//销售姓名
		// 	'orderByField': this._formData.orderByField,//排序类型 1-下单时间；2-预约时间
		// 	'orderByType': this._formData.orderByType,//排序规则：1:升序；2-降序
		// 	'agentId': this._formData.agentId,//渠道 必填
		// 	'agentOpId': this._formData.agentOpId,//下单人Id  ，非管理员必填
		// };
		this.setState({
			'reset': true,
			'timeQueryType': this.sourceFormData.timeQueryType,
		},()=>{
			$('form')[0].reset();
			this._formData = _extend({}, this.sourceFormData);
			this.endTime = '';
			this.startTime = '';
			this._formData = this._checkFormData();
			this.setState({
				'reset': false
			})
		});
	}

	// 切换日期回调
	_cbSelectDate(dates, dataStrings) {
		this.startTime = dataStrings[0];
		this.endTime = dataStrings[1];

	}

	_changeHandle(name, value){
		if(!name) {
			return;
		}
		let v = (value == undefined || value=="")? null : value.trim();
		this._formData = this.props.formData ? this.props.formData : this._formData;

		(this._formData[name]!=v) && (this._formData[name] = v);
		(v == null) && (delete this._formData[name]);
		this._formData = this._checkFormData();
	}

	_checkFormData() {
		// 排除隐藏条件
		let data = _extend({}, this._formData)
		if(!this.state.expand) {
			this._formData.routeName && (delete this._formData.routeName);
			this._formData.userName && (delete this._formData.userName);
			this._formData.userMobile && (delete this._formData.userMobile);
		}

		console.log(data, this._formData)
		return data;
	}

	_cbChangeTimeType(value) {
		switch(value) {
			case '1':
				this._formData.timeQueryType = 1;
				this._formData.serviceTimeStart && (delete this._formData.serviceTimeStart);
				this._formData.serviceTimeEnd && (delete this._formData.serviceTimeEnd);
				break;
			case '2':
				this._formData.timeQueryType = 2;
				this._formData.createTimeStart && (delete this._formData.createTimeStart);
				this._formData.createTimeEnd && (delete this._formData.createTimeEnd);
				break;
		}
		this.setState({
			'timeQueryType': this._formData.timeQueryType
		});

	}

	render() {
		const formItemLayout = {
	      labelCol: { span: 8 },
	      wrapperCol: { span: 16 },
	    };
		return (
			<Form className="ant-advanced-search-form">
        		<div className="order-search">
        			<Select value={`${this.state.timeQueryType}`} className="time-type" onChange={this._cbChangeTimeType.bind(this)}>
        				<Option value="1">下单日期</Option>
        				<Option value="2">出发日期</Option>
        			</Select>
					<DatePickerGroup
					className="data-range"
					reset={this.state.reset}
					placeholder={['开始日期', '结束日期']}
					onHandle={this._cbSelectDate.bind(this)}/>

					<Input
					className="order-no"
					name="routeNo"
					onChange={(event)=>{this._changeHandle('routeNo', event.target.value)}}
					placeholder="请输入订单号"/>

					<Button
					className="more-btn"
						onClick={this._toggleBtn.bind(this)}>
						{this.state.expand ? '精简搜索' : '高级搜索'}<Icon type={this.state.expand ? 'up' : 'down'}/>
					</Button>
					{this.state.expand ? null:
						<Button className="submit-btn" onClick={this._confirmHandle.bind(this, true)} isLoading={this.state.isLoading}>搜索</Button>
					}
	        	</div>

	        	{
	        		this.state.expand ?
	        		<div className="order-serch-more">
			        	<Row gutter={10}>
							<Col span={8}>
								<FormItem {...formItemLayout} label={`行程名称`}>
									<Input
									className="mer-name"
									name="routeName"
									placeholder="请输入行程名称"
									onChange={(event)=>{this._changeHandle('routeName', event.target.value)}}/>
								</FormItem>
							</Col>
							<Col span={8}>
								<FormItem {...formItemLayout} label={`联系人姓名`}>
									<Input placeholder="请输入联系人姓名"
									name="userName"
									onChange={(event)=>{this._changeHandle('userName', event.target.value)}}/>
								</FormItem>
							</Col>
							<Col span={8}>
								<FormItem {...formItemLayout} label={`联系人电话`}>
									<Input
									placeholder="请输入联系人电话"
									name="userMobile"
									onChange={(event)=>{this._changeHandle('userMobile', event.target.value)}}/>
								</FormItem>
							</Col>
						</Row>
						<Row style={{ marginRight: '-90px' }}>
							<Col span={24} style={{ textAlign: 'right' }}>
								<Button htmlType="reset" className="reset-btn" onClick={this._handleReset.bind(this)}>重置</Button>
								<Button
								className="submit-btn"
								onClick={this._confirmHandle.bind(this, true)}
								isLoading={this.state.isLoading}>搜索</Button>
							</Col>
						</Row>
					</div>: null
				}
        	</Form>
		)
	}
}
const mapStateToProps = (state) => {
	return {
		formData: state.main.formData,
		isLoading: state.main.isLoading,
		// fxOrderStatus: state.main.fxOrderStatus,
		sortor: state.main.sortor,
		// quickSearch: state.main.quickSearch
	}
}

export default connect(mapStateToProps)(OrderFilter);

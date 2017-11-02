import React, {
	Component
} from 'react';
import DatePickerGroup from 'components/ui-date-picker/index.jsx';
import {Form, Row, Col, Input, Button, Icon} from 'local-Antd';
const FormItem = Form.Item;
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
const momentFormat = 'YYYY-MM-DD';
export default class OrderFilter extends Component {
	constructor(props, context) {
		super(props, context);
		this.doms = {};
		this._formData = {};
		this.state = {
			searching: false,
			expand: false,
			checkDate: false,
			bookDate: false
		};
	}
	// 日历组件初始化数据
	get dateInit() {
		let start = moment().add(-3, 'days').format(momentFormat);
		let end = moment().add(-2, 'days').format(momentFormat);
		return [start, end];
	}
	_confirmHandle(searchFlag){
		this.setState({
			searching: true,
		}, ()=> {
			if(!this.state.expand) {
				(this._formData.agentOrderNo !=undefined) && (delete this._formData.agentOrderNo);
				(this._formData.guestNames !=undefined) && (delete this._formData.guestNames);
				(this._formData.contactName !=undefined) && (delete this._formData.contactName);
				(this._formData.checkinBeginDate !=undefined) && (delete this._formData.checkinBeginDate);
				(this._formData.checkinEndDate !=undefined) && (delete this._formData.checkinEndDate);
				(this._formData.createBeginTime !=undefined) && (delete this._formData.createBeginTime);
				(this._formData.createEndTime !=undefined) && (delete this._formData.createEndTime);
			} else {
				(this._formData.agentOrderNo ==undefined || this._formData.agentOrderNo =="") && (delete this._formData.agentOrderNo);
				(this._formData.guestNames ==undefined || this._formData.guestNames=="") && (delete this._formData.guestNames);
				(this._formData.contactName ==undefined || this._formData.contactName=="") && (delete this._formData.contactName);
				(this._formData.checkinBeginDate ==undefined || this._formData.checkinBeginDate=="") && (delete this._formData.checkinBeginDate);
				(this._formData.checkinEndDate ==undefined || this._formData.checkinEndDate=="") && (delete this._formData.checkinEndDate);
				(this._formData.createBeginTime ==undefined || this._formData.createBeginTime=="") && (delete this._formData.createBeginTime);
				(this._formData.createEndTime ==undefined || this._formData.createEndTime=="") && (delete this._formData.createEndTime);
			}
			(this._formData.orderNo ==undefined || this._formData.orderNo =="") && (delete this._formData.orderNo);
			(this._formData.hotelName ==undefined || this._formData.hotelName=="") && (delete this._formData.hotelName);
			this.props.changeHandle && this.props.changeHandle('form', this._formData, searchFlag);
		})

	}
	_handleReset() {
		this.setState({
			checkDate: !this.state.checkDate,
			bookDate: !this.state.bookDate,
		}, ()=>{
			this._formData.agentOrderNo && (delete this._formData.agentOrderNo);
			this._formData.guestNames && (delete this._formData.guestNames);
			this._formData.contactName && (delete this._formData.contactName);
			this._formData.checkinBeginDate  && (delete this._formData.checkinBeginDate);
			this._formData.checkinEndDate  && (delete this._formData.checkinEndDate);
			this._formData.createBeginTime && (delete this._formData.createBeginTime);
			this._formData.createEndTime && (delete this._formData.createEndTime);
			this.props.changeHandle && this.props.changeHandle('reset');
		});
	}
	_toggleBtn() {
		const { expand } = this.state;
    	this.setState({ expand: !expand });
	}
	// 切换日期回调
	_cbSelectDate(dates, dataStrings) {
		this._formData.checkinBeginDate = dataStrings[0];
		this._formData.checkinEndDate = dataStrings[1];
		this._confirmHandle(false);
	}

	_cbSelectBookDate(dates, dataStrings) {
		this._formData.createBeginTime = dataStrings[0];
		this._formData.createEndTime = dataStrings[1];
		this._confirmHandle(false);
	}
	_changeHandle(name, value){
		if(!name) {
			return;
		}
		this._formData[name] = (value == undefined || value=="")? null : value;
		this._confirmHandle(false);
	}
	// componentWillReceiveProps(nextProps){
	// 	if(this.props.resetForm !== nextProps.resetForm){
	// 		this.setState({
	// 			defaultDatePickVal : null
	// 		})
	// 	}
	// }
	render() {
		const formItemLayout = {
	      labelCol: { span: 8 },
	      wrapperCol: { span: 16 },
	    };
		return (
			<Form className="ant-advanced-search-form">
        		<div className="order-search">
					<Input className="order-no" name="orderNo" onChange={(event)=>{this._changeHandle('orderNo', event.target.value)}} placeholder="请输入订单号"/>
					<Input className="hotel-name" name="hotelName" placeholder="请输入酒店名称" onChange={(event)=>{this._changeHandle('hotelName', event.target.value)}}/>
					<Button className="more-btn" onClick={this._toggleBtn.bind(this)}>{this.state.expand ? '收起' : '高级搜索'}<Icon type={this.state.expand ? 'up' : 'down'}/></Button>
					{this.state.expand ? null:
						<Button className="submit-btn" onClick={this._confirmHandle.bind(this, true)} loading={this.state.searching && this.props.loading}>搜索</Button>
					}
	        	</div>
	        	{
	        		this.state.expand ?
	        		<div className="order-serch-more">
			        	<Row gutter={10}>
							<Col span={8}>
								<FormItem {...formItemLayout} label={`第三方订单号`}>
					        		<Input placeholder="请输入第三方订单号" name="agentOrderNo" onChange={(event)=>{this._changeHandle('hotelName', event.target.value)}}/>
								</FormItem>
							</Col>
							<Col span={8}>
								<FormItem {...formItemLayout} label={`联系人`}>
									<Input placeholder="请输入销售姓名" name="contactName" onChange={(event)=>{this._changeHandle('contactName', event.target.value)}}/>
								</FormItem>
							</Col>
							<Col span={8}>
								<FormItem {...formItemLayout} label={`入住人`}>
									<Input placeholder="仅支持单人筛选" name="guestNames" onChange={(event)=>{this._changeHandle('guestNames', event.target.value)}}/>
								</FormItem>
							</Col>
							<Col span={8} className="J-ToCheckDate">
								<FormItem {...formItemLayout} label={`入住时间`} >
									<DatePickerGroup placeholder={['开始日期', '结束日期']} reset={this.state.checkDate} onHandle={this._cbSelectDate.bind(this)}/>
								</FormItem>
							</Col>
							<Col span={8} className="J-ToCheckDate">
								<FormItem {...formItemLayout}  label={`下单时间`}>
									<DatePickerGroup placeholder={['开始日期', '结束日期']} reset={this.state.bookDate} onHandle={this._cbSelectBookDate.bind(this)}/>
								</FormItem>
							</Col>
						</Row>
						<Row>
							<Col span={24} style={{ textAlign: 'right' }}>
								<Button htmlType="reset" className="reset-btn" onClick={this._handleReset.bind(this)}>重置</Button>
								<Button className="submit-btn" onClick={this._confirmHandle.bind(this, true)} loading={this.state.searching && this.props.loading}>搜索</Button>
							</Col>
						</Row>
					</div>: null
				}
        	</Form>
		)
	}
}

import React, {
	Component
} from 'react';
import DatePickerGroup from 'components/ui-date-picker/index.jsx';
import {Form, Input, Button, Icon} from 'local-Antd';
// const FormItem = Form.Item;

export default class SearchAgent extends Component {
	constructor(props, context) {
		super(props, context);
		// this.doms = {};
		this._formData = {};
		this.state = {
			searching: false,
            dateVal: false
		};
	}
	_confirmHandle(){
		this.setState({
			searching: true,
		}, ()=> {
			(this._formData.applyTimeStart ==undefined || this._formData.applyTimeStart =="") && (delete this._formData.applyTimeStart);
			(this._formData.applyTimeEnd ==undefined || this._formData.applyTimeEnd=="") && (delete this._formData.applyTimeEnd);
			this.props.changeHandle && this.props.changeHandle('form', this._formData);
		})

	}
	_handleReset() {
        this.setState({
            dateVal : !this.state.dateVal
        })
		this._formData.applyTimeStart && (delete this._formData.applyTimeStart);
		this._formData.applyTimeEnd && (delete this._formData.applyTimeEnd);
	}

    _cbSelectBookDate(dates, dataStrings) {
        console.log(dataStrings[0],dataStrings[1])
		this._formData.applyTimeStart = dataStrings[0];
		this._formData.applyTimeEnd = dataStrings[1];
	}

	render() {
		return (
			<Form className="ant-advanced-search-form">
        		<div className="order-search">
                    <span>申请时间</span>
                    <DatePickerGroup placeholder={['开始时间', '结束时间']} reset={this.state.dateVal} onHandle={this._cbSelectBookDate.bind(this)}/>
					<Button className="submit-btn" onClick={this._confirmHandle.bind(this)} loading={this.state.searching && this.props.loading}>搜索</Button>
					<Button htmlType="reset" className="reset-btn" onClick={this._handleReset.bind(this)}>重置</Button>
	        	</div>
        	</Form>
		)
	}
}

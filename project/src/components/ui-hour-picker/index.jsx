import React, {Component, PropTypes} from "react";
import moment from  'moment';
import UIHour from 'components/ui-hour/index.jsx';

import UIDatePicker from 'components/ui-date-picker/indexs.jsx';

import './sass/index.scss';

const NOW = moment();

class UIHourPicker extends Component {
	static defaultProps = {
		format : 'YYYY-MM-DD'
	}
	constructor(props, context) {
		super(props, context);
		this.state = this.defaultState;
	}

	get defaultState(){
		return {
			showHour : false,
			data :[],
		}
	}

	get format(){
		return this.props.format;
	}

	get period(){
		return (this.props.local || NOW).add(this.props.period, 'seconds');
	}

	get range(){
		if(typeof this.props.range != 'object' && this.props.range.length == 1)
			return [NOW].concat(moment(this.props.range));
		else if(typeof this.props.range == 'object' && this.props.range.length == 2)
			return [moment(this.props.range[0]), moment(this.props.range[1])]
		else return this.props.range;
	}

	getStart(date) {
		let origin = date.format(this.format);
    	return moment(origin + ' ' + this.props.start, this.format + ' HH:mm');
  	}

  	getEnd(date) {
		let origin = date.format(this.format);
    	return moment(origin + ' ' + this.props.end, this.format + ' HH:mm');
  	}

  	getNoon(){
  		let noon = moment(_start.clone().format(this.format + ' 11:59'));
  	}

  	rangeTime(date){
  		let vaild = [];
  		let _start = this.getStart(date);
  		let _end  = this.getEnd(date);
  		let _step = this.props.step;
  		let real = _end.diff(_start, 'seconds');
  		let step = real / _step;
  		for(let i = 0 ; i <= step; i++){
  			let _time = _start.clone().add(_step * i, 'seconds');
  			vaild.push(_time);
  		}
  		return vaild;
  	}

	setRefresh(){
		this.setState({
			isRefresh : !this.state.isRefresh
		})
	}

	disabledDate(start, end){
		let _before = start && start.isBefore(this.range[0]);
		let _after = start && start.isAfter(this.range[1]);
	    return _after || _before;
	}

	handleDate(date){
		// debugger
		this.setState({
			showHour : true,
			data : this.rangeTime(date)
		});
	}

	handle(date){
		
		this.props.onHandle && this.props.onHandle.call(this, date);
	}

	render(){
		return (
			<div className='ui-hour-picker'>
				<UIDatePicker 
				onHandle={this.handleDate.bind(this)}
				disabledDate={this.disabledDate.bind(this)}
				option={{placeholder : '选择日期', showToday : false}}
				/>
				<span className="hour-picker-split">-</span>
				<UIHour
				data={this.state.data}
				show={this.state.showHour}
				now={this.period}
				placeholder='选择时间'
				onHandle={this.handle.bind(this)}
				/>
			</div>
			)
	}
	
}

export default UIHourPicker;
import React , {Component, PropTypes} from 'react';
import {DatePicker} from 'local-Antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');


import './sass/index.scss';

const RangePicker = DatePicker.RangePicker;
const NOW = moment();


class UIDatePicker extends Component{
	static propTypes = {
	    placeholder : PropTypes.array,
	    container : PropTypes.object,
	    onHandle : PropTypes.func,
	    format : PropTypes.string,
	    open : PropTypes.bool,
	    step : PropTypes.number,
	    disabledDate : PropTypes.number,
			disabledNext6Month : PropTypes.boolean
	}
	constructor(props,context){
		super(props,context);
		this.state = this.defaultState;
	}
	componentWillReceiveProps(nextProps) {
		if(nextProps.reset != this.props.reset) {
			let initData = [null, null];
			if(nextProps.defaultValue) {
				initData = this.setDefaultValue(nextProps.defaultValue, this.state.format);
			}
			this.setState({
				setValue: {value: initData},
			})
		}
		this.setState({
			open : nextProps.open
		})
	}
	get defaultState(){
		const {format, placeholder, open, defaultValue, container, step, disabledDate,disabledNext6Month} = this.props;
		let states = {
			format : format || 'YYYY-MM-DD',
			placeholder : placeholder,
			open : open,
			defaultValue : defaultValue,
			setValue: {},
			container : container,
			step : step,
			disabledDate : disabledDate,
			disabledNext6Month : disabledNext6Month
		};
		Object.assign(states, {
			defaultValue : this.setDefaultValue(states.defaultValue, states.format),
		});
		return states;
 	}

 	get container(){
 		return this.state.container;
 	}

 	get defaultValue(){
 		return this.state.defaultValue
 	}

 	get placeholder(){
 		return this.state.placeholder;
 	}

 	get open(){
 		return this.state.open;
 	}

 	get foramt(){
 		return this.state.format;
 	}

 	get step(){
 		return this.state.step;
 	}

 	get disabledDates(){
 		return this.state.disabledDate;
 	}
	get disabledNext6Month(){
		return this.state.disabledNext6Month;
	}
 	setDefaultValue (val, format){
		if(typeof val == 'boolean' && val == true) return [moment(NOW, format), moment(NOW.add(1,'days'), format)];
		if(typeof val == 'object' && val.length > 0) return [moment(val[0], format), moment(val[1] || val[0], format)];
		return [];
	}

 	setContainer(t){
 		return this.container || t.parentNode;
 	}

	onChangeDate(dates, dataStrings){
		if(this.step && dates[1].diff(dates[0], 'days') < this.step){
			alert(`入住日期距离店日期不能少于${this.step}天`);
			this.setState({
				setValue: {value: [null, null]}
			})
		}
  		this.props.onHandle && this.props.onHandle.call(this, dates, dataStrings);
	}

  	disabledDate(start, end){
  		if(this.disabledDates == undefined) return null;
			if(this.disabledNext6Month)return this.disabledNext6MonthHan.call(this,start,end);
	    return start && start.valueOf() <  moment().subtract(this.disabledDates,'day').valueOf();
  	}
	disabledNext6MonthHan(start,end){
		let now = moment().add(1,'days');
		let month6 = moment(now).add(180,'days')
		let _before = start && start.isBefore(now,'day');
		let _after = start && start.isAfter(month6,'day');
	  // return _after || _before;
	  return start && start.valueOf() <  moment().subtract(this.disabledDates,'day').valueOf() ||
		start && start.valueOf() >  moment().add(180,'day').valueOf();
	}

  	toggleOpen(open) {
  		// debugger
		this.clearValue(arguments[0]);
		// this.setState({
		// 	open
		// })
  	}
  	clearValue(flag){
  		if(flag) {
  			// 覆盖
  			this.setState({
				setValue: {}
			})
  		}
  	}

  render(){
  	// debugger
    return (
    	<RangePicker
    		{...this.state.setValue}
    	  	getCalendarContainer={this.setContainer.bind(this)}
	        format={this.format}
	        allowClear={false}
	        onChange={this.onChangeDate.bind(this)}
	        placeholder={this.placeholder}
	        defaultValue={this.defaultValue}
	        disabledDate={this.disabledDate.bind(this)}
	        onOpenChange={this.toggleOpen.bind(this)}
					// open={this.state.open}
        />

      )
    }
}

export default UIDatePicker;

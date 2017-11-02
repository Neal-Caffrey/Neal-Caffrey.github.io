import React , {Component, PropTypes} from 'react';
import {DatePicker} from 'local-Antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
import './sass/index.scss';
const NOW = moment();


class UIDatePickerSingle extends Component{
	static propTypes = {
	    defaultValue : PropTypes.string,
	    placeholder : PropTypes.string,
	    container : PropTypes.object,
	    disabledDate : PropTypes.object,
	    onHandle : PropTypes.func,
	    format : PropTypes.string,
	}
	constructor(props,context){
		super(props,context);
		this.state = {
			setValue: {}
		};
		this._attr = this.attr;
	}
	componentWillReceiveProps(nextProps) {
		if(nextProps.reset != this.props.reset) {
			this.setState({
				setValue: {value: null}
			})
		}
	}

	get reset(){
		return this.props.reset;
 	}

	get attr(){
		let attr = {
			format : this.format,
			placeholder : this.placeholder,
			defaultValue : this.defaultValue
		};
		return attr;
 	}

 	get container(){
 		return this.props.container;
 	}

 	get defaultValue(){
 		return this.props.defaultValue
 	}

 	get placeholder(){
 		return this.props.placeholder || "";
 	}

 	get format(){
 		return this.props.format || 'YYYY-MM-DD';
 	}
 	setDefaultValue (val, format){
		if(typeof val == 'boolean' && val == true) return {value : moment(NOW, format)};
		if(typeof val == 'string' && val !='') return {value: moment(val, format)};
		return false;
	}

 	setContainer(t){
 		return this.container || t.parentNode;
 	}

	onChangeDate(dates, dataStrings){
		this.props.onHandle && this.props.onHandle.call(this, dates, dataStrings);
	}

  	// disabledDate(start, end){
	  //   return start && start.valueOf() <  moment().subtract(1,'day').valueOf();
  	// }

  	disabledDate(start, end){
  		let option = this.props.disabledDate;
  		if(!option)  {
	    	return start && start.valueOf() <  moment().subtract(1,'day').valueOf();
  		}
  		if(option.type == "after") {
			return start && start.valueOf() <  moment().subtract(-option.day || -1,'day').valueOf();
  		} else if (option.type == "before"){
			return start && start.valueOf() >  moment().subtract(option.day || 1,'day').valueOf();
  		} else if (option.type == "since"){
  			return start && start.valueOf() <=  moment().subtract(-(option.day - 1) || -0,'day').valueOf();
  		}
    	return start && start.valueOf() <  moment().subtract(1,'day').valueOf();

  	}


  	toggleOpen() {
		this.clearValue(arguments[0]);
  	}
  	clearValue(flag){
  		if(flag) {
  			// 清理，等待选择
  			this.setState({
				setValue: {}
			})
  		}
  	}

  render(){
    return (
    	<DatePicker
    		{...this._attr}
    		{...this.state.setValue}
    		getCalendarContainer={this.setContainer.bind(this)}
	        allowClear={false}
	        onChange={this.onChangeDate.bind(this)}
	        disabledDate={this.disabledDate.bind(this)}
	        onOpenChange={this.toggleOpen.bind(this)}
	        />

      )
    }
}

export default UIDatePickerSingle;

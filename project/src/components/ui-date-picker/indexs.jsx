import React , {Component, PropTypes} from 'react';
import {DatePicker} from 'local-Antd';
import moment from 'moment';

import 'moment/locale/zh-cn';

moment.locale('zh-cn');

import './sass/index.scss';
const NOW = moment();


class UIDatePickerSingle extends Component{
	static propTypes = {
	    onHandle : PropTypes.func,
	    disabledDate : PropTypes.func || PropTypes.object,
	    reSet : PropTypes.bool
	}

	static defaultProps = {
		option : {
			format : 'YYYY-MM-DD',
			defaultValue : NOW,
	    	placeholder : '请选择时间',
	    	showToday : false,
	    	container : ''
		},
	};

	constructor(props,context){
		super(props,context);
		this.state = this.defaultState;
	}

	get defaultState (){
		return {
			value : null,
		}
	}

	componentWillReceiveProps(nextProps){
		if(nextProps.value && this.props.value != nextProps.value){
			this.setState({
				value : nextProps.value
			})
		}
	}


 	setContainer(t){
 		return this.props.option.container || t.parentNode;
 	}

	onChangeDate(dates, dataStrings){
		this.setState({
			value : dates
		});
		this.props.onHandle && this.props.onHandle.call(this, dates, dataStrings);
	}

  	disabledDate(start, end){
	    let _type = typeof this.props.disabledDate;
  		if(_type == 'function') return this.props.disabledDate.call(this, start, end);
	    else if(_type == 'object') return start && start.valueOf() <  moment().subtract(this.disabledDate,'day').valueOf();
    	else return null;
  	}
  	toggleOpen(isOpen) {
  		if(isOpen){
  			this.setState({
  				value : this.props.onOpen ? this.props.onOpen.call(this, isOpen) : null
  			});
  		}
  	}


  	render(){
	    return (
	    	<DatePicker
	    		{...this.props.option}
	    		value={this.state.value}
	    		getCalendarContainer={this.setContainer.bind(this)}
		        allowClear={false}
		        format='YYYY-MM-DD ddd'
		        onChange={this.onChangeDate.bind(this)}
		        disabledDate={this.disabledDate.bind(this)}
		        onOpenChange={this.toggleOpen.bind(this)}
		        />
	    	
	      )
	    }
}

export default UIDatePickerSingle;
  		
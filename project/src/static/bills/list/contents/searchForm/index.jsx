import React , {Component, PropTypes} from 'react';
import { connect } from 'react-redux';

import DatePickerGroup from 'components/ui-date-picker/index.jsx';
import { updateDate, updateCurrent} from 'ACTIONS/listAction.js';
import searchCss from './sass/index.scss';
export default class OrderSearch extends Component{
  constructor(props,context){
    super(props,context);
    this._formData = {};
    this.state = this.defaultState;

  }
  get defaultState(){
    return {
      searching: false
    }
  }
  _confirmHandle(searchFlag){
    this.setState({
      searching: true,
    }, ()=> {
      (this._formData.createTimeStart ==undefined || this._formData.createTimeStart =="") && (delete this._formData.createTimeStart);
      (this._formData.createTimeEnd ==undefined || this._formData.createTimeEnd=="") && (delete this._formData.createTimeEnd);
      console.log(this._formData);debugger
      this.props.changeHandle && this.props.changeHandle('form', this._formData, searchFlag);
    })

  }
   _cbSelectDate(dates, dataStrings) {
    console.log(dates);debugger
    // console.log(detaStrings);debugger
    this._formData.createTimeStart= dataStrings[0];
    this._formData.createTimeEnd =dataStrings[1];
  }
  render(){
    return (
      <div className='ui-hotel-search'>
	        <span className="bills-time">账单生成时间</span>
	        <DatePickerGroup 
	        placeholder={['开始时间', '结束时间']} 
	        onHandle={this._cbSelectDate.bind(this)}
	        />
	        <span className='button-search'>
	          <button 
	          type='submit' 
	          className='btn-default'
	          onClick={this._confirmHandle.bind(this, true)} loading={this.state.searching && this.props.loading}>搜索</button>
	        </span>
      </div>
    )
  }
};


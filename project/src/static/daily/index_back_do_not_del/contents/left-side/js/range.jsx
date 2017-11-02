import React , {Component} from 'react';
import { connect } from 'react-redux';

import {DatePicker} from 'local-Antd';
import moment from 'moment';
moment.locale('zh-cn');
const RangePicker = DatePicker.RangePicker;
const dateFormat = 'YYYY-MM-DD';
const monthFormat = 'YYYY/MM';
const NOW = moment();


class DailyPicker extends Component{
  constructor(props,context){
    super(props,context);
    this.state = {
      open : false
    }
  }
  bindEvent(){
    return {
      onChangeTime : (dates,dataStrings)=>{
        this.props.onChangeTime && this.props.onChangeTime(dates,dataStrings);
      }
    }
  }
  render(){
    return (
      <div className='input-contain'>
        <label htmlFor="J-SearchCity">行程起止日期</label>
        <RangePicker
          defaultValue={this._getRangeVal()}
          format={dateFormat}
          allowClear={false}
          onChange={this.bindEvent().onChangeTime}
          onOpenChange={this.bindEvent().onOpenChangeTime}
          open={this.props.openTime}
          />
      </div>
    )
  }
  _getRangeVal(){
    //[isEmptyObject(props.leftSide.startTime) && moment(NOW, dateFormat), isEmptyObject(props.leftSide.endTime) && moment(NOW.add(1,'days'), dateFormat)]
    const { props: { startTime,endTime } } = this;
    if(!startTime || !endTime){
      return [
        NOW,
        moment(NOW).add(1,'days')
      ]
    }
    return [startTime,endTime];

  }
}
function mapStateToProps(state) {
  const { leftSide } = state;
  const {startTime,endTime,startCity,openTime} = leftSide;
  return {
    startTime,
    endTime,
    openTime,
    startCity
  }
}

export default connect(mapStateToProps)(DailyPicker)

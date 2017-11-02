import React , {Component} from 'react';
import {Form,Input,Icon,DatePicker} from 'local-Antd';
import { connect } from 'react-redux';
import {updateStartCity,updateTime,initailPlanList,updateCurrentDayIndex} from 'ACTIONS/leftSideAction.js';
import PlanList from 'components/plan-list/index.jsx';
import moment from 'moment';
import 'moment/locale/zh-cn';
import './sass/index.scss';
import SearchCity from '../w-city/index.jsx';
import {isEmptyObject,initailArrayByLenAndObj,modifyPlanListLen} from 'components/util/index.jsx'
moment.locale('zh-cn');
const RangePicker = DatePicker.RangePicker;
const dateFormat = 'YYYY-MM-DD';
const monthFormat = 'YYYY/MM';
const NOW = moment();
const defaultTimeValue = [moment(NOW, dateFormat), moment(NOW.add(1,'days'), dateFormat)];
class LeftSide extends Component{

  constructor(props,context){
    super(props,context);
    this.state = {
      openTime : false,
    }
    this._state = {
      hasSelectTime : false,
      hasSelectCity : false
    }
  }
  componentDidUpdate(nextProps){
    //初始化时间
    //this.props.dispatch(updateTime(defaultTimeValue[0],defaultTimeValue[1]));
    this.checkIsDone();
  }
  onSelectCity(object){
    this._state.hasSelectCity = true;
    this.checkToResetPlanList(object);
    this.props.dispatch(updateStartCity(object));
    if(isEmptyObject(this.props.leftSide.startTime) && isEmptyObject(this.props.leftSide.endTime)){
      this.setState({
        openTime : true
      })
    }
    this.checkIsDone();

  }
  onChangeTime(dates,dataStrings){
    this._state.hasSelectTime = true;
    this.setState({
      openTime : false
    })
    this.checkToResetPlanList(null,dates[0],dates[1]);
    this.checkIsDone();
  }
  onOpenChangeTime(status){

  }
  checkIsDone(){
    if(this._state.hasSelectTime &&
      this._state.hasSelectCity &&
      !isEmptyObject(this.props.leftSide.startTime) &&
      !isEmptyObject(this.props.leftSide.endTime) &&
      this.props.leftSide.planList.length == 0
    ){
      //生成默认数组
      this._initalPlanList();
      return;
    }
  }
  _initalPlanList(stc=this.props.leftSide.startCity,stt=this.props.leftSide.startTime,edt=this.props.leftSide.endTime){
    if(isEmptyObject(stt) || isEmptyObject(edt)){
      return;
    }
    const startCity = Object.assign({},stc);
    const startTime = moment(stt.format(dateFormat),dateFormat);
    const endTime = moment(edt.format(dateFormat),dateFormat);
    const arrayLen = endTime.diff(startTime,'days')+1;
    const defaultObject = {
      date : startTime,//日期
      distanceDesc : '',//
      isComplete : false,
      isLast : false,
      startCity : startCity,
      dailyVo : {
        startCity : startCity,
        // endCity : startCity,
        time : '09:00',
        isHalfDay : false,
        type : 0
      },//每天的行程
      type : 0 // 0 : 按天包车，1：半日包车，2：仅接送机，3：本日无包车
    }
    this.props.dispatch(initailPlanList(initailArrayByLenAndObj(arrayLen,defaultObject)));
    this.props.dispatch(updateTime(stt,edt));
  }
  checkToResetPlanList(startCity,startTime,endTime){
    //默认情况，startTime ,endTime为空对象
    if(isEmptyObject(this.props.leftSide.startTime)){
      this.props.dispatch(updateTime(startTime,endTime));
      return;
    }
    //开始城市有变化
    if(startCity && startCity.cityId != this.props.leftSide.startCity.cityId){
      this._initalPlanList(startCity);
      this.props.dispatch(updateCurrentDayIndex(0))
      return;
    }
    //开始时间有变化
    if(startTime && startTime.format(dateFormat) != this.props.leftSide.startTime.format(dateFormat)){
      this._initalPlanList(this.props.leftSide.startCity,startTime,endTime);
      this.props.dispatch(updateCurrentDayIndex(0))
      return;
    }else{
      //开始时间没有变化，那么根据结束时间添加或者删除数组元素
      const arrayLen = endTime.diff(startTime,'days')+1;
      if(arrayLen - this.props.leftSide.planList.length < 0){
        //缩小数组长度
        this.props.dispatch(updateCurrentDayIndex(arrayLen-1));
      }
      this.props.dispatch(initailPlanList(modifyPlanListLen(this.props.leftSide.planList,arrayLen)));
    }

  }
  render(){
    return (
      <div className="ui-left-side">
        <div className='form-origin'>

          <SearchCity
            hotXHRUrl='http://api6-test.huangbaoche.com/basicdata/v1.0/cla/hottest/cities'
            initialUrl='http://api6-test.huangbaoche.com/price/v1.0/cla/cities/byinitial'
            searchUrl='http://api6-test.huangbaoche.com/price/v1.2/cla/serviceCities'
            onSelectCity={this.onSelectCity.bind(this)}
            />
            <div className='input-contain'>
              <label htmlFor="J-SearchCity">行程起止日期</label>
              <RangePicker
                defaultValue={defaultTimeValue}
                format={dateFormat}
                allowClear={false}
                onChange={this.onChangeTime.bind(this)}
                onOpenChange={this.onOpenChangeTime.bind(this)}
                open={this.state.openTime}
                />
            </div>
            <div className='split-line' style={{marginTop : '20px'}}></div>
          </div>
          <PlanList/>
        </div>
      )
    }
  }

  function mapStateToProps(state) {
    const { leftSide } = state;
    return {
      leftSide
    }
  }

  export default connect(mapStateToProps)(LeftSide)

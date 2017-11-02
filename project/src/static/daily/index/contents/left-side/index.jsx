//react redux
import React , {Component} from 'react';
import { connect } from 'react-redux';
import {updateStartCity,updateTime,initailPlanList,updateCurrentDayIndex} from '../../action/leftSideAction.js';
import {updateDailyVo,resetPickupAndDropOff,updatePickupModelKey} from '../../action/dailyAction.js';
//andtd
import {Form,Input,Icon} from 'local-Antd';
import DatePickerGroup from 'components/ui-date-picker/index_daily.jsx';
//组件
import PlanList from '../plan-list/index.jsx';
import CarList  from '../carList/index.jsx';
import moment from 'moment';
import 'moment/locale/zh-cn';
import SearchCity from '../w-city/index.jsx';
import {isEmptyObject,initailArrayByLenAndObj,modifyPlanListLen} from 'components/util/index.jsx';
import ApiConfig from 'widgets/apiConfig/index.js';
moment.locale('zh-cn');
// const RangePicker = DatePicker.RangePicker;
//css
import './sass/index.scss';
//常量，变量
const dateFormat = 'YYYY-MM-DD';
const monthFormat = 'YYYY/MM';
const NOW = moment();
// const defaultTimeValue = [moment(NOW, dateFormat), moment(NOW.add(1,'days'), dateFormat)];

class LeftSide extends Component{
  constructor(props,context){
    super(props,context);
    this.cacheData()
    this.cacheState();

  }
  /**
   * 设置state
   * @method cacheState
   * @param  {object}   [props=this.props] [props]
   */
  cacheState(props=this.props){
    this.state = {
      openTime : false,
    }

  }
  /**
   * 保存数据，一般是从props拿的，方便willReciewProps重新初始化
   * @method cacheData
   * @param  {Object}  [props=this.props] props
   * @return {void}
   */
  cacheData(props=this.props){
    this.data = {
      hasSelectTime : false,
      hasSelectCity : false,
      defaultTimeValue : [isEmptyObject(props.leftSide.startTime) && NOW.format('YYYY-MM-DD'), isEmptyObject(props.leftSide.endTime) && moment(NOW.add(1,'days'), dateFormat).format('YYYY-MM-DD')]
    }
    // const defaultTimeValue =
  }
  // componentWillReceiveProps(nextProps) {
  //   this.cacheData(nextProps)
  //   console.log(nextProps)
  // }
  /**
   * 组件回调
   * @method bindEvent
   * @return {Object}  {
   *         onSelectCity : 城市选择
   *         onChangeTime : 时间改变
   *         onOpenChangeTime : 打开时间
   * }
   */
  bindEvent(){
    return {
      /**
       * [onSelectCity 选择城市]
       * @method onSelectCity
       */
      onSelectCity : (object)=>{
        console.log((this.props.leftSide))
        this.data.hasSelectCity = true;
        // if(isEmptyObject(this.props.leftSide.startTime) && isEmptyObject(this.props.leftSide.endTime)){
        //   this.setState({
        //     openTime : true
        //   })
        // }
        this.props.dispatch(updateDailyVo({
          startCity : object,
          // endCity : startCity,
          time : '09:00',
          isHalfDay : false,
          type : -1
        }));

        if(!this._startTime && !this._endTime){
          this.setState({
            openTime : true
          });
          this.props.dispatch(updateStartCity(object));
        }else{
          this.checkToResetPlanList(object,this._startTime,this._endTime);
          this.checkIsDone();
        }

      },
      /**
       * [onChangeTime 时间改变的回调]
       * @method onChangeTime
       */
      onChangeTime : (dates,dataStrings)=>{
        this.data.hasSelectTime = true;
        console.log(dates[0].format('YYYY-MM-DD'))
        console.log(dates[1].format('YYYY-MM-DD'))
        this._startTime = dates[0];
        this._endTime = dates[1];
        this.checkToResetPlanList(null,dates[0],dates[1]);
        this.checkIsDone();
        this.setState({
          openTime : false
        })
      },
      onOpenChangeTime :(status)=>{

      }
    }
  }
  componentDidUpdate(nextProps){
    //初始化时间
    //this.props.dispatch(updateTime(defaultTimeValue[0],defaultTimeValue[1]));
    this.checkIsDone();
  }
  /**
   * 判断是否可以初始化数组
   * @method checkIsDone
   * @return {VOid}
   */
  checkIsDone(){
    if(this.data.hasSelectTime &&
      this.data.hasSelectCity &&
      !isEmptyObject(this.props.leftSide.startTime) &&
      !isEmptyObject(this.props.leftSide.endTime) &&
      this.props.leftSide.planList.length == 0
    ){
      //生成默认数组
      this._initalPlanList();
      return;
    }
  }
  /**
   * [_initalPlanList 生成默认行程数组]
   * @method _initalPlanList
   * @param  {[Object]}        [stc=this.props.leftSide.startCity] [开始城市]
   * @param  {[Object]}        [stt=this.props.leftSide.startTime] [开始时间]
   * @param  {[Object]}        [edt=this.props.leftSide.endTime]   [结束时间]
   * @return {[void]}
   */
  _initalPlanList(stc=this.props.leftSide.startCity,stt=this.props.leftSide.startTime,edt=this.props.leftSide.endTime){
    if(isEmptyObject(stt) || isEmptyObject(edt)){
      return;
    }
    const startCity = Object.assign({},stc);
    const startTime = moment(stt);
    const endTime = moment(edt);
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
        type : -1
      },//每天的行程
      type : 0 // 0 : 按天包车，1：半日包车，2：仅接送机，3：本日无包车
    }
    this.props.dispatch(initailPlanList(initailArrayByLenAndObj(arrayLen,defaultObject)));
    this.props.dispatch(updateTime(stt,edt));
    this.props.dispatch(updateCurrentDayIndex(0,defaultObject));
    this.props.dispatch(updateDailyVo(defaultObject['dailyVo']));
    return defaultObject;
  }
  /**
   * 判断是否要重置数组，
   *  开始时间变化true - 直接重置
   *    false - 结束时间变化true
   *      根据结束时间添加或减少数组数量
   *      false - 无变化
   *  城市变化true - 直接重置
   *    flase - 无变化
   * @method checkToResetPlanList
   * @param  {[type]}             startCity [description]
   * @param  {[type]}             startTime [description]
   * @param  {[type]}             endTime   [description]
   */
  checkToResetPlanList(startCity,startTime,endTime){
    //默认情况，startTime ,endTime为空对象
    // debugger;
    if(isEmptyObject(this.props.leftSide.startTime)){
      this.props.dispatch(updateTime(moment(startTime),moment(endTime)));
      // this.props.dispatch(updateTime({},{}));
      return;
    }
    //开始城市有变化
    if(startCity && startCity.cityId != this.props.leftSide.startCity.cityId){
      let defaultVal = this._initalPlanList(startCity,startTime,endTime);
      this.props.dispatch(updateStartCity(startCity));
      this.props.dispatch(updateCurrentDayIndex(0,defaultVal));
      this.props.dispatch(resetPickupAndDropOff());
      this.props.dispatch(updatePickupModelKey());
      return;
    }
    //开始时间有变化
    if(startTime && startTime.format(dateFormat) != this.props.leftSide.startTime.format(dateFormat)){
      // debugger;
      let defaultVal =this._initalPlanList(this.props.leftSide.startCity,startTime,endTime);
      this.props.dispatch(updateCurrentDayIndex(0,defaultVal))
      return;
    }else{
      //开始时间没有变化，那么根据结束时间添加或者删除数组元素
      const arrayLen = endTime.diff(startTime,'days')+1;
      if(arrayLen - this.props.leftSide.planList.length < 0){
        //缩小数组长度
        //@TODO 要判断当前胡Index
        let nextLength = arrayLen -1;
        let currentDayIndex = this.props.leftSide.currentDayIndex;
        if(currentDayIndex > nextLength){
          let lastObj = this.props.leftSide.planList[nextLength];
            this.props.dispatch(updateCurrentDayIndex(arrayLen-1,lastObj));
        }else{
          //do nothing

        }
      }
      this.props.dispatch(updateTime(startTime,endTime));
      this.props.dispatch(initailPlanList(modifyPlanListLen(this.props.leftSide.planList,arrayLen)));
    }

  }
  render(){
    return (
      <div className="ui-left-side">
        <div className='form-origin'>
          <SearchCity
            hotXHRUrl={ApiConfig.hottestCity}
            initialUrl={ApiConfig.byinitial}
            routerUrl={ApiConfig.queryCityRoute}
            searchUrl={ApiConfig.searchDailyStartCitys}
            onSelectCity={this.bindEvent().onSelectCity}
            />
            <div className='input-contain'>
              <label htmlFor="J-SearchCity">行程起止日期</label>
              <DatePickerGroup
                value={[this.props.leftSide.startTime || this.data.defaultTimeValue[0] ,this.props.leftSide.endTime || this.data.defaultTimeValue[1]]}
                placeholder={['开始日期', '结束日期']} reset={this.state.checkDate} onHandle={this.bindEvent().onChangeTime}
                disabledDate={1}
                disabledNext6Month={true}
                defaultValue={this.data.defaultTimeValue}
                format={dateFormat}
                allowClear={false}
                onChange={this.bindEvent().onChangeTime}
                onOpenChange={this.bindEvent().onOpenChangeTime}
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
    const {startTime,endTime} = leftSide;
    return {
      leftSide
    }
  }

  export default connect(mapStateToProps)(LeftSide)

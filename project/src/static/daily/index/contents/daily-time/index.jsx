import React , {Component} from 'react';
import {connect} from 'react-redux';
//组件
import update from 'react-addons-update';
import TimePicker from 'components/ui-time-picker/index.jsx';

class DailyTimeInner extends Component {
  /*
    currentDayIndex
    pickupVo
    dropoffVo
    onCloseTime
    onSelectFlight
   */
  constructor(props,context){
    super(props,context);
  }
  bindEvent(){
    return {
      getStartTime : (time)=>{
        this.props.onCloseTime && this.props.onCloseTime(time)
      },
      onClickShowFlight : ()=>{
        this.props.onClickShowFlight && this.props.onClickShowFlight();
      },
      onClickShowDropoff : ()=>{
        this.props.onClickShowDropoff && this.props.onClickShowDropoff();
      },
      onClickDelFlight : ()=>{
        this.props.onClickDelFlight && this.props.onClickDelFlight();
      },
      onClickDelDropoffFlight : ()=>{
        this.props.onClickDelDropoffFlight && this.props.onClickDelDropoffFlight();
      }
    }
  }
  renderDropoffInfo(){
    let dropoffVo = this.props.dailyDropoffVo;
    if(!dropoffVo || !dropoffVo.flightVo){
      return null;
    }
    let {date,placeVo,flightVo,type,time} = dropoffVo;
    type = (()=>{
      //判断type是航班号还是机场~~fuck
      //如果是航班号，flightVo.arrCityId 存在，否则 flightVo.cityId
      const {arrCityId,cityId} = flightVo;
      return arrCityId ? 0 : 1;
    })()
    if(type === 0){
      return (<p className="pickup-info">
        <span>{flightVo.flightNo}</span>
        预计
        <span>{flightVo.arrTime}</span>
        ,从
        <span className="pickup-airport">{flightVo.arrAirport}</span>
        出发
        <span className="pickup-op" onClick={this.bindEvent().onClickShowDropoff}>编辑</span>
        <span className="pickup-op" onClick={this.bindEvent().onClickDelDropoffFlight}>删除</span>
      </p>);
    }else{
      const timeDom = !this.props.isShowLastTime ? null : <span>{time}</span>;
      return (<p className="pickup-info">
        {timeDom}
        送到
        <span className="pickup-airport">{flightVo.airportName || flightVo.arrAirport}</span>

        <span className="pickup-op" onClick={this.bindEvent().onClickShowDropoff}>编辑</span>
        <span className="pickup-op" onClick={this.bindEvent().onClickDelDropoffFlight}>删除</span>
      </p>);
    }
  }
  renderPickupInfo(){
    let pickupVo = this.props.dailyPickupVo;
    if(!pickupVo || !pickupVo.flightVo){
      return null;
    }
    let {date,placeVo,flightVo,type,time} = pickupVo;
    type = (()=>{
      //判断type是航班号还是机场~~fuck
      //如果是航班号，flightVo.arrCityId 存在，否则 flightVo.cityId
      const {arrCityId,cityId} = flightVo;
      return arrCityId ? 0 : 1;
    })()
    if(type === 0){
      return (<p className="pickup-info">
        <span>{flightVo.flightNo}</span>
        预计
        <span>{flightVo.arrTime}抵达</span>
        ,从
        <span className="pickup-airport">{flightVo.arrAirport}</span>
        出发
        <span className="pickup-op" onClick={this.bindEvent().onClickShowFlight}>编辑</span>
        <span className="pickup-op" onClick={this.bindEvent().onClickDelFlight}>删除</span>
      </p>);
    }else{
      return (<p className="pickup-info">
        <span>{time}</span>
        从
        <span className="pickup-airport">{flightVo.airportName || flightVo.arrAirport}</span>
        出发
        <span className="pickup-op" onClick={this.bindEvent().onClickShowFlight}>编辑</span>
        <span className="pickup-op" onClick={this.bindEvent().onClickDelFlight}>删除</span>
      </p>);
    }


  }
  renderTimePicker(){
    if(this.props.isLast === true && this.props.isShowLastTime === false)return null;
    return (
      <TimePicker
        defaultTime={this.props.time}
        onCloseTime={this.bindEvent().getStartTime}
        styleWidth="137px"/>
    )
  }
  render(){
    if(!this.props.isShowTime)return null;
    return (
      <div className='daily-time flex-box'>
        <lable htmlFor='daily-time'>出发时间</lable>
        {

          this.renderPickupInfo() || this.renderDropoffInfo() ||
          this.renderTimePicker()
        }
        <lable className='flex1-box'>
          {
            ((currentDayIndex)=>{
              const ifShowDropAdd = false;

              if(currentDayIndex === 0 && !this.props.dailyPickupVo){
                //@TODO : 添加接机信息
               return  <p className="daily-to-pickup">如需接机服务，请<span onClick={this.bindEvent().onClickShowFlight}>添加接机信息</span></p>
              }else if(currentDayIndex > 0 && this.props.isLast && !this.props.dailyDropoffVo || (currentDayIndex > 0 && this.props.isLast && this.props.dailyDropoffVo && !this.props.dailyDropoffVo.flightVo)){
                return  <p className="daily-to-pickup">如需送机服务，请<span onClick={this.bindEvent().onClickShowDropoff}>添加送机信息</span></p>
              }else{
                return null;
              }
            })(this.props.currentDayIndex,this.props.dailyPickupVo)
          }
        </lable>
      </div>

    )
  }
}

function mapStateToProps(state) {
  const { leftSide,daily } = state;
  const {currentDayIndex,planList} = leftSide;
  let {date} = leftSide.currentObject;
  let {pickupVo,dropoffVo,time} = daily.dailyVo;
  let {dailyPickupVo,dailyDropoffVo} = daily;
  dailyPickupVo = pickupVo;
  dailyDropoffVo = dropoffVo;
  let isLast = currentDayIndex === planList.length -1;
  return {
    date,
    time,
    currentDayIndex,
    dailyPickupVo,
    dailyDropoffVo,
    isLast
  }
}

export default connect(mapStateToProps)(DailyTimeInner)

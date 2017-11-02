import React , {Component} from 'react';
import {connect} from 'react-redux';
import {Icon} from 'local-Antd';
import update from 'react-addons-update';
import TimePicker from 'components/ui-time-picker/index.jsx';
import SearchNearCity from 'components/w-nearCity/index.jsx';
import {isEmptyObject} from 'components/util/index.jsx';
import SearchCity from 'components/w-city/index.jsx';
// import FlightOrder from './flight.jsx';
import PlanMap from 'components/w-map/index.js';
import PickUpModel from '../w-pickup/index.jsx';
import MapMork from './mapmork.js';
class HalfOrder extends Component{
  constructor(props,context){
    super(props,context);
    this.cacheData();
    this.state = {
      // type : this.props.planVo.type || 1,
      // time : this.props.planVo.dailyVo.time || '09:00',
      // endCity : this.props.planVo.dailyVo.endCity || {},
      // canNext : this._getCanNext()
      // halfStartCity : this.props.planVo.dailyVo.startCity || {},
      // pickupVo : this.props.planVo.dailyVo.flightVo &&  this.props.planVo.dailyVo.flightVo.pickupVo,
      // dropoffVo :  this.props.planVo.dailyVo.flightVo &&  this.props.planVo.dailyVo.flightVo.dropoffVo
      isShowPickup : false,
    }

  }
  _checkIsShowFlightDetail(tag){
    return this.data.isComplete && this.data[tag];
  }
  cacheData(props=this.props){
    let dailyVo = props.planVo.dailyVo;
    this.data = {
      isComplete : dailyVo.isComplete,
      time : dailyVo.time,
      startCity : dailyVo.startCity,
      endCity : dailyVo.endCity || dailyVo.endCity,
      pickupVo : dailyVo.flightVo && dailyVo.flightVo.pickupVo,
      dropoffVo : dailyVo.flightVo && dailyVo.flightVo.dropoffVo,
      currentDayIndex : props.currentDayIndex
    }
  }
  componentWillReceiveProps(props){
    // this.setState({
    //   type : props.planVo.dailyVo.type,
    //   time : props.planVo.dailyVo.time,
    //   endCity : props.planVo.dailyVo.endCity || {}
    // })
  }
  getStartTime(time){
    this.data.time = time;

  }
  getDefaultPlanVo(planVo){
    let flightVo = {
      pickupVo : this.data.pickupVo || {},
      dropoffVo : this.data.dropoffVo || {}
    }
    return update(planVo,{
      dailyVo : {
        isHalfDay : {
          $set : true
        },
        flightVo : {
          $set : flightVo
        }
      }
    })
  }
  getCurrentVo(){
    let flightVo  = Object.assign({},{
      pickupVo : this.data.pickupVo,
      dropoffVo : this.data.dropoffVo
    })
    let obj = update(this.props.planVo,{
      isComplete : {
        $set : true
      },
      isLast : {
        $set : this.props.isLast
      },
      type : {
        $set : 1
      },
      dailyVo :{
        time : {
          $set : this.data.time
        },
        isHalfDay : {
          $set : true
        },
        startCity : {
          $set : this.data.startCity
        },
        flightVo : {
          $set : flightVo
        },
        endCity : {
          $set : this.data.endCity
        }
      }
    });
    this.props.onClickNextBtn && this.props.onClickNextBtn(obj);
  }
  onSelectStartCity(object){
    this.data.startCity = this.data.endCity = object;
  }
  selectPickupVo(object){
    this.data.pickupVo = object;
  }
  clickPickup(){
    this.setState({
      pickupState : true
    })
  }
  render(){
    return (
      <div className='daily-mian-wrap'>
        <div className='daily-time flex-box'>
          <lable htmlFor='daily-time'>出发时间</lable>
          <TimePicker
            styleWidth={'137px'}
            defaultTime={this.data.time}
            onCloseTime={this.getStartTime.bind(this)}/>
          <lable className='flex1-box'>
            {
              ((currentDayIndex)=>{
                if(currentDayIndex === 0){
                  //@TODO : 添加接机信息
                 return  <p className="daily-to-pickup">如需接机服务，请<span onClick={()=>this.setState({isShowPickup:true})}>添加接机信息</span></p>
                }else{
                  return null;
                }
              })(this.data.currentDayIndex)
            }
          </lable>
        </div>
        <div className='daily-type flex-box flex-top'>
          <lable htmlFor='daily-type'>包车行程</lable>
          <div className='daily-type-sel flex1-box' id="daily-type" style={{border:0}}>
            <p style={{fontSize : '12px',color : '#6E767D'}}>大阪市内半日游 5小时/150公里</p>
          </div>
          <div className="flex1-box">
            <div className='mid-btn-wrap' onClick={this.getCurrentVo.bind(this)}>
              <span>{this.props.isLast ? '完成选择' : '进入下一天'}</span>
              <Icon type="arrow-right" />
            </div>
          </div>
        </div>
        {
          /*
          <FlightOrder
            planVo={this.getDefaultPlanVo(this.props.planVo)}
            isLast={this.props.isLast}
            onhalfSelPickup={this.selectPickupVo.bind(this)}
            />
           */
        }
        <div className="ui-car-planMap">
            <PlanMap
              {
                ...MapMork
              }
              />
          </div>
          <PickUpModel
            planVo={this.props.planVo}
            visible={this.state.isShowPickup}
            onSelect={this.selectPickupVo.bind(this)}
            cancel={()=>this.setState({isShowPickup:false})}/>

      </div>
    )
  }
}

function mapStateToProps(state) {
  const { leftSide } = state;
  const {startCity,currentDayIndex} = leftSide;
  const planVo = leftSide.currentObject;
  return {
    startCity,
    planVo,
    currentDayIndex
  }
}

export default connect(mapStateToProps)(HalfOrder)

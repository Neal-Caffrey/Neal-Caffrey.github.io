import React , {Component} from 'react';
import {connect} from 'react-redux';
import {Icon} from 'local-Antd';
import {updateShowPickUp,updateShowDropOff,updatePickupInfo,updatePickupVo,updateInputVal,resetDaily,updateDailyVo,updatePickupModelKey} from '../../action/dailyAction.js';
import update from 'react-addons-update';
import {isEmptyObject} from 'components/util/index.jsx';
import PickUpModel from '../w-pickup/index.jsx';
import DropOffModal from '../w-dropoff/index.jsx';
import moment from 'moment';
class FlightOrder extends Component{
  constructor(props,context){
    super(props,context);
    // this.state = {
    //   pickupState : false,
    //   canNext : this.props.planVo.isComplete,
    //   pickupVo : this.initialObject('pickupVo'),
    //   dropoffVo : this.initialObject('dropoffVo')
    // }
    this.cacheData()


  }
  cacheData(props=this.props){
    if(props.planVo && props.planVo.isComplete && props.planVo.type === 3){
      this.data = {
        pickupVo : props.planVo.flightVo.pickupVo,
        dropoffVo : props.planVo.flightVo.dropoffVo
      }
    }else{
      this.data = {
        pickupVo : props.dailyVo.pickupVo,
        dropoffVo : props.dailyVo.dropoffVo
      }
    }
  }
  componentWillReceiveProps(nextProps){
    this.cacheData(nextProps);
  }
  initialObject(key,props){
    const nextProps = props ? props : this.props;
    if(!nextProps.planVo.dailyVo.isHalfDay){
      //正常的接送机
        return nextProps.planVo.flightVo ? nextProps.planVo.flightVo[key] : {}
    }else{
      //半日包中的接送机
      return nextProps.planVo.dailyVo.flightVo ? nextProps.planVo.dailyVo.flightVo[key] : {}
    }


  }
  clickPickup(){
    this.props.dispatch(updateShowPickUp(true));
  }
  clickDropOff(){
    this.props.dispatch(updateShowDropOff(true));
  }
  selectPickupVo(pickupObj){
    // this.setState({
    //   pickupState : false,
    //   canNext : true,
    //   pickupVo : pickupObj
    // });
    // this.props.onhalfSelPickup && this.props.onhalfSelPickup(Object.assign({},pickupObj));
    console.log(pickupObj);
    // this.data.pickupVo = pickupObj;
    this.data.pickupVo = pickupObj;
    console.log(this.props.dailyVo)
    let obj = update(this.props.dailyVo,{
          pickupVo : {
            $set : pickupObj
          }
    });
    this.props.dispatch(updateShowPickUp(false));
    this.props.dispatch(updateDailyVo(obj));

  }
  selectDropoff(dropoffObj){
    // this.setState({
    //   pickupState : false,
    //   canNext : true,
    //   pickupVo : pickupObj
    // });
    // this.props.onhalfSelPickup && this.props.onhalfSelPickup(Object.assign({},pickupObj));
    console.log(dropoffObj);
    // this.data.pickupVo = pickupObj;
    this.data.dropoffVo = dropoffObj;
    console.log(this.props.dailyVo)
    let obj = update(this.props.dailyVo,{
          dropoffVo : {
            $set : dropoffObj
          }
    });
    this.props.dispatch(updateShowDropOff(false));
    this.props.dispatch(updateDailyVo(obj));

  }
  getCurrentVo(){
    if(!this.props.canNext){
      return;
    }
    let obj = update(this.props.planVo,{
      isComplete : {
        $set : true
      },
      flightVo :{
        $set : {
          pickupVo : this.data.pickupVo,
          dropoffVo : this.data.dropoffVo
        }
      },
      dailyVo : {
        pickupVo:{
          $set :  this.data.pickupVo,
        },
        dropoffVo : {
          $set :  this.data.dropoffVo
        }
      },
      type : {
        $set : 3
      }

    });
    this.props.onClickNextBtn && this.props.onClickNextBtn(obj);
  }
  checkCanNext(){
    if(isEmptyObject(this.state.pickupVo) && isEmptyObject(this.state.dropoffVo)){
      this.setState({
        canNext : false
      });
      return false;
    }
    this.setState({
      canNext : true
    });
    return true
  }
  delFlight(){
    let obj = update(this.props.dailyVo,{
      pickupVo : {
        $set : null
      }
    });
    this.props.dispatch(updatePickupModelKey())
    this.props.dispatch(updateDailyVo(obj));
  }
  resetFlight(tag){
    // switch(tag){
    //   case 'pickup':
    //   this.setState({
    //     pickupVo : {},
    //     canNext : this.state.dropoffVo.date ? true : false
    //   })
    // }
  }
  renderPickupBtn(tag){
    let res = [];
    let isFirst = this.props.currentDayIndex === 0;
    let isLast = this.props.isLast;
    let pickupRes = null;
    let dropOffRes = null;
    const pickupBtn = (()=>{
      if(isFirst){
        return (
          <div className='flex1-box flight-btn-item'
            onClick={this.clickPickup.bind(this)}>添加接机</div>);
      }
      return (
        <div className='flex1-box flight-btn-item flight-btn-dis'>
          *最后一天无法选择接机服务
        </div>
      )
    })();
    const dropOffBtn = (()=>{
      if(isLast){
        return (
          <div className='flex1-box flight-btn-item'
            onClick={this.clickDropOff.bind(this)}>添加送机</div>);
      }
      return (
        <div className='flex1-box flight-btn-item flight-btn-dis'>
          *首日无法选择送机服务
        </div>
      )
    })();
    const pickupVo = (()=>{
      let {dailyVo,planVo} = this.props;
      let pickup = dailyVo && dailyVo.pickupVo;
      let planPickup = planVo.flightVo && planVo.flightVo.pickupVo;
       return pickup || planPickup;
    })();
    const dropoffVo = (()=>{
      let {dailyVo,planVo} = this.props;
      let dropoff = dailyVo && dailyVo.dropoffVo;
      let planDropoff = planVo.flightVo && planVo.flightVo.dropoffVo;
       return dropoff || planDropoff;
    })();
    if(pickupVo && pickupVo.date){
      pickupRes = (
        <div className='flight-res flex1-box flex-box flex-top' style={{marginRight : '20px'}}>
          {
           /*
           <Icon type="close" style={{position:'absolute',right : '10px',top : '10px',color:'#F49F1F'}} onClick={this.resetFlight.bind(this,'pickup')}/>

            */
          }

          <span className='flight-tag'>接机</span>
          <div className='flex1-box'>
            <p>
              <span>{moment(pickupVo.date).format('YYYY-MM-DD')} {pickupVo.time ? pickupVo.time : ''}</span>
              <span>预计里程：<i>14.6公里</i></span>
              <span className="flight-op" onClick={()=>this.props.dispatch(updateShowPickUp(true))}>编辑</span>
              <span className="flight-op" onClick={this.delFlight.bind(this)}>删除</span>
            </p>
            <p>出发：{pickupVo.placeVo.placeName}</p>
            <p>送达：{pickupVo.flightVo.arrAirport || pickupVo.flightVo.airportName}</p>
          </div>
        </div> );
    }
    if(dropoffVo && dropoffVo.date){
      dropOffRes = (
        <div className='flight-res flex1-box flex-box flex-top' style={{marginRight : '20px'}}>
          {
           /*
           <Icon type="close" style={{position:'absolute',right : '10px',top : '10px',color:'#F49F1F'}} onClick={this.resetFlight.bind(this,'pickup')}/>

            */
          }

          <span className='flight-tag'>送机</span>
          <div className='flex1-box'>
            <p>
              <span>{moment(dropoffVo.date).format('YYYY-MM-DD')} {dropoffVo.time ? dropoffVo.time : ''}</span>
              <span>预计里程：<i>14.6公里</i></span>
              <span className="flight-op" onClick={()=>this.props.dispatch(updateShowPickUp(true))}>编辑</span>
              <span className="flight-op" onClick={this.delFlight.bind(this)}>删除</span>
            </p>
            <p>出发：{dropoffVo.flightVo.arrAirport || dropoffVo.flightVo.airportName}</p>
            <p>送达：{dropoffVo.placeVo.placeName}</p>
          </div>
        </div> );
    }

    if(pickupRes || dropOffRes){
      //绝逼是首日接机
      res = [pickupRes || dropOffRes]
    }else{
      const { props: { currentDayIndex } } = this;
      currentDayIndex === 0 ? (res = [pickupBtn ,dropOffBtn]) : (res = [dropOffBtn,pickupBtn])
    }
    return res;

  }
  render(){
    return (
      <div className='flight-main-wrap'>
        <div className='flight-btn flex-box flex-top'>
          <lable style={{lineHeight:'34px'}}>接送机</lable>
          <div className='flex-box flex-top' style={{width : '587px'}} >
            {this.renderPickupBtn()}
          </div>
          <div className='flex1-box'></div>
        </div>
        <PickUpModel
          isDaily={false}
          onSelect={this.selectPickupVo.bind(this)}
          cancel={()=>this.props.dispatch(updateShowPickUp(false))}
          />
        <DropOffModal
          isDaily={false}
          onSelect={this.selectDropoff.bind(this)}
          cancel={()=>this.props.dispatch(updateShowDropOff(false))}
          />
          {
            (()=>{
              const btnClass = this.props.canNext ? 'mid-btn-wrap' : 'mid-btn-wrap disabled';
              const btnTitle = (this.props.isAllDone || this.props.isLast) ? '确认行程查价' : '进入下一天';
              return <div
                className={btnClass}
                onClick={this.getCurrentVo.bind(this)}>
                <span>{btnTitle}</span>
                <Icon type="arrow-right" />
              </div>
            })()
          }
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { leftSide,daily } = state;
  // const startCity = leftSide.startCity;
  // const planVo = leftSide.currentObject;
  // const currentDayIndex = leftSide.currentDayIndex;
  const {startCity,currentDayIndex,currentObject} = leftSide;
  const planVo = currentObject;
  const {isComplete,type} = planVo;
  const dailyVo = daily.dailyVo;
  // const canNext = dailyVo.pickupVo || dailyVo.dropoffVo || isComplete;
  const canNext = (()=>{
    //dailyVo 有 或者 type === 3 并且complete
    let isDailyComplete = dailyVo.pickupVo || dailyVo.dropoffVo;
    let isOnlyFlightComplete = isComplete && type === 3;
    return isDailyComplete || isOnlyFlightComplete;
  })()
  const isAllDone = (()=>{
    let res = true;
    leftSide.planList.forEach((val,index)=>{
      if(val.isComplete === false){
        res = false;
        return false;
      }
      res = res && val.isComplete;
    });
    return res;
  })() && canNext;
  return {
    isAllDone,
    canNext,
    startCity,
    planVo,
    currentDayIndex,
    dailyVo
  }
}

export default connect(mapStateToProps)(FlightOrder)

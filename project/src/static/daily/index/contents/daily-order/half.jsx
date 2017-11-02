import React , {Component} from 'react';
import {Icon} from 'local-Antd';
import update from 'react-addons-update';
import TimePicker from 'components/ui-time-picker/index.jsx';
import SearchNearCity from 'components/w-nearCity/index.jsx';
import {isEmptyObject} from 'components/util/index.jsx';
import SearchCity from 'components/w-city/index.jsx';
import FlightOrder from 'components/daily-order/flight.jsx';
export default class HalfOrder extends Component{
  constructor(props,context){
    super(props,context);
    this.state = {
      type : this.props.planVo.type || 1,
      time : this.props.planVo.dailyVo.time || '09:00',
      endCity : this.props.planVo.dailyVo.endCity || {},
      canNext : true,
      halfStartCity : this.props.planVo.dailyVo.startCity || {},
      pickupVo : this.props.planVo.dailyVo.flightVo &&  this.props.planVo.dailyVo.flightVo.pickupVo,
      dropoffVo :  this.props.planVo.dailyVo.flightVo &&  this.props.planVo.dailyVo.flightVo.dropoffVo
    }

  }
  componentWillReceiveProps(props){
    this.setState({
      type : props.planVo.dailyVo.type,
      time : props.planVo.dailyVo.time,
      endCity : props.planVo.dailyVo.endCity || {}
    })
  }
  getStartTime(time){
    this.setState({
      time : time
    })

  }
  getDefaultPlanVo(planVo){
    let flightVo = {
      pickupVo : this.state.pickupVo || {},
      dropoffVo : this.state.dropoffVo || {}
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
  clickType(index){
    if(index === this.state.type){
      return;
    }
    this.checkCanNext(index);
  }
  getCurrentVo(){
    if(!this.state.canNext){
      return;
    }
    let flightVo  = Object.assign({},{
      pickupVo : this.state.pickupVo,
      dropoffVo : this.state.dropoffVo
    })
    let obj = update(this.props.planVo,{
      isComplete : {
        $set : true
      },
      isLast : {
        $set : this.props.isLast
      },
      dailyVo :{
        type : {
          $set : this.state.type
        },
        time : {
          $set : this.state.time
        },
        isHalfDay : {
          $set : true
        },
        startCity : {
          $set : this.state.halfStartCity
        },
        flightVo : {
          $set : flightVo
        }
      }
    });
    //如果没有选择endCity，那么endCity应该是默认值
    !isEmptyObject(this.state.endCity)&&(obj=update(obj,{
      dailyVo : {
        endCity : {
          $set : this.state.endCity
        }
      }
    }))
    this.props.onClickNextBtn && this.props.onClickNextBtn(obj);
  }
  onSelectCity(object){
    this.setState({
      endCity : object,
      canNext : true
    })
  }
  resetEndCity(proxy){
    proxy.nativeEvent.stopImmediatePropagation();
    this.setState({
      endCity : {},
      canNext : false
    });
  }
  checkCanNext(type){
    if(type == 2){
      if(this.state.endCity.cityName){
        this.setState({
          canNext : true,
          type
        });
        return true;
      }
      this.setState({
        canNext : false,
        type
      });
      return false;
    }
    this.setState({
      canNext : true,
      type,
      endCity : {}
    });
    return true;
  }
  onSelectStartCity(object){
    this.setState({
      halfStartCity: object,
      endCity : object,
      type : 0
    });

  }
  selectPickupVo(object){
    this.setState({
      pickupVo : object
    })
  }
  render(){
    return (
      <div className='daily-mian-wrap'>
        {
          !this.props.isHalf ?
          null :
          <div className='daily-city'>
            <SearchCity
              hotXHRUrl='http://api6-test.huangbaoche.com/basicdata/v1.0/cla/hottest/cities'
              initialUrl='http://api6-test.huangbaoche.com/price/v1.0/cla/cities/byinitial'
              searchUrl='http://api6-test.huangbaoche.com/price/v1.2/cla/serviceCities'
              defaultVal={this.state.halfStartCity.cityName}
              onSelectCity={this.onSelectStartCity.bind(this)}
              labelTitle='开始城市'
              />
          </div>
        }
        <div className='daily-time flex-box'>
          <lable htmlFor='daily-time'>出发时间</lable>
          <TimePicker  defaultTime={this.state.time} onCloseTime={this.getStartTime.bind(this)}/>
          <lable className='flex1-box'></lable>
        </div>
        <div className='daily-type flex-box flex-top'>
          <lable htmlFor='daily-type'>包车行程</lable>
          <div className='daily-type-sel flex1-box' id="daily-type" style={{border:0}}>
            <p style={{fontSize : '12px',color : '#6E767D'}}>半日包车仅限市内服务并且不含接送机，如需接送机服务请额外填写接送机信息</p>
          </div>
        </div>
        <FlightOrder
          planVo={this.getDefaultPlanVo(this.props.planVo)}
          isLast={this.props.isLast}
          onhalfSelPickup={this.selectPickupVo.bind(this)}
          />

        <div className={this.state.canNext ? 'mid-btn-wrap' : 'mid-btn-wrap disabled'} onClick={this.getCurrentVo.bind(this)}>
          <span>{this.props.isLast ? '完成选择' : '进入下一天'}</span>
          <Icon type="arrow-right" />
        </div>
      </div>
    )
  }
}

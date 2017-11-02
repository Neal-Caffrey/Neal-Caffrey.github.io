import React , {Component} from 'react';
import {connect} from 'react-redux';
import {Icon} from 'local-Antd';
import {updateShowPickUp,updateShowDropOff,updatePickupInfo,updatePickupVo,updateInputVal,resetDaily,updateDailyVo,updatePickupModelKey} from '../../action/dailyAction.js';
import {updateLoading,showAlert,updateCurrentMap,updateShowMap} from '../../action/mainAction.js'
import update from 'react-addons-update';
import {isEmptyObject ,getChannelId} from 'components/util/index.jsx';
import PickUpModel from '../w-pickup/index.jsx';
import DropOffModal from '../w-dropoff/index.jsx';
import moment from 'moment';
import ApiConfig from 'widgets/apiConfig/index.js';
import YdjAjax from 'components/ydj-Ajax/index.js';
import PlanMap from 'components/w-map/index.js';
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
        // pickupVo : props.planVo.flightVo.pickupVo,
        // dropoffVo : props.planVo.flightVo.dropoffVo
        pickupVo : props.dailyVo.pickupVo,
        dropoffVo : props.dailyVo.dropoffVo
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
  errorHanlde(res){
      let handles = {
        failedHandle: (res) => {
          this.props.dispatch(updateLoading(false));
          this.props.dispatch(showAlert(res.message));
        },
        errorHandle: (xhr, errorType, error, errorMsg) => {
          this.props.dispatch(updateLoading(false));
          this.props.dispatch(showAlert(errorMsg));
        }
      };
      return handles;
  }
  getFlightPath(data,cb){
    let opt = {
      url: ApiConfig.searchPathByPos,
      // url: 'http://api6-dev.huangbaoche.com/trade/fx/v1.0/cla/merchant/detail',
      data:data,
      type : 'GET',
      abort : true,
      successHandle: (res) => {
        cb && cb(res)
          // this.setState({
          //   searchList : res.data.listData,
          //   isLoading : false,
          //   isSearch : true
          // })
      },
      ...this.errorHanlde()
    }
    this.props.dispatch(updateLoading(true));
    new YdjAjax(opt);
  }
  getPriceInfo(api,data,cb){
    let pathData = {
      origin : data.startLocation,
      destination : data.endLocation
    }
    let opt = {
      url: api,
      // url: 'http://api6-dev.huangbaoche.com/trade/fx/v1.0/cla/merchant/detail',
      headers : {
        'Content-Type': 'application/json'
      },
      data:JSON.stringify(data),
      type : 'POST',
      abort : true,
      successHandle: (res) => {
        this.getFlightPath(pathData,(path)=>{
          res.path = path.data;
          cb && cb(res)
        })

          // this.setState({
          //   searchList : res.data.listData,
          //   isLoading : false,
          //   isSearch : true
          // })
      },
      ...this.errorHanlde()
    }
    this.props.dispatch(updateLoading(true));
    new YdjAjax(opt);
  }
  selectPickupVo(pickupObj){
    // this.setState({
    //   pickupState : false,
    //   canNext : true,
    //   pickupVo : pickupObj
    // });
    // this.props.onhalfSelPickup && this.props.onhalfSelPickup(Object.assign({},pickupObj));

    const data = (()=>{
      let {flightVo,placeVo,date,time} = pickupObj;
      let channelId = getChannelId();
      let airportCode = flightVo.arrAirportCode || flightVo.airportCode;
      let serviceDate = date.format('YYYY-MM-DD') + ' ' + time + ':00';
      let startLocation = flightVo.arrLocation || flightVo.airportLocation;
      let endLocation = placeVo.placeLat + ',' + placeVo.placeLng;
      return {channelId,airportCode,serviceDate,startLocation,endLocation};
    })()
    this.getPriceInfo(ApiConfig.searchPickupPrice,data,(res)=>{
      let newPickupVo = update(pickupObj,{
        distanceDesc : {
          $set : res.data.distance
        },
        lines : {
          $set : res.path
        }
      })
      let obj = update(this.props.dailyVo,{
            pickupVo : {
              $set : newPickupVo
            },
            dropoffVo : {
              $set : null
            }
      });
      this.getMap();
      this.data.pickupVo = pickupObj;
      this.props.dispatch(updateLoading(false));
      this.props.dispatch(updateShowPickUp(false));
      this.props.dispatch(updateDailyVo(obj));
    })


    //
    // let obj = update(this.props.dailyVo,{
    //       pickupVo : {
    //         $set : pickupObj
    //       }
    // });
    // this.props.dispatch(updateShowPickUp(false));
    // this.props.dispatch(updateDailyVo(obj));

  }
  selectDropoff(dropoffObj){

    const data = (()=>{
      let {flightVo,placeVo,date,time} = dropoffObj;
      let channelId = getChannelId();
      let airportCode = flightVo.arrAirportCode || flightVo.airportCode;
      let serviceDate = date.format('YYYY-MM-DD') + ' ' + time + ':00';
      let endLocation = flightVo.arrLocation || flightVo.airportLocation;
      let startLocation = placeVo.placeLat + ',' + placeVo.placeLng;
      return {channelId,airportCode,serviceDate,startLocation,endLocation};
    })()
    this.getPriceInfo(ApiConfig.searchDropoffPrice,data,(res)=>{
      console.log(res)
      let newDropoffVo = update(dropoffObj,{
        distanceDesc : {
          $set : res.data.distance
        },
        lines : {
          $set : res.path
        }
      })
      let obj = update(this.props.dailyVo,{
            dropoffVo : {
              $set : newDropoffVo
            },
            pickupVo : {
              $set : null
            }
      });
      this.data.dropoffVo = newDropoffVo;
      this.props.dispatch(updateLoading(false));
      this.props.dispatch(updateShowDropOff(false));
      this.props.dispatch(updateDailyVo(obj));
    })
    //
    //
    // this.data.dropoffVo = dropoffObj;
    // console.log(this.props.dailyVo)
    // let obj = update(this.props.dailyVo,{
    //       dropoffVo : {
    //         $set : dropoffObj
    //       }
    // });
    // this.props.dispatch(updateShowDropOff(false));
    // this.props.dispatch(updateDailyVo(obj));

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
  delDropOffFlight(){
    let obj = update(this.props.dailyVo,{
      dropoffVo : {
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
    // debugger;
    let res = [];
    let isFirst = this.props.currentDayIndex === 0;
    let isLast = this.props.isLast;
    let planLength = this.props.planLength;
    let pickupRes = null;
    let dropOffRes = null;
    const pickupBtn = (()=>{
      if(isFirst){
        return (
          <div className='flex1-box flight-btn-item icon-plane'
            onClick={this.clickPickup.bind(this)}>添加接机</div>);
      }
      return (
        <div className='flex1-box flight-btn-item flight-btn-dis'>
          *最后一天无法选择接机服务
        </div>
      )
    })();
    const dropOffBtn = (()=>{
      if(isLast && planLength > 1){
        return (
          <div className='flex1-box flight-btn-item icon-plane'
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
      // let planPickup = planVo.flightVo && planVo.flightVo.pickupVo;
      let planPickup = null;
       return pickup || planPickup;
    })();
    const dropoffVo = (()=>{
      let {dailyVo,planVo} = this.props;
      let dropoff = dailyVo && dailyVo.dropoffVo;
      // let planDropoff = planVo.flightVo && planVo.flightVo.dropoffVo;
      let planDropoff = null;
       return dropoff || planDropoff;
    })();
    if(pickupVo && pickupVo.date && pickupVo.placeVo){
      const timeDom = (()=>{
        let type = pickupVo.type;
        if(type){
          return (
            <span>{moment(pickupVo.date).format('YYYY-MM-DD')} {pickupVo.time ? pickupVo.time : ''}用车</span>
          )
        }else{
          return (
            <span>{pickupVo.flightVo.arrDate} {pickupVo.flightVo.arrTime ? pickupVo.flightVo.arrTime  : ''}用车</span>
          )
        }
      })()
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
              {timeDom}
              <span>预计里程：<i>{pickupVo.distanceDesc}公里</i></span>
              <span className="flight-op" onClick={()=>this.props.dispatch(updateShowPickUp(true))}>编辑</span>
              <span className="flight-op" onClick={this.delFlight.bind(this)}>删除</span>
            </p>
            <p>出发：{pickupVo.flightVo.arrAirport || pickupVo.flightVo.airportName}</p>
            <p>送达：{pickupVo.placeVo.placeName}</p>
          </div>
        </div> );
    }
    if(dropoffVo && dropoffVo.date && dropoffVo.placeVo){
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
              <span>{moment(dropoffVo.date).format('YYYY-MM-DD')} {dropoffVo.time ? dropoffVo.time : ''}用车</span>
              <span>预计里程：<i>{dropoffVo.distanceDesc}公里</i></span>
              <span className="flight-op" onClick={()=>this.props.dispatch(updateShowDropOff(true))}>编辑</span>
              <span className="flight-op" onClick={this.delDropOffFlight.bind(this)}>删除</span>
            </p>
            <p>出发：{dropoffVo.placeVo.placeName}</p>
            <p>送达：{dropoffVo.flightVo.arrAirport || dropoffVo.flightVo.airportName}</p>
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
  getMap(props=this.props,index){
    let mapAll = props.startCity;
    let currentDayIndex = props.currentDayIndex;
    let path = (()=>{
      const {pickupVo,dropoffVo} = props.dailyVo;
      if(currentDayIndex === 0){
        return pickupVo ? pickupVo.lines : []
      }
      return dropoffVo ? dropoffVo.lines : []
    })();
    let placeName = (()=>{
      const {pickupVo,dropoffVo} = props.dailyVo;
      if(currentDayIndex === 0){
        return pickupVo ? pickupVo.placeVo.placeName : ''
      }
      return dropoffVo ? dropoffVo.placeVo.placeName : ''
    })();
    if(!mapAll){
      return null
    }
    let comonObj = {
    	wraperStyle : {
    		width : '100%',
    		height : '100%',
    		position : 'relative'
    	},
    	popStyle : {
    		width : '800px',
    		height : '800px',
    		position : 'absolute',
    		display : 'inline'
    	},
    	zoom : 8,
      markers : [],
      mapDesc : '',
      linePath : [],
    };
    let center = (()=>{
      return {
        longitude : mapAll.cityLocation.split(',')[1],
        latitude : mapAll.cityLocation.split(',')[0]
      }
    })();
    let markers = (()=>{
      let marker1,marker2;
      if(index === 2){
        marker1 = linePath[0] ? null : center;
        marker2 = linePath[1] ? null : (()=>{
          if(mapEndAll){
            return {
              longitude : mapEndAll.cityLocation.split(',')[1],
              latitude : mapEndAll.cityLocation.split(',')[0]
            }
          }
          return null;

        })();
        return [marker1,marker2]
      }

    })();
    let lines = (()=>{
      if(!path || !path.steps)return [];
      return path.steps.map((val,index)=>{
        return {
          longitude:val.startCoordinate.lng,
          latitude:val.startCoordinate.lat,
        }
      })
    })();
    let infos = (()=>{
      if(lines.length === 0)return [];
      let startPosition = lines[0]
      let endPosition = lines[lines.length-1];
      let startInfo,endInfo;
      // currentDayIndex === 0 ? (,endInfo = {
      //   position
      // })
      startInfo = {
        position : startPosition,

        data : {
          isFlight : currentDayIndex === 0,
          desc : currentDayIndex === 0 ? '' : placeName
        }

      }
      endInfo = {
        position : endPosition,
        data : {
          isFlight : currentDayIndex !== 0,
          desc : currentDayIndex !== 0 ? '' : placeName
        }

      }
      return [startInfo,endInfo];
    })()
    // let mapDesc = (()=>{
    //   let scopes = mapAll.cityRouteScopes[desIndex];
    //   if(!scopes){
    //     return '';
    //   }
    //   let scope = scopes.routeScope;
    //   let place = scopes.routePlaces;
    //   let res = `${scope && '范围：' + scope}\t${place && '参考范围：' + place}`;
    //   return res
    //
    // })()
    comonObj = update(comonObj,{
      center : {
        $set : center
      },
      markers : {
        $set : markers
      },
      mapDesc : {
        $set : ''
      },
      lines : {
        $set : lines
      },
      infos : {
        $set : infos
      }
    });
    this.props.dispatch(updateCurrentMap(comonObj))
    console.log(comonObj)
    return comonObj

  }
  getMapClassName(){
    let {dailyVo} = this.props;
    if(!dailyVo)return 'ui-car-planMap';
    let {pickupVo,dropoffVo} = dailyVo;
    if(pickupVo || dropoffVo)return 'ui-car-planMap has-sel';
    return 'ui-car-planMap'
  }
  render(){
    return (
      <div className='flight-main-wrap'>
        <div className='flight-btn flex-box flex-top'>
          <lable style={{lineHeight:'34px'}}>接送机</lable>
          <div className='flex-box flex-top' style={{width : '500px'}} >
            {this.renderPickupBtn()}
          </div>
          <div className='flex1-box'></div>
        </div>
        <div className={this.getMapClassName()}>
            <PlanMap
              {
                ...this.getMap()
              }
              showFullMap={()=>this.props.dispatch(updateShowMap(true))}


              />
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
              const btnClass = this.props.canNext ? 'mid-btn-wrap' : 'mid-btn-wrap flight-btn-hack disabled';
              const btnTitle = (this.props.isLast) ? '确认行程查价' : '进入下一天';
              return <div
                className={btnClass}
                onClick={this.getCurrentVo.bind(this)}>
                <span>{btnTitle}</span>

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
  const {startCity,currentDayIndex,currentObject,planList} = leftSide;
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
  const planLength = planList.length;
  return {
    isAllDone,
    canNext,
    startCity,
    planVo,
    currentDayIndex,
    dailyVo,
    planLength
  }
}

export default connect(mapStateToProps)(FlightOrder)

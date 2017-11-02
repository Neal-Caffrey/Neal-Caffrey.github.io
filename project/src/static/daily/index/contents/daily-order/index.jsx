import React , {Component} from 'react';
import {connect} from 'react-redux';
// antd
import {Icon,Input} from 'local-Antd';
//组件
import update from 'react-addons-update';
import {isEmptyObject} from 'components/util/index.jsx';
import {updateCurrentMap,updateShowMap,updateLoading,showAlert} from '../../action/mainAction.js';
import {updateShowPickUp,updateShowDropOff,updatePickupInfo,updatePickupVo,updateDropoffVo,updateInputVal,resetDaily,updateDailyVo,updatePickupModelKey} from '../../action/dailyAction.js';
// import {updateDailyVo} from '../../action/leftSideAction.js';
import DailyTimeInner from '../daily-time/index.jsx';
import DailyRoutes from '../daily-route-inner/index.jsx';
import PickUpModel from '../w-pickup/index.jsx';
import DropOffModal from '../w-dropoff/index.jsx';
import PlanMap from 'components/w-map/index.js';
import ApiConfig from 'widgets/apiConfig/index.js';
import YdjAjax from 'components/ydj-Ajax/index.js';
class DailyOrder extends Component{
  constructor(props,context){
    super(props,context);
    this.cacheData();
    this.cacheState();
  }
  cacheData(props =this.props){
    /*
    type,
    pickupVo
    dropoffVo
    endCity
    time
     */
    const { dailyVo :{dropoffVo,pickupVo} }  = props
    console.log(dropoffVo)
    console.log(pickupVo)
    this.data = {
      pickupVo,
      dropoffVo
    }
  }
  cacheState(props=this.props){
    this.state = {
      canNext : props.canNext,
    }
  }
  componentWillReceiveProps(props){
    // this.cacheData(props);
    this.cacheState(props);
    this.cacheData(props)
  }
  _getDropoffInfo(){
    return ''
  }
  getMap(props=this.props,index=this.props.mapType){
    let mapAll = props.startCity;
    let mapEndAll = props.endCity;
    let desIndex = ((i)=>{
      switch (i) {
        case 101:
          return 0;
          break;
        case 102:
          return 1;
          break;
        case 201:
          return 2;
          break;
        case 301:
          return 3;
        default :
          return -1
      }
    })(index)
    index = ((i)=>{
      switch (index) {
        case 101:
          return 0;
          break;
        case 102:
          return 0;
          break;
        case 201:
          return 1;
          break;
        case 301:
          return 2;
        default :
          return -1
      }
    })(index);

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
      mapDesc : ''
    };
    let center = (()=>{
      return {
        longitude : mapAll.cityLocation.split(',')[1],
        latitude : mapAll.cityLocation.split(',')[0]
      }
    })();
    let linePath = (()=>{
      if(index === 2){
          return [mapAll.fences && mapAll.fences[0] && mapAll.fences[0].fencePoints,mapEndAll && mapEndAll.fences && mapEndAll.fences[0] && mapEndAll.fences[0].fencePoints]
      }
      return [mapAll.fences && mapAll.fences[index] && mapAll.fences[index].fencePoints,mapEndAll && mapEndAll.fences && mapEndAll.fences[index] && mapEndAll.fences[index].fencePoints]
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
    let mapDesc = (()=>{
      let scopes = mapAll.cityRouteScopes[desIndex];
      if(!scopes){
        return '';
      }
      function getFanwei(type,val){
        let res = '';
        if(type === 0 || type === 1){
         val.routeScope && (res+= `市内范围：${val.routeScope}<br/>`);
         val.routePlaces && (res+= `参考景点：${val.routePlaces}`);
        }
        if(type === 2){
         val.routeScope && (res+= `周边范围：${val.routeScope}<br/>`);
         val.routePlaces && (res+= `参考景点：${val.routePlaces}`);
        }
        if(type === 3){
         val.routeScope && (res+= `跨城市：${val.routeScope}<br/>`);
         val.routePlaces && (res+= `热门城市：${val.routePlaces}`);
        }
        return res;
      }

      console.log(getFanwei(desIndex,scopes))
      let res = getFanwei(desIndex,scopes);
      return res
    })();
    let infos = (()=>{
      let startInfo;
      let {pickupVo,dropoffVo} = props.dailyVo;
      let flight = pickupVo || dropoffVo;
      if(!flight || !flight.flightVo)return [];
      let flightObj = flight.flightVo;
      startInfo = {
        position : {
          longitude : (flightObj.arrLocation || flightObj.airportLocation).split(',')[1],
          latitude : (flightObj.arrLocation || flightObj.airportLocation).split(',')[0],
        },
        data : {
          isFlight : true,
        }

      }
      return [startInfo];
    })()
    comonObj = update(comonObj,{
      center : {
        $set : center
      },
      linePath : {
        $set : linePath
      },
      markers : {
        $set : markers
      },
      mapDesc : {
        $set : mapDesc
      },
      infos : {
        $set : infos
      }
    });
    this.props.dispatch(updateCurrentMap(comonObj))
    return comonObj

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
  getRoutesByCitys(startCity,endCity,cb){
    let data = (()=>{
      let origStartCity = this.props.origStartCity;
      let startCityId = origStartCity.cityId;
      let depCityId = this.props.startCity.cityId;
      let arrCityId = endCity.cityId;
      return {startCityId,depCityId,arrCityId};
    })()
    let opt = {
      url: ApiConfig.getCityScopes,
      // url: 'http://api6-dev.huangbaoche.com/trade/fx/v1.0/cla/merchant/detail',
      data:data,
      type : 'GET',
      // headers : {
      //   'Content-Type': 'application/json'
      // },
      abort : true,
      successHandle: (res) => {
        cb && cb(res)
        console.log(res);
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
  bindEvent(){
    return {
      getStartTime : (time)=>{
        /**
         * 上车时间
         * @type {[string]}
         */
         let obj = update(this.props.dailyVo,{
               time : {
                 $set : time
               }
         });
        //  let isSyncTime = this.props.isShowLastTime;
        //  if(isSyncTime){
        //    this.props.dispatch(updateDropoffVo({
        //      time : time
        //    }));
        //  }
         this.props.dispatch(updateDropoffVo({
           time : time
         }));
         this.props.dispatch(updateDailyVo(obj));
      },
      getSelRoutesType : (type,endCity)=>{
        /**
         * [isShowTypeSel 点击包车行程时的回调函数]
         * @type {Boolean}
         */

         this.data.type = type;
         this.data.endCity = endCity;
         let obj = update(this.props.dailyVo,{
               type : {
                 $set : type
               },
               endCity : {
                 $set : endCity
               },
               isComplete : {
                 $set : type === -1 ? false : true
               }
         });
        if(endCity && type === 301){
          this.getRoutesByCitys(this.props.startCity,endCity,(res)=>{
            let distanceDesc = `本日行程约`;
            if(res.status === 200){
              distanceDesc = `本日行程约${res.data.routeDistance}公里${res.data.routeDistance>res.data.outtownKms ? ',可能产生超里程费用。':'。'}`;
            }else{
              distanceDesc = `本日行程约0公里`
            }
            let newObj = update(obj,{
              distanceDesc : {
                $set : distanceDesc
              }
            });
            this.props.dispatch(updateLoading(false));
            this.props.dispatch(updateDailyVo(newObj));
            this.setState({
                canNext : true,
            });
          });
        }else{
          //add map props
          this.props.dispatch(updateDailyVo(obj));
          console.log('======',obj)
          this.setState({
              canNext : true,
          });
        }



      },
      selectPickupVo : (object)=> {
        console.log(object);
        this.data.pickupVo = object;
        let obj = update(this.props.dailyVo,{
              pickupVo : {
                $set : object
              }
        });
        this.props.dispatch(updateShowPickUp(false));
        this.props.dispatch(updateDailyVo(obj));
      },
      selectDropoffVo : (object)=> {
        console.log(object);
        this.data.dropoffVo = object;
        let obj = update(this.props.dailyVo,{
              dropoffVo : {
                $set : object
              }
        });
        this.props.dispatch(updateShowDropOff(false));
        this.props.dispatch(updateDailyVo(obj));
      },
      delFlight : ()=>{
        let obj = update(this.props.dailyVo,{
          pickupVo : {
            $set : null
          }
        });
        this.props.dispatch(updatePickupModelKey())
        this.props.dispatch(updateDailyVo(obj));
      },
      delDropoff : ()=>{
        let obj = update(this.props.dailyVo,{
          dropoffVo : {
            $set : null
          }
        });
        this.props.dispatch(updatePickupModelKey())
        this.props.dispatch(updateDailyVo(obj));
      },
      showFullMap : ()=>{
        this.props.dispatch(updateShowMap(true));
      },
      getCurrentVo :()=>{
        if(!this.props.canNext){
          return;
        }
        let obj = update(this.props.planVo,{
          type : {
            $set : this.props.isHalfDay ? 1 : 0
          },
          isComplete : {
            $set : true
          },
          dailyVo : {
            $set : this.props.dailyVo
          },
        });
        if(this.props.isChangeStartCity){
          obj = update(obj,{
            startCity : {
              $set : this.props.startCity
            }
          })
        }
        console.log(this.data);
        if(this.data.currentDayIndex === 0){
          obj = update(obj,{
            dailyVo : {
              pickupVo : {
                $set : this.data.pickupVo
              }
            }
          })
        }
        if(this.props.isLast){
          obj = update(obj,{
            dailyVo : {
              dropoffVo : {
                $set : this.data.dropoffVo
              }
            }
          })
        }
        obj = update(obj,{
          dailyVo : {
            isHalfDay : {
              $set : this.props.isHalfDay
            }
          }
        })
        //重置middle中的数据
        // this.props.dispatch(resetDaily());
        this.props.onClickNextBtn && this.props.onClickNextBtn(obj);
      }
    }
  }

  getMapClassName(){
    if(!this.props.isShowTime)return 'ui-car-planMap car-bigger-map';
    return 'ui-car-planMap';
  }
  render(){
    return (
      <div className='daily-mian-wrap'>
        <DailyTimeInner
          isShowLastTime={this.props.isShowLastTime}
          isShowTime={this.props.isShowTime}
          onCloseTime={this.bindEvent().getStartTime}
          onClickShowFlight={()=>this.props.dispatch(updateShowPickUp(true))}
          onClickDelFlight={this.bindEvent().delFlight}
          onClickShowDropoff={()=>this.props.dispatch(updateShowDropOff(true))}
          onClickDelDropoffFlight={this.bindEvent().delDropoff}
          />
        <div className='daily-type flex-box'>
          <lable htmlFor='daily-type'>包车行程</lable>
          <DailyRoutes
            tempType={this.data.type}
            getSelRoutesType={this.bindEvent().getSelRoutesType}/>
          <div className="flex1-box" style={{overFlow:'hidden'}}>
            {
              (()=>{
                const btnClass = this.props.canNext ? 'mid-btn-wrap' : 'mid-btn-wrap disabled';
                const btnTitle = (this.props.isAllDone || this.props.isLast) ? '确认行程查价' : '进入下一天';
                return <div
                  className={btnClass}
                  onClick={this.bindEvent().getCurrentVo}>
                  <span>{btnTitle}</span>

                </div>
              })()
            }

          </div>
        </div>
        <div className={this.getMapClassName()}>
            <PlanMap
              {
                ...this.getMap()
              }
              showFullMap={this.bindEvent().showFullMap}
              />
        </div>
        <PickUpModel
          isDaily={true}
          onSelect={this.bindEvent().selectPickupVo}
          cancel={()=>this.props.dispatch(updateShowPickUp(false))}/>
        <DropOffModal
          isDaily={true}
          onSelect={this.bindEvent().selectDropoffVo}
          cancel={()=>this.props.dispatch(updateShowDropOff(false))}
          isShowLastTime={this.props.isShowLastTime}
          />
      </div>
    )
  }
}
function mapStateToProps(state) {
  const { leftSide,daily } = state;
  const {currentDayIndex} = leftSide;
  const planVo = leftSide.currentObject;
  // debugger;
  const isModifyCity = daily.isModifyCity;
  const dailyVo = daily.dailyVo;
  const pickupVo = dailyVo.pickupVo;
  let type = planVo.dailyVo.type;
  let mapType = dailyVo.type;
  let isLast = !!(leftSide.planList.length - 1 === currentDayIndex);
  const origStartCity = leftSide.startCity;
  const startCity = dailyVo.startCity;
  const endCity = dailyVo.endCity;
  const isHalfDay = dailyVo.isHalfDay;
  const canNext = isHalfDay ? true : dailyVo.isComplete;
  const isChangeStartCity = (()=>{
    let _old = planVo.dailyVo.startCity;
    let _new = startCity;
    return _old.cityId !== _new.cityId;
  })();
  // 同时check下当天的~~
  const isAllDone = !isChangeStartCity && (()=>{
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
  let isShowTime = (()=>{
    //如果是第一天，一定显示，
    //如果不是第一天，要判断startCity。id 与 planVo.startCity.id 是否相等

    if(currentDayIndex === 0)return true;
    if(isLast)return true;
    if(isChangeStartCity)return true;
    const lastVo = leftSide.planList[currentDayIndex-1];
    const lastStartCity = lastVo.startCity.cityId;
    const lastType = lastVo.type;
    if(lastStartCity !== planVo.startCity.cityId)return true;
    if(lastType === 2 || lastType === 3)return true;
    return false
  })();
  let isShowLastTime = (()=>{
    if(!isLast)return false;
    if(currentDayIndex === 0)return true;
    if(isChangeStartCity)return true;
    const lastVo = leftSide.planList[currentDayIndex-1];
    const lastStartCity = lastVo.startCity.cityId;
    const lastType = lastVo.type;
    if(lastStartCity !== planVo.startCity.cityId)return true;
    if(isChangeStartCity)return true;
    if(lastType === 2 || lastType === 3)return true;
    return false
  })();
  return {
    type,
    canNext,
    startCity,
    endCity,
    planVo,
    currentDayIndex,
    dailyVo,
    isLast,
    mapType,
    isHalfDay,
    isAllDone,
    origStartCity,
    isShowTime,
    isShowLastTime,
    isChangeStartCity,
    isModifyCity
    // ...daily
  }
}

export default connect(mapStateToProps)(DailyOrder)

import React , {Component} from 'react';
import {connect} from 'react-redux';
// antd
import {Icon,Input} from 'local-Antd';
//组件
import update from 'react-addons-update';
import {isEmptyObject} from 'components/util/index.jsx';
import {updateCurrentMap,updateShowMap} from '../../action/mainAction.js';
import {updateShowPickUp,updateShowDropOff,updatePickupInfo,updatePickupVo,updateInputVal,resetDaily,updateDailyVo,updatePickupModelKey} from '../../action/dailyAction.js';
// import {updateDailyVo} from '../../action/leftSideAction.js';
import DailyTimeInner from '../daily-time/index.jsx';
import DailyRoutes from '../daily-route-inner/index.jsx';
import PickUpModel from '../w-pickup/index.jsx';
import DropOffModal from '../w-dropoff/index.jsx';
import PlanMap from 'components/w-map/index.js';
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
    this.data = {

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
  }
  _getDropoffInfo(){
    return ''
  }
  getMap(props=this.props,index=this.props.mapType){
    let mapAll = props.startCity;
    let mapEndAll = props.endCity;
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
      }
    })(index)
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
      markers : []
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

    comonObj = update(comonObj,{
      center : {
        $set : center
      },
      linePath : {
        $set : linePath
      },
      markers : {
        $set : markers
      }
    });
    this.props.dispatch(updateCurrentMap(comonObj))
    return comonObj

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
        //add map props
        this.props.dispatch(updateDailyVo(obj));
        this.setState({
            canNext : true,
        });

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
          startCity : {
            $set : this.props.dailyVo.startCity
          }
        });
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
        this.props.dispatch(resetDaily());
        this.props.onClickNextBtn && this.props.onClickNextBtn(obj);
      }
    }
  }


  render(){
    return (
      <div className='daily-mian-wrap'>
        <DailyTimeInner
          onCloseTime={this.bindEvent().getStartTime}
          onClickShowFlight={()=>this.props.dispatch(updateShowPickUp(true))}
          onClickDelFlight={this.bindEvent().delFlight}
          onClickShowDropoff={()=>this.props.dispatch(updateShowDropOff(true))}
          />
        <div className='daily-type flex-box'>
          <lable htmlFor='daily-type'>包车行程</lable>
          <DailyRoutes
            tempType={this.data.type}
            getSelRoutesType={this.bindEvent().getSelRoutesType}/>
          <div className="flex1-box">
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
        <div className="ui-car-planMap">
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
          isDaily={false}
          onSelect={this.bindEvent().selectDropoffVo}
          cancel={()=>this.props.dispatch(updateShowDropOff(false))}
          />
      </div>
    )
  }
}
function mapStateToProps(state) {
  const { leftSide,daily } = state;
  const {currentDayIndex} = leftSide;
  const planVo = leftSide.currentObject;

  const dailyVo = daily.dailyVo;
  const pickupVo = dailyVo.pickupVo;
  let type = planVo.dailyVo.type;
  let mapType = dailyVo.type;
  let isLast = !!(leftSide.planList.length - 1 === currentDayIndex);
  const startCity = dailyVo.startCity;
  const endCity = dailyVo.endCity;
  const isHalfDay = dailyVo.isHalfDay;
  const canNext = isHalfDay ? true : dailyVo.isComplete;
  const isChangeStartCity = (()=>{
    let _old = planVo.dailyVo.startCity;
    let _new = startCity;
    return _old.cityId === _new.cityId;
  })();
  // 同时check下当天的~~
  const isAllDone = isChangeStartCity && (()=>{
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
    isAllDone
    // ...daily
  }
}

export default connect(mapStateToProps)(DailyOrder)

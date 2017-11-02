// react redux
import React , {Component} from 'react';
import {connect} from 'react-redux';
import update from 'react-addons-update';
import {updatePlanListByIndexAndIndex,updateCurrentDayIndex,updateCompleteAll} from '../../action/leftSideAction.js';
import {setFlightFrom} from '../../action/flightAction.js';
import {updateDailyVo,resetDaily,updateIsModified,updatePickupModelKey} from '../../action/dailyAction.js';
import {updateMainSplitAndQuery,updateLoading,showAlert} from '../../action/mainAction.js';
// antd
import {Input,Icon,Radio} from 'local-Antd';
const RadioGroup = Radio.Group;
//组件
import DailyOrder from '../daily-order/index.jsx';
import HalfOrder from '../daily-order/half0.jsx';
import FlightOrder from '../daily-order/flight.jsx';
import NoneOrder from '../daily-order/none.jsx';
import SearchCity from '../w-innerCity/index.jsx';
import {modifyPlanList,checkIsAllDone,getOrder,getPriceParam} from 'components/util/index.jsx';
import ApiConfig from 'widgets/apiConfig/index.js';
import YdjAjax from 'components/ydj-Ajax/index.js';
//css
import './sass/index.scss';

class MiddleSlide extends Component{
  /**
   * 初始化，我们初始化的时候一般会办两件事，一个是保存数据，一个是设置state，
   * willReaciveProps的时候往往需要我们重新根据props生成新的数据和state
   * @method constructor
   */
  constructor(props,context){
    super(props,context);
    this.cacheData();
    this.cacheState();
  }
  /**
   * hook
   * @method componentWillReceiveProps
   * @param  {[type]}                  nextProps [description]
   * @return {[type]}                            [description]
   */
  componentWillReceiveProps(nextProps){
    this.cacheData(nextProps);
    this.cacheState();
    this.cacheState();
  }
  /**
   * 保存数据
   * @method cacheData
   * @param  {[type]}  [props=this.props]
   */
  cacheData(props=this.props){
    console.log(props);
    let {type,dailyVo} = props.currentObject;
    let currentDayIndex = props.currentDayIndex;
    let startCity = null;
    // debugger;

    if(type === 0 || type === 1 || type === 2 || type === 3){
      startCity = dailyVo.startCity
    }
    this.data = {
      startCity,//开始城市
      currentDayIndex,//当前index
      type//行程类型
    }
  }
  /**
   * 设置初始state,注意：你拿到的props有可能需要很多的判断才能成为你真正需要用到的数据
   * 那么，cacheState尽量是从你的date里面去取值
   * @method cacheState
   * @param  {object}   [props=this.props]
   */
  cacheState(){
    this.state = {
      type : this.data.type || 0,
      isModifyCity : false
    }
  }
  bindEvent(){
    return {
      changeRadioType : (event)=>{
        let currentObject = this.props.currentObject['dailyVo'];
        this.setState({
          type : event.target.value
        });
        this.props.dispatch(setFlightFrom(event.target.value === 0 || event.target.value === 0));
        if(event.target.value === 0){
          if(this.props.currentObject.type === 0){
              this.props.dispatch(updateDailyVo(this.props.currentObject['dailyVo']));
          }else{
            //默认
            let obj = update(currentObject,{
                time : {
                  $set : '09:00'
                },
                isHalfDay : {
                  $set : false
                },
                type : {
                  $set : -1
                },
                isComplete : {
                  $set : false
                },
                pickupVo : {
                  $set : null
                },
                dropoffVo : {
                  $set : null
                }
            });
            this.props.dispatch(updateDailyVo(obj));
          }


        }
        if(event.target.value === 1){
          if(this.props.currentObject.type === 1){
          let obj = update(this.props.currentObject['dailyVo'],{
            isHalfDay : {
              $set : true
            },
            type : {
              $set : 102
            },
            endCity : {
              $set : null
            }
          });
          this.props.dispatch(updateDailyVo(obj))
          }else{
            console.log(currentObject)
          //默认
          let obj = update(currentObject,{
              time : {
                $set : '09:00'
              },
              isHalfDay : {
                $set : true
              },
              type : {
                $set : 102
              },
              isComplete : {
                $set : true
              },
              endCity : {
                $set : null
              },
              pickupVo : {
                $set : null
              },
              dropoffVo : {
                $set : null
              }
          });
          this.props.dispatch(updateDailyVo(obj));
          }
        }
        if(event.target.value === 3){
          if(this.props.currentObject.type === 3){
              this.props.dispatch(updateDailyVo(this.props.currentObject['dailyVo']));
          }else{
          let obj = update(currentObject,{
              time : {
                $set : '09:00'
              },
              isHalfDay : {
                $set : false
              },
              type : {
                $set : -1
              },
              isComplete : {
                $set : false
              },
              endCity : {
                $set : null
              },
              pickupVo : {
                $set : null
              },
              dropoffVo : {
                $set : null
              }
          });
          this.props.dispatch(updatePickupModelKey());
          this.props.dispatch(updateDailyVo(obj));
          // this.props.dispatch(updateDailyVo(this.props.currentObject['dailyVo']))
        }
      }
      },
      onSelectStartCity : (city)=>{

        //@TODO : 去修改当天的城市，fuck，删除余下的所有行程
        let currentObject = this.props.currentObject['dailyVo'];
        if(!city){
          this.setState({
            isModifyCity : false
          });
          return;
        }
        let obj = update(currentObject,{
            time : {
              $set : '09:00'
            },
            isHalfDay : {
              $set : false
            },
            startCity : {
              $set : city
            },
            type : {
              $set : -1
            },
            isComplete : {
              $set : false
            }
        });
        console.log(city)
        this.data.startCity = city;
        this.props.dispatch(updateDailyVo(obj));
        this.props.dispatch(updateIsModified(true))
        this.setState({
          isModifyCity : false
        });
      },
      modifyCity :()=>{
        this.setState({
          isModifyCity : true
        });

      },
      /**
       * [clickNextBtn 点击下一天，或者完成]
       * @method clickNextBtn
       * @param  {[Object]}     object [当前如行程]
       */
      clickNextBtn :(object)=>{
        // console.log(object)
        // object.type = this.state.type;
        this.props.dispatch(updateIsModified(false))
        let isToResetPlanList = (()=>{
          let lastObj = this.props.planList[this.props.currentDayIndex];
          let lastEndCity = lastObj.dailyVo.endCity;
          let thisEndCity = lastObj.dailyVo.endCity;
          let isEndChange = (()=>{
            if(lastEndCity === undefined && thisEndCity === undefined)return true;
            if(lastEndCity === null && thisEndCity === null)return true;
            if(lastEndCity || thisEndCity)return true;
            if(lastEndCity.cityId !== thisEndCity.cityId)return true;
            return false;
          })();
          let isTypeChange = (()=>{
            let isLastDaily = lastObj.type === 0 || lastObj.type === 1;
            let isThisDaily = object.type === 0 || object.type === 1;
            if(object.type === 2)return true;
            if(object.type === 3)return true;
            if(isLastDaily != isThisDaily)return true;
            if(lastObj.type === object.type)return false;
            if(lastObj.type === 3 || lastObj.type === 2)return true;
            return false;
          })()
          if(lastObj.startCity.cityId!==object.startCity.cityId ||
            isTypeChange ||
            isEndChange){
            return true
          }
          return false
        })();
        let planList;
        if(isToResetPlanList){
          planList = modifyPlanList(this.props.planList,object,this.props.currentDayIndex);
        }else{
          planList = update(this.props.planList,{});
          planList[this.props.currentDayIndex] = object;
        }
        // let planList = modifyPlanList(this.props.planList,object,this.props.currentDayIndex);
        let isAllDone = checkIsAllDone(planList);
        let nextCurrentDayIndex = (()=>{
          const {currentDayIndex} = this.props;
          this.props.currentDayIndex === planList.length-1 ? this.props.currentDayIndex : this.props.currentDayIndex+1;

          if(currentDayIndex === planList.length-1){
              // last
              return currentDayIndex
          }
          if(isAllDone){
            // alldone
            return currentDayIndex
          }
          return currentDayIndex+1;
        })();
        let currentObject = planList[nextCurrentDayIndex];
        this.props.dispatch(updatePlanListByIndexAndIndex(planList,nextCurrentDayIndex));
        this.props.dispatch(updateCurrentDayIndex(nextCurrentDayIndex,currentObject));
        this.props.dispatch(updateDailyVo(currentObject['dailyVo']))
        // this.props.dispatch(updateCurrentDayIndex(this.props.currentDayIndex+1));
        this.props.dispatch(updateCompleteAll(isAllDone));
        if(isAllDone){
          let splitPlanList = getOrder(planList);
          let queryParam = getPriceParam(splitPlanList);
          console.log(splitPlanList,queryParam)
          //
          this.searchCars(queryParam,(res)=>{
            this.props.dispatch(updateLoading(false));
            this.props.dispatch(updateMainSplitAndQuery(splitPlanList,queryParam,res.data));
          })
        }else{

        }
      }
    }
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
  searchCars(queryParam,cb){
    let opt = {
      url: ApiConfig.searchDailyCarList,
      // url: 'http://api6-dev.huangbaoche.com/trade/fx/v1.0/cla/merchant/detail',
      data:JSON.stringify({
        batchPrice : queryParam
      }),
      type : 'POST',
      headers : {
        'Content-Type': 'application/json'
      },
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
      // ...this._handleErrors
    }
    this.props.dispatch(updateLoading(true));
    new YdjAjax(opt);
  }
  renderUI(){
    return {
      renderOrder : ()=>{
        if(this.state.type == 0 || this.state.type == 1){
          return <DailyOrder
            onClickNextBtn={this.bindEvent().clickNextBtn}/>
        }
        if(this.state.type == 3){
          return <FlightOrder
            planVo={this.props.currentObject}
            onClickNextBtn={this.bindEvent().clickNextBtn}
            isLast={this.props.currentDayIndex === this.props.planList.length-1}/>
        }
        if(this.state.type == 2){
          return <NoneOrder
            planVo={this.props.currentObject}
            onClickNextBtn={this.bindEvent().clickNextBtn}
            isLast={this.props.currentDayIndex === this.props.planList.length-1} />
        }
      }
    }
  }

  renderMain(){
    console.log('renderMain')
    return (
      <div className="ui-middle-side">
        <div className="mid-time-des">
          <span>第{this.props.currentDayIndex+1}天</span><i>{this.props.currentObject.date.format('YYYY-MM-DD')}</i>
          <span className="inner-searchCity">
            {
              ((currentDayIndex,type,isModifyCity)=>{
                if(isModifyCity){
                  return null
                }
                if(currentDayIndex === 0 && (type === 0 || type === 1) || type=== 3){
                  //包车的第一天 不能修改
                  return (
                    <span className="inner-city">
                      <label>开始城市：</label>
                      <span>{this.data.startCity.cityName}</span>
                    </span>
                  )
                }else if(currentDayIndex > 0 && (type === 0 || type === 1)){
                  //包车如第一天+ 可以修改
                  return (
                    <span className="inner-city">
                      <label>开始城市：</label>
                      <span>{this.data.startCity.cityName}</span>
                      <i onClick={this.bindEvent().modifyCity}>修改</i>
                    </span>
                  )
                }else{
                  return null;
                }
              })(this.data.currentDayIndex,this.state.type,this.state.isModifyCity)
            }
            {
              this.state.isModifyCity &&
              <SearchCity
                cityId={this.data.startCity.cityId}
                hotXHRUrl={ApiConfig.searchCitiesOfPassCity}
                initialUrl={ApiConfig.searchCitiesOfPassCity}
                searchUrl={ApiConfig.searchCitiesOfPassCity}
                routerUrl={ApiConfig.queryCityRoute}
                defaultVal={this.data.startCity.cityName}
                onSelectCity={this.bindEvent().onSelectStartCity}
                labelTitle='开始城市:'/>
            }
          </span>
        </div>
        <div className="mid-main-wrap">
          <div className="mid-order-type flex-box">
            <lable htmlFor="order-type">包车方式</lable>
            <RadioGroup id='order-type' className='flex1-box' value={this.state.type} onChange={this.bindEvent().changeRadioType}>
              <Radio value={0}>按天包车</Radio>
              <Radio value={1}>半日包车</Radio>
              {
                (()=>{
                  let res = [];
                  if(this.data.currentDayIndex === 0){
                    res.push(<Radio value={3}>仅接送机</Radio>);
                    return res;
                  }
                  if(this.data.currentDayIndex === this.props.planList.length-1){
                    res.push(<Radio value={3}>仅接送机</Radio>);
                    return res;
                  }
                  res.push( <Radio value={2}>本日无包车</Radio>);
                  return res;
                })()
              }
            </RadioGroup>
          </div>
          {this.renderUI().renderOrder()}
        </div>
      </div>
    )
  }
  render(){
    return (
      (this.props.planList.length == 0 || !this.props.currentObject) ? <div className="ui-middle-side"></div> : this.renderMain()
    )
  }
}

function mapStateToProps(state) {
  const { leftSide } = state;
  const {planList,currentDayIndex,currentObject} = leftSide;
  return {
    planList,
    currentDayIndex,
    currentObject,
  }
}
export default connect(mapStateToProps)(MiddleSlide);

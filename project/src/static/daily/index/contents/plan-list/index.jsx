import React,{Component} from 'react';
import {connect} from 'react-redux';
import update from 'react-addons-update';
import moment from 'moment';
import {updateCurrentDayIndex,initailPlanList,updateTime} from '../../action/leftSideAction.js';
import {updateDailyVo} from '../../action/dailyAction.js'

import {Icon} from 'local-Antd';
import './sass/index.scss';

class PlanList extends Component{
  constructor(props,context){
    super(props,context);
    this.state = this.defaultState;
  }
  get defaultState(){
    return {
      activeIndex : this.props.currentDayIndex || 0
    }
  }
  componentWillReceiveProps(props){
    this.setState({
      activeIndex : props.currentDayIndex
    })
  }
  getCurrentClassName(index=0){
    // if(!this.props.planList || (this.props.planList&&this.props.planList.length == 0)){return}
    if(index === this.state.activeIndex){
      return 'plan-item plan-item-active'
    }else if(this.props.planList[index].isComplete){
      return 'plan-item plan-item-complete'
    }else{
      return 'plan-item'
    }
  }
  clickDays(index){
    if(this.props.planList[index].isComplete){
        this.props.dispatch(updateCurrentDayIndex(index,this.props.planList[index]));
        if(this.props.planList[index].type === 0 || this.props.planList[index].type === 1 || this.props.planList[index].type === 2){
          this.props.dispatch(updateDailyVo(this.props.planList[index]['dailyVo']));
        }else if(this.props.planList[index].type === 3){
          // 仅接送机
          let object = this.props.planList[index];
          let dailyVo = object.dailyVo;
          if(!object.flightVo){
            this.props.dispatch(updateDailyVo(dailyVo));
            return;
          }
          let {flightVo:{pickupVo,dropoffVo}} = object;
          //应该把外层的flightVo搞到dailyVo中~
          let newDailyVo = update(dailyVo,{
            pickupVo : {
              $set : pickupVo
            },
            dropoffVo : {
              $set : dropoffVo
            }
          });
          this.props.dispatch(updateDailyVo(newDailyVo));
        }
        return;
    }
    if(index - this.props.currentDayIndex === 1){
      $('.mid-btn-wrap').trigger('click');
    }
  }
  bindEvent(){
    return {
      addDay : ()=>{
        //添加一天
        if(!this.props.canClickAdd){return}
        let planList = this.props.planList;
        let length = planList.length;
        let endTime = moment(this.props.endTime).add(1,'days');
        let lastObj = update(planList[length-1],{
          isLast : {
            $set : false
          }
        });
        let obj = update(planList[length-1],{
          date : {
            $set : endTime
          },
          distanceDesc : {
            $set : ''
          },
          isLast : {
            $set : true
          },
          isComplete:{
            $set : false
          },
          dailyVo : {
            startCity : {
              $set : lastObj.dailyVo.endCity || this.props.startCity
            },
            pickupVo : {
              $set : null
            },
            dropoffVo : {
              $set : null
            },
            endCity : {
              $set : null
            },
            time : {
              $set :  '09:00'
            },
            type : {
              $set : -1
            },
            isHalfDay : {
              $set : false
            },
            isComplete : {
              $set : false
            }
          },
          type : {
            $set : 0
          }
        });

        let nextPlanList = update(planList,{
          $push : [obj],
          $splice : [[length-1,1,lastObj]]
        });
        console.log(nextPlanList);
        this.props.dispatch(initailPlanList(nextPlanList));
        this.props.dispatch(updateTime(moment(this.props.startTime),endTime));
      },
      minDay : ()=>{
        //减少一天

        let planList = this.props.planList;
        let length = planList.length;
        if(length === 1){
          alert('不能再删除了~');
          return;
        }

        if(!planList[length-1].isComplete){
          // 如果最后一天没有已经完成，直接删除，否则提示再删除
          todel.call(this);
          return;
        }
        if(!window.confirm('是否删除本日行程')){
          return
        }
        todel.call(this);
        function todel(){
          let nextPlanList = update(planList,{
            $splice : [[length-1,1]]
          });
          let endTime = nextPlanList[length-2].date;
          let newLength = nextPlanList.length;
          let newLastObj = nextPlanList[newLength-1];
          let defaultObj = (()=>{
            let res = update(newLastObj,{})
            if(res.type === 2){
              res = update(newLastObj,{
                isComplete : {
                  $set : false
                },
                type : {
                  $set : 0
                }
              });
              nextPlanList = update(nextPlanList,{
                $splice : [[nextPlanList.length-1,1,res]]
              })
            }

            return res
          })();
          this.props.dispatch(initailPlanList(nextPlanList));
          this.props.dispatch(updateTime(moment(this.props.startTime),moment(endTime)));
          if(this.props.currentDayIndex === length-1){
            //说明是最后一项，这个时候应该删除最后一个。
            this.props.dispatch(updateCurrentDayIndex(this.props.currentDayIndex-1,defaultObj))
            this.props.dispatch(updateDailyVo(defaultObj['dailyVo']));
          }
        }

      }
    }
  }
  renderPlanDes(planVo){
    // const { type, dailyVo : {startCity,endCity} } = planVo;
    const {type,dailyVo,isComplete,flightVo} = planVo;
    const {startCity,endCity} = dailyVo;
    const dailyType = dailyVo.type;

    if(!isComplete){return null}
    if(type === 0 || type === 1){
      if(dailyType === 301 && endCity && endCity.cityName){
        return (<p className='plan-dis-subtitle'>{startCity.cityName}-{endCity.cityName}</p>)
      }
      return (<p className='plan-dis-subtitle'>{startCity.cityName}</p>)
    }
    if(type === 2){
      return (<p className='plan-dis-subtitle'>本日无包车</p>)
    }
    if(type === 3 && flightVo){
      const {pickupVo,dropoffVo} = flightVo;
      if(dropoffVo){
        return (<p className='plan-dis-subtitle'>{dropoffVo.flightVo.cityName}</p>)
      }
      if(pickupVo){
        return (<p className='plan-dis-subtitle'>{pickupVo.flightVo.arrCityName || pickupVo.flightVo.arrCityName}</p>)
      }

    }

  }
  renderMain(){
    return (
      <div className='ui-left-bottom'>
        <div className="plan-title">
          <p>行程共<span>{this.props.planList.length}</span>天</p>
        </div>
        <div className='plan-list'>
          <ul>

            {
              this.props.planList.map((val,index)=>{
                return (
                  <li key={index} className={this.getCurrentClassName(index)} onClick={this.clickDays.bind(this,index)}>
                    <div className='plan-day-icon'>D{index+1}</div>
                    <div className='plan-dis'>
                      <p className='plan-dis-title'>{val.date.format('YYYY-MM-DD')} {val.date.format('ddd')}</p>
                      {this.renderPlanDes(val)}
                    </div>
                  </li>
                )
              })
            }
          </ul>
        </div>
        <div className='plan-operate'>
          <div onClick={this.bindEvent().addDay} className={this.props.canClickAdd !== true && 'disabled'}>
            <Icon type="plus-circle-o" style={{fontSize:'20px',marginRight:'8px'}} /><span>增加一天</span>
          </div>
          <div onClick={this.bindEvent().minDay}>
            <span style={{fontSize:12}}>删除最后一天</span>
          </div>
        </div>
      </div>
    )
  }
  render(){
    return this.props.planList.length > 0 ? this.renderMain() : null

  }
}

function mapStateToProps(state) {
  const { leftSide,daily } = state;
  const {planList,currentDayIndex,endTime,startCity,startTime} = leftSide;
  const isTempDropoff = (()=>{
    if(daily && daily.dailyVo){
      const dropoffVo = daily.dailyVo.dropoffVo;
      if(dropoffVo){
        return true;
      }
      return false;
    }else{
      return false;
    }
  })();
  const canClickAdd = (()=>{
    let length = planList.length;
    if(length === 0){return false}
    if(isTempDropoff){return false}
    let lastObj = planList[planList.length-1];
    if(lastObj.type === 3){
      return false;
    }
    if(lastObj.type === 0 || lastObj.type === 1){
      const {dropoffVo} = lastObj.dailyVo;
      if(dropoffVo){return false}
    }
    return true
  })()
  return {
    planList,
    currentDayIndex,
    startTime,
    endTime,
    startCity,
    canClickAdd
  }
}
export default connect(mapStateToProps)(PlanList);

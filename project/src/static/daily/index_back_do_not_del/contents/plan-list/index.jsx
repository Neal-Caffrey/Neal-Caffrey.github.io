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
        if(this.props.planList[index].type === 0 || this.props.planList[index].type === 1 || this.props.planList[index].type === 2 || this.props.planList[index].type === 3){
            this.props.dispatch(updateDailyVo(this.props.planList[index]['dailyVo']));
        }
    }
  }
  bindEvent(){
    return {
      addDay : ()=>{
        //添加一天
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
            endCity : {
              $set : null
            },
            time : {
              $set :  '09:00'
            },
            type : {
              $set : -1
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

        let nextPlanList = update(planList,{
          $splice : [[length-1,1]]
        });
        let endTime = nextPlanList[length-2].date;
        console.log(nextPlanList);
        this.props.dispatch(initailPlanList(nextPlanList));
        this.props.dispatch(updateTime(moment(this.props.startTime),moment(endTime)));
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
                      <p className='plan-dis-subtitle'>{val.startCity.cityName}</p>
                    </div>
                  </li>
                )
              })
            }
          </ul>
        </div>
        <div className='plan-operate'>
          <div onClick={this.bindEvent().addDay}>
            <Icon type="plus-circle-o" /><span>增加一天</span>
          </div>
          <div onClick={this.bindEvent().minDay}>
            <Icon type="minus-circle-o" /><span>删除一天</span>
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
  const { leftSide } = state;
  const {planList,currentDayIndex,endTime,startCity} = leftSide;
  return {
    planList,
    currentDayIndex,
    endTime,
    startCity
  }
}
export default connect(mapStateToProps)(PlanList);

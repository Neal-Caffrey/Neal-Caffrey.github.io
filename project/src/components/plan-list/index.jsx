import React,{Component} from 'react';
import {connect} from 'react-redux';
import {updateCurrentDayIndex} from 'ACTIONS/leftSideAction.js'
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
        this.props.dispatch(updateCurrentDayIndex(index));
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
          <div>
            <Icon type="plus-circle-o" /><span>增加一天</span>
          </div>
          <div>
            <span>删除一天</span>
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
  const {planList,currentDayIndex} = leftSide;
  return {
    planList,
    currentDayIndex
  }
}
export default connect(mapStateToProps)(PlanList);

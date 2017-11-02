import React , {Component} from 'react';
import {connect} from 'react-redux';
import {Input,Icon,Radio} from 'local-Antd';
const RadioGroup = Radio.Group;
import DailyOrder from 'components/daily-order/index.jsx';
import HalfOrder from 'components/daily-order/half.jsx';
import FlightOrder from 'components/daily-order/flight.jsx';
import NoneOrder from 'components/daily-order/none.jsx';

import {updatePlanListByIndexAndIndex,updateCurrentDayIndex,updateCompleteAll} from 'ACTIONS/leftSideAction.js';
import {modifyPlanList,checkIsAllDone} from 'components/util/index.jsx';
import './sass/index.scss';

class MiddleSlide extends Component{
  constructor(props,context){
    super(props,context);
    // const thisObj = this.props.planList[this.props.currentDayIndex];
    this.state = {
      currentDayIndex : this.props.currentDayIndex,
      currentObject : this.props.currentObject,
      type : 0
    }
  }
  componentWillReceiveProps(nextProps){
    this.setState({
      // type : nextProps.currentObject.type,
      currentObject : nextProps.currentObject,
      currentDayIndex : nextProps.currentDayIndex,
      type : nextProps.currentObject.type
    })
  }
  clickNextBtn(object){
    object.type = this.state.type;
    let planList = modifyPlanList(this.props.planList,object,this.props.currentDayIndex);
    this.props.dispatch(updatePlanListByIndexAndIndex(planList,this.props.currentDayIndex === planList.length-1 ? this.props.currentDayIndex : this.props.currentDayIndex+1));
    // this.props.dispatch(updateCurrentDayIndex(this.props.currentDayIndex+1));
    this.props.dispatch(updateCompleteAll(checkIsAllDone(planList)))
  }

  changeRadioType(event){
    this.setState({
      type : event.target.value
    });
  }

  renderOrder(){
    if(this.state.type == 0){
      return <DailyOrder isHalf={false} planVo={this.state.currentObject} onClickNextBtn={this.clickNextBtn.bind(this)} isLast={this.props.currentDayIndex === this.props.planList.length-1}/>
    }
    if(this.state.type == 2){
      return <FlightOrder planVo={this.state.currentObject} onClickNextBtn={this.clickNextBtn.bind(this)} isLast={this.props.currentDayIndex === this.props.planList.length-1}/>
    }
    if(this.state.type == 1){
      return <HalfOrder isHalf={true} planVo={this.state.currentObject} onClickNextBtn={this.clickNextBtn.bind(this)} isLast={this.props.currentDayIndex === this.props.planList.length-1}/>
    }
    if(this.state.type == 3){
      return <NoneOrder planVo={this.state.currentObject} onClickNextBtn={this.clickNextBtn.bind(this)} isLast={this.props.currentDayIndex === this.props.planList.length-1} />
    }
  }

  renderMain(){
    return (
      <div className="ui-middle-side">
        <div className="mid-time-des">
          <span>第{this.state.currentDayIndex+1}天</span><i>{this.state.currentObject.date.format('YYYY-MM-DD')}</i>
        </div>
        <div className="mid-main-wrap">
          <div className="mid-order-type flex-box">
            <lable htmlFor="order-type">包车方式</lable>
            <RadioGroup id='order-type' className='flex1-box' value={this.state.type} onChange={this.changeRadioType.bind(this)}>
              <Radio value={0}>按天包车</Radio>
              <Radio value={1}>半日包车</Radio>
              <Radio value={2}>仅接送机</Radio>
              {this.state.currentDayIndex == 0 ? null : <Radio value={3}>本日无包车</Radio>}
            </RadioGroup>
          </div>
          {this.renderOrder()}
        </div>
      </div>
    )
  }
  render(){
    return (
      this.props.planList.length == 0 ? <div className="ui-middle-side"></div> : this.renderMain()
    )
  }
}

function mapStateToProps(state) {
  const { leftSide } = state;
  const { middleSide } = state;
  const {planList,currentDayIndex} = leftSide;
  const {test} = middleSide;
  const currentObject = planList[currentDayIndex]
  return {
    planList,
    currentDayIndex,
    currentObject,
    test
  }
}
export default connect(mapStateToProps)(MiddleSlide);

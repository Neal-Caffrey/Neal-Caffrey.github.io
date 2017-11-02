import React , {Component} from 'react';
import {Icon} from 'local-Antd';
import update from 'react-addons-update';

export default class None extends Component{
  constructor(props,context){
    super(props,context);

  }
  componentWillReceiveProps(props){

  }

  getCurrentVo(){
    let obj = update(this.props.planVo,{
      isComplete : {
        $set : true
      },
      isLast : {
        $set : this.props.isLast
      },
      type : {
        $set : 2
      }
    });
    this.props.onClickNextBtn && this.props.onClickNextBtn(obj);
  }

  render(){
    return (
      <div className='daily-mian-wrap'>
        <div className='mid-btn-wrap'
          onClick={this.getCurrentVo.bind(this)}>
          <span>{this.props.isLast ? '完成选择' : '进入下一天'}</span>
          <Icon type="arrow-right" />
        </div>
      </div>
    )
  }
}
function mapStateToProps(state) {
  const { leftSide,daily } = state;
  const {currentDayIndex} = leftSide;

  let isLast = !!(leftSide.planList.length - 1 === currentDayIndex);

  return {
    isLast,
  }
}

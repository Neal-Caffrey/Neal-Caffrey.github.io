import React , {Component} from 'react';
import {Icon} from 'local-Antd';
import update from 'react-addons-update';

export default class None extends Component{
  constructor(props,context){
    super(props,context);
    this.state = {
      canNext : true
    }

  }
  componentWillReceiveProps(props){

  }

  clickType(index){
    if(index === this.state.type){
      return;
    }
    this.checkCanNext(index);
  }
  getCurrentVo(){
    let obj = update(this.props.planVo,{
      isComplete : {
        $set : true
      },
      isLast : {
        $set : this.props.isLast
      }
    });
    this.props.onClickNextBtn && this.props.onClickNextBtn(obj);
  }

  render(){
    return (
      <div className='daily-mian-wrap'>
        <div className={this.state.canNext ? 'mid-btn-wrap' : 'mid-btn-wrap disabled'} onClick={this.getCurrentVo.bind(this)}>
          <span>{this.props.isLast ? '完成选择' : '进入下一天'}</span>
          <Icon type="arrow-right" />
        </div>
      </div>
    )
  }
}

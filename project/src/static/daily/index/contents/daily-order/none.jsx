import React , {Component} from 'react';
import {connect} from 'react-redux';
import {Icon} from 'local-Antd';
import update from 'react-addons-update';

class None extends Component{
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
        {
          (()=>{
            const btnTitle = '进入下一天';
            return <div
              className="mid-btn-wrap"
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
  const {currentDayIndex} = leftSide;

  let isLast = !!(leftSide.planList.length - 1 === currentDayIndex);
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
  })();
  return {
    isLast,
    isAllDone,
  }
}
export default connect(mapStateToProps)(None)

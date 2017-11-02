import React,{Component,PropTypes} from 'react';
import {Link,Element,animateScroll,scrollSyp} from 'react-scroll';
import update from 'react-addons-update';
import OnclickOutside from 'react-onclickoutside';
import './sass/index.scss';
import setting from './js/setting.js';
export default OnclickOutside(class UITimePicker extends Component{
  static propTypes = {
    defaultTime : PropTypes.string
  }
  constructor(props,context){
    super(props,context);
    this.state = {
      isShowPop : false,
      hhActIndex : 9,
      mmActIndex : 0,
      defaultTime : this.props.defaultTime,
      setting
    }
    this.clickNum = 0;
  }
  componentWillReceiveProps(props){
    this.setState({
      defaultTime : props.defaultTime,
    })
  }
  inputClickHandle(proxy){
    // const target = proxy.target
    this.setState({
      isShowPop : !this.state.isShowPop
    });

    animateScroll.scrollTo(this.state.hhActIndex * 28,{
      duration: 200,
      delay: 0,
      smooth: true,
      containerId : 'hhScroll'
    });

  }

  hhClick(index,proxy){
    let isToClose = this.checkToClose();
    // if(index == this.state.hhActIndex){
    //   return;
    // }
    const obj = Object.assign({},this.state);
    const yelNextObj = Object.assign({},obj.setting.hhArr[this.state.hhActIndex]);
    const nextObj = Object.assign({},obj.setting.hhArr[index]);
    const cTime = ((time)=>{
      return `${nextObj.hh}:${time.split(':')[1]}`
    })(obj.defaultTime);
    yelNextObj.act = index == this.state.hhActIndex ? true : false;
    nextObj.act = true;
    this.setState(update(obj,{
      hhActIndex : {
        $set : index,
      },
      defaultTime : {
        $set : cTime
      },
      setting : {
        hhArr: {
          $splice : [[index,1,nextObj],[this.state.hhActIndex,1,yelNextObj]]
        }
      },
      isShowPop : {
        $set : !isToClose
      }
    }
  ));

  animateScroll.scrollTo(index*28,{
    duration: 200,
    delay: 0,
    smooth: true,
    containerId : 'hhScroll'
  });
  // this.checkToClose();
  isToClose && this.props.onCloseTime && this.props.onCloseTime(cTime);
}
checkToClose(){
  if(this.clickNum === 1){
    this.clickNum = 0;
    return true;
  }
  this.clickNum ++ ;
  return false;
}
handleClickOutside(evt){
  this.state.isShowPop == true && this.props.onCloseTime && this.props.onCloseTime(this.state.defaultTime);
  this.setState({
    isShowPop : false
  });
  this.clickNum = 0;

}
mmClick(index){
  let isToClose = this.checkToClose();
  // if(index == this.state.mmActIndex){
  //   return;
  // }
  const obj = Object.assign({},this.state);
  const nextObj = Object.assign({},obj.setting.mmArr[index]);
  const yelNextObj = Object.assign({},obj.setting.mmArr[this.state.mmActIndex]);
  yelNextObj.act = index == this.state.mmActIndex ? true : false;
  nextObj.act = true;

  const cTime = ((time)=>{
    return `${time.split(':')[0]}:${nextObj.mm}`
  })(obj.defaultTime);

  this.setState(update(obj,{
    mmActIndex : {
      $set : index
    },
    defaultTime : {
      $set : cTime
    },
    setting : {
      mmArr: {
        $splice : [[index,1,nextObj],[this.state.mmActIndex,1,yelNextObj]]
      }
    },
    isShowPop : {
      $set : !isToClose
    }
  }
));
isToClose && this.props.onCloseTime && this.props.onCloseTime(cTime);

// this.checkToClose();
}


render(){
  return (
    <div id="J-cen-time-wrap" className={this.props.className} style={{width:this.props.styleWidth || '273px'}}>
      <div className='time-input' onClick={this.inputClickHandle.bind(this)} style={{width:this.props.styleWidth || '273px'}}>{this.state.defaultTime}</div>
      <div className="J-HsSelect" style={{display : this.state.isShowPop ? 'block' : 'none',width:this.props.styleWidth || '273px'}}>
        <div className="ui-selector unselectable ui-timer in points-ltlb">
          <table cellPadding="0" cellSpacing="0">
            <tbody>
              <tr>
                <th className="hour-head">时</th>
                <th className="minute-head">分</th>
              </tr>
              <tr>
                <td className="hour-body">
                  <div id='hhScroll'>
                    {
                      this.state.setting.hhArr.map((val,index)=>{

                        return (
                          <a key={index} onClick={this.hhClick.bind(this,index)} href="javascript:void(0);" className={val.act==true?'hour selected' : 'hour'}>{val.hh}</a>
                        )
                      })
                    }
                  </div>
                </td>
                <td className="minute-body">
                  <div>
                    {
                      this.state.setting.mmArr.map((val,index)=>{
                        return (
                          <a key={index} onClick={this.mmClick.bind(this,index)} href="javascript:void(0);" className={val.act==true?'minute selected' : 'hour'}>{val.mm}</a>
                        )
                      })
                    }
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>

    </div>
  )
}

})

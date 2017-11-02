import React , {Component,PropTypes} from 'react';
import userCss from './sass/index.scss';
import USER_PIC from './imgs/user-img.png';
import {addEventListener} from '../util/index.jsx';
export default class UserNav extends Component{
  static propTypes = {
    msgCount : PropTypes.number,
    uiClassName : PropTypes.string,

  }

  constructor(props,context){
    super(props,context);
    this.state = this.defaultState;
  }

  get defaultState(){
    return {
      clickTag : false
    }
  }

  _renderMsgTips(){
    if(this.props.msgCount){
      return (
        <span>
          <i className="icon-notice" style={{fontSize : '30px'}}></i>
          <span className="remind-num" id="systemNotificationCount">3</span>
        </span>
      )
    }
  }

  componentDidMount(){
    addEventListener(document,'click',this.clearUserPop.bind(this));

  }
  clearUserPop(){
    this.setState({
      clickUserTag : false,
      clickTag : false
    })
  }

  resetMsgState(tag,proxy,event){
    proxy.nativeEvent.stopImmediatePropagation();
    if(tag){
      this.setState({
        clickUserTag : !this.state.clickUserTag,
        clickTag : false
      });
      return;
    }
    this.setState({
      clickTag : !this.state.clickTag,
      clickUserTag : false
    })
  }




  render(){
    return (
      <div className='user-nav-wrap' onClick={(proxy)=>{proxy.nativeEvent.stopImmediatePropagation()}}>
        <div className="remind" onClick={this.resetMsgState.bind(this,false)}>
          <i className="icon-notice" style={{"fontSize": "18px"}}></i><i style={{"fontSize": "14px","fontStyle": "normal","marginLeft": "5px"}}>通知</i>
          <span className="remind-num" style={{display : this.props.msgCount ? 'block' : 'none'}}>{this.props.msgCount}</span>
          <div className="drop-box" id="systemNotification" style={{display : this.state.clickTag ? 'block' : 'none'}}>
            <ul className="notice-ul"><li className="unread" style={{background:"transparent"}}><div className="notice-content"><p style={{width : '320px',textAlign: 'center'}}>无新消息通知</p></div></li></ul>
            <div className="more" style={{background:"#fff"}} onClick={()=>{window.open('/message/system')}}>+ 查看所有通知</div>
          </div>
        </div>
        <div className="J-logged show-right-top-tips" onClick={this.resetMsgState.bind(this,true)}>
          <img src={USER_PIC} alt="头像"/>
            <ul className="profile" id="rightTopTips" style={{display : this.state.clickUserTag ? 'block' : 'none'}}>
              <a href="/order/list">
                <li className="my-order right-top-tip">
                  <i className="icon-order" style={{fontSize : '20px'}}></i>
                  我的订单
                </li>
              </a>

              <a href="/asset/account">
                <li className="fund-account right-top-tip">
                  <i className="icon-card" style={{fontSize : '15px'}}></i>
                  资金账户
                </li>
              </a>

              <a href="/account/mine">
                <li className="my-account right-top-tip current">
                  <i className="icon-account" style={{fontSize : '19px'}}></i>
                  我的帐户
                </li>
              </a>

              <a href="/service/booking">
                <li className="right-top-tip">
                  <i className="icon-7" style={{fontSize : '17px'}}></i>
                  服务中心
                </li>
              </a>

              <a href="javascript:showUpdPwd()">
                <li className="change-password right-top-tip">
                  <i className="icon-lock" style={{fontSize : '18px'}}></i>
                  更改密码
                </li>
              </a>

              <a href="/cloud/logout">
                <li className="log-off right-top-tip">
                  <i className="icon-quit" style={{fontSize : '15px'}}></i>
                  退出登录
                </li>
              </a>
            </ul>
          </div>
        </div>
      )
    }
  }

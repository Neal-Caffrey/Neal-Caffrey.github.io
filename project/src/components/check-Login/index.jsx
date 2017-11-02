import React, {
  Component,
  PropTypes
} from 'react';
import Msg from 'components/ui-msg/index.jsx';
export default class UICheckLogin extends Component{
  constructor(props,context){
    super(props,context);
    this.state = this.checkStatus;

  }
  get checkStatus() {
    let states = {};
    if(this.props.dataSource && this.props.dataSource.xhr) {
      let xhr = this.props.dataSource.xhr;
      if(xhr.status ==302 || xhr.status == 420 || xhr.status ==421 || xhr.status == 404){
          states.isLogout = true;
          switch(xhr.status) {
              case 302:
                states.msg = '服务器异常，请重新登录，如有疑问，请联系云地接客服：400-060-0766';
                break;
              case 420:
                states.msg = '会话已失效，请重新登录！';
                break;
              case 421:
                states.msg = '您的账号已被封禁，如有疑问，请联系云地接客服：400-060-0766';
                break;
              case 404:
                states.msg = '服务器异常，请重新登录，如有疑问，请联系云地接客服：400-060-0766';
                break;
          }
      } else {
          states.isLogout = false;
          states.msg = `请求发送失败 ${xhr.status}`;
      }
    }
    return states;
  }
  _handle() {
    this.props.callBack && this.props.callBack();
  }
  _goTologin() {
    window.location.href='/';
  }
  _renderResult() {
    if(this.state.isLogout === true) {
       let attr = {
        showFlag: true,
        showType: 'alert', // info alert confirm
        backHandle: this._goTologin.bind(this)
      };
      return (
          <Msg initData={attr}>
            <p>{this.state.msg}</p>
          </Msg>
      )
    } else if(this.state.isLogout === false) {
      let attr = {
        showFlag: true,
        showType: 'alert', // info alert confirm
        backHandle: this._handle.bind(this)
      };
      return (
          <Msg initData={attr}>
            <p>{this.state.msg}</p>
          </Msg>
      )
    }
    return null;
    
  }

  render(){
    return (
      <div>
       {this._renderResult()}
       </div>
    )
  }
}

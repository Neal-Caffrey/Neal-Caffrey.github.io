import React,{Component,PropTypes} from 'react';
import { connect } from 'react-redux';
import { appInfo } from "ACTIONS/headerAction.js";
import Storage from 'local-Storage/dist/main.js';
import ApiConfig from 'widgets/apiConfig/index.js';
import Logo from 'components/ui-logo/index.jsx';
import NavBar from 'components/ui-nav/index.jsx';
import UserNav from 'components/ui-user-nav/index.jsx';
import YdjAjax from 'components/ydj-Ajax/index.js';
import Msg from 'components/ui-msg/index.jsx';

import HeaderCss from './sass/index.scss';

const APPINFO = ApiConfig.storageKey.hotel_app_info;

class Header extends Component{
  static propTypes = {
    active : PropTypes.number,
    simple : PropTypes.bool,
  }
  constructor(props,context){
    super(props,context);
    this.state = this.defaultState;
    this.storage;
    // this.getInfo();
  }
  componentWillMount() {
    this.getInfo();
  }

  get storage(){
    return this._storage = new Storage;
  }

  get defaultState(){
    return {
      menuInfo : {},
      messageInfo : {},
      agentInfo : {}
    };
  }

  get active(){
    return this.props.active || 0;
  }

  get messageInfo(){
    return this.state.messageInfo;
  }

  get menuInfo(){
    return this.state.menuInfo || {};
  }

  get agentInfo(){
    return this.state.agentInfo;
  }

  getInfo() {
    let opt = {
      url: ApiConfig.appInfo,
      successHandle: (res) => {
        let _state = {};
        if (res.status == 200) {
          Object.assign(_state, res.data);
          this.props.dispatch(appInfo(_state));
          this.storage.set(APPINFO, _state);
        }
        this.setState(_state);
      },
      ...this._handleErrors
    }
    new YdjAjax(opt);
  }

  get _handleErrors() {
    let handles = {
      failedHandle: (res) => {
        // debugger
        let _state = {
          isAlert: true,
          alertMsg: {
            loginErr: false,
            msg: res.message
          }
        };
        this.setState(_state);
      },
      errorHandle: (xhr, errorType, error, errorMsg) => {
        // debugger
        let _state = {
          isAlert: true,
          alertMsg: errorMsg
        };
        this.setState(_state);
      }
    };
    return handles;
  }

  // get infoQueryAttr() {
  //   return {
  //       queryParam: {
  //         url : ApiConfig.appInfo,
  //       },
  //       name: '用户信息',
  //     }
  // }

  // getInfo() {
  //   return (
  //     <YdjAjax queryAttr={this.infoQueryAttr} successHandle={this._cbInfoSuccess.bind(this)}/>
  //   )
  // }

  // _cbInfoSuccess(res) {
  //   let _state = {};
  //   if (res.status == 200) {
  //     Object.assign(_state, res.data);
  //     this.props.dispatch(appInfo(_state));
  //     this.storage.set(APPINFO, _state);
  //   }
  //   this.setState(_state);
  // }

  render(){
    return (
      <div className='ui-header'>
        <Logo />
        {
          this.menuInfo.headMenu != undefined && 
          <NavBar
          active={this.active}
          info={this.props.simple ? this.agentInfo : this.menuInfo.headMenu1}
          simple={this.props.simple}
          />
        }
        {
          this.menuInfo.navbar != undefined &&
          <UserNav 
          message={this.messageInfo}
          menu={this.menuInfo.navbar}
          agent={this.agentInfo}/>
        }
        {/*this.getInfo()*/}
        {
          (() => {
              let res = [];
              let that = this;
              if (that.state.isAlert) {
                let attr = {
                  showFlag: true,
                  showType: 'alert', // info alert confirm
                  backHandle: () => {
                    // debugger
                    if (that.state.alertMsg.loginErr) {
                      window.location.href = '/';
                      return;
                    }

                    let _state = {  
                      isAlert: false,
                      alertMsg: {}
                    };
                    that.setState(_state);
                  }
                };
                res.push(<Msg initData = {attr}><p>{that.state.alertMsg.msg}</p></Msg>)
              }
              return res;
            })()
        }
      </div>
    )
  }
};

const mapStateToProps = (state) => {
  return {
    header: state.header
  }
}

export default connect(mapStateToProps)(Header);

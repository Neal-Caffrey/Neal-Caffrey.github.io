/**
 * Created by kepeng on 2017/09/29 00:08
 * 注：时间紧迫，保险起见，此header目前仅用于账单详情页面
 * 用途：通过header里“通知”的消息进入账单详情页面后，需要让通知里的该项消息变为已读，
 * 因此需要刷新header里的message信息，所以需要在特定的时刻重新拉取info接口，故新建此js
 */

import React,{Component,PropTypes} from 'react';
import { connect } from 'react-redux';
import { appInfo,reLoad } from "ACTIONS/headerAction.js";
import Storage from 'local-Storage/dist/main.js';
import ApiConfig from 'widgets/apiConfig/index.js';
import Logo from 'components/ui-logo/index.jsx';
import NavBar from 'components/ui-nav/index.jsx';
import UserNav from 'components/ui-user-nav/index.jsx';
// import YdjAjax from 'components/ydj-Ajax/index.jsx';
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
    this._getInfo();
  }

  componentWillReceiveProps(nextProps) {
      if(nextProps.reLoad){
          this._getInfo();
      }
  }

  get storage(){
    return this._storage = new Storage;
  }

  get defaultState(){
    return {
      menuInfo : {},
      messageInfo : {},
      agentInfo : {},

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
  get infoQueryAttr() {
    return {
        queryParam: {
          url : ApiConfig.appInfo,
        },
        name: '用户信息',
      }
  }

    _getInfo() {
        let opt = {
            url: ApiConfig.appInfo,
            type: 'GET',
            // data: searchData,
            successHandle: (res) => {
                let _state = {};
                if (res.status == 200) {
                  Object.assign(_state, res.data);
                  window.__AGENT_INFO = res.data.agentInfo;
                  this.props.dispatch(reLoad(false));
                  this.props.dispatch(appInfo(_state));
                  this.storage.set(APPINFO, _state);
                  this.props.headerSuccess && this.props.headerSuccess(res);

                }
                this.setState(_state);
            },
            ...this.errHandler
        }
        new YdjAjax(opt);
    }
    get errHandler() {
        return {
            failedHandle: (res) => {

                this.setState({
                    isAlert: true,
                    alertMsg: {
                        msg: res.message
                    },
                    sending: false,
                })
            },
            errorHandle: (xhr, errorType, error, errorMsg) => {

                this.setState({
                    isAlert: true,
                    alertMsg: errorMsg,
                    sending: false,
                })
            }
        }
    }
    _showMsg() {
        if (this.state.isAlert) {
            let attr = {
                showFlag: true,
                showType: 'alert', // info alert confirm
                backHandle: () => {
                    if (this.state.alertMsg.loginErr) {
                        window.location.href = '/';
                    }

                    this.setState({
                        isAlert: false
                    })

                }
            };
            return (
                <Msg initData={attr}>
                    <p>{this.state.alertMsg.msg}</p>
                </Msg>
            )
        }
        return null;
    }

  _cbInfoSuccess(res) {
    let _state = {};
    if (res.status == 200) {
      Object.assign(_state, res.data);
      window.__AGENT_INFO = res.data.agentInfo;
      this.props.dispatch(appInfo(_state));
      this.storage.set(APPINFO, _state);
      this.props.headerSuccess && this.props.headerSuccess(res)
    }
    this.setState(_state);
  }

  render(){
    return (
      <div className='ui-header'>
        <Logo loginImg={this.agentInfo.logoImg}/>
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
        {this._showMsg()}
      </div>
    )
  }
};

const mapStateToProps = (state) => {
  return {
    header: state.header,
    reLoad: state.header.reLoad
  }
}

export default connect(mapStateToProps)(Header);

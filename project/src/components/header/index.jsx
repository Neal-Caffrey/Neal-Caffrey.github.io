import React,{Component,PropTypes} from 'react';
import { connect } from 'react-redux';
import { appInfo } from "ACTIONS/headerAction.js";
import Request from 'local-Ajax/dist/main.js';
import Storage from 'local-Storage/dist/main.js';
import ApiConfig from 'widgets/apiConfig/index.js';
import Logo from 'components/ui-logo/index.jsx';
import NavBar from 'components/ui-nav/index.jsx';
import UserNav from 'components/ui-user-nav/index.jsx';
import HeaderCss from './sass/index.scss';
import YdjAjax from 'components/ydj-Ajax/index.jsx';

const APPINFO = ApiConfig.storageKey.hotel_app_info;

class Header extends Component{
  static propTypes = {
    active : PropTypes.number,
  }
  constructor(props,context){
    super(props,context);
    this.state = this.defaultState;
    this.request;
    this.storage;
    this.getInfo();
  }

  get request(){
    return this._request = new Request;
  }

  get storage(){
    return this._storage = new Storage;
  }

  get defaultState(){
    const {active } = this.props;
    return {
      active : active || 0,
      menuInfo : {},
      messageInfo : {},
      agentInfo : {}

    };
  }

  get active(){
    return this.state.active;
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

  // getInfo() {

  //   let _state = {};

  //   let opt = {
  //     url: ApiConfig.appInfo,
  //   };
  //   this._request.ajax(opt)
  //     .then((res) => {
  //       if (res.status == 200) {
  //         Object.assign(_state, res.data);
  //         this.props.dispatch(appInfo(_state));
  //         this.storage.set(APPINFO, _state);
  //       }
  //       this.setState(_state);
  //     }, (xhr, err) => {
  //       window.location.href = '/';
  //     });
  // }
  // 
  getInfo() {
    return (
      <YdjAjax queryAttr={this.infoQueryAttr} successHandle={this._cbInfoSuccess.bind(this)}/>
    )
  }

  _cbInfoSuccess(res) {
    let _state = {};
    if (res.status == 200) {
      Object.assign(_state, res.data);
      this.props.dispatch(appInfo(_state));
      this.storage.set(APPINFO, _state);
    }
    this.setState(_state);
  }

  render(){
    return (
      <div className='ui-header'>
        <Logo />
        {
          this.menuInfo.headMenu != undefined && 
          <NavBar 
          info={this.menuInfo.headMenu} 
          active={this.active} />
        }
        {
          this.menuInfo.navbar != undefined &&
          <UserNav 
          message={this.messageInfo}
          menu={this.menuInfo.navbar}
          agent={this.agentInfo}/>
        }
        {this.getInfo()}
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

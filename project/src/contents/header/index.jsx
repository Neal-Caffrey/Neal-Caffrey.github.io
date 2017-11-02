import React,{Component,PropTypes} from 'react';
import { connect } from 'react-redux';
import { appInfo } from "ACTIONS/headerAction.js";
import Storage from 'local-Storage/dist/main.js';
import ApiConfig from 'widgets/apiConfig/index.js';
import Logo from 'components/ui-logo/index.jsx';
import NavBar from 'components/ui-nav/index.jsx';
import UserNav from 'components/ui-user-nav/index.jsx';
import YdjAjax from 'components/ydj-Ajax/index.jsx';

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
  get infoQueryAttr() {
    return {
        queryParam: {
          url : ApiConfig.appInfo,
        },
        name: '用户信息',
      }
  }

  getInfo() {
    return (
      <YdjAjax queryAttr={this.infoQueryAttr} successHandle={this._cbInfoSuccess.bind(this)}/>
    )
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
        {
          (this.props.header && this.props.header.info || this.agentInfo) ? <Logo loginImg={this.agentInfo.logoImg}/> : null
        }

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

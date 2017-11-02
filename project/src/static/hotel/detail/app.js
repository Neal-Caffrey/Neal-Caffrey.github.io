import React, {
  Component
} from 'react';
import {
  Affix
} from 'local-Antd';
import {
  _extend,
  _getQueryObjJson
} from 'local-Utils/dist/main.js';
import {
  connect
} from 'react-redux';
import Request from 'local-Ajax/dist/main.js';
import ApiConfig from 'widgets/apiConfig';
import Header from 'contents/header/index.jsx';
import Footer from 'contents/footer/index.jsx';
import YdjAjax from 'components/ydj-Ajax/index.jsx';
import BaseCss from 'local-BaseCss/dist/main.css';
import HotelDetail from 'components/ui-hotel-detail/index.jsx';
import Loading from 'components/ui-loading/index.jsx';
import Msg from 'components/ui-msg/index.jsx';
import UiConsult from "components/ui-consult/index.jsx";

import 'components/globleCss/index.scss';
import '../sass/index.scss';
import UISwiper from 'components/ui-swiper/index.v2.jsx';
import './sass/index.scss';
const ISShowConsult = ((domain)=>{
  let reg = /www/;
  return reg.test(domain);
})(document.domain);
class App extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = this.defaultState;
  }
  componentWillMount() {
    if (this.props.header.info) {
      this._getBaseData();
    }
  }
  componentWillReceiveProps(nextProps) {
    if (!this.props.header.info && nextProps.header.info) {
      this._getBaseData();
    }
  }
  get defaultState() {
    return {
      isLoading: false,
      isShowAblum: false,
      hotelId: _getQueryObjJson().hotelId,
      baseInfo: false,
    };
  }
  get request() {
    let request = new Request();
    return request;
  }
  get baseQueryAttr() {
    return {
      queryParam: {
        url: ApiConfig.hotelDetail,
        // url: 'http://api6-dev.huangbaoche.com/hotel/v1.0/cla/hoteldetail',
      },
      name: '酒店信息',
    }
  }
  _getBaseData() {
    this.setState({
      isLoading: true,
    })
  }

  _cbBaseSuccess(res) {
    let states = {
      isLoading: false,
    };
    if (res.status === 200) {
      states.baseInfo = res.data ? res.data : false;
      states.baseInfo.hotelVo && states.baseInfo.hotelVo.starRating && (states.baseInfo.hotelVo.starRating = states.baseInfo.hotelVo.starRating);
      this.setState(states);
    }
  }

  _handle() {

  }
  _renderOthers() {
    let msgTxt = '';
    if (!this.state.hotelId) {
      msgTxt = '酒店ID错误';
      let attr = {
        content: msgTxt,
        showFlag: true,
        showType: 'alert', // info alert confirm
        backHandle: this._handle.bind(this)
      };
      return (
        <Msg initData={attr}><p>{attr.content}</p></Msg>
      )
    } else if (this.state.isLoading) {
      return (<Loading />)
    }
  }
  _cbDoSomething(info) {
    if (info.type == undefined) {
      return;
    }

    this.ablumInfo = {
      index: info.index
    };

    switch (info.type) {
      case 'showAblum':
        this.setState({
          isShowAblum: true,
        });
        break;
      case 'hideAblum':
        this.setState({
          isShowAblum: false
        });
        break;
    }
  }
  render() {
    return (
      <div id='ui-wrap' className="scrollable-container" ref={(node) => {this.container = node;}}>
        <Header active={5} />
        <div className='ui-main ui-main-ac ui-fixed-footer'>
          { this.state.hotelId && !this.state.isLoading && this.state.baseInfo?
            <HotelDetail hotelId={this.state.hotelId} info={this.state.baseInfo} wrap={this.container} doSomething={this._cbDoSomething.bind(this)}/> : this._renderOthers()
          }
          {
            this.state.isShowAblum?
              <UISwiper imgs={this.state.baseInfo.hotelImages} index={this.ablumInfo.index} handle={this._cbDoSomething.bind(this)} show={this.state.isShowAblum}
              /> : null
          }
          {this.state.isLoading?<YdjAjax queryAttr={this.baseQueryAttr} successHandle={this._cbBaseSuccess.bind(this)} bErrorHandle={()=>{this.setState({isLoading: false,})}} queryData={{hotelId: this.state.hotelId}} />:null}
          </div>
        {ISShowConsult ? <UiConsult /> : null}
        {ISShowConsult ? <Footer /> : null}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    header: state.header
  }
}

export default connect(mapStateToProps)(App);

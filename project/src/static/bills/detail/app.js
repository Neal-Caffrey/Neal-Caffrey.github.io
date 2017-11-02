import React, {
  Component
} from 'react';
import {
  connect
} from 'react-redux';

import Header from 'contents/header/indexReload.jsx';//注：此页面需要刷新header里的message信息，所以需要重新拉取info接口，故使用indexReload;
import LeftMenu from 'contents/leftMenu/index.jsx';
import Footer from 'contents/footer/index.jsx';
import Loading from 'components/ui-loading/index.jsx';
import BillMoney from './contents/billMoney/index.jsx';
import BaseCss from 'local-BaseCss/dist/main.css';
import GlobleCss from 'components/globleCss/index.scss';
import YdjAjax from 'components/ydj-Ajax/index.jsx';
import UiConsult from "components/ui-consult/index.jsx";
// import swiperCss from './sass/swiper.scss';
import indexCss from './sass/detail.scss';
import Msg from 'components/ui-msg/index.jsx';
import BillTable from './contents/billTable/index.jsx';
import {reLoad} from "ACTIONS/headerAction.js";
import OrderStatusSelect from './contents/statusSelect/index.jsx';
import {
  _getQueryObjJson
} from 'local-Utils/dist/main.js';

const ISShowConsult = ((domain)=>{
  let reg = /www/;
  return reg.test(domain);
})(document.domain);
import {
  removeAlert
} from './action/index.js';
import ApiConfig from 'widgets/apiConfig/index.js';
class App extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = this.defaultState;
  }
  componentWillMount() {
    if (this.props.header.info) {
       debugger
      this.userInfo = this.props.header.info;
      this._formData = this.formInit;
      this._formSearchData = this.formTwoInit;
      this.setState({
        formData: this._formData,
        formSearchData:this._formSearchData,
        leftMenuList: this.userInfo.menuInfo.leftMenu_a ? this.userInfo.menuInfo.leftMenu_a : []
      }, () => {
        this._getBillList();
      })
    }
  }
  componentWillReceiveProps(nextProps) {
    if (!this.props.header.info && nextProps.header.info) {
      this.userInfo = nextProps.header.info;
      this._formData = this.formInit;
      this._formSearchData = this.formTwoInit;
      this.setState({
        formData: this._formData,
        formSearchData:this._formSearchData,
        leftMenuList: this.userInfo.menuInfo.leftMenu_a ? this.userInfo.menuInfo.leftMenu_a : []
      }, () => {

        this._getBillList();
      })
    }
  }
  get formInit() {
    let state = {
    };
    state.billNo = _getQueryObjJson().billNo;
    state.merchantNo = this.userInfo.agentInfo.agentId;
    return state;
  }
  get formTwoInit(){

      let defaultType ='';

     // let defaultType =1;
    let state = {
       settleSource:defaultType ,
       searchType:1,
       limit: 10,
       offset: 0
    };
    state.billNo = _getQueryObjJson().billNo;
    return state;
  }
  get defaultState() {
    return {
      data:  {},
      channelInfo: {},
      loading: false,
      resetForm: false,
      leftMenuList: [],
      requestIsOneSuccess:false,
      requestIsTwoSuccess:true,
      pagination: {}
    };
  }
  get orderStatus() {
    // this.state.formSearchData
      return [{
          settleSource: 3,
          desc: "用车订单",
          // show:true,
          // active:true,
          show: this.state.data.orderNum>=1?true:false,
          active:this.state.formSearchData&&this.state.formSearchData.settleSource==3?true:false,
        }, {
          settleSource: 2,
          desc: "酒店订单",
           // show:true,
          show: this.state.data.hotelOrderNum>=1?true:false,
          active:this.state.formSearchData&&this.state.formSearchData.settleSource==2?true:false,
        }, {
          settleSource: 4,
          desc: "订餐订单",
           // show:true,
          show: this.state.data.fxOrderNum>=1?true:false,
          active:this.state.formSearchData&&this.state.formSearchData.settleSource==4?true:false,
        }
      ]
    }
    get listQueryAttr() {
        return {
          queryParam: {
            url: ApiConfig.billDetail,
            // url: `http://api6-dev.huangbaoche.com/trade/v1.0/cla/hotel/list`,
          },
          name: '账单结算详情',
        }
      }
    get listQueryAttrSorders() {
        return {
          queryParam: {
            url: ApiConfig.billSearch,
            // url: `http://api6-dev.huangbaoche.com/trade/v1.0/cla/hotel/list`,
          },
          name: '账单查询',
        }
      }
    _cbListSuccess(res) {
        let states = {
          loading: false,
        };
        if (res.status === 200) {
          let defaultType;
          states.requestIsOneSuccess = true;
          states.requestIsTwoSuccess = false;
          states.data = res.data.detailBill;
          states.channelInfo = res.data.channelInfo;
          states.dateAll = res.data;
          this.setState(states);
          //此刻header里的使此条消息应该变为已读，因此需要重新拉取header信息
          this.props.dispatch(reLoad(true));
          // this._formSearchData = this.formTwoInit;
          if(res.data.detailBill.orderNum){
              defaultType=3;
          }else if(res.data.detailBill.hotelOrderNum){
              defaultType=2;
          }else if(res.data.detailBill.fxOrderNum){
              defaultType=4;
          }
          this._formSearchData.settleSource = defaultType;
          debugger;
          this.setState({
            formSearchData:this._formSearchData,
            orderStatusList: this.orderStatus,
            loading: true
          })
        }
      }
    _handleError(res){
        if(res.status == 60030001){
            window.location.href = './list.html';
        }
    }
    _cbSearchSuccess(res) {
        let states = {
          loading: false,
        };
        if (res.status === 200) {
          // states.requestIsOneSuccess=false;
          states.pagination = {
            limit: this._formSearchData.limit,
            total: res.data.totalSize,
            current: this._getPage(this._formSearchData.offset)
          };
          states.SearchData = res.data.resultBean;
          states.dateSearchAll = res.data;
          this.setState(states);
        }
    }
    _getPage(offset) {
        let page = 1;
        if (offset) {
          page = Math.floor(offset / this._formSearchData.limit) + 1
        }
        return page;
      }
    _getBillList() {
        this.setState({
            loading: true,
            formSearchData: this._formSearchData
          });
    }
    _changeOrderForm(type, data, searchFlag) {
        if (!type) {
          return;
        }
        switch (type) {
            case 'pageIndex':
                this._formSearchData.offset = (data.pageIndex - 1) * this._formSearchData.limit;
                this._getBillList();
                break;
            case 'status':
                if (data.status) {
                    this._formSearchData.settleSource = data.status;
                } else {
                    this._formSearchData.settleSource && (delete this._formSearchData.settleSource);
                }
                this._getBillList();
                break;
        }
    }
    render() {
        return (
          <div id='ui-wrap'>
           <Header active={-1}/>
            <div className="wrapper ui-main ui-order-list ui-fixed-footer">
                <LeftMenu dataSource={this.state.leftMenuList} curMenuUrl={`webapp/bills/list.html`}/>
                <div className="detail-cont">
                  <h2>账单详情</h2>
                  <BillMoney  dataSource={this.state.data} channelInfo={this.state.channelInfo} />
                  <OrderStatusSelect  moneySource ={this.state.data}  dataSource={this.orderStatus}  pageSource={this.state.formSearchData}  changeHandle={this._changeOrderForm.bind(this)}/>
                  <BillTable dataSource={this.state.SearchData} pageSource={this.state.formSearchData} pagination={this.state.pagination} changeHandle={this._changeOrderForm.bind(this)} loading={this.state.loading}/>
                </div>
            </div>

            {this.state.loading&&this.state.requestIsTwoSuccess?<YdjAjax queryAttr={this.listQueryAttr} successHandle={this._cbListSuccess.bind(this)} queryData={this.state.formData} bErrorHandle={this._handleError.bind(this)} />:null}
            {this.state.loading&&this.state.requestIsOneSuccess?<YdjAjax queryAttr={this.listQueryAttrSorders} successHandle={this._cbSearchSuccess.bind(this)} queryData={this.state.formSearchData} />:null}
            {ISShowConsult ? <UiConsult /> : null}
          </div>
        )
    }
}

const mapStateToProps = (state) => {
  return {
    renderAccount: state.main.renderAccount,
    header: state.header
  }
}

export default connect(mapStateToProps)(App);

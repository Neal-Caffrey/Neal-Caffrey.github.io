import React, {
  Component,
  PropTypes
} from 'react';
import {
  connect
} from 'react-redux';
import {
  _extend,
  _getQueryObjJson
} from 'local-Utils/dist/main.js';
import Header from 'contents/header/index.jsx';
import Footer from 'contents/footer/index.jsx';
import Loading from 'components/ui-loading/index.jsx';
import LeftMenu from 'contents/leftMenu/index.jsx';
import BaseCss from 'local-BaseCss/dist/main.css';
import GlobleCss from 'components/globleCss/index.scss';
import OrderSearch from './contents/searchForm/index.jsx';
import BillsTable from './contents/billsTable/index.jsx';
import listCss from './sass/list.scss';
import Msg from 'components/ui-msg/index.jsx';
import YdjAjax from 'components/ydj-Ajax/index.jsx';
import UiConsult from "components/ui-consult/index.jsx";
const ISShowConsult = ((domain)=>{
  let reg = /www/;
  return reg.test(domain);
})(document.domain);
import {Row,Col,Input,Button,Icon} from 'local-Antd';
import ApiConfig from 'widgets/apiConfig/index.js';

class App extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = this.defaultState;
  }
  componentWillMount() {
    if (this.props.header.info) {
      // debugger
      this.userInfo = this.props.header.info;
      this._formData = this.formInit;
      this.setState({
        formData: this._formData,
        leftMenuList: this.userInfo.menuInfo.leftMenu_a ? this.userInfo.menuInfo.leftMenu_a : []
      }, () => {
        this._getBillList();
      })
    }
  }
  componentWillReceiveProps(nextProps) {
    if (!this.props.header.info && nextProps.header.info) {
      // debugger
      this.userInfo = nextProps.header.info;
      this._formData = this.formInit;
      this.setState({
        formData: this._formData,
        leftMenuList: this.userInfo.menuInfo.leftMenu_a ? this.userInfo.menuInfo.leftMenu_a : []
      }, () => {
        console.log('a');
        this._getBillList();
      })
    }
  }
  get formInit() {
    let state = {
      limit: 10,
      offset: 0
    };
    state.merchantNo = this.userInfo.agentInfo.agentId;
    return state;
  }
  get defaultState() {
    return {
      data:   [],
      loading: false,
      resetForm: false,
      pagination: {},
      leftMenuList: [],
    };
  }

get listQueryAttr() {
    return {
      queryParam: {
        url: ApiConfig.billList,
      },
      name: '结算账单列表',
    }
  }
 _cbListSuccess(res) {
     debugger
    let states = {
      loading: false,
    };
    if (res.status === 200) {
      states.data = res.data.resultBean;
      // states.dateAll = res.data;
      states.pagination = {
        limit: this._formData.limit,
        total: res.data.totalSize,
        current: this._getPage(this._formData.offset)
      };
      this.setState(states);
    }
   }
  _getPage(offset) {
    let page = 1;
    if (offset) {
      page = Math.floor(offset / this._formData.limit) + 1
    }
    return page;
  }
  _getBillList() {
    this.setState({
      loading: true,
      formData: this._formData
    });
  }
  _changeBillForm(type, data, searchFlag) {
    if (!type) {
      return;
    }
    switch (type) {
      case 'pageIndex':
        this._formData.offset = (data.pageIndex - 1) * this._formData.limit;
        this._getBillList();
        break;
      case 'status':
        if (data.status) {
          this._formData.orderStatus = data.status;
        } else {
          this._formData.orderStatus && (delete this._formData.orderStatus);
        }
        this._formData.offset = 0;
        this._getBillList();
        break;
      case 'form':
        let pageSize = this._formData.limit;
        let merchantNo  = this._formData.merchantNo;
        this._formData = {
          ...data,
          offset: 0,
          limit: pageSize,
          merchantNo: merchantNo
        }

        if (searchFlag) {
          this._getBillList();
        }
        break;
    }
  }
  render() {
    return (
      <div id='ui-wrap'>
        <Header active={-1}/>
        <div className="wrapper ui-main ui-order-list ui-fixed-footer">
            <LeftMenu dataSource={this.state.leftMenuList} curMenuUrl={`webapp/bills/list.html`}/>
            <div className="list-cont">
              <h2>账单管理</h2>
             <OrderSearch resetForm={this.state.resetForm} changeHandle={this._changeBillForm.bind(this)} loading={this.state.loading}/>
             <BillsTable dataSource={this.state.data}  pageSource={this.state.pagination} changeHandle={this._changeBillForm.bind(this)} loading={this.state.loading}/>
            </div>
        </div>
        {this.state.loading?<YdjAjax queryAttr={this.listQueryAttr} successHandle={this._cbListSuccess.bind(this)} queryData={this.state.formData} />:null}
           {ISShowConsult ? <UiConsult /> : null}
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

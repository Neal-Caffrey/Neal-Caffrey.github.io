import React, {
    Component,
    PropTypes
} from 'react';

import {
    Row,
    Col,
    Input,
    Button,
    Icon
} from 'local-Antd';
import ApiConfig from 'widgets/apiConfig/index.js';

import {
    connect
} from 'react-redux';

import {
    _extend,
    _getQueryObjJson
} from 'local-Utils/dist/main.js';

import Header from 'contents/header/index.jsx';
import Footer from 'contents/footer/index.jsx';
import YdjAjax from 'components/ydj-Ajax/index.jsx';
import LeftMenu from 'contents/leftMenu/index.jsx';

import DatePickerGroup from 'components/ui-date-picker/index.jsx';
// import ListPage from './contents/listPage/index.jsx';

import BillingInstruction from './contents/billingInstructions/index.jsx';
import SearchBar from './contents/searchBar/index.jsx';
import InvoiceList from './contents/invoiceList/index.jsx';
import Msg from 'components/ui-msg/index.jsx';
import Storage from 'local-Storage/dist/main.js';

import BaseCss from 'local-BaseCss/dist/main.css';
import GlobleCss from 'components/globleCss/index.scss';
import BaseHotelCss from '../sass/index.scss';
import './sass/index.scss';

const ISShowConsult = ((domain)=>{
    let reg = /www/;
    return reg.test(domain);
})(document.domain);

class App extends Component {

    constructor(props, context) {
        super(props, context);
        this.storage;
        this.state = this.defaultState;
        this.cacheData();
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
                this._getOrderList();
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
                this._getOrderList();
            })
        }
    }

    get formInit() {
        let state = {
            limit: 5,
            offset: 0,
        };
        state.orderChannel = this.userInfo.agentInfo.agentId;
        if (this.userInfo.agentInfo.agentUserType == 1) {
            state.opId = this.userInfo.agentInfo.agentUserId;
        }
        return state;
    }

    get defaultState() {
        return {
            data: [],
            isOnOrderError: false,
            loading: false,
            resetForm: false,
            pagination: {},
            leftMenuList: [],
            isSelectShow: false , //控制订单类型的选择下拉列表是否显示
            orderType: '用车订单' , //控制选择的订单类型是什么
            ok: 'ok', //控制选中的订单
            selectOrderType : ''
        };
    }

    cacheData(){

    }

    // 初始化storage
    get storage() {
        this._storage = new Storage();
    }

    _getOrderList() {
        this.lastFormDate = this._formData;
        this.setState({
            loading: true,
            formData: this._formData
        });
    }

    render() {
        return (
            <div id='ui-wrap'>
                <Header active={-1}/>
                <div className="ui-main ui-order-list ui-fixed-footer">
                    <LeftMenu dataSource={this.state.leftMenuList} curMenuUrl={`webapp/invoice/apply.html`}/>
                    <div className="list-cont">
                        <h2>发票申请</h2>
                        <BillingInstruction/>
                        <SearchBar/>
                        <InvoiceList/>
                        {/*<ListPage/>*/}
                    </div>
                </div>
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

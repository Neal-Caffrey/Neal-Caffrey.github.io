import React, {Component} from "react";
import { connect } from 'react-redux';

import ApiConfig from 'widgets/apiConfig/index.js';
import YdjAjax from 'components/ydj-Ajax/index.js';
import DatePickerGroup from 'components/ui-date-picker/index.jsx';
import Msg from 'components/ui-msg/index.jsx';
import Loading from 'components/ui-loading/index.jsx';
import {updateResult} from '../../action/index.js';


import {Select, Button} from 'local-Antd';
const Option = Select.Option;

import {
  _extend
} from 'local-Utils/dist/main.js';

import './sass/index.scss';

class SearchBar extends Component {
    constructor(props,context){
        super(props,context);
        this.state = this.defaultState;
        this.formData = this.defaultFormData;
    }

    componentWillMount() {
        if(this.props.header.info) {
            this.agentId = this.props.header.info.agentInfo.agentId;
        }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.header.info) {
            this.agentId = nextProps.header.info.agentInfo.agentId;
            if(this._checkPageChange(nextProps)) {
                // page 变更
                let offset = nextProps.result.searchData.offset
                this._search(true, offset);
            }
        }
    }

    get defaultState() {
        return {
            changed: true,
            type: 1,
            dateVal: []
        };
    }

    get defaultFormData() {
        
        return {
            type: 1 ,
            offset: 0,
            limit: 100,
            current: 1,
        };
    }

    _checkPageChange(props){
        
        let last = this.props
        if(!last.result.searchData.offset && props.result.searchData.offset) {
            return true;
        }
        if(last.result.searchData.offset && (last.result.searchData.offset != props.result.searchData.offset)) {
            return true;
        }
        return false;
    }
    //选择时间的处理函数
    _selectDate(dates, dataStrings){
        
        console.log(dataStrings[0],dataStrings[1]);
        if(!this.formData.type) {
            this.formData = this.defaultFormData;
        }
        this.formData.serviceTimeStart = dataStrings[0];
        this.formData.serviceTimeEnd = dataStrings[1];
        this.setState({
            changed: true,
        });
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


    _search(pageFlag, offset) {
        
        let searchData = _extend({}, this.props.result.searchData, {
            agentId : this.agentId
        }, this.formData);
        if(pageFlag) {
            searchData = _extend({}, this.props.result.searchData, {
                agentId : this.agentId,
                offset: offset
            });
        } 
        
        this.setState({
            sending: true
        });
        let opt = {
            url: ApiConfig.invoiceShenQing,
            type: 'GET',
            data: searchData,
            successHandle: (res) => {
                
                // 同步订单列表及查询条件
                let result = {
                    searchData: searchData,
                    result: res.data
                };

                this.setState({
                    sending: false,
                    changed: false,
                });
                this.props.dispatch(updateResult(result));
                
            },
            ...this.errHandler
        }
        new YdjAjax(opt);
    }

    //重置
    _reset(){
        this.formData = _extend({}, this.defaultFormData);
        this.formData.orderNo = null;
        this.formData.serviceTimeStart = null;
        this.formData.serviceTimeEnd = null;
        this.setState({
            changed: true,
            type: 1,
            dateVal: []
        })
        return true;
    }
    _changeSearchInfo(name, ele) {
        
        let state = {};
        switch(name) {
            case 'type':
                if(!this.formData.type) {
                    this.formData = this.defaultFormData;
                }
                this.formData.type = ele;
                state = {
                    changed: true,
                    type: ele
                };
                break;
            case 'orderNo':
                this.formData = {
                    orderNo: ele.target.value
                }
                state = {
                    changed: true,
                    type: 1
                };
                break;
        }
        this.setState(state)
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
                    if (this.state.alertMsg.cancel) {
                        
                        window.location.href = `/webapp/invoice/list.html`;
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

    render(){
        return(
            <div className="search-bar">
                <form>
                    <Select
                            className="order-type"
                            showSearch={false}
                            placeholder="请选择发票内容"
                            onChange={this._changeSearchInfo.bind(this, 'type')}
                            defaultValue="1"
                            value={`${this.state.type}`}
                        >
                            <Option value="1">用车订单</Option>
                            <Option value="2">酒店订单</Option>
                    </Select>
                    <label>订单完成时间（酒店离店日期）</label>
                    <DatePickerGroup
                        placeholder={['请选择开始日期', '请选择结束日期']}
                        onHandle={this._selectDate.bind(this)}
                        reset={this.state.dateVal}
                        // step={1}
                        disabledDate={61}
                    />

                    <input type="text" className="order-no"  placeholder="请输入订单号查询"  onChange={this._changeSearchInfo.bind(this, 'orderNo')}/>
                    <Button className="sousuo"
                        loading={this.state.sending} 
                        onClick={this._search.bind(this, false)}>搜索</Button>
                    <button className="reset"  type="reset" onClick={this._reset.bind(this)}>重置</button>
                </form>
                {this.state.sending ? <Loading/> : null}
                {this._showMsg()}
            </div>
        )
    }
}

function mapStateToProps(state){
    return {
        header: state.header,
        result: state.result,
        invoiceInfo : state.invoiceList.invoiceList
    }
}

export default connect(mapStateToProps)(SearchBar);

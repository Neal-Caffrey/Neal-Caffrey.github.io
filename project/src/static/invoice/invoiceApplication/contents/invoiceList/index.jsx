import React, {Component} from "react";
import {Table, Checkbox,Row, Col} from "local-Antd";
import { connect } from 'react-redux';
import ApiConfig from 'widgets/apiConfig/index.js';
import YdjAjax from 'components/ydj-Ajax/index.js';
import Input from "components/ui-input/index.jsx";
import Storage from 'local-Storage/dist/main.js';
import Msg from 'components/ui-msg/index.jsx';
import {
  _extend
} from 'local-Utils/dist/main.js';


import {changeSelectInfo} from '../../action/searchBar.js';
import {updateSearchData} from '../../action/index.js';

import './sass/index.scss';
const LIMIT_TOTAL = 100000;
class InvoiceList extends Component {
    constructor(props,context){
        super(props,context);
        this.state = this.defaultState;
    }

    componentWillReceiveProps(nextProps) {
        this.setState(this.defaultState);
    }

    get defaultState() {
    	return {
    		sum: 0,
            selectedAll: 3,
    		selected:{
    			nos: [],
    			orders: [],
    		},
    	}
    }

    get totalFee() {
    	let fee = 0;
    	this.state.selected.orders.map((item, index)=>{
    		if(item && item.amount) {
    			fee += item.amount;
    		}
    	});
    	return fee;
    }
    get selectSingle() {
        let info = {};
        if(this.state.selectedAll == 2) {
            info = {checked: true};
        } else if(this.state.selectedAll == 1) {
            info = {checked: false};
        }
        return info;
    }

    get selectAll() {
        let info = {};
        let value = false;
        if(this.state.selectedAll == 2) {
            info = {checked: true};
        } else if(this.state.selectedAll == 1) {
            info = {checked: false};
        } else {
            if(this.props.result.result.totalSize!=0 && this.props.result.result.totalSize == this.state.selected.nos.length) {
                info = {checked: true};
            } else {
                info = {checked: false};
            }
        }
        return info;
    }

	_changeSelectedList(type, item) {
		let nos,orders,sum,state,selectedAll;
        if(!item) {
            return;
        }

        if(item != 'all') {
            nos = [].concat(this.state.selected.nos);
            orders = [].concat(this.state.selected.orders);
            sum = this.state.sum;
            switch (type) {
                case 'add':
                    if (nos.indexOf(item.orderNo) == -1) {
                        nos.push(item.orderNo);
                        orders.push(item);
                        sum += item.amount;
                    }
                    break;
                case 'remove':
                    let nosIndex = nos.indexOf(item.orderNo);
                    if (nosIndex != -1) {
                        nos.splice(nosIndex, 1);
                        orders.splice(nosIndex, 1);
                        sum -= item.amount;
                    }
                    break;
            }
            state = {
                selectedAll: nos.length == this.props.result.result.totalSize ? 2 : 3,
                selected: {
                    orders,
                    nos
                },
                sum
            };
            this.setState(state);
            return;
        }
		// 全选/全不选
        switch (type) {
            case 'add':
                orders = this.props.result.result.resultBean;
                nos = (()=>{
                    let arr = [];
                    this.props.result.result.resultBean.map((item, index)=>{
                        arr.push(item.orderNo);
                    })
                    return arr;
                })();

                sum = this.props.result.result.totalAmount; 
                selectedAll = 2;
                break;
            case 'remove':
                orders = [];
                nos = [];
                sum = 0;
                selectedAll = 1;
                break;
        }
        
        state = {
            selectedAll,
            selected: {
                orders,
                nos
            },
            sum
        };
        this.setState(state, ()=>{
            this.setState({
                selectedAll: 3
            })
        });
	}

	_format(fmt) {
		var date = new Date();
		var o = {
			"M+": date.getMonth() + 1, //月份
			"d+": date.getDate(), //日
			"h+": date.getHours(), //小时
			"m+": date.getMinutes(), //分
			"s+": date.getSeconds(), //秒
			"q+": Math.floor((date.getMonth() + 3) / 3), //季度
			"S": date.getMilliseconds() //毫秒
		};
		if (/(y+)/.test(fmt))
			fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
		for (var k in o)
			if (new RegExp("(" + k + ")").test(fmt))
				fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		return fmt;
	}

	_getKey() {
		var key;
		var time = this._format('yyyyMMddhhmmssS'); 
		var num = Math.floor((Math.random() * 9000) + 1000);
		key = time + num;
		return key;
	}

    _kaiPiao() {
    	let selected = this.state.selected;
    	if(selected && selected.orders.length) {
    		var data ={
	            billAmount: this.state.sum,
	            orderNoList: this.state.selected.nos.join(',')
	        };
	        var key=this._getKey();
	        new Storage().set(key, data);
	        setTimeout(function(){
	        	window.location.href = `/webapp/invoice/fill.html?invoiceKey=${key}`;
	        }, 0);
    	}
    }
    _checkBillStatus(item) {
    	let attr = {};
    	if(item.billsStatus == 2) {
    		attr = {disabled: true};
    	}
    	return attr
    }

    _handleClick(item, ele) {
    	let type = 'add';
    	if(item.billsStatus == 2) {
    		// 已开票
    		return false;
    	}
    	if(ele.target.checked) {
			type = 'add';
    	} else {
    		type = 'remove';
    	}

        if(type == 'add' && this.state.sum + item.amount > LIMIT_TOTAL) {
            this.setState({
                selectedAll: 3,
                isAlert: true,
                alertMsg: {
                    msg: '单次开票金额不能超过10万元'
                }
            })
        }

    	this._changeSelectedList(type, item);
    }

    _handleAllClick(ele) {
        let type = 'add';
        if(ele.target.checked) {
            type = 'add';
        } else {
            type = 'remove';
        }

        if(type == 'add' && this.props.result.result && this.props.result.result.totalAmount > LIMIT_TOTAL) {
            this.setState({
                selectedAll: 3,
                isAlert: true,
                alertMsg: {
                    msg: '单次开票金额不能超过10万元'
                }
            })
            return;
        }

        this._changeSelectedList(type, 'all');

    }

    _showMsg() {
        if (this.state.isAlert) {
            let attr = {
                showFlag: true,
                showType: 'alert', // info alert confirm
                backHandle: () => {
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
            <div>
            	{
            		(()=>{
            			let res = [];
            			let result = this.props.result;
            			let searchData = result.searchData;
            			let listData = result.result;
            			if(listData) {
            				if(searchData.type == 1) {
								res.push(
									<div>
                                        <div className="kai-piao">
                                            <div className="money">可开票金额 ：<span>¥ {listData.totalAmount}</span>已选开票金额 ：<span>¥ {this.state.sum}</span></div>
                                            { (this.state.sum > 0) && (this.state.sum <= LIMIT_TOTAL) ?<span className="kai-piao-btn"  onClick={this._kaiPiao.bind(this)}>申请开票</span>:null}
                                        </div>
                                        <div className="list-table">
		                                        <Row className="list-head" type="flex" justify="space-around" align="middle">
                                                    <Col span={3}><Checkbox {...this.selectAll} onChange={this._handleAllClick.bind(this)}>订单号</Checkbox></Col>
	                                                <Col span={2}>第三方订单号</Col>
	                                                <Col span={2}>订单类型</Col>
	                                                <Col span={3}>服务时间 <br/>（北京时间）</Col>
	                                                <Col span={3}>完成时间 <br/>（北京时间）</Col>
	                                                <Col span={2}>服务城市</Col>
	                                                <Col span={2}>订单金额</Col>
	                                                <Col span={3}>可开票金额</Col>
	                                                <Col span={2}>支付方式</Col>
	                                                <Col span={2}>订单状态</Col>
	                                            </Row>
											{
                                                listData.resultBean.map((item,key)=>{
                                                    return (
                                                    	<div className="list-item">
		                                        			<Row className="list-main" type="flex" justify="space-around" align="middle">
	                                                            <Col span={3} title={item.orderNo} className="order-no"><Checkbox {...this.selectSingle} {...this._checkBillStatus(item)} onChange={this._handleClick.bind(this, item)}>{item.orderNo}</Checkbox> </Col>
	                                                            <Col span={2} title={item.thridOrderNo}>{item.thridOrderNo || '——'}</Col>
	                                                            <Col span={2} title={item.orderTypeName}>{item.orderTypeName}</Col>
	                                                            <Col span={3} title={item.serviceTime} className="time">{item.serviceTime}</Col>
	                                                            <Col span={3} title={item.serviceTimeEnd} className="time">{item.serviceTimeEnd}</Col>
	                                                            <Col span={2} title={item.serviceCityName}>{item.serviceCityName}</Col>
	                                                            <Col span={2} title={item.priceChannel} className="jin-e">￥{item.priceChannel}</Col>
	                                                            <Col span={3} title={item.amount} className="jin-e">￥{item.amount}</Col>
	                                                            <Col span={2} title={item.payGatewayName}>{item.payGatewayName}</Col>
	                                                            <Col span={2} title={item.orderStatusName}>{item.orderStatusName}</Col>
	                                                        </Row>
                                                        </div>
                                                    )
                                                })
                                            }
                                            {
                                                !listData.resultBean.length ? 
                                                <div className="list-item">
                                                    <Row className="list-main" type="flex" justify="space-around" align="middle">
                                                        <Col span={24} className="none-result">暂无相关订单</Col>
                                                    </Row>
                                                </div> : null
                                            }
                                        </div>
                                    </div>
								)
            				} else {
            					res.push(
            						<div>
                                        <div className="kai-piao">
                                            <div className="money">可开票金额 ：<span>¥ {listData.totalAmount}</span>已选开票金额 ：<span>¥ {this.state.sum}</span></div>
                                            { (this.state.sum > 0) && (this.state.sum <= LIMIT_TOTAL) ?<span className="kai-piao-btn"  onClick={this._kaiPiao.bind(this)}>申请开票</span>:null}
                                        </div>

                                    	<div className="list-table">
		                                        <Row className="list-head" type="flex" justify="space-around" align="middle">
                                                    <Col span={3} className="order-no-Col"><Checkbox {...this.selectAll} onChange={this._handleAllClick.bind(this)}>订单号</Checkbox></Col>
                                                    <Col span={4}>酒店名称</Col>
                                                    <Col span={1}>房间数</Col>
                                                    <Col span={2} className="time">下单时间 <br/>（北京时间）</Col>
                                                    <Col span={2}>下单账号</Col>
                                                    <Col span={2} className="time">入住／退房 <br/>时间</Col>
                                                    <Col span={2}>入住人</Col>
                                                    <Col span={2}>订单金额</Col>
                                                    <Col span={2}>可开票金额</Col>
                                                    <Col span={2}>付款方式</Col>
                                                    <Col span={2}>订单状态</Col>
	                                            </Row>
											{
                                                listData.resultBean.map((item,key)=>{
                                                    return (
                                                    	<div className="list-item">
		                                        			<Row className="list-main" type="flex" justify="space-around" align="middle">
	                                                            <Col span={3} title={item.orderNo} className="order-no"><Checkbox {...this.selectSingle} {...this._checkBillStatus(item)} onChange={this._handleClick.bind(this, item)}>{item.orderNo}</Checkbox> </Col>
                                                                <Col span={4} title={item.ordehotelNamerNo} className="hotel-name">{item.hotelName}</Col>
                                                                <Col span={1} title={item.numOfRooms}>{item.numOfRooms}</Col>
                                                                <Col span={2} title={item.orderCreateTime} className="time">{item.orderCreateTime}</Col>
                                                                <Col span={2} title={item.orderOptName}>{item.orderOptName}</Col>
                                                                <Col span={2} title={item.serviceTimeEnd}>{item.serviceTime.slice(0,10)} <br/>{item.serviceTimeEnd.slice(0,10)} </Col>
                                                                <Col span={2} title={item.userName}>{item.userName}</Col>
                                                                <Col span={2} title={item.priceChannel} className="jin-e">￥{item.priceChannel}</Col>
                                                                <Col span={2} title={item.amount} className="jin-e">￥{item.amount}</Col>
                                                                <Col span={2} title={item.payGatewayName}>{item.payGatewayName}</Col>
                                                                <Col span={2} title={item.orderStatusName}>{item.orderStatusName}</Col>
	                                                        </Row>
                                                        </div>
                                                    )
                                                })
                                            }
                                            {
                                                !listData.resultBean.length ? 
                                                <div className="list-item">
                                                    <Row className="list-main" type="flex" justify="space-around" align="middle">
                                                        <Col span={24} className="none-result">暂无相关订单</Col>
                                                    </Row>
                                                </div> : null
                                            }
                                        </div>
                                    </div>
								)
            				}
            			}
            			return res;
        			})()
        		}
                 {this._showMsg()}
            </div>


        )
    }
}

function mapStateToProps(state){
    return {
        result: state.result
    }
}

export default connect(mapStateToProps)(InvoiceList);

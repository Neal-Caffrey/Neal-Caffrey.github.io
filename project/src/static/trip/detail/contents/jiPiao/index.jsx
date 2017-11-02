import React, {Component} from "react";
import {Row, Col,Icon} from "local-Antd";
import ApiConfig from 'widgets/apiConfig/index.js';
import YdjAjax from 'components/ydj-Ajax/index.js';
import "components/globleCss/font.scss";
import { connect } from 'react-redux';
import UIMsg from 'components/ui-msg/index.jsx';
import Moment from 'moment';
import {
    _extend
} from 'local-Utils/dist/main.js';
import WritePlane from "../writePlane/index.jsx";
import {showPassengerWin, showAlert} from '../../action/index.js';

const TO_PAY_STATUS = 1001;

class JiPiao extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = this.defaultState;
    }

    get defaultState(){
        return {
            aliPop: false, // 支付弹框
            isAirPerfect: false, // 乘机人是否完善
        };
    }

    errorHanlde(res){
        let handles = {
            failedHandle: (res) => {
                this.setState({loading: false}, ()=>{
                    this.props.dispatch(showAlert(res.message));
                });
            },
            errorHandle: (xhr, errorType, error, errorMsg) => {
                this.setState({loading: false}, ()=>{
                    this.props.dispatch(showAlert(errorMsg));
                });
            }
        };
        return handles;
    }

    goToPay(item) {
        let that = this;
        let newTab = window.open('about:blank');
        this.setState({
            loading: true
        })
        let opt = {
            url: ApiConfig.payAirAlipay,
            type: 'POST',
            data: {
                routeNo: item.orderNoParent,
                orderNo: item.orderNo,
                actualPrice: item.priceChannel,
            },
            successHandle: (res)=>{
                this.setState({
                    loading: false,
                    aliPop: true
                },()=>{
                    newTab.location.href = res.data.payurl;
                })
            },
            ...this.errorHanlde()
        }
        new YdjAjax(opt)
    }

    getAirPerfact(list=[]) {
        let flag = true;
        list.map((item, index)=>{
            let passengers = (typeof item.passengers == 'string') ? JSON.parse(item.passengers) : [];
            let t = (item.ticketNum == passengers.length)? true : false;
            flag = (flag && t);
        })
        return flag;
    }

    getPayReady(item) {
        let flag = false;
        let passengers = (typeof item.passengers == 'string' ? JSON.parse(item.passengers) : item.passengers) || [];
        if(item.claTicketOrderStatus == TO_PAY_STATUS && passengers.length == item.ticketNum) {
            flag = true;
        }
        return flag;
    }

    getShowPrice(price=0) {
        return (price / this.props.currencyInfo.rate).toFixed(2);
    }
    showWritePlane(item){
        this.props.dispatch(showPassengerWin({
                routeNo: this.props.routeNo,
                orderNo: item.orderNo,
                ticketNum: item.ticketNum,
                passengers: item.passengers ? JSON.parse(item.passengers) : [],
                canEdit: (!item.orderStatus ? true : (item.orderStatus == 1001? true : false)),
            }));
    }

    formatDate(sss) {
        let info = {
                date: '',
                time: '',
            };
        if(!sss) {
            return info;
        }
        let str = Moment(sss).format('YYYY-MM-DD HH:mm');

        let arr = str.substr(0, 10);
        return {
            date: str ? str.substr(0, 10) : '',
            time: str ? str.substr(10) : '',
        }
    }

    formatFlightType(type='101') {
        let list = [
            {'type': 101, 'desc': '直达'},
            {'type': 102, 'desc': '往返'},
            {'type': 103, 'desc': '联程'},
            {'type': 201, 'desc': '其它'},
        ];
        return list.find((item)=>{
            return item.type == type;
        });
    }

    formatSeatType(type='101') {
        let list = [
            {'type': 101, 'desc': '经济舱'},
            {'type': 102, 'desc': '商务舱'},
            {'type': 103, 'desc': '头等舱'},
            {'type': 201, 'desc': '其它'},
        ];
        return list.find((item)=>{
            return item.type == type;
        });
    }

    confirmClick() {
        window.location.reload();
    }

    renderAlipayAlert() {
        if (!this.state.aliPop) return null;
        return ( < UIMsg initData = {
                {
                    title: '登录平台支付',
                    showFlag: this.state.aliPop,
                    showType: 'alert',
                    backHandle: this.confirmClick.bind(this)
                }
            } > <p style={{fontSize:'16px'}}>请您在新打开的页面进行支付,支付完成前请不要关闭该窗口。</p> < /UIMsg>)
    }

    render() {
        console.log('render jipiao', this.props);
        return (
            <div>
                <WritePlane/>
                {
                    (!this.props.currencyInfo || !this.props.air) ? null :
                    <div>
                        <div className="title">机票预订</div>
                        <div className="list-table">
                            <Row  className="list-head" type="flex" align="middle">
                                <Col  span={2}>机票</Col>
                                <Col span={11}>
                                    <Row type="flex" align="middle" span={24}>

                                        <Col  span={5}>航班起飞日期</Col>
                                        <Col  span={5}>航班落地日期</Col>
                                        <Col  span={5}>起止城市</Col>
                                        <Col  span={5}>航班号</Col>
                                        <Col  span={4}>舱位</Col>
                                    </Row>
                                </Col>
                                <Col  span={1}>数量</Col>
                                <Col  span={2}>订单状态</Col>
                                <Col  span={2}>订单金额</Col>
                                <Col  span={2}></Col>
                                <Col  span={4}>操作</Col>
                            </Row>
                            {
                                !this.getAirPerfact(this.props.air) ?
                                <div className="list-item ti-shi-item">
                                    <Row className="list-main ti-shi" type="flex" align="middle">
                                        <Col span={24}>请完善乘机人信息后支付下单</Col>
                                    </Row>
                                </div> : null
                            }
                            {
                                this.props.air.map((item, index)=>{
                                    return(
                                       <div className="list-item">
                                        <Row  className="list-main"  type="flex" align="middle">
                                            <Col span={2}>机票{index + 1}</Col>
                                            <Col span={11}>
                                                {
                                                    item.tickets && JSON.parse(item.tickets).map((tItem, tIndex)=>{
                                                        return (
                                                            <Row type="flex" align="middle" span={24}>
                                                                <Col span={5}><p className="shi-jian">{this.formatDate(tItem.flightFlyTime).date}</p><p className="shi-jian">{this.formatDate(tItem.flightFlyTime).time}</p></Col>
                                                                <Col span={5}><p className="shi-jian">{this.formatDate(tItem.flightArriveTime).date}</p><p className="shi-jian">{this.formatDate(tItem.flightArriveTime).time}</p></Col>
                                                                <Col span={5}>{tItem.flightDeptCityName}-{tItem.flightDestCityName}</Col>
                                                                <Col span={5}>
                                                                    <p>{tItem.flightNo} {this.formatFlightType(tItem.flyType).desc}</p>
                                                                    {
                                                                        tItem.stayCityName ?
                                                                        <p>经停 {tItem.stayCityName}</p> : null
                                                                    }
                                                                </Col>
                                                                <Col span={4}>{tItem.seatType}</Col>
                                                            </Row>
                                                        )
                                                    })
                                                }

                                            </Col>
                                            <Col span={1}>{item.ticketNum}张</Col>
                                            <Col span={2}>{item.claTicketOrderStatusName}</Col>
                                            <Col span={2} className="jin-e">
                                                <span className="rmb">{this.props.currencyInfo.showCcy} </span>{this.getShowPrice(item.priceChannel)}
                                            </Col>
                                            <Col span={2} className="cancel-policy">
                                                <Icon type="question-circle-o" style={{ fontSize: 14, color: '#006CE1' }}/>
                                                <span>退改签</span>
                                                <p>不得退票，不得改签</p>
                                            </Col>
                                            <Col span={4}>
                                                {
                                                    item.claTicketOrderStatus == TO_PAY_STATUS ?
                                                    <span onClick={this.showWritePlane.bind(this, item)}>{item.passengers ? '修改':'填写'}乘机人信息</span> :
                                                    <span onClick={this.showWritePlane.bind(this, item)}>查看乘机人信息</span>
                                                }
                                                {
                                                    this.getPayReady(item) ?
                                                    <button className="yellow-bg" onClick={this.goToPay.bind(this, item)}>去支付</button> :
                                                    <button>去支付</button>
                                                }
                                            </Col>
                                        </Row>
                                    </div>
                                    )
                                })
                            }
                        </div>
                        {this.renderAlipayAlert()}
                    </div>
                }
            </div>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        routeNo: state.main.routeNo,
        air: state.main.air,
        currencyInfo: state.main.currencyInfo,
    }
}

export default connect(mapStateToProps)(JiPiao);

import React, {Component} from "react";
import {Row, Col} from "local-Antd";
import "components/globleCss/font.scss";
import { connect } from 'react-redux';
import {
    _extend
} from 'local-Utils/dist/main.js';
import CountDown from 'components/ui-countDown/index.jsx';
import ApiConfig from 'widgets/apiConfig/index.js';
import YdjAjax from 'components/ydj-Ajax/index.js';
import WriteHotel from "../writeHotel/index.jsx";
import {showGuestWin, showAlert} from '../../action/index.js';
import UIMsg from 'components/ui-msg/index.jsx';
import Loading from 'components/ui-loading/index.jsx';

const TO_ORDER_STATUS = 101;
const UN_ORDER_STATUS = 102;
const TO_PAY_STATUS = 1001;

class JiuDian extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = this.defaultState
    }
    get defaultState(){
        return{
            isHotelPerfect: false, // 入住人是否完善
        };
    }

    showWriteHotel(item){
        this.props.dispatch(showGuestWin({
                numOfOrders: this.props.hotel.length,
                routeNo: this.props.routeNo,
                guestNationalityName: item.guestNationalityName,
                orderNo: item.orderNo,
                adultNum: item.adultNum,
                childNum: item.childNum,
                numOfRooms: item.numOfRooms,
                canEdit: (!item.orderStatus ? true : (item.orderStatus == TO_ORDER_STATUS? true : false)),
                customerRequest: item.customerRequest,
                userInfo: item.userInfo ? JSON.parse(item.userInfo) : {},
            }));
    }

    formatDate(str) {
        let arr = str.substr(0, 10);
        return {
            date: str ? str.substr(0, 10) : '',
            time: str ? str.substr(10) : '',
        }
    }

    getHotelPerfact(list=[]) {
        let flag = true;
        list.map((item, index)=>{
            let t = false;
            let roomThisType = item; // 某酒店某类型房间，可多间房
            let userInfo = (typeof roomThisType.userInfo == 'string') ? JSON.parse(roomThisType.userInfo) : {};
            let numOfRooms = roomThisType.numOfRooms || 1;

            let roomList = userInfo.roomGuestList || [];

            if(roomList.length != numOfRooms) {
                // 每间房至少一个入住人
                t = false;
            } else {
                roomList.map((room, roomIndex)=>{
                    if(room.guestList && room.guestList.length) {
                        t = true;
                    } else {
                        t = false;
                    }
                })
            }

            flag = (flag && t);
        })
        return flag;
    }

    getPayReady(item) {
        let flag = false;
        if(((item.orderStatus == TO_ORDER_STATUS) && item.userInfo && (JSON.parse(item.userInfo).roomGuestList.length >= item.numOfRooms)) || item.orderStatus == TO_PAY_STATUS) {
            flag = true;
        }
        return flag;
    }

    getShowPrice(price=0) {
        return (price / this.props.currencyInfo.rate).toFixed(0);
    }

    errorHanlde(res){
        let handles = {
            failedHandle: (res) => {
                if(res.status == 80003) {
                    // 验价失败,提示并刷新页面
                    debugger
                    this.setState({
                        loading: false,
                        orderPop: {
                            type: 'checkPrice',
                            data: res.data
                        }
                    })
                }else {
                    this.setState({loading: false}, ()=>{
                        this.props.dispatch(showAlert(res.message));
                    });
                }
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
        let newTab;
        this.setState({
            loading: true
        })
        if(item.orderStatus != UN_ORDER_STATUS) {
            newTab = window.open('about:blank');
        }

        if(item.orderStatus == TO_ORDER_STATUS) {
            // 下单
            let opt = {
                url: ApiConfig.addOrder,
                type: 'POST',
                headers : {
                  'Content-Type':'application/json'
                },
                data: JSON.stringify({
                    orderNo: item.orderNo,
                }),
                successHandle: (res)=>{
                    this.setState({
                        loading: false,
                        orderPop: {
                            type: 'pay',
                        }
                    },()=>{
                        newTab.location.href = `/webapp/hotel/orderDetail.html?orderNo=${item.orderNo}`;
                    })
                },
                ...this.errorHanlde()
            }
            new YdjAjax(opt)
        } else if(item.orderStatus == UN_ORDER_STATUS) {
            this.setState({
                loading: false
            }, ()=>{
                // 预下单，超时未支付，需提示
                this.props.dispatch(showAlert('该订单已取消未付款！'));
            })
        } else {
            this.setState({
                loading: false,
                orderPop: {
                    type: 'pay',
                }
            });
            // 跳转订单详情
            newTab.location.href = `/webapp/hotel/orderDetail.html?orderNo=${item.orderNo}`;
        }  
    }

    confirmClick() {
        window.location.reload();
    }

    renderOrderAlert() {
        debugger
        if (!this.state.orderPop) return null;
        let msg = '请您在新打开的页面进行订单支付,支付完成前请不要关闭该窗口。';
        let data = this.state.orderPop.data;
        let type = this.state.orderPop.type;
        let room;
        if(type == 'checkPrice') {
            if (data && data.status != undefined) {
                // 0: 匹配
                // 1：价格变更
                // 2：房间变更
                // 3：床型变更
                // 4：早餐变更
                // 5：退款变更
                // data.status = 5;
                // data.status = 4;
                // data.status = 3;
                // data.status = 2;
                // data.status = 1;
                switch(data.status){
                    case 0:
                        // 验价通过接口已拦截
                        break;
                    case 1:
                        room = data.confirmQuoteItem;
                        msg = `房间总价已发生变化，最新房价已变为 <span style="color: red;">￥${room.totalRoomPrice}</span>。是否继续?`;
                        break;
                    case 2:
                        room = data.confirmQuoteItem;
                        msg = `该房型已变为 <span style="color: red;">【${room.vendorRoomName}】</span>。是否继续?`;
                        break;
                    case 3:
                        room = data.confirmQuoteItem;
                        msg = `该房间的床型已变为 <span style="color: red;">【${room.bedTypeName}】</span>。是否继续?`;
                        break;
                    case 4:
                        room = data.confirmQuoteItem;
                        msg = `该房型的早餐情况已变为 <span style="color: red;">【${room.breakfastTypeName}】</span>。是否继续?`;
                        break;
                    case 5:
                        room = data.confirmQuoteItem;
                        let cancelStr = function(){
                            let str = '';
                            room.channelCancelPolicys.map((item, index)=>{
                                if(item.type == 1) {
                                    if(item.fromTime) {
                                        str+=`<p style="color: red;">【${item.fromTime}后${item.desc}】</p>`
                                    }else {
                                        str+=`<p style="color: red;">【${item.desc}】</p>`
                                    }
                                }else if(item.type == 2){
                                    if(item.toTime) {
                                        str+=`<p style="color: red;">【${item.toTime}前免费取消】</p>`
                                    }else {
                                        str+=`<p style="color: red;">【免费取消】</p>`
                                    }

                                }else if(item.type == 3) {
                                    if(item.fromTime && item.toTime) {
                                        str+=`<p style="color: red;">【${item.fromTime}至${item.toTime}取消，扣款￥${item.totalRoomAmount}】</p>`
                                    } else {
                                        if(item.fromTime){
                                        str+=`<p style="color: red;">【${item.fromTime}后取消，扣款￥${item.totalRoomAmount}】</p>`
                                        }
                                        if(item.toTime){
                                            str+=`<p style="color: red;">【${item.fromTime}前取消，扣款￥${item.totalRoomAmount}】</p>`
                                        }
                                    }
                                }

                            })
                            return str;
                        }
                        msg = `该房型的取消政策已发生变化，最新政策为：${cancelStr()}`
                        break;
                }
                debugger
            } else {
                msg = '验价失败：未知条目变更';
            }
        } 
        return ( < UIMsg initData = {
                {
                    title: '酒店预订',
                    showFlag: this.state.orderPop,
                    showType: 'alert',
                    backHandle: this.confirmClick.bind(this)
                }
            } ><p style={{fontSize:'12px'}} dangerouslySetInnerHTML={{__html: msg || ''}}></p></UIMsg>)
    }

    render() {
        console.log('render jiudian', this.props);
        return (
            <div>
                <WriteHotel/>
                {/*酒店预订*/}
                {
                    (!this.props.currencyInfo || !this.props.hotel) ? null : 
                    <div>
                        <div className="title">酒店预订</div>
                        <div className="list-table">
                            <Row  className="list-head" type="flex" justify="space-around" align="middle">
                                <Col  span={2}>酒店</Col>
                                <Col  span={3}>订单号</Col>
                                <Col  span={4}>酒店名称</Col>
                                <Col  span={2}><p>入住/离店日期</p><p className="dangdi-time">(当地时间)</p></Col>
                                <Col  span={2}>入住城市</Col>
                                <Col  span={2}>房间数量</Col>
                                <Col  span={3}>订单状态</Col>
                                <Col  span={2}>订单金额</Col>
                                <Col  span={4}>操作</Col>
                            </Row>
                            {
                                !this.getHotelPerfact(this.props.hotel) ?
                                <div className="list-item ti-shi-item">
                                    <Row className="list-main ti-shi" type="flex" justify="center" align="middle">
                                        <Col span={24}>请完善入住人信息后支付下单</Col>
                                    </Row>
                                </div>: null
                            }
                            {
                                this.props.hotel.map((item, index)=>{
                                    return(
                                        <div className="list-item">
                                            <Row  className="list-main" type="flex" justify="space-around" align="middle">
                                                <Col  span={2}>酒店{index + 1}</Col>
                                                <Col  span={3}><span onClick={this.goToPay.bind(this, item)}>{item.orderNo}</span></Col>
                                                <Col  span={4} className="from-left">{item.hotelName}</Col>
                                                <Col  span={2}><p className="shi-jian">{this.formatDate(item.checkinDate).date}</p><p className="shi-jian">{this.formatDate(item.checkoutDate).date}</p></Col>
                                                <Col  span={2}>{item.serviceStartCityname}</Col>
                                                <Col  span={2}>{item.numOfRooms}</Col>
                                                <Col  span={3}>
                                                    <p>{item.orderStatusName || '未支付'}</p>
                                                    {
                                                        item.orderStatus == TO_PAY_STATUS && item.payDeadLineCountDown ? 
                                                        <p className="zhifu-tips">请在<strong  className="time"><CountDown callback={this.confirmClick.bind(this)} time={item.payDeadLineCountDown} model={2} type={2}/></strong>内完成支付</p> : null
                                                    }
                                                </Col>
                                                <Col  span={2} className="jin-e"><span className="rmb">{this.props.currencyInfo.showCcy} </span>{this.getShowPrice(item.priceChannel)}</Col>
                                                <Col span={4}>
                                                    {   
                                                        item.orderStatus == TO_ORDER_STATUS ? 
                                                        <span onClick={this.showWriteHotel.bind(this, item)}>{item.userInfo ? '修改':'填写'}入住人信息</span> :
                                                        <span onClick={this.showWriteHotel.bind(this, item)}>查看入住人信息</span> 
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
                        {this.renderOrderAlert()}
                    </div>
                }
                {
                    this.state.loading ? <Loading/> : null
                }
            </div>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        routeNo: state.main.routeNo,
        hotel: state.main.hotel,
        currencyInfo: state.main.currencyInfo,
    }
}

export default connect(mapStateToProps)(JiuDian);
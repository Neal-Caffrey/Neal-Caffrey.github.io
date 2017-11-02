import React, {
    Component,
} from "react";
import {
    connect
} from 'react-redux';
import {
    _extend,
    _getQueryObjJson
} from 'local-Utils/dist/main.js';
import Header from 'contents/header/index.jsx';
import BaseCss from 'local-BaseCss/dist/main.css';
import GlobleCss from 'components/globleCss/index.scss';
import BaseHotelCss from '../sass/index.scss';
import './sass/index.scss';
import Request from 'local-Ajax/dist/main.js';
import ApiConfig from 'widgets/apiConfig/index.js';

class App extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = this.defaultState;
        this.getOrderDetail();
    }

    get defaultState() {
        return {};
    }

    getOrderDetail() {
        let _request = new Request();
        _request.ajax({
            type: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },

            url: `${ApiConfig.orderDetail}?orderNo=${this.getOrderNo()}`,

        }).then(res => {
            if (res.status === 200) {
                this.setState({
                    ...res.data.hotelOrder,
                    orderDetailObj: JSON.parse(res.data.hotelOrder.orderDetail),
                    cancelRuleObj: JSON.parse(res.data.hotelOrder.cancelRule),
                    canPop: false,
                    aliPop: false
                })
            }
        })
    }

    getOrderNo() {
        return _getQueryObjJson().orderNo;
    }


    _renderCancelPolicy(data) {
        let showItem = '';
        let item = data;
        if (item.type == 1) {
            showItem = '不可取消';
            if (item.fromTime) {
                showItem = `${item.fromTime} 之后不可取消`;
            }
        } else if (item.type == 2) {
            showItem = '免费取消';
            if (item.toTime) {
                showItem = `${item.toTime} 之前免费取消`;
            }
        } else if (item.type == 3) {
            showItem = '付费取消';
            if (item.fromTime) {
                if (item.toTime) {
                    showItem = item.fromTime + '-' + item.toTime + '取消订单，需要扣除金额￥' + item.totalRoomAmount;
                } else {
                    showItem = `${item.fromTime} 取消订单，需要扣除金额￥${item.totalRoomAmount}`;
                }
            } else {
                // 无fromTime
                if (item.toTime) {
                    showItem = `${item.toTime}取消订单，需要扣除金额￥${item.totalRoomAmount}`;
                }
            }
        }
        return showItem;
    }

    render() {
        if (!this.state.orderNo) {
            return null;
        }
        return (
            <div id='ui-wrap'>
                <Header active={-1}/>
                <div className='ui-main ui-fixed-footer'>
                    <div className="order-detail-main">
                        <div className='order-detail-wrap'>
                            <div className="detail-content">
                                <div className="border1"></div>
                                <div className="border2"></div>
                                <div className='order-detail-header'>
                                    <div className="title">INVOICE 酒店结算单</div>
                                </div>
                                <div className="yuding-msg">
                                    <div className="yuding-head">Booking Information 预订信息</div>
                                    <table className="yuding-table1">
                                        <tr>
                                            <td>Hotel Name（酒店名称）：{this.state.hotelNameEn} {this.state.hotelName}</td>
                                        </tr>
                                        <tr>
                                            <td>Hotel address（酒店地址）：{this.state.hotelAddress}</td>
                                        </tr>
                                        <tr>
                                            {
                                                this.state.hotelPhone ?
                                                    <td>Hotel Tel:（酒店电话）：{this.state.hotelPhone}</td>
                                                    : <td></td>
                                            }
                                        </tr>
                                        <tr>
                                            <td>Booking No（订单号）：{this.state.orderNo}</td>
                                        </tr>
                                        <tr>
                                            <td>Booking Date（下单时间）：{this.state.createTime}</td>
                                        </tr>
                                        <tr>
                                            <td>City（预订城市）：{this.state.cityName}</td>
                                        </tr>
                                        <tr>
                                            <td className="guest-name">Guest Name（入住人）：
                                                {this.state.guestNames}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Travel Dates（入住日期）：({this.state.checkinDate.substr(0, 10)}
                                                -- {this.state.checkoutDate.substr(0, 10)})
                                            </td>
                                        </tr>
                                    </table>
                                    <table className="yuding-table2">
                                        <tr className="table2-msgs table2-column">
                                            <td className="room-type  first-td">Room Type <br/>(房型)</td>
                                            <td className="num-of-nights">No. of Night(s) <br/>（入住晚数）</td>
                                            <td className="rnum-of-rooms">No. of Room(s) <br/>（房间数）</td>
                                            <td className="breakfast">Breakfast <br/>（早餐）</td>
                                            <td className="pax">Pax <br/>（住客人数）</td>
                                            <td className="money last-td">Price <br/>(价格)</td>
                                        </tr>
                                        <tr className="table2-msgs">
                                            <td className="room-type"><p>{this.state.roomTypeName}</p></td>
                                            <td className="num-of-nights">{this.state.numOfStay}</td>
                                            <td className="num-of-rooms"><p>{this.state.numOfRooms}</p></td>
                                            <td className="breakfast">{this.state.breakfastType == 1 ? 'Include' : 'Not Include'}({this.state.breakfastTypeName})</td>
                                            <td className="pax">{this.state.adultNum}
                                                Adult(成人)<br/>{this.state.childNum} Child(儿童)
                                            </td>
                                            <td className="price red-color">￥{this.state.priceChannel}</td>
                                        </tr>
                                        
                                    </table>
                                </div>
                                <div className="hotel-msg">
                                    <div className="hotel-msg-head">Canceling Rule 取消规则</div>
                                    <table>
                                        {
                                            this.state.cancelRuleObj && this.state.cancelRuleObj.map((val, index) => {
                                                return (
                                                    <tr>
                                                        <td>{this._renderCancelPolicy(this.state.cancelRuleObj[index])}</td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </table>
                                </div>
                                <div className="yuding-msg">
                                    <table className="yuding-table2 canceling-rules-detail">
                                        <tr className="table2-msgs table2-column">
                                            <td className="reservation first-td">Reservation<br/>(预订费用)</td>
                                            <td className="canceling-fee">Cancel Fee <br/>（取消费用）</td>
                                            <td className="total  last-td">Total <br/>（总计）</td>
                                        </tr>
                                        <tr className="table2-msgs">
                                            <td className="reservation first-td">￥{this.state.priceChannel}</td>
                                            {
                                                <td className="canceling-fee">
                                                    {
                                                        (this.state.cancelFee >=0) ? this.state.cancelFee : <span>——</span>
                                                    }
                                                </td>
                                            }
                                            <td className="total">￥{this.state.totalMoeny}</td>
                                        </tr>
                                    </table>
                                </div>
                                
                                <div className="footerBtn">
                                    <a href={"/api/hotel/v1.0/confirm/settlementPdf?orderNo=" + this.state.orderNo}
                                       className="down-btn">
                                        <div className="download-pdf"></div>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        order: state.order
    }
}

export default connect(mapStateToProps)(App);
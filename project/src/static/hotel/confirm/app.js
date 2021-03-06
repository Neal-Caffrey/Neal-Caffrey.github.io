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
// import Marks from 'components/ui-mark/index.jsx';
import BaseCss from 'local-BaseCss/dist/main.css';
import GlobleCss from 'components/globleCss/index.scss';
import BaseHotelCss from '../sass/index.scss';
import './sass/index.scss';
import Request from 'local-Ajax/dist/main.js';
// import UIMsg from 'components/ui-msg/index.jsx'

// import UIStar from 'components/ui-star/index.jsx';
// import Storage from 'local-Storage/dist/main.js';
import ApiConfig from 'widgets/apiConfig/index.js';



class App extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = this.defaultState;
        this.getOrderDetail();
    }

    get defaultState() {
        return {
            isEn : false,
            isSelectShow : false,
            select : 'selected'
        };
    }

    // get appInfo() {
    //     return this.storage.get(ApiConfig.storageKey.hotel_app_info);
    // }

    // get storage() {
    //     return this._storage = new Storage;
    // }

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
                // this.setState(res.data.hotelOrder);
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

    getGuestNames(arr) {
        if (!arr) {
            return
        }
        return arr.lastName + ' ' + arr.firstName;
    }
    handleSelectShow(){
        if(this.state.isSelectShow){
            this.setState({
                isSelectShow: false,
                select: 'selected'
            })
        }else{
            this.setState({
                isSelectShow: true
            })
        }
    }

    handleClick(){
        this.setState({
            isEn : !this.state.isEn
        })
    }
    mouseIn(){
        this.setState({
            select: ''
        })
    }

    mouseOut(){
        this.setState({
            select: 'selected'
        })
    }

    mouseLeave(){
        if(this.state.isSelectShow) {
            this.setState({
                isSelectShow: false,
                select: 'selected'
            })
        }
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
                                {
                                    this.state.isEn?
                                        (
                                            <div className="en">
                                                <div className="border1"></div>
                                                <div className="border2"></div>
                                                <div className='order-detail-header'>
                                                    <div className="title">Hotel Voucher</div>
                                                    <div className="select" onClick={this.handleSelectShow.bind(this)} onMouseLeave={this.mouseLeave.bind(this)}><strong>英文版</strong> <em></em>
                                                        {
                                                            this.state.isSelectShow?
                                                                (<ul className="selectlist" >
                                                                    <li className="li1 select-icon" onClick={this.handleClick.bind(this)} onMouseEnter={this.mouseIn.bind(this)} onMouseLeave={this.mouseOut.bind(this)}>中英双语</li>
                                                                    <li className= {`li2 select-icon lastli ${this.state.select}` } onMouseEnter={this.mouseIn.bind(this)} onMouseLeave={this.mouseOut.bind(this)}>英文版</li>
                                                                </ul>)
                                                                :null
                                                        }

                                                    </div>
                                                </div>
                                                <div className="yuding-msg">
                                                    <div className="yuding-head">Booking Information</div>
                                                    <table className="yuding-table1">
                                                        <tr>
                                                            <td>Check-In Date：{this.state.checkinDate.substr(0, 10)}</td>
                                                            <td>Check-out Date：{this.state.checkoutDate.substr(0, 10)}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>No. of Night(s)：{this.state.numOfStay}</td>
                                                            <td>No. of Room(s)：{this.state.numOfRooms}</td>
                                                        </tr>
                                                        <tr>
                                                            {
                                                                this.state.misConfirmNo?
                                                                    <td>ConfirmNo：{this.state.misConfirmNo}</td>
                                                                    :null
                                                            }
                                                            {/*<td>ConfirmNo：{this.state.misConfirmNo}</td>*/}
                                                            <td>Agent Reference No：{this.state.orderNo}</td>
                                                        </tr>
                                                    </table>
                                                    <table className="yuding-table2">
                                                        <tr className="table2-msgs table2-column">
                                                            <td className="room-type  first-td">Unit</td>
                                                            <td className="guests">Guest's</td>
                                                            <td className="room-type">Room Type</td>
                                                            <td className="bed-type">Bed Type</td>
                                                            <td className="breakfast">Breakfast</td>
                                                            <td className="pax  last-td">Pax</td>
                                                        </tr>
                                                        
                                                        {
                                                            this.state.roomGuestList && this.state.roomGuestList.map((val, index) => {
                                                                return (
                                                                    <tr className="table2-msgs" key={index}>
                                                                        <td className="room-type">{index + 1}</td>
                                                                        <td className="guests">
                                                                            {
                                                                                val.guestList.map((val,index)=>{
                                                                                    return (<div>
                                                                                        <span>{this.getGuestNames(val)}</span>
                                                                                        <br/>
                                                                                    </div>)
                                                                                })
                                                                            }
                                                                        </td>
                                                                        <td className="room-type"><p>{this.state.roomTypeName}</p></td>
                                                                        <td className="bed-type">{this.state.bedTypeName}</td>
                                                                        <td className="breakfast">{this.state.breakfastType == 1 ? 'Include' : 'Not Include'}</td>
                                                                        <td className="pax">{this.state.adultNum} Adult <br/>{this.state.childNum} Child
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            })
                                                        }
                                                    </table>
                                                    <div className="customer-requests">Customer Requests ：{this.state.orderDetailObj.customerRequest}
                                                    </div>
                                                    <div className="requests-explain">The remarks for the establishment are
                                                        for reference
                                                        only. We cannot guarantee them.
                                                    </div>
                                                </div>
                                                <div className="hotel-msg">
                                                    <div className="hotel-msg-head">Hotel Information</div>
                                                    <table>
                                                        <tr>
                                                            <td>Hotel Name：{this.state.hotelNameEn}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Hotel address：{this.state.hotelAddress}</td>
                                                        </tr>
                                                        <tr>
                                                            {
                                                                this.state.hotelPhone ?
                                                                    <td>Hotel Tel：{this.state.hotelPhone}</td>
                                                                    : <td></td>
                                                            }
                                                        </tr>
                                                    </table>
                                                </div>
                                                <div className="attention">
                                                    <div className="attention-head">Attention</div>
                                                    <div className="attention-msgs">
                                                        <div className="head">Check-in Issues：</div>
                                                        <p>
                                                            1.Please provide your valid passport or your English name on the
                                                            passport when checking-in on the hotel front desk, in order to
                                                            search your booking information.
                                                        </p>
                                                        <p>
                                                            2.If the booking is not found or unable to arrange accordingly
                                                            when arriving the hotel, please contact your travel agency
                                                            immediately.If you decide to check in without notifying your
                                                            travel agency, that means you have given up the indemnificatory
                                                            rights voluntarily.
                                                        </p>
                                                    </div>
                                                    <div className="attention-msgs noshow">
                                                        <div className="head">No Show or Late Check In：</div>
                                                        <p className="have-padding-bottom">
                                                            In case of late arrival, please inform the hotel or your travel
                                                            agency in advance, otherwise, the booking may be released by the
                                                            hotel without any notification and with full charge.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                        :( <div className="ch-and-en">
                                                <div className="border1"></div>
                                                <div className="border2"></div>
                                                <div className='order-detail-header'>
                                                    <div className="title">Hotel Voucher 酒店入住凭证</div>
                                                    <div className="select" onClick={this.handleSelectShow.bind(this)} onMouseLeave={this.mouseLeave.bind(this)}><strong>中英双语</strong> <em></em>
                                                        {
                                                            this.state.isSelectShow?
                                                                (<ul className="selectlist" >
                                                                    <li  className={`li1 select-icon ${this.state.select}`}  onMouseEnter={this.mouseIn.bind(this)} onMouseLeave={this.mouseOut.bind(this)}>中英双语</li>
                                                                    <li  className="li2 select-icon lastli"  onClick={this.handleClick.bind(this)} onMouseEnter={this.mouseIn.bind(this)} onMouseLeave={this.mouseOut.bind(this)}>英文版</li>
                                                                </ul>)
                                                                :null
                                                        }
                                                    </div>
                                                </div>
                                                {/*新的预订*/}
                                                <div className="yuding-msg">
                                                    <div className="yuding-head">Booking Information 预订信息</div>
                                                    <table className="yuding-table1">
                                                        <tr>
                                                            <td>Check-In Date（入住日期）：{this.state.checkinDate.substr(0, 10)}</td>
                                                            <td>Check-out Date（离店日期）：{this.state.checkoutDate.substr(0, 10)}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>No. of Night(s)（入住晚数）：{this.state.numOfStay}</td>
                                                            <td>No. of Room(s)（房间数）：{this.state.numOfRooms}</td>
                                                        </tr>
                                                        <tr>
                                                            {
                                                                this.state.misConfirmNo?
                                                                    <td>ConfirmNo（酒店确认号）：{this.state.misConfirmNo}</td>
                                                                    :null
                                                            }
                                                            <td>Agent Reference No（旅行社参考订单号）：{this.state.orderNo}</td>
                                                        </tr>
                                                    </table>
                                                    <table className="yuding-table2">
                                                        <tr className="table2-msgs table2-column">
                                                            <td className="room-type  first-td">Unit<br/>(房间编号)</td>
                                                            <td className="guests">Guest's<br/>(入住人)</td>
                                                            <td className="num-of-nights">Room Type<br/>(房型)</td>
                                                            <td className="num-of-rooms">Bed Type<br/>(床型)</td>
                                                            <td className="breakfast">Breakfast<br/>(早餐)</td>
                                                            <td className="pax  last-td">Pax <br/>(住客人数)</td>
                                                        </tr>
                                                        
                                                        {
                                                            this.state.roomGuestList && this.state.roomGuestList.map((val, index) => {
                                                                return (
                                                                    <tr className="table2-msgs" key={index}>
                                                                        <td className="room-type">{index + 1}</td>
                                                                        <td className="guests">
                                                                            {
                                                                                val.guestList.map((val,index)=>{
                                                                                    return (<div>
                                                                                        <span>{this.getGuestNames(val)}</span>
                                                                                        <br/>
                                                                                    </div>)
                                                                                })
                                                                            }
                                                                        </td>
                                                                        <td className="room-type">{this.state.roomTypeName}</td>
                                                                        <td className="bed-type">{this.state.bedTypeName}</td>
                                                                        <td className="breakfast">{this.state.breakfastType == 1 ? 'Include' : 'Not Include'}({this.state.breakfastTypeName})</td>
                                                                        <td className="pax">{this.state.adultNum} Adult(成人) <br/>{this.state.childNum} Child(儿童)
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            })
                                                        }
                                                    </table>
                                                    <div className="customer-requests">Customer Requests （其他需求）： {this.state.orderDetailObj.customerRequest}
                                                    </div>
                                                    <div className="requests-explain">The remarks for the establishment are for
                                                        reference only. We cannot guarantee them.(客户需求仅供参考不作保证。)
                                                    </div>
                                                </div>
                                                {/*新的酒店*/}
                                                <div className="hotel-msg">
                                                    <div className="hotel-msg-head">Hotel Information 酒店信息</div>
                                                    <table>
                                                        <tr>
                                                            <td>Hotel Name（酒店名称）：{this.state.hotelNameEn} {this.state.hotelName}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Hotel address（酒店地址）：{this.state.hotelAddress}</td>
                                                        </tr>
                                                        <tr>
                                                            {
                                                                this.state.hotelPhone?
                                                                    <td>Hotel Tel（酒店电话）：{this.state.hotelPhone}</td>
                                                                    :<td></td>
                                                            }
                                                        </tr>
                                                    </table>
                                                </div>
                                                {/*新的注意事项*/}
                                                <div className="attention">
                                                    <div className="attention-head">Attention 注意事项</div>
                                                    <div className="attention-msgs">
                                                        <div className="head">入住问题处理：</div>
                                                        <p>
                                                            1. 请您于酒店前台办理入住手续时出示您的有效护照证件或提供您护照证件上的英文名，以便酒店前台准确查询到您的预订信息；
                                                        </p>
                                                        <p>
                                                            2.
                                                            如出现到店无房、订单确认后酒店告知无法安排入住等情况，请及时联系为您预订酒店的旅行社或酒店代理。如果未联系而自行入住其他酒店等，视为您放弃了订单保障权利。
                                                        </p>
                                                    </div>
                                                    <div className="attention-msgs noshow">
                                                        <div className="head">未到店(No show)或晚至：</div>
                                                        <p className="have-padding-bottom">
                                                            如订单首晚未到店(No show)或延迟入住请务必联系酒店或旅行社，否则会有整单被取消的风险。
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                }
                            </div>
                            <div className="footerBtn">
                                <a href={`/api/hotel/v1.0/confirm/${this.state.isEn?'pdfEn':'pdf'}?orderNo=${this.state.orderNo}`}
                                   className="down-btn">
                                    <div className="download-pdf"></div>
                                </a>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state){
    return {
        order: state.order
    }
}

export default connect(mapStateToProps)(App);
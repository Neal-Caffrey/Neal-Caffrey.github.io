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
import Footer from 'contents/footer/index.jsx';
import UIOrderStatus from 'components/ui-order-detail-status/index.jsx';
import Marks from 'components/ui-mark/index.jsx';
import BaseCss from 'local-BaseCss/dist/main.css';
import 'components/globleCss/index.scss';
import UiConsult from "components/ui-consult/index.jsx";
import '../sass/index.scss';
import './sass/index.scss';
import Request from 'local-Ajax/dist/main.js';
import UIMsg from 'components/ui-msg/index.jsx'
import {
    Button
} from 'local-Antd';
import UIStar from 'components/ui-star/index.jsx';
import UIPay from 'components/ui-pay/index.jsx';
import Storage from 'local-Storage/dist/main.js';
import ApiConfig from 'widgets/apiConfig/index.js';
import Countdown from 'components/ui-countDown/index.jsx';
import Steps from './contents/steps/index.jsx';
// debugger;
const ISShowConsult = ((domain) => {
    let reg = /www/;
    return reg.test(domain);
})(document.domain);
class App extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = this.defaultState;
        this.getOrderDetail();
    }

    get defaultState() {
        return {
            canDoCancel: false, // 需填写信息才能取消订单
            onError: false,
            hasCancelTxt: false, //取消扣款说明
        };
    }

    get appInfo() {
        return this.storage.get(ApiConfig.storageKey.hotel_app_info);
    }

    get storage() {
        return this._storage = new Storage;
    }

    get canDoCancel() {
        return this.state.canDoCancel;
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
        // debugger
        if (!arr) {
            return
        }
        let res = [];
        for (let i = 0; i < arr.length; i++) {
            res.push(arr[i].lastName + ' ' + arr[i].firstName)
        }

        let others = res.slice(1);
        let show = {
            'main': `主入住人：${res[0]}`,
            'others': (others.length < 1 ? '' : `其他入住人：${others.join(', ')}`)
        }
        return show;
    }

    canOrder(oNo, res) {
        let request = new Request();
        request.ajax({
            type: 'POST',
            headers: {
                // 'Content-Type': 'application/json'
            },
            // url: `${ApiConfig.apiHost}api/price/v1.0/confirmHotelQuote`,
            url: ApiConfig.canOrder,
            data: {
                orderNo: oNo,
                cancelReason: res,
                optName: this.appInfo.agentInfo.agentUserName,
                optId: this.appInfo.agentInfo.agentUserId
            }
        }).then(val => {
            if (val.status == 200) {
                this.getOrderDetail();
            } else {
                this.Error = {
                    content: val.message
                }
                this.setState({
                        onError: true,
                        canPop: false
                    })
                    // alert(val.message);
            }

        })
    }

    goToHotelDetail(hid) {
        location.href = './detail.html?hotelId=' + hid;
    }

    getTicket(ticket, price) {
        let str = ticket ? '票面价<em>&yen;<code>' + ticket + '</code></em>&nbsp;&nbsp' : '';
        str += '预订金额<em>&yen;<code>' + price + '</code></em>';
        return str;
    }

    goTopay(type = +type) {
        let url = '';
        if (type == 0) {
            url = ApiConfig.accountPay;
        } else {
            var newTab = window.open('about:blank');
            url = ApiConfig.aliPay;
            this.setState({
                aliPop: true
            })
        }
        let request = new Request();
        request.ajax({
            type: 'POST',
            headers: {
                // 'Content-Type': 'application/json'
            },
            // url: `${ApiConfig.apiHost}api/price/v1.0/confirmHotelQuote`,
            url: `${url}`,
            data: {
                orderNo: this.state.orderNo,
                priceChannel: this.state.priceChannel
            }
        }).then(val => {
            if (val.status == 200) {
                if (type == 0) {
                    alert('支付成功~');
                    window.location.reload();
                }
                if (type == 1) {
                    // window.open(val.data.payurl);
                    newTab.location.href = val.data.payurl;
                }
            } else {
                this.Error = {
                    content: val.message
                }
                this.setState({
                        onError: true,
                        aliPop: false
                    })
                    // alert(val.message);
            }

        })
    }

    gotoEdit() {
        window.location.href = `./edit.html?orderNo=${this.state.orderNo}`;
    }

    getCancelTips() {
        let request = new Request();
        request.ajax({
            type: 'GET',
            headers: {
                // 'Content-Type': 'application/json'
            },
            url: `${ApiConfig.cancelTips}?orderNo=${this.getOrderNo()}`,
        }).then(val => {
            if (val.status == 200) {
                if (val.data.type == 1) {
                    this.cancelTxt = `将扣款<i>￥${this.state.priceChannel}</i>`
                }
                if (val.data.type == 2) {
                    this.cancelTxt = '不会扣款';
                }
                if (val.data.type == 3) {
                    this.cancelTxt = `将扣款<i>￥${val.data.totalRoomAmount}</i>`
                }
                this.setState({
                    hasCancelTxt: true
                })
            } else {
                this.Error = {
                    content: val.message
                }
                this.setState({
                        onError: true,
                        canPop: false
                    })
                    // alert(val.message);
            }

        })
    }

    renderUIPay() {
        if (this.state.orderStatus != '1001') {
            return null;
        }
        return (
            <UIPay
                status={this.state.orderStatus}
                channelPrice={this.state.priceChannel}
                tickPrice={this.state.priceTicket}
                supportBalancePay={this.appInfo.agentInfo.supportBalancePay}
                account={this.appInfo.accountInfo.totalAmount}
                onClickPay={this.goTopay.bind(this)}
                onClickCan={this.canPop.bind(this)}
                cancelEnable={this.state.cancelEnable}
            />
        )
    }
    canPop() {
        this.setState({
            canPop: true
        });
    }

    countDownBack() {
        window.location.reload();
    }

    getOrderTips() {
        if (!this.state.orderStatus || this.state.orderStatus != 1001) {
            return null;
        }
        if (!this.state.payDeadLineCountDown) {
            return (
                <span className="WG-OrderStaTip">订单即将取消</span>
            )
        }

        return (
            <span className="WG-OrderStaTip">请于<span> <Countdown callback={this.countDownBack.bind(this)} time={this.state.payDeadLineCountDown}/> </span>内确认订单信息并完成付款，以免房间售罄或价格发生变化。</span>
        )
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

            renderCanConfirm() {
                    if (!this.state.canPop) return null;
                    if (!this.state.hasCancelTxt) {
                        this.getCancelTips();
                    }

                    if (this.state.hasCancelTxt) {
                        return ( < UIMsg initData = {
                                {
                                    title: '取消订单',
                                    showFlag: this.state.canPop,
                                    showType: 'confirm',
                                    asyn: true,
                                    backHandle: this.confirmClick.bind(this)
                                }
                            }
                            disabled = {
                                this.canDoCancel
                            } >
                            <p className="cancelTxt">根据取消规则，现在取消订单<span dangerouslySetInnerHTML={{__html: this.cancelTxt}}></span>，是否继续？</p> < Marks placeholder = '请输入取消原因'
                            onHandle = {
                                this.getCustomerRequest.bind(this)
                            }
                            name = 'userMark'

                            / > < /UIMsg>)
                        }

                    }
                    closeError() {
                        this.Error = null;
                        this.setState({
                            onError: false
                        })
                    }
                    renderErrorAlert() {
                        if (!this.state.onError) return null;
                        return ( < UIMsg initData = {
                                {
                                    title: '确认取消订单?',
                                    showFlag: true,
                                    showType: 'alert',
                                    backHandle: this.closeError.bind(this)
                                }
                            } > <p>{this.Error.content}</p> < /UIMsg>)
                        }
                        confirmClick(type) {
                            if (type == 'confirm') {
                                //goto canncel
                                this.canOrder(this.state.orderNo, this.state.resVal)

                            } else if (type == 'ok' || type == 'close') {
                                // this.getOrderDetail();
                                window.location.reload();
                            } else {
                                this.setState({
                                    canPop: false
                                })
                            }
                        }

                        getCustomerRequest(mark) {
                            let states = {};
                            if (mark && mark.value) {
                                states.canDoCancel = true;
                                states.resVal = mark.value;
                            } else {
                                states.canDoCancel = false;
                            }

                            this.setState(states);
                        }
                        goToConfirm() {
                            window.location.href = `/webapp/hotel/confirm.html?orderNo=${this.getOrderNo()}`;
                        }
                        _renderCancelPolicy(data) {
                            let showItem = '';
                            let item = data;
                            if (item.type == 1) {
                                showItem = '不可取消';
                                if (item.fromTime) {
                                    showItem = `${item.fromTime}之后不可取消`;
                                }
                            } else if (item.type == 2) {
                                showItem = '• 免费取消';
                                if (item.toTime) {
                                    showItem = `${item.toTime}之前免费取消`;
                                }
                            } else if (item.type == 3) {
                                showItem = '• 付费取消';
                                if (item.fromTime) {
                                    if (item.toTime) {
                                        showItem = item.fromTime + '-' + item.toTime + '之间取消订单，需要扣金额￥' + item.totalRoomAmount;
                                    } else {
                                        showItem = `${item.fromTime}后取消，需要扣金额￥${item.totalRoomAmount}`;
                                    }
                                } else {
                                    // 无fromTime
                                    if (item.toTime) {
                                        showItem = `${item.toTime}之前取消，扣款￥${item.totalRoomAmount}`;
                                    }
                                }
                            }
                            return (
                                <span>
                {showItem}
            </span>
                            )
                        }
                        render() {
                            if (!this.state.orderNo) {
                                return null;
                            }
                            return (
                                <div id='ui-wrap'>
            <Header active={5}/>
                <div className='ui-main ui-fixed-footer'>
                    <div className="order-detail-main">
                        {
                            (this.state.orderStatus == '2001' ||
                            this.state.orderStatus == '2020' ||
                            this.state.orderStatus == '2010' ||
                            this.state.orderStatus == '3001' ||
                            this.state.orderStatus == '3006') ?
                            <Steps status={this.state.orderStatus}/> :
                            <UIOrderStatus
                                type="hotel"
                                statusDes={this.state.orderStatusName}
                                status={this.state.orderStatus}
                                payDeadLineTime={this.state.payDeadLineTime}
                            >
                                <span className="WG-OrderStaDes">{this.state.orderStatusName}</span>
                                {this.getOrderTips()}

                            </UIOrderStatus>
                        }

                        <div className='order-detail-wrap'>
                            <div className='order-detail-header'>
                                <p>
                                    订单详情
                                <span dangerouslySetInnerHTML={{__html: this.getTicket(this.state.priceTicket, this.state.priceChannel)}}></span>
                                </p>
                                <div className='order-detail-btns'>
                                    {/*(this.state.orderStatus == 2010 || this.state.orderStatus == 3001)?
                                        <Button className="btn-full" style={{marginRight:'20px'}} onClick={()=>window.location.href='confirm.html?orderNo='+this.state.orderNo}>

                                            查看确认单
                                        </Button>: null
                                    */}
                                    {(this.state.orderStatus == 2010 || this.state.orderStatus == 3001)?
                                        <a className="btn-full" target="_blank" style={{marginRight:'20px'}} href={`confirm.html?orderNo=${this.state.orderNo}`}>
                                            查看确认单
                                        </a>: null
                                    }
                                    {(this.state.orderStatus == 2010 || this.state.orderStatus == 3001 || this.state.orderStatus == 3004 || this.state.orderStatus == 3008 || this.state.orderStatus == 3005 || this.state.orderStatus ==3007)?
                                        <a className="btn-full" target="_blank" style={{marginRight:'20px'}} href={`settlement.html?orderNo=${this.state.orderNo}`}>
                                            查看结算单
                                        </a>: null
                                    }
                                    {
                                        (this.state.cancelEnable === 1 && (this.state.orderStatus == 2001 || this.state.orderStatus == 2010 || this.state.orderStatus==2020))?
                                            <Button className="btn-fill"
                                                    onClick={()=>{this.setState({canPop:true})}}>
                                                取消订单
                                            </Button> :
                                            null
                                    }

                                </div>
                            </div>
                            <div className='order-detail-goods'>
                                <div className='order-detail-img'
                                     style={this.state.orderDetailObj.hotel.hotelVo.defaultHotelImage?{backgroundImage:`url('${this.state.orderDetailObj.hotel.hotelVo.defaultHotelImage}')`}:{}}>

                                </div>
                                <div className='order-detail-goods-des'>
                                    <div className='order-detail-goods-title'>
                                        <p>{this.state.hotelName}</p>
                                        <p>{this.state.hotelNameEn}</p>
                                    </div>
                                    <div className='order-detail-goods-rate'>
                                        <UIStar score={this.state.orderDetailObj.hotel.hotelVo.starRating-0}/>
                                    </div>
                                    <div className='order-detail-goods-add'>
                                        <p>地址：{this.state.hotelAddress}</p>
                                    </div>
                                    <div className='order-detail-goods-add'>
                                        {this.state.hotelPhone?<p>电话：{this.state.hotelPhone}</p>:null}
                                    </div>
                                </div>
                            </div>
                            <div className='order-detail-pass'>
                                <p>预订信息</p>
                                <table>
                                    <tbody>
                                    <tr>
                                        <td>订单号：{this.state.orderNo}</td>
                                        <td>第三方订单号：{this.state.agentOrderNo || '未填写'}</td>
                                        <td>入住日期： {this.state.checkinDate.substr(0,10)}</td>

                                    </tr>
                                    <tr>
                                        <td>离店日期： {this.state.checkoutDate.substr(0,10)}</td>
                                        <td>入住晚数： {this.state.numOfStay}晚</td>
                                        <td>床型： {this.state.bedTypeName}</td>
                                    </tr>
                                    <tr>
                                        <td>早餐：{this.state.breakfastTypeName}</td>
                                        <td>房间类型： <span>{this.state.roomTypeName}（{this.state.numOfRooms}间）</span></td>
                                        <td></td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className='order-detail-pass'>
                            <p>住客信息
                                {this.state.orderStatus == '1001' && <a className='edit' href='javascript:;' onClick={this.gotoEdit.bind(this)}>修改&nbsp;&gt;</a>}
                            </p>
                                <table className="pass-info">
                                    <tbody>
                                    <tr>
                                        <td>
                                            <div className='flex'>
                                                <span>入住人数：</span>
                                                <div className='flex1'>{this.state.adultNum}成人，{this.state.childNum}儿童（{this.state.roomGuestList && this.state.roomGuestList.length}间）</div>
                                                <div className="flex2"><span>客人国籍：</span>{this.state.guestNationalityName}</div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            {
                                                this.state.roomGuestList && this.state.roomGuestList.map((val, index)=> {
                                                    return  (
                                                        <div key={index}  className='flex'>
                                                            <span>房间{index + 1}：</span>
                                                            <div className='flex1'>
                                                                {this.getGuestNames(val.guestList).main}
                                                            </div>

                                                            {val.guestList.length > 1 ? <div className='flex2'>{this.getGuestNames(val.guestList).others}</div> : null}
                                                        </div>
                                                    )
                                                })
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div className='flex'>
                                                <span>入住说明：</span>
                                                <ul className='flex1'>
                                                    <li>1.客人国籍：如实际入住人与订单国籍不符，可能导致无法入住。</li>
                                                    <li>2.入住人数：每间房间价格仅适用于<em className="numColor">{this.state.adultNum}成人</em> <em className="numColor">{this.state.childNum}儿童</em>，如果实际入住人数与订单不符，需客人与酒店前台协商解决。</li>
                                                    <li>3.入住人姓名：请务必按照实际入住人证件上的英文/拼音姓名填写。</li>
                                                    <li>4.主入住人：办理入住时，酒店以此姓名进行预订查询，如填写错误酒店查无预订会导致客人无法入住。</li>
                                                    <li>5.其他入住人：其他入住人姓名仅在入住凭证上展示，不能独自到酒店办理入住。</li>
                                                </ul>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div className='flex'>
                                                <span>其他要求：</span>
                                                <div className='flex1'>
                                                    {this.state.orderDetailObj.customerRequest || '未填写'}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className='order-detail-pass'>
                                <p>联系人信息{this.state.orderStatus == '1001' && <a className='edit' href='javascript:;' onClick={this.gotoEdit.bind(this)}>修改&nbsp;&gt;</a>}</p>
                                <table>
                                    <tbody>
                                    <tr>
                                        <td>联系人姓名：{this.state.contactName}</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            联系人电话：{this.state.contactAreaCode} {this.state.contactMobile}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            联系人邮箱：{this.state.contactEmail}
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className='order-detail-pass'>
                                <p>取消政策</p>
                                <table>
                                    <tbody>
                                    {
                                        this.state.cancelRuleObj.map((val, index)=> {
                                            return (
                                            <tr key={index}><td>{this._renderCancelPolicy(val)}</td></tr>
                                            )
                                        })
                                    }
                                    </tbody>
                                </table>
                            </div>
                            <div className='order-detail-pass'>
                                <p>注意事项</p>
                                <table>
                                    <tbody>
                                        <tr><td>1.  首晚不能到店入住或延后入住，请务必提前联系我方客服通知酒店，否则会有被酒店整单取消并不退费的风险。</td></tr>
                                        <tr><td>2.  重大节日或庆典期间，酒店有可能向客人直接收取强制性消费项目。</td></tr>
                                        <tr><td style={{paddingTop:'10px'}}>下单问题请联系客服，客服联系方式：</td></tr>
                                        <tr className='service'><td>电话：<b>400-060-0766</b>（7X24小时）<span>邮箱：<a href="mailto:hotelservice@yundijie.com">hotelservice@yundijie.com</a></span></td></tr>
                                    </tbody>
                                </table>

                            </div>
                            {
                                this.state.orderStatus != '1001' ?
                                    <div className="order-detail-reorder">
                                        <Button className="btn-full"
                                                onClick={this.goToHotelDetail.bind(this,this.state.hotelId)}>
                                            继续下单
                                        </Button>
                                    </div> :
                                    null
                            }

                            {this.renderUIPay()}
                            {this.renderCanConfirm()}
                            {this.renderAlipayAlert()}
                            {this.renderErrorAlert()}
                        </div>
                    </div>
                </div>
                {ISShowConsult ? <UiConsult /> : null}
                {ISShowConsult ? <Footer /> : null}
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
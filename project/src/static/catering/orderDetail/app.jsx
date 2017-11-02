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
import OrderCancel from './contents/cancel/index.jsx';
import BaseCss from 'local-BaseCss/dist/main.css';
import 'components/globleCss/index.scss';
import UiConsult from "components/ui-consult/index.jsx";
import '../sass/index.scss';
import './sass/index.scss';
import YdjAjax from 'components/ydj-Ajax/index.js';
import UIMsg from 'components/ui-msg/index.jsx';
import {
    Button
} from 'local-Antd';
import UIPay from 'components/ui-pay/index.jsx';
import Storage from 'local-Storage/dist/main.js';
import ApiConfig from 'widgets/apiConfig/index.js';
import Loading from 'components/ui-loading/index.jsx';
import Countdown from 'components/ui-countDown/index.jsx';
import MInput from 'components/ui-input/index.jsx';
const ISShowConsult = ((domain)=>{
  let reg = /www/;
  return reg.test(domain);
})(document.domain);
class App extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = this.defaultState;
        this.orderNo = this.getOrderNo();
        // this.ticketInfo={};//票面价信息
    }

    componentWillMount() {
        // debugger
        if (this.props.header.info) {
            this.agentInfo = this.props.header.info.agentInfo;
            this.getOrderDetail();
        }
    }
    componentWillReceiveProps(nextProps) {
        // debugger
        if (!this.props.header.info && nextProps.header.info) {
            this.agentInfo = nextProps.header.info.agentInfo;
            this.getOrderDetail();
        }
    }

    get defaultState() {
        return {
            canDoCancel: false, // 需填写信息才能取消订单
            onError: false,
            isLoading: false,
            changeTicket: false
        };
    }

    get storage() {
        return this._storage = new Storage;
    }

    get canDoCancel() {
        return this.state.canDoCancel;
    }

    get _handleError() {
        let handles = {
            failedHandle: (res) => {
                // debugger
                // 业务异常信息
                this.Error = {
                    content: res.message
                }
                this.setState({
                    onError: true,
                    canPop: false,
                    isLoading: false
                })
            },
            errorHandle: (xhr, errorType, error, errorMsg) => {
                // debugger
                // 登录异常信息+请求发送
                this.Error = {
                    content: errorMsg.msg,
                    goLogin: errorMsg.goLogin
                }
                this.setState({
                    onError: true,
                    canPop: false,
                    isLoading: false
                })
            }
        };
        return handles;
    }
    getOrderDetail() {
        this.setState({
            isLoading: true
        })
        let opt = _extend({
            url: `${ApiConfig.cateringOrderDetail}?orderNo=${this.orderNo}&agentId=${this.getAgentId()}`,
            successHandle: (res) => {
                this.setState({
                    ...res.data,
                    canPop: false,
                    aliPop: false,
                    isLoading: false
                })
            },
        }, this._handleError);
        // debugger
        new YdjAjax(opt);
    }

    getOrderNo() {
        return _getQueryObjJson().orderNo;
    }

    getAgentId() {
        let agentId =  this.agentInfo.agentId;
        if (this.agentInfo.agentUserType == 1) {
            state.opId = this.agentInfo.agentUserId;
        }
        return agentId;
    }


    canOrder(oNo, res) {
        if(!res) {
            return;
        }
        this.setState({
            isLoading: true
        });
        // debugger
        let data = {
            'orderNo': oNo, // 订单号 必填
            'agentId': this.agentInfo.agentId, //渠道 必填
            'agentOpName': this.agentInfo.agentUserName, // 操作人名字 必填
            'agentOpId': this.agentInfo.agentUserId, //渠道 必填
            'optName': this.agentInfo.agentUserName, // 操作人名字 必填
            'isAdmin': this.agentInfo.agentUserType == 1 ? false : true, // 是否是管理员 必填 true 管理员 false 操作员 必填
            'cancelReason': res.txt,
            'cancelReasonId': res.id
        };

        // debugger

        let opt = _extend({
            url: ApiConfig.fxCanOrder,
            type: 'POST',
            data: data,
            successHandle: (res) => {
                // debugger
                this.setState({
                    isLoading: false
                })
                this.getOrderDetail();
            }
        }, this._handleError);
        new YdjAjax(opt);
    }

    goToMerchantDetail(merchantNo) {
        location.href = './detail.html?merchantNo=' + merchantNo;
    }

    /**
     * [changeTicket 修改票面价]
     */
    changeTicket() {
        this.setState({
            changeTicket: true
        })
    }
    /**
     * [saveTicket 保存票面价修改]
     */
    saveTicket() {
        // alert(this.priceTicket)
        if(!this.priceTicket){
            alert("不能为空")
            return false;
        }else{
            if(!/^\d+$/.test(this.priceTicket)){
               alert("请填写数字");
               return false;
            }
        }
        let data = {
            orderNo: this.orderNo,
            opId: this.agentInfo.agentUserId,
            opname: this.agentInfo.agentUserName,
            priceTicket: this.priceTicket
        }
        let opt = _extend({
            url: ApiConfig.cateringTicketPrice,
            type: 'POST',
            data: data,
            successHandle: (res) => {
                this.setState({
                    changeTicket: false,
                    priceTicket: this.priceTicket
                })
            }
        }, this._handleError);
        new YdjAjax(opt);
    }
    /**
     * [_getTicketInfo 获取票面价输入内容]
     */
    _getTicketInfo(info) {
        this.priceTicket= info.value;
    }

    goTopay(type = +type) {
        let url = '';
        if (type == 0) {
            url = ApiConfig.fxAccountPay;
        } else {
            var newTab = window.open('about:blank');
            url = ApiConfig.fxAliPay;
            this.setState({
                aliPop: true
            })
        }
        this.setState({
            isLoading: true
        })
        let handles = type == 0 ? this._handleError : {
            failedHandle: (res) => {
                // debugger
                // 业务异常信息
                this.Error = {
                    content: res.message
                }
                this.setState({
                        onError: true,
                        canPop: false,
                        isLoading: false,
                        aliPop: false
                    })
            },
            errorHandle: (xhr, errorType, error, errorMsg) => {
                // debugger
                // 登录异常信息+请求发送
                this.Error = {
                    content: errorMsg.msg,
                    goLogin: errorMsg.goLogin
                }
                this.setState({
                    onError: true,
                    canPop: false,
                    isLoading: false,
                    aliPop: false
                })
            }
        };
        let opt = _extend({
            url: url,
            type: 'POST',
            data: {
                orderNo: this.state.orderNo,
                priceChannel: this.state.orderSettleRsp.shouldPrice
            },
            successHandle: (res) => {
                // debugger
                this.setState({
                    isLoading: false
                })
                if (type == 0) {
                    window.location.href = `./payStatus.html?orderNo=${this.getOrderNo()}`;
                }
                if (type == 1) {
                    newTab.location.href = res.data.payurl;
                }
            }
        }, handles);
        new YdjAjax(opt);
    }

    renderUIPay() {
        if (this.state.orderStatus != '1001') {
            return null;
        }
        return (
            <UIPay
                status={this.state.orderStatus}
                supportBalancePay={this.props.header.info.agentInfo.supportBalancePay}
                channelPrice={this.state.orderSettleRsp.shouldPrice}
                account={this.props.header.info.accountInfo.totalAmount}
                onClickPay={this.goTopay.bind(this)}
            />
        )
    }
    /**
     * 倒计时结束，刷新页面
     */
    countDownBack() {
        window.location.reload();
    }

    getOrderTips() {
        if (!this.state.orderStatus || this.state.orderStatus != 1001) {
            return null;
        }
        if (this.state.paySpan == 0) {
            return (
                <span className="WG-OrderStaTip"><span>订单即将取消</span></span>
            )
        }
        return (
            <span className="WG-OrderStaTip">请于<span> <Countdown callback={this.countDownBack.bind(this)} time={this.state.paySpan}/> </span>内完成支付</span>
            // <span className="WG-OrderStaTip">请于<span>{this.state.payDeadLineTime}</span>前完成支付</span>
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

    // renderCanConfirm() {
    //     if (!this.state.canPop) return null;
    //     return ( < UIMsg initData = {
    //             {
    //                 title: '确认取消订单?',
    //                 showFlag: this.state.canPop,
    //                 showType: 'confirm',
    //                 asyn: true,
    //                 backHandle: this.confirmClick.bind(this)
    //             }
    //         }
    //         disabled = {
    //             this.canDoCancel
    //         } > <Marks
    //         placeholder='请输入取消原因'
    //         onHandle={this.getCustomerRequest.bind(this)}
    //         name='userMark'

    //         /> < /UIMsg>)
    // }

    closeError(goLogin) {
        // debugger
        if(goLogin) {
            window.location.href = '/';
        } else {
            this.Error = null;
            this.setState({
                onError: false
            })
        }

    }

    renderErrorAlert() {
        // debugger
        if (!this.state.onError) return null;
        return ( < UIMsg initData = {
                {
                    title: this.Error.title || '错误提示',
                    showFlag: true,
                    showType: 'alert',
                    backHandle: this.closeError.bind(this, this.Error.goLogin)
                }
            } > <p>{this.Error.content}</p> < /UIMsg>)
    }

    confirmClick(type) {
        if (type == 'confirm') {
            //goto canncel
            // this.canOrder(this.state.orderNo, this.state.resVal)

        } else if (type == 'ok' || type == 'close') {
            window.location.reload();
        } else {
            this.setState({
                canPop: false
            })
        }
    }

    renderLoading() {
        // debugger
        if (!this.state.isLoading) return null;
        return ( <Loading/>)
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
    _frozenBody(flag){
        let attr = flag?'hidden': 'scroll';
        document.body.style.overflow = attr;
    }

   renderFee() {
        if(this.state.orderSettleRsp.saleType == 2) {
            // 服务费模式
            <td className="remark">
                <span>商家佣金</span><em>&yen;{this.state.priceGuide}</em>（结算完成后会充值到账户余额中）
            </td>
        }

        if(this.state.gOrderStatus == 5) {
            return (
                <td className="remark">
                    <span>商家佣金</span><em>&yen;{this.state.priceGuide}</em>（返佣已充值到账户余额中）
                </td>
            );
        } else if(this.state.gOrderStatus == 6 && this.state.gOrderStatus) {
            return (
                <td className="remark">
                    <span>商家佣金</span><em>&yen;{this.state.refundToGuideAmount}</em>（结算完成后会充值到账户余额中）
                </td>
            )
        } else {
            return (
                <td className="remark">
                    <span>预估返佣</span><em>&yen;{this.state.priceGuide}</em>（具体返佣以客户实际消费为准）
                </td>
            )
        }
    }

    render() {
        return (
            <div id='ui-wrap'>
                <Header active={4} />
                <div className='ui-main ui-fixed-footer'>
                {(()=>{
                    let res = [];
                    if (this.state.orderNo) {
                        res.push(

                            <div className="order-detail-main">
                                <UIOrderStatus
                                    type="hotel"
                                    statusDes={this.state.orderStatusName}
                                    status={this.state.orderStatus}
                                    payDeadLineTime={this.state.payDeadLineTime}
                                >
                                <span className="WG-OrderStaDes">{this.state.orderStatusName}</span>
                                    {this.getOrderTips()}

                                </UIOrderStatus>
                                <div className='order-detail-wrap'>
                                    <div className='order-detail-header'>
                                        <p>
                                            订单详情
                                            <span className="price-box">
                                                <span className="ticket-box">
                                                {
                                                    this.state.orderStatus == "1001" && this.state.priceTicket?
                                                        !this.state.changeTicket ?
                                                        <span>票面价&nbsp;RMB&nbsp;<strong>{this.state.priceTicket}</strong><a onClick={this.changeTicket.bind(this)}>修改</a></span>
                                                        :
                                                        <span>票面价
                                                            <var className="input-box">
                                                            <b className="rmb">RMB</b>
                                                            <MInput
                                                            className='price-ticket'
                                                            name='priceTicket'
                                                            sign='票面价'
                                                            reg={/^\d+$/}
                                                            onHandle={this._getTicketInfo.bind(this)}
                                                            />
                                                            </var>
                                                            <a onClick={this.saveTicket.bind(this)}>保存</a>
                                                        </span>
                                                    : null
                                                }
                                                </span>
                                                {
                                                    <span>预订金额 RMB<em><code>{this.state.orderSettleRsp.shouldPrice}</code></em></span>
                                                }
                                            </span>
                                        </p>
                                        {
                                            (this.state.orderStatus == 2001 || this.state.orderStatus == 2030)?
                                            <div className='order-detail-btns'>
                                                <Button className="btn-fill"
                                                        onClick={()=>{
                                                            this.setState({canPop:true}, ()=> {
                                                                this._frozenBody(true);
                                                            })}}>
                                                    取消订单
                                                </Button>
                                            </div>:
                                            null
                                        }
                                    </div>

                                    <div className='order-detail-pass'>
                                        <p>预订信息</p>
                                        {
                                            this.state.orderStatus == 1001 ?
                                            <table className="pass-info">
                                                <tbody>
                                                    <tr className="special">
                                                        <td className="remark">
                                                            <span>商家信息</span>
                                                            <a className="goMerchant" target="_blank" href={`detail.html?merchantNo=${this.state.merchantNo}`}>{this.state.merchantName}</a>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="remark">
                                                            <span>订单号</span>{this.getOrderNo()}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="remark">
                                                            <span>预约时间</span>{this.state.serviceTime.substr(0,16)}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="remark"><span>用餐人数</span>{this.state.orderSettleRsp.personNum}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="remark nl2br" colSpan="3"><span>备注</span><span className='remark-cont'>{this.state.userRemark || '未填写'}</span></td>
                                                    </tr>
                                                </tbody>
                                            </table> :
                                            <table>
                                               <tbody>
                                                   <tr className="special">
                                                        <td className="t-time">订单号：{this.state.orderNo}</td>
                                                       <td className="t-time">预约时间：{this.state.serviceTime.substr(0,16)}</td>
                                                       <td>用餐人数： {this.state.orderSettleRsp.personNum}</td>
                                                   </tr>
                                                   <tr>
                                                       <td className="nl2br" colSpan="3">备注：<span className="remark-cont">{this.state.userRemark || '未填写'}</span></td>
                                                   </tr>
                                                   {
                                                       this.state.isAdjustTime == 1 ?
                                                       <tr className="special">
                                                           <td><span className="icon-checd"></span>若该时间订不上，愿意更改用餐时间</td>
                                                       </tr> : null
                                                   }
                                                   {
                                                       this.state.adjustTimeRemark ?
                                                       <tr>
                                                           <td className="remark"><span>备选用餐时间</span>{this.state.adjustTimeRemark}</td>
                                                       </tr> : null
                                                   }
                                                   {
                                                       this.state.isAdjustAddress == 1 ?
                                                       <tr className="special">
                                                           <td><span className="icon-checd"></span>若该餐厅订不上，愿意更改至其他餐厅</td>
                                                       </tr> : null
                                                   }
                                                   {
                                                       this.state.adjustAddressRemark ?
                                                       <tr>
                                                           <td className="remark nl2br" colSpan="3"><span>备注</span><span className="remark-cont">{this.state.adjustAddressRemark}</span></td>
                                                       </tr> : null
                                                   }
                                                   {
                                                        this.state.appointmentRemark ?
                                                        <tr>
                                                           <td className="book-remark nl2br" colSpan="3"><span>预约说明：</span><span className="book-remark-cont">{this.state.appointmentRemark}</span></td>
                                                        </tr> : null
                                                   }

                                                   <tr>
                                                       <td>联系人：{this.state.contactsName}</td>
                                                       <td>联系电话：<span>+{this.state.contactsAreaCode}</span> {this.state.contactsMobile}</td>
                                                       <td>微信号：{this.state.contactsWechat || '未填写'}</td>
                                                   </tr>
                                               </tbody>
                                           </table>
                                        }
                                    </div>
                                    {
                                        this.state.orderStatus == 1001 && (this.state.isAdjustTime ==1 || this.state.isAdjustAddress == 1)?
                                        <div className='order-detail-pass'>
                                            <table>
                                                <tobdy>
                                                    {
                                                        this.state.isAdjustTime == 1 ?
                                                        <tr className="special">
                                                            <td><span className="icon-checd"></span>若该时间订不上，愿意更改用餐时间</td>
                                                        </tr> : null
                                                    }
                                                    {
                                                        this.state.adjustTimeRemark ?
                                                        <tr>
                                                            <td className="remark"><span>备选用餐时间</span>{this.state.adjustTimeRemark}</td>
                                                        </tr> : null
                                                    }
                                                    {
                                                        this.state.isAdjustAddress == 1 ?
                                                        <tr className="special">
                                                            <td><span className="icon-checd"></span>若该餐厅订不上，愿意更改至其他餐厅</td>
                                                        </tr> : null
                                                    }
                                                    {
                                                        this.state.adjustAddressRemark ?
                                                        <tr>
                                                            <td className="remark nl2br" colSpan="3"><span>备注</span><span className="remark-cont">{this.state.adjustAddressRemark}</span></td>
                                                        </tr> : null
                                                    }
                                                </tobdy>
                                            </table>
                                        </div> : null
                                    }
                                    {
                                        this.state.orderStatus == 1001 ?
                                        <div className='order-detail-pass'>
                                            <p>联系人信息</p>
                                            <table className="pass-info">
                                                <tobdy>
                                                    <tr className="special">
                                                        <td className="remark"><span>姓名</span>{this.state.contactsName}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="remark"><span>联系电话</span><var>+{this.state.contactsAreaCode}</var> {this.state.contactsMobile}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="remark"><span>微信号</span>{this.state.contactsWechat || '未填写'}</td>
                                                    </tr>
                                                </tobdy>
                                            </table>
                                        </div> : null
                                    }
                                    <div className='order-detail-pass'>
                                    <p>金额明细</p>
                                    <table className="pass-info">
                                        <tbody>
                                        {
                                            this.state.orderSettleRsp.saleType == 2 ?
                                            <tr className="special">
                                                <td className="remark">
                                                    <span>订座服务费</span>&yen;{this.state.servicePerPrice} &times; {this.state.orderSettleRsp.personNum}（&yen;{this.state.servicePerPrice}/位，确认预约后不退款）
                                                </td>
                                            </tr>  : null
                                        }
                                        {
                                            this.state.orderSettleRsp.saleType == 3 && this.state.openDepositFlag == 1 ?
                                            <tr className="special">
                                                <td className="remark">
                                                    <span>订座押金</span>&yen;{this.state.orderSettleRsp.yajinPrice}（消费后或预订失败全额退还）
                                                </td>
                                            </tr> : null
                                        }

                                            <tr>
                                                {this.renderFee()}

                                            </tr>
                                        </tbody>
                                    </table>
                                    </div>
                                    {
                                        this.state.orderStatus != '1001' ?
                                        <div className='order-detail-pass'>
                                            <p className="merchantName">{this.state.merchantName}</p>
                                            <p className="merchantDetail">{this.state.merchantInfo}</p>
                                            <table className="merchantInfo">
                                                <tbody>
                                                    <tr>
                                                        <td>地址：{this.state.merchantAddress}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>营业时间：{this.state.businessTime}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>联系电话：<span>+{this.state.contactsAreaCode}</span> {this.state.contactsMobile}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>泊车许可：{this.state.parkInfo}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div> : null
                                    }

                                    {
                                        this.state.orderStatus != '1001' ?
                                            <div className="order-detail-reorder">
                                                <Button className="btn-full"
                                                        onClick={this.goToMerchantDetail.bind(this,this.state.merchantNo)}>
                                                    继续下单
                                                </Button>
                                            </div> :
                                            null
                                    }

                                    {this.renderUIPay()}

                                </div>
                            </div>

                        );
                    }
                    return res;
                })()}
                </div>
                <OrderCancel showCancel={this.state.canPop} submitHandle={(data)=>{
                    this.canOrder(this.state.orderNo, data)
                }} closeHandle={()=>{this.setState({canPop:false},()=>{this._frozenBody();})}}/>
                {this.renderAlipayAlert()}
                {this.renderErrorAlert()}
                {this.renderLoading()}
                {ISShowConsult ? <UiConsult /> : null}
                {ISShowConsult ? <Footer /> : null}
            </div>
        )
    }
}

function mapStateToProps(state) {
    // debugger
    return {
        header: state.header
    }
}

export default connect(mapStateToProps)(App);

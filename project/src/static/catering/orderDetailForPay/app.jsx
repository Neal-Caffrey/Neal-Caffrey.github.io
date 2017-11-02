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
import UIOrderStatus from 'components/ui-order-detail-status/index.v2.jsx';
import Loading from 'components/ui-loading/index.jsx';
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
import ApiConfig from 'widgets/apiConfig/index.js';
import Map from 'components/ui-catering-map/index.jsx';
const ISShowConsult = ((domain)=>{
  let reg = /www/;
  return reg.test(domain);
})(document.domain);
class App extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = this.defaultState;
        this.orderNo = this.getOrderNo();
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
            showMap: false,//显示地图
            onError: false,//错误提示
            isLoading: false
        };
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
                    // refresh: true,
                    isLoading: false,
                    ...res.data
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
        // debugger
        let agentId =  this.agentInfo.agentId;
        if (this.agentInfo.agentUserType == 1) {
            state.opId = this.agentInfo.agentUserId;
        }
        return agentId;
    }

    hideMap(){
        this.setState({
            showMap: false
        })
    }

    showMap(){
        this.setState({
            showMap: true
        })
    }

    getMapData() {
        return {
            lat: this.state.merchantLat,
            lng: this.state.merchantLng,
            merchantNameLocal: this.state.merchantNameLocal,
            merchantName: this.state.merchantName
        }
    }

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

    renderLoading() {
        if (!this.state.isLoading) return null;
        return ( <Loading/>)
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
    	} else if(this.state.gOrderStatus == 6) {
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
                {!this.state.orderNo ? null :
                    <div className='ui-main ui-fixed-footer'>
                        <div className="order-detail-main">
                            <UIOrderStatus
                                status={this.state.orderStatus}
                                price={this.state.orderSettleRsp.shouldPrice}
                                orderNo={this.state.orderNo}
                            >
                            </UIOrderStatus>
                            <div className='order-detail-wrap'>
                                <div className="btn-box">
                                    { this.state.orderStatus != 1001 ?
                                        <a className="btn-full" style={{marginRight:'20px'}} href={`detail.html?merchantNo=${this.state.merchantNo}`}>
                                            继续下单
                                        </a>:
                                        <a className="btn-full" style={{marginRight:'20px'}} href={`orderDetail.html?orderNo=${this.orderNo}`}>
                                            重新支付
                                        </a>
                                    }
                                    {
                                        <a className="btn-fill" style={{marginRight:'20px'}} href={`orderDetail.html?orderNo=${this.orderNo}`}>
                                            查看订单详情
                                        </a>
                                    }
                                </div>
                                <div className='order-detail-pass'>
                                    <p>预订信息</p>
                                    <table>
                                        <tbody>
                                            <tr>
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
                                            <tr>
                                                <td>联系人：{this.state.contactsName}</td>
                                                <td>联系电话：<span>+{this.state.contactsAreaCode}</span> {this.state.contactsMobile}</td>
                                                <td>微信号：{this.state.contactsWechat || '未填写'}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className='order-detail-pass'>
                                <p>金额明细</p>
                                <table className="pass-info">
                                    <tbody>
                                       {
                                        this.state.orderSettleRsp.saleType == 2 ?
                                        <tr>
                                            <td className="remark">
                                                <span>订座服务费</span>&yen;{this.state.servicePerPrice} &times; {this.state.orderSettleRsp.personNum}（&yen;{this.state.servicePerPrice}/位，确认预约后不退款）
                                            </td>
                                        </tr>  : null
                                    }
                                    {
                                        this.state.orderSettleRsp.saleType == 3 && this.state.openDepositFlag == 1 ?
                                        <tr>
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
                                <div className='order-detail-pass'>
                                    <span className="map" onClick={this.showMap.bind(this)}>商户位置</span>
                                    <div>
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
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                }
                {this.renderLoading()}
                {this.renderErrorAlert()}
                {ISShowConsult ? <UiConsult /> : null}
                {ISShowConsult ? <Footer /> : null}
                <Map changeHide={this.hideMap.bind(this)} show={this.state.showMap} detail={this.getMapData()}/>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        header: state.header
    }
}

export default connect(mapStateToProps)(App);

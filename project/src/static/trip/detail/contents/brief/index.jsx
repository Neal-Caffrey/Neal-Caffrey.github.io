import React, {Component} from "react";
import { connect } from 'react-redux';
import {Select} from 'local-Antd';
const Option = Select.Option;
import AreaCode from "components/ui-code/index.jsx";
import MInput from 'components/ui-input/index.jsx';
import ApiConfig from 'widgets/apiConfig/index.js';
import YdjAjax from 'components/ydj-Ajax/index.js';
import CountPrice from '../countPrice/index.jsx';
import Qrcode from '../qrcode/index.jsx';

import {
    _extend,
    _getQueryObjJson
} from 'local-Utils/dist/main.js';
import {showAlert, updateDetail, updateCcy} from '../../action/index.js';
import Loading from 'components/ui-loading/index.jsx';
import './sass/index.scss';

class Brief extends Component {
    constructor(props,context) {
	// props.data:{
	// 	sourceRouteNo //妙计订单号
	// 	otaRouteNo //ota行程编号
	// 	routeName // 产品名称
	// 	guestNum // 游玩人数
	// 	totalDays	// 出行天数
	// 	startCityId	// 开始城市id
	// 	startCityName	// 开始城市name
	// 	servicePassCity	// 游玩城市
	// 	depDate	// 行程出发日期
	// 	profitRate	// 利润率
	// 	profit	// 利润
	// 	totalSalePrice	// 参考成本报价
	// 	avgCostPrice	// 人成本均价
	// 	avgSalePrice	// 人均销售报价
	// 	priceChannel	// 最终销售价
	// 	routeShortLink	// 行程详情短连接
	// 	currencyList	// 汇率列表 ccy: string 币种代码  name: string 币种名称 rate: float 汇率（人民币）
	// 	otherList	// 行程增项服务报价单
	// 	routeTicket	// 机票订单
	// 	routeHotel	// 酒店订单
	// 	routeCar	// 用车订单
	// }
        super(props, context);
        this.state = {
            loading: true,
            showCcy: 'RMB',
            editProfitRate: false,
            editTuan: false,
            editOp: false,
            profitRate: 0, // 毛利率
        };
        this.data = {
            guestNum: 0, // 游玩人数
            totalDays: 0,  // 出行天数
            profitRate: 0, // 毛利率
            routeNo: _getQueryObjJson().routeNo
        };
        this.formData = {};

    }

    componentWillMount() {
        if (this.props.header.info) {

            this.userInfo = this.props.header.info;
            this.getDetail();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (!this.props.header.info && nextProps.header.info) {

            this.userInfo = nextProps.header.info;
            this.getDetail();
        }

    }

    getCurrency(showCcy) {
        // 获取指定币种信息
        let currency = showCcy || 'RMB';
        let cList = this.data.currencyList;
        let cInfo = cList.find((item)=>{
            return item.showCcy == currency;
        });
        return cInfo;
    }


    convertCurrency(price = 0) {
        // 计算指定币种的报价金额，向上取整
        let currency = this.props.currencyInfo.showCcy;
        let cInfo = this.getCurrency(currency);
        return Math.ceil(price / cInfo.rate);
    }

    formatCurrencyList(list) {
        // 显示RMB
        let arr = list;
        if(!list) {
            return [];
        }
        if(typeof list == 'string') {
            arr = JSON.parse(list);
        }
        arr.map((item, index)=>{
            if(item.ccy == 'CNY'){
                item.showCcy = 'RMB'
            } else {
                item.showCcy = item.ccy;
            }
        })
        return arr;
    }

    getCurChannelPrice() {
        // 计算当前币种下最终报价信息

        if(!this.props.currencyInfo) {
            return {};
        }
        let currency = this.props.currencyInfo.showCcy;
        let cInfo = this.getCurrency(currency);
        let cost = this.data.totalSalePrice || 0;
        let totalSalePrice = (cost / cInfo.rate).toFixed(2);
        let profitRate = this.props.breif.profitRate/100;
        let priceChannel = ((cost*(1+profitRate))/cInfo.rate).toFixed(2);
        let avgCostPrice = (this.data.avgCostPrice/cInfo.rate).toFixed(2);
        let data = {
            totalSalePrice: totalSalePrice,
            profit: (priceChannel - totalSalePrice).toFixed(2),
            priceChannel : priceChannel,
            // profit: ((this.props.breif.profit || 0) / cInfo.rate).toFixed(2),
            // priceChannel: ((this.props.breif.priceChannel || 0) / cInfo.rate).toFixed(2),
            profitRate: this.props.breif.profitRate,
            avgCostPrice: avgCostPrice
        };

        return data;
    }

    getShowPrice(price=0) {
        return (price / this.props.currencyInfo.rate).toFixed(2);
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

    getDetail() {
        let that = this;
        this.setState({
            loading: true
        })
        let opt = {
            url: ApiConfig.tripDetail,
            type: 'GET',
            data: {
                routeNo: this.data.routeNo
            },
            successHandle: (res)=>{
                // res.data.additionList = [
                //     {
                //         'sourceRouteNo': '123456',
                //         'name': '123456',
                //         'num': 5,
                //         'price': 500,
                //         'totalPrice': 6000,
                //     },
                //     {
                //         'sourceRouteNo': '123456',
                //         'name': '12345416516166',
                //         'num': 5,
                //         'price': 300,
                //         'totalPrice': 60000,
                //     }
                // ];
                that.data = res.data;
                that.data.currencyList = that.formatCurrencyList(res.data.currencyList); // CNY to RMB

                this.setState({
                    renderFlag: true,
                    profitRate: res.data.profitRate, // 毛利率,
                    loading: false
                }, ()=>{
                    let carList = that.data.carList;
                    carList.map((val,key)=>{
                        if(val.userInfo){
                            let userInfo = JSON.parse(val.userInfo);
                            val.userInfo = userInfo[0];
                            val.userInfo.userRemark = val.userRemark || '';
                        }
                        else {
                            val.userInfo = {};
                        }
                    }); // 用车信息

                    let detail = {
                        routeNo: that.data.routeNo,
                        currencyInfo: that.getCurrency('RMB'),
                        breif: {
                            routeNo: that.data.routeNo,
                            routeName: that.data.routeName,
                            guestNum: that.data.guestNum,
                            totalDays: that.data.totalDays,
                            servicePassCity: that.data.servicePassCity,
                            depDate: that.data.depDate,
                            profitRate: that.data.profitRate,
                            profit: that.data.profit,
                            totalSalePrice: that.data.totalSalePrice,
                            avgCostPrice: that.data.avgCostPrice,
                            avgSalePrice: that.data.avgSalePrice,
                            priceChannel: that.data.priceChannel,
                            routeShortLink: that.data.routeShortLink,
                            priceInclude: that.data.priceInclude,
                            priceExclude: that.data.priceExclude
                        },
                    };

                    if(that.data.carList && that.data.carList.length > 0) {
                        detail.car = carList;  // 包车订单
                    }

                    if(that.data.hotelList && that.data.hotelList.length > 0) {
                        detail.hotel = that.data.hotelList;  // 酒店订单
                    }

                    if(that.data.ticketList && that.data.ticketList.length > 0) {
                        detail.air = that.data.ticketList;  // 机票订单
                    }

                    if(that.data.additionList) {
                        let additionList = JSON.parse(that.data.additionList);
                        if(additionList.length) {
                            detail.others = additionList; // 其他信息
                        }
                    }

                    if(that.data.routeItemList) {
                        let routeItemList = JSON.parse(that.data.routeItemList);
                        if(routeItemList.length) {
                            detail.routeItemList = routeItemList; //行程预览
                        }
                    }
                    this.props.dispatch(updateDetail(detail));
                });
            },
            ...this.errorHanlde()
        }
        new YdjAjax(opt)
    }

    formatDate(str) {
        return (str ? str.split(' ')[0] : '');
    }

    formatCityLine(str) {
        return str.split('，').join('-');
        // return str.split(',').join('-');
    }

    // 更新行程信息
    updateRoute(datas) {
        this.setState({
            loading: true
        });
        let opt = {
            url: ApiConfig.updateDetail,
            type: datas.type || 'GET',
            data: JSON.stringify(datas.queryData),
            headers : {
              'Content-Type':'application/json'
            },
            successHandle: (res)=>{
                this.setState({
                    loading: false
                });
                datas.callBack(res);
            },
            ...this.errorHanlde()
        }
        new YdjAjax(opt)
    }

    // 修改团号
    editTuan() {
        let that = this;

        if(this.data.thirdTradeNo == this.formData.thirdTradeNo) {
            // 未变更
            this.setState({
                editTuan: false,
            });
            return;
        }
        let queryData = {
            routeNo: this.data.routeNo,
            editType: 3,
            thirdTradeNo: this.formData.thirdTradeNo || this.data.thirdTradeNo,
        };

        let datas = {
            type: 'POST',
            queryData: queryData,
            callBack: ()=>{

                that.data.thirdTradeNo = queryData.thirdTradeNo;
                that.setState({
                    editTuan: false,
                    loading: false,
                });
            }
        };
        this.updateRoute(datas);
    }

    // 修改团号
    editOp() {
        let that = this;
        if(this.data.agentOpname == this.formData.agentOpname && this.data.userMobile == this.formData.userMobile && this.data.userWechat == this.formData.userWechat && this.data.userEmail == this.formData.userEmail) {
            // 未变更
            this.setState({
                editOp: false,
            });
            return;
        }

        let queryData = {
            routeNo: this.data.routeNo,
            editType: 2,
            agentOpname: this.formData.agentOpname || this.data.agentOpname,
            userMobile: this.formData.userMobile || this.data.userMobile,
            userWechat: this.formData.userWechat || this.data.userWechat,
            userEmail: this.formData.userEmail || this.data.userEmail,
        };

        let datas = {
            type: 'POST',
            queryData: queryData,
            callBack: ()=>{

                that.data.agentOpname = queryData.agentOpname;
                that.data.userMobile = queryData.userMobile;
                that.data.userWechat = queryData.userWechat;
                that.data.userEmail = queryData.userEmail;
                that.setState({
                    editOp: false,
                    loading: false,
                });
            }
        };
        this.updateRoute(datas);
    }
    showRouteQr() {
        this.setState({
            showQr: true
        })
    }

    _changeCcy(showCcy) {
        let data = this.getCurrency(showCcy);
        this.props.dispatch(updateCcy(data));
    }

    // form字段变更回调
    _changeForm(key, info) {

        if(info.error) {
            return;
        }
        console.log('key', info.value);
        this.formData[key] = info.value;
    }

    //修改毛利 回调
    _changePrice() {
        this.setState({
            editProfitRate: false
        })
        // if(!val.save){
        //     this.setState({
        //         editProfitRate: false
        //     })
        // }else {
        //     this.setState({
        //         editProfitRate: false
        //     })
        //     //@todo 修改本页面改变利率后的报价信息
        // }
    }

    _showQrCode(a) {

        this.setState({
            showQr: false
        })
    }

    render(){
        console.log('render brief', this.props);

        let detail = this.data;
        let opt = {
            profitRate: (this.props.breif && this.props.breif.profitRate) || 0,
            totalSalePrice: (this.props.currencyInfo && this.getCurChannelPrice().totalSalePrice) || 0,
            avgCostPrice: this.getCurChannelPrice().avgCostPrice || 0,
            ccy: (this.props.currencyInfo && this.getCurrency(this.props.currencyInfo.showCcy).showCcy) || 'CNY',
            guestNum: detail.guestNum || 1,
            rate: this.props.currencyInfo && this.props.currencyInfo.rate
        };

    	return (
            <div>
            {
                this.props.currencyInfo && detail.routeName?
        		<div className="brief">
                    <div className="brief-title">
                        <span className="biao-ti">{detail.routeName}</span>
                        <span className="num-msg"><em className="yellow-font">{detail.guestNum}</em>人／<em className="yellow-font">{detail.totalDays}</em>天</span>
                        {
                            !this.state.editTuan && detail.thirdTradeNo ?
                                <span className="look-tuanhao">
                                    团号：{detail.thirdTradeNo}
                                    <em className="xiu-gai"
                                        onClick={()=>{
                                            this.setState({
                                                editTuan: !this.state.editTuan
                                            })}}>修改</em>
                                </span> :
                                <span className="tuanhao-box">团号
                                    <em className="input-box">
                                        <MInput
                                            className='tuanhao'
                                            name='thirdTradeNo'
                                            value={detail.thirdTradeNo}
                                            onHandle={this._changeForm.bind(this, 'thirdTradeNo')}
                                            placeholder={'请填写团号'}/>
                                    </em>
                                    <em className="save"
                                        onClick={this.editTuan.bind(this)}>保存</em>
                                </span>
                        }

                        <span className="send-tophone" onClick={this.showRouteQr.bind(this)}>手机预览行程</span>
                        <span className="select">
                            <Select
                                placeholder = "人民币RMB"
                                style={{color: '#0E1A27',width:'100%',position:'relative',top:'-16px'}} onChange={this._changeCcy.bind(this)}>
                                {
                                    detail.currencyList.map((item, key) => {
                                        return (
                                            <Option value={item.showCcy}>{item.ccyName}{item.showCcy}</Option>
                                        )
                                    })
                                }
                            </Select>
                        </span>
                    </div>
                    <div className="brief-content">
                        <p>出发日期：{this.formatDate(detail.depDate)}</p>
                        <p>游玩城市：{this.formatCityLine(detail.servicePassCity)}</p>
                        <div className="lianxi">
                            <div className="lianxi-head">
                                <span>联系人信息</span>
                                <span className="xiu-gai"
                                    onClick={()=>{
                                        this.setState({
                                            editOp: !this.state.editOp
                                        })}}>修改 ></span>
                            </div>

                            { !this.state.editOp && detail.userMobile ?
                                <div className="lianxi-msg">
                                    <span>旅行社OP：{detail.agentOpname}</span>
                                    <span>OP手机号：{detail.userMobile ? `86-${detail.userMobile}` : '未填写'}</span>
                                    <span>微信号：{detail.userWechat}</span>
                                    <span>邮箱：{detail.userEmail}</span>
                                </div> :
                                <div className="lianxi-msg">
                                    <div className="cont-inner">
                                        <div className="form-row">
                                            <div className="left">
                                                <label className="row-name has-xing">姓名／旅行社OP</label>
                                                <span className="shuru-box">
                                                    <MInput
                                                        name='xingming'
                                                        value={detail.agentOpname}
                                                        onHandle={this._changeForm.bind(this, 'agentOpname')}
                                                        reg={/^[^\s]+$/}
                                                        sign="客人姓名"
                                                        placeholder={'请填写客人姓名'}/>
                                                </span>
                                            </div>
                                            <div className="right phone-box">
                                                <label className="row-name has-xing">手机号</label>
                                                <div className="mobile hasOther">
                                                    <div className="quhao">
                                                        <AreaCode
                                                            name='realAreaCode'
                                                            labelClass='area-code'
                                                            replaceValue={'86-中国'}
                                                        />
                                                    </div>
                                                    <div className="phone-number">
                                                        <MInput
                                                            name='userMobile'
                                                            sign='手机号'
                                                            value={detail.userMobile}
                                                            onHandle={this._changeForm.bind(this, 'userMobile')}
                                                            reg={/^\d+$/}
                                                            placeholder={'手机号'}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="left">
                                                <label className="row-name">微信号</label>
                                                <span className="shuru-box">
                                                    <MInput
                                                        name='userWechat'
                                                        sign="客人微信号"
                                                        value={detail.userWechat}
                                                        onHandle={this._changeForm.bind(this, 'userWechat')}
                                                        placeholder={'请填写客人微信号'}/>
                                                </span>
                                            </div>
                                            <div className="right">
                                                <label className="row-name">邮箱</label>
                                                <span className="shuru-box">
                                                    <MInput
                                                        name='userEmail'
                                                        sign="客人邮箱"
                                                        value={detail.userEmail}
                                                        onHandle={this._changeForm.bind(this, 'userEmail')}
                                                        placeholder={'请填写客人邮箱'}/>
                                                </span>
                                                <button className="yellow-bg"
                                                    onClick={this.editOp.bind(this)}>保存</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                    {
                        (()=>{
                            let res=[];
                            if(this.props.currencyInfo) {
                                res.push(
                                    <div className="footer">
                                        <span>参考成本：<em className="rmb">{this.props.currencyInfo.showCcy} </em><em className="money" id="">{this.getCurChannelPrice().totalSalePrice}</em></span>
                                        <span>最终报价：
                                            <em className="rmb">{this.props.currencyInfo.showCcy} </em>
                                            <em className="money">{this.getCurChannelPrice().priceChannel}</em>
                                            <em className="mao-li"
                                                onClick={()=>{
                                                    this.setState({
                                                        editProfitRate: !this.state.editProfitRate
                                                    })}}>({this.getCurChannelPrice().profitRate}%毛利)</em>
                                        </span>
                                        <span>本单利润：<em className="rmb">{this.props.currencyInfo.showCcy} </em><em className="money">{this.getCurChannelPrice().profit}</em></span>
                                    </div>
                                );
                            }
                            return res;
                        })()
                    }
                    {
                        this.state.editProfitRate ?
                        <CountPrice data={opt} sucHandle={this._changePrice.bind(this)}/> : null
                    }
                    {
                        this.state.showQr && detail.routeShortLink ?
                        <Qrcode url={detail.routeShortLink} clickHandle={this._showQrCode.bind(this)}/> : null
                    }
                </div> : null
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
        header: state.header,
		currencyInfo: state.main.currencyInfo,
        breif: state.main.breif
	}
}

export default connect(mapStateToProps)(Brief);

import React, {Component} from "react";
import {Table, Checkbox,Row, Col} from "local-Antd";
import { connect } from 'react-redux';
import ApiConfig from 'widgets/apiConfig/index.js';
import YdjAjax from 'components/ydj-Ajax/index.js';
import Input from "components/ui-input/index.jsx";
import UIMsg from 'components/ui-msg/index.jsx';
import {showCarModel,updateCar,showAlert} from '../../action/index.js';
import CountDown from 'components/ui-countDown/index.jsx';
import {
    _extend
} from 'local-Utils/dist/main.js';
import WriteCar from "../writeCar/index.jsx";


class BaoChe extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            aliPop: false, // 支付弹框
            allPaid: this.checkAllStatus(props.car), // 全部已支付
        }

    }

    componentWillReceiveProps(nextProps) {
        if(this.props.car != nextProps.car){
            this.setState({
                allPaid: this.checkAllStatus(nextProps.car)
            })
        }

    }
    checkAllStatus(car) {
        let flag = true;
        car.map((carItem,id)=>{
            if(carItem.orderStatus == 1 || carItem.orderStatus == 101){
                flag = false;
                return flag;
            }
        })
        return flag;
    }

    showWriteCar(index){
        let obj = {
            show: true,
            index: index
        }
        this.props.dispatch(showCarModel(obj));
    }

    getShowPrice(price=0) {
        return (price / this.props.currencyInfo.rate).toFixed(2);
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

    getOrderType(type,id) {
        let result = '';
        if(type == 1){
            result = '接机';
        }else if (type == 2) {
            result = '送机';
        }else if (type == 3) {
            result = `行程${id+1}`
        }
        return result;
    }

    getCityName(item) {
        let name;
        if(item.orderType == 1){
            name = item.serviceEndCityname;
        }else if (item.orderType == 2) {
            name = item.serviceStartCityname;
        }else {
            name = `${item.serviceStartCityname}-${item.serviceEndCityname}`
        }
        return name;
    }
    //下单
    addOrder(orderNo,status) {
        if(status == 1){
            let Tab = window.open();
            setTimeout(()=>{
                Tab.location = `${ApiConfig.apiHost}order/detail?orderNo=${orderNo}`;
            },0)
            return false;
        }
        let commitData = {
            orderNo: orderNo
        }
        let newTab = window.open();
        let opt = {
            url: ApiConfig.addOrder,
            type: 'POST',
            headers : {
              'Content-Type':'application/json'
            },
            data: JSON.stringify(commitData),
            successHandle: (res)=>{
                this.setState({
                    aliPop: true
                })

                newTab.location = `${ApiConfig.apiHost}order/detail?orderNo=${orderNo}`;
            },
            ...this.errorHanlde()
        }
        new YdjAjax(opt)
    }

    /*错误处理*/
    errorHanlde(res){
		let handles = {
			failedHandle: (res) => {
				this.props.dispatch(showAlert(res.message));
			},
			errorHandle: (xhr, errorType, error, errorMsg) => {
				this.props.dispatch(showAlert(errorMsg));
			}
		};
		return handles;
    }

    doAction(item) {
        //未下单
        if(item.orderStatus == 101){
            this.addOrder(item.orderNo,item.orderStatus);
        }else if(item.orderStatus == 102) {//已取消，未付款
            this.props.dispatch(showAlert('超过最晚支付时间，该订单已取消'));
        }else {
            let newTab = window.open();
            setTimeout(()=>{
                newTab.location = `${ApiConfig.apiHost}order/detail?orderNo=${item.orderNo}`;
            },0)
        }
    }

    render() {
        console.log('render baoche', this.props);
        return (
            <div className="daily">
                {
                    this.props.carModel.show ? <WriteCar />:null
                }
                {this.renderAlipayAlert()}
                <div className="title">用车行程</div>
                <div className="list-table">
                    {
                        this.state.allPaid ?
                        <Row  className="list-head" type="flex" justify="space-around" align="middle">
                            <Col  span={3}>用车行程</Col>
                            <Col  span={4}>订单号</Col>
                            <Col  span={3}>行程起/止日期</Col>
                            <Col  span={6}>游玩城市</Col>
                            <Col  span={4}>订单状态</Col>
                            <Col  span={4} className="jin-e">订单金额</Col>
                        </Row> :
                        <Row  className="list-head" type="flex" justify="space-around" align="middle">
                            <Col  span={2}>用车行程</Col>
                            <Col  span={3}>订单号</Col>
                            <Col  span={3}>行程起/止日期</Col>
                            <Col  span={5}>游玩城市</Col>
                            <Col  span={3}>订单状态</Col>
                            <Col  span={3} className="jin-e">订单金额</Col>
                            <Col  span={5}>操作</Col>
                        </Row>
                    }

                    {
                        this.props.car.map((carItem,id)=>{
                            if(this.state.allPaid){
                                return(
                                    <div className="list-item">
                                        <Row  className="list-main"  type="flex" justify="space-around" align="middle">
                                            <Col  span={3}>{this.getOrderType(carItem.orderType,id)}</Col>
                                            <Col  span={4}><span onClick={this.doAction.bind(this,carItem)}>{carItem.orderNo}</span></Col>
                                            <Col  span={3}><p className="shi-jian">{carItem.orderType==3 ?carItem.serviceTime.substr(0,10): carItem.serviceTime.substr(0,16)}</p> <p className="shi-jian">{carItem.orderType==3 ? carItem.serviceEndTime && carItem.serviceEndTime.substr(0,10): '(当地时间)'}</p></Col>
                                            <Col  span={6}>{this.getCityName(carItem)}</Col>
                                            <Col  span={4}>{carItem.orderStatusName}</Col>
                                            <Col  span={4} className="jin-e"><span className="rmb">{this.props.currencyInfo.showCcy}</span>{this.getShowPrice(carItem.priceChannel)}</Col>
                                        </Row>
                                    </div>
                                )
                            }
                            else {
                                return(
                                    <div className="list-item">
                                        <Row  className="list-main"  type="flex" justify="space-around" align="middle">
                                            <Col  span={2}>{this.getOrderType(carItem.orderType,id)}</Col>
                                            <Col  span={3}><span onClick={this.doAction.bind(this,carItem)}>{carItem.orderNo}</span></Col>
                                            <Col  span={3}><p className="shi-jian">{carItem.orderType==3 ?carItem.serviceTime.substr(0,10): carItem.serviceTime.substr(0,16)}</p> <p className="shi-jian">{carItem.orderType==3 ?  carItem.serviceEndTime && carItem.serviceEndTime.substr(0,10): '(当地时间)'}</p></Col>
                                            <Col  span={5}>{this.getCityName(carItem)}</Col>
                                            <Col  span={3}>
                                                {(carItem.orderStatus == 101 || carItem.orderStatus == 1) ?
                                                    <div>
                                                        <p>{carItem.orderStatusName}</p>
                                                        {
                                                            carItem.payDeadLineCountDown > 0 ?
                                                            <p className="zhifu-tips">请在<strong  className="time"><CountDown time={carItem.payDeadLineCountDown} model={2} type={1} callback={this.confirmClick.bind(this)}/></strong>内完成支付</p>
                                                            : null
                                                        }

                                                    </div> : carItem.orderStatusName}
                                            </Col>
                                            <Col  span={3} className="jin-e"><span className="rmb">{this.props.currencyInfo.showCcy}</span>{this.getShowPrice(carItem.priceChannel)}</Col>
                                            {
                                                (carItem.orderStatus == 1 || carItem.orderStatus == 101) ?
                                                <Col  span={5}><span onClick={this.showWriteCar.bind(this,id)}>{carItem.userInfo.name?'修改用车信息':'填写用车信息'}</span> <button  className="yellow-bg" onClick={this.addOrder.bind(this,carItem.orderNo,carItem.orderStatus)}>去支付</button></Col>
                                                : <Col span={5}>————</Col>
                                            }
                                        </Row>
                                    </div>
                                )
                            }
                        })
                    }
                </div>
            </div>
        )
    }
}
// export default BaoChe;
function mapStateToProps(state) {
    return {
        carModel: state.main.carModel,
        car: state.main.car,
        currencyInfo: state.main.currencyInfo,
    }
}

export default connect(mapStateToProps)(BaoChe)

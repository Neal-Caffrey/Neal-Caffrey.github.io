/**
 * Created by Gorden on 2017/5/9.
 */
import React,{Component} from 'react';
import { Radio,Button } from 'local-Antd';
const RadioGroup = Radio.Group;
import './sass/index.scss';
export default class UIPay extends Component{
    /*
    account:
    channelPrice
    acturalPrice
    onClickPay({payType:})
    onClickCan,
     cancelEnable
     */
    constructor(props){
        super(props);
        this.state = {
            payType : props.supportBalancePay == 1 ? 0 : 1,
            disabled: props.supportBalancePay == 1 ? false : true
        }
    }
    componentWillReciveProps(nextProps){

    }
    onChange(e){
        this.setState({
            payType: e.target.value,
        });
    }
    clickPay(){
        this.props.onClickPay && this.props.onClickPay(this.state.payType);
    }
    clickCan(){
        this.props.onClickCan && this.props.onClickCan();
    }

    render(){
        return (
            <div className="WG-Paywrap">
                <p className="WG-PayTitle">
                    <span>选择支付方式</span>
                    {/*<small>对公支付方式:XXXX</small>*/}
                </p>
                <RadioGroup onChange={this.onChange.bind(this)} value={this.state.payType}>
                    <Radio value={0} disabled={this.state.disabled}>
                        <span className="WG-PayMyAcount">
                            <p>账户余额支付</p>
                            {this.props.supportBalancePay == 0 ? <span>余额支付已关闭</span> : null}
                            {(this.props.channelPrice >= this.props.account) && (this.props.supportBalancePay == 1) ? <span>您的账户余额不足,请及时充值</span> : null}

                        </span>
                    </Radio>
                    <Radio value={1}>
                        <span className="WG-PayAli">

                        </span>
                    </Radio>
                </RadioGroup>

                <div className="WG-PayInfo">
                    <div className="WG-PayLeft">
                        <div>
                            <span className="WG-PayInfoTitle">订单金额：</span>
                            <span className="WG-PayInfoOP">￥{this.props.channelPrice}</span>
                        </div>
                        <div>
                            <span className="WG-PayInfoTitle">支付金额：</span>
                            <span className="WG-PayInfoAP">￥{this.props.channelPrice}</span>
                        </div>
                    </div>
                    <div className="WG-PayRight">
                        <Button onClick={this.clickPay.bind(this)} type="primary" className="btn-full" style={{marginRight:'20px'}}>确认付款</Button>
                    </div>
                </div>
            </div>
        )
    }
}

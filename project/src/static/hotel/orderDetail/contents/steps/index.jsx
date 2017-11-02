/**
 * @author Kepeng
 * @description 酒店订单详情，支付后进度条
 * @param status: 订单状态
 */
import React,{Component} from 'react';
import {Icon} from 'local-Antd';
import './sass/index.scss';

export default class Steps extends Component{
    constructor(props){
        super(props);
    }

    render(){
        if(this.props.status == '2001' || this.props.status == '2020'){
            return (
                <div className='steps-box'>
                    <div className="step-item">
                        <p>提交订单</p>
                        <div>
                            <Icon type="check-circle" />
                        </div>
                    </div>
                    <div className="step-item current">
                        <p>已支付<br/>等待酒店确认</p>
                        <div>
                            <span></span>
                        </div>
                    </div>
                    <div className="step-item">
                        <p>酒店有房<br/>预订成功</p>
                        <div>
                            <span></span>
                        </div>
                    </div>
                </div>
            )
        }
        if(this.props.status == '2010'){
            return (
                <div className='steps-box'>
                    <div className="step-item">
                        <p>提交订单</p>
                        <div>
                            <Icon type="check-circle" />
                        </div>
                    </div>
                    <div className="step-item">
                        <p>已支付<br/>等待酒店确认</p>
                        <div>
                            <Icon type="check-circle" />
                        </div>
                    </div>
                    <div className="step-item current">
                        <p>酒店有房<br/>预订成功</p>
                        <div>
                            <span></span>
                        </div>
                    </div>
                </div>
            )
        }
        if(this.props.status == '3001'){
            return (
                <div className='steps-box done'>
                    <div className="step-item">
                        <p>提交订单</p>
                        <div>
                            <Icon type="check-circle" />
                        </div>
                    </div>
                    <div className="step-item">
                        <p>已支付<br/>等待酒店确认</p>
                        <div>
                            <Icon type="check-circle" />
                        </div>
                    </div>
                    <div className="step-item">
                        <p>酒店有房<br/>预订成功</p>
                        <div>
                            <Icon type="check-circle" />
                        </div>
                    </div>
                    <div className="step-item current">
                        <p>入住完成</p>
                        <div>
                            <span></span>
                        </div>
                    </div>
                </div>
            )
        }
        if(this.props.status == '3006'){
            return (
                <div className='steps-box'>
                    <div className="step-item">
                        <p>提交订单</p>
                        <div>
                            <Icon type="check-circle" />
                        </div>
                    </div>
                    <div className="step-item">
                        <p>已支付<br/>等待酒店确认</p>
                        <div>
                            <Icon type="check-circle" />
                        </div>
                    </div>
                    <div className="step-item error">
                        <p>酒店无房,预订失败<br/>预订金额已退还</p>
                        <div>
                            <span></span>
                        </div>
                    </div>
                </div>
            )
        }
    } 
}

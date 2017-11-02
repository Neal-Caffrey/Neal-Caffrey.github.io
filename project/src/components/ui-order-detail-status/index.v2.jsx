/**
 * @author Kepeng
 * @description 用于支付后跳转新页面的订单状态
 * @param status: 订单状态
 *        price: 支付金额
 *        orderNo: 订单号
 */
import React,{Component} from 'react';
import './sass/index.v2.scss';

export default class UIOrderStatus extends Component{
  constructor(props){
    super(props);
  }

  getClassName(){
  	let status;
  	status = this.props.status != "1001" ? "success" : "error"
    return "ui-order-detail-status-wrap "+ 'pay-' + status
  }

  render(){
    return (
      <div className={this.getClassName()}>
            <div className="inner">
            	<span className="img-box"></span>
            	<div className="text-box">
            		{
            			this.props.status != "1001" ? 
            			<div>
            				<p className="font16 success">恭喜您，订单已支付成功！</p>
            				<p className="font14">支付金额  RMB <span className="price">{this.props.price}</span></p>
            			</div> :
            			<div>
            				<p className="font16 error">很遗憾，订单支付失败！</p>
            				<p className="font16 error">请重新发起支付</p>
            			</div>
            		}
            		<p>订单号：{this.props.orderNo}</p>
            	</div>
            </div>
      </div>
    )
  }
}

import React, {
  Component
} from 'react';
import {Row, Col, Spin} from 'local-Antd';
import Page from 'components/ui-page/index.jsx';
import 'moment/locale/zh-cn';
class OrderStatusSelect extends Component {

  constructor(props, context) {
    super(props, context);
    this.curPageUrl = this.curUrl;
    this.state = {
      status: this.statusList(this.props),
      moneySource:this.props.moneySource,
      head:this.props.pageSource,
      activeSettleSource: this.props.defaultStatus || this.activeSettleSource|| null
    };
  }
  componentWillReceiveProps(nextProps) {debugger
    this.setState({
      
       status: this.statusList(nextProps),
       moneySource:nextProps.moneySource,
       head:nextProps.pageSource,
      activeSettleSource: nextProps.defaultStatus || this.activeSettleSource|| null
    })

  }
_renderAllMoney(){
  let head  = this.state.head;
   if(head&&head.settleSource){
    if(head.settleSource==3){debugger
      return(
        
        <div className="settleShouldAmount"><span>应付金额</span> <span className="title-money">¥{this.state.moneySource.orderTotalAmount}</span></div>
        )
    }else if(head.settleSource==2){
      return(
        
        <div className="settleShouldAmount"><span>应付金额</span> <span className="title-money">{this.state.moneySource?<span className="title-money">¥{this.state.moneySource.hotelOrderTotalAmount}</span>:<span className="title-money"></span>}</span></div>
        )
    }else if(head.settleSource==4){
      return(
        
        <div className="settleShouldAmount"><span>应付金额</span> <span className="title-money">{this.state.moneySource?<span className="title-money">¥{this.state.moneySource.fxOrderTotalAmount}</span>:<span className="title-money"></span>}</span></div>
        )
    }

   }
}
 
  
  statusList(props) {

    let dataSource =  props.dataSource || [];
    let status = [];
      dataSource.map((item, index)=>{
      console.log(item);
      // item.active == true && this.activeSettleSource == undefined && (this.activeSettleSource = item.SettleSource);
      item.show && (status = status.concat([item]));
    });
    
    return status;
  }
  _clickHandle(settleSource, index) {
    this.setState({
      activeSettleSource: settleSource
    },()=>{
      this.props.changeHandle && this.props.changeHandle('status', {status: settleSource});
    });
  }
  _renderLi() {
    return (
      <ul>
        {
          this.state.status.map((item, index)=>{
            {
              if(item.show) {
                return (
                  <li key={`status-${index}`} className={item.active?"active":""} onClick={this._clickHandle.bind(this, item.settleSource, index)}><span>{item.desc}</span></li>
                )
              }else {
                return null;
              }
            }
          })
        }
        {this._renderAllMoney()}
       
      </ul>
    )
  }

  render() {
    return (
      <div className="order-status-bar">
        {this._renderLi()}
      </div>
    )
  }
}
export default OrderStatusSelect;

import React, {
  Component
} from 'react';
import {
  connect
} from 'react-redux';
// import {Row, Col, Spin,Icon} from 'local-AnCol';
import {Row, Col, Spin, Icon} from 'local-Antd';
import Page from 'components/ui-page/index.jsx';
import 'moment/locale/zh-cn';
import billsTableCss from './sass/index.scss';
import  {showAccounts} from '../../action/index.js';
import {
  _getQueryObjJson
} from 'local-Utils/dist/main.js';

class BillTable extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            datas: this.props.dataSource,
            head:this.props.pageSource|| [],
            pagination: this.props.pagination,
            loading: this.props.loading,
            checkDetail:false,
        };
    }
componentWillReceiveProps(nextProps) {
    this.setState({
        datas: nextProps.dataSource,
        head:nextProps.pageSource,
        pagination: nextProps.pagination,
        loading: nextProps.loading,
        billNo :_getQueryObjJson().billNo,
    });
}
accountsExplain(val) {debugger;
    this.setState({
        checkDetail:true,
        detailValue:val,
    })
  }
 _changePage(data) {
    console.log(data.current);
    let pageIndex = data.current || 1;
    if(this.state.pagination.current == pageIndex) {
        return;
    }
    this.props.changeHandle && this.props.changeHandle('pageIndex', {'pageIndex': pageIndex});
  }

 _renderOrderRowsHeader() {
    let head  = this.state.head;
    if(head&&head.settleSource){
        if(head.settleSource==3){
            return(
                <div className="list-table">
                    <Row  className="list-head" type="flex"  justify="space-around" align="middle">
                        <Col span={2}>订单号</Col>
                        <Col span={2}>主订单号</Col>
                        <Col span={2}>第三方订单号</Col>
                        <Col span={2}>下单操作员</Col>
                        <Col span={2}>订单类型</Col>
                        <Col span={2}>服务城市</Col>
                        <Col span={1}>订单状态</Col>
                        <Col span={2}>下单时间<br/>（北京时间）</Col>
                        <Col span={2}>服务时间 <br/>（北京时间）</Col>
                        <Col span={2}>完成／取消 <br/>时间</Col>
                        <Col span={1}>取消费用</Col>
                        <Col span={1}>订单金额</Col>
                        <Col span={1}>返佣金额</Col>
                        <Col span={1}>应付金额</Col>
                        <Col span={1}>结算说明</Col>
                    </Row>
                </div>
            )

        }else if(head.settleSource==2){
            return(
                <div className="list-table">
                    <Row  className="list-head" type="flex" justify="space-around" align="middle" >
                        <Col span={2}>订单号</Col>
                        <Col span={2}>第三方<br/>订单号</Col>
                        <Col span={2}>酒店名称</Col>
                        <Col span={2}>下单操作员</Col>
                        <Col span={2}>房间数</Col>
                        <Col span={2}>入住／离店<br/>日期</Col>
                        <Col span={1}>入住人</Col>
                        <Col span={2}>订单状态</Col>
                        <Col span={2}>下单时间<br/>（北京时间）</Col>
                        <Col span={2}>免费取消日</Col>
                        <Col span={1}>取消费用</Col>
                        <Col span={1}>订单金额</Col>
                        <Col span={1}>返佣金额</Col>
                        <Col span={1}>应付金额</Col>
                        <Col span={1}>结算说明</Col>
                    </Row>
                </div>
            )

        }else if(head.settleSource==4){
            return(
                <div className="list-table">
                    <Row  className="list-head" type="flex" justify="space-around" align="middle">
                        <Col span={2}>订单号</Col>
                        <Col span={2}>预约商家</Col>
                        <Col span={2}>服务城市</Col>
                        <Col span={2}>下单操作员</Col>
                        <Col span={2}>下单时间 <br/>（北京时间）</Col>
                        <Col span={2}>预约时间 <br/>（北京时间）</Col>
                        <Col span={2}>完成／取消 <br/>时间</Col>
                        <Col span={2}>订单状态</Col>
                        <Col span={2}>取消费用</Col>
                        <Col span={2}>订单金额</Col>
                        <Col span={2}>返佣金额</Col>
                        <Col span={1}>应付金额</Col>
                        <Col span={1}>结算说明</Col>
                    </Row>
                </div>
            )

        }

    }
 }
_close() {
    this.setState({
        checkDetail:false,
    })
}

_renderOrderRows() {
    let head  = this.state.head;
    if(this.state.loading) {
        return (
            <Spin tip="加载中，请稍后"></Spin>
        )
    } else {
        if(this.state.datas){
            if(head&&head.settleSource){
                if(head.settleSource==3){
                    return (
                        <div className="list-body">
                            {
                                this.state.datas.map((order,index)=>{
                                    return(
                                    <div className="list-item">
                                    <Row  className="list-main"   type="flex" justify="space-around" align="middle">
                                        {<Col title={order.realOrderNo}className="every-item" span={2}>{order.realOrderNo || "——"}</Col>}
                                        {<Col title={order.zOrderNo}className="every-item" span={2}>{order.zOrderNo || "——"}</Col>}
                                        {<Col title={order.thridOrderNo}className="every-item" span={2}>{order.thridOrderNo || "——"}</Col>}
                                        {<Col title={order.orderOptName }className="every-item" span={2}>{order.orderOptName || "——"}</Col>}
                                        {<Col title={order.orderTypeName}className="every-item" span={2}>{order.orderTypeName || "——"}</Col>}
                                        {<Col title={order.serviceCityName}className="every-item" span={2}>{order.serviceCityName || "——"}</Col>}
                                        {<Col title={order.orderStatusName}className="every-item" span={1}>{order.orderStatusName || "——"}</Col>}
                                        {<Col title={order.orderCreateTime}className="every-item" span={2}>{order.orderCreateTime&&order.orderCreateTime.substr(0,10)|| "——"}<br/>{order.orderCreateTime&&order.orderCreateTime.substr(11)}</Col>}
                                        {<Col title={order.serviceTime}className="every-item" span={2}>{order.serviceTime&&order.serviceTime.substr(0,10)|| "——"}<br/>{order.serviceTime&&order.serviceTime.substr(11)}</Col>}
                                        {<Col title={order.completeTime}className="every-item" span={2}>{order.completeTime&&order.completeTime.substr(0,10) || "——"}<br/>{order.completeTime&&order.completeTime.substr(11)}</Col>}
                                        {<Col title={order.orderCancelFee}className="every-item money-item" span={1}>{order.orderCancelFee >= 0 ?'¥ '+ order.orderCancelFee :"——"}</Col>}
                                        {<Col title={order.orderAmount} className="every-item money-item" span={1}>{order.orderAmount>=0 ?'¥ '+order.orderAmount: "——"}</Col>}
                                        {<Col title={order.settleCommisionAmount} className="every-item money-item" span={1}>{order.settleCommisionAmount>=0 ? '¥ '+ order.settleCommisionAmount: "——"}</Col>}
                                        {<Col title={order.settleShouldAmount-order.settleCommisionAmount} className="every-item money-item" span={1}>{order.settleShouldAmount>=0 ?"¥ "+(order.settleShouldAmount-order.settleCommisionAmount): "——"}</Col>}
                                        {<Col className="every-item btns" span={1} >{order.remark ? <span onClick={this.accountsExplain.bind(this,order.remark)}>查看</span>: "——"}</Col>}
                                    </Row>
                                    </div>
                                    )
                                })
                            }
                        </div>
                    )
                }else if(head.settleSource==2){
                    return (
                        <div className="list-body">
                        {
                            this.state.datas.map((order,index)=>{
                                return(
                                    <div  className="list-item">
                                        <Row  className="list-main" type="flex" justify="space-around" align="middle">
                                            {<Col title={order.realOrderNo}className="every-item" span={2}>{order.realOrderNo || "——"}</Col>}
                                            {<Col title={order.thridOrderNo}className="every-item" span={2}>{order.thridOrderNo || "——"}</Col>}
                                            {<Col title={order.hotelName }className="every-item" span={2}>{order.hotelName || "——"}</Col>}
                                            {<Col title={order.orderOptName }className="every-item" span={2}>{order.orderOptName || "——"}</Col>}
                                            {<Col title={order.numOfRooms}className="every-item" span={2}>{order.numOfRooms || "——"}</Col>}
                                            {<Col title={order.checkinDate + ' ' + order.checkoutDate}className="every-item" span={2}>{order.checkinDate} <br/> {order.checkoutDate}</Col>}
                                            {<Col title={order.guestNames}className="every-item" span={1}>{order.guestNames || "——"}</Col>}
                                            {<Col title={order.orderStatusName}className="every-item" span={2}>{order.orderStatusName || "——"}</Col>}
                                            {<Col title={order.orderCreateTime}className="every-item" span={2}>{order.orderCreateTime&&order.orderCreateTime.substr(0,10)|| "——"}<br/>{order.orderCreateTime&&order.orderCreateTime.substr(11)}</Col>}
                                            {<Col title={order.cancelTime}className="every-item" span={2}>{order.cancelTime && order.cancelTime.substr(0,10) || "——"}</Col>}
                                            {<Col title={order.orderCancelFee}className="every-item money-item" span={1}>{order.orderCancelFee >=0 ? '¥ '+order.orderCancelFee : "——"}</Col>}
                                            {<Col title={order.orderAmount}className="every-item money-item" span={1}>{order.orderAmount>=0 ? '¥ '+ order.orderAmount : "——"}</Col>}
                                            {<Col title={order.settleCommisionAmount}className="every-item money-item" span={1}>{order.settleCommisionAmount>=0 ? '¥ '+ order.settleCommisionAmount: "——"}</Col>}
                                            {<Col title={order.settleShouldAmount-order.settleCommisionAmount} className="every-item money-item" span={1}>{order.settleShouldAmount>=0 ?'¥ '+(order.settleShouldAmount-order.settleCommisionAmount): "——"}</Col>}
                                            {<Col className="every-item btns" span={1} >{order.remark ? <span onClick={this.accountsExplain.bind(this,order.remark)}>查看</span>: "——"}</Col>}
                                        </Row>
                                    </div>
                                )
                            })
                        }
                        </div>
                    )
                }else if(head.settleSource==4){
                    return (
                        <div className="list-body">
                        {
                            this.state.datas.map((order,index)=>{
                                return(
                                    <div  className="list-item">
                                    <Row  className="list-main" type="flex" justify="space-around" align="middle">
                                        {<Col title={order.realOrderNo }className="every-item" span={2}>{order.realOrderNo || "——"}</Col>}
                                        {<Col title={order.fxMerchantName }className="every-item" span={2}>{order.fxMerchantName || "——"}</Col>}
                                        {<Col title={order.serviceCityName }className="every-item" span={2}>{order.serviceCityName || "——"}</Col>}
                                        {<Col title={order.orderOptName }className="every-item" span={2}>{order.orderOptName || "——"}</Col>}
                                        {<Col title={order.orderCreateTime}className="every-item" span={2}>{order.orderCreateTime&&order.orderCreateTime.substr(0,10) || "——"}<br/>{order.orderCreateTime&&order.orderCreateTime.substr(11)}</Col>}
                                        {<Col title={order.serviceTime}className="every-item" span={2}>{order.serviceTime&&order.serviceTime.substr(0,10) || "——"}<br/>{order.serviceTime&&order.serviceTime.substr(11)}</Col>}
                                        {<Col title={order.completeTime}className="every-item" span={2}>{order.completeTime&&order.completeTime.substr(0,10)|| "——"}<br/>{order.completeTime&&order.completeTime.substr(11)}</Col>}
                                        {<Col title={order.orderStatusName}className="every-item" span={2}>{order.orderStatusName || "——"}</Col>}
                                        {<Col title={order.orderCancelFee}className="every-item money-item" span={2}>{order.orderCancelFee>=0 ? '¥ '+order.orderCancelFee : "——"}</Col>}
                                        {<Col title={order.orderAmount}className="every-item money-item" span={2}>{order.orderAmount>=0 ? '¥ '+order.orderAmount:"——"}</Col>}
                                        {<Col title={order.settleCommisionAmount}className="every-item money-item" span={2}>{order.settleCommisionAmount>=0 ? '¥ '+order.settleCommisionAmount: "——"}</Col>}
                                        {<Col title={order.settleShouldAmount-order.settleCommisionAmount} className="every-item money-item" span={1}>{order.settleShouldAmount>=0 ?'¥ '+(order.settleShouldAmount-order.settleCommisionAmount): "——"}</Col>}
                                        {<Col className="every-item btns" span={1} >{order.remark ? <span onClick={this.accountsExplain.bind(this,order.remark)}>查看</span>: "——"}</Col>}
                                    </Row>
                                  </div>
                                )
                            })
                        }
                        </div>
                    )
                }
            }

        }
    }
}
render() {
    return (
        <div>
            <div className="list-table-wrapper">
                {this._renderOrderRowsHeader()}
                {this._renderOrderRows()}
            </div>
           {
                (()=> {
                    let res = [];
                    if(this.state.checkDetail) {
                        res.push(<div className="accounts-Explain">
                        <div className="mask"></div>
                        <div className="accounts-wrap">
                            <div className="head">结算说明<Icon className="close" type="close" onClick={this._close.bind(this)}/></div>
                            <div className='cont'>{this.state.detailValue}</div>
                        </div>
                        </div>)
                    }
                    return res;
                })()
            }
            <Page
                total={this.state.pagination.total}
                onHandle={this._changePage.bind(this)}
                current={this.state.pagination.current}
                limit={this.state.pagination.limit} />
        </div>
    )
  }
}
const mapStateToProps = (state) => {
    return {
        renderAccount: state.main.renderAccount
    }
}
export default connect(mapStateToProps)(BillTable);

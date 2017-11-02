import React, {Component} from "react";
import {Row, Col} from "local-Antd";
import "components/globleCss/font.scss";
import { connect } from 'react-redux';

class PurchaseOrder extends Component {
    constructor(props, context) {
        super(props, context);
    }

    getShowPrice(price=0) {
        return (price / this.props.currencyInfo.rate).toFixed(2);
    }
    
    render() {
        console.log('render qita', this.props);

        return (
            <div>
                {
                  this.props.others && this.props.currencyInfo ?
                  <div>
                      <div className="title">其它</div>
                      <div className="list-table">
                         <Row  className="list-head" type="flex" justify="space-around" align="middle">
                             <Col  span={6}>其它</Col>
                             <Col  span={6}>数量</Col>
                             <Col  span={6}>单价</Col>
                             <Col  span={6}>总价</Col>
                         </Row>
                         {
                            this.props.others.map((item, index)=>{
                                return (
                                    <div className="list-item">
                                        <Row  className="list-main"  type="flex" justify="space-around" align="middle">
                                            <Col  span={6}>{item.name}</Col>
                                            <Col  span={6}>{item.num}</Col>
                                            <Col  span={6} className="jin-e"><span className="rmb">{this.props.currencyInfo.showCcy} </span>{this.getShowPrice(item.price)}</Col>
                                            <Col  span={6} className="jin-e"><span className="rmb">{this.props.currencyInfo.showCcy} </span>{this.getShowPrice(item.totalPrice)}</Col>
                                        </Row>
                                    </div>
                                )
                            })
                         }
                     </div>
                  </div>:null
                }
            </div>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        others: state.main.others,
        currencyInfo: state.main.currencyInfo,
    }
}

export default connect(mapStateToProps)(PurchaseOrder);

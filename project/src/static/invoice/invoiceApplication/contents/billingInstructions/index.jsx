import React, {Component} from "react";
import './sass/index.scss';

class BillingInstruction extends Component {
    constructor(props,context){
        super(props,context);
    }

    render(){
        return(
        <div className="billing-instructions">
            <div className="billing-instructions-title">
                开票说明
            </div>
            <div className="billing-instructions-container">
                <p>1. 用车类现付订单，开票时间为服务结束3天之后可以申请。酒店类现付订单离店日一天后可以申请</p>
                <p>2. 使用账户余额支付的订单，需要订单回款后才可以申请</p>
                <p>3. 月结账单，开票时间为付款当日起，2个月内均可申请</p>
                <p>4. 快递发票一月内第一次申请由我司承担快递费用，第二次及以上默认顺丰到付</p>
                <p>5. 目前可开发票类型仅限"增值税普通发票"，支持纸质发票和电子发票</p>
                <p>6. 根据国家税务总局规定，索取发票时需提供“纳税人识别号”，请在申请时填写此信息</p>
                <p>7. 开票说明最终解释权归云地接所有</p>
            </div>
        </div>
        )
    }
}
export default BillingInstruction;


import React, {Component} from "react";
import { connect } from 'react-redux';
import ApiConfig from 'widgets/apiConfig/index.js';
import Message from "components/ui-msg/index.jsx";
import BaseCss from 'local-BaseCss/dist/main.css';
import GlobleCss from 'components/globleCss/index.scss';
import YdjAjax from 'components/ydj-Ajax/index.js';
import Input from "components/ui-input/index.jsx";
import update from 'react-addons-update';
import {Icon,InputNumber} from 'local-Antd';
import Marks from 'components/ui-mark/index.jsx';
import {showAlert,updateBreif} from '../../action/index.js';
import './sass/index.scss';

class CountPrice extends Component {
    constructor(props,context) {
        // props.data:{
        //   profitRate 毛利率
        //   totalSalePrice 成本
        //   avgCostPrice 人均成本
        //   guestNum 人数
        //   ccy 币种
        // }
        super(props, context);
        this.state = {
            profitRate: props.data.profitRate,//毛利率
        };
        this.data = {};
    }
    getFormData(info) {
		this.data[info.name] = info.value;
	}

    /**
     * 提交/取消
     * @param  {[type]} type [description]
     */
    showConfirm(type){
		if(type == 'confirm' || type == 'ok'){
			this.save();
		}else{
            //取消
            // let obj = {
            //     save: false,
            //     data: {}
            // }
            this.props.sucHandle && this.props.sucHandle();
		}
	}
    /*提交*/
    save() {
        let commitData = {
            editType: 1,
            routeNo: this.props.breif.routeNo,//订单号
            profitRate: this.state.profitRate,//毛利率
            // totalSalePrice: this.props.breif.totalSalePrice,
            // guestNum: this.props.data.guestNum,
            // ccy: this.props.data.ccy,
            priceChannel: this.getTotal(),
            priceInclude: this.data.priceInclude || this.props.breif.priceInclude,
            priceExclude: this.data.priceExclude || this.props.breif.priceExclude,

        }
        let opt = {
            url: ApiConfig.updateDetail,
            type: 'POST',
            headers : {
              'Content-Type':'application/json'
            },
            data: JSON.stringify(commitData),
            successHandle: (res)=>{
                let newBreif = update(this.props.breif,{
                    profitRate: {
                        $set: this.state.profitRate
                    },
                    profit: {
                        $set: (this.getTotal(true) - this.props.data.totalSalePrice).toFixed(2)
                    },
                    priceChannel: {
                        $set: this.getTotal(true)
                    },
                    priceInclude: {
                        $set: commitData.priceInclude
                    },
                    priceExclude: {
                        $set: commitData.priceExclude
                    }
                })
                this.props.dispatch(updateBreif(newBreif));
                // let obj = {
                //     save: true,
                //     data: {
                //         profitRate: this.state.profitRate,
            	// 		priceChannel: this.getTotal(),
                //         profit: this.getTotal() - this.props.data.totalSalePrice
                //     }
                // }
                this.props.sucHandle && this.props.sucHandle();
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
    //获取最终人民币报价
    getTotal(isShow) {
        let totalSalePrice = this.props.breif.totalSalePrice;//人民币成本
        let profitRate = this.state.profitRate/100;//毛利率
        let rate = this.props.data.rate;//汇率
        if(isShow){
            return  ((totalSalePrice*(1+profitRate))/rate).toFixed(2);//用于显示，可能为外币
        }
        else {
            return (totalSalePrice*(1+profitRate)).toFixed(2);//用于提交，为人民币
        }
    }
    //取人均价
    average(num) {
        let av = (num/this.props.data.guestNum).toFixed(2);
        return av;
    }
    //获取利率
    getProfitRate(value) {
        console.log('changed', value);
        this.setState({
            profitRate: value
        })
    }
    render(){
        let propsData = this.props.data;
        let priceChannel = this.getTotal(true);//最终报价
        return(
            <div>
            {
                <Message
                initData={{
                    title : '最终报价核算',
                    showType : 'confirm',
                    okText : '保存',
                    asyn : true,
                    showFlag : true,
                    disabled: true,
                    backHandle :this.showConfirm.bind(this)
                }}
                uiClassName = 'countPrice'
                >
                    <dl>
                        <dt>参考成本：<i></i></dt>
                        <dd>
                            <p className="grey">
                                <i>{propsData.ccy} </i>
                                <strong>{propsData.totalSalePrice}</strong>
                                （{propsData.guestNum}人，人均：{propsData.ccy} {propsData.avgCostPrice}/人）
                            </p>
                        </dd>
                    </dl>
                    <dl>
                        <dt>毛利率：<i>*</i></dt>
                        <dd>
                        <InputNumber
                            size="large"
                            defaultValue={propsData.profitRate}
                            step={0.1}
                            formatter={value => `${value}%`}
                            parser={value => value.replace('%', '')}
                            onChange={this.getProfitRate.bind(this)}
                        />
                        </dd>
                    </dl>
                    <dl>
                        <dt>最终报价：<i>*</i></dt>
                        <dd>
                            <div className="total">{priceChannel}<i>{propsData.ccy}</i></div>
                            <p className="grey">（{propsData.guestNum}人，人均：{propsData.ccy} {this.average.bind(this,priceChannel)()}/人）<span>本单利润：{propsData.ccy} {(priceChannel-propsData.totalSalePrice).toFixed(2)}</span></p>
                        </dd>
                    </dl>
                    <dl>
                        <dt>报价包含：<i></i></dt>
                        <dd>
                            <Marks
                                onHandle={this.getFormData.bind(this)}
                                name='priceInclude'
                                value={this.props.breif.priceInclude}
                            />
                        </dd>
                    </dl>
                    <dl>
                        <dt>报价不包含：<i></i></dt>
                        <dd>
                            <Marks
                                onHandle={this.getFormData.bind(this)}
                                name='priceExclude'
                                value={this.props.breif.priceExclude}
                            />
                        </dd>
                    </dl>
                </Message>
            }

            </div>
        )
    }
}

// export default CountPrice;
const mapStateToProps = (state) => {
	return {
        breif: state.main.breif
	}
}

export default connect(mapStateToProps)(CountPrice);

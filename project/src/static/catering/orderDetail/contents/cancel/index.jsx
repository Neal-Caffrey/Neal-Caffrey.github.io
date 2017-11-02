import React, {
  Component
} from 'react';
import {
	connect
} from 'react-redux';
import {Icon,Radio, Input} from 'local-Antd';
const RadioGroup = Radio.Group;
import $ from 'local-Zepto/dist/main.js';
import YdjAjax from 'components/ydj-Ajax/index.js';
import ApiConfig from 'widgets/apiConfig/index.js';
import './sass/index.scss';

const REASON = [{
		'id': 1,
		'txt': '时间不合适'
	}, {
		'id': 2,
		'txt': '信息填写错误'
	}, {
		'id': 3,
		'txt': '选错商家'
	}, {
		'id': 4,
		'txt': '没有理由'
	}];
class OrderCancel extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			reasonId: 1
		}
	}
	_close() {
		this.props.closeHandle && this.props.closeHandle();
	}
	_changeReason(e) {
		// debugger
		this.setState({
	      reasonId: e.target.value,
	    });
	}
	_getReasonCont(id) {
		let txt = '';
		REASON.map((item, index)=>{
			if(item.id == id) {
				txt = item.txt;
			}
		})
		return txt;
	}

	_cancel() {
		this.props.submitHandle && this.props.submitHandle({
			'id': this.state.reasonId,
			'txt': this._getReasonCont(this.state.reasonId)
		});
	}
	render(){
		const radioStyle = {
	      display: 'block',
	      height: '35px',
	      lineHeight: '35px',
	    };
		if(!this.props.showCancel) {
			return null
		}

		return (
			<div className="cancel-wrap">
			    <div className="mask"></div>
			    <div className="cont">
			        <div className="title">取消订单 <Icon className="close" type="close" onClick={this._close.bind(this)}/></div>
			        <div className="cont-inner">
			        	<div className="tip">
				            <p className="t">温馨提示</p>
				            <p>1. 订单一旦取消，无法恢复</p>
				            <p>2. 如未到现场消费，支付的订座押金不予退回</p>
				        </div>
				        <div className="cancel-t">请选择取消订单原因(必选)：</div>
				        <div className="cancel-form">
					        <RadioGroup onChange={this._changeReason.bind(this)} value={this.state.reasonId}>
					        {
					        	REASON.map((item, index)=>{
					        		return (
					        			<Radio style={radioStyle} value={item.id}>{item.txt}</Radio>
				        			)
					        	})
					        }
							</RadioGroup>
				        </div>
			        </div>
			        <div className="btns-row">
				        <div className="cancel-btn" onClick={this._close.bind(this)}>取消</div>
				        <div className="confirm-btn" onClick={this._cancel.bind(this)}>确认</div>
			        </div>
			    </div>
			</div>
		)
	}
}
const mapStateToProps = (state) => {
  return {
    header: state.header
  }
}

export default connect(mapStateToProps)(OrderCancel);
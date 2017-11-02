import React, {
	Component
} from 'react';
import {
	connect
} from 'react-redux';

import YdjAjax from 'components/ydj-Ajax/index.js';
import ApiConfig from 'widgets/apiConfig/index.js';
import {switchOrderStatus, showAlert} from '../../action/index.js';

class StatusNavSelect extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {};
	}

	componentWillMount() {
		if(this.props.header.info) {
			this.agentInfo = {};
			this.agentInfo.agentId = this.props.header.info.agentInfo.agentId; //渠道 必填
			this.agentInfo.agentOpId = this.props.header.info.agentInfo.agentUserId; // 查询人Id
			this._getCount();
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.header.info) {
			if (!this.props.header.info) {
				this.agentInfo = {};
				this.agentInfo.agentId = nextProps.header.info.agentInfo.agentId; //渠道 必填
				this.agentInfo.agentOpId = nextProps.header.info.agentInfo.agentUserId; // 查询人Id
				this._getCount();
			} else if (this.props.fxOrderStatus != nextProps.fxOrderStatus) {
				this._getCount();
			}
		}
	}
	get statusList() {
		let status = [];
		this.fxOrderStatus.map((item, index)=>{
			item.show && (status = status.concat([item]));
		});
		return status;
	}

	get _handleErrors() {
		let handles = {
			failedHandle: (res) => {
				this.setState({
					...res.data
				});
				this.props.dispatch(showAlert(res.message));
			},
			errorHandle: (xhr, errorType, error, errorMsg) => {
				this.props.dispatch(showAlert(errorMsg));
			}
		};
		return handles;
	}

	_getCount() {
		let params = this.agentInfo;

		let opt = {
			url: ApiConfig.cateringOrderCount,
			data: params,
			successHandle: (res) => {
				// debugger
				this.setState({
					'orderNums': res.data
				});
			},
			...this._handleErrors
		}
		this.setState({
			loading: true
		}, ()=> {
			new YdjAjax(opt);
		});
	}

	get fxOrderStatus() {
		return [{
				code: 1,
				desc: "未支付",
				show: true,
				active: true,
			}, {
				code: 2,
				desc: "待确认",
				show: true,
			}, {
				code: 3,
				desc: "已确认",
				show: true,
			}, {
				code: 4,
				desc: "待结算",
				show: true,
			}, {
				code: 5,
				desc: "已完成",
				show: true,
			}, {

				code: 6,
				desc: "已取消",
				show: true,
			}, {
				code: 7,
				desc: "全部订单",
				show: true,
			}, 
		]
	}
	_clickHandle(code) {
		this.props.dispatch(switchOrderStatus(code));
	}
	_getSize(status){
		// debugger
		let num = 0;
		if(!this.state.orderNums){
			return 0;
		}
		switch (status){
			case 1:
				num = this.state.orderNums.initCount || 0;
				break;
			case 2:
				num = this.state.orderNums.paySuccessCount || 0;
				break;
			case 3:
				num = this.state.orderNums.confirmCount || 0;
				break;
			case 4:
				num = this.state.orderNums.toSettleCount || 0;
				break;
			case 5:
				num = this.state.orderNums.settledCount || 0;
				break;
			case 6:
				num = this.state.orderNums.cancledCount || 0;
				break;
			case 7 :
				num = this.state.orderNums.allCount || 0;
		}
		return num;
	}

	render() {
		return (
			<div className="order-status-bar">
				<ul>
					{(()=>{
						let res = [];
						this.statusList.map((item, index)=>{
							if(item.show) {
								res.push(
									<li key={`status-${index}`} className={item.code == this.props.fxOrderStatus ? "active" : ""} onClick={this._clickHandle.bind(this, item.code, index)}><span>{item.desc}({this._getSize(item.code)})</span></li>
								)
							}
						})
						return res;
					})()}
				</ul>
			</div>
		)
	}
}
const mapStateToProps = (state) => {
	return {
		fxOrderStatus: state.main.fxOrderStatus,
		header: state.header
	}
}

export default connect(mapStateToProps)(StatusNavSelect);
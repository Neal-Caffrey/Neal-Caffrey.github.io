import React, {
	Component,
} from "react";

import {
    connect
} from 'react-redux';

import {
	Button,
	Icon
} from 'local-Antd';

import {
  _extend
} from 'local-Utils/dist/main.js';
import YdjAjax from 'components/ydj-Ajax/index.js';
import ApiConfig from 'widgets/apiConfig/index.js';
import Msg from 'components/ui-msg/index.jsx';

import './sass/index.scss';

class ButtonRow extends Component {
	constructor(props, context) {
		super(props, context);

		this.data= {};
		this.state = this.defaultState;
	}

	componentWillMount() {
		debugger
		this._getInvoiceInfo(this.props);
		this.setState({
			validInfo: this._checkValid()
		});
	}

	componentWillReceiveProps(nextProps) {
		debugger
		this._getInvoiceInfo(nextProps);
		this.setState({
			validInfo: this._checkValid()
		});
	}

	get defaultState() {
		return {
			validInfo: {
				validFlag: false, // 默认验证bu通过
			}
		}
	}

	get attr() {
		debugger
		if(!this.state.validInfo.validFlag) {
			return {
				disabled: true
			}
		} 
		return {}
	}

	_getInvoiceInfo(props) {
		let p = props || this.props;
		let agentInfo = p.header.info.agentInfo;
		let invoiceInfo = p.main.invoiceInfo;
		let addressInfo = p.main.addressInfo;
		_extend(this.data, {
			'billNo': invoiceInfo.billNo,
			'agentId':	agentInfo.agentId, // 代理商id
			'billHeaderType': invoiceInfo.billHeaderType, // 抬头类型 1 公司 2 个人
			'billHeader': invoiceInfo.billHeader, // 抬头
			'billTaxpayerNum': invoiceInfo.billTaxpayerNum, // 纳税人识别号
			'billContent': invoiceInfo.billContent, // 发票内容
			'billType': invoiceInfo.billType, // 发票类型 1 电子 2纸质
			'remark': invoiceInfo.remark, // 备注
			
	  		'billContactsAddress': addressInfo.billContactsAddress,
	  		'billContactsName': addressInfo.billContactsName,
	  		'billContactsPhone': addressInfo.billContactsPhone,
		});
	}

	_checkValid() {
		// 验证创建发票必选参数
		let data = this.data;
		if(!data.agentId) {
			// 未获取到用户信息
			window.location.href = '/';
		}

		if(!data.billHeaderType) {
			return {
				validFlag: false,
				validMsg: '请选择抬头类型'
			}
		}

		if (!data.billHeader) {
			return {
				validFlag: false,
				validMsg: '请填写发票抬头'
			}
		}
		if (!/^[^\s][^]+$/.test(data.billHeader)) {
			return {
				validFlag: false,
				validMsg: '请正确填写发票抬头'
			}
		}

		if(data.billHeaderType != 2) {
			if (!data.billTaxpayerNum) {
				return {
					validFlag: false,
					validMsg: '请填写纳税人识别号'
				}
			}

			if (!/^[0-9a-zA-Z][0-9a-zA-Z]{5,}$/.test(data.billTaxpayerNum)) {
				return {
					validFlag: false,
					validMsg: '请正确填写纳税人识别号'
				}
			}
		}

		if(data.billHeaderType == 2 && data.billTaxpayerNum) {
			if (!/^[0-9a-zA-Z][0-9a-zA-Z]{5,}$/.test(data.billTaxpayerNum)) {
				return {
					validFlag: false,
					validMsg: '请正确填写纳税人识别号'
				}
			}
		}

		if (!data.billContent) {
			return {
				validFlag: false,
				validMsg: '请选择发票内容'
			}
		}

		if (!data.billType) {
			return {
				validFlag: false,
				validMsg: '请选择发票类型'
			}
		}

		if(data.billType == 1) {
			// 1 电子 2纸质
			if(!data.billContactsAddress){
				return {
					validFlag: false,
					validMsg: '请填写接收电子发票的邮件地址'
				}
			}
			// if(!/^[0-9A-Za-z\_]+@([0-9A-Za-z\_]+\.)+[a-zA-Z]{2,}$/i.test(data.billContactsAddress)) {
			// 	return {
			// 		validFlag: false,
			// 		validMsg: '请正确填写接收电子发票的邮件地址'
			// 	}
			// }
			
		}

		if(data.billType == 2) {

			if(!data.billContactsAddress || !data.billContactsName || !data.billContactsPhone) {
				// 1 电子 2纸质
				return {
					validFlag: false,
					validMsg: '请完善收取纸质发票的收件人信息'
				}
			}

			// if(!/^(((0|00|\+)?86)\s?)?(13|14|15|17|18|19)\d{9}$/.test(data.billContactsPhone)) {
			// 	// 1 电子 2纸质
			// 	return {
			// 		validFlag: false,
			// 		validMsg: '请正确填写手机号码'
			// 	}
			// }
			
		}

		return {
			validFlag: true
		}
	}
	_submit() {
		this._getInvoiceInfo();
		let validInfo = this._checkValid();
		this.setState({
			validInfo: validInfo
		}, ()=>{
			if(this.state.validInfo.validFlag) {
				this._creatInvoice((res)=>{
					window.location.href = `/webapp/invoice/result.html?invoiceNo=${res.data.billNo}`;
				});
				
			} else {
				// TODO: 提示错误信息
				this.setState({
					isAlert: true,
					alertMsg: {
						msg: validInfo.validMsg
					},
				})
			}
			
		});
		
	}
	_cancel() {
		this.setState({
			isAlert: true,
			alertMsg: {
				msg: '确认放弃修改?',
				cancel: true
			},
		})
		
	}
	get errHandler() {
		return {
			failedHandle: (res) => {
				
				this.setState({
					isAlert: true,
					alertMsg: {
						msg: res.message
					},
					sending: false,
				})
			},
			errorHandle: (xhr, errorType, error, errorMsg) => {
				
				this.setState({
					isAlert: true,
					alertMsg: errorMsg,
					sending: false,
				})
			}
		}
	}

	// 更新发票
	_creatInvoice(back) {
		let opt = {
			url: ApiConfig.updateBills,
			type: 'POST',
			data: this.data,
			successHandle: (res) => {
				
				if (back) {
					back(res);
				}
			},
			...this.errHandler
		}
		new YdjAjax(opt);
	}
	_showMsg() {
		
      	if (this.state.isAlert) {
			let attr = {
				showFlag: true,
				showType: 'alert', // info alert confirm
				backHandle: () => {
					if (this.state.alertMsg.loginErr) {
						
						window.location.href = '/';
					}
					if (this.state.alertMsg.cancel) {
						
						window.location.href = `/webapp/invoice/detail.html?billNo=${this.props.main.invoiceInfo.billNo}&agentId=${this.props.header.info.agentInfo.agentId}`;
					}
					this.setState({
						isAlert: false
					})

				}
			};
			return (
				<Msg initData={attr}>
					<p>{this.state.alertMsg.msg}</p>
				</Msg>
			)
		}
		return null;
	}

	render() {
		debugger
		return (
			<div className="button-row">
				<Button {...this.attr} onClick={this._submit.bind(this)}>保存</Button>
				<Button onClick={this._cancel.bind(this)}>取消</Button>
				{this._showMsg()}
			</div>
		)
	}
}

const mapStateToProps = (state) => {
	debugger
  return {
    header: state.header,
    main: state.main
    // main: main
  }
}

export default connect(mapStateToProps)(ButtonRow);
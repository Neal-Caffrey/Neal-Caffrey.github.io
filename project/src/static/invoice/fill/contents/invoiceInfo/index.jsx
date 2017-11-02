import React, {
  Component
} from 'react';
import {
	connect
} from 'react-redux';
import {
  _extend
} from 'local-Utils/dist/main.js';

import {Radio, Select} from 'local-Antd';
const RadioGroup = Radio.Group;
const Option = Select.Option;


import Input from 'components/ui-input/index.jsx';
import YdjAjax from 'components/ydj-Ajax/index.js';
import ApiConfig from 'widgets/apiConfig/index.js';
import Marks from 'components/ui-mark/index.jsx';
import {updateInvoice} from '../../action/index.js';

import css from './sass/index.scss';

class InvoiceInfo extends Component {
	constructor(props, context) {
		super(props, context);
		this.data = {

		};
		this.state = {};
	}
	componentWillMount() {
		let info = this.props.header.info;
		let data = _extend({}, this.props.main.invoiceInfo, {
			billHeader: (this.props.main.invoiceInfo.billHeaderType == 1 ? info.agentInfo.agentName : info.agentInfo.agentUserName),
			billTaxpayerNum: info.agentInfo.taxpayerNo || '',
		});
		this.setState({
			billHeaderType: this.props.main.invoiceInfo.billHeaderType,
		});
		this.props.dispatch(updateInvoice(data));
	}

	_changeInvoiceInfo(name, ele) {
		let data = this.props.main.invoiceInfo;
		let info = this.props.header.info;
		let value;
		switch (name) {
			case 'billHeader':
				value = ele.value;
				data.billHeader = value;
				break;
			case 'billHeaderType':
				value = ele.target.value;
				data.billHeaderType = value;
				data.billHeader = (value == 1 ? info.agentInfo.agentName : info.agentInfo.agentUserName);
				this.setState({
					billHeaderType: value,
				});
				break;
			case 'billContent':
				value = ele;
				data.billContent = value;
				break;
			case 'billType':
				value = ele.target.value;
				data.billType = value;
				break;
			case 'billTaxpayerNum':
				value = ele.value;
				data.billTaxpayerNum = value;
				break;
			case 'remark':
				value = ele.value;
				data.remark = value;
				break;
		}
		this.props.dispatch(updateInvoice(data));
	}

	render(){
		debugger
		return (
			<div className="form-block">
				<h3>发票信息</h3>
				<dl>
					<dt>
						发票抬头
					</dt>
					{
						this.state.billHeaderType == 1 ? 
						<dd className="bill-header-wrap">
							<del className='fixed'>*</del>
							<Input
							labelClass='ui-input'
							className='bill-header'
							name='billHeader'
							onHandle={this._changeInvoiceInfo.bind(this, 'billHeader')}
							reg={/^[^\s][^]+$/}
							sign='发票抬头'
							value={this.props.header.info.agentInfo.agentName}
							placeholder='发票抬头'/>
						</dd> :null
					}
					{
						this.state.billHeaderType == 2 ? 
						<dd className="bill-header-wrap">
							<del className='fixed'>*</del>
							<Input
							labelClass='ui-input'
							className='bill-header'
							name='billHeader'
							onHandle={this._changeInvoiceInfo.bind(this, 'billHeader')}
							reg={/^[^\s][^]+$/}
							sign='发票抬头'
							value={this.props.header.info.agentInfo.agentUserName}
							placeholder='发票抬头'/>
						</dd> :null
					}
					
				</dl>
				<dl>
					<dt>
						抬头类型
					</dt>
					<dd className="bill-header-type-wrap">
						<del className='fixed'>*</del>
						<RadioGroup id='bill-header-type' 
						className='flex1-box' 
						value={this.props.main.invoiceInfo.billHeaderType || 1} 
						onChange={this._changeInvoiceInfo.bind(this, 'billHeaderType')}>
			              <Radio value={1} checked>公司</Radio>
			              <Radio value={2}>个人</Radio>
			            </RadioGroup>
					</dd>
				</dl>
				<dl>
					<dt>
						发票内容
					</dt>
					<dd className="bill-content-wrap">
						<del className='fixed'>*</del>
						<Select
							className="bill-content"
		                    showSearch={false}
		                    placeholder="请选择发票内容"
		                    onChange={this._changeInvoiceInfo.bind(this, 'billContent')}
		                    defaultValue="2"
		                >
		   					<Option value="1">代订租车费</Option>
		   					<Option value="2">旅游服务费</Option>
		   					<Option value="3">代订酒店费</Option>
		   					<Option value="4">代订机票款</Option>
		   					<Option value="5">团费</Option>
		   					<Option value="6">团款</Option>
		   					<Option value="7">旅游费</Option>
		                </Select>
					</dd>
				</dl>
				<dl>
					<dt>
						发票类型
					</dt>
					<dd className="bill-type-wrap">
						<del className='fixed'>*</del>
						<RadioGroup id='bill-type' className='flex1-box' value={this.props.main.invoiceInfo.billType || 1} onChange={this._changeInvoiceInfo.bind(this, 'billType')}>
			              <Radio value={1} checked>电子</Radio>
			              <Radio value={2}>纸质 <span className="tip">(质发票寄出时间大约为20个工作日，建议使用电子发票)</span></Radio>
			            </RadioGroup>

					</dd>
				</dl>
				<dl>
						<dt>
							纳税人识别号
						</dt>
						{
							this.state.billHeaderType == 1 ? 
							<dd className="bill-tax-wrap">
								<del className='fixed'>*</del>
								<Input
								labelClass='ui-input'
								className='bill-header'
								name='billTaxpayerNum'
								onHandle={this._changeInvoiceInfo.bind(this, 'billTaxpayerNum')}
								reg={/^[0-9a-zA-Z][0-9a-zA-Z]{5,}$/}
								sign='纳税人识别号'
								value={this.props.header.info.agentInfo.taxpayerNo}
								placeholder='纳税人识别号'/>
							</dd>:null
						}
						{
							this.state.billHeaderType == 2 ?
							<dd className="bill-tax-wrap">
								<Input
								labelClass='ui-input'
								className='bill-header'
								name='billTaxpayerNum'
								onHandle={this._changeInvoiceInfo.bind(this, 'billTaxpayerNum')}
								sign='纳税人识别号, 非必填'
								placeholder='纳税人识别号'/>
							</dd>: null
						}
				</dl>
				<dl>
					<dt className='tops'>
						备注
					</dt>
					<dd>
						<Marks
						max={500}
						placeholder=''
						onHandle={this._changeInvoiceInfo.bind(this, 'remark')}
						name='remark'
						/>
					</dd>
				</dl>
				<dl>
					<dt>
						开票金额
					</dt>
					<dd className="bill-amount-wrap">
					&yen; {this.props.main.totalInfo.billAmount}
					</dd>
				</dl>
			</div>
		)
	}
}
const mapStateToProps = (state) => {
	debugger
  return {
    header: state.header,
    main: state.main
  }
}

export default connect(mapStateToProps)(InvoiceInfo);
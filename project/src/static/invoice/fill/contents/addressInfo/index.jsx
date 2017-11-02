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


import Input from 'components/ui-input/index.jsx';
import YdjAjax from 'components/ydj-Ajax/index.js';
import ApiConfig from 'widgets/apiConfig/index.js';
import Marks from 'components/ui-mark/index.jsx';
import {updateAddress} from '../../action/index.js';

import css from './sass/index.scss';

class AddressInfo extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {};
	}

	componentWillMount() {
		let info = this.props.header.info;
		let data;
		
		if(this.props.main.invoiceInfo.billType == 1) {
			data = _extend({}, this.props.main.addressInfo, {
				billContactsAddress: info.agentInfo.agentUserEmail,
			});
		} 
		if(this.props.main.invoiceInfo.billType == 2) {
			data = _extend({}, this.props.main.addressInfo, {
				billContactsAddress: info.agentInfo.merchantBusinessAddress || '',
				billContactsName: info.agentInfo.agentUserName,
				billContactsPhone: info.agentInfo.agentUserPhone,
			});
		} 
		
		this.setState({
			billType : this.props.main.invoiceInfo.billType
		})
		this.props.dispatch(updateAddress(data));
	}

	componentWillReceiveProps(nextProps) {
		let invoiceInfo = nextProps.main.invoiceInfo;
		let info = nextProps.header.info;
		let data;
		
		if(invoiceInfo.billType != this.state.billType) {
			
			if(invoiceInfo.billType == 2) {
				data = _extend({}, this.props.main.addressInfo, {
					billContactsAddress: info.agentInfo.merchantBusinessAddress || '',
					billContactsName: info.agentInfo.agentUserName,
					billContactsPhone: info.agentInfo.agentUserPhone,
				});
			} 
			if(invoiceInfo.billType == 1) {
				data = _extend({}, this.props.main.addressInfo, {
					billContactsAddress: info.agentInfo.agentUserEmail,
				});
			}
			this.setState({
				billType : invoiceInfo.billType
			})
			
			this.props.dispatch(updateAddress(data));
		} 
	}

	_changeAddressInfo(name, ele) {
		let data = this.props.main.addressInfo;
		let value = ele.value;
		switch (name) {
			case 'billContactsAddress':
				data.billContactsAddress = value;
				break;
			case 'billContactsName':
				data.billContactsName = value;
				break;
			case 'billContactsPhone':
				data.billContactsPhone = value;
				break;
		}
		
		this.props.dispatch(updateAddress(data));
	}

	render(){
		return (
			<div className="form-block address-block">
				<h3>快递/收件信息</h3>
				{
					this.state.billType == 1 ? 
					<div>
						<dl>
							<dt>
								邮箱地址
							</dt>
							<dd className="address-wrap">
								<del className='fixed'>*</del>
								<Input
								labelClass='ui-input'
								className='address'
								name='billContactsAddress'
								onHandle={this._changeAddressInfo.bind(this, 'billContactsAddress')}
								// reg={/^[0-9A-Za-z\_]+@([0-9A-Za-z\_]+\.)+[a-zA-Z]{2,}$/i}
								sign='邮箱地址'
								value={this.props.header.info.agentInfo.agentUserEmail}
								placeholder='邮箱地址'/>
							</dd>
						</dl>
					</div>: null}
				{
					this.state.billType == 2 ? 
					<div>
						<dl>
							<dt>
								收件人地址
							</dt>
							<dd className="address-wrap">
								<del className='fixed'>*</del>
								<Input
								labelClass='ui-input'
								className='address'
								name='billContactsAddress'
								onHandle={this._changeAddressInfo.bind(this, 'billContactsAddress')}
								reg={/^[^\s]+$/}
								sign='收件人地址'
								value={this.props.header.info.agentInfo.merchantBusinessAddress}
								placeholder='收件人地址'/>
							</dd>
						</dl>
						<dl>
							<dt>
								收件人姓名
							</dt>
							<dd className="name-wrap">
								<del className='fixed'>*</del>
								<Input
								labelClass='ui-input'
								className='name'
								name='billContactsName'
								onHandle={this._changeAddressInfo.bind(this, 'billContactsName')}
								reg={/^[^\s]+$/}
								sign='收件人姓名'
								value={this.props.header.info.agentInfo.agentUserName}
								placeholder='收件人姓名'/>
							</dd>
						</dl>
						<dl>
							<dt>
								收件人电话
							</dt>
							<dd className="phone-wrap">
								<del className='fixed'>*</del>
								<Input
								labelClass='ui-input'
								className='phone'
								name='billContactsPhone'
								onHandle={this._changeAddressInfo.bind(this, 'billContactsPhone')}
								// reg={/^(((0|00|\+)?86)\s?)?(13|14|15|17|18|19)\d{9}$/}
								sign='收件人电话'
								value={this.props.header.info.agentInfo.agentUserPhone}
								placeholder='收件人电话'/>
							</dd>
						</dl>
					</div>:null
				}
			</div>
		)
	}
}
const mapStateToProps = (state) => {
  return {
    header: state.header,
    main: state.main
  }
}

export default connect(mapStateToProps)(AddressInfo);
import React, {Component} from "react";
import {
	connect
} from 'react-redux';
import OrderSign from 'components/ui-order-sign/indexd.jsx';
import OrderEditUser from 'components/ui-order-user/indexd.jsx';


import mainCss from "./sass/index.scss";

class OrderMain extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = this.defaultSate;

	}

	get defaultSate(){
		return {
			detailInfo : {}
		}
	}

	get detailInfo(){
		return this.state.detailInfo;
	}

	componentWillReceiveProps(nextProps){
		if(nextProps.edit){
			this.setState({
				detailInfo : nextProps.edit.info
			});
		}
	}
	
	render(){
		return (
			<div className='ui-order-con'>
				{
					this.detailInfo.orderDetail && 
					<OrderSign 
					info={this.detailInfo.orderDetail} />
				} 
				<OrderEditUser />
			</div>
			)
	}
}

function mapStateToProps(state) {
	return {
		edit: state.edit,
	}
}

export default connect(mapStateToProps)(OrderMain);

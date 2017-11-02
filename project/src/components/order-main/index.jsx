import React, {Component, PropTypes} from "react";

import {
	connect
} from 'react-redux';

import OrderSign from 'components/ui-order-sign/index.jsx';
import OrderUser from 'components/ui-order-user/index.jsx';


import mainCss from "./sass/index.scss";

class OrderMain1 extends Component {
	static propTypes = {
		info : PropTypes.object
	}
	constructor(props, context) {
		super(props, context);
		this.state = this.defaultState;
	}

	get defaultState(){
		const { info , order} = this.props;
		return {
			detailInfo : info || order.info
		}
	}

	get info(){
		return this.state.detailInfo;
	}

	componentWillReceiveProps(nextProps){
		if(nextProps.order && nextProps.order.info != this.state.detailInfo){
			this.setState({
				detailInfo : nextProps.order.info
			});
		}
	}
	
	render(){
		return (
			<div className='ui-order-con'>
			{
				this.info && <OrderSign 
				info={this.info}/>
			}
			{
				this.info && <OrderUser
				info={this.info} />
			}
			</div>
			)
	}
}

function mapStateToProps(state) {
	return {
		order: state.order,
	}
}

export default connect(mapStateToProps)(OrderMain1);
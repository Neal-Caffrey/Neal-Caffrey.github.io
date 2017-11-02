import React, {
	Component,
	PropTypes
} from 'react';
import {
	connect
} from 'react-redux';
import Header from 'contents/header/index.jsx';
import Brief from './contents/brief/index.jsx';
import Detail from './contents/detail/index.jsx';
import Msg from 'components/ui-msg/index.jsx';
import {removeAlert} from './action/index.js';
import "./sass/index.scss";

class App extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {};
	}

	render() {
		console.log('想死啊，一直render我app');
		return (
			<div id='ui-wrap'>
				<Header active={5}/>
				<div className="main-wrap">
					<div className="content-main ">
						<Brief/>
						<Detail/>
					</div>
				</div>
			   {
				 (() => {
					 let res = [];
					 if (this.props.isAlert) {
					   let attr = {
						 showFlag: true,
						 showType: 'alert', // info alert confirm
						 backHandle: (t) => {
						   this.props.dispatch(removeAlert());
						   if (this.props.alertMsg.goLogin) {
							 window.location.href = '/';
						   }
						 }
					   };
					   res.push(<Msg initData = {attr}><p>{this.props.alertMsg.msg}</p></Msg>)
					 }
					 return res;
				   })()
			   }
	        </div>
		)
	}
}
const mapStateToProps = (state) => {
	return {
		isAlert: state.main.isAlert,
		alertMsg: state.main.alertMsg,
		brief: state.main.brief,
	}
}

export default connect(mapStateToProps)(App);

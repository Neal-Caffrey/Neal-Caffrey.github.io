import React, {
	Component,
	PropTypes
} from 'react';
import {
	connect
} from 'react-redux';
import {
	Row,
	Col
} from 'local-Antd';
import Header from 'contents/header/index.jsx';
import Footer from 'contents/footer/index.jsx';
import LeftMenu from 'contents/leftMenu/index.jsx';
import OrdersTable from './contents/orderTable/index.jsx';
// import OrderStatusSelect from './contents/statusNav/index.jsx';
import OrderSearch from './contents/searchForm/index.jsx';
import UiConsult from "components/ui-consult/index.jsx";
import Msg from 'components/ui-msg/index.jsx';
import {
	removeAlert
} from './action/index.js';

import BaseCss from 'local-BaseCss/dist/main.css';
import GlobleCss from 'components/globleCss/index.scss';
import './sass/index.scss';
const ISShowConsult = ((domain)=>{
  let reg = /www/;
  return reg.test(domain);
})(document.domain);
class App extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {};
	}

	render() {
		return (
			<div id='ui-wrap'>
		        <Header active={-1}/>
				<div className="wrapper ui-main ui-order-list ui-fixed-footer">
					{
			        	(()=> {
			        		let res = [];
			        		if(this.props.header.info) {
			        			res.push(<LeftMenu dataSource={this.props.header.info.menuInfo.leftMenu_a} curMenuUrl={`webapp/trip/orderList.html`}/>)
			        		}
			        		return res;
			        	})()
			        }

					<div className="list-cont">
						<h2>行程订单</h2>
						<OrderSearch/>
						<div className="list-table">
				    		<Row className="list-head" type="flex" justify="space-around" align="middle">
				        		<Col span={6}>行程名称</Col>
				        		<Col span={3}>出发日期</Col>
				        		<Col span={2}>游玩天数</Col>
				        		<Col span={3}>开始城市</Col>
				        		<Col span={4}>采购产品</Col>
								<Col span={3}>采购总额</Col>
				        		<Col span={3}>操作</Col>
				    		</Row>
						</div>
						<OrdersTable />
					</div>
				</div>
		        {
		          (() => {
		              let res = [];
		              if (this.props.isAlert) {
		                let attr = {
		                  showFlag: true,
		                  showType: 'alert', // info alert confirm
		                  backHandle: () => {
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
						{ISShowConsult ? <UiConsult /> : null}
						{ISShowConsult ? <Footer /> : null}
	        </div>
		)
	}
}
const mapStateToProps = (state) => {
	return {
		isAlert: state.main.isAlert,
		alertMsg: state.main.alertMsg,
		header: state.header
	}
}

export default connect(mapStateToProps)(App);

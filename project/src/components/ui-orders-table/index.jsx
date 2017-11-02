import React, {
	Component
} from 'react';
import {Row, Col, Spin} from 'local-Antd';
import Page from 'components/ui-page/index.jsx';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
export default class OrdersTable extends Component {
	constructor(props, context) {
		super(props, context);
		// this.cancelMap = {
	 //      'forbiden': {'code':0,'desc': '禁止取消'},
	 //      'staff': {'code': 2, 'desc': '客服取消'},
	 //      'sys': {'code': 4, 'desc': '系统取消'},
	 //      'guset': {'code': 8, 'desc': '客人取消'}
	 //    };
	 //    this.cancelPolice = [
	 //    	{code: 1, desc: '不可取消'},
	 //    	{code: 2, desc: '免费取消'},
	 //    	{code: 3, desc: '有偿取消'}
	 //    ];
		this.state = {
			datas: this.props.dataSource,
			pagination: this.props.pageSource,
			loading: this.props.loading,
		};
	}
	componentWillReceiveProps(nextProps) {
		this.setState({
			datas: nextProps.dataSource,
			pagination: nextProps.pageSource,
			loading: nextProps.loading,
		});
	}
	_getDate(dataString) {
		return 	!dataString? '': dataString.replace(/\s/g, '').substr(0, 10);
	}

	_renderGuestNames(nameList) {
		if(nameList && nameList.length) {
			return (
				<Col className="guest-name" span={3}><span key={`guest-0`}>{nameList[0].lastName}/{nameList[0].firstName}</span></Col>
			)
		} else {
			return (
				<Col className="guest-name" span={3}>未填写</Col>
			)
		}
		
		
	}
	// 取消规则
	_renderCancelPolicy(data) {
		// debugger
		let txt1 ='';
		let txt2 ='';
		// 订单不可取消
		if(!data.cancelEnable) {
			txt1 = '取消政策：';
			txt2 = '不可取消';
			return (
				<Col span={14}>{txt1}<span>{txt2}</span></Col>
			)
		}

		let cancelRule = data.cancelRule?JSON.parse(data.cancelRule):[];
		let len = cancelRule.length;
		let re = /(\d{4}).(\d{2}).(\d{2}).((\d{2}):(\d{2}):(\d{2}))/;
		let now = moment();
		let showItem = {};
		for (let i = 0; i < len; i++) {
			let item = cancelRule[i];
			let fromTime, toTime;
			if (item.type == 1) {
				if (item.fromTime) {
					let timeArray = re.exec(item.fromTime);
					fromTime = timeArray[1] + '-' + timeArray[2] + '-' + timeArray[3] + ' ' + timeArray[4];
					let diff = moment(fromTime).diff(moment(now), 'seconds');
					if (diff < 1) {
						showItem = {
							txt: '取消政策：不可取消',
						};
						break;
					}
				} else {
					showItem = {
						txt: '取消政策：不可取消',
					};
					break;
				}

			} else if (item.type == 2) {
				if (item.toTime) {
					let timeArray = re.exec(item.toTime);
					toTime = timeArray[1] + '-' + timeArray[2] + '-' + timeArray[3] + ' ' + timeArray[4];
					let diff = moment(toTime).diff(moment(now), 'seconds');
					if (diff > 0) {
						showItem = {
							txt: '免费取消：',
							to: `${item.toTime}之前`
						};
						break;
					}
				} else {
					showItem = {
						txt: '取消政策：免费取消',
					};
					break;
				}
			} else if (item.type == 3) {
				let fromDiff, toDiff;
				if (item.fromTime) {
					let timeArray = re.exec(item.fromTime);
					fromTime = timeArray[1] + '-' + timeArray[2] + '-' + timeArray[3] + ' ' + timeArray[4];
					fromDiff = moment(fromTime).diff(moment(now), 'seconds');
				}
				if (item.toTime) {
					let timeArray = re.exec(item.toTime);
					toTime = timeArray[1] + '-' + timeArray[2] + '-' + timeArray[3] + ' ' + timeArray[4];
					toDiff = moment(toTime).diff(moment(now), 'seconds');
				}

				if (fromDiff != undefined && fromDiff < 1) {
					if (toDiff == undefined) {
						// 无底线
						showItem = {
							txt: '取消政策：付费取消',
						};
						break;
					} else if (toDiff > 0) {
						// 在此时间段以内
						showItem = {
							txt: '取消政策：付费取消',
						};
						break;
					}
				}
			}
		}
		
		return (
			<Col span={14}>
				{showItem.txt}
				<span>
					{showItem.from ? <span>{showItem.from}</span> : null}
					{showItem.to ? <span>{showItem.to}</span> : null}
				</span>
			</Col>
		)
	}

	// _renderCancelPolicy(order) {
	// 	let txt1 ='';
	// 	let txt2 ='';
	// 	// 订单不可取消
	// 	if(!order.cancelEnable) {
	// 		txt1 = '取消政策：';
	// 		txt2 = '不可取消';
	// 		return (
	// 			<Col span={12}>{txt1}<span>{txt2}</span></Col>
	// 		)
	// 	}

	// 	// 取消政策
	// 	if(order.cancelRule) {
	// 		let cancels = typeof order.cancelRule == 'string' ? JSON.parse(order.cancelRule): order.cancelRule;
	// 		let showCancel = cancels[0];
	// 		switch(showCancel.type) {
	// 			case 1:
	// 				txt1 = '取消政策：';
	// 				txt2 = '不可取消';
	// 				break;
	// 			case 2:
	// 				if (showCancel.toTime) {
	// 					txt1 = '免费取消截止日期：';
	// 					txt2 = showCancel.toTime;
	// 				} else {
	// 					txt1 = '取消政策：';
	// 					txt2 = '免费取消';
	// 				}
	// 				break;
	// 			case 3:
	// 				if (showCancel.toTime) {
	// 					txt1 = '有偿取消截止日期：';
	// 					txt2 = showCancel.toTime;
	// 				} else {
	// 					txt1 = '取消政策：';
	// 					txt2 = '有偿取消';
	// 				}
	// 				break;
	// 		}
	// 		return (
	// 			<Col span={12}>{txt1}<span>{txt2}</span></Col>
	// 		)
	// 	}

	// 	// 不满足如上条件不显示
	// 	return (
	// 		<Col span={12}></Col>
	// 	)
	// }

	_changePage(data) {
		let pageIndex = data.current || 1;
		// let pageIndex = data || 1;
		if(this.state.pagination.current == pageIndex) {
			return;
		}
		this.props.changeHandle && this.props.changeHandle('pageIndex', {'pageIndex': pageIndex});
	}
	_renderOrderRows() {
		if(this.state.loading) {
			return (
				<Spin tip="加载中，请稍后"></Spin>
			)
		} else {
			if(this.state.datas && this.state.datas.length){
				return (
					<div className="list-body">
					{
						this.state.datas.map((order, index)=>{
							return (
								<div key={order.orderNo} className="list-item">
				        			<Row className="order-head" >
				        				<Col span={24}>订单号：<b>{order.orderNo}</b> <span className="order-status">{order.orderStatusName}</span></Col>
						        	</Row>
						        	<Row className="list-main" type="flex" justify="space-around" align="middle">
							        	<Col className="hotel-name" span={5}>{order.hotelName || '未填写'}</Col>
						        		<Col span={4}>{order.bedTypeName || '未填写'}</Col>
						        		<Col span={2}>{order.numOfRooms}</Col>
						        		<Col className="contact" span={3}>{order.contactName || '未填写'}</Col>
						        		{this._renderGuestNames(order.guestList)}
						        		<Col className="check-date" span={3}><span>{this._getDate(order.checkinDate)}</span><span>{this._getDate(order.checkoutDate)}</span></Col>
						        		<Col className="price" span={2}>￥{order.priceChannel}</Col>
						        		<Col className="btns" span={2}>
						        			{
						        				order.orderStatus == 1001?
						        				<a target="_blank" className="pay-btn" href={`/webapp/hotel/orderDetail.html?orderNo=${order.orderNo}`}>立即支付</a>:
						        				null
						        			}
						        			<a target="_blank" href={`/webapp/hotel/orderDetail.html?orderNo=${order.orderNo}`}>查看订单</a>
					        			</Col>
						        	</Row>
						        	<Row className="order-foot">
						        		{this._renderCancelPolicy(order)}
				        				<Col className="order-time" span={10}>下单时间<span className="tip">(北京时间)</span>：<b>{order.createTime || '无记录'}</b></Col>
						        	</Row>
					        	</div>
							)
						})
					}
					<Page
		              total={this.state.pagination.total}
		              onHandle={this._changePage.bind(this)}
		              current={this.state.pagination.current}
		              limit={this.state.pagination.limit} />
					</div>
				)
			} else {
				return (
					<div className="non-orders">暂无相关订单</div>
				)
			}
		}
		
	}
	render() {
		return (
			<div className="list-table">
        		<Row className="list-head" type="flex" justify="space-around" align="middle">
	        		<Col span={5}>酒店名称</Col>
	        		<Col span={4}>房型</Col>
	        		<Col span={2}>房间数量</Col>
	        		<Col span={3}>联系人</Col>
	        		<Col span={3}>主入住人</Col>
	        		<Col className="check-date" span={3}><span>入住/离店日期</span><span className="tip">(当地时间)</span></Col>
	        		<Col span={2}>订单金额</Col>
	        		<Col span={2}>操作</Col>
        		</Row>
				{this._renderOrderRows()}
        	</div>
		)
	}
}
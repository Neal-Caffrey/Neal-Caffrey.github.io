import React, {Component, PropTypes} from "react";
import Storage from "local-Storage/dist/main.js";
import ApiConfig from 'widgets/apiConfig/index.js';
import infoCss from "./sass/index.scss";
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
class UIOrderInfo extends Component {
	static propTypes = {
		info : PropTypes.object,
	}
	constructor(props, context) {
		super(props, context);
		this.storage;
		this.state = this.defaultState;
	}

	get defaultState(){
		const { info } = this.props;
		return {
			info : info,
		};
	}

	get storage(){
		return this._storage = new Storage();
	}

	get info(){
		return this.state.info;
	}

	setCancel(cel){
		let _cel = [];
		cel.forEach((item, key) => {
			if(item.type == 1) _cel.push('• 不可取消');
			if(item.type == 2) _cel.push('• ' + item.toTime + '前免费取消');
			if(item.type == 3) _cel.push('• ' + item.fromTime + '后取消，扣款￥' + item.amount);
		});
		return _cel;
	}

	getWeek(date){
		return ['周', ['日', '一', '二', '三', '四', '五', '六'][(new Date(date)).getDay()]].join('');
	}

	_renderCancelPolicy(data) {
		let re = /(\d{4}).(\d{2}).(\d{2}).((\d{2}):(\d{2}):(\d{2}))/g;
		let showItem = {};
		let item = data;
		let now = moment();
		if (item.type == 1) {
			showItem = {
				txt: '• 不可取消',
			};
			if(item.fromTime) {
				let timeArray = re.exec(item.fromTime);
				let fromTime = timeArray[1] + '-' + timeArray[2] + '-' + timeArray[3] + ' ' + timeArray[4];
				let diff = moment(fromTime).diff(moment(now), 'seconds');
				if(diff > 0) {
					showItem.from = `${item.fromTime}之后`;
				}else {
					// 已过时不显示
					return null;
				}
			}
		} else if (item.type == 2) {
			showItem = {
				txt: '• 免费取消',
			};
			if(item.toTime) {
				let timeArray = re.exec(item.toTime);
				let toTime = timeArray[1] + '-' + timeArray[2] + '-' + timeArray[3] + ' ' + timeArray[4];
				let diff = moment(toTime).diff(moment(now), 'seconds');
				if(diff > 0) {
					showItem = {
						txt: '• 免费取消',
					};
					if (item.toTime) {
						showItem.to = `${item.toTime}之前`
					}
				} else {
					// 已过时不显示
					return null;
				}
			}
		} else if (item.type == 3) {
			showItem = {
				txt: '• 付费取消',
			};
			if (item.fromTime) {
				let fromTimeArray = re.exec(item.fromTime);
				let fromTime = fromTimeArray[1] + '-' + fromTimeArray[2] + '-' + fromTimeArray[3] + ' ' + fromTimeArray[4];
				let fromDiff = moment(fromTime).diff(moment(now), 'seconds');

				if(fromDiff > 0){
					// 起始点晚于当前
					showItem.from = `${item.fromTime}之后`;
					if (item.toTime) {
						showItem.to = `${item.toTime}之前取消，扣款￥${item.totalRoomAmount}`;
					} else {
						showItem.from = `${item.fromTime}后取消，扣款￥${item.totalRoomAmount}`;
					}
				} else {
					// 起始点早于当前
					if (item.toTime) {
						let toTimeArray = re.exec(item.toTime);
						let toTime = toTimeArray[1] + '-' + toTimeArray[2] + '-' + toTimeArray[3] + ' ' + toTimeArray[4];
						let toDiff = moment(toTime).diff(moment(now), 'seconds');
						if(toDiff > 0){
							// 结束晚于当前
							showItem.from = `${item.fromTime}之后`;
							showItem.to = `${item.toTime}之前取消，扣款￥${item.totalRoomAmount}`;
						}else {
							// 取消政策已过时不显示
							return null;
						}
					}else {
						showItem.from = `${item.fromTime}后取消，扣款￥${item.totalRoomAmount}`;
					}
				}

			} else {
				// 无fromTime
				if (item.toTime) {
					let toTimeArray = re.exec(item.toTime);
					let toTime = toTimeArray[1] + '-' + toTimeArray[2] + '-' + toTimeArray[3] + ' ' + toTimeArray[4];
					let toDiff = moment(toTime).diff(moment(now), 'seconds');
					if(toDiff > 0){
						// 结束晚于当前
						showItem.to = `${item.toTime}之前取消，扣款￥${item.totalRoomAmount}`;
					}else {
						// 取消政策已过时不显示
						return null;
					}
				}
			}
		}
		return (
			<span>
				{showItem.txt}
				{showItem.from ? <span>{showItem.from}</span> : null}
				{showItem.to ? <span>{showItem.to}</span> : null}
			</span>
		)
	}

	render(){
		return(
			<div className='ui-order-info'>
				<h3>预订信息</h3>
				<ul>
					<li>入住日期：{this.info.checkinDate.substr(0, 10)}&nbsp;&nbsp;（{this.getWeek(this.info.checkinDate)}）</li>
					<li>离店日期：{this.info.checkoutDate.substr(0, 10)}&nbsp;&nbsp;（{this.getWeek(this.info.checkoutDate)}）</li>
					<li>入住晚数：共{this.info.numOfStay}晚</li>
					<li>房间数量：共{this.info.numOfRooms}间</li>
					<li>房间类型：{this.info.roomBedBreakfastInfo.roomTypeName}</li>
					<li>床型：{this.info.roomBedBreakfastInfo.bedTypeName}</li>
					<li>早餐：{this.info.roomBedBreakfastInfo.breakfastTypeName}</li>
					<li className="cancel-policy">
						取消政策：

						{/*<div>
							this.setCancel(this.info.hotelCancelPolicy).map((item, key) => {
								return <p key={key}>{item}</p>
							})
						</div>*/}

						<div>
							{
								this.info.hotelCancelPolicy && this.info.hotelCancelPolicy.map((item, key) => {
									return (
										<p key={key}>{this._renderCancelPolicy(item)}</p>
									)
								})
							}
						</div>
					</li>
				</ul>
				<div className='ui-order-info-price'>预订金额：<span><em><code>&yen;</code>{this.info.totalRoomPrice}</em></span></div>
			</div>
			)
	}
}

export default UIOrderInfo;

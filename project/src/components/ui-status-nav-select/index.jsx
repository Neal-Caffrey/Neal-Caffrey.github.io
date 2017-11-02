import React, {
	Component
} from 'react';
export default class StatusNavSelect extends Component {
	constructor(props, context) {
		super(props, context);
		this.curPageUrl = this.curUrl;
		this.state = {
			status: this.statusList,
			activeCode: this.props.defaultStatus || this.activeCode || null
		};
	}
	componentWillUpdate(nextProps, nextState) {
		if(this.props.reset != nextProps.reset) {
			this.forceUpdate();
		}
	}
	get statusList() {
		let status = [];
		this.props.dataSource.map((item, index)=>{
			item.active == true && this.activeCode == undefined && (this.activeCode = item.code);
			item.show && (status = status.concat([item]));
		});
		return status;
	}
	_clickHandle(code, index) {
		this.setState({
			activeCode: code
		},()=>{
			this.props.changeHandle && this.props.changeHandle('status', {status: code});
		});
	}
	_getSize(status){
		let num = 0;
		if(!this.props.dataAll){
			return 0;
		}
		switch (status){
			case 1001:
				num = this.props.dataAll.noPaySize;
				break;
			case 2010:
				num = this.props.dataAll.bookingSuccessSize;
				break;
			case 2020:
				num = this.props.dataAll.bookingPenddingSize;
				break;
			case 3001:
				num = this.props.dataAll.afterCheckinSize;
				break;
			case 3005:
				num = this.props.dataAll.cancelSize || 0;
				break;
			case 3006:
				num = this.props.dataAll.bookingFailedSize;
				break;
			case null :
				num = this.props.dataAll && this.props.dataAll.allSize;
		}
		return num;
	}
	_renderLi() {
		return (
			<ul>
				{
					this.state.status.map((item, index)=>{
						{
							if(item.show) {
								return (
									<li key={`status-${index}`} className={item.code == this.state.activeCode ?"active":""} onClick={this._clickHandle.bind(this, item.code, index)}><span>{item.desc}({this._getSize(item.code)})</span></li>
								)
							}else {
								return null;
							}
						}
					})
				}
			</ul>
		)
	}

	render() {
		return (
			<div className="order-status-bar">
				{this._renderLi()}
			</div>
		)
	}
}
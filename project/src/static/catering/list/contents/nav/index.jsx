import React, {Component, PropTypes} from "react";
import {connect} from 'react-redux';
import {updateTagNos, updataDatas, updateConfirm, updateToday, updateCurrent, updateOffset} from '../../action/index.js';
import Request from 'local-Request/dist/main.js';
import ApiConfig from "widgets/apiConfig/index.js";

import "./sass/index.scss";

const TAGS = ApiConfig.cateringTags;

class Nav extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = this.defaultState;
		this._data = [];
	}

	get defaultState(){
		return {
			isRrfresh : false
		};
	}

	componentWillMount(){
		this.getData(this.props.cityId);
	}
	
	componentWillReceiveProps(nextProps){
		if(nextProps.cityId != this.props.cityId){
			this.getData(nextProps.cityId);
		}
		if(nextProps.refreshTrem){
			this.setDefault();
		}
	}

	setData(data){
		return data.map((item, key) => {
			if(key == 0) item.select = true;
			else item.select = false;
			return item;
		});
	}

	setDefault(){
		this._data.map((item, key) => {
			if(key == 0) item.select = true;
			else item.select = false;
		});
		this.setRefresh();
	}

	getData(cityId){
		if(!cityId) return this;
		let opt = {
			url : TAGS,
			data : {
				cityId : cityId
			}
		}
		new Request().ajax(opt)
		.then((res) => {
			this._data = this.setData([{tagName: "全部", tagNo: ""}, {tagName : "立即确认", confirmImmediately : 1}, {tagName : "今日可订", canBookToday : 1}].concat(res.data));
			this.setRefresh();
		},(err) => {
			// alert(err);
		})
	}

	setRefresh(){
		this.setState({
			isRefresh : !this.state.isRefresh
		});
	}

	handleBack(){
		let obj = {
			tagNos : [],
			confirms : [],
			todays : [],
		};
		this._data.forEach((item, key) => {
			if(item.select){
				if(item.tagNo) obj.tagNos.push(item);
				if(item.confirmImmediately) obj.confirms.push(item);
				if(item.canBookToday) obj.todays.push(item);
			}
		});

		let _resultTagNos = obj.tagNos.map((item, index) => {
			return item.tagNo;
		});

		let _resultConfirm = obj.confirms.map((item, index) => {
			return item.confirmImmediately;
		});

		let _resultToday = obj.todays.map((item, index) => {
			return item.canBookToday;
		});
		
		this.props.dispatch(updateTagNos(_resultTagNos.join(',')));

		this.props.dispatch(updateConfirm(_resultConfirm.join(',') || 0));

		this.props.dispatch(updateToday(_resultToday.join(',') || 0));

		this.props.dispatch(updateCurrent(1));

		this.props.dispatch(updateOffset(0));

		this.props.dispatch(updataDatas(true));
		this.props.onHanle && this.props.onHanle.call(this, _result.join(','));
	}

	handle(item, key){
		let _data = this._data;
		// debugger;
		let allFlag = true;
		_data.map((item, index) => {
			if(key == 0) {
				// 全部
				if(index == 0 ) item.select = true;
				else item.select = false;
			}else{
				// if(index == 0) item.select = false;
				// else if(index == key) item.select = true;
				// 
				if(index == key) {
					item.select = !item.select;
				}
				allFlag = allFlag && !item.select;
			}
			return item;
		})
		_data[0]['select'] = allFlag;
		this._data = _data;
		this.setRefresh();
		this.handleBack();
	}	

	render(){
		return (
			<div className="c-list-nav">
				<dl>
					<dt><span>餐厅筛选：</span></dt>
					{
						this._data.map((item, key) => {
							return (
								<dd key={key}>
								<span 
								className={item.select ? 'select' : null}
								onClick={this.handle.bind(this, item, key)}>{item.tagName}</span>
								</dd>
							)
						})
					}
				</dl>
          	</div>
		)
	}
}

function mapStateToProps(state) {
	return state;
}

export default connect(mapStateToProps)(Nav);

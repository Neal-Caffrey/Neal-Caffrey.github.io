import React, {Component, PropTypes} from "react";
import {connect} from 'react-redux';
import {updataDatas, updateOffset, updateSortType, updateCurrent, updateRefreshTrem, updateLoading} from '../../action/index.js';
import Bar from '../../components/bar/index.jsx';
import Page from 'components/ui-page/index.jsx';
import ApiConfig from 'widgets/apiConfig/index.js';
import Content from './content.jsx';
import Request from 'local-Request/dist/main.js';

import "./sass/index.scss";

const LIST = ApiConfig.cateringList;

class Cont extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = this.defaultState;
		this._data = {};
		this._limit = 15;
	}

	get defaultState(){
		return {
			isRefresh : false
		}
	}

	componentWillMount(){
		this.getData(this.props);
	}

	componentWillReceiveProps(nextProps){
		if(nextProps.canDatas){
			this.getData(nextProps);
		}
	}

	getData(_obj){
		if(!_obj.cityId) return this;
		let _data = {
			limit : this._limit,
		};
		let obj = {
			url : LIST,
			data : Object.assign(_data, {
				cityId : _obj.cityId,
				offset : _obj.offset,
				searchKey : _obj.searchKey,
				tagNos : _obj.tagNos,
  				confirmImmediately: _obj.confirmImmediately,
  				canBookToday: _obj.canBookToday,
  				sortType: _obj.sortType,
  				tradeingAreaNo: _obj.tradeingAreaNo ? _obj.tradeingAreaNo.join(',') : '',
  				subCategoryNo: _obj.subCategoryNo ? _obj.subCategoryNo.join(',') : '',
			})
		};
		new Request().ajax(obj)
		.then((res) => {
			this.props.dispatch(updataDatas(false));
			this.props.dispatch(updateLoading(false));
			this.props.dispatch(updateRefreshTrem(false));
			this._data = res.data;
			this.setRefresh();
		}, (err) => {
			// alert(err);
		})
	}

	setRefresh(){
		this.setState({
			isRefresh : !this.state.isRefresh
		});
	}

	handleBar(type, order){
		if(type == 'reorder'){
			let _order = 1;
			if(order.type == 'price' && order.aspect == 'up') _order = 3;
			if(order.type == 'price' && order.aspect == 'down') _order = 2;
			this.props.dispatch(updateSortType(_order));

		}else {
			this.props.dispatch(updateOffset((order - 1) * this._limit));
			this.props.dispatch(updateCurrent(order));
		}
		this.props.dispatch(updataDatas(true));
	}

	handlePage(page){
		this.props.dispatch(updateOffset((page.current - 1) * this._limit));
		this.props.dispatch(updateCurrent(page.current));
		this.props.dispatch(updataDatas(true));
	}

	render(){
		return(
			<div className="c-list-cont">
				{
					this._data.totalSize > 0 && <Bar
					limit={this._limit}
					onHandle={this.handleBar.bind(this)}
					total={this._data.totalSize}/>
				}
				{
					this._data.resultBean && <Content 
					data={this._data.resultBean}
					/>
				}
				{
					this._data.totalSize > 0 && <Page 
					total={this._data.totalSize}
					limit={this._limit}
					onHandle={this.handlePage.bind(this)}
				    current={this.props.current}
					/>
				}

			</div>
			)
	}
}

function mapStateToProps(state) {
	return state;
}

export default connect(mapStateToProps)(Cont);
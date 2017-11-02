import React, {Component, PropTypes} from "react";
import {connect} from 'react-redux';
import {updateTrade, updateSubCate, updataDatas, updateCurrent, updateOffset} from '../../action/index.js';
import Terms from 'contents/terms/index.jsx';
import Request from "local-Request/dist/main.js";
import ApiConfig from 'widgets/apiConfig/index.js';

import "./sass/index.scss";

const TYPE = ApiConfig.cateringType;
const DISTRICT = ApiConfig.cateringDistrict;

class Term extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = this.defaultState;
		this._data = {};
		this._state = {
			result : []
		}
	}
	
	get defaultState(){
		return {
			isRefresh : false,
		}
	}

	componentWillMount(){
		this.getData(this.props.cityId);
	}

	componentWillReceiveProps(nextProps){
		if(nextProps.cityId != this.props.cityId){
			this.getData(nextProps.cityId)
		}
		if(nextProps.refreshTrem){
			this.setDefault();
		}
	}

	setDefault(){
		let _result = this._state.result;
		let _data = this._data;
		_result.length = 0;
		for(let item in _data){
			let _item = item == 'district' ? _data[item].merchantBusinessDistrictList : _data[item].subMerchantCategoryList;
			_item.map((list, index) => {
				return list.checked = false;
			});
		};
		this.setRefresh();
	}

	getData(cityId){
		if(!cityId) return this;
		let opt = {
			url : TYPE,
			data : {
				categoryId : 1001
			}
		};
		let opt1 = {
			url : DISTRICT,
			data : {
				cityId : cityId
			}
		};
		let _promise = new Request().promise();

		_promise.then((res) => {
			res.all([new Request().ajax(opt), new Request().ajax(opt1)])
			.then((result) => {
				this._data = {
					type : result[0].data,
					district : result[1].data
				};
				this.setRefresh();
			}, (err) => {
				// alert(err);
			})
		})
	}

	getResult(res, type){
		let _result = this._state.result;
		res.forEach((item, key) => {
			let _item = Object.assign(item, {_type : type});
			let index = _result.indexOf(_item);
			if(index < 0 && _item.checked) _result.push(_item);
			else if(index >= 0 && !_item.checked) _result.splice(index, 1);

		});

		return _result;
	}

	handleDel(item){
		let _result = this._state.result;
		let _data = this._data;
		let index = _result.indexOf(item);
		let _type = item._type == 'district' ? _data[item._type].merchantBusinessDistrictList : _data[item._type].subMerchantCategoryList;
		let _index = _type.indexOf(item);
		if(index > -1) _result.splice(index, 1);
		if(_index > -1) _type[_index].checked = false;
		this._data = _data;
		this._state.result = _result;
		this.setRefresh();
		this.handle();
	}

	setRefresh(){
		this.setState({
			isRefresh : !this.state.isRefresh,
		});
	}
	
	districtHandle(res){
		this._state.result = this.getResult(res, 'district');
		this.setRefresh();
		this.handle();
	}

	typeHandle(res){
		this._state.result = this.getResult(res, 'type');
		this.setRefresh();
		this.handle();
	}

	handle(){
		let _district = [];
		let _type = [];
		this._state.result.forEach((item, key) => {
			if(item._type == 'district') _district.push(item.businessDistrictId);
			else _type.push(item.categoryId);
		});
		this.props.dispatch(updateTrade(_district));
		this.props.dispatch(updateSubCate(_type));
		this.props.dispatch(updataDatas(true));
		this.props.dispatch(updateCurrent(1));
		this.props.dispatch(updateOffset(0));
		this.props.onHandle && this.props.onHandle.call(this, this._state.result);
	}

	renderChoose(){
		let result = this._state.result;
		if(result.length > 0)
			return (
				<div className="c-term-choose">
					{
						result.map((item, key) => {
							return (
								<span key={key}>
									<code>{item._type == 'district' ? '商圈' : '类别'}</code>
									<em>{item._type == 'district' ? item.businessDistrictName : item.categoryName}</em>
									<del onClick={this.handleDel.bind(this, item)}></del>
								</span>
							)
						})
					}
					</div>
				);
		return null;
	}

	render(){
		// debugger;
		return (
			<div className="c-list-term">
				{
					this._data.district && this._data.district.merchantBusinessDistrictList.length > 0 &&
					<Terms
						width={680}
						title='商圈'
						data={this._data.district.merchantBusinessDistrictList}
						keys='businessDistrictName'
						onHandle={this.districtHandle.bind(this)}
					 />
				}
				{
					this._data.type && this._data.type.subMerchantCategoryList.length > 0 &&
					<Terms
					width={720}
					title='类别'
					label='不限'
					data={this._data.type.subMerchantCategoryList}
					keys='categoryName'
					onHandle={this.typeHandle.bind(this)}
					/>
				}
				{
					this.renderChoose()
				}
          	</div>

			)
	}
}
function mapStateToProps(state) {
	return state;
}

export default connect(mapStateToProps)(Term);

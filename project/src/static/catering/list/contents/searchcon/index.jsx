import React, {Component, PropTypes} from "react";
import {connect} from 'react-redux';
import {updateCityId, updateKeywords, updateAuto, updataDatas, updateLoading, updateRefreshTrem} from '../../action/index.js';
import City from '../../components/city/index.jsx';
import Keywords from "../../components/keywords/index.jsx";
import Submit from "components/ui-submit/index.jsx";
import ApiConfig from "widgets/apiConfig/index.js";
import Request from 'local-Request/dist/main.js';

import "./sass/index.scss";

const ApiCity = ApiConfig.cateringCitys;


class SearchCon extends Component {
	constructor(props, context) {
		super(props, context);
		this.request = new Request();
		this.state = this.defaultState;
		this._data = {};
		this._catch = {
			cityId : 0,
			keywords : '',
		};
	}

	get defaultState(){
		return {
			isRefresh : false,
			loading : false,
		}
	}

	componentWillMount(){
    	this.getData();
  	}

  	componentWillReceiveProps(nextProps){
  		if(nextProps.loading != this.props.loading){
  			this.setState({
  				loading : nextProps.loading
  			})
  		}
  	}

	getData(){
		let opt = {
			url : ApiCity,
		};
		this.request.ajax(opt)
		.then((res) => {
			this._data = res.data;
			let _id = this.getCitiesDefault(217)[0].cityId;
			this._catch.cityId = _id;
			this.props.dispatch(updateCityId(_id));
			this.setRefresh();
		}, (err) => {
			// alert(err);
		})

	}

	setRefresh(){
		this.setState({
			isRefresh : !this.state.isRefresh,
		});
	}

	handleCity(data){
		this._catch.cityId = data.cityId;
	}

	handleKeywords(data){
		this._catch.keywords = data.value;
	}

	submits(){
		this.props.dispatch(updateCityId(this._catch.cityId));
		this.props.dispatch(updateKeywords(this._catch.keywords));
		this.props.dispatch(updateRefreshTrem(true));
		this.props.dispatch(updataDatas(true));
		this.props.dispatch(updateLoading(true));
		this.props.dispatch(updateAuto());

	}

	getCitiesDefault(id){
		let datas = this._data.cities;
		if(datas && datas.length > 0)
			return datas.filter((item, key) => {
				item._index = key;
				return item.cityId == id;
			});
		else return [{}];
	}

	render(){
		let defaults = this.getCitiesDefault(217)[0];
		return (
			<div className="c-list-search">
			{
          		this._data.cities && <City 
          		keys='cityName'
          		data={this._data.cities}
          		defaultValue={defaults}
          		index={defaults._index}
          		onHandle={this.handleCity.bind(this)}/>
          	}
          		<Keywords
          		onHandle={this.handleKeywords.bind(this)}/>
          		<Submit
          		text='搜索'
          		loading={this.state.loading}
          		status={true}
          		onHandle={this.submits.bind(this)} />
          	</div>
			)
	}
}

function mapStateToProps(state) {
	return state;
}

export default connect(mapStateToProps)(SearchCon);
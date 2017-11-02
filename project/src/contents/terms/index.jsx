import React, {Component, PropTypes} from "react";
import Checkbox from 'components/ui-checkbox/index.jsx';

import "./sass/index.scss";

class Terms extends Component {

	static defaultProps = {
		data : [],
		title : 'terms',
		keys : 'name',
		width : 760,
		label : '全部',
	}

	constructor(props, context) {
		super(props, context);
		this.state = this.defaultState;
		this._data = this.getData(this.props.data);
	}

	get defaultState(){
		return {
			isMore : false,
			isHeight : false,
			isRefresh : false,
		}
	}

	getData(_data){
		_data.map((item, key) => {
			return item.checked = false;
		})
		return _data;
	}

	componentDidMount(){
		this.setMore();
	}

	componentWillReceiveProps(nextProps){
		if(JSON.stringify(nextProps.data) != JSON.stringify(this.props.data)){
			this._data = this.getData(nextProps.data);
			this.setState({
				isRefresh : !this.state.isRefresh
			})
		}
	}

	setMore(){
		let box = this.refs.districtBox;
		let dd = document.querySelectorAll('label', box);
		let width = 0;
		dd.forEach((item, key) => {
			let widths = item.offsetWidth || item.clientWidth;
			width += widths;
		});
		if(width > 760) this.setState({
			isMore : true,
		});
	}

	handleAll(){
		let _data = this._data;
		_data.map((item) =>{
			item.checked = false;
			return item;
		});
		this.handleResult();
	}

	handleResult(){
		this.props.onHandle && this.props.onHandle.call(this, this._data);
	}

	checkLast(){
		let last = false;
		let _data = this._data;
		for(let i = 0, len = _data.length ; i < len; i++){
			if(_data[i].checked) {
				last = true;
				break;
			}
		}

		return last;
	}

	handleMore(){
		this.setState({
			isHeight: !this.state.isHeight,
		})
	}

	handle(key, checked, event){
		let _data = this._data;
		_data[key].checked = checked;
		this.handleResult();
	}

	render(){

		return (
			<dl className="terms">
				<dt>{this.props.title}</dt>
				<dd>
					<span
					className={!this.checkLast() ? 'selected' : null}
					onClick={this.handleAll.bind(this)}
					>{this.props.label}</span>
				</dd>
				<dd 
				className={this.state.isHeight ? 'content auto' : 'content'}
				ref="districtBox"
				style={{width: this.props.width}}>
					{
						this._data.map((item, key) => {
							return (
								<Checkbox
								key={key}
								name='district'
								text={item[this.props.keys]}
								checked={item.checked}
								onHandle={this.handle.bind(this, key)} />
							)
						})
					}
				</dd>
				
				<dd className={this.state.isMore ? "more show" : "more"}>
					<a 
					href="javascript:;"
					onClick={this.handleMore.bind(this)}>{this.state.isHeight ? '收起-' : '更多+'}</a>
				</dd>
			</dl>
			)
	}
}

export default Terms;
import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import SimplePage from "components/ui-simple-page/index.jsx";
import Reorder from "components/ui-reorder/index.jsx";

class Bar extends Component {
	static propsTypes = {
		total : PropTypes.number
	}
	constructor(props, context) {
		super(props, context);
		this.state = this.defaultState;
	}

	get defaultState(){
		return {
			select : [true, false]
		}
	}

	componentWillReceiveProps(nextProps){
		if(this.props.srotType != nextProps.sortType){
			let _select = [true, false];
			switch(nextProps.sortType){
				case 2:
				case 3:
					_select = [false, true];
					break;
				default:
					_select = [true, false];
					break;
			}
			this.setState({
				select : _select
			})
		}
	}

	handleBack(type, dir){
		let obj = {
			type : type == 1 ? 'price' : 'default',
			aspect : type == 1 ? (dir ? 'up' : 'down') : 'auto'
		};
		this.props.onHandle && this.props.onHandle.call(this, 'reorder', obj);
	}

	handle(type, dir){
		let _select = this.state.select;
		let _select_ = [];
		_select.forEach((item, key) => {
			if(type == key) _select_.push(true);
			else _select_.push(false);
		});
		this.setState({
			select : _select_
		}, () => {
			this.handleBack(type, dir)
		});

	}

	handlePage(current){
		this.props.onHandle && this.props.onHandle.call(this, 'simplePage', current);
	}

	render(){
		return(
			<div className="c-list-bar">
				<span
				className={this.state.select[0] ? 'select' : null}
				onClick={this.handle.bind(this, 0)}>默认排序</span>
				<Reorder
				text='人均价格'
				selected={this.state.select[1]}
				onHandle={this.handle.bind(this, 1)} />
				<SimplePage
				limit={this.props.limit}
				total={this.props.total}
				current={this.props.current}
				onHandle={this.handlePage.bind(this)}
				/>
          	</div>
			)
	}
}

function mapStateToProps(state) {
	return state;
}

export default connect(mapStateToProps)(Bar);
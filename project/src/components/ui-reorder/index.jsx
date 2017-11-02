import React, {Component, PropTypes} from "react";

import './sass/index.scss';

class UIReorder extends Component {
	static defaultProps={
		text : '价格',
		selected : false
	};
	constructor(props, context) {
		super(props, context);
		this.state = this.defaultState;
	}

	get defaultState(){
		return {
			status : false,
			selected : this.props.selected
		}
	}

	componentWillReceiveProps(nextProps){
		if(nextProps.selected != this.state.selected){
			this.setState({
				selected : nextProps.selected,
				status : false
			})
		}
	}

	handleBack(){
		this.props.onHandle && this.props.onHandle.call(this, this.state.status);
	}

	handle(){
		this.setState({
			selected : true,
			status : !this.state.status
		}, this.handleBack);
	}

	render(){
		return (
			<span
				className={this.state.selected ? "ui-reorder reorder-select" : "ui-reorder"}
				onClick={this.handle.bind(this)}>{this.props.text}
				<del className={this.state.status ? 'icon-sort-up' : 'icon-sort-down'}></del>
			</span>
			)
	}
}

export default UIReorder;
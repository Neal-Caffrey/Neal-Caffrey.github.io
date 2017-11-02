import React, {Component, PropTypes} from "react";

import './sass/index.scss';

class UISimplePage extends Component {

	static propTypes = {
		total : PropTypes.number.isRequired,
	}

	static defaultProps = {
		current : 1,
		limit : 20
	}

	constructor(props, context) {
		super(props, context);
		this.state = this.defaultState;
	}

	get defaultState(){
		return {
			current :  this.props.current
		}
	}

	get current(){
		return this.state.current;
	}

	get total(){
		return Math.ceil(this.props.total / this.props.limit) || 0;
	}

	componentWillReceiveProps(nextProps){
		if(this.props.current != nextProps.current){
			this.setState({
				current : nextProps.current
			});
		}
	}

	handle(){
		this.props.onHandle && this.props.onHandle.call(this, this.current);
	}

	pageUp(){
		let _current = this.current;
		if(_current <= 1) {
			this.setState({
				current : 1
			});
			return this;
		}else{
			this.setState({
				current : _current - 1
			}, this.handle)
		}
	}

	pageDown(){
		let _current = this.current;
		if(_current >= this.total) {
			this.setState({
				current : this.total
			});
			return this;
		}else{
			this.setState({
				current : _current + 1
			}, this.handle)
		}
	}

	render(){
		if(this.total < 2) return null;
		return(
			<div className="ui-simple-page">
				<s>{this.current}&nbsp;/&nbsp;{this.total}&nbsp;页</s>
				<a 
				onClick={this.pageUp.bind(this)}
				className={this.current <= 1 ? 'no-next-page' : ''}>上一页</a>
				<a
				onClick={this.pageDown.bind(this)}
				className={this.current >= this.total ? 'no-next-page' : ''}>下一页</a>
			</div>
		)
	}

}

export default UISimplePage;
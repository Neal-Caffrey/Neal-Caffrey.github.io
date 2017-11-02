import React, {Component, PropTypes} from "react";


import subumitCss from './sass/index.scss';


class UISubmit extends Component {
	
	static propTypes = {
		text : PropTypes.string,
		status : PropTypes.bool,
		onHandle : PropTypes.func,
		loading : PropTypes.bool,
	}
	
	static defaultProps = { 
		text : '确定',
		status : false,
		loading : false,
	};
	constructor(props, context) {
		super(props, context);
		this.state = this.defaultState;
	}

	get defaultState(){
		const {text, status, loading} = this.props;
		return {
			text : text,
			status : status,
			loading : loading,
		}
	}

	get loading(){
		return this.state.loading;
	}

	get text(){
		return this.props.text;
	}

	get status (){
		return this.state.status;
	}

	componentWillReceiveProps(nextProps){
		if(this.props != nextProps){
			this.setState({
				status : nextProps.status,
				loading : nextProps.loading
			});
		}
	}

	handler(e){
		e.nativeEvent.stopImmediatePropagation();
		if(this.loading) return this;
		this.props.onHandle && this.props.onHandle.call(this, this.state)
	}

	render(){
		return (
			<div className='ui-submit'>
				<button
				className={this.status ? (this.loading ? 'loading active' : 'active') : ''}
				onClick={this.handler.bind(this)}
				>{this.text}</button>
			</div>
			)
	}
}

export default UISubmit;
import React, {Component, PropTypes} from "react";

import markCsss from './sass/index.scss';

class UIMark extends Component {
	static propTypes = {
		onHandle : PropTypes.func,
		placeholder : PropTypes.string,
		max : PropTypes.number,
		name : PropTypes.string,

	}
	constructor(props, context) {
		super(props, context);
		this.state = this.defaultState;
	}

	get defaultState(){
		const {placeholder, max, name, value} = this.props;
		return {
			placeholder : placeholder || '',
			values : value || '',
			max : max || 500,
			number : 0,
			name : name || 'marker'
		};
	}

	get placeholder(){
		return this.state.placeholder;
	}

	get values(){
		return this.state.values;
	}

	get number(){
		return this.state.number;
	}

	get max(){
		return this.state.max;
	}

	get name(){
		return this.state.name;
	}

	handler(){
		this.props.onHandle && this.props.onHandle.call(this, {
			name : this.name,
			value : this.values,
			number : this.number,
		})
	}
	getValue(){
		this.props.onHandle && this.props.onHandle.call(this, {
			name : this.name,
			value : this.values,
			number : this.number,
		})
	}

	changeValue(event){
		let val = event.target.value;
		let states = {};
		if(val.length >= this.max) Object.assign(states,{
			number : this.max,
			values : val.substring(0, this.max),
		})
		else Object.assign(states, {
			number : val.length,
			values : val,
		})
		this.setState(states,this.handler);
	}

	render(){
		return (
			<div className='ui-mark'>
				<textarea
				placeholder={this.placeholder}
				onChange={this.changeValue.bind(this)}
				value={this.values}
				name={this.name}
				// onBlur={this.getValue.bind(this)}
				>
				</textarea>
				<span
				className={this.number >= this.max ? 'ismax' : ''}
				>{this.number}/{this.max}</span>
			</div>
			)
	}
}


export default UIMark;
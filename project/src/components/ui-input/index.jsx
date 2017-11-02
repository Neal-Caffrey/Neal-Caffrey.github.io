import React, {Component, PropTypes} from "react";
import emailCss from "./sass/index.scss";

class UIInput extends Component {
	static propTypes = {
		placeholder : PropTypes.string,
		onHandle : PropTypes.func,
		onFocus : PropTypes.func,
		name : PropTypes.string,
		sign : PropTypes.string,
		reg : PropTypes.object,
		type : PropTypes.string,
		className : PropTypes.string,
		labelClass : PropTypes.string,
		maxLength : PropTypes.number,
		value : PropTypes.string,
		replaceValue : PropTypes.string,
	} 
	constructor(props, context) {
		super(props, context);
		this.state = this.defaultState;
	}

	get defaultState(){
		return {
			error: false,
			message: '',
			value : this.props.value || ''
		}
	}

	get placeholder(){
		return this.props.placeholder;
	}

	get name(){
		return this.props.name;
	}

	get maxLength(){
		return this.props.maxLength;
	}

	get reg(){
		return this.props.reg;
	}

	get sign(){
		return this.props.sign;
	}

	get message(){
		return this.state.message;
	}

	get error(){
		return this.state.error;
	}

	get type(){
		return this.props.type;
	}

	get className(){
		return this.props.className || '';
	}

	get labelClass(){
		return this.props.labelClass || 'ui-input';
	}

	get value(){
		return this.state.value;
	}

	get replaceValue(){
		return this.props.replaceValue;
	}

	componentWillReceiveProps(nextProps){
		if(nextProps.replaceValue != this.props.replaceValue) this.setState({
				value : nextProps.replaceValue,
				error :false,
				message : '',
			});
	}

	handler(){
		this.props.onHandle && this.props.onHandle.call(this, {
			name : this.name,
			error : this.error,
			message : this.message,
			value : this.value
		});
	}

	focusInput(event){
		this.props.onFocus && this.props.onFocus.call(this, this.state);
	}

	checkInput(event){
		let tag = event.target,
			states = {};
		if(this.value != tag.value) Object.assign(states, {
			value : tag.value,
		});
		if(this.reg && tag.value == '') 
			Object.assign(states, {
				error : true,
				message : '请输入' + this.sign
			})
		else if(this.reg && !this.reg.test(tag.value)) 
			Object.assign(states, {
				error : true,
				message : '请输入正确的' + this.sign
			});
		else 
			Object.assign(states, {
				error :false,
				message : '',
			});
		this.setState(states, this.handler);

	}

	render() {
		return (
			<label className={this.labelClass}>
				<input
				className={this.className}
				type={this.type}
				name={this.name}
				maxLength={this.maxLength}
				onChange={this.checkInput.bind(this)}
				onFocus={this.focusInput.bind(this)}
				value={this.value}
				placeholder={this.placeholder}
				readOnly={this.props.readonly} />
				<span 
				className={this.error ? 'show' : ''}>{this.message}</span>
				<del></del>
			</label>
		)
	}
}

export default UIInput;
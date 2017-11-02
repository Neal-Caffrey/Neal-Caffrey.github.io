import React, {Component, PropTypes} from "react";
import Input from 'components/ui-input/index.jsx';
import OnclickOutside from 'react-onclickoutside';

import indexCss from "./sass/index.scss";


class UISelect extends Component {
	static propTypes = {
			data : PropTypes.array,
			keys : PropTypes.string,
			input : PropTypes.object,
			index : PropTypes.number,
			onHandle : PropTypes.func,
			defaultValue : PropTypes.object
	};

	constructor(props, context) {
		super(props, context);
		this.state = this.defaultState;
	}

	get defaultState(){
		return {
			selected : false,
			isInput : false,
			labelClass : 'ui-input',
			value : this.props.defaultValue ? this.props.defaultValue[this.props.keys] : '',
			index : this.props.index || 0,
		}
	}

	get index(){
		return this.state.index;
	}

	get inputClass(){
		return this.state.isInput ? 'ui-select-wraps show' : 'ui-select-wraps'
	}

	componentWillMount(){
		this.defaultValue();
	}

	defaultValue(){
		let _default = this.props.defaultValue;
		if(_default){
			this.props.onHandle && this.props.onHandle.call(this, _default, _default[this.props.keys]);
		}
	}

	handle(data, key, name){
		this.toggleInput(false);
		this.toggleClass(false);
		this.inputValue(name);
		this.setIndex(key);
		this.props.onHandle && this.props.onHandle.call(this, data, name);
	}

	setIndex(key){
		this.setState({
			index : key
		});
	}

	inputValue(val){
		this.setState({
			value : val
		});
	}

	toggleInput(bl){
		this.setState({
			isInput : bl
		});
	}

	toggleClass(bl){
		this.setState({
			labelClass : bl ? 'ui-input ui-input-down' : 'ui-input'
		})
	}

	// changeInput(){

	// }

	focusInput(){
		this.toggleInput(true);
		this.toggleClass(true);
	}

	handleClickOutside(){
		this.toggleInput(false);
		this.toggleClass(false);
	}

	renderChild(){
		if(this.props.data && typeof this.props.data == 'object'){
			let _data = [].concat(this.props.data);
			if(!this.props.keys) console.warn('need keys in props');
			return(
				<ul>
					{
						_data.map((item, key) => {
							let _name = item[this.props.keys];
							return (<li
									className={this.index == key ? 'select' : null}
									key={key}
									onClick={this.handle.bind(this, item, key, _name)}>
									{_name}
								</li>);
						})
					}
				</ul>
				);
		}else{

			return (
				<ul>
				{
				 	React.Children.map(this.props.children,(item, key)=>{
                        return typeof item == 'object' ?
                        	React.cloneElement(item, {
                        		className : this.index == key ? 'select' : null,
                        		key: key,
                        		onClick : this.handle.bind(this, item.props.data, key)
                        		}) :
                        	null;
                    	})
					}
				</ul>
				);
		}
	}

	render(){
		return (
			<div className="ui-select">
				<Input
					{...this.props.input}
					labelClass={this.state.labelClass}
					value={this.state.value}
					replaceValue={this.state.value}
					onFocus={this.focusInput.bind(this)}
				/>
				<del></del>
				<div className={this.inputClass}>
					{this.renderChild()}
				</div>
			</div>
			);
	}
}

export default OnclickOutside(UISelect);

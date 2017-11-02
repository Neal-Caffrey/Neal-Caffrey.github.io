import React, {Component, PropTypes} from "react";
import Select from "components/ui-select/index.jsx";

class UIDiningCity extends Component {
	static propTypes = {
    	data : PropTypes.array.isRequired,
    	keys : PropTypes.string.isRequired,
    	defaultValue : PropTypes.object,
  	};
	constructor(props, context) {
		super(props, context);
	}

	handle(value){
		this.props.onHandle && this.props.onHandle.call(this, value);
	}

	render(){
		return (
			<Select
				keys={this.props.keys}
				data={this.props.data}
				input={{placeholder : "请选择城市", readonly : true}}
				defaultValue={this.props.defaultValue}
				index={this.props.index}
				onHandle={this.handle.bind(this)}>
			</Select>
			);
	}

};

export default UIDiningCity;
import React, {Component, PropTypes} from "react";
import Input from "components/ui-input/index.jsx";

class Keywords extends Component {
	constructor(props, context) {
		super(props, context);
	}

	handle(value){
		this.props.onHandle && this.props.onHandle.call(this, value);
	}

	handle(val){
		this.props.onHandle && this.props.onHandle.call(this, val);
	}

	render(){
		return (
			<div className="ui-keywords">
				<Input
					placeholder="请输入商户名、地点"
					name='keywords'
					onHandle={this.handle.bind(this)}
					/>
			</div>
			);
	}

};

export default Keywords;
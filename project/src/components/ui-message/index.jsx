import React, {Component, Proptypes} from "react";
import Button from 'components/ui-submmit/index.jsx';

import './sass/index.scss';

class Message extends Component {

	static defaultProps = {
		show : false
	}

	constructor(props, context) {
		super(props, context);
	}

	get defaultState(){
		return show : this.props.show
	}

	conpontentWillReceiveProps(nextProps){
		if(this.props.show != nextProps.show){
			this.setState({
				show : nextProps.show
			})
		}
	}

	handle(){
		this.props.onHandle && this.props.onHandle.call(this);
	}

	render(){
		return (
			<div className={this.state.show ? 'ui-message ui-message-show' : 'ui-message'}>
				<p>{this.props.text}</p>
				<Button
				onHandle={this.handle.bind(this)}
				 />
			</div>
			)
	}
}
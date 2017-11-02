import React, {Component, PropTypes} from "react";
import OnclickOutside from 'react-onclickoutside';

class UINavMessage extends Component {
	static propTypes = {
		show : PropTypes.bool,
		list : PropTypes.array,
		onHandle : PropTypes.func,
	}
	constructor(props, context) {
		super(props, context);
		this.state = this.defaultState;
	}

	get defaultState(){
		const { show} = this.props;
		return {
			show : show || false,
		};
	}

	get list(){
		return this.props.list || {};
	}

	get show(){
		return this.state.show;
	}

  	handleClickOutside(){
	    this.setState({
	  		show : false,
	  	});
	}

  	menuHover(event){
		let tag = event.target;
		tag.className = 'focus';
	}

	componentWillReceiveProps(nextProps){
		this.setState({
			show : nextProps.show,
		});
	}

	handle(key, event){
		this.props.onHandle && this.props.onHandle.call(this, key, event);
	}

	menuClick(key, event){
		let tag = event.target;
		this.handle(key, tag);
	}

	render(){
		return (
			<div
				className={this.show ? 'ui-user-cont show' : 'ui-user-cont'}>
					<ol>
						{
							this.list.map((item, key) => {
								return (
									<li key={key}>
										<a
										onMouseLeave={this.menuHover.bind(this)}
										onClick={this.menuClick.bind(this, key)}
										href={item.nameUrl ? ('/' + item.nameUrl) : 'javascript:;'}>
											<i className={item.icon}></i>{item.name}
										</a>
									</li>
								)
							})
						}
					</ol>
				</div>
			)
	}
}

export default OnclickOutside(UINavMessage);

import React, {Component, PropTypes} from "react";
import OnclickOutside from 'react-onclickoutside';

class UINavMessage extends Component {
	static propTypes = {
		show : PropTypes.bool,
		message : PropTypes.array,
	}
	constructor(props, context) {
		super(props, context);
		this.state = this.defaultState;
	}

	get defaultState(){
		const {show} = this.props;
		return {
			show : show || false,
		};
	}

	get message(){
		return this.props.message;
	}

	get show(){
		return this.state.show;
	}

	handleClickOutside(){
		this.setState({
			show : false,
		});
	}

	componentWillReceiveProps(nextProps){
		this.setState({
			show : nextProps.show,
		});
	}

	render(){
		return (
			<div 
				className={this.show ? 'ui-message-cont show' : 'ui-message-cont'}>
					{
						this.message.length > 0 ?
						(
							<ul>
							{
								this.message.map((item, key) => {
									// debugger
									return (<li key={key} onClick={()=>{window.open(`${item.messageDetailUrl}`)}}>
										<i className='icon-smile'></i>
										<div>
											<p>{item.createTime}</p>
											<p>{item.title}</p>
										</div>
									</li>
									)
								})
								
							}
							</ul>
						) : 
						<p>
							无新消息通知
						</p>
					}
					<a 
					className='ui-message-more' 
					href='/message/system' 
					target='_blank'>+ 查看所有通知</a>
				</div>
			)
	}
}

export default OnclickOutside(UINavMessage);
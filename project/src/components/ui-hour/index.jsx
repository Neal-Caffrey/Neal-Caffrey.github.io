import React, {Component, PropTypes} from "react";
import moment from 'moment';
import OnClickOutSide from "react-onclickoutside";
import Input from 'components/ui-input/index.jsx';

import './sass/index.scss';

class UIHour extends Component {
	static defaultProps = {
		data : [],
		defaultValue : '',
		placeholder : '时间',
		show: false,
		now : moment(),
		format : 'YYYY-MM-DD'
	}
	constructor(props, context) {
		super(props, context);
		this.state = this.defaultState;
		this._data = this.getData(this.props.data);
		this._select = 0;

	}

	get defaultState(){
		return {
			isRefresh : false,
			show :this.props.show,
			value : ''
		}
	}

	componentWillMount(){
		this.setState({
			value : this._format(this._data[0], 'HH:mm')
		})
	}

	componentWillReceiveProps(nextProps){
		let _data = this.getData(nextProps.data);
		
		if(this.props.show != nextProps.show){
			this.setState({
				show : nextProps.show,
			})
		}
		if(this._data.length <= 0) {
			this._data = _data;
			this.setState({
				isRefresh : !this.state.isRefresh,
			});
		}else if(this._data.length > 0 && this._data[0].format(this.format) != _data[0].format(this.format)){
			this._data = _data;
			this._select = 0;
			this.setState({
				isRefresh : !this.state.isRefresh,
				show :true,
				value : ''
			});
		}
	}

	getData(_data){
		return _data.map((item, key) => {
			return moment(item);
		});
	}

	handle(item, key, isVaild, event){
		event.stopPropagation();
		event.preventDefault();
		if(isVaild == 'invaild') return this;
		this.setState({
			show : false,
			value : this._format(item, 'HH:mm')
		});
		this._select = key;
		this.handleBack(item);
	}

	handleClickOutside(){
		if(this.state.show) this.handleBack(this.state.value);
		this.setState({
			show : false
		});
	}

	setRefresh(){
		this.setState({
			isRefresh : !this.state.isRefresh
		})
	}

	handleBack(item){
		console.log(item);
		this.props.onHandle && this.props.onHandle.call(this, item);
	}

	_format(_moment, _mat = this.props.format){
		if(_moment) return _moment.format(_mat);
		return '';
	}

	isVaild(item, key){
		if(item.isBefore(this.props.now)) return 'invaild';
		else{
			if(key == this._select) return 'vaild select';
			return 'vaild';
		}
	}

	handleClick(event){
		if(this._data.length <= 0) return this;
		this.setState({
			show : true,
		})
	}

	renderList(){
		return(
			<ul className={this.state.show ? 'hour-picker-box show-box' : 'hour-picker-box'}>
				{
					this._data.map((item, key) => {
					let _isVaild = this.isVaild(item, key);
					return (
						<li key={key}>
							<span
							className={_isVaild}
							data-date={this._format(item, this.props.format + ' HH:mm')}
							onClick={this.handle.bind(this, item, key, _isVaild)}>{this._format(item, 'HH:mm')}</span>
						</li>
					)
					})
				}
			</ul>
			)
	}

	render(){
		return (
			<div 
			className="ui-hour"
			onClick={this.handleClick.bind(this)}
			>
				<Input
					placeholder={this.props.placeholder}
					replaceValue={this.state.value}
					readonly={true}
					
				/>
				{this.renderList()}
			</div>
			)
	}
}


export default OnClickOutSide(UIHour);
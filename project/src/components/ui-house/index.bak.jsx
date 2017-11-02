import React, {Component, PropTypes} from "react";
import houseCss from "./sass/index.scss";

class UIHouse extends Component {
	static propTypes = {
		number : PropTypes.number,
		fames : PropTypes.string,
		names : PropTypes.string,
		placeholder : PropTypes.string,
		onHandle : PropTypes.func,
		data : PropTypes.array,
	}
	constructor(props, context) {
		super(props, context);
		this.state = this.defaultState;
	}

	get defaultState(){
		const {number, fames, names, data} = this.props;
		return {
			number : number || 1,
			house : [],
			fames : fames || 'userfame',
			names : names || 'username',
			data : data || [],
		};
	}

	get house(){
		return this.state.house;
	}

	get data(){
		return this.state.data;
	}

	get number(){
		return this.state.number;
	}

	get fames(){
		return this.state.fames;
	}

	get names(){
		return this.state.names;
	}

	handler(){
		this.props.onHandle && this.props.onHandle.call(this, this.house)
	}
	
	componentWillMount(){
		let arr = [];
		for(let i = 0; i < this.number; i++){
			arr.push({
				room : i,
				fames : {
					name : this.fames + i,
					error : !(this.data[i] && this.data[i].guestList[0] && this.data[i].guestList[0].lastName),
					reg : /^[a-zA-Z]+$/,
					message : '',
					value : this.data[i] ? this.data[i].guestList[0].lastName : ''
				},
				names : {
					name : this.names + i,
					error : !(this.data[i] && this.data[i].guestList[0] && this.data[i].guestList[0].firstName),
					reg : /^[a-zA-Z]+$/,
					message : '',
					value : this.data[i] ? this.data[i].guestList[0].firstName : ''
				}
				
			});
		}
		this.setState({
			house : arr,
		}, this.handler);
	}

	checkName(key, event){
		let states = {};
		let target = event.target;
		let _house = this.house;
		if(target.name.indexOf(this.fames) > -1){
			if(target.value == '' ) {
				_house[key].fames.message = '请输入姓（拼音）';
				_house[key].fames.error = true;
				_house[key].fames.value = target.value;
			}else if(!_house[key].fames.reg.test(target.value)){
				_house[key].fames.message = '请填写拼音';
				_house[key].fames.error = true;
				_house[key].fames.value = target.value;
			}else{
				_house[key].fames.message = '';
				_house[key].fames.error = false;
				_house[key].fames.value = target.value;
			}
		}else if(target.name.indexOf(this.names) > -1){
			if(target.value == '' ) {
				_house[key].names.message = '请输入名（拼音）';
				_house[key].names.error = true;
				_house[key].names.value = target.value;
			}else if(!_house[key].names.reg.test(target.value)){
				_house[key].names.message = '请填写拼音';
				_house[key].names.error = true;
				_house[key].names.value = target.value;
			}else{
				_house[key].names.message = '';
				_house[key].names.error = false;
				_house[key].names.value = target.value;
			}
		}
		this.setState(states, this.handler);
	}

	render(){
		return (
			<div className='ui-house-group'>
			{
				this.house.map((item, key) => {
					return (
						<dl key={key}>
							<dt>
								房间{key + 1}
							</dt>
							<dd>
								<dfn>
									入住人：
								</dfn>
								<del>*</del>
								<label className='margin'>
									<input
									className='auto'
									type='text'
									name={item.fames.name}
									onChange={this.checkName.bind(this, key)}
									maxLength={30}
									// onBlur={this.checkName.bind(this, key)}
									value={item.fames.value}
									placeholder='姓（拼音）' />
									<span
									className={item.fames.error && item.fames.message ? 'show' : ''}
									>{item.fames.message}</span>
								</label>
								<label>
									<input
									className='auto'
									type='text'
									name={item.names.name}
									onChange={this.checkName.bind(this, key)}
									maxLength={30}
									// onBlur={this.checkName.bind(this, key)}
									value={item.names.value}
									placeholder='名（拼音）' />
									<span
										className={item.names.error && item.names.message ? 'show' : ''}
										>{item.names.message}</span>
								</label>
							</dd>
						</dl>
						)
				})
				
			}
			</div>
			)
	}
}

export default UIHouse;
import React, {Component, PropTypes} from "react";
import houseCss from "./sass/index.scss";

class UIHouse extends Component {
	static propTypes = {
		number : PropTypes.number,
		max : PropTypes.number,
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
		const {number, fames, names, max, data} = this.props;
		return {
			number : number || 1,
			house : [],
			fames : fames || 'userfame',
			names : names || 'username',
			max: max || 1,
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

	get maxPerson(){
		return this.state.max;
	}

	get fames(){
		return this.state.fames;
	}

	get names(){
		return this.state.names;
	}

	handler(){
		// debugger
		this.props.onHandle && this.props.onHandle.call(this, this.house)
	}
	componentWillMount(){
		let arr = [];
		// debugger
		if(this.data && this.data.length && this.data[0]['guestList'] && this.data[0]['guestList'] && this.data[0]['guestList'].length){
			for(let i = 0; i < this.number; i++){
				let room = this.data[i];
				let guestList = room.guestList;
				let guests = [];
				for(let j = 0; j < guestList.length; j++){
					let guest = guestList[j];
					// debugger
					guests.push({
						fames : {
							name : `${this.fames}-${i}-${j}`,
							error : !(guest && guest.lastName),
							reg : /^[a-zA-Z]+$/,
							message : '',
							value : guest && guest.lastName ? guest.lastName : ''
						},
						names : {
							name : `${this.names}-${i}-${j}`,
							error : !(guest && guest.firstName),
							reg : /^[a-zA-Z]+$/,
							message : '',
							value : guest && guest.firstName ? guest.firstName : ''
						}
					});
				}
				// debugger
				arr.push({
					room : i,
					guest: guests
				});
			}
		}else {
			for(let i = 0; i < this.number; i++){
				arr.push({
					room : i,
					guest: [{
						fames : {
							name : this.fames,
							error : true,
							reg : /^[a-zA-Z]+$/,
							message : '',
							value : ''
						},
						names : {
							name : this.names,
							error : true,
							reg : /^[a-zA-Z]+$/,
							message : '',
							value : ''
						}
					}]
				});
			}
		}
		
		this.setState({
			house : arr,
		}, this.handler);
	}

	guestAdd(roomIndex) {
		// debugger
		let house = this.state.house;
		let room = house[roomIndex];
		let guests = room.guest;
		guests.push({
			fames : {
				name : this.fames,
				error : true,
				reg : /^[a-zA-Z]+$/,
				message : '',
				value : ''
			},
			names : {
				name : this.names,
				error : true,
				reg : /^[a-zA-Z]+$/,
				message : '',
				value : ''
			}
		});
		this.setState({
			house : house,
		}, this.handler);
	}

	guestDel(roomIndex, guestIndex) {
		let house = this.state.house;
		let room = house[roomIndex];
		let guests = room.guest;
		guests = guests.pop();
		this.setState({
			house : house,
		}, this.handler);
	}

	renderOpsAdd(roomIndex, guestIndex) {
		// debugger
    	// 未达到最大限制数,则最后一行后边显示添加
    	let guests = this.state.house[roomIndex]['guest'];
    	if(guests.length < this.props.max) {
    		if(guests.length == guestIndex + 1) {
    			return (
    				<a className="guest-add" href="javascript:void(0)" onClick={this.guestAdd.bind(this, roomIndex, guestIndex)}>{guestIndex == 0 ? '添加入住人' : '添加'}</a>
				)
    		}
    	}
		return null;
	}

	renderOpsDel(roomIndex, guestIndex) {
		// debugger
    	// 最后一个且不是第一个显示删除
    	let guests = this.state.house[roomIndex]['guest'];
    	if(guests.length > 1) {
    		if(guests.length == guestIndex + 1) {
    			return (
    				<a className="guest-add" href="javascript:void(0)" onClick={this.guestDel.bind(this, roomIndex, guestIndex)}>删除</a>
				)
    		}
    	}
		return null;
	}

	checkName(key, guestIndex, event){
		let states = {};
		let target = event.target;
		
		let _house = this.house;
		// debugger
		let _guest = _house[key]['guest'][guestIndex];
		if(target.name.indexOf(this.fames) > -1){
			if(target.value == '' ) {
				_guest.fames.message = '请输入姓（拼音）';
				_guest.fames.error = true;
				_guest.fames.value = target.value;
			}else if(!_guest.fames.reg.test(target.value)){
				_guest.fames.message = '请填写拼音';
				_guest.fames.error = true;
				_guest.fames.value = target.value;
			}else{
				_guest.fames.message = '';
				_guest.fames.error = false;
				_guest.fames.value = target.value;
			}
		}else if(target.name.indexOf(this.names) > -1){
			if(target.value == '' ) {
				_guest.names.message = '请输入名（拼音）';
				_guest.names.error = true;
				_guest.names.value = target.value;
			}else if(!_guest.names.reg.test(target.value)){
				_guest.names.message = '请填写拼音';
				_guest.names.error = true;
				_guest.names.value = target.value;
			}else{
				_guest.names.message = '';
				_guest.names.error = false;
				_guest.names.value = target.value;
			}
		}
		// debugger
		states.house = _house;
		this.setState(states, this.handler);
	}

	render(){
		
		return (
			<div className='ui-house-group'>
			{
				this.state.house.map((item, key) => {
					return (
						<dl key={key}>
							<dt>
								房间{key + 1}
							</dt>
							<dd>
								<div className="tip">* 必须为成年人才可正常办理入住</div>
								{
									item.guest.map((info, index) => {
										// debugger
										return (
											<div className="guest-row">
												<dfn>
													{index == 0 ? <del>*</del> : null}
													{index == 0 ? '主入住人': '其他入住人'}：
												</dfn>
												<label className='margin'>
													<input
													className='auto'
													type='text'
													name={info.fames.name}
													onChange={this.checkName.bind(this, key, index)}
													maxLength={30}
													value={info.fames.value}
													placeholder='姓（拼音）' />
													<span
													className={info.fames.error && info.fames.message ? 'show' : ''}
													>{info.fames.message}</span>
												</label>
												<label>
													<input
													className='auto'
													type='text'
													name={info.names.name}
													onChange={this.checkName.bind(this, key, index)}
													maxLength={30}
													value={info.names.value}
													placeholder='名（拼音）' />
													<span
														className={info.names.error && info.names.message ? 'show' : ''}
														>{info.names.message}</span>
												</label>
												{this.renderOpsAdd(key, index)}
												{this.renderOpsDel(key, index)}
											</div>
										)
									})
								}
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
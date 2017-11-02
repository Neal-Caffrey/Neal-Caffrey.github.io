import React, {Component, PropTypes} from "react";
import Input from "components/ui-input/index.jsx";
import Area from "./js/index.jsx";
import OnclickOutside from 'react-onclickoutside';
import AreaCss from "./sass/index.scss";


class UIAreaCode extends Component {
	static propTypes = {
		onHandle : PropTypes.func,
		labelClass : PropTypes.string,
		className : PropTypes.string,
		name : PropTypes.string,
		sign : PropTypes.string,
		placeholder : PropTypes.string,
		replaceValue : PropTypes.string,
	}
	constructor(props, context) {
		super(props, context);
		this.state = this.defaultState;
	}

	get defaultState(){
		const {className, labelClass, name, sign, placeholder, value} = this.props;
		return {
			isShow : false,
			area : Area,
			isSearch : false,
			searchArea : [],
			code : null,
			className : className || 'code',
			labelClass : labelClass || 'ui-input',
			name : name || 'linkcode',
			sign : sign || '区号',
			placeholder : placeholder || '86-中国',
			value : value ||'86-中国',
		}
	}

	

	get area(){
		return this.state.area;
	}

	get code(){
		return this.state.code;
	}

	get search(){
		return this.state.searchArea;
	}

	get className(){
		return this.state.className;
	}

	get labelClass(){
		return this.state.labelClass;
	}

	get name(){
		return this.state.name;
	}

	get sign(){
		return this.state.sign;
	}

	get placeholder(){
		return this.state.placeholder;
	}

	get value(){
		return this.state.value;
	}

	get replaceValue(){
		return this.state.replaceValue;
	}

	get isShow(){
		return this.state.isShow;
	}

	get isSearch(){
		return this.state.isSearch;
	}

	componentWillReceiveProps(nextProps){
		this.setState({
				replaceValue : nextProps.replaceValue,
			});
	}
	handle(){
		this.props.onHandle && this.props.onHandle.call(this, {
			error : !this.code.areaCode,
			code : this.code,
			name : this.name,
			className : this.className,
		});
	}

	searchArea(info, event){
		this.getArea(info.value);
	}

	getArea(key = '') {
		let black = ['countryId', 'placeCategoryId'],
			states = {
				replaceValue : '',
				code : {
					areaCode : key
				}
			};
        if (key == '') Object.assign(states, {
        	isSearch : false,
        })
        else {
            let arr = this.area.filter( (elems) => {
                return this.queryData(key, elems, black);
            });
            if(arr.length > 0) Object.assign(states, {
	        	searchArea : arr,
	        	isSearch : true,
	        	isShow : true,
	        });
        	else Object.assign(states, {
        		isShow : false,
        	})
        }

        this.setState(states, this.handle);
        
    }
    queryData(val, obj, black = []) {
        let string = (function(res) {
            let s = '';
            for (let key in res) if (black.indexOf(key) < 0) s += res[key];
            return s;
        })(obj);
        let reg = new RegExp(val, 'g');
        return reg.test(string);
    }

	selectArea(data){
		this.setState({
			isShow : false,
			replaceValue : `${data.areaCode}-${data.countryName}`,
			code : data,
		}, this.handle);
	}

	showSelect(){
		this.setState({
			isShow : true,
		});
	}

	handleClickOutside(){
		this.setState({
			isShow : false,
		})
	}

	render(){
		return (
			<div className='ui-areacode'>
				<Input
				name={this.name}
				sign={this.sign}
				labelClass={this.labelClass}
				className={this.className}
				reg={/\S+/}
				placeholder={this.placeholder}
				onHandle={this.searchArea.bind(this)}
				onFocus={this.showSelect.bind(this)}
				value={this.value}
				replaceValue={this.replaceValue}
				/>
				<ul
				className={this.isShow ? 'show' : ''}>
				{
					this.isSearch ?  
					this.search.map((list, key) => {
						return (
							<li key={key}>
								<a 
								href='javascript:;'
								onClick={this.selectArea.bind(this, list)}
								>{list.countryName}({list.areaCode})</a>
							</li>
							)
					}) : 
					this.area.map((item,  key) => {
						return (
							<li
							key={key}
							>
								<a 
								href='javascript:;'
								onClick={this.selectArea.bind(this, item)}
								>{item.countryName}({item.areaCode})</a>
							</li>
						)
						
					})
				}
				</ul>
			</div>
			)
	}
}

export default OnclickOutside(UIAreaCode);
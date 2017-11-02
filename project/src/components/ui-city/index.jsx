import React , {Component, PropTypes} from 'react';
import OnclickOutside from 'react-onclickoutside';
import { Spin } from 'local-Antd';
import Request from 'local-Ajax/dist/main.js';
import NavList from './js/index.jsx';
import searchCss from './sass/index.scss';

class UICity extends Component{

  static propTypes = {
    hotUrl : PropTypes.string.isRequired,
    searchUrl : PropTypes.string.isRequired,
    onHandle : PropTypes.func,
  }

  constructor(props,context){
    super(props,context);
    this._Request = this.Request;
    this.state = this.defaultState;
  }

  get Request(){
  	return new Request();
  }

  get defaultState(){
    const {defaultNavList, defaultVal} = this.props;
    return {
    	isPop : false,
    	isSearch : false,
    	isLoading : false,
    	hotList : [],
    	initial : 0,
    	navList : defaultNavList || NavList,
    	navIndex : 0,
    	inputValue : defaultVal || '',
    	searchList : [],
    }
  }

  get initial(){
    return this.state.initial;
  }

  get inputValue(){
    return this.state.inputValue;
  }

  get isSearch(){
    return this.state.isSearch;
  }

  get isLoading(){
    return this.state.isLoading;
  }

  get searchList(){
    return this.state.searchList;
  }

  get navList(){
    return this.state.navList;
  }

  get navIndex(){
    return this.state.navIndex;
  }

  get hotList(){
    return this.state.hotList;
  }

  componentWillMount(){
    this.getHotDate();
  }

  inputFoucs(event){
  	const target = event.target;
    // debugger;
  	target.select();
    let states = target.value != '' && this.initial == 1 ?
    {
      isSearch : true,
    } : {
      isPop : true,
    }
  	this.setState(states);
  }

  handleClickOutside(){
    this.setState({
  		isPop : false,
  		isSearch : false
  	});
  }

  selectNav(index, event){
  	this.setState({
  		navIndex : index,
  	});
  }

  objectToArray = (obj) => {
    let arr = [];
    this.navList.forEach((item, key) => {
      arr.push(obj[item.type]);
    });
    return arr;
  }

  selectValue(val, type, event){
  	let states = {
  		isPop : false,
  		isSearch : false,
  		inputValue : type  == 'hot' ? val.cityName : val.destinationName,	
  	}, 
    citys = type  == 'hot' ? {
      destinationType : 1,
      destinationName : val.cityName,
      destinationId : val.cityId,
    } : val;
  	this.setState(states);
  	this.props.onHandle && this.props.onHandle.call(this, citys, type);
  }

  inputChange(event){
  	const inputValue = event.target.value;
  	let states = {
    	inputValue : inputValue,
      isLoading : true,
    }
    if(inputValue != ''){
	    Object.assign(states, {
	    	isSearch : true,
			  isLoading : true,
			  isPop : false,
			  initial : 1
	    });
	    this.setState(states);
	    this.getSearchDate(inputValue);
    }else{ 
    	Object.assign(states, {
	    	isSearch : false,
	        isLoading : false,
	        isPop : true,
	        initial : 0
	    });
      // this.selectValue('', '', event);
      this.setState(states);
      this.props.onHandle && this.props.onHandle.call(this, '', '');
	  }
    
  }

  getHotDate(){
  	let ops = {
  		url : this.props.hotUrl,
  	};

  	this._Request.ajax(ops)
  	.then((res) => {
  		let states = {};
  		if(res.status == 200) Object.assign(states, { hotList : this.objectToArray(res.data)})
		  this.setState(states);
  	})
  }

  getSearchDate(key){
  	let ops = {
  		url : this.props.searchUrl,
  		data : {keyword:key},
  		promise :false,
  		abort :true,
  		success : (res) => {
  			let states = {
	  			isLoading : false
	  		};
	  		if(res.status == 200) Object.assign(states, {searchList : res.data});
  			this.setState(states);
  		}
  	};

  	this._Request.ajax(ops);

  }

  render(){
    return (
      	<span className='city-group'>
      		<input 
      		type='text' 
      		className='input-default input-auto' 
      		placeholder='请选择目的地/城市' 
      		onFocus={this.inputFoucs.bind(this)} 
            value={this.inputValue} 
            onChange={this.inputChange.bind(this)}
      		/>
      		<div
      		className={this.isSearch ? 'city-group-search showView' : 'city-group-search'}>
      			{
      				this.isLoading ?
      					(
      						<div className='loading'>
      							<Spin />
      						</div>
  						) : 
      					(

      						<div className='city-group-view-main clearfix'>
      						{
      							this.searchList.length < 1 ?
      							<p key='noSearch' className='empty'>没有找到相关目的地/城市</p> :
      							this.searchList.map((item, key) => {
      								return(
			      						<a 
			      						className={this.state.searchListIndex == key ? 'select' : ''}
			      						key={key} 
			      						title={item.destinationName}
			      						onClick={this.selectValue.bind(this, item, 'search')}>{item.destinationName}
			      						</a>
      									)
      							})
      						}
			      			</div>
  						)
      			}
      			
      		</div>
      		<div 
			    className={this.state.isPop ? 'city-group-view showView' : 'city-group-view'}>
      			<ul className="clearfix">
      				{
      					this.navList.map((item, key) => {
      						return (
  								<li 
                  className={key == this.navIndex ? 'active' : ''}
  								key={key} 
  								title={item.name}
  								onClick={this.selectNav.bind(this, key)}
  								>{item.name}</li>
      						)
      					})
      				}
      			</ul>
      			<div className='city-group-view-main clearfix'>
      				{
      					this.hotList.map((item, key) => {
      						return (
      								<div 
                      className={key == this.navIndex ? 'show' : ''}
                      key={key}>
                      {
                          item.map((list, index) => {
                            return (
                              <a 
                              key={index} 
                              title={list.cityName}
                              onClick={this.selectValue.bind(this, list, 'hot')}>{list.cityName}
                              </a>
                              )
                          })
                        }
                      </div>
      							)
      					})
      				}
      			</div>
      		</div>
    	</span>
    )
  }

}

export default OnclickOutside(UICity);
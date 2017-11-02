import React , {Component, PropTypes} from 'react';
import OnclickOutside from 'react-onclickoutside';
import { Spin } from 'local-Antd';
import Request from 'local-Ajax/dist/main.js';
import searchCss from './sass/index.scss';

class UIKeyword extends Component{

  static propTypes = {
    keyUrl : PropTypes.string.isRequired,
    detaultVal: PropTypes.string,
    placeholder : PropTypes.string,
    offset : PropTypes.number,
    limit : PropTypes.number,
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
    const {offset, limit, placeholder, detaultVal} = this.props;
    return {
    	isSearch : false,
    	isLoading : false,
      placeholder : placeholder || '',
    	inputValue : detaultVal || '',
    	keyList : [],
      offset : offset || 0,
      limit : limit || 5,
      searchListIndex : 0,
    }
  }

  get isSearch(){
    return this.state.isSearch;
  }

  get isLoading(){
    return this.state.isLoading;
  }

  get inputValue(){
    return this.state.inputValue;
  }

  get keyList(){
    return this.state.keyList;
  }

  get limit(){
    return this.state.limit;
  }

  get offset(){
    return this.state.offset;
  }

  get searchListIndex(){
    return this.state.searchListIndex;
  }

  handleClickOutside(){
    this.setState({
  		isSearch : false,
  	});
  }

  selectValue(val, key, event){
  	let states = {
  		isSearch : false,
  		// inputValue : val.cityName,
      inputValue : val.hotelName,
      searchListIndex : key,	
  	}
  	this.setState(states);
  	this.props.onHandle && this.props.onHandle.call(this, val, 'select');
  }

  inputFocus(event){
    let states = {};
    let _target = event.target;
    if(_target.value != '') {
      _target.select();
      Object.assign(states, {
        isSearch : true,
      });
    }
    this.setState(states);
  }

  // inputBlur(event){
  //   const inputValue = event.target.value;
  //   if(inputValue != ''){
  //     this.setState({
  //       inputValue : this.keyList.length > 0 ? this.keyList[this.searchListIndex].hotelName : inputValue,
  //     })
  //   }
  // }

  inputChange(event){
  	const inputValue = event.target.value;

  	let states = {
      searchListIndex : 0,
      inputValue : inputValue,
    }
    if(inputValue != ''){
	    Object.assign(states, {
    	  isSearch : true,
			  isLoading : true,
	    });
	    this.setState(states);
	    this.getSearchDate(inputValue);
      this.props.onHandle && this.props.onHandle.call(this, inputValue, 'input');
    }else{ 
    	Object.assign(states, {
	    	isSearch : false,
        isLoading : false,
	    });
      this.setState(states);
      this.selectValue('','' ,event);
	}
    
  }

  getSearchDate(key){
  	let ops = {
  		url : this.props.keyUrl,
  		data : {
            destinationId : this.props.destinationId,
            destinationType : this.props.destinationType,
        keyword : key,
        limit : this.limit,
        offset: this.offset,
      },
  		promise :false,
  		abort :true,
  		success : (res) => {
  			let states = {
	  			isLoading : false
	  		};
	  		if(res.status == 200) {
          Object.assign(states, {
            keyList : res.data,
          });
  			};
  			this.setState(states);
  		}
  	};

  	this._Request.ajax(ops);

  }

  render(){
    return (
      	<span className='search-group'>
          <input 
          type='text'
          className='keywords input-group' 
          placeholder={this.state.placeholder}
          onChange={this.inputChange.bind(this)}
          onFocus = {this.inputFocus.bind(this)}
          // onBlur = {this.inputBlur.bind(this)}
          value={this.inputValue}
          />
          <div
          className={this.isSearch ? 'search-keyword showView' : 'search-keyword'}>
            {
              this.isLoading ? 
              (
                <div className='loading'>
                  <Spin />
                </div>
              ) : 
              (
                <div className='search-keyword-main'>
                  {
                    this.keyList.length < 1 ?
                    <p key='noSearch' className='empty'>没有找到相关目的地/城市</p> :
                    <div className={this.keyList.length == 1 ? 'search-keyword-view keyword-small' : 'search-keyword-view'}>
                        {
                          this.keyList.map((item, key) => {
                            return (
                              <a 
                              className={this.searchListIndex == key ? 'select clearfix' : 'clearfix'}
                              key={key} 
                              title={item.cityName}
                              onClick={this.selectValue.bind(this, item, key)}><span className='fl-left'>{item.hotelName}</span> <span className='fl-right'>{item.cityName}</span>
                              </a>
                            )
                          })
                        }
                    </div>
                  }
                </div>
              )
            }
          </div>
      </span>
    )
  }

}


export default OnclickOutside(UIKeyword);
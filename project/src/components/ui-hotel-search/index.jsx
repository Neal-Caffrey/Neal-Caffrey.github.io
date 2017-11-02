import React , {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import CityGroup from 'components/ui-city/index.jsx';
import ApiConfig from "widgets/apiConfig/index.js";
import DatePickerGroup from 'components/ui-date-picker/index.jsx';
import {updateCity, updateKeyword , updateDate, updateCurrent} from 'ACTIONS/listAction.js';
import Keywords  from "components/ui-keyword/index.jsx";
import searchCss from './sass/index.scss';

class UIHotelSearch extends Component{

  static propTypes = {
    city : PropTypes.string,
    date : PropTypes.array,
    keyword : PropTypes.string,
    onHandler : PropTypes.func,
  }

  constructor(props,context){
    super(props,context);
    this.state = this.defaultState;
  }

  get defaultState(){
    return {
      city : this.props.city || '',
      date : this.props.date || [],
      keyword : this.props.keyword || '',
    }
  }

  get hotelHot(){
    return ApiConfig.hotelHot;
  }

  get hotelDestination(){
    return ApiConfig.hotelDestination;
  }

  get hotelKeyword(){
    return  ApiConfig.hotelKeyword;
  }

  get city(){
    return this.state.city;
  }

  get date(){
    return this.state.date;
  }

  get keyword(){
    return this.state.keyword;
  }


  selectCity(val, tag){
    this.setState({
      city : val
    })
  }

  selectDate(val, tag){
    // debugger
    this.setState({
      date : val
    })
  }

  keyWordsVal(val, tag){
    // console.log(val,tag);
    // if(tag === 'select' && val != ''){
    //   window.open('./detail.html?hotelId=' + val.hotelId);
    // }
    this.setState({
      keyword : {
        val : val,
        type : tag,
      }
    });

  }

  search(val, tag){
    // if(this.city == '') return;
    this.props.dispatch(updateCity(this.city));
    this.props.dispatch(updateDate(this.date));
    this.props.dispatch(updateKeyword(this.keyword));
    this.props.dispatch(updateCurrent(1));
    this.props.onHandler && this.props.onHandler.call(this, this.state);

  }


  render(){
    return (
      <div className='ui-hotel-search from-group'>
        <CityGroup 
        hotUrl={this.hotelHot}
        searchUrl={this.hotelDestination}
        onHandle={this.selectCity.bind(this)}
         />
        <DatePickerGroup 
        placeholder={['请选择入住日期', '请选择离店日期']} 
        onHandle={this.selectDate.bind(this)}
        step={1}
        disabledDate={1}
        />
        <Keywords
        destinationId={this.state.city.destinationId}
        destinationType={this.state.city.destinationType}
        placeholder='请输入您要查询的酒店'
        keyUrl={this.hotelKeyword}
        onHandle={this.keyWordsVal.bind(this)} />
        <span className='button-group'>
          <button 
          type='submit' 
          className='btn-default'
          onClick={this.search.bind(this)}>搜索</button>
        </span>
      </div>
    )
  }
};

const mapStateToProps = (state) => {
  return {
    list: state.list
  }
}

export default connect(mapStateToProps)(UIHotelSearch);

import React , {Component} from 'react';
import { connect } from 'react-redux';
import SearchCity from '../../w-city/index.jsx';
import ApiConfig from 'widgets/apiConfig/index.js';

class DailyCity extends Component{
  constructor(props,context){
    super(props,context);
  }
  bindEvent(){
    return {
      onSelectCity : (res)=>{
        this.props.onSelectCity && this.props.onSelectCity(res);
      }
    }
  }
  render(){
    return (
      <SearchCity
        hotXHRUrl={ApiConfig.hottestCity}
        initialUrl={ApiConfig.byinitial}
        routerUrl={ApiConfig.queryCityRoute}
        searchUrl={ApiConfig.searchDailyStartCitys}
        onSelectCity={this.bindEvent().onSelectCity}
        />
    )
  }
}
function mapStateToProps(state) {
  const { leftSide } = state;
  const {startTime,endTime,startCity} = leftSide;
  return {
    startTime,
    endTime,
    startCity
  }
}

export default connect(mapStateToProps)(DailyCity)

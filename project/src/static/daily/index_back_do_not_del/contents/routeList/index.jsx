import React , {Component} from 'react';
import {connect} from 'react-redux';
// antd
import {Icon,Input} from 'local-Antd';
//组件
import update from 'react-addons-update';
import {isEmptyObject} from 'components/util/index.jsx';
//css
import './sass/index.scss';
class RouteList extends Component{
  constructor(props,context){
    super(props,context);
  }
  getRouteDisc(startCity,endCity,type){
    let res;
    if(type === 301 && endCity){
      res = `${startCity.cityName}-${endCity.cityName},住在${endCity.cityName}`;
      return res;
    }
    startCity.cityRouteScopes.forEach((val,index)=>{
      if(val.routeType === type ){
        res =  val.routeTitle;
      }
    })
    return res;
  }
  renderFlightDisc(flightVo){
    if(!flightVo)return null;
    let {pickupVo,dropoffVo} = flightVo;
    if(pickupVo){
      let {type,flightVo,placeVo} = pickupVo;
      if(type === 0){
        //航班号查询
        return (
          <p className="jieji">{flightVo.arrTime} 从<span  className="jichang">{flightVo.arrCityName}-{flightVo.arrAirport}</span>出发</p>
        )
      }else{
        return (
          <p className="jieji">{pickupVo.time} 从<span  className="jichang">{flightVo.cityName}-{flightVo.airportName}</span>出发</p>
        )
      }
    }
    if(dropoffVo){
      let {type,flightVo,placeVo} = dropoffVo;
      return (
        <p className="songji">{dropoffVo.time}出发，送到 <span  className="jichang">{flightVo.cityName}-{flightVo.airportName}</span></p>
      )
    }
  }
  renderNone(){
    return (
      <div className="routeList">
        <div className="title">行程单</div>
        <div className="routeListBox">
          <div className='none-plan'>
            <img src='https://www.yundijie.com/build/v2/imgs/default.png'/>
            <p>安排好的行程将在这里呈现</p>
          </div>
        </div>
      </div>
    )
  }
  render(){
    if(this.props.planList.length === 0){
      //搞一个默认地球
      return this.renderNone();
    }
    if(this.props.planList[0].isComplete === false){
      return this.renderNone();
    }
    return <div className="routeList">
      <div className="title">行程单</div>
      <div className="routeListBox">
         <ul className="lists">
           {
             (()=>{
               let planTitle = (val,index)=>{
                 return (
                   <div className="listTitle">
                     <i className="icon-place"></i><span>第{1+index}天<em>{val.date.format('YYYY-MM-DD')}</em></span>
                   </div>
                 )
               }
               let dailyRender = (val,index)=>{
                 let {pickupVo,dropoffVo} = val.dailyVo;
                 return (
                   <li key={index} className="list">
                     {planTitle(val,index)}
                     <div className="content">
                       <p className="baochemsg">{this.getRouteDisc(val.dailyVo.startCity,val.dailyVo.endCity,val.dailyVo.type)}</p>
                       {this.renderFlightDisc({pickupVo,dropoffVo})}
                     </div>
                   </li>
                 )
               }
               let noneCar = (val,index)=>{
                 return (
                   <li key={index} className="list">
                    {planTitle(val,index)}
                     <div className="content">
                       <p className="baochemsg">本日无包车</p>
                     </div>
                   </li>
                 )
               }
               let flightRender = (val,index)=>{
                 let flightVo = val.flightVo;
                 return (
                   <li key={index} className="list">
                     {planTitle(val,index)}
                     <div className="content">
                       {this.renderFlightDisc(flightVo)}
                     </div>
                   </li>
                 )
               }
               return this.props.planList.map((val,index)=>{
                 if(!val.isComplete)return null;
                 if(val.type === 0 || val.type === 1){
                   return dailyRender(val,index);
                 }
                 if(val.type === 2){
                   return noneCar(val,index);
                 }
                 if(val.type === 3){
                   return flightRender(val,index)
                 }
               })
             })()
           }

         </ul>
      </div>
    </div>
  }
}

const mapStateToProps = (state) => {
  const {leftSide} = state;
  const planList = leftSide.planList;

  return {
    planList
  }

}

export default connect(mapStateToProps)(RouteList);

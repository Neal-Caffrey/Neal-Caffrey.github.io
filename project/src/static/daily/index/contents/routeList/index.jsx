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
  getRouteDisc(startCity,endCity,type,distanceDesc){
    let res = [];
    if(type === 301 && endCity){
      res.push(
        <p className='baochemsg' style={{paddingBottom:'0px'}}>{startCity.cityName}-{endCity.cityName}，住在{endCity.cityName}</p>
      );
      res.push(
        <p style={{color:'#6E767D'}}>{distanceDesc}</p>
      )
      return res;
    }
    startCity.cityRouteScopes.forEach((val,index)=>{
      if(val.routeType === type ){
        res.push(
          <p>{val.routeTitle}</p>
        );
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
          <p className="jieji"><span className='bold'>{flightVo.flightNo} </span>预计<span className='bold'>{flightVo.arrTime}</span>抵达 从<span  className="jichang">{flightVo.arrCityName || flightVo.cityName}-{flightVo.arrAirport || flightVo.airportName}</span>出发</p>
        )
      }else{
        return (
          <p className="jieji"><span className='bold'>{flightVo.arrTime}</span> 从<span  className="jichang">{flightVo.arrCityName || flightVo.cityName}-{flightVo.arrAirport || flightVo.airportName}</span>出发</p>
        )
      }
    }
    if(dropoffVo){
      let {type,flightVo,placeVo,time} = dropoffVo;
      // let timeDom = dropoffVo.isCai && <span className='bold'>{time}</span>;
      let timeDom = null;
      return (
        <p className="songji">{timeDom}送到 <span  className="jichang">{flightVo.cityName}-{flightVo.airportName}</span></p>
      )
    }
  }
  renderOnlyFlight(flightVo){
    if(!flightVo)return null;
    let {pickupVo,dropoffVo} = flightVo;
    if(pickupVo){
      let {type,flightVo,placeVo,date,time} = pickupVo;
      if(type === 0){
        //航班号查询
        return (
          <div className="jiejibox">
            <div className="hangbanmsg">
              <p>{flightVo.flightNo} 预计 {flightVo.arrDate} {flightVo.arrTime}抵达</p>
              <span>接机</span>
            </div>
            <div className="chufa">
              <div  className="div1">出发: </div>
              <div  className="div2">{flightVo.arrAirport || flightVo.airportName}</div>
            </div>
            <div className="songda">
              <div  className="div1">送达: </div>
              <div className="div2">
                <p>{placeVo.placeName}</p>
                <p className="placemsg">{placeVo.placeAddress}</p>
              </div>
            </div>
          </div>
        )
      }else{
        return (
          <div className="jiejibox">
            <div className="hangbanmsg">
              <p className='bold'>{date.format('YYYY-MM-DD')} {time}上车</p>
              <span>接机</span>
            </div>
            <div className="chufa">
              <div  className="div1">出发: </div>
              <div  className="div2">{flightVo.airportName || flightVo.arrAirport}</div>
            </div>
            <div className="songda">
              <div  className="div1">送达: </div>
              <div className="div2">
                <p>{placeVo.placeName}</p>
                <p className="placemsg">{placeVo.placeAddress}</p>
              </div>
            </div>
          </div>
        )
      }
    }
    if(dropoffVo){
      let {type,flightVo,placeVo,date,time} = dropoffVo;
      return (
        <div className="jiejibox">
          <div className="hangbanmsg">
            <p className='bold'>{date.format('YYYY-MM-DD')} {time}上车</p>
            <span>送机</span>
          </div>
          <div className="chufa">
            <div  className="div1">出发: </div>
            <div  className="div2">
                <p>{placeVo.placeName}</p>
                <p className="placemsg">{placeVo.placeAddress}</p>
            </div>
          </div>
          <div className="songda">
            <div  className="div1">抵达: </div>
            <div className="div2">
              <p>{flightVo.airportName}</p>
            </div>
          </div>
        </div>
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
            <p>安排好的行程将在这里展现</p>
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
    return (<div className="routeList">
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
                       {this.getRouteDisc(val.dailyVo.startCity,val.dailyVo.endCity,val.dailyVo.type,val.dailyVo.distanceDesc)}
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
               let onlyFlightRender = (val,index) =>{
                 let flightVo = val.flightVo;
                 return (
                   <li key={index} className="list">
                     {planTitle(val,index)}
                     <div className="content">
                       {this.renderOnlyFlight(flightVo)}
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
                   return onlyFlightRender(val,index)
                 }
               })
             })()
           }

         </ul>
      </div>
    </div>)
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

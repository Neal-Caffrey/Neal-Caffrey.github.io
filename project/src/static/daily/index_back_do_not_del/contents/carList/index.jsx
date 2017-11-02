import React , {Component} from 'react';
import {connect} from 'react-redux';
// antd
import {Icon,Input} from 'local-Antd';
//组件
import update from 'react-addons-update';
import {isEmptyObject} from 'components/util/index.jsx';
import Luggage from '../luggage_react/index.js';
import {updateMainSplitAndQuery,updateLoading} from '../../action/mainAction.js';
import YdjAjax from 'components/ydj-Ajax/index.js';
import ApiConfig from 'widgets/apiConfig/index.js';
//css
import './sass/index.scss';


class CarList extends Component{
  constructor(props,context) {
      super(props, context);
      this.cacheData()
      this.state={
        display:false,
        filter : '>0',
        tabIndex : 0,
        carLength : this.data.carLength
      }
  }


  showLuggage(){
    this.setState({
      display:true
    })
      // alert('1');
  }

  changeLuggageHide(){
    this.setState({
      display: false
    })
  }
  componentWillReceiveProps(nextProps) {
    this.cacheData(nextProps);
    this.setState({
      carLength : this.data.carLength,
      filter : '>0',
      tabIndex : 0,
      display:false,
    })
  }
  cacheData(props=this.props){
    console.log(props)
    let carList = props.carList.quoteInfos;
    let carLength = carList ? carList.length : 0;
    let noneCarsReason = props.carList.noneCarsReason;
    this.data = {
      carLength,
      carList,
      noneCarsReason
    }
  }
  bindEvent(){
    return {
      clickFilter : (filter,tabIndex)=>{
        if(!this.data.carList){return}
        let carLength = (this.props.carList.quoteInfos.filter((val) => {
          let operateStr = `${val.seatCategory} ${filter}`;
          return eval(operateStr);
        }).length)
        this.setState({
          filter,
          tabIndex,
          carLength
        })
      },
      closeCar : ()=>{
        this.props.dispatch(updateMainSplitAndQuery(null,null,[]));
      },
      goToOrder : (quoteInfo)=>{
        let fillData = {
          queryParam : this.props.queryParam,
          splitPlanList : this.props.splitPlanList,
          quoteInfo : this.props.splitPlanList,
        };
        let key = quoteInfo.batchNo + quoteInfo.carId;
        this.setFill(fillData,key,(res)=>{
          console.log(res);
          if(res.data === 200){
            window.location.href = './orderFill.html?key='+key
          }
          this.props.dispatch(updateLoading(false));
        })
      }
    }
  }

  setFill(fillData,key,cb){
    let opt = {
      url: ApiConfig.setFill,
      // url: 'http://api6-dev.huangbaoche.com/trade/fx/v1.0/cla/merchant/detail',
      data:JSON.stringify({
        fillData,
        key
      }),
      type : 'POST',
      headers : {
        'Content-Type': 'application/json'
      },
      abort : true,
      successHandle: (res) => {
        cb && cb(res)
        console.log(res);
          // this.setState({
          //   searchList : res.data.listData,
          //   isLoading : false,
          //   isSearch : true
          // })
      },
      failedHandle : (res) =>{
          this.props.dispatch(updateLoading(false));
      }
      // ...this._handleErrors
    }
    this.props.dispatch(updateLoading(true));
    new YdjAjax(opt);
  }

  getTabClass(tabIndex){
    if(this.state.tabIndex === tabIndex){
      return 'haveafter selected'
    }
    return 'haveafter'
  }
  renderNone(desc){
    return (
      <div className="nocar">
        <img src='https://www.yundijie.com/build/v2/imgs/default.png'/>
        <p>{desc}</p>
      </div>

    )
  }

  render(){
    if(this.props.carList.length === 0){
      return null;
    }
      return <div className="carList">
        <div className="outerbox">
          <div className="box">
            <div className="tripMsg">
              <span className="startCity">行程开始城市 :</span>
              <span className="city">{this.props.startCityName}</span>
              <em>
                <span className="startStopDate">行程起止日期 :</span>
                <span className="date">{this.props.startTime} 至 {this.props.endTime}</span>
              </em>
              <u className="modifyTrip" onClick={this.bindEvent().closeCar}>修改行程</u>
            </div>
            <div className="listTitle">
              <span className="count">有 <strong>{this.state.carLength}</strong> 种车型可为您提供服务</span>
              <span onClick={this.showLuggage.bind(this)} className="standardDescription"><i  className="icon-luggage"></i><u>行李标准说明</u></span>
              <ul className="navlist">
                <li  className={this.getTabClass(0)}
                   onClick={this.bindEvent().clickFilter.bind(this,'>0',0)}>全部车型</li>
                 <li  className={this.getTabClass(1)}
                  onClick={this.bindEvent().clickFilter.bind(this,'==5',1)}>5座</li>
                <li  className={this.getTabClass(2)}
                  onClick={this.bindEvent().clickFilter.bind(this,'>=7',2)}>7座及以上</li>
                <li className={this.getTabClass(3)}
                  onClick={this.bindEvent().clickFilter.bind(this,'>=9',3)}>9座及以上</li>
              </ul>
            </div>
            <div className="borderBottom"></div>
            <ul className="cars">
              {
                (()=>{
                  if(!this.data.carList || this.state.carLength === 0)return this.renderNone(this.data.noneCarsReason || '没有找到相关车型~');
                  let cars =  this.data.carList.map((val,index)=>{
                    let carCss = {
                      background : `url(${val.carPictures[0]}) no-repeat center`,
                      backgroundSize : 'contain'
                    }
                    let operateStr = `${val.seatCategory} ${this.state.filter}`;
                    let operate = eval(operateStr);
                    if(!operate){
                      return null;
                    }
                    return (
                      <li key={index} className="car">
                        <div className="carImage" style={carCss}></div>
                        <div className="right">
                          <div className="titlebox">
                            <strong>{val.carDesc}</strong> <span><em>{val.capOfPerson}</em>人／<em>{val.capOfLuggage}</em>行李</span>
                          </div>
                          <p className="carstype">{val.models}</p>
                          <ul className="tags">
                            {
                              val.serviceTags.map((tag,tIndex)=>{
                                return (
                                    <li key={tIndex}>{tag}</li>
                                )
                              })
                            }
                          </ul>
                        </div>
                        <div className="btn" onClick={this.bindEvent().goToOrder.bind(this,val)}>预定</div>
                        <div className="priceBox">
                          <div className="price">¥{val.price}</div>
                          <div className="pricemsg">该价格有效期至{val.payDeadline}</div>
                        </div>
                          {/*<div className="btn">预定</div>*/}
                        <div className="haveBorderBottom"></div>
                      </li>
                    )
                  });
                  if(cars.length === 0){
                    return this.renderNone()
                  }
                  return cars;
                })()
              }
            </ul>
          </div>
          <Luggage  changeHide={this.changeLuggageHide.bind(this)} show={this.state.display}/>
        </div>
      </div>
  }
}
const mapStateToProps = (state) => {
  const {leftSide} = state;
  const planList = leftSide.planList;

  if(planList.length > 0){
    const startVo = planList[0];
    const endVo = planList[planList.length-1];
    const startCityName = leftSide.startCity.cityName;
    const startTime = startVo.date.format('YYYY-MM-DD');
    const endTime = endVo.date.format('YYYY-MM-DD');
    return {
      carList : state.main.carList,
      startCityName : startCityName,
      startTime,
      endTime,
      splitPlanList : state.main.splitPlanList,
      queryParam : state.main.queryParam,
    }
  }
  return {
    carList : []
  }

}

export default connect(mapStateToProps)(CarList);

/**
 * @description 制定行程
 * @author Kepeng
 */
import React , {Component} from 'react';
// import {Form,Input,Icon,DatePicker} from 'local-Antd';
import { connect } from 'react-redux';
import moment from 'moment';
moment.locale('zh-cn');
import './sass/index.scss';
import WriteTravel from '../write-travel/index.jsx';
import update from 'react-addons-update';
import BookPop from '../bookPop/index.jsx';
import TimePicker from 'components/ui-time-picker/index.jsx';
// import Poi from '../w-poi/index.jsx';
import SearchPlace from 'components/w-searchPlace/index.jsx';
import {changePlanVo,showBookPop} from '../../action/leftSideAction.js';
import ApiConfig from 'widgets/apiConfig/index.js';
import YdjAjax from 'components/ydj-Ajax/index.js';


class MadeTravel extends Component{
    constructor(props,context){
        super(props,context);
        this.formatPlanVo = props.formatPlanVo;
        this.cacheData();
        this.initPlanVo();
    }

    initPlanVo() {
        let planVo = this.formatPlanVo;//拿到格式化之后的行程信息

        //为每日行程增加将要添加的项目（行程内容，代订项）
        planVo.map((item,index)=>{
            let newItem;
            newItem = update(item,{
                /*代订项*/
                bookInfo: {
                    $set: []
                }
            });
            if(item.type == 'daily'){
                newItem = update(newItem,{
                    /*显示填写行程*/
                    showTravel: {
                        $set: false
                    },
                    /*填写行程内容*/
                    travelArr: {
                        $set: ''
                    }

                });
            }

            planVo = update(planVo,{
                    $splice: [[index,1,newItem]]
                });
        })
        // let planLength = planVo.length;

        // let travelDate = {
        //         startDate: planVo[0].date,
        //         endDate: planVo[planLength-1].date,
        //         length: planLength
        //     }
        // this.props.dispatch(getTravelDate(travelDate));
        this.props.dispatch(changePlanVo(planVo));
    }

    showTravel(index) {
        let nextTravel = update(this.props.planVo[index],{
            showTravel : {
                $set : true
            }
        });
        let obj = update(this.props.planVo,{
            $splice : [[index,1,nextTravel]]
        });

        this.props.dispatch(changePlanVo(obj));
    }

    cacheData(props = this.props){
        let {planVo,renderBookPop} = props;
        this.data = {
            planVo : planVo || '',
            renderBookPop: renderBookPop,
            // pageData: pageData || ''
        }
    }

    componentWillReceiveProps(nextProps){
      this.cacheData(nextProps);
      // this.setState({
      //   planVo : nextProps.planVo
      // })
    }

    showBookPop(id,index) {
        let obj = {
            isShow: true,
            id: id,
            index: index,
            isEdit: false
        }
        this.props.dispatch(showBookPop(obj));
    }

    editBookPop(id,index) {
        let obj = {
            isShow: true,
            id: id,
            index: index,
            isEdit: true
        }
        this.props.dispatch(showBookPop(obj));
    }

    delBookItem(id,index) {
      // let toDelObj = this.props.planVo[id][bookInfo][index];

        let newBookInfo = update(this.props.planVo[id],{
            bookInfo: {
                $splice : [[index,1]]
            }

        })
        let obj = update(this.props.planVo,{
            $splice : [[id,1,newBookInfo]]
        });

        this.props.dispatch(changePlanVo(obj));
    }
    /**
       * 上车时间
       * @type {[string]}
       */
    getStartTime(day,time) {
        let lastDay = this.props.planVo.length-1;
        let newTime;
        if(day == lastDay && this.props.planVo[day].dropoffVo){
            newTime = update(this.props.planVo[day],{
                time : {
                    $set : time
                },
                dropoffVo : {
                    time: {
                        $set : time
                    }
                }
            });
        }
        else{
            newTime = update(this.props.planVo[day],{
                time : {
                    $set : time
                }
            });
        }
        
        let obj = update(this.props.planVo,{
            $splice : [[day,1,newTime]]
        });
        this.props.dispatch(changePlanVo(obj));
    }
    /*上车地点*/
    onSelectPlace(day,placeObj){
        console.log(placeObj,day);
        let startObj = update(this.props.planVo[day],{
            startObj : {
                $set : placeObj
            }
        });
        let obj = update(this.props.planVo,{
            $splice : [[day,1,startObj]]
        });
        this.props.dispatch(changePlanVo(obj));
    }

    renderFlightDisc(flightVo){
      if(!flightVo)return null;
      let {pickupVo,dropoffVo,travel} = flightVo;
      if(pickupVo){
        let {type,flightVo} = pickupVo;
        if(type === 0){
          //航班号查询
          return (
            <div>
            <p className="jiesong">
                <span className="blod">{flightVo.flightNo}</span>
                预计
                <span className="blod">{flightVo.arrTime}</span>
                抵达，从
                <span className="yel">{flightVo.arrCityName}-{flightVo.arrAirport}</span>
                出发
            </p>
            {
                travel.priceInfo.additionalServicePrice.pickupSignPrice >=0 ?
                <p className="additional">(含举牌接机服务)</p>:
                <p className="additional">(该机场不支持举牌接机服务)</p>
            }
            </div>
          )
        }else{
          return (
            <div>
            <p className="jiesong"><span className="blod">{pickupVo.time}</span> 从<span  className="yel"> {flightVo.cityName}-{flightVo.airportName} </span>出发</p>
            {
                travel.priceInfo.additionalServicePrice.pickupSignPrice >=0 ?
                <p className="additional">(含举牌接机服务)</p>:
                <p className="additional">(该机场不支持举牌接机服务)</p>
            }
            </div>
          )
        }
      }
      if(dropoffVo){
        let {type,flightVo} = dropoffVo;
        if(travel.time){
           return (
               <div>
                   <div className="form">
                       <span className="times">出发时间</span>
                       <TimePicker
                         defaultTime={travel.time}
                         onCloseTime={this.getStartTime.bind(this,this.props.planVo.length-1)}
                         styleWidth="330px"/>
                   </div>
                   <div className="form">
                       <span className="items">上车地点</span>

                       <SearchPlace
                         cityId={travel.cityId}
                         searchPlaceXHR={ApiConfig.searchPlace}
                         placeVo= {travel.startObj}
                         placeholder='请输入上车地点'
                         onSelectPlace={this.onSelectPlace.bind(this,this.props.planVo.length-1)}
                         />
                   </div>
                   <p className="jiesong">
                       送到<span  className="yel"> {flightVo.cityName}-{flightVo.airportName}</span>
                   </p>
                   {
                       travel.priceInfo.additionalServicePrice.checkInPrice >= 0 ?
                       <p className="additional">(含协助checkin服务)</p>:
                       <p className="additional">(该机场不支持协助checkin服务)</p>
                   }
               </div>
           ) 
        }
        else{
            return(
                <div>
                    <p className="jiesong">
                        送到<span  className="yel"> {flightVo.cityName}-{flightVo.airportName}</span>
                    </p>
                    {
                        travel.priceInfo.additionalServicePrice.checkInPrice >= 0 ?
                        <p className="additional">(含协助checkin服务)</p>:
                        <p className="additional">(该机场不支持协助checkin服务)</p>
                    }
                </div>
            )
        }
      }
    }

    render(){// debugger;
        let planVo = this.data.planVo;
        return (
            <div className="made-travel">
                <div className="made-travel-title">
                    <p>定制包车行程</p>
                </div>
                {
                    planVo.length > 0 && planVo.map((travel,day)=>{
                        return(
                            <div className="travel-days">
                                <div className="date">
                                    <span className="day-box">D{day+1}</span>
                                    <p>{travel.date}</p>
                                </div>
                                <div className="date-content clearfix">
                                    <div className="content-l">
                                        {
                                            (travel.type == 'pickup' || travel.type == 'transfer') ?
                                            <div className="trip-wrap">
                                                <span className="tag">{travel.type == 'pickup' ? '接机' : '送机'}</span>
                                                <div className="days-wrap">
                                                    {
                                                        travel.type == 'pickup' ?
                                                        <div>
                                                            <p>{travel.pickupVo.flightVo.flightNo} <span>预计</span>{moment(travel.pickupVo.date).format('YYYY-MM-DD')} {travel.pickupVo.time}抵达</p>
                                                            <p><i>出发：</i>{travel.pickupVo.flightVo.airportName || travel.pickupVo.flightVo.arrAirport}</p>
                                                            <p className="ari">
                                                                <i>送达：</i>{travel.pickupVo.placeVo.placeName}<br/>
                                                                <small>{travel.pickupVo.placeVo.placeAddress}</small>
                                                            </p>
                                                            {
                                                                travel.priceInfo.additionalServicePrice.pickupSignPrice >=0 ?
                                                                <p className="additional">(含举牌接机服务)</p>:
                                                                <p className="additional">(该机场不支持举牌接机服务)</p>
                                                            }
                                                        </div> :
                                                        <div>
                                                            <p>{moment(travel.dropoffVo.date).format('YYYY-MM-DD')} {travel.dropoffVo.time}用车</p>
                                                            <p className="ari">
                                                                <i>出发：</i>{travel.dropoffVo.placeVo.placeName}<br/>
                                                                <small>{travel.dropoffVo.placeVo.placeAddress}</small>
                                                            </p>
                                                            <p><i>送达：</i>{travel.dropoffVo.flightVo.airportName}</p>
                                                            {
                                                                travel.priceInfo.additionalServicePrice.checkInPrice >=0 ?
                                                                <p className="additional">(含协助checkin服务)</p>:
                                                                <p className="additional">(该机场不支持协助checkin服务)</p>
                                                            }
                                                        </div>
                                                    }

                                                </div>
                                            </div> :
                                            <div>
                                                {
                                                    travel.type == 'none' ?
                                                    <div>
                                                        <p className="travel-item-title">本日无包车</p>
                                                    </div> :
                                                    <div>
                                                        <p className="travel-item-title">{travel.dayDesc}<br/>
                                                            {travel.distanceDesc ? <small>{travel.distanceDesc}</small> : null}
                                                        </p>
                                                        {
                                                            travel.pickupVo || travel.dropoffVo ?
                                                            this.renderFlightDisc({pickupVo:travel.pickupVo,dropoffVo: travel.dropoffVo,travel:travel}):
                                                            <div>

                                                                {
                                                                    travel.time ?
                                                                    <div>
                                                                        <div className="form">
                                                                            <span className="times">出发时间</span>
                                                                            <TimePicker
                                                                              defaultTime={travel.time}
                                                                              onCloseTime={this.getStartTime.bind(this,day)}
                                                                              styleWidth="330px"/>
                                                                        </div>
                                                                        <div className="form">
                                                                            <span className="items">上车地点</span>

                                                                            <SearchPlace
                                                                              cityId={travel.cityId}
                                                                              searchPlaceXHR={ApiConfig.searchPlace}
                                                                              placeVo= {travel.startObj}
                                                                              placeholder='请输入上车地点'
                                                                              onSelectPlace={this.onSelectPlace.bind(this,day)}
                                                                              />
                                                                        </div>
                                                                    </div> : null
                                                                }
                                                            </div>

                                                        }


                                                        {
                                                            travel.showTravel ? <WriteTravel id={day}/> : <button className="fill-btn" onClick={this.showTravel.bind(this,day)}>填写行程</button>
                                                        }
                                                    </div>
                                                }

                                            </div>
                                        }
                                    </div>
                                    {
                                        travel.type != 'none' ?
                                        <div className="content-r">
                                        {
                                            ((travel,day)=>{
                                                if(travel.bookInfo.length>0){
                                                    return(
                                                        <div className="book-wrapper">
                                                            {
                                                                travel.bookInfo.map((item,index)=>{
                                                                    return(
                                                                       <div className="book-item">
                                                                           <span className="tag">{item.itemTag}</span>
                                                                           <p>{item.bookTypeName}，{item.bookItem}，{item.hotelName}，{item.attachmentDemand}
                                                                           {
                                                                            item.bookType == 1 ?
                                                                            <span>，等待报价</span> : null
                                                                           }
                                                                           {
                                                                            item.bookType == 3 ?
                                                                            <span> ，{item.priceSell}{item.priceType}</span> : null
                                                                           }
                                                                           </p>
                                                                           <div className="editor non-icon-wrap">
                                                                           <span><i className='non-icon-edit' onClick={this.editBookPop.bind(this,day,index)}>修改</i></span>
                                                                           <span><i className='non-icon-delete' onClick={this.delBookItem.bind(this,day,index)}>删除</i></span>
                                                                           </div>
                                                                       </div>
                                                                    )
                                                                })
                                                            }
                                                            <p className="add" onClick={this.showBookPop.bind(this,day,null)}>＋ 点击添加</p>
                                                        </div>
                                                    )
                                                }
                                                else{
                                                    return(
                                                        <div className="add-book">
                                                            <p>本日无代订、代付或代办项</p>
                                                            <p className="add-book-jump" onClick={this.showBookPop.bind(this,day,0)}>点击添加？</p>
                                                        </div>
                                                    )
                                                }
                                            })(travel,day)
                                        }
                                        </div> : null
                                    }

                                </div>
                            </div>
                        )
                    })

                }

                {
                    this.data.renderBookPop.isShow ?  <BookPop/> : null
                }
            </div>
        )
    }


}

// export default madeTravel;

const mapStateToProps = (state) => {
    return {
        planVo: state.leftSide.planVo,
        renderBookPop: state.leftSide.renderBookPop,
        // pageData: state.pageData.pageData.splitPlanList,
        formatPlanVo: state.pageData.formatPlanVo,
        totalPrice : state.pageData.totalPrice
    }
}

export default connect(mapStateToProps)(MadeTravel)

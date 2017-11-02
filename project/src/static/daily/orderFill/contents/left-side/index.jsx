import React , {Component} from 'react';
import {Form,Input,Icon,DatePicker} from 'local-Antd';
import { connect } from 'react-redux';
import './sass/index.scss';
import moment from 'moment';
moment.locale('zh-cn');
import MadeTravel from '../made-travel/index.jsx';
import GuestInfo from '../guest-info/index.jsx';
import UploadBox from '../upload-box/index.jsx';
import ApiConfig from 'widgets/apiConfig/index.js';
import update from 'react-addons-update';
import {_getQueryObjJson} from 'local-Utils/dist/main.js';
import YdjAjax from 'components/ydj-Ajax/index.js';
import {getPageData,formatPlanVo,updateTotalPrice,checkFlightSign} from '../../action/pageData.js';
import {updateLoading,showAlert} from '../../action/leftSideAction.js';


class LeftSide extends Component{
    constructor(props,context){
        super(props,context);
        this.cacheData();
    }

    componentWillMount() {
        this.getPageData();
    }

    componentWillReceiveProps(nextProps){
        this.cacheData(nextProps);
    }

    cacheData(props = this.props){
        let {pageData,formatPlanVo} = props;
        let len = formatPlanVo.length;

        this.data = {
            carInfo: pageData.quoteInfo,
            formatPlanVo: formatPlanVo,
            travelTime: {
                startTime: formatPlanVo.length>0 && formatPlanVo[0].date,
                endTime: formatPlanVo.length>0 && formatPlanVo[len-1].date,
                travelDays: len
            }
        }

    }
    errorHanlde(res){
    		let handles = {
    			failedHandle: (res) => {
            this.props.dispatch(updateLoading(false));
    				this.props.dispatch(showAlert(res.message));
    			},
    			errorHandle: (xhr, errorType, error, errorMsg) => {
            this.props.dispatch(updateLoading(false));
    				this.props.dispatch(showAlert(errorMsg));
    			}
    		};
    		return handles;
    }
    getPageData() {
        let key = _getQueryObjJson().key;
        let opt = {
            url: `${ApiConfig.getFill}/${key}`,
            successHandle: (res)=>{
              this.props.dispatch(updateLoading(false))
                let data = JSON.parse(res.data);
                console.log(data);
                this.formatData(data);
            },
            ...this.errorHanlde()
        }
        new YdjAjax(opt)
    }
    /*格式化行程信息*/
    formatData(data){
        let planVoArr = data.splitPlanList;
        let planVo = [];//拿出本页面需要的行程信息;
        let n =0;

        planVoArr && planVoArr.map((item,index)=>{
            let isLast = false;
            item.map((item_2,index_2)=>{// debugger;
                if(item_2.type == 0 || item_2.type == 1){
                    let dailyVo = item_2.dailyVo;
                    let type = dailyVo.type;
                    let cityRoute = dailyVo.startCity.cityRouteScopes.filter((value)=>{
                        return value.routeType == type
                    });
                    let dayDesc = cityRoute[0].routeTitle;
                    if((index_2+1) == item.length){
                        isLast = true;
                    }
                    if(type === 301 && dailyVo.endCity){
                        dayDesc = `${dailyVo.startCity.cityName}-${dailyVo.endCity.cityName},住在${dailyVo.endCity.cityName}`
                    }
                    let serviceTime = dailyVo.time;
                    if(dailyVo.pickupVo){
                        serviceTime = dailyVo.pickupVo.time;
                        if(dailyVo.pickupVo.type == 0){
                            serviceTime = dailyVo.pickupVo.flightVo.arrTime;
                        }

                    }
                    if(dailyVo.dropoffVo){
                        serviceTime = dailyVo.dropoffVo.time
                    }
                    let data = {
                        isLast: isLast,//是否是一单里的最后一天
                        orderIndex: index-n, //属于哪一订单
                        date: moment(item_2.date).format('YYYY-MM-DD'),
                        distanceDesc: dailyVo.distanceDesc,
                        time: index_2 == 0 ? serviceTime: '',
                        cityId: dailyVo.startCity.cityId,
                        cityName: dailyVo.startCity.cityName,
                        cityRoute: cityRoute,
                        routeType : type,
                        dailyIndex : index_2,
                        type: 'daily',
                        pickupVo: dailyVo.pickupVo,
                        dropoffVo: dailyVo.dropoffVo,
                        startCity : dailyVo.startCity,
                        isHalfDay : dailyVo.isHalfDay,
                        endCity : dailyVo.endCity,
                        dayDesc: dayDesc

                    }
                    planVo.push(data);
                    // orderIndex++;
                    return;
                }
                if(item_2.type == 3){
                    let flightVo = item_2.flightVo;
                    if(flightVo.pickupVo){
                        let data = {
                            orderIndex: index-n,
                            date: moment(flightVo.pickupVo.date).format('YYYY-MM-DD'),
                            pickupVo: flightVo.pickupVo,
                            time : flightVo.pickupVo.time,
                            type: 'pickup',
                            cityId: item_2.startCity.cityId,
                            cityName: item_2.startCity.cityName,
                        }
                        if(flightVo.pickupVo.type == 0){
                            data.date = flightVo.pickupVo.flightVo.arrDate;
                            data.pickupVo.date = flightVo.pickupVo.flightVo.arrDate;
                            data.pickupVo.time = flightVo.pickupVo.flightVo.arrTime;
                            data.time = flightVo.pickupVo.flightVo.arrTime;
                        }
                        planVo.push(data);
                    }
                    if(flightVo.dropoffVo){
                        let data = {
                            orderIndex: index-n,
                            date: moment(flightVo.dropoffVo.date).format('YYYY-MM-DD'),
                            time : flightVo.dropoffVo.time,
                            dropoffVo: flightVo.dropoffVo,
                            cityId: item_2.startCity.cityId,
                            type: 'transfer'
                        }
                        planVo.push(data);
                    }
                    // orderIndex++;
                    return;
                }
                // if(item_2.type == 1){} @todo
                if(item_2.type == 2){
                  n ++;
                    let data = {
                        orderIndex: -1,
                        type: 'none',
                        date: moment(item_2.date).format('YYYY-MM-DD')
                    }
                    planVo.push(data);
                    return;
                }

            })
        });
        let allData = this.getAllData(planVo,data.quoteInfo);//加了钱信息的行程
        console.log(allData);
        // this.props.dispatch(formatPlanVo(planVo));
        this.props.dispatch(formatPlanVo(allData));
        this.props.dispatch(getPageData(data));
        this.props.dispatch(updateTotalPrice(data.quoteInfo.priceWithAddition));
    }

    getAllData(planVo,quoteInfo){
      return planVo.map((val,index)=>{
        let {orderIndex} = val;
        let priceInfo = getObjByOrderIndexAndArrIndex(orderIndex,index);
        if(!priceInfo)return val;
        let {mealPrice,emptyOriginPrice,stayPrice,additionalServicePrice} = priceInfo || {};
        if(priceInfo.additionalServicePrice.pickupSignPrice>=0){
            this.props.dispatch(checkFlightSign(true))
        }
        val.priceInfo = update(priceInfo,{
          hasMeal : {
            $set : !mealPrice  ? false : true
          },
          hasEmpty : {
            $set : !emptyOriginPrice ? false : true
          },
          hasStay : {
            $set : !stayPrice ? false : true
          },
          hasCheckin: {
            $set : additionalServicePrice.checkInPrice>=0 ? true : false
          },
          hasPickup: {
            $set : additionalServicePrice.pickupSignPrice>=0 ? true : false
          }
        });
        // console.log(priceInfo)
        // val.priceInfo = priceInfo;
        return val;
      })

      function getNoneOfArr(planVo,quoteInfo){
        let {quotes} = quoteInfo;
        planVo.forEach((val,index)=>{
          if(val.type  === 'none'){
            quotes.splice(index,0,null);
          }
        })
        return quotes
      }

      function getObjByOrderIndexAndArrIndex(orderIndex,index){
        let {quotes} = quoteInfo;
        let res=null;
        quotes.forEach((val,qIndex)=>{
          if(qIndex === orderIndex){
            res = val;
          }
        });
        return res;
      }
    }

    render(){
        let carInfo = this.data.carInfo;
        let formatPlanVo = this.data.formatPlanVo;
        let travelTime = this.data.travelTime;
        return (
            <div className="layout-left">
                <div className="travel">
                    {
                        this.data.carInfo ?
                        <div className="order-title">
                            <p className="car-type">
                                <b>{carInfo.carDesc}</b>
                                <span className="mr"><i className="yellow">{carInfo.capOfPerson}</i>人／<i className="yellow">{carInfo.capOfLuggage}</i>行李</span>
                                <span>参考车型：{carInfo.models}</span>
                            </p>
                            <p className="local">
                                <span>当地时间 {travelTime.startTime} 至  {travelTime.endTime}（共 <i className="yellow">{travelTime.travelDays}</i> 天）</span>
                            </p>
                        </div> : null
                    }


                    {formatPlanVo.length > 0 ? <MadeTravel /> : null}
                    <UploadBox />
                    <GuestInfo />
                </div>
            </div>
        )
    }

}

// export default LeftSide;

function mapStateToProps(state) {
    const {  pageData } = state;
    return {
        pageData: pageData.pageData,
        formatPlanVo: pageData.formatPlanVo,
        isFlightSign: pageData.isFlightSign
    }
}

export default connect(mapStateToProps)(LeftSide)

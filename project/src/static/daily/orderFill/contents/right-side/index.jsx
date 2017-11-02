import React , {Component} from 'react';
import { connect } from 'react-redux';
import {Checkbox,Icon} from 'local-Antd';
import './sass/index.scss';
import update from 'react-addons-update';
import {changePlanVo,updateLoading,showAlert} from '../../action/leftSideAction.js';
import ApiConfig from 'widgets/apiConfig/index.js';
import YdjAjax from 'components/ydj-Ajax/index.js';
import {getDailyParam,getParentParam,getPickupParam,getTransParam} from './util.js';
import Agreement from '../agreement/index.jsx';
import {checkFlightSign} from '../../action/pageData.js';

class RightSide extends Component{
    constructor(props,context){
        super(props,context);
        this.cacheData();
        this.state = {
            showMore: false,
            showAgreement: false
        }
        this.isAgree = true
    }

    componentWillReceiveProps(nextProps){
        this.cacheData(nextProps);
    }

    cacheData(props = this.props){
        //协助项总和，用于显示
        this.attachment = {
            daiding: [],
            daiban: [],
            daifu: []
        }
        //归类订单
        this.orderData = {
            dailyList : [],
            transList : [],
            pickupList : []
        }
        this.planVo = props.planVo;
        this.quoteInfo = props.quoteInfo;
        this.agentInfo = props.header.info && props.header.info.agentInfo;
        //用于提交订单，父单相关信息
        if(props.planVo.length > 0){
            let len = props.planVo.length;
            let last = props.planVo[len-1];
            let endCity = last.endCity ||
            last.startCity ||
            (last.pickupVo && last.pickupVo.flightVo )||
            (last.dropoffVo && last.dropoffVo.flightVo);
            this.serviceObj = {
                serviceCityId: props.planVo[0].cityId,
                serviceCityName: props.planVo[0].cityName,
                totalDays: len,
                serviceTime: `${props.planVo[0].date} ${props.planVo[0].time}:00`,
                serviceEndTime: `${last.date} 23:59:59`,
                serviceEndCityid:endCity.cityId || endCity.arrCityId,
                serviceEndCityname:endCity.cityName || endCity.arrCityName,

            }
        }

        this.canCheck = this.agentInfo && this.agentInfo.industryType == 3 ? false : true; //@todo 记得去掉这行注释，只有云地接渠道可取消增项费用
        this.planVo.map((travel,index)=>{
            if(travel.type == 'daily'){
                this.orderData.dailyList.push(travel);
            }
            if(travel.type == 'pickup'){
                this.orderData.pickupList.push(travel);
            }
            if(travel.type == 'transfer'){
                this.orderData.transList.push(travel);
            }
            travel.bookInfo.length > 0 && travel.bookInfo.map((book,id)=>{
                if(book.bookType == 1){
                    this.attachment.daiding.push(book)
                }
                if(book.bookType == 2){
                    this.attachment.daiban.push(book)
                }
                if(book.bookType == 3){
                    this.attachment.daifu.push(book)
                }
            })
        });
        console.log(this.orderData);
        // console.log(this.attachment);
        this.totalPrice = props.quoteInfo && props.quoteInfo.priceWithAddition;
        // this.priceChannel = props.quoteInfo && props.quoteInfo.priceWithAddition;
        this.nextPlan = (()=>{// debugger;
          let dailyPlan = this.orderData.dailyList || [];
          let res = {};
          dailyPlan.forEach((val,index)=>{
            if(res[val.orderIndex]){
              res[val.orderIndex].push(val)
            }else{
              res[val.orderIndex] = [val];
            }
          });
          let length = 0;
          for(let key in res){
            length++;
          }
        // return Array.prototype.slice.call({...res,length});
        //
        let resArr = [];
        for(let key in res){
            resArr.push(res[key])
        }
        return resArr;
      })();
      console.log(this.nextPlan)
      let toDelPrice = (()=>{
        let res = 0;
        this.nextPlan.map((item) => {
          let iLen = item.length;
          let last = item[iLen-1];
          /*
          hasEmpty
          :
          false
          hasMeal
          :
          true
          hasStay
          :
          false
           */
          if(!last.priceInfo.hasMeal){
            res -= (last.priceInfo.mealPrice || 0);
          }
          if(!last.priceInfo.hasStay){
            res -= (last.priceInfo.stayPrice || 0);
          }
          if(!last.priceInfo.hasPickup){
            res -= (last.priceInfo.additionalServicePrice.pickupSignPrice || 0);
          }
          if(!last.priceInfo.hasCheckin){
            res -= (last.priceInfo.additionalServicePrice.checkInPrice || 0);
          }
        })
        if(this.orderData.pickupList.length > 0 && !this.orderData.pickupList[0].priceInfo.hasPickup){
            res -= (this.orderData.pickupList[0].priceInfo.additionalServicePrice.pickupSignPrice || 0)
        }
        if(this.orderData.transList.length > 0 && !this.orderData.transList[0].priceInfo.hasCheckin){
            res -= (this.orderData.transList[0].priceInfo.additionalServicePrice.checkInPrice || 0)
        }
        return res;
      })();

      this.totalPrice += toDelPrice;
      // this.priceChannel += toDelPrice;
      console.log(props.quoteInfo && props.quoteInfo.priceWithAddition,toDelPrice)
      this.subPrice = props.quoteInfo && (props.quoteInfo.priceWithAddition+toDelPrice);
      console.log(toDelPrice);
    }

    checkBox(index,type,price,travel,e){
        // console.log(index);
        console.log(type);
        console.log(price);
        console.log(`checked = ${e.target.checked}`);
        let planList = this.props.planVo;
        let nextObj = travel;
        let isFlightSign = this.props.isFlightSign;
        if(e.target.checked){
          switch (type) {
            case 'mealPrice':
              nextObj = update(travel,{
                priceInfo : {
                  hasMeal : {
                    $set : true
                  }
                }
              });
              break;
            case 'stayPrice':
                nextObj = update(travel,{
                    priceInfo : {
                        hasStay: {
                            $set: true
                        }
                    }
                });
                break;
            case 'pickupSignPrice':
                nextObj = update(travel,{
                    priceInfo : {
                        hasPickup: {
                            $set: true
                        }
                    }
                });
                isFlightSign = true;
                break;
            case 'checkInPrice':
                nextObj = update(travel,{
                    priceInfo : {
                        hasCheckin: {
                            $set: true
                        }
                    }
                });
                break;
            default:
          }
        }else{
          switch (type) {
            case 'mealPrice':
                nextObj = update(travel,{
                    priceInfo : {
                    hasMeal : {
                        $set : false
                    }
                    }
                });
                break;
            case 'stayPrice':
                nextObj = update(travel,{
                    priceInfo : {
                        hasStay: {
                            $set: false
                        }
                    }
                });
                break;
            case 'pickupSignPrice':
                nextObj = update(travel,{
                    priceInfo : {
                        hasPickup: {
                            $set: false
                        }
                    }
                });
                isFlightSign = false;
                break;
            case 'checkInPrice':
                nextObj = update(travel,{
                    priceInfo : {
                        hasCheckin: {
                            $set: false
                        }
                    }
                });
                break;
            default:
          }
        }

        let nextPlanList = update(planList,{
          $splice : [[index,1,nextObj]]
        });
        console.log(nextPlanList)
        this.props.dispatch(changePlanVo(nextPlanList));
        this.props.dispatch(checkFlightSign(isFlightSign));


    }
    //数组去重
    removeDuplicatedItem(ar) {
        var ret = [];

        for (var i = 0, j = ar.length; i < j; i++) {
            if (ret.indexOf(ar[i]) === -1) {
                ret.push(ar[i]);
            }
        }

        return ret;
    }
    /**
     * 费用相关
     * @return {[type]} [description]
     */
    renderCostDetail() {
        let currencyArr = [];
        this.quoteInfo.quotes.map((val,index)=>{
            let obj = {
                currency : val.currency,
                currencyRate: val.currencyRate
            }
            let arrItem = `${obj.currency}汇率 ${obj.currencyRate}`;
            currencyArr.push(arrItem);
        });
        let currencyArrNew = this.removeDuplicatedItem(currencyArr);
        return(
            <div className="cost-car-detail">
              <p>用车费用小计<span className="price-b">RMB&nbsp;&nbsp;{this.subPrice}</span></p>

              <p>
                {
                    currencyArrNew.map((item,cindex)=>{
                        return(
                           <small>{item}</small>
                        )
                    })
                }
              </p>

              <p className="all">用车费用合计
                <span className="price-r">RMB&nbsp;&nbsp;{this.subPrice}</span>
              </p>
            </div>
        )
    }
    /**
     * 协助项
     * @return {[type]} [description]
     */
    renderAttachment() {
        let daiding = this.attachment.daiding;
        let daiban = this.attachment.daiban;
        let daifu = this.attachment.daifu;
        let res = [];
        if(daiding.length > 0){
            res.push(
                <div>
                    <h6>代订</h6>
                    {daiding.map((item,index)=>{
                        this.totalPrice = '等待报价'
                        return(
                            <p>+{item.bookItem}<span>等待报价</span></p>
                        )
                    })}
                </div>
            )
        }
        if(daiban.length > 0){
            res.push(
                <div>
                    <h6>代办</h6>
                    {daiban.map((item,index)=>{
                        return(
                            <p>+{item.bookItem}<span>RMB 0</span></p>
                        )
                    })}
                </div>
            )
        }
        if(daifu.length > 0){
            res.push(
                <div>
                    <h6>代付</h6>
                    {daifu.map((item,index)=>{
                        let price = Math.ceil(item.priceSell*item.currencyRate);
                        // this.priceChannel = this.priceChannel + price;
                        if(this.totalPrice != '等待报价'){
                            this.totalPrice = this.totalPrice + price;
                        }

                        return(
                            <p>+{item.bookItem}<span>RMB {price}</span></p>
                        )
                    })}
                </div>
            )
        }
        return res;

    }

    handleAgreement() {
        this.setState({
            showAgreement: !this.state.showAgreement
        })
    }

    showMore() {
        this.setState({
            showMore: !this.state.showMore
        })
    }

    isAgreement(e){
        if(!e.target.checked){
            this.isAgree = false
        }
        else{
            this.isAgree = true;
        }
    }
    submit() {
        if(!window.formData){
            this.props.dispatch(showAlert('请填写完整信息'));
            return false;
        }
        if(!this.isAgree){
            this.props.dispatch(showAlert('请同意预订条款！'));
            return false;
        }
        let quoteInfo = this.props.quoteInfo;
        let formData = window.formData;
        let agentInfo = window.__AGENT_INFO;
        let demandInfo = this.props.demandInfo;
        let serviceObj = this.serviceObj;
        let priceChannel = this.subPrice;
        serviceObj.priceChannel = priceChannel;
        let list = update(this.nextPlan,{});
        let flightBrandSign = formData.flightBrandSign;
        let pickupInfo = {
            isFlightSign: this.props.isFlightSign ? 1 : 0,
            flightBrandSign: flightBrandSign
        }
        if(!formData.priceTicket){
            this.props.dispatch(showAlert('请填写票面价'));
            return false;
        }
        if((agentInfo.industryType == 2 || agentInfo.industryType==7) && (formData.priceTicket > 2*priceChannel)){
            if(!confirm(`请确认票面价：￥${formData.priceTicket}，是否继续？`)){
                return false;
            }
        }
        if(agentInfo.industryType == 3 && !formData.thirdTradeNo){
            this.props.dispatch(showAlert('请填写第三方订单号'));
            return false;
        }
        if(!formData.userName){
            this.props.dispatch(showAlert('请填写姓名/旅行社OP'));
            return false;
        }
        if(!formData.userMobile){
            this.props.dispatch(showAlert('请填写OP手机号'));
            return false;
        }
        if(this.props.isFlightSign && !formData.flightBrandSign){
            this.props.dispatch(showAlert('请填写接机牌姓名'));
            return false;
        }

        let dailyList = [],pickupList=getPickupParam(this.orderData.pickupList,flightBrandSign),transList=getTransParam(this.orderData.transList),parent=getParentParam(quoteInfo,formData,agentInfo,demandInfo,serviceObj,pickupInfo);
        list.map((val,index)=>{
          let first = val[0];
          let outerLength = val.length;
          let last = val[outerLength-1];
          if(first.type === 'daily'){
            dailyList.push(getDailyParam(val,first,last,flightBrandSign))
          }
        });
        console.log(dailyList)
        let postData = {
          parent,
          dailyList,
          pickupList : pickupList ? [pickupList] : [],
          transList: transList ? [transList] : []
        }
        this.sendOrder(postData,(res)=>{
          if(res.status === 200){
            window.location.href = `/order/detail?orderNo=${res.data.orderno}`;
          }
        })
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

    sendOrder(data,cb){
      this.props.dispatch(updateLoading(true));
      let opt = {
          url: `${ApiConfig.addDailyOrder}`,
          data : JSON.stringify(data),
          type : 'POST',
          headers : {
            'Content-Type':'application/json'
          },
          successHandle: (res)=>{
              console.log(res);
              cb && cb(res);
          },
          ...this.errorHanlde()
      }
      new YdjAjax(opt)
    }

    getDailyPrice(price,additionPrice,rate) {
        // debugger;
        let newPrice = price;
        if(this.agentInfo.industryType != 7 && this.agentInfo.industryType != 5 && additionPrice){
            newPrice += Math.ceil(additionPrice/rate);
        }
        return newPrice;
    }

    render(){
        return (
        <div className="layout-right">
      	    <div className="cost-details">
      		    <p className="title">费用详情</p>
      		    <div className="travel-detail">
                {
                    this.planVo.map((travel,index)=>{
                        return(
                            <div>
                            {
                                (travel.type == 'pickup' || travel.type == 'transfer') ?
                                <div className={index>2 && !this.state.showMore ? 'detail-item more':'detail-item'}>
                                    <span className="day">D{index+1}</span>
                                    <div className="item-content">
                                        {
                                            travel.type == 'pickup' ?
                                            <p>{travel.pickupVo.flightVo.cityName || travel.pickupVo.flightVo.arrCityName}接机<span>{travel.priceInfo.currency} {this.getDailyPrice(travel.priceInfo.originPrice,travel.priceInfo.additionalServicePrice.pickupSignPrice,travel.priceInfo.currencyRate)}</span></p>:
                                            <p>{travel.dropoffVo.flightVo.cityName}送机<span>{travel.priceInfo.currency} {this.getDailyPrice(travel.priceInfo.originPrice,travel.priceInfo.additionalServicePrice.checkInPrice,travel.priceInfo.currencyRate)}</span></p>
                                        }
                                    </div>
                                    {
                                        (this.agentInfo && (this.agentInfo.industryType == 7 || this.agentInfo.industryType == 5) && travel.priceInfo.additionalServicePrice.pickupSignPrice >=0) ?
                                        <div className="subsidy">
                                            <p>报价城市：{travel.pickupVo.flightVo.cityName}</p>
                                            <div className="subsidy-item">
                                                <Checkbox onChange={this.checkBox.bind(this,index,'pickupSignPrice',travel.priceInfo.additionalServicePrice.pickupSignPrice,travel)} checked={travel.priceInfo.hasPickup}>举牌接机</Checkbox>
                                                <span>RMB{travel.priceInfo.additionalServicePrice.pickupSignPrice}</span>
                                            </div>
                                        </div> : null
                                    }
                                    {
                                        (this.agentInfo && (this.agentInfo.industryType == 7 || this.agentInfo.industryType == 5) && travel.priceInfo.additionalServicePrice.checkInPrice >=0) ?
                                        <div className="subsidy">
                                            <p>报价城市：{travel.dropoffVo.flightVo.cityName}</p>
                                            <div className="subsidy-item">
                                                <Checkbox onChange={this.checkBox.bind(this,index,'checkInPrice',travel.priceInfo.additionalServicePrice.checkInPrice,travel)} checked={travel.priceInfo.hasCheckin}>协助checkin</Checkbox>
                                                <span>RMB{travel.priceInfo.additionalServicePrice.checkInPrice}</span>
                                            </div>
                                        </div> : null
                                    }

                                </div> :
                                <div>
                                    {travel.type == 'daily' ?
                                    <div className={index>2 && !this.state.showMore ? 'detail-item more':'detail-item'}>
                                        <span className="day">D{index+1}</span>
                                        <div className="item-content">
                                            {
                                                travel.pickupVo || travel.dropoffVo ?
                                                <div>
                                                    {
                                                        travel.pickupVo ?
                                                        <div>
                                                            <p>从{travel.pickupVo.flightVo.cityName || travel.pickupVo.flightVo.arrCityName}-{travel.pickupVo.flightVo.airportName || travel.pickupVo.flightVo.arrAirport}出发<span>{travel.priceInfo.currency} {this.getDailyPrice(travel.priceInfo.dayOriginPrices[travel.dailyIndex].dayOriginPrice,travel.priceInfo.additionalServicePrice.pickupSignPrice,travel.priceInfo.currencyRate)}</span></p>
                                                            <p>{travel.dayDesc}</p>
                                                        </div>:
                                                        <div>
                                                            <p>{travel.dayDesc}<span>{travel.priceInfo.currency} {this.getDailyPrice(travel.priceInfo.dayOriginPrices[travel.dailyIndex].dayOriginPrice,travel.priceInfo.additionalServicePrice.checkInPrice,travel.priceInfo.currencyRate)}</span></p>
                                                            <small style={{color:'#6E767D'}}>{travel.distanceDesc}</small>
                                                            <p>送到{travel.dropoffVo.flightVo.cityName}-{travel.dropoffVo.flightVo.airportName}</p>
                                                        </div>

                                                    }

                                                </div> :
                                                <div>
                                                    <p>{travel.dayDesc}<span>{travel.priceInfo.currency} {travel.priceInfo.dayOriginPrices[travel.dailyIndex].dayOriginPrice}</span></p>
                                                    <small style={{color:'#6E767D'}}>{travel.distanceDesc}</small>
                                                </div>

                                            }


                                        </div>
                                        {
                                            travel.isLast  ?
                                            <div className="subsidy">
                                                <p>报价城市：{travel.priceInfo.quoteCityName}</p>
                                                {
                                                    travel.priceInfo.mealPrice ?
                                                    <div className={!this.canCheck?'subsidy-item':'subsidy-item hideCheckbox'}>
                                                        <Checkbox onChange={this.checkBox.bind(this,index,'mealPrice',travel.priceInfo.mealPrice,travel)} checked={travel.priceInfo.hasMeal} disabled={this.canCheck} >司导餐补</Checkbox>
                                                        <span>{travel.priceInfo.mealDays}天，RMB {travel.priceInfo.mealPrice}</span>
                                                    </div> : null
                                                }
                                                {
                                                    travel.priceInfo.stayPrice ?
                                                    <div className={!this.canCheck?'subsidy-item':'subsidy-item hideCheckbox'}>
                                                        <Checkbox onChange={this.checkBox.bind(this,index,'stayPrice',travel.priceInfo.stayPrice,travel)} checked={travel.priceInfo.hasStay} disabled={this.canCheck} >住宿补助</Checkbox>
                                                        <span>{travel.priceInfo.stayDays}晚，RMB {travel.priceInfo.stayPrice}</span>
                                                    </div> : null
                                                }
                                                {
                                                    travel.priceInfo.emptyOriginPrice ?
                                                    <div className="subsidy-item">
                                                        <label className="empty">空驶费</label>
                                                        <span>{travel.priceInfo.currency} {travel.priceInfo.emptyOriginPrice}</span>
                                                    </div> : null
                                                }
                                                {
                                                    travel.priceInfo.additionalServicePrice.pickupSignPrice>=0 && (this.agentInfo.industryType == 7 || this.agentInfo.industryType == 5) ?
                                                    <div className="subsidy-item">
                                                        <Checkbox onChange={this.checkBox.bind(this,index,'pickupSignPrice',travel.priceInfo.additionalServicePrice.pickupSignPrice,travel)} checked={travel.priceInfo.hasPickup}>举牌接机</Checkbox>
                                                        <span>RMB {travel.priceInfo.additionalServicePrice.pickupSignPrice}</span>
                                                    </div> : null
                                                }
                                                {
                                                    travel.priceInfo.additionalServicePrice.checkInPrice>=0 && (this.agentInfo.industryType == 7 || this.agentInfo.industryType == 5) ?
                                                    <div className="subsidy-item">
                                                        <Checkbox onChange={this.checkBox.bind(this,index,'checkInPrice',travel.priceInfo.additionalServicePrice.checkInPrice,travel)} checked={travel.priceInfo.hasCheckin}>协助checkin</Checkbox>
                                                        <span>RMB {travel.priceInfo.additionalServicePrice.checkInPrice}</span>
                                                    </div> : null
                                                }
                                            </div> : null
                                        }

                                    </div>:
                                    <div className={index>2 && !this.state.showMore ? 'detail-item more':'detail-item'}>
                                        <span className="day">D{index+1}</span>
                                        <div className="item-content">
                                            <p>本日未预订用车</p>
                                        </div>
                                    </div>
                                    }
                                </div>

                            }
                            {
                                this.planVo.length > 3 && index == 2 ?
                                <div className="detail-ctrl">
                                    <span onClick={this.showMore.bind(this)}>{this.state.showMore?"收起":"展开"}</span>
                                    <i className={this.state.showMore?'retract':''}></i>
                                </div> : null
                            }
                            </div>

                        )
                    })
                }
      		    </div>
                {this.quoteInfo && this.renderCostDetail()}
                {
                    this.attachment.daiding.length > 0 || this.attachment.daiban.length > 0 || this.attachment.daifu.length > 0 ?
                    <div className="cost-other">
                        {this.renderAttachment()}
                    </div> : null
                }

                <p className="cost-all">订单费用合计<span>{this.totalPrice == '等待报价' ? '等待报价' : `RMB ${this.totalPrice}`}</span></p>
                <p className="cost-help"><Icon type="question-circle-o" style={{ fontSize: 14,marginRight:10, color: '#6E767D;' }} />对订单价格有疑问，<a target={"_blank"} href={"http://wpa.qq.com/msgrd?v=3&uin=3454445010&site=qq&menu=yes"}>联系我们</a></p>
      	    </div>
            <div className="submit">
                  <div className="agree-box">
                    <Checkbox  defaultChecked onChange={this.isAgreement.bind(this)}>同意</Checkbox>
                    <a onClick={this.handleAgreement.bind(this)}>预订条款</a>
                  </div>
                  <button onClick={this.submit.bind(this)}>提交订单</button>
            </div>
            <Agreement  changeHide={this.handleAgreement.bind(this)} show={this.state.showAgreement}/>
        </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        planVo: state.leftSide.planVo,
        quoteInfo: state.pageData.pageData.quoteInfo,
        header: state.header,
        demandInfo: state.leftSide.demandInfo,
        isFlightSign: state.pageData.isFlightSign
    }
}

export default connect(mapStateToProps)(RightSide)

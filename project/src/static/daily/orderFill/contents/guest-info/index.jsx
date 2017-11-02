/**
 * @description 填写客人信息
 * @author Kepeng
 */
import React , {Component} from 'react';
import { connect } from 'react-redux';
import {Checkbox} from 'local-Antd';
import './sass/index.scss';
import WriteTravel from '../write-travel/index.jsx';
import update from 'react-addons-update';
import MInput from 'components/ui-input/index.jsx';
import Marks from 'components/ui-mark/index.jsx';
import PersonNum from '../visitor-message/index.jsx';
// import {fillForm} from '../../action/leftSideAction.js';
import AreaCode from "components/ui-code/index.jsx";

class GuestInfo extends Component{
    constructor(props,context){
        super(props,context);
        this.bookInfo = {
            priceTicket: '',//票面价
            thirdTradeNo: '',//三方订单号
            childNum: '',
            childSeatNum: 0,
            adultNum: 1,
            userName: '',
            userRemark: '',
            userWechat: '',
            userMobile: '',
            areaCode: 86,
            realUserName: '',
            realUserWechat: '',
            realUserMobile: '',
            realAreaCode: 86,
            areacode_1: 86,
            areacode_2: 86,
            usermobile_1: '',
            usermobile_2: '',
            areaCodeName: '中国',
            areaCodeName_1: '中国',
            areaCodeName_2: '中国',
            maxPassenger: '',
            luggageNumber: 0,//最大可携带行李数
            flightBrandSign: ''
        }
        this.state = {
            sync: false, //同步联系人信息
            moreMobile: [] //备用手机号
        }
        this.isFlightSign = props.isFlightSign;
        this.agentInfo = window.__AGENT_INFO;
        this.isOp = true;
        if(this.agentInfo.industryType == 5 || this.agentInfo.industryType == 7){
            this.isOp = false
        }
    }

    componentWillReceiveProps(props){
        this.bookInfo.priceTicket = props.quoteInfo && props.quoteInfo.priceWithAddition || '';
        this.bookInfo.maxPassenger = props.quoteInfo && props.quoteInfo.capOfPerson || '';
        this.bookInfo.luggageNum = props.quoteInfo && props.quoteInfo.capOfLuggage || '';
        this.bookInfo.luggageNumber = props.quoteInfo && (props.quoteInfo.capOfPerson + props.quoteInfo.capOfLuggage)-1;
        this.isFlightSign = props.isFlightSign;
    }

    /**
     * 获取表单数据
     * @return {[type]}      [description]
     */
    getBookInfo(info) {
        if(info.name == 'areaCode' || info.name == 'realAreaCode' || info.name == 'areacode_1' || info.name == 'areacode_2'){
            this.bookInfo[info.name] = info.code.areaCode - 0;
            if(info.name == 'areaCode'){
                this.bookInfo.areaCodeName = info.code.countryName // 获取op手机区号国家名称，用于同步到联系人
            }
            if(info.name == 'areacode_1'){
                this.bookInfo.areaCodeName_1 = info.code.countryName;
            }
            if(info.name == 'areacode_2'){
                this.bookInfo.areaCodeName_2 = info.code.countryName;
            }
        }
        else{
            this.bookInfo[info.name] = info.value;
        }

        window.formData = this.bookInfo //表单数据挂载到window上，避免频繁dispatch
    }
    /**
     * 同步联系人
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    checkBox(e) {
        console.log(`checked = ${e.target.checked}`);
        this.setState({
            sync: e.target.checked
        })
        if(e.target.checked){
            this.bookInfo.realUserName = this.bookInfo.userName;
            this.bookInfo.realUserMobile = this.bookInfo.userMobile;
            this.bookInfo.realUserWechat = this.bookInfo.userWechat;
            this.bookInfo.realAreaCode = this.bookInfo.areaCode;
        }
        else{
            this.bookInfo.realUserName = '';
            this.bookInfo.realUserMobile = '';
            this.bookInfo.realUserWechat = '';
            this.bookInfo.realAreaCode = 86;
        }
    }
    /**
     * 获取乘坐人数
     * @param  {[type]} obj [description]
     * @return {[type]}     [description]
     */
    getUserNum(obj) {
        console.log(obj);
        this.bookInfo.adultNum = obj.adultNum;
        this.bookInfo.childNum = obj.childNum;
        this.bookInfo.childSeatNum = obj.childSeatNum;
        this.bookInfo.luggageNumber = obj.luggageNumber;
        window.formData = this.bookInfo;
        // let updateUser = update(this.props.formData, {
        //     adultNum : {
        //         $set: obj.adultNum
        //     },
        //     childNum: {
        //         $set: obj.childNum
        //     },
        //     childSeatNum: {
        //         $set: obj.childSeatNum
        //     }
        // })
        // this.props.dispatch(fillForm(updateUser));
    }
    /**
     * 添加备用手机号
     */
    addMobile() {
        let mobile = this.state.moreMobile;
        mobile.push('anything');
        this.setState({
            moreMobile: mobile
        })
    }
    /**
     * 删除备用手机号
     * @param  {[type]} index [description]
     * @return {[type]}       [description]
     */
    delMobile(index) {
        let mobile = this.state.moreMobile;
        if(index == 0){
            this.bookInfo.usermobile_1 = this.bookInfo.usermobile_2;
            this.bookInfo.areaCodeName_1 = this.bookInfo.areaCodeName_2;
            this.bookInfo.areacode_1 = this.bookInfo.areacode_2;
            this.bookInfo.usermobile_2 = '';
            this.bookInfo.areaCodeName_2 = '中国';
            this.bookInfo.areacode_2 = 86
        }
        if(index == 1){
            this.bookInfo.usermobile_2 = ''
            this.bookInfo.areaCodeName_2 = '中国'
            this.bookInfo.areacode_2 = 86
        }
        mobile.splice(index,1);
        this.setState({
            moreMobile: mobile
        })
    }

    render(){
        let bookInfo = this.bookInfo;
        return (
            <div className="guest-info">
                <h2>填写客人信息</h2>
                <div className="info-item">
                    <h4 className="info-title">基础信息</h4>
                    <div className="info-content">
                        <div className="form-row">
                            <label className="row-name required">票面价</label>
                            <div className="priceBox">
                                <MInput
                                   className='price-ticket'
                                   name='priceTicket'
                                   sign='票面价'
                                   reg={/^\d+$/}
                                   onHandle={this.getBookInfo.bind(this)}
                                   replaceValue={ bookInfo.priceTicket}
                                />
                                <span className="price-tips">用于显示给客人，建议修改为实付金额</span>
                            </div>
                            
                        </div>
                        <div className="form-row normalInput">
                           <label className={this.agentInfo.industryType == 3 ? 'row-name required' : 'row-name'}>第三方订单号</label> 
                           <MInput
                                className='thirdTradeNo'
                                name='thirdTradeNo'
                                sign='第三方订单号'
                                onHandle={this.getBookInfo.bind(this)}
                                placeholder={'记录您在其它平台的订单号，多个以“，”间隔'}
                           />
                        </div> 
                    </div>
                    <div className="hr"></div>
                </div>
                <div className="info-item">
                    <h4 className="info-title">乘坐人数</h4>
                    <div className="info-content">
                        <PersonNum maxPassenger={bookInfo.maxPassenger} luggageNum={bookInfo.luggageNum} onHandle={this.getUserNum.bind(this)}/>
                    </div>
                    <div className="hr"></div>
                </div>
                <div className="info-item">
                    <h4 className="info-title">联系人信息</h4>
                    <div className="info-content">
                        <div className="form-row normalInput">
                           <label className="row-name required">{this.isOp ? '旅行社OP' : '姓名'}</label> 
                           <MInput
                                className='userName'
                                name='userName'
                                sign={this.isOp ? '旅行社OP' : '姓名'}
                                onHandle={this.getBookInfo.bind(this)}
                                placeholder={this.isOp ? '请填写旅行社OP姓名' : '请填写姓名'}
                           />
                        </div> 
                        <div className="form-row">
                            <label className="row-name required">{this.isOp ? 'OP' : null}手机号</label>
                            <div className="mobile">
                                <AreaCode
                                    name='areaCode'
                                    labelClass='area-code'
                                    onHandle={this.getBookInfo.bind(this)}
                                    />
                                <MInput
                                   className='userMobile'
                                   name='userMobile'
                                   sign='手机号'
                                   reg={/^\d+$/}
                                   onHandle={this.getBookInfo.bind(this)}
                                   placeholder={'手机号'}
                                />
                            </div>
                        </div> 
                        <div className="form-row normalInput">
                           <label className="row-name">微信号</label> 
                           <MInput
                                className='userWechat'
                                name='userWechat'
                                sign='姓名/旅行社OP'
                                onHandle={this.getBookInfo.bind(this)}
                                placeholder={'请填写联系人微信号'}
                           />
                        </div>
                        {
                            this.isFlightSign ?  
                            <div className="form-row normalInput">
                               <label className="row-name required">接机牌姓名</label> 
                               <MInput
                                    className='flightBrandSign'
                                    name='flightBrandSign'
                                    sign='接机牌姓名'
                                    onHandle={this.getBookInfo.bind(this)}
                                    placeholder={'请填写接机牌姓名'}
                               />
                            </div> : null
                        }
                        
                    </div>
                    <div className="hr"></div>
                </div>
                <div className="info-item">
                    <h4 className="info-title">乘车人信息</h4>
                    <div className="info-content">
                        <div className="copyUserInfo">
                            <Checkbox onChange={this.checkBox.bind(this)}>同步获取联系人信息</Checkbox>
                        </div>
                        <div className="form-row normalInput">
                           <label className="row-name">乘车人</label> 
                           <MInput
                                className='realUserName'
                                name='realUserName'
                                sign='乘车人'
                                onHandle={this.getBookInfo.bind(this)}
                                placeholder={'请填写客人姓名'}
                                replaceValue={this.state.sync ? bookInfo.userName : ''}
                           />
                        </div> 
                        <div className="form-row">
                            <label className="row-name">手机号</label>
                            <div className="mobile hasOther">
                                <AreaCode
                                    name='realAreaCode'
                                    labelClass='area-code'
                                    onHandle={this.getBookInfo.bind(this)}
                                    replaceValue={this.state.sync ? `${bookInfo.areaCode}-${bookInfo.areaCodeName}` : '86-中国'}
                                    />
                                <MInput
                                   className='realUserMobile'
                                   name='realUserMobile'
                                   sign='手机号'
                                   reg={/^\d+$/}
                                   onHandle={this.getBookInfo.bind(this)}
                                   placeholder={'手机号'}
                                   replaceValue={this.state.sync ? bookInfo.userMobile : ''}
                                />
                                {
                                    this.state.moreMobile.length < 2 ? <span className="addMobile" onClick={this.addMobile.bind(this)}>+备用手机号</span> : null
                                }
                                
                            </div>
                            <p className="tips">为确保司导联系到客人，请填写可以联系到客人的电话</p>
                        </div> 
                        {
                            (this.state.moreMobile.length > 0) && this.state.moreMobile.map((item,index)=>{
                                return(
                                    <div className="form-row">
                                        <label className="row-name">{`备用手机号${index+1}`}</label>
                                        <div className="mobile hasOther">
                                            <AreaCode
                                                name={`areacode_${index+1}`}
                                                labelClass='area-code'
                                                onHandle={this.getBookInfo.bind(this)}
                                                replaceValue = {`${bookInfo.areacode_1}-${bookInfo.areaCodeName_1}` || '86-中国'}
                                                />
                                            <MInput
                                               className='realUserMobile'
                                               name={`usermobile_${index+1}`}
                                               sign='手机号'
                                               reg={/^\d+$/}
                                               onHandle={this.getBookInfo.bind(this)}
                                               placeholder={'手机号'}
                                               replaceValue={bookInfo.usermobile_1}
                                            />
                                            <span className="addMobile" onClick={this.delMobile.bind(this,index)}>删除</span>
                                        </div>
                                    </div>
                                )
                                 
                            })
                        }
                        
                         
                        <div className="form-row normalInput">
                           <label className="row-name">微信号</label> 
                           <MInput
                                className='realUserWechat'
                                name='realUserWechat'
                                sign='微信号'
                                onHandle={this.getBookInfo.bind(this)}
                                placeholder={'请填写客人微信号'}
                                replaceValue={this.state.sync ? bookInfo.userWechat : ''}
                           />
                           
                        </div>
                        <div className="form-row">
                            <label className="row-name">客人留言</label>
                            <Marks 
                                placeholder='客人留言将发送给司导'
                                onHandle={this.getBookInfo.bind(this)}
                                name='userRemark'
                                max='1000'
                            />
                        </div> 
                    </div>
                </div>
            </div>
        )
    }

}

// export default GuestInfo;
const mapStateToProps = (state) => {
    return {
        quoteInfo: state.pageData.pageData.quoteInfo,
        isFlightSign: state.pageData.isFlightSign
    }
}

export default connect(mapStateToProps)(GuestInfo)

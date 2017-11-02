import React, {Component, PropTypes} from "react";
import { connect } from 'react-redux';
import Marks from 'components/ui-mark/index.jsx';
import {Select,Checkbox, Tabs} from 'local-Antd';
const Option = Select.Option;
const TabPane = Tabs.TabPane;
import MInput from 'components/ui-input/index.jsx';
import DatePicker from 'components/ui-date-picker/indexd.jsx';
import Message from "components/ui-msg/index.jsx";
import CountrySelect from 'components/country-select/index.jsx';
import AreaCode from "components/ui-code/index.jsx";

import ApiConfig from 'widgets/apiConfig/index.js';
import YdjAjax from 'components/ydj-Ajax/index.js';
import Loading from 'components/ui-loading/index.jsx';
import {hidePassengerWin, showAlert, updatePassenger} from '../../action/index.js';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const Assign = (state,obj)=>{
    return Object.assign({},state,obj);
}
import "./sass/index.scss";
class WritePlane extends Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            canSubmit: false,
        };
        this.data = {
            formData: {}
        };
        this.def = {
            gender: 1,
            certificateType: 0,
            countryId: 68,
            issuePlaceId: 68,
            areaCode: 86,
        };
    }

    componentWillMount() {
        if(this.props.airWin.curPassengerInfo && this.props.airWin.curPassengerInfo.passengers){
            let cpi =  this.props.airWin.curPassengerInfo;
            this.getPassengerInfo(cpi);
        }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.airWin.curPassengerInfo && nextProps.airWin.curPassengerInfo.passengers) {
            let cpi =  nextProps.airWin.curPassengerInfo;
            this.getPassengerInfo(cpi);
        }
    }

    getPassengerInfo(data) {
        console.log(data);
        let flag = false;
        let num = data.ticketNum;
        let formData = {
            orderNo: data.orderNo,
            passengers: data.passengers,
        };
        debugger
        flag = this.checkFormData(formData, num);
        if(flag) {
            this.data.formData = formData;
        }
        this.setState({
            canSubmit: flag
        })
    }

    checkFormData(data, num, source){
        let flag = true;
        let passengers = null;
        data = data || this.data.formData;
        num = num || this.props.airWin.curPassengerInfo.ticketNum;
        if(!data || !data.passengers) {
            return false;
        }
        passengers = data.passengers;

        if(!passengers.length || passengers.length < num) {
            return false;
        }


        passengers.map((item, index)=>{
            let passenger = item;

            if(!item.birthday) {
                flag = false;
            }
            if(!item.certificateNo) {
                flag = false;

            }
            if(!/^\d+$/.test(`${item.certificateType}`)) {
                flag = false;

            }
            if(!/^\d+$/.test(`${item.countryId}`)) {
                flag = false;

            }
            if(!item.expireDate) {
                flag = false;

            }
            if(!/^\d+$/.test(`${item.gender}`)) {
                flag = false;

            }
            if(!/^\d+$/.test(`${item.issuePlaceId}`)) {
                flag = false;

            }
            if(!item.firstName) {
                flag = false;

            }
            if(!item.lastName) {
                flag = false;

            }

            if(!/^\d{3,}$/.test(`${item.mobile}`)) {
                flag = false;

            }
            if(!item.areaCode) {
                flag = false;
            }

        });
        return flag;
    }

    formatData(data){
        let cpi,d,ticketNum,len;
        if(data) {
            cpi = data;
        } else {
            cpi = this.props.airWin.curPassengerInfo;
        }
        d = cpi.passengers ? cpi.passengers : [];
        ticketNum = cpi.ticketNum;
        len = d.length;
        if(len < ticketNum) {
            // 实际数据比房间数量小, 进行数据填充
            for(let i = 0; i < ticketNum - len; i++) {
                d.push({});
            }
        }
        this.data.formData.passengers = d;
        return d;
    }

    getFormData() {
        // let flag = true;
        // if(!this.data.formData || !this.data.formData.passengers) {
        //     flag = false;
        // }
        let flag = this.checkFormData()

        let data = this.data.formData;
        return (flag? data : false);
    }

    errorHanlde(res){
        let handles = {
            failedHandle: (res) => {
                this.setState({loading: false}, ()=>{
                    this.props.dispatch(showAlert(res.message));
                });
            },
            errorHandle: (xhr, errorType, error, errorMsg) => {
                this.setState({loading: false}, ()=>{
                    this.props.dispatch(showAlert(errorMsg));
                });
            }
        };
        return handles;
    }


    save() {
        let that = this;
        let queryData = this.getFormData();

        if(!queryData) {
            return;
        }

        this.setState({
            loading: true
        })
        let opt = {
            url: ApiConfig.updateAirPassenger,
            type: 'POST',
            headers : {
              'Content-Type':'application/json'
            },
            data: JSON.stringify(queryData),
            successHandle: (res)=>{
                this.setState({
                    loading: false
                });
                let orderNo = this.props.airWin.curPassengerInfo.orderNo;
                debugger
                // 修改成功，更新列表信息、
                let data = res.data;

                if(!data || !data.passengers) {
                    // 未更新
                    this.props.dispatch(hidePassengerWin());
                    return;
                }

                this.props.dispatch(hidePassengerWin());
                this.props.dispatch(updatePassenger(data));
            },
            ...this.errorHanlde()
        }
        new YdjAjax(opt)
    }

    handle(type) {

        if(type == 'confirm' || type == 'ok'){
            this.save();
        }else{
            this.props.dispatch(hidePassengerWin());
        }
    }

    changeTab() {

    }

    changeForm(type, index, data, Info) {
        if (!this.data.formData || this.data.formData.orderNo != this.props.airWin.curPassengerInfo.orderNo) {
            // 清理上一次数据
            this.data.formData = {
                orderNo: this.props.airWin.curPassengerInfo.orderNo,
                passengers: this.props.airWin.curPassengerInfo.passengers || []
            };
        }

        let passenger = this.data.formData.passengers.length > index ? this.data.formData.passengers[index]: null ;
        debugger
        if(!passenger) {
            this.data.formData.passengers.push({});
            passenger = this.data.formData.passengers[index];
        }

        if(!passenger.birthday) {
            passenger.birthday = this.def.birthday;
        }
        if(!passenger.expireDate){
            passenger.expireDate = this.def.expireDate;
        }

        if(!passenger.certificateType) {
            passenger.certificateType = this.def.certificateType;
        }
        if(!passenger.gender){
            passenger.gender = this.def.gender;
        }

        if(!passenger.countryId){
            passenger.countryId = this.def.countryId;
        }

        if(!passenger.issuePlaceId){
            passenger.issuePlaceId = this.def.issuePlaceId;
        }
        if(!passenger.areaCode){
            passenger.areaCode = this.def.areaCode;
        }


        switch(type) {
            case 'lastName':
                if(!data.error) {
                    passenger.lastName = data.value;
                } else {
                    passenger.lastName = '';
                }
                break;
            case 'firstName':
                if(!data.error) {
                    passenger.firstName = data.value;
                } else {
                    passenger.firstName = '';
                }
                break;

            case 'certificateNo':
                if(!data.error) {
                    passenger.certificateNo = data.value;
                } else {
                    passenger.certificateNo = '';
                }
                break;

            case 'userRemark':
                passenger.userRemark = data.value;
                break;

            case 'birthday':
                passenger.birthday = data.format("YYYYMMDD");
                break;

            case 'expireDate':
                passenger.expireDate = data.format("YYYYMMDD");
                break;

            case 'certificateType':
                passenger.certificateType = data;
                break;

            case 'countryId':
                passenger.countryId = Info.countryId;
                break;

            case 'issuePlaceId':
                passenger.issuePlaceId = data;
                break;

            case 'gender':
                passenger.gender = data;
                break;

            case 'areaCode':
                if(!data.error) {
                    passenger.areaCode = data.code.areaCode;
                } else {
                    passenger.areaCode = this.def.areaCode;
                }
                break;

            case 'mobile':
                if(!data.error) {
                    passenger.mobile = data.value;
                } else {
                    passenger.mobile = '';
                }
                break;
        }
        let flag = this.checkFormData();
        this.setState({
            canSubmit: flag
        })
    }

    getDefaultDate() {
        let now = moment();
        let start = moment().add(10, 'days');
        this.def.expireDate = start.format('YYYY-MM-DD');
        return start;
    }
    getDefaultBirthday() {
        let now = moment();
        let start = moment().add(-20 * 365, 'days');
        this.def.birthday = start.format('YYYY-MM-DD');
        return start;
    }

    getTabName(index) {
        return '乘机人' + ((index + 1) < 10 ? '0'+(index + 1) : index + 1)
    }

    render() {
        console.log('render WritePlane')
        let _title = '填写乘机人信息';
        let _txt = '保存';
        let data =  this.props.airWin.curPassengerInfo;
        let canEdit =  data ? data.canEdit : true;
        let passengers = data ? this.formatData() : null;
        return(
            <div>
                {
                    this.props.airWin.isShow ?
                    <Message
                        initData={{
                            title: _title,
                            showType: canEdit ? 'confirm': 'info', // 查看时没有修改按钮
                            okText: _txt,
                            asyn: true,
                            showFlag: true,
                            disabled: this.state.canSubmit,
                            backHandle: this.handle.bind(this)
                        }}
                        uiClassName="writePlane"
                    >
                    <Tabs className="detail-tab" defaultActiveKey="1" onChange={this.changeTab.bind(this)}>
                        {
                            passengers.map((item, index)=>{

                                return (
                                    <TabPane tab={this.getTabName(index)} key={index + 1}>
                                        <div className="content">
                                            <div className="cont-inner">
                                                <div className="form-row">
                                                    <div className="left">
                                                        <label className="row-name">乘机人：<span className="red-xing">*</span></label>
                                                        <span className="input-box">
                                                        <span className="name-input xing">
                                                            <MInput
                                                                className='xing'
                                                                name='xing'
                                                                value={item.lastName}
                                                                onHandle={this.changeForm.bind(this, 'lastName', index)}
                                                                reg={/^[^\s]+$/}
                                                                sign={'姓（拼音）'}
                                                                placeholder={'姓（拼音）'}/>
                                                        </span>
                                                        <span className="name-input ming">
                                                            <MInput
                                                                className='ming'
                                                                name='ming'
                                                                value={item.firstName}
                                                                onHandle={this.changeForm.bind(this, 'firstName', index)}
                                                                reg={/^[^\s]+$/}
                                                                sign={'名（拼音）'}
                                                                placeholder={'名（拼音）'}/>
                                                        </span>
                                                    </span>
                                                    </div>
                                                    <div className="right">
                                                        <label className="row-name">性别：<span className="red-xing">*</span></label>
                                                        <span className="sex-select">
                                                        <Select
                                                            defaultValue={1}
                                                            value={item.gender || 1}
                                                            onChange = {this.changeForm.bind(this, 'gender', index)}
                                                            placeholder = "男"
                                                            style={{color: '#0E1A27',width:'100%'}}>
                                                            <Option value={1}>男</Option>
                                                            <Option value={2}>女</Option>
                                                        </Select>
                                                    </span>
                                                    </div>
                                                </div>
                                                <div className="form-row">
                                                    <div className="left">
                                                        <label className="row-name">出生日期：<span className="red-xing">*</span></label>
                                                        <span className="input-box ri-qi">
                                                        <DatePicker
                                                            defaultValue ={this.getDefaultBirthday()}
                                                            disabledDate={{'type': 'before', 'day': 1}}
                                                            onHandle={this.changeForm.bind(this, 'birthday', index)}
                                                            placeholder = '出生日期'/>
                                                    </span>
                                                    </div>
                                                    <div className="right">
                                                        <label className="row-name">国籍：<span className="red-xing">*</span></label>
                                                        <span className="zheng-jian">
                                                            <CountrySelect label={false} selectCountry={this.changeForm.bind(this, 'countryId', index)}/>
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="form-row">
                                                    <div className="left">
                                                        <label className="row-name">证件类型：<span className="red-xing">*</span></label>
                                                            <span className="zheng-jian">
                                                        <Select
                                                            defaultValue={0}
                                                            value={item.certificateType!=undefined ? item.certificateType : 0}
                                                            onChange={this.changeForm.bind(this, 'certificateType', index)}
                                                            placeholder = "护照"
                                                            style={{color: '#0E1A27',width:'100%'}}>
                                                            <Option value={0}>护照</Option>
                                                            <Option value={1}>身份证</Option>
                                                            <Option value={2}>港澳通行证</Option>
                                                            <Option value={3}>台湾通行证</Option>
                                                            <Option value={4}>永久居留证</Option>
                                                            <Option value={5}>台胞证</Option>
                                                            <Option value={6}>回乡证</Option>
                                                        </Select>
                                                        </span>
                                                    </div>
                                                    <div className="right">
                                                        <label className="row-name">证件签发地：<span className="red-xing">*</span></label>
                                                        <span className="zheng-jian">
                                                            <CountrySelect label={false} selectCountry={this.changeForm.bind(this, 'issuePlaceId', index)}/>
                                                        </span>
                                                    </div>
                                                    <div className="leixing-tips">
                                                        <span>
                                                            * 请检查证件必须含有至少3页空白页，且有效期距旅行出发日期必须大于6个月
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="form-row">
                                                    <div className="left">
                                                        <label className="row-name">证件号码：<span className="red-xing">*</span></label>
                                                        <span className="input-box">
                                                        <MInput
                                                            className='zhengjian'
                                                            name='zhengjian'
                                                            value={item.certificateNo}
                                                            onHandle={this.changeForm.bind(this, 'certificateNo', index)}
                                                            reg={/^[A-Za-z0-9]{3,}$/}
                                                            sign={'证件号码'}
                                                            placeholder={'请填写证件号码'}/>
                                                    </span>

                                                    </div>
                                                    <div className="right">
                                                        <label className="row-name">有效日期：<span className="red-xing">*</span></label>
                                                        <span className="input-box ri-qi">
                                                        <DatePicker
                                                            defaultValue ={this.getDefaultDate()}
                                                            disabledDate={{'type': 'since', 'day': 10}}
                                                            onHandle={this.changeForm.bind(this, 'expireDate', index)}
                                                            placeholder = '证件有限日期'/>
                                                    </span>
                                                    </div>
                                                </div>
                                                <div className="form-row">
                                                    <div className="left">
                                                        <label className="row-name">手机号码：<span className="red-xing">*</span></label>
                                                        <span className="input-box mobile">
                                                            {
                                                                <AreaCode
                                                                labelClass='ui-input margin'
                                                                onHandle={this.changeForm.bind(this, 'areaCode', index)}
                                                                value={item.areaCode}
                                                                />
                                                            }
                                                            {
                                                                <MInput
                                                                className='price'
                                                                name='linkphone'
                                                                sign='手机号'
                                                                reg={/^\d{3,}$/}
                                                                onHandle={this.changeForm.bind(this, 'mobile', index)}
                                                                placeholder='手机号'
                                                                value={item.mobile}
                                                                />
                                                            }
                                                        </span>
                                                    </div>
                                                    <div className="right"></div>
                                                </div>
                                                 <div className="form-row">
                                                    <label className="row-name">备注：</label>
                                                    <div className="liu-yan">
                                                        <Marks
                                                            value={item.userRemark}
                                                            onHandle={this.changeForm.bind(this, 'userRemark', 0)}
                                                            placeholder={''}
                                                            name='userRemark'
                                                            max='500'
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </TabPane>
                                )
                            })
                        }

                    </Tabs>
                    {/*<Checkbox>将乘机人信息同步至所有机票订单</Checkbox>*/}
                    </Message> : null
                }
                {
                    this.state.loading ? <Loading/> : null
                }
            </div>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        airWin: state.air,
        routeNo: state.main.routeNo,
    }
}

export default connect(mapStateToProps)(WritePlane);

import React, {Component, PropTypes} from "react";
import {connect} from 'react-redux';
import Marks from 'components/ui-mark/index.jsx';
import {Checkbox} from 'local-Antd';
import Message from "components/ui-msg/index.jsx";
import House from 'components/ui-house/index.jsx';
import ApiConfig from 'widgets/apiConfig/index.js';
import YdjAjax from 'components/ydj-Ajax/index.js';
import Loading from 'components/ui-loading/index.jsx';

import {hideGuestWin, showAlert, updateHotelGuest} from '../../action/index.js';


const Assign = (state, obj) => {
    return Object.assign({}, state, obj);
}
import "./sass/index.scss";

class WriteHotel extends Component {

    constructor(props, context) {
        super(props, context);
        
        this.state = {
            canSubmit: false,
        };
        this.data = {};
    }

    componentWillMount() {
        if(this.props.hotelWin.curRoomInfo && this.props.hotelWin.curRoomInfo.userInfo){
            this.getRoomGuestInfo(this.props.hotelWin.curRoomInfo.userInfo, this.props.hotelWin.curRoomInfo.numOfRooms, true);
        }
    }

    componentWillReceiveProps(nextProps) {
        
        if(nextProps.hotelWin.curRoomInfo && nextProps.hotelWin.curRoomInfo.userInfo) {
            this.getRoomGuestInfo(nextProps.hotelWin.curRoomInfo.userInfo, nextProps.hotelWin.curRoomInfo.numOfRooms, true);
        }
    }

    getRoomGuestInfo(data, num, source) {
        
        console.log(data);
        let flag = false;
        num = num || this.props.hotelWin.curRoomInfo.numOfRooms;
        if(source === true) {
            flag = this.checkSourceData(data, num);
            if(flag) {
                this.data.formData = data.roomGuestList;
            }

        } else {
            
            flag = this.checkFormData(data, num);
            if(flag) {
                this.data.formData = this.formatData(data);
            }
        }
        this.setState({
            canSubmit: flag
        })
    }

    formatData(data) {
        let result = [];
        if(data && data.length) {
            data.map((item, index)=>{
                let room = item;
                let roomNum = item.room + 1;
                let guests = item.guest || [];
                let guestList = [];
                guests.map((guest, gIndex)=>{
                    let g = {
                        'firstName': guest.names.value,
                        'lastName': guest.fames.value,
                    }
                    guestList.push(g);
                })
                result.push({
                    'roomNum': roomNum,
                    'guestList': guestList,
                })
            });
        }
        return result;
    }

    checkSourceData(data, num) {
        num = num || this.props.hotelWin.curRoomInfo.numOfRooms;
        
        let flag = true; 
        let reg = /^[a-zA-Z]+$/;
        if(!data.roomGuestList || !data.roomGuestList.length || data.roomGuestList.length < num) {
            return false;
        }

        data && data.roomGuestList && data.roomGuestList.map((item, index)=>{
            let room = item;
            let guests = item.guestList || [];
            guests.map((guest, gIndex)=>{
                flag = flag && ((reg.test(guest.firstName) && reg.test(guest.lastName)) ? true : false);
            });

        });
        return flag;
    }

    checkFormData(data, num) {
        
        num = num || this.props.hotelWin.curRoomInfo.numOfRooms;
        let flag = true;
        if(!data.length || data.length < num) {
            return false;
        }
        data && data.map((item, index)=>{
            let room = item;
            
            let guests = item.guest || item.guestList || [];
            if(!guests.length) {
                flag = false;
            } else {
                
                guests.map((guest, gIndex)=>{
                    flag = (flag && ((guest.fames.error == true || guest.names.error == true) ? false : true));
                });
            }
        });
        return flag;
    }

    getFormData() {
        let flag = true;
        if(!this.data.formData || !this.data.formData.length) {
            flag = false;
        }
        
        let data = {
            routeNo: this.props.routeNo,
            userInfo: {
                customerRequest: this.data.remark, // 预订须知
                roomGuestList: this.data.formData,
            }
        };
        
        if(!this.sync) {
            data.orderNo = this.props.hotelWin.curRoomInfo.orderNo;
        }
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
            url: ApiConfig.updateHotelGuest,
            type: 'POST',
            headers : {
              'Content-Type':'application/json'
            },
            data: JSON.stringify(queryData),
            successHandle: (res)=>{
                this.setState({
                    loading: false
                });
                let orderNo = this.props.hotelWin.curRoomInfo.orderNo;
                
                // 修改成功，更新列表信息、
                let data = res.data;
                if(!data || !data.length) {
                    // 未更新
                    return;
                }
                this.props.dispatch(hideGuestWin());
                this.props.dispatch(updateHotelGuest(data));
            },
            ...this.errorHanlde()
        }
        new YdjAjax(opt)
    }
    checkBox(e) {
        console.log(`checked = ${e.target.checked}`);
        this.sync = e.target.checked;
    }

    handle(type) {
        
        if(type == 'confirm' || type == 'ok'){
            this.save();
        }else{
            this.props.dispatch(hideGuestWin());
        }
    }

    formatHouseData(){
        
        let d = this.props.hotelWin.curRoomInfo.userInfo.roomGuestList || [];
        let roomNum = this.props.hotelWin.curRoomInfo.numOfRooms;
        let len = d.length;
        if(len < roomNum) {
            // 数据错误，实际数据比房间数量小, 进行数据填充
            for(let i = 0; i < roomNum - len; i++) {
                d.push({guestList: [{firstName: '', lastName: '', roomNum: len + i}]});
            }
        }
        
        return d;
    }

    changeRemark(ele) {
        let value = ele.value;
        this.data.remark = value;
    }


    render() {
        console.log('write HOTEL');
        let _title = '填写入住人信息';
        let _txt = '保存';
        let hotelWin =  this.props.hotelWin;
        let data =  hotelWin.curRoomInfo;
        let canEdit =  data ? data.canEdit : true;
        let roomGuestList =  (data && data.userInfo && data.userInfo.roomGuestList) || false;
        return (
            <div>
                {
                    this.props.hotelWin.isShow ?
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
                        uiClassName="writeHotel"
                    >
                        <div className="content">
                            <div className="cont-inner">
                                <div className="form-row">
                                    <label className="row-name">客人国籍</label>
                                    <span className="guoji">{data.guestNationalityName}</span>
                                    <div className="ruzhu-tips">* 必须为成年人才可正常办理入住</div>
                                </div>

                                <House
                                    number={data.numOfRooms}
                                    onHandle={this.getRoomGuestInfo.bind(this)}
                                    data={this.formatHouseData()}
                                    max={data.adultNum}>
                                >
                                </House>
                                <div className="form-row">
                                    <label className="row-name">入住说明</label>
                                    <p className="ruzhu-msg">
                                        1. 客人国籍：如实际入住人与订单国籍不符，可能导致无法入住。<br/>
                                        2. 入住人数：每间房间价格仅适用于<span>{data.adultNum}成人 {data.childNum || 0}儿童</span>
                                        （根据实际下单人数得出），如果实际入住人数与订单不符，需客人与酒店前台协商解决。<br/>
                                        3. 入住人姓名：请务必按照实际入住人证件上的英文/拼音姓名填写。<br/>
                                        4. 主入住人：办理入住时，酒店以此姓名进行预订查询，如填写错误酒店查无预订会导致客人无法入住。<br/>
                                        5. 其他入住人：其他入住人姓名仅在入住凭证上展示，不能独自到酒店办理入住 <br/>
                                    </p>
                                </div>
                                <div className="form-row">
                                    <label className="row-name">特殊需求</label>
                                    <div className="liu-yan">
                                        <Marks
                                            placeholder={'要求会发送到酒店，但无法保证一定满足，实际以酒店当天安排为准。请使用英文填写'}
                                            name='userRemark'
                                            max='500'
                                            onHandle={this.changeRemark.bind(this)}
                                            value={data.userInfo.customerRequest}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        { 
                            canEdit && (data && data.numOfOrders && data.numOfOrders > 1) ?
                            <Checkbox onChange={this.checkBox.bind(this)}>将入住人信息同步至所有酒店订单</Checkbox>: <div className="blank"></div>
                        }
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
        hotelWin: state.hotel,
        routeNo: state.main.routeNo,
    }
}

export default connect(mapStateToProps)(WriteHotel);



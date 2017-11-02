import React, {Component, PropTypes} from "react";
import { connect } from 'react-redux';
import Marks from 'components/ui-mark/index.jsx';
import {Checkbox} from 'local-Antd';
import MInput from 'components/ui-input/index.jsx';
import AreaCode from "components/ui-code/index.jsx";
import update from 'react-addons-update';
import Message from "components/ui-msg/index.jsx";
import ApiConfig from 'widgets/apiConfig/index.js';
import YdjAjax from 'components/ydj-Ajax/index.js';
import {showCarModel,updateCar,showAlert} from '../../action/index.js';
const Assign = (state,obj)=>{
    return Object.assign({},state,obj);
}
import "./sass/index.scss";
class WriteCar extends Component {

    constructor(props, context) {
        super(props, context);
        let userInfo = props.car[props.carModel.index].userInfo;
        this.data = {
            userInfo: props.car[props.carModel.index].userInfo
            // userinfo: props.car[0].userinfo
        };
        this.state = {
            sync: true, //同步信息
            moreMobile : userInfo.mobile2 ? true : false //备用手机号
        };
        this.formData = {
            areaCode: userInfo.areaCode || 86,
            mobile: userInfo.mobile,
            name: userInfo.name,
            wechatNo: userInfo.wechatNo,
            areacode2: userInfo.areacode2 || 86,
            mobile2: userInfo.mobile2,
            userRemark: userInfo.userRemark,
            // areaCodeName: userInfo.areaCodeName || '中国',
            // areaCodeName2: userInfo.areaCodeName2 || '中国'
        };
    }
    /**
     * 添加备用手机号
     */
    addMobile() {
        this.setState({
            moreMobile: true
        })
    }
    /**
     * 删除备用手机号
     */
    delMobile() {
        this.formData.areacode2 = '';
        this.formData.mobile2 = '';
        this.setState({
            moreMobile: false
        })
    }

    getFormData(info) {
        if(info.name =='areaCode' || info.name =='areacode2'){
            this.formData[info.name] = info.code.areaCode - 0;
            // if(info.name == 'areaCode'){
            //     this.formData.areaCodeName = info.code.countryName // 获取手机区号国家名称，用于默认显示
            // }
            // if(info.name == 'areacode2'){
            //     this.formData.areaCodeName2 = info.code.countryName // 获取备用手机区号国家名称，用于默认显示
            // }
        }
        else {
            this.formData[info.name] = info.value;
        }
	}

    checkBox(e) {
        console.log(`checked = ${e.target.checked}`);
        this.setState({
            sync: e.target.checked
        })
    }

    backHandle(type) {
        if(type == 'confirm' || type == 'ok'){
            if(!this.formData.mobile2){
                delete this.formData.areacode2;
            }
            this.gotoAdd();
		}else{
            let obj = {
                show: false,
                index: ''
            }
            this.props.dispatch(showCarModel(obj));
		}
    }
    /*提交*/
    gotoAdd() {
        let newUserInfo,newCarInfo=this.props.car;
        let index = this.props.carModel.index;
        let datas = {
            routeNo: this.props.car[index].orderNoParent,
            userInfo: [
                {
                    areaCode: this.formData.areaCode,
                    mobile: this.formData.mobile,
                    // areaCodeName: this.formData.areaCodeName,
                    name: this.formData.name,
                    wechatNo: this.formData.wechatNo
                }
            ],
            // name: this.formData.name,
            // wechatNo: this.formData.wechatNo,
            // mobile: this.formData.mobile,
            // areaCode: this.formData.areaCode,
            userRemark: this.formData.userRemark
        };
        this.formData.areacode2 && (datas.userInfo[0].areacode2 = this.formData.areacode2);
        // this.formData.areacode2 && (datas.userInfo[0].areaCodeName2 = this.formData.areaCodeName2);
        this.formData.mobile2 && (datas.userInfo[0].mobile2 = this.formData.mobile2);
        !this.state.sync && (datas.orderNo = this.props.car[index].orderNo);
        let opt = {
            url: ApiConfig.updateCarUser,
            type: 'POST',
            headers : {
              'Content-Type':'application/json'
            },
            data: JSON.stringify(datas),
            successHandle: (res)=>{
                if(!this.state.sync){
                    newUserInfo = update(this.props.car[index],{
                        userInfo : {
                            $set: this.formData
                        }
                    });
                    newCarInfo = update(this.props.car,{
                        $splice: [[index,1,newUserInfo]]
                    })
                    this.props.dispatch(updateCar(newCarInfo));
                }
                else {
                    newCarInfo.map((item,i)=>{
                        newUserInfo = update(item,{
                            userInfo: {
                                $set: this.formData
                            }
                        });
                        newCarInfo = update(newCarInfo,{
                            $splice: [[i,1,newUserInfo]]
                        })
                    })
                    this.props.dispatch(updateCar(newCarInfo));
                }
                let obj = {
                    show: false,
                    index: ''
                }
                this.props.dispatch(showCarModel(obj));
            },
            ...this.errorHanlde()
        }

        new YdjAjax(opt)
    }
    /*错误处理*/
    errorHanlde(res){
		let handles = {
			failedHandle: (res) => {
				this.props.dispatch(showAlert(res.message));
			},
			errorHandle: (xhr, errorType, error, errorMsg) => {
				this.props.dispatch(showAlert(errorMsg));
			}
		};
		return handles;
    }

    render() {
        let carData = this.props.car;
        let carId = this.props.carModel.index;
        return(
            <div>
                {
                    <Message
                        initData={{
                            title : '填写用车信息',
                            showType : 'confirm',
                            okText : '保存',
                            asyn : true,
                            showFlag : true,
                            disabled: true,
                            backHandle :this.backHandle.bind(this)
                        }}
                        uiClassName = "writeCar"
                    >
                        <div className="content">
                            <div className="cont-inner">
                                <div className="form-row">
                                    <div className="left">
                                        <label className="row-name">乘车人</label>
                                        <MInput
                                            className='car-man'
                                            name='name'
                                            onHandle={this.getFormData.bind(this)}
                                            value={this.formData.name}
                                            placeholder={'请填写客人姓名'}/>
                                    </div>
                                    <div className="right">
                                        <label className="row-name">微信号</label>
                                        <MInput
                                            className='wei-xin'
                                            name='wechatNo'
                                            onHandle={this.getFormData.bind(this)}
                                            value={this.formData.wechatNo}
                                            placeholder={'请填写客人微信号'}/>
                                    </div>
                                </div>
                                <div className="form-row phone-num">
                                    <div className="left">
                                        <label className="row-name">手机号</label>
                                        <div className="mobile hasOther">
                                            <div className="quhao">
                                                <AreaCode
                                                    name='areaCode'
                                                    labelClass='area-code'
                                                    value={this.formData.areaCode}
                                                    onHandle={this.getFormData.bind(this)}
                                                />
                                            </div>
                                            <div className="phone-number">
                                                <MInput
                                                    className='mobile'
                                                    name='mobile'
                                                    sign='手机号'
                                                    reg={/^\d+$/}
                                                    value={this.formData.mobile}
                                                    onHandle={this.getFormData.bind(this)}
                                                    placeholder={'手机号'}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="right">
                                        <span className="tips">为确保司导联系到客人，请填写可以联系到客人的电话</span>
                                    </div>
                                    {
                                        !this.state.moreMobile ? <div className="addMobile" ><span className="add-phone" onClick={this.addMobile.bind(this)}>+备用手机号</span></div> : null
                                    }
                                </div>
                                {
                                    this.state.moreMobile ?
                                    <div className="form-row phone-num">
                                        <div className="left">
                                            <label className="row-name">备用手机号</label>
                                            <div className="mobile hasOther">
                                                <div className="quhao">
                                                    <AreaCode
                                                        name='areacode2'
                                                        labelClass='area-code'
                                                        value={this.formData.areacode2}
                                                        onHandle={this.getFormData.bind(this)}
                                                    />
                                                </div>
                                                <div className="phone-number">
                                                    <MInput
                                                        className='mobile'
                                                        name='mobile2'
                                                        sign='手机号'
                                                        reg={/^\d+$/}
                                                        placeholder={'手机号'}
                                                        value={this.formData.mobile2}
                                                        onHandle={this.getFormData.bind(this)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="right">
                                            <span className="del-phone" onClick={this.delMobile.bind(this)}>删除</span>
                                        </div>
                                    </div> : null
                                }

                                <div className="form-row">
                                    <label className="row-name">客人留言</label>
                                    <div className="liu-yan">
                                        <Marks
                                            placeholder='客人留言将发送给司导'
                                            name='userRemark'
                                            max='1000'
                                            value={this.formData.userRemark}
                                            onHandle={this.getFormData.bind(this)}
                                        />
                                    </div>
                                </div>

                            </div>
                        </div>
                        <Checkbox onChange={this.checkBox.bind(this)} checked={this.state.sync}>将用车人信息同步至所有包车行程</Checkbox>
                    </Message>
                }
            </div>
        );
    }
}
// export default WriteCar;
function mapStateToProps(state) {
    return {
        car: state.main.car,
        carModel: state.main.carModel
    }
}

export default connect(mapStateToProps)(WriteCar)

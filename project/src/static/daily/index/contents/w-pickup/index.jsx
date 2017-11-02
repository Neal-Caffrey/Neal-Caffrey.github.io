import React,{Component} from 'react';
import {connect} from 'react-redux';
import { Modal , Input} from 'local-Antd';
import DatePickerGroup from 'components/ui-date-picker/indexd.jsx';
import {updatePickupVo} from '../../action/dailyAction.js'
import update from 'react-addons-update';
import SearchAirCode from 'components/w-aircode/index.jsx';
import SearchPlace from 'components/w-searchPlace/index.jsx';
import TimePicker from 'components/ui-time-picker/index.jsx';
import SearchAirPort from 'components/w-airport/index.jsx';
import ApiConfig from 'widgets/apiConfig/index.js';
import './sass/index.scss';
const DISBTNCSS = {
  border: '1px solid #DDDEDF',
  color: '#FFF',
  background:'#E9EAEA',
  boxShadow : 'none'
}
class PickUpModel extends Component{
  constructor(props,context){
    super(props,context);
    /*
    pickupVo={this.props.planVo.pickupVo}
    visible={this.state.isShowPickup}
    onSelect={this.selectPickupVo.bind(this)}
    cancel={()=>this.setState({isShowPickup:false})}/>
    */
   this.cacheData();
    this.state={
      // date : this.props.planVo.date.format('YYYY-MM-DD'),
      // flightObj : {},
      // placeObj : {},
      // visible : this.props.visible,
      byAirCode : true,
      // arrCityId : this.data.arrCityId
      // time : '09:00'
    }
  }
  cacheData(props=this.props){
    let planVo = props.planVo;
    let {pickupVo,date,arrCityId} = props;
    let {placeVo,time,flightVo} = pickupVo;

    this.data = {
      flightVo,
      placeVo,
      arrCityId,//@TODO
      time : '09:00',//@TODO
      date,
      dateVal : date.format('YYYY-MM-DD'),
      defaultDate : date.format('YYYY-MM-DD'),
      flightNo : flightVo && flightVo.flightNo || ''
    }
  }
  componentWillReceiveProps(props){
    // this.setState({
    //   visible : props.visible,
    // })
    this.cacheData(props);
  }
  disabledStartDate(current){
    return current && current.valueOf() < Date.now();
  }
  changeDateTime(dateMon,dateStr){
    console.log(dateMon.format('YYYY-MM-DD'))
    // this.data.date = dateMon;
    let object = update(this.props.pickupVo || {},{
      date : {
        $set : dateMon
      },
      flightVo : {
        $set : null
      },
      placeVo : {
        $set : null
      }
    });
    this.props.dispatch(updatePickupVo(object));
  }
  onSelectAir(selObj){
    // this.setState({
    //   flightObj : selObj
    // })
    /*
    flightVo : {
      pickupVo : {
        date :
        airPlanVo :
        placeVo :
      }
    }
     */
    this.data.flightVo = selObj;
    // this.data.arrCityId = selObj.arrCityId || selObj.cityId;
    this.data.placeVo = null;
    // console.log(selObj)
    // this.setState({
    //   arrCityId : this.data.arrCityId
    // })
    //dispatch flightVo
    //先应该请求一下，看看写的航班是否合理
    let object = update(this.props.pickupVo || {},{
      flightVo : {
        $set : selObj,
      },
      placeVo : {
        $set : null
      }
    });
    this.props.dispatch(updatePickupVo(object));
  }
  onSelectPlace(placeObj){
    this.data.placeVo = placeObj;
    //@获取距离
    let object = update(this.props.pickupVo || {},{
      placeVo : {
        $set : placeObj
      }
    });
    this.props.dispatch(updatePickupVo(object));
  }
  clickOn(){
    let obj =  {
      date : this.data.date,
      flightVo : this.data.flightVo,
      placeVo : this.data.placeVo,
      type : this.state.byAirCode ? 0 : 1,
      time : this.data.time
    };
    // if(!obj.flightVo || !obj.placeVo){
    //   //@TODO 不可关闭
    //   return;
    // }
    this.props.onSelect && this.props.onSelect(obj);
  }
  clickCancel(){
    this.props.cancel && this.props.cancel();
    this.setState({
      visible : false
    })
  }
  switchMode(tag){
    this.setState({
      byAirCode : !this.state.byAirCode
    })
  }
  getStartTime(time){
    // this.setState({
    //   time : time || '09:00'
    // })
    this.data.time = time || '09:00'
  }
  selectAirPort(obj){
  }
  renderAirCodeSection(){
    return (
      <div className='w-pickup-wrap' style={{display:this.state.byAirCode ? 'block' : 'none'}}>
        <div className='pickup-tab'>


            <p
            className='pickup-tab-item sel'
            >按航班号预订</p>
            <p
            className='pickup-tab-item'
            onClick={this.switchMode.bind(this)}>按机场预订</p>
        </div>
        <div className='form-fill-control flex-box pickup-model-input'>
          <lable htmlFor='pickup-time'>航班起飞时间</lable>
          <div className='form-input-wrap flex1-box'>
            <DatePickerGroup
              defaultValue={this.data.date}
              disabledDate={this.disabledStartDate.bind(this)}
              onHandle={this.changeDateTime.bind(this)}
              showToday={false}
              />
          </div>
        </div>
        <div className='form-fill-control flex-box pickup-model-input'>
          <lable htmlFor='pickup-code'>航班号</lable>
          <div className='form-input-wrap flex1-box'>
            <SearchAirCode
              cityId={this.props.startCityId}
              searchAirCodeXHR={ApiConfig.searchFlightNo}
              searchAirPlanXHR={ApiConfig.searchFlight}
              onSelectAir={this.onSelectAir.bind(this)}
              date={this.data.dateVal}
              planDate={this.props.originDate.format('YYYY-MM-DD')}
              defaultVal={this.data.flightNo}
              />
          </div>
        </div>
        {
          !this.props.isDaily && (
            <div className='form-fill-control flex-box pickup-model-input'>
              <lable htmlFor='pickup-place'>送达地点</lable>
              <div className='form-input-wrap flex1-box'>
                <SearchPlace
                  cityId={this.props.arrCityId}
                  searchPlaceXHR={ApiConfig.searchPlace}
                  placeVo={this.data.placeVo}
                  onSelectPlace={this.onSelectPlace.bind(this)}
                  />

              </div>
            </div>
          )
        }
      </div>
    )
  }
  renderPortSection(){
    return (
      <div className='w-pickup-wrap' style={{display:this.state.byAirCode ? 'none' : 'block'}}>
        <div className='pickup-tab'>
          <p
            className='pickup-tab-item'
            onClick={this.switchMode.bind(this)}>按航班号预订</p>
          <p
            className='pickup-tab-item sel'
          >按机场预订</p>
        </div>
        <div className='form-fill-control flex-box pickup-model-input'>
          <lable htmlFor='pickup-time'>接机机场：</lable>
          <div className='form-input-wrap flex1-box'>

            <SearchAirPort
              cityId={this.props.startCityId}
              flightVo={this.data.flightVo}
              hotXHRUrl={ApiConfig.searchPassCityAirPort}
              initialUrl={ApiConfig.searchPassCityAirPort}
              searchUrl={ApiConfig.searchPassCityAirPort}
              onSelectAirPort={this.onSelectAir.bind(this)}
              placeholder="请输入接机机场"
              />

          </div>
        </div>
        {
          !this.props.isDaily && (
            <div className='form-fill-control flex-box pickup-model-input'>
              <lable htmlFor='pickup-place'>目的地</lable>
              <div className='form-input-wrap flex1-box'>
                <SearchPlace
                  cityId={this.props.arrCityId}
                  searchPlaceXHR={ApiConfig.searchPlace}
                  placeVo={this.data.placeVo}
                  onSelectPlace={this.onSelectPlace.bind(this)}
                  />

              </div>
            </div>
          )
        }
        <div className='form-fill-control flex-box pickup-model-input'>
          <lable htmlFor='pickup-place'>接机时间：</lable>
          <div className='form-input-wrap flex1-box'>
            {this.data.dateVal}
          </div>
          <TimePicker
            defaultTime={this.data.time}
            onCloseTime={this.getStartTime.bind(this)}
            styleWidth='150px'
            />

        </div>
      </div>
    )
  }
  getSubmitBtn(){
    const {flightVo,placeVo} = this.props.pickupVo;
    const { props: { isDaily } } = this;
    if(!isDaily){
      if(!this.props.pickupVo || !flightVo || !placeVo){
        // 说明信息不全~~
        return (
            <div
              style={DISBTNCSS}
              className='pickup-submit modal-btn-item modal-btn-dark'
              onClick={this.clickOn.bind(this,false)}>确定</div>
        )
      }
      return (
        <div
          className='pickup-submit modal-btn-item modal-btn-dark'
          onClick={this.clickOn.bind(this,true)}>确定</div>
      )
    }else{
      if(!this.props.pickupVo || !flightVo ){
        // 说明信息不全~~
        return (
            <div
              style={DISBTNCSS}
              className='pickup-submit modal-btn-item modal-btn-dark'
              onClick={this.clickOn.bind(this,false)}>确定</div>
        )
      }
      return (
        <div
          className='pickup-submit modal-btn-item modal-btn-dark'
          onClick={this.clickOn.bind(this,true)}>确定</div>
      )
    }

  }
  getPickupInfo(){
    const {pickupVo} = this.props;
    if(!pickupVo)return;
    const {flightVo} = pickupVo;
    if(!flightVo)return;
    if(!flightVo.flightNo)return;
    if(!this.state.byAirCode)return;
    return (
      <div key={1} className='pickup-model-tips'>
        {flightVo.flightNo}预计 {flightVo.arrDate} {flightVo.arrTime} 抵达 {flightVo.arrAirport}({flightVo.arrAirportCode})
      </div>
    )
  }
  render(){
    return (
      <Modal
        width={610}
        key={this.props.pickUpModelKey}
        visible={this.props.visible}
        wrapClassName="vertical-center-modal"
        onOk={this.clickOn.bind(this)}
        onCancel={this.clickCancel.bind(this)}
        footer={
          [
            <div key={0} className='pickup-model-footer'>
              {this.getSubmitBtn()}
              <div  className='pickup-canncel  modal-btn-item' onClick={this.clickCancel.bind(this)}>取消</div>
            </div>,
            this.getPickupInfo()

          ]
        }
        >
        {this.renderAirCodeSection()}
        {this.renderPortSection()}
      </Modal>
    )
  }
}
function mapStateToProps(state) {
  const { leftSide,daily,flight } = state;
  const {currentDayIndex,currentObject} = leftSide;
  const {isDaily} = flight;
  //如果isDaily === true 说明是从包车进来的，那么，pickupVo应该从dailyVo中去取
  //如果isDaily === false 说明是从仅接送机进来，那么应该从current中直接取值
  let {date,startCity,type} = currentObject;
  let {pickupVo} = currentObject.dailyVo;
  let {dailyPickupVo,isShowPickup,pickUpModelKey} = daily || {};
  // if(isDaily){
  //   dailyPickupVo = dailyPickupVo || {};
  // }else{
  //   dailyPickupVo = pickupVo || {};
  // }
  dailyPickupVo = dailyPickupVo || pickupVo || {};
  date = dailyPickupVo.date || date;
  let arrCityId = (dailyPickupVo.flightVo && dailyPickupVo.flightVo.arrCityId) || (dailyPickupVo.flightVo && dailyPickupVo.flightVo.cityId) || -1;
  let startCityId = startCity.cityId;
  return {
    originDate : currentObject.date,
    date,
    currentDayIndex,
    pickUpModelKey,
    arrCityId,
    startCityId,
    pickupVo : dailyPickupVo,
    visible : isShowPickup
  }
}

export default connect(mapStateToProps)(PickUpModel)

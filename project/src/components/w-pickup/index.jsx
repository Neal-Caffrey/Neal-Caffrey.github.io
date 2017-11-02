import React,{Component} from 'react';
import { Modal , Input,DatePicker} from 'local-Antd';
import update from 'react-addons-update';
import SearchAirCode from 'components/w-aircode/index.jsx';
import SearchPlace from 'components/w-searchPlace/index.jsx';
import TimePicker from 'components/ui-time-picker/index.jsx';
import SearchAirPort from '../w-airport/index.jsx';
import './sass/index.scss';
export default class PickUpModel extends Component{
  constructor(props,context){
    super(props,context);
    /*
    planVo
    */
   this.cacheData();
    this.state={
      // date : this.props.planVo.date.format('YYYY-MM-DD'),
      // flightObj : {},
      // placeObj : {},
      // visible : this.props.visible,
      byAirCode : true,
      // time : '09:00'
    }
  }
  cacheData(props=this.props){
    let planVo = props.planVo;
    let {type,date,isComplete,dailyVo,flightVo} = planVo;
    let placeVo = null;
    if(type === 0 || type === 1){
      //说明就包车的行程，这时候flightVo从dailyVo中取
      flightVo = dailyVo.flightVo;
      placeVo = flightVo.pickupVo.placeVo;
    }else{
      placeVo = flightVo.pickupVo.placeVo
    }
    let arrCityId = 217;
    this.data = {
      flightVo,
      type,
      isComplete,
      placeVo,
      arrCityId,//@TODO
      time : '09:00',//@TODO
      date : date.format('YYYY-MM-DD')
    }
  }
  componentWillReceiveProps(props){
    this.setState({
      visible : props.visible,
    })
  }
  disabledStartDate(current){
    return current && current.valueOf() < Date.now();
  }
  changeDateTime(dateMon,dateStr){

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
    this.data.flightVo = update(this.data.flightVo,{
      pickupVo : {
        airPlanVo : {
          $set : selObj
        }
      }
    });
  }
  onSelectPlace(placeObj){
    this.setState({
      placeObj : placeObj
    })
  }
  clickOn(){
    this.props.onSelect && this.props.onSelect({
      date : this.state.date,
      flightVo : this.state.flightObj,
      placeVo : this.state.placeObj,
      time : this.state.time
    });
  }
  clickCancel(){
    this.setState({
      visible : false
    })
  }
  switchMode(){
    this.setState({
      byAirCode : !this.state.byAirCode
    })
  }
  getStartTime(time){
    this.setState({
      time : time || '09:00'
    })
  }
  selectAirPort(obj){
  }
  renderAirCodeSection(){
    return (
      <div className='w-pickup-wrap'>
        <p className='w-pickup-switch'>忘记航班号?<span onClick={this.switchMode.bind(this)}>按机场预定</span></p>
        <div className='form-fill-control flex-box'>
          <lable htmlFor='pickup-time'>航班起飞时间</lable>
          <div className='form-input-wrap flex1-box'>
            <DatePicker
              showTime={false}
              showToday={false}
              allowClear={false}
              defaultValue={this.props.planVo.date}
              disabledDate={this.disabledStartDate.bind(this)}
              onChange={this.changeDateTime.bind(this)}
              />
          </div>
        </div>
        <div className='form-fill-control flex-box'>
          <lable htmlFor='pickup-code'>航班号</lable>
          <div className='form-input-wrap flex1-box'>
            <SearchAirCode
              searchAirCodeXHR='http://api6-test.huangbaoche.com/search/v1.0/e/flight'
              searchAirPlanXHR='http://api6-test.huangbaoche.com/flight/v1.0/p/flights'
              onSelectAir={this.onSelectAir.bind(this)}
              date={this.data.date}
              />
          </div>
        </div>
        <div className='form-fill-control flex-box'>
          <lable htmlFor='pickup-place'>送达地点</lable>
          <div className='form-input-wrap flex1-box'>
            <SearchPlace
              cityId={this.data.arrCityId}
              searchPlaceXHR='https://api7-test.huangbaoche.com/search/v1.0/p/places'
              onSelectPlace={this.onSelectPlace.bind(this)}
              />

          </div>
        </div>
      </div>
    )
  }
  renderPortSection(){
    return (
      <div className='w-pickup-wrap'>
        <p className='w-pickup-switch'><span className='switch-btn' onClick={this.switchMode.bind(this)}>按机场预定</span>推荐按航班号预订,晚点司机免费等待</p>
        <div className='form-fill-control flex-box'>
          <lable htmlFor='pickup-time'>接机机场</lable>
          <div className='form-input-wrap flex1-box'>

            <SearchAirPort
              hotXHRUrl='http://api6-test.huangbaoche.com/basicdata/v1.0/cla/hottest/city/airports?keyword=&limit=1&offset=15'
              initialUrl='https://api7-dev.huangbaoche.com/price/v1.0/p/airports/continent'
              searchUrl='http://api6-test.huangbaoche.com/price/v1.2/cla/serviceAirports'
              onSelectAirPort={this.onSelectAir.bind(this)}
              />

          </div>
        </div>
        <div className='form-fill-control flex-box'>
          <lable htmlFor='pickup-place'>目的地</lable>
          <div className='form-input-wrap flex1-box'>
            <SearchPlace
              cityId={this.state.flightObj.cityId}
              searchPlaceXHR='https://api7-test.huangbaoche.com/search/v1.0/p/places'
              onSelectPlace={this.onSelectPlace.bind(this)}
              />

          </div>
        </div>
        <div className='form-fill-control flex-box'>
          <lable htmlFor='pickup-place'>接机时间</lable>
          <div className='form-input-wrap flex1-box'>
            {this.date.date}
          </div>
          <TimePicker
            defaultTime={this.date.time}
            onCloseTime={this.getStartTime.bind(this)}
            styleWidth='100px'
            />

        </div>
      </div>
    )
  }
  render(){
    return (
      <Modal
        title='填写接机信息'
        visible={this.state.visible}
        wrapClassName="vertical-center-modal"
        onOk={this.clickOn.bind(this)}
        onCancel={this.clickCancel.bind(this)}
        footer={
          [
            <div key={0} className='pickup-model-footer'>
              <div  className='pickup-submit modal-btn-item modal-btn-dark' onClick={this.clickOn.bind(this)}>确定</div>
              <div  className='pickup-canncel  modal-btn-item' onClick={this.clickCancel.bind(this)}>取消</div>
            </div>
          ]
        }
        >
        {this.state.byAirCode ? this.renderAirCodeSection() : this.renderPortSection()}
      </Modal>
    )
  }
}

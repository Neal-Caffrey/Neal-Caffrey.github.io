import React , {Component} from 'react';
import {Icon} from 'local-Antd';
import update from 'react-addons-update';
import {isEmptyObject} from 'components/util/index.jsx';
import PickUpModel from 'components/w-pickup/index.jsx';

export default class FlightOrder extends Component{
  constructor(props,context){
    super(props,context);
    this.state = {
      pickupState : false,
      canNext : this.props.planVo.isComplete,
      pickupVo : this.initialObject('pickupVo'),
      dropoffVo : this.initialObject('dropoffVo')
    }

  }
  componentWillReceiveProps(nextProps){
    this.setState({
      pickupVo : this.initialObject('pickupVo',nextProps),
      dropoffVo : this.initialObject('dropoffVo',nextProps),
      isComplete : nextProps.planVo.isComplete
    });
  }
  initialObject(key,props){
    const nextProps = props ? props : this.props;
    if(!nextProps.planVo.dailyVo.isHalfDay){
      //正常的接送机
        return nextProps.planVo.flightVo ? nextProps.planVo.flightVo[key] : {}
    }else{
      //半日包中的接送机
      return nextProps.planVo.dailyVo.flightVo ? nextProps.planVo.dailyVo.flightVo[key] : {}
    }


  }
  clickPickup(){
    this.setState({
      pickupState : true
    })
  }
  selectPickupVo(pickupObj){
    this.setState({
      pickupState : false,
      canNext : true,
      pickupVo : pickupObj
    });
    this.props.onhalfSelPickup && this.props.onhalfSelPickup(Object.assign({},pickupObj));


  }
  getCurrentVo(){
    if(!this.state.canNext){
      return;
    }
    let obj = update(this.props.planVo,{
      isComplete : {
        $set : true
      },
      isLast : {
        $set : this.props.isLast
      },
      flightVo :{
        $set : {
          pickupVo : this.state.pickupVo,
          dropoffVo : this.state.dropoffVo
        }
      }
    });
    this.props.onClickNextBtn && this.props.onClickNextBtn(obj);
  }
  checkCanNext(){
    if(isEmptyObject(this.state.pickupVo) && isEmptyObject(this.state.dropoffVo)){
      this.setState({
        canNext : false
      });
      return false;
    }
    this.setState({
      canNext : true
    });
    return true
  }
  resetFlight(tag){
    switch(tag){
      case 'pickup':
      this.setState({
        pickupVo : {},
        canNext : this.state.dropoffVo.date ? true : false
      })
    }
  }
  renderPickupBtn(tag){
    const btn = <div className='flex1-box flight-btn-item' onClick={this.clickPickup.bind(this)}>{tag == 'pickup' ? '添加接机' : '添加送机'}</div>

    if(this.state.pickupVo.date){
      return (
        <div className='flight-res flex1-box' style={{marginRight : '20px'}}>
          <Icon type="close" style={{position:'absolute',right : '10px',top : '10px',color:'#F49F1F'}} onClick={this.resetFlight.bind(this,'pickup')}/>
          <span className='flight-tag'>接机</span>
          <p>{this.state.pickupVo.date} {this.state.pickupVo.time ? this.state.pickupVo.time : ''}</p>
          <div className='flight-wr'>
            <section className='flex-box'>
              <Icon type="environment-o" style={{color : '#11BACA',marginRight : '15px'}}/>
              <p className='flex1-box'>{this.state.pickupVo.flightVo.arrAirport || this.state.pickupVo.flightVo.airportName}</p>
            </section>
            <section className='flex-box flex-top'>
              <Icon type="environment-o" style={{color : '#FA573D',marginRight : '15px'}} />
              <section className='flex1-box'>
                <p>{this.state.pickupVo.placeVo.placeName}</p>
                <p className='place-des'>{this.state.pickupVo.placeVo.placeAddress}</p>
              </section>
            </section>
          </div>
          <div className='flight-dis'>
            <p><b>预计历程</b><span style={{color : '#F49F1F'}}>60.37</span><b>公里</b></p>
            <p><b>预计时间</b><span style={{color : '#F49F1F'}}>60.37</span><b>分钟</b></p>
          </div>
        </div> );
    }
    return btn;

  }
  render(){
    return (
      <div className='flight-main-wrap'>
        <div className='flight-btn flex-box flex-top'>
          <lable style={{lineHeight:'34px'}}>接送机</lable>
          <div className='flex-box flex-top' style={{width : '587px'}} >
            {this.renderPickupBtn('pickup')}
            <div className='flex1-box flight-btn-item'>添加送机</div>
          </div>
          <div className='flex1-box'></div>
        </div>
        <PickUpModel
          planVo={this.props.planVo}
          visible={this.state.pickupState}
          onSelect={this.selectPickupVo.bind(this)}
          />
        {
          this.props.onClickNextBtn &&
          <div className={this.state.canNext ? 'mid-btn-wrap' : 'mid-btn-wrap disabled'} onClick={this.getCurrentVo.bind(this)}>
            <span>{this.props.isLast ? '完成选择' : '进入下一天'}</span>
            <Icon type="arrow-right" />
          </div>
        }
      </div>
    )
  }
}

import React,{Component} from 'react';
import OnclickOutside from 'react-onclickoutside';
import {Input,Spin} from 'local-Antd';
import './sass/index.scss';
// import request from 'superagent';
import YdjAjax from 'components/ydj-Ajax';
import ApiConfig from 'widgets/apiConfig/index.js';
export default OnclickOutside(class SearchAirCode extends Component{
  /*
  props :
  id || pickup-code，
  searchAirCodeXHR
  searchAirPlanXHR
  onSelectAir
  */
  constructor(props,context){
    super(props,context);
    this.state = {
      popState : false,
      isLoading : false,
      inputVal : this.props.defaultVal || '',
      popStateAir : false,
      airCodeList : [],
      selectAirCode : '',
      airPlanList : []
    }
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      inputValue : nextProps.defaultVal || ''
    })
  }

  handleClickOutside(){
    this.setState({
      popState : false
    });
  }
  inputFocus(proxy){
    this.setState({
      popState : true,
      inputVal : proxy.target.value
    })
  }
  fetchAirCodeList(key){
    // debugger
    let opt = {
      url: this.props.searchAirCodeXHR,
      data:{key,limit:10,offset:0},
      abort : true,
      successHandle: (res) => {
          this.setState({
            airCodeList : res.data.resultBean.length === 0 ? [{flightNo:key}] : res.data.resultBean,
            isLoading : false
          })
      },
      // ...this._handleErrors
    }
    new YdjAjax(opt);
  }
  fetchAirPlanList(date,flightNo){
    let opt = {
      url: this.props.searchAirPlanXHR,
      data:{date,flightNo},
      abort : true,
      successHandle: (res) => {
          this.setState({
            airPlanList : res.data,
            isLoading : false
          })
      },
      // ...this._handleErrors
    }
    new YdjAjax(opt);
  }

  fetchAirInCity(cityId,airportCode,cb){
    let opt = {
      url: ApiConfig.searchPassCityAirPort,
      data:{airportCode,cityId},
      abort : true,
      successHandle: (res) => {
          console.log(res)
          cb && cb(res)
      },
      // ...this._handleErrors
    }
    new YdjAjax(opt);
  }

  inputChange(proxy){
    // debugger
    let inputVal = proxy.target.value;
    inputVal && this.fetchAirCodeList(inputVal);
    this.setState({
      inputVal,
      isLoading : inputVal ? true : false
    });
  }
  liClick(index,inputVal){
    this.setState({
      // inputVal : inputVal.flightNo,
      popStateAir : true,
      isLoading : true
    });
    this.fetchAirPlanList(this.props.date,inputVal.flightNo,)
  }
  checkIsAirCodeOk(flightVo,cb){
    const reset = ()=>{
      this.setState({
        inputVal : '',
        isLoading : false,
        popState : false,
        popStateAir : false
      });
    }
    if(!flightVo){
      reset();
      return false;
    }
    if(flightVo.arrDate !== this.props.planDate){
      reset();
      alert('您填写的航班信息降落时间于服务时间不符，请修改航班信息');
      return false;
    }
    this.fetchAirInCity(this.props.cityId,flightVo.arrAirportCode,(res)=>{
      cb && cb(res);
    })


  }
  selAirPlan(val){
    this.checkIsAirCodeOk(val,(res)=>{
      if(res.data.length > 0){
        this.setState({
          inputVal : val ? val.flightNo : '',
          isLoading : false,
          popState : false,
          popStateAir : false
        });
        this.props.onSelectAir && this.props.onSelectAir(val);
      }else{
        this.setState({
          inputVal : '',
          isLoading : false,
          popState : false,
          popStateAir : false
        });
        alert('您填写的航班信息降落机场与服务城市不符，请修改航班信息')
      }

    })

  }

  render(){
    const style = this.state.popState && this.state.airPlanList.length > 0 ? '400px' : 'auto';
    return (
      <div className='w-air-code-wrap'>
        <Input id={this.props.id || 'pickup-code'} placeholder='请输入航班号，如MU235' value={this.state.inputVal} onFocus={this.inputFocus.bind(this)} onChange={this.inputChange.bind(this)}/>
        {
          this.state.popState===true ?
          <div className='w-air-code-ul' style={{width : style}}>
            {
              !this.state.inputVal && <div className='w-air-tips'>请输入航班号</div>
          }
          {
            this.state.isLoading && <div className='w-air-loading'><Spin/></div>
          }
        {
          !this.state.isLoading && this.state.inputVal && !this.state.popStateAir &&
          <ul>
            {
              this.state.airCodeList.map((val,index)=>{
                return <li key={index} onClick={this.liClick.bind(this,index,val)}>{val.flightNo}</li>
              })
            }
          </ul>
        }
        {
          this.state.popStateAir &&
          <ul className='J-air-jou'>
            {
              (()=>{
                if(this.state.airPlanList.length > 0){
                  return this.state.airPlanList.map((val,index)=>{
                    return (
                      <li key={index} className="borderBt06 flex-box" onClick={this.selAirPlan.bind(this,val)}>
                        <div className='flex1-box'>
                          <p>{val.arrDate}</p>
                          <p>
                            <span>
                              <strong>{val.depCityName}</strong>
                            </span>
                            <i>{val.depTime}</i>
                          </p>
                          <p>{val.depAirport}</p>
                        </div>
                        <span className=''>{val.depAirport}</span>
                        <div className='flex1-box' style={{textAlign : 'right'}}>
                          <p>{val.flightNo}</p>
                          <p>
                            <span>
                              <strong>{val.arrCityName}</strong>
                            </span>
                            <i>{val.arrTime}</i>
                          </p>
                          <p>{val.arrAirport}</p>
                        </div>
                      </li>
                    )
                  })
                }
                return !this.state.isLoading ? <li onClick={this.selAirPlan.bind(this,null)}>暂未找到您输入的航班号</li> : null
              })()
            }
          </ul>




        }
      </div> :
      null
    }
  </div>
)
}

})

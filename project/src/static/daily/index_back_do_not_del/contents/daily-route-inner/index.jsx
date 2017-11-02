import React , {Component} from 'react';
import {connect} from 'react-redux';
// antd
import {Icon,Input} from 'local-Antd';
//组件
import update from 'react-addons-update';
import DailyRoutes from '../daily-routes/index.jsx';

class DailyRoutesInner extends Component {
  /*
    getSelRoutesType
   */
  constructor(props,context){
    super(props,context);
    this.state = {
      isShowTypeSel : true,
      // inputValue : '',
    }
  }
  // componentWillReceiveProps(nextProps) {
  //   this.setState({
  //     inputValue : this._getInputValue(nextProps.type,nextProps.endCity)
  //     // inputValue : '',5
  //     // isShowTypeSel : true
  //   })
  // }
  _getInputValue(type=this.props.type,endCity=this.props.endCity){
    /**
     * [isShowTypeSel 根据type获取输入框应该现实的内容]
     */
    if(type === -1){
      return '';
    }
    let {startCity} = this.props;

    if(type === 301){
      return `${startCity.cityName}出发，在${endCity ? endCity.cityName : '其他地区'}结束当日行程`;
    }else{
      // debugger;
      return (()=>{
        for(let i = 0,len = startCity.cityRouteScopes.length;i<len;i++){
          let val = startCity.cityRouteScopes[i];
          if(val.routeType === type){
            return `${val.routeTitle}\t${val.routeLength}小时/${val.routeKms}公里`
          }
        }
      })()
    }
  }
  _getHalfDom(type=this.props.type,endCity=this.props.endCity){
    /**
     * [isShowTypeSel 根据type获取输入框应该现实的内容]
     */
    if(type === -1){
      return null;
    }
    let {startCity} = this.props;

      return (()=>{
        for(let i = 0,len = startCity.cityRouteScopes.length;i<len;i++){
          let val = startCity.cityRouteScopes[i];
          if(val.routeType === type){
            return (<p>
                    <span>{val.routeTitle}</span>
                    <span>{val.routeLength}小时/{val.routeKms}公里</span>
                  </p>)
          }
        }
      })()

  }
  bindEvent(){
    return {
      inputClick :()=>{
        /**
         * [inputClick 点击Input要toggle选择框]
         * @type {Boolean}
         */
        this.setState({
          isShowTypeSel : false
        })
      },
      getSelRoutesType : (type,endCity)=>{
        /**
         * [isShowTypeSel 点击包车行程时的回调函数]
         * @type {Boolean}
         */
        this.setState({
          isShowTypeSel : true,
          // inputValue : this._getInputValue(type,endCity),
          // type
        });
        if(type !== 2){
          this.props.getSelRoutesType && this.props.getSelRoutesType(type,endCity);
        }else if(endCity){
          this.props.getSelRoutesType && this.props.getSelRoutesType(type,endCity);
        }

        console.log(type)
      },
    }
  }

  render(){
    return (
      <div className='daily-type-sel' id="daily-type">
        {
          ((isHalfDay)=>{
            let res = [];
            if(isHalfDay){
              res.push(
                this._getHalfDom()
              )
            }else{
              res.push(<Input
                id=''
                placeholder='请选择包车游玩范围'
                value={this._getInputValue() || ''}
                readOnly={true}
                onClick={this.bindEvent().inputClick}
                style={{width:'310px'}}
                />);
              res.push(<Icon type="caret-down" />);
              res.push(<DailyRoutes
                isShowTypeSel={!this.state.isShowTypeSel}
                startCity={this.props.startCity}
                endCity={this.props.endCity}
                type={this.props.type}
                onHandle={this.bindEvent().getSelRoutesType}
                disableOnClickOutside={this.state.isShowTypeSel}/>);
            }
            return res;
          })(this.props.isHalfDay)
        }



      </div>
    )
  }
}

function mapStateToProps(state) {
  const { leftSide , daily} = state;
  const {currentDayIndex} = leftSide;
  let {startCity,endCity,type,isHalfDay} = daily.dailyVo;
  return {
    startCity,
    endCity,
    type,
    isHalfDay
  }
}

export default connect(mapStateToProps)(DailyRoutesInner)

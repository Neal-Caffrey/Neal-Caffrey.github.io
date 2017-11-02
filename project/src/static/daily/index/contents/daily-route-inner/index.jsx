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
      return '请选择包车游玩范围';
    }
    let {startCity} = this.props;

    if(type === 301){
      return <span style={{color : '#0E1A27'}}>{startCity.cityName}出发，在{endCity ? endCity.cityName : '其他地区'}结束当日行程</span>;
    }else{
      // debugger;
      return (()=>{
        for(let i = 0,len = startCity.cityRouteScopes.length;i<len;i++){
          let val = startCity.cityRouteScopes[i];
          if(val.routeType === type){
            let res = [];
            res.push((
              <span style={{color : '#0E1A27'}}>{val.routeTitle}</span>
            ));
            // liang 需求
            // res.push((
            //   <span style={{marginLeft : '10px'}}>{val.routeLength}小时/{val.routeKms}公里</span>
            // ))
            let obj = {h:10,k:250};
            if(val.routeType === 301){
              obj = {
                h : 10,
                k : 450
              }
            }
            if(val.routeType === 102){
              obj = {
                h : 5,
                k : 150
              }
            }
            res.push((
              <span style={{marginLeft : '10px'}}>{obj.h}小时/{obj.k}公里</span>
            ))
            return res;
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
            // return (<p>
            //         <span style={{marginRight : '10px'}}>{val.routeTitle}</span>
            //         <span style={{color : '#6E767D'}}>{val.routeLength}小时/{val.routeKms}公里</span>
            //       </p>)
            //  liang 需求
            return (<p>
                    <span style={{marginRight : '10px'}}>{val.routeTitle}</span>
                    <span style={{color : '#6E767D'}}>{5}小时/{150}公里</span>
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
        if(type === -1){
          this.props.getSelRoutesType && this.props.getSelRoutesType(this.props.type === 301 ? -1 : this.props.type,endCity);
          return;
        }
        if(type !== 2){
          this.props.getSelRoutesType && this.props.getSelRoutesType(type,endCity);
        }else if(type === 2 && !endCity){
          this.props.getSelRoutesType && this.props.getSelRoutesType(-1,endCity);
        }else if(type === 2 && endCity){
          this.props.getSelRoutesType && this.props.getSelRoutesType(type,endCity);
        }

        console.log(type)
      },
    }
  }

  render(){
    return (
      /*
      <Input
        id=''
        placeholder='请选择包车游玩范围'
        value={this._getInputValue() || ''}
        readOnly={true}
        onClick={this.bindEvent().inputClick}
        style={{width:'310px'}}
        />
       */
      <div className='daily-type-sel' id="daily-type">
        {
          ((isHalfDay)=>{
            let res = [];
            if(isHalfDay){
              res.push(
                this._getHalfDom()
              )
            }else{
              res.push(
                <div className='route-res time-input'
                  onClick={this.bindEvent().inputClick}
                  style={{width:'310px'}}>{this._getInputValue() || ''}</div>
              );
              // res.push(<Icon type="caret-down" />);
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

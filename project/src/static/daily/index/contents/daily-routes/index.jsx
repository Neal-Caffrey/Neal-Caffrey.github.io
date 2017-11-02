import React , {Component} from 'react';
import {Icon,Input} from 'local-Antd';
import {connect} from 'react-redux';
import update from 'react-addons-update';
import OnclickOutside from 'react-onclickoutside';
import SearchNearCity from '../w-nearCity/index.jsx';
import ApiConfig from 'widgets/apiConfig/index.js';

let Hoc =  OnclickOutside(class DailyRoutes extends Component{
  constructor(props){
    super(props);
      /**props:
      startCity
      endCity
      type
     */
    this.state = {
      isShowCity : false
    }
  }
  componentWillReceiveProps(nextProps){
    this.endCity = nextProps.endCity;
    this.setState({
      type : nextProps.type
    })
  }

  handleClickOutside(){
    this.props.onHandle && this.props.onHandle(this.props.lastType);
  }
  clickType(index){
    /**
     * [clickType 点击]
     * @type {Boolean}
     */
    // 如果index === 2 说明是其他城市，这个时候不能触发选中，应该是选完city的时候再触发
    this.props.onHandle &&  this.props.onHandle(index);
    this.setState({
      isShowCity : index === 301 ? true : false
    });
  }

  /**
   * [onSelectCity 选择其他城市后的回调函数]
   * @method onSelectCity
   * @param  {[object]}     city [cityVo]
   * @return {[void]}
   */
  onSelectCity(city){
    this.endCity = city;
    this.props.onHandle && this.props.onHandle(city ? 301 : -1,city);
    this.setState({
      isShowCity : false
    });
  }
  /**
   * [backFromCity 点击其他城市的返回按钮]
   * @method backFromCity
   * @return {[void]}
   */
  backFromCity(){
    this.endCity = null;
    this.props.onHandle && this.props.onHandle(-1,null);
    this.setState({
      isShowCity : false,
    })
  }
  getFanwei(type,val){
    let res = [];
    if(type === 101){
      res.push((
        <p className='daily-type-sub'>
         市内范围：{val.routeScope}
       </p>
     ));
     val.routePlaces && res.push(
       <p className='daily-type-sub'>
        参考景点：{val.routePlaces}
      </p>
     )
    }
    if(type === 201){
      res.push ((
        <p className='daily-type-sub'>
         周边范围：{val.routeScope}
       </p>
     ));
      val.routePlaces && res.push(
        <p className='daily-type-sub'>
         参考景点：{val.routePlaces}
       </p>
     )
    }
    if(type === 301){
      res.push (val.routeScope && (
        <p className='daily-type-sub'>
         跨城市：{val.routeScope}
       </p>
     ));
      val.routePlaces && res.push(
        <p className='daily-type-sub'>
         热门城市：{val.routePlaces}
       </p>
     )
    }
    return res;
  }

  render(){
    let cityRoutes = update(this.props.startCity.cityRouteScopes,{});
    cityRoutes = cityRoutes.filter((item) => {
      return !(item.routeType === 102);
    });
    return (
      <div>
        {
          ((isShowTypeSel)=>{
            let routDes =  <span className="daily-type-next">10小时/250公里</span>;
            if(isShowTypeSel){
              return (
                <ul className="daily-type-wrap">
                  {
                    (()=>{
                      return cityRoutes.map((val,index)=>{
                        if(val.routeType === 102){
                          return null
                        }
                        if(val.routeType === 301){
                          routDes =  <span className="daily-type-next">10小时/450公里</span>;
                        }
                        return (
                          <li className={this.state.type==val.routeType?'daily-type-item active':'daily-type-item'} onClick={this.clickType.bind(this,val.routeType)}>
                            <p className='daily-type-title flex-box'>
                              <span className="flex1-box">{val.routeTitle}</span>
                              {
                                /* //  liang 需求
                                <span className="daily-type-next">{val.routeLength}小时/{val.routeKms}公里</span>
                                */
                               routDes
                              }
                            </p>
                            {this.getFanwei(val.routeType,val)}
                          </li>
                        )
                      })
                    })()

                  }
                </ul>
              )
            }
            return null;
          })(this.props.isShowTypeSel)
        }
        {
          ((isShowCity)=>{
            if(isShowCity){
              return (
                <SearchNearCity
                  hotXHRUrl={`${ApiConfig.searchGroups}?cityId=${this.props.startCity.cityId}`}
                  onSelectCity={this.onSelectCity.bind(this)}
                  isNearCity={true}
                  routerUrl={ApiConfig.queryCityRoute}
                  onBackFromCity={this.backFromCity.bind(this)}
                  disableOnClickOutside={!this.state.isShowCity}
                  />
              )
            }
            return null;
          })(this.state.isShowCity)
        }
    </div>
    )
  }
})

function mapStateToProps(state) {
  const { leftSide,daily } = state;
  const {currentObject} = leftSide;
  const lastType = currentObject.dailyVo.type;
  return {
    ...daily.dailyVo,
    lastType
  }
}
export default connect(mapStateToProps)(Hoc);

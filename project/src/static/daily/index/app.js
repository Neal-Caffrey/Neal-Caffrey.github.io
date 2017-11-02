import React, {
  Component
} from 'react';
import {
  connect
} from 'react-redux';
import {updateShowMap,removeAlert,updateLoading} from './action/mainAction.js';
import Header from 'contents/header/index.jsx';
import Footer from 'contents/footer/index.jsx';
import LeftSide from './contents/left-side/index.jsx';
import RightSide from './contents/right-side/index.jsx';
import MiddleSlide from './contents/middle-slide/index.jsx';
import Loading from 'components/ui-loading/index.jsx';
import Msg from 'components/ui-msg/index.jsx';
import BottomSide from 'components/bottom-side/index.jsx';
import PlanMap from 'components/w-map/index.js';
import CarList from './contents/carList/index.jsx';
import RouteList from './contents/routeList/index.jsx';
import BaseCss from 'local-BaseCss/dist/main.css';
import GlobleCss from 'components/globleCss/index.scss';
import './sass/index.scss';
const mapStyle = {
  height : '80%',
  width : '70%',
  left : '50%',
  top : '50%',
  transform : 'translate(-50%,-50%)',
  zIndex : '301',
  paddingRight : '37px',
  position: 'absolute'
}


class App extends Component {
  render() {
    return (
      <div id='ui-wrap'>
        <Header headerSuccess={()=>this.props.dispatch(updateLoading(false))}/>
        {
          (()=>{
            if(this.props.isHeader){
              return (
                <div className="ui-main ui-fixed-footer">
                  <LeftSide/>
                  <MiddleSlide/>
                  <RightSide/>
                  <CarList/>
                  <RouteList/>
                </div>
              )
            }else{
              return null;
            }
          })()
        }
        {
          ((isLoading,isShowMap)=>{
            let res = [];
            if(isLoading){
              res.push(<Loading/>)
            }
            if(isShowMap){
              res.push(
                <PlanMap
                  {...this.props.currentMap}
                  wraperStyle={mapStyle}
                  showFullMap={()=>this.props.dispatch(updateShowMap(false))}/>
              )
              res.push(
                <div
                  className='map-overLay'
                  style={{zIndex : 300,background:'rgba(0,0,0,0.5)',position:'fixed',top:0,left : 0,right : 0,bottom : 0}}
                  onClick={()=>this.props.dispatch(updateShowMap(false))}
                  ></div>
              )
            }
            return res;
          })(this.props.isLoading,this.props.isShowMap)
        }
        {
          (() => {
              let res = [];
              if (this.props.isAlert) {
                let attr = {
                  showFlag: true,
                  showType: 'alert', // info alert confirm
                  backHandle: () => {
                    this.props.dispatch(removeAlert());
                    if (this.props.alertMsg.goLogin) {
                      window.location.href = '/';
                    }
                  }
                };
                res.push(<Msg initData = {attr}><p>{this.props.alertMsg.msg}</p></Msg>)
              }
              return res;
            })()
        }
      </div>
    )
  }
}
const mapStateToProps = (state) => {
  const isHeader = !!(state.header.info);
  return {
    isLoading: state.main.loading,
    isAlert: state.main.isAlert,
    alertMsg: state.main.alertMsg,
    currentMap : state.main.currentMap,
    isShowMap : state.main.isShowMap,
    isHeader,
  }
}

export default connect(mapStateToProps)(App);

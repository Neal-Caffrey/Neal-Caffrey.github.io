import React, {
  Component
} from 'react';
import {
  connect
} from 'react-redux';
import {updateShowMap} from './action/mainAction.js';
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
  height : '70%',
  width : '70%',
  left : '50%',
  top : '50%',
  transform : 'translate(-50%,-50%)',
  zIndex : '102',
  paddingRight : '37px'
}


class App extends Component {
  render() {
    return (
      <div id='ui-wrap'>
        <Header />
        <div className="ui-main ui-fixed-footer">
          <LeftSide/>
          <MiddleSlide/>
          <RightSide/>
          <CarList/>
          <RouteList/>
        </div>
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
                  style={{zIndex : 101,background:'rgba(0,0,0,0.5)',position:'fixed',top:0,left : 0,right : 0,bottom : 0}}
                  onClick={()=>this.props.dispatch(updateShowMap(false))}
                  ></div>
              )
            }
            return res;
          })(this.props.isLoading,this.props.isShowMap)
        }
      </div>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    isLoading: state.main.loading,
    isAlert: state.main.isAlert,
    alertMsg: state.main.alertMsg,
    currentMap : state.main.currentMap,
    isShowMap : state.main.isShowMap,
  }
}

export default connect(mapStateToProps)(App);

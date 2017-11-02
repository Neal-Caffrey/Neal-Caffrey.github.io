/*
 * ReactMap - $1.1.2
 * 功能：***
 * 说明：***
 * 参数： {
 **
 * }
 */
import './scss/index.scss';
import React , {Component,Children} from 'react';
import {Map,Polygon,Marker,Polyline,InfoWindow} from 'react-amap';
const fullImgUrl = require('./img/full.png');
const idSpace = 'WG-Map'+(+new Date);
export default class ReactMap extends Component{

  constructor(props){
    super(props);
    this.state = {
      center : this.props.center,
      path : this.getLinePath(),
      zoom : this.props.zoom,
      isFull : false,
      markers : this.props.markers || [],
      mapDesc : this.props.mapDesc,
      lines : this.props.lines || [],
      infos : this.props.infos || []
    }
    this.mapEvents = {
      created: (map) => {
        this.mapInstance = map;
        this.addGoogleLayer(this.mapInstance );
      }
    };
    this.polygonStock = {
      strokeColor: "#93d749", //线颜色
      strokeOpacity: 1, //线透明度
      strokeWeight: 3,    //线宽
      fillColor: "#93d749", //填充色
      fillOpacity: 0.35//填充透明度
    }
  }
  componentWillUpdate(){
    this.mapEvents = {
      created: (map) => {
        this.mapInstance = map;
        this.addGoogleLayer(this.mapInstance );
      }
    };
  }
  componentDidUpdate(){
    this.mapInstance && setTimeout(()=>{
      this.mapInstance.setFitView()
    },300);
  }
  componentWillReceiveProps(nextProps){
    this.setState({
      center : nextProps.center,
      path : this.getLinePath(nextProps.linePath),
      markers : nextProps.markers || [],
      mapDesc : nextProps.mapDesc,
      lines : nextProps.lines || [],
      infos : nextProps.infos || []
    })
  }
  getLinePath(props=this.props.linePath){
    let startPoint = null;
    return (props || []).map((v,i)=>{
      return v ? v.map((val,index)=>{
        let start = val.startPoint;
        return {
          longitude : start.split(',')[1]-0,
          latitude : start.split(',')[0]-0
        }
      }) : []
    });
  }
  addGoogleLayer(map){
    let  googleLayer = new AMap.TileLayer({
      // 图块取图地址
      tileUrl: 'https://mt{1,2,3,0}.google.cn/vt/lyrs=m@142&hl=zh-CN&gl=cn&x=[x]&y=[y]&z=[z]&s=Galil',
      zIndex:100,
      map : map
    });
    setTimeout(()=>{
      googleLayer.setMap(map);
      map.setFitView();
      console.log('setFitView')
    },300)
  }
  getPlugins(){
    return [
      // 'OverView',
      // {
      //   name: 'ToolBar',
      //   options: {
      //     visible: true,  // 不设置该属性默认就是 true
      //   },
      // }
    ]
  }
  fullScreenToggle(){
    // this.setState({
    //   isFull : !this.state.isFull
    // });
    this.props.showFullMap && this.props.showFullMap()
  }
  renderInBtn(){
    return (
        <div className='WG-MapFullScreen'
             onClick={this.fullScreenToggle.bind(this)}
             style={{backgroundImage : `url(${fullImgUrl})`}}
        >
          {this.state.isFull ? '收起地图' : '展开地图'}
        </div>
    )
  }
  renderFullBtn(){
    return (
        <div className='WG-MapFullScreenBtn'

             onClick={this.fullScreenToggle.bind(this)}
        >
          {this.state.isFull ? '收起地图' : '展开地图'}
        </div>
    )
  }
  renderFullMode(){
    return (
        <div  id={idSpace} className='WG-MapFull'>
          <div className="WG-MapOverLay">
            <Map
                events={this.mapEvents}
                amapkey='e35ad1df5095e45e75ce8a2f97040dc5'
                {...this.state}
                plugins={this.getPlugins()}>
                {this.state.path.map((val=>{
                    return val && <Polygon path={val} style={this.polygonStock}/>
                }))}
            </Map>
            {this.renderFullBtn()}
          </div>
        </div>
    )
  }
  renderFlightMarker(val){
    return  val.isFlight ? <p  className='WG-FlightIco WG-FlightPlc'></p> : <p className='WG-FlightPlc'>{val.desc}</p>;
  }
  renderInMode(){
    return (
        <div style={this.props.wraperStyle} id={idSpace} className='WG-Map'>
          <Map
              events={this.mapEvents}
              amapkey='e35ad1df5095e45e75ce8a2f97040dc5'
              {...this.state}
              plugins={this.getPlugins()}>
              {this.state.path.map((val=>{
                  return <Polygon path={val} style={this.polygonStock}/>
              }))}
              {this.state.markers.map((val=>{
                  return val &&  <Marker position={val} />
              }))}
              <Polyline path={this.state.lines}
                style={{strokeColor:'rgba(246,51,8,0.5)',strokeWeight:3}}/>
              {this.state.infos.map((val,index)=>{
                if(!val)return null;

                return (
                  <Marker
                    key={index}
                    position={val.position}
                    render={this.renderFlightMarker}
                    extData={val.data}/>
                )
              })}

          </Map>
          {this.renderInBtn()}
          {
            this.state.mapDesc && (
              <div className="map-desc">
                <p dangerouslySetInnerHTML={{__html: this.state.mapDesc || ''}}></p>
              </div>
            )
          }
        </div>
    )
  }
  render(){
    if(  this.state.isFull ){
      return this.renderFullMode();
    }else{
      return this.renderInMode();
    }
  }
}

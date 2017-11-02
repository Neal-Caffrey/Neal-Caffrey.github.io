import React,{Component,PropTypes} from 'react';
import update from 'react-addons-update';
import Promise from 'bluebird';
import request from 'superagent';
import {Input,Icon,Spin} from 'local-Antd';
import {addEventListener} from '../util/index.jsx';
import {NAV_LIST} from './js/nav_setting.jsx';
import OnclickOutside from 'react-onclickoutside';
import  './sass/index.scss';
import YdjAjax from 'components/ydj-Ajax';


export default OnclickOutside(class SearchAirPort extends Component {
  static propTypes = {
    hotXHRUrl : PropTypes.string.isRequired,
    initialUrl : PropTypes.string.isRequired,
    searchUrl : PropTypes.string.isRequired,
    onSelectAirPort : PropTypes.func,
    placeholder : PropTypes.string
  }


  constructor(props,context){
    super(props,context);
    this.state = this.defaultState;
  }

  componentDidMount(){
    // this.getSearchData();
  }
  handleClickOutside(){
    this.setState({
      popState : false,
    })
  }
  get defaultState(){
    return {
      popState : false, //弹出层状态
      isLoading : true,//ajax请求状态
      hotList : [],//热门城市数组
      initialList : [],//Inital数组
      navSet : NAV_LIST,//nav配置
      navActiveIndex : 0,//选中的nav的Index
      hotRending : true,//显示热门还是inital
      inputValue : '',//输入框文本
      isSearch : true ,//是否是搜索
      searchList : [] //搜索列表
    }
  }
  componentWillReceiveProps(nextProps) {
    let flightVo = nextProps.flightVo;
    let name = flightVo ? flightVo.arrAirport : '';
    let portName = flightVo ? flightVo.airportName : '';
    this.setState({
      inputValue : portName || name
    })
  }
  getSearchData(keyword){
    // this._request && this._request.abort();
    // this._request = request
    // .get(this.props.searchUrl)
    // .query({keyword:keyword,limit:10,offset:0})
    // .end((err,res)=>{
    //   if(err || res.status != 200){
    //     return
    //   }
    //   this.setState({
    //     searchList : res.body.data.listData,
    //     isLoading : false,
    //     isSearch : true
    //   })
    // })
    let opt = {
      url: this.props.hotXHRUrl,
      data:{cityId : this.props.cityId,keyword:keyword},
      abort : true,
      successHandle: (res) => {
          this.setState({
            searchList : res.data,
            isLoading : false,
            isSearch : true
          })
      },
      // ...this._handleErrors
    }
    new YdjAjax(opt);

  }
  getHotCitys(){
    // request
    // .get(this.props.hotXHRUrl)
    // .query({serviceType:3,size:20})
    // .end((err,res)=>{
    //   if(err || res.status != 200){
    //     return
    //   }
    //   this.setState({
    //     hotList : res.body.data,
    //     isLoading : false,
    //     hotRending : true
    //   })
    // })
    let opt = {
      url: this.props.hotXHRUrl,
      data:{cityId : this.props.cityId,keyword:''},
      abort : true,
      successHandle: (res) => {
          this.setState({
            hotList : res.data,
            isLoading : false,
            hotRending : true
          })
      },
      // ...this._handleErrors
    }
    new YdjAjax(opt);
  }
  getInitialData(id){
    if(this.getCacheInitailData(id)){
      this.setState({
        initialList : this.getCacheInitailData(id),
        isLoading : false,
        hotRending : false
      })
      return;
    }
    request
    .get(this.props.initialUrl)
    .query({continentId:id,source:'cla'})
    .end((err,res)=>{
      if(err || res.status != 200){
        return
      }
      this.setState({
        initialList : res.body.data,
        isLoading : false,
        hotRending : false
      });
      this.setCacheInitailData(id,res.body.data);
    })
  }

  setCacheInitailData(key,val){
    if(!this._data){
      this._data = {}
    }
    if(key && val){
      this._data[key] = val;
    }
  }
  getCacheInitailData(key){
    if(!this._data){
      this._data = {}
    }
    if(key && this._data[key]){
      return this._data[key];
    }
  }

  inputFoucs(proxy,event){
    // proxy.nativeEvent.stopImmediatePropagation();
    this.setState({
      popState : true
    });

    this.getSearchData(proxy.target.value)

  }
  clearCityPop(proxy,event){
    this.setState({
      popState : false
    })
  }
  renderHot(){
    return this.state.hotList.map((val,index)=>{
      //
      return (
        <li key={index}
          className='flex-box'
          >
          <span>{val.cityName}</span>
          <ul className='flex1-box'>
            {
              val.airports.map((v,i)=>{
                return (
                  <li onClick={this.innerItemClick.bind(this,v,true)} key={i}>{v.airportName}</li>
                )
              })
            }

          </ul>
        </li>
      )
    })
  }

  navLiClick(index,id){
    if(index == 0){
      this.setState({
        navActiveIndex : index,
        isLoading : false,
        hotRending : true
      });
    }else{
      this.setState({
        navActiveIndex : index,
        isLoading : true,
        hotRending : false

      });
      this.getInitialData(id);
    }

  }
  renderNav(){

    return (
      this.state.navSet.map((val,index)=>{
        return (
          <li key={index} onClick={this.navLiClick.bind(this,index,val.id)} className={this.state.navActiveIndex == index ? 'active' : ''}>{val.title}</li>
        )
      })
    )
  }

  renderInital(){
    this.refs.filterDOM && (this.refs.filterDOM.scrollTop = 0);

    return this.state.initialList.map((val,index)=>{
      //
      return (
        <li key={index}
          className='flex-box'
          >
          <span>{val.cityName}</span>
          <ul className='flex1-box'>
            {
              val.airports.map((v,i)=>{
                return (
                  <li onClick={this.innerItemClick.bind(this,v,false)} key={i}>{v.airportName}</li>
                )
              })
            }

          </ul>
        </li>
      )
    })


  }

  _renderInnerFilter(arr){
    return (arr.map((v,i)=>{
      return (
        v.cityName.length > 6?
        <div key={i} title={v.cityName} onClick={this.innerItemClick.bind(this,v,false)} className='long-item'>{v.cityName}</div>
        :
        <div key={i} onClick={this.innerItemClick.bind(this,v,false)}>{v.cityName}</div>
      )
    }))
  }

  innerItemClick(object,isHot){
    this.setState({
      inputValue : object.airportName,
      popState : false
    });
    this.props.onSelectAirPort && this.props.onSelectAirPort(object)
  }
  searchInput(proxy){
    const inputValue = proxy.target.value;
    this.setState({
      inputValue : inputValue,
      isLoading : true,
    });
    // if(inputValue != ''){
    //   this.getSearchData(inputValue);
    // }else{
      this.getSearchData(inputValue);
      // this._request && this._request.abort();
      // this.setState({
      //   isSearch : false,
      //   isLoading : false,
      //   popState : true
      // })
    // }

  }

  renderMain(){
    return (
      <div className="J-airport-wrap" style={{display : this.state.popState ? 'block' : 'none'}}>
        <p className='airport-tips-wrap'>输入名称/拼音搜索城市</p>
        <ul className="airport-nav-wrap">
          {this.renderNav()}
        </ul>
        {
          this.state.isLoading ? (
            <div className='airport-loading'>
              <Spin/>
            </div>
          ) : null
        }
        {
          this.state.hotRending ?
          <ul className='airport-list hot'>
            {!this.state.isLoading ? this.renderHot() : null}
          </ul>
          :
          <ul className='airport-list filter' ref='filterDOM'>
            {!this.state.isLoading ? this.renderInital() : null}
          </ul>
        }

      </div>
    )
  }

  _makeFilterReplace(obj){
    let str = `${obj.airportName}  (${obj.airportCode})  -  ${obj.cityName}`
    let val = this.state.inputValue;
    if (val == "") {
      return str;
    }
    var reg = new RegExp(val, 'g');
    return str.replace(reg, '<i>' + val + '</i>');
  }
  searchClick(object){
    // debugger;
    this.setState({
      popState : false,
      inputValue : object.airportName
    });
    this.props.onSelectAirPort && this.props.onSelectAirPort(object)
  }

  renderSearch(){
    return (
      <div className="J-airport-wrap J-search-mode" style={{display : this.state.popState ? 'block' : 'none'}}>
        <p className='airport-tips-wrap'>输入名称/拼音搜索机场</p>
        {
          this.state.isLoading ? (
            <div className='airport-loading'>
              <Spin/>
            </div>
          ) : null
        }
        <ul className="airport-list search">
          {
            this.state.searchList.length == 0 ?
            <li className="city-dis">没有找到相关机场</li>:
              this.state.searchList.map((v,i)=>{
                return (
                  <li key={i} onClick={this.searchClick.bind(this,v)} dangerouslySetInnerHTML={{__html:this._makeFilterReplace(v)}}></li>
                )
              })
            }

          </ul>
        </div>
      )
    }

    render(){
      return (
        <div className='input-contain'>
          <Input
            id='J-SearchAir'
            placeholder={this.props.placeholder || '请输入出发城市'}
            onFocus={this.inputFoucs.bind(this)}
            value={this.state.inputValue}
            onChange={this.searchInput.bind(this)}
            />
          {this.renderSearch()}
        </div>

      )
    }

  })

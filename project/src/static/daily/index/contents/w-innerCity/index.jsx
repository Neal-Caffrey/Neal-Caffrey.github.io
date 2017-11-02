import React,{Component,PropTypes} from 'react';
import { connect } from 'react-redux';
import {updateLoading,updateCurrentMap,showAlert} from '../../action/mainAction.js';
import update from 'react-addons-update';
import Promise from 'bluebird';
import request from 'superagent';
import {Input,Icon,Spin} from 'local-Antd';
import {addEventListener} from 'components/util/index.jsx';
import {getNavSetting} from './js/getNav_Setting.jsx';
import OnclickOutside from 'react-onclickoutside';
import YdjAjax from 'components/ydj-Ajax';
import  './sass/index.scss';


let Sea =  OnclickOutside(class SearchNearCity extends Component {
  static propTypes = {
    hotXHRUrl : PropTypes.string.isRequired,
    onSelectCity : PropTypes.func
  }


  constructor(props,context){
    super(props,context);
    this.state = this.defaultState;
  }

  componentDidMount(){
    this.getHotCitys();
    // addEventListener(document,'click',this.clearCityPop.bind(this));
  }
  componentWillUnmount(){
    this._hotRequest && this._hotRequest.abort();
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      inputValue : nextProps.defaultVal
    })
  }
  get defaultState(){
    return {
      popState : true, //弹出层状态
      isLoading : true,//ajax请求状态
      cityList : {groupHotCitys:[]},//城市对象
      initialList : [],//Inital数组
      navSet : [],//nav配置
      navActiveIndex : 0,//选中的nav的Index
      hotRending : true,//显示热门还是inital
      inputValue : this.props.defaultVal || '',//输入框文本
      isSearch : false ,//是否是搜索
      searchList : [], //搜索列表
    }
  }
  errorHanlde(res){
      let handles = {
        failedHandle: (res) => {
          this.props.dispatch(updateLoading(false));
          this.props.dispatch(showAlert(res.message));
        },
        errorHandle: (xhr, errorType, error, errorMsg) => {
          this.props.dispatch(updateLoading(false));
          this.props.dispatch(showAlert(errorMsg));
        }
      };
      return handles;
  }
  getSearchData(keyword){
    // this._request && this._request.abort();
    // this._request = request
    // .get(this.props.searchUrl)
    // .query({keyword:keyword,limit:8,offset:0,type:3})
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
        data : {cityId:this.props.cityId,keyword},
        successHandle: (res) => {
          this.setState({
            searchList : res.data.listData,
            isLoading : false,
            isSearch : true
          })
        },
        ...this.errorHanlde()
      }
      // this.props.dispatch(showLoading(true));
      new YdjAjax(opt);





  }
  getFilterArr(res,keyword){
    return res;
  }
  getHotCitys(){
    // this._hotRequest = request
    // .get(this.props.hotXHRUrl)
    // .end((err,res)=>{
    //   if(err || res.status != 200){
    //     return
    //   }
    //   this._navSetting = getNavSetting(res.body.data.groupCitys);
    //   this.setState({
    //     hotList : res.body.data,
    //     isLoading : false,
    //     hotRending : true,
    //     navSet : this._navSetting
    //   })
    // })
    let opt = {
      url: this.props.hotXHRUrl,
      data : {cityId:this.props.cityId},
      successHandle: (res) => {
          this._navSetting = getNavSetting(res.data.listData);
          this.setState({
            hotList : res.data.hotListData,
            isLoading : false,
            hotRending : true,
            navSet : this._navSetting
          })
      },
      ...this.errorHanlde()
    }
    // this.props.dispatch(showLoading(true));
    new YdjAjax(opt);
  }
  getInitialData(index,initials){
    this.setState({
      initialList : this._navSetting[index]['citys'],
      isLoading : false,
      hotRending : false
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

  }
  clearCityPop(proxy,event){
    this.setState({
      popState : false
    })
  }
  renderHot(){
    return this.state.hotList.map((val,index)=>{
      if(val.isHot === 0) return null;
      return (
        <li key={index}
          title={val.cityName}
          className={val.cityName.length > 6 ? 'long-item' : ''}
          onClick={this.innerItemClick.bind(this,val,true)}
          >{val.cityName}</li>
      )
    })
  }

  navLiClick(index,inital){
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
      this.getInitialData(index,inital);
    }

  }
  renderNav(){
    // return null
    return (
      this.state.navSet.map((val,index)=>{
        return (
          <li key={index} onClick={this.navLiClick.bind(this,index,val.title)} className={this.state.navActiveIndex == index ? 'active' : ''}>{val.title}</li>
        )
      })
    )
  }

  renderInital(){
    this.refs.filterDOM && (this.refs.filterDOM.scrollTop = 0);
    const resArr = [];
    for(let key in this.state.initialList){
      resArr.push(
        <li key={key} className="filter-wrap">
          <span>{key}</span>
          <div className="filter-ul">
            {
              this._renderInnerFilter(this.state.initialList[key])
            }
          </div>
        </li>
      )
    }
    return resArr;
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
  getRouter(cityId,cb){
    if(this.getCacheInitailData(cityId)){
      //存在
      cb && cb(this.getCacheInitailData(cityId))
    }else{
      let opt = {
        url: this.props.routerUrl,
        // url: 'http://api6-dev.huangbaoche.com/trade/fx/v1.0/cla/merchant/detail',
        data:{cityId:cityId},
        successHandle: (res) => {
            this.setCacheInitailData(cityId,res.data);
            //success 抛出去
            cb && cb(res.data);
        },
        ...this.errorHanlde()
      }
      // this.props.dispatch(showLoading(true));
      new YdjAjax(opt);
    }

  }

  innerItemClick(object,isHot){
    // this.setState({
    //   inputValue : object.cityName,
    //   popState : false
    // });
    // this.props.onSelectCity && this.props.onSelectCity(object)
    this.props.dispatch(updateLoading(true));
    this.getRouter(object.cityId,(res)=>{
      this.setState({
        inputValue : res.cityName,
        popState : false
      });
      this.props.dispatch(updateLoading(false));
      this.props.onSelectCity && this.props.onSelectCity(res)
    })
  }
  searchInput(proxy){
    const inputValue = proxy.target.value;
    this.setState({
      inputValue : inputValue,
      isLoading : true,
    });
    if(inputValue != ''){
      this.getSearchData(inputValue);
    }else{
      this.setState({
        isSearch : false,
        isLoading : false,
        popState : true
      })
    }

  }

  handleClickOutside(){
    this.setState({
      popState : false
    });
    this.props.onSelectCity && this.props.onSelectCity(null)
  }

  renderMain(){
    return (
      <div className="J-city-wrap">
        <ul className="city-nav-wrap">
          {this.renderNav()}
        </ul>
        {
          this.state.isLoading ? (
            <div className='city-loading'>
              <Spin/>
            </div>
          ) : null
        }
        {
          this.state.hotRending ?
          <ul className='city-list hot'>
            {!this.state.isLoading ? this.renderHot() : null}
          </ul>
          :
          <ul className='city-list filter' ref='filterDOM'>
            {!this.state.isLoading ? this.renderInital() : null}
          </ul>
        }

      </div>
    )
  }

  _makeFilterReplace(obj){
    let str = `${obj.cityName}  ${obj.cityEnName}-${obj.placeName}`
    let val = this.state.inputValue;
    if (val == "") {
      return str;
    }
    var reg = new RegExp(val, 'g');
    return str.replace(reg, '<i>' + val + '</i>');
  }
  searchClick(object){
    this.props.dispatch(updateLoading(true));
    this.getRouter(object.cityId,(res)=>{
      this.setState({
        inputValue : res.cityName,
        popState : false
      });
      this.props.dispatch(updateLoading(false));
      this.props.onSelectCity && this.props.onSelectCity(res);
    })
  }

  renderSearch(){
    return (
      <div className="J-city-wrap J-search-mode" style={{display : this.state.popState ? 'block' : 'none'}}>
        {
          this.state.isLoading ? (
            <div className='city-loading'>
              <Spin/>
            </div>
          ) : null
        }
        <ul className="city-list ">
          {
            this.state.searchList.length == 0 ?
            <li className="city-dis">没有找到相关城市</li>:
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
    /**
     * 返回按钮点击处理
     * @method backHandler
     * @return {void}
     */
    backHandler(){
      this.props.onBackFromCity && this.props.onBackFromCity();
    }
    render(){
      return (
        <div className='input-contain w-nearcity' style={{display : this.state.popState ? 'inline-block' : 'none'}}>
          <div className='inner-contian flex-box'>
            <label htmlFor="J-SearchCity">{this.props.labelTitle || '行程开始城市'}</label>
            <Input
              id='J-SearchCity'
              placeholder='请输入开始城市'
              value={this.state.inputValue}
              onFocus={this.inputFoucs.bind(this)}
              onChange={this.searchInput.bind(this)}
              className="flex1-box"
              />
          </div>
          {!this.state.isSearch ? this.renderMain() : this.renderSearch()}
        </div>

      )
    }

  })

  const mapStateToProps = (state) => {
    return {
      isLoading: state.main.isLoading,
    }
  }

  export default connect(mapStateToProps)(Sea);

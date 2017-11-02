import React,{Component,PropTypes} from 'react';
import update from 'react-addons-update';
import Promise from 'bluebird';
import request from 'superagent';
import {Input,Icon,Spin} from 'local-Antd';
import {addEventListener} from '../util/index.jsx';
import {getNavSetting} from './js/getNav_Setting.jsx';
import OnclickOutside from 'react-onclickoutside';
import  './sass/index.scss';


export default OnclickOutside(class SearchNearCity extends Component {
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
  get defaultState(){
    return {
      popState : true, //弹出层状态
      isLoading : true,//ajax请求状态
      cityList : {groupHotCitys:[]},//城市对象
      initialList : [],//Inital数组
      navSet : [],//nav配置
      navActiveIndex : 0,//选中的nav的Index
      hotRending : true,//显示热门还是inital
      inputValue : '',//输入框文本
      isSearch : false ,//是否是搜索
      searchList : [], //搜索列表
    }
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

      this.setState({
        searchList : this.getFilterArr(keyword),
        isLoading : false,
        isSearch : true
      })






  }
  getFilterArr(keyword){
    const reg = new RegExp(keyword,'g');
    return this.state.hotList.groupCitys.filter((item) => {
      return reg.test([item.cityName,item.countryName,item.spell].join(','));
    });

  }
  getHotCitys(){
    this._hotRequest = request
    .get(this.props.hotXHRUrl)
    .end((err,res)=>{
      if(err || res.status != 200){
        return
      }
      this._navSetting = getNavSetting(res.body.data.groupCitys);
      this.setState({
        hotList : res.body.data,
        isLoading : false,
        hotRending : true,
        navSet : this._navSetting
      })
    })
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
    return this.state.hotList.groupHotCitys.map((val,index)=>{
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

  innerItemClick(object,isHot){
    this.setState({
      inputValue : object.cityName,
      popState : false
    });
    this.props.onSelectCity && this.props.onSelectCity(object)
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
    let str = `${obj.cityName}-${obj.countryName}`
    let val = this.state.inputValue;
    if (val == "") {
      return str;
    }
    var reg = new RegExp(val, 'g');
    return str.replace(reg, '<i>' + val + '</i>');
  }
  searchClick(object){
    this.setState({
      popState : false,
      inputValue : object.cityName
    });
    this.props.onSelectCity && this.props.onSelectCity(object);
  }

  renderSearch(){
    return (
      <div className="J-city-wrap J-search-mode" style={{display : this.state.popState ? 'block' : 'none'}}>
        <p className='city-tips-wrap'>输入名称/拼音搜索城市</p>
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
        <div className='input-contain w-nearcity' style={{display : this.state.popState ? 'block' : 'none'}}>
          <div className='inner-contian flex-box'>
            <span onClick={this.backHandler.bind(this)}>
                <Icon type="left" />
            </span>
            <Input
              id='J-SearchCity'
              placeholder='请输入住宿城市'
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

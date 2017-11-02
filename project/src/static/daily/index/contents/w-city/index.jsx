import React,{Component,PropTypes} from 'react';
import { connect } from 'react-redux';
import {updateLoading,updateCurrentMap,showAlert} from '../../action/mainAction.js';
import update from 'react-addons-update';
import Promise from 'bluebird';
import request from 'superagent';
import {Input,Icon,Spin} from 'local-Antd';
import {NAV_LIST} from './js/nav_setting.jsx';
import OnclickOutside from 'react-onclickoutside';
import YdjAjax from 'components/ydj-Ajax';
import  './sass/index.scss';


let Sea =  OnclickOutside(class SearchCity extends Component {
  static propTypes = {
    hotXHRUrl : PropTypes.string.isRequired,
    initialUrl : PropTypes.string.isRequired,
    searchUrl : PropTypes.string.isRequired,
    onSelectCity : PropTypes.func
  }


  constructor(props,context){
    super(props,context);
    this.state = this.defaultState;
  }

  componentDidMount(){
    this.getHotCitys();
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
      inputValue : this.props.defaultVal || '',//输入框文本
      isSearch : false ,//是否是搜索
      searchList : [] //搜索列表
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
      url: this.props.searchUrl,
      // url: 'http://api6-dev.huangbaoche.com/trade/fx/v1.0/cla/merchant/detail',
      data:{keyword:keyword,limit:8,offset:0,type:3},
      abort : true,
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
			// url: 'http://api6-dev.huangbaoche.com/trade/fx/v1.0/cla/merchant/detail',
			data:{serviceType:3,size:20},
			successHandle: (res) => {
          this.setState({
            hotList : res.data,
            isLoading : false,
            hotRending : true
          })
			},
			...this.errorHanlde()
		}
		// this.props.dispatch(showLoading(true));
		new YdjAjax(opt);
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

  getInitialData(initials){
    if(this.getCacheInitailData(initials)){
      this.setState({
        initialList : this.getCacheInitailData(initials),
        isLoading : false,
        hotRending : false
      })
      return;
    }
    // request
    // .get(this.props.initialUrl)
    // .query({serviceType:3,initials:initials})
    // .end((err,res)=>{
    //   if(err || res.status != 200){
    //     return
    //   }
    //   this.setState({
    //     initialList : res.body.data,
    //     isLoading : false,
    //     hotRending : false
    //   });
    //   this.setCacheInitailData(initials,res.body.data);
    // })
    let opt = {
			url: this.props.initialUrl,
			// url: 'http://api6-dev.huangbaoche.com/trade/fx/v1.0/cla/merchant/detail',
			data:{serviceType:3,initials:initials},
			successHandle: (res) => {
          this.setState({
            initialList : res.data,
            isLoading : false,
            hotRending : false
          });
          this.setCacheInitailData(initials,res.data);
			},
			...this.errorHanlde()
		}
		// this.props.dispatch(showLoading(true));
		new YdjAjax(opt);
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
      this.getInitialData(inital);
    }

  }
  renderNav(){

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

  renderMain(){
    return (
      <div className="J-city-wrap" style={{display : this.state.popState ? 'block' : 'none'}}>
        <p className='city-tips-wrap'>输入名称/拼音搜索城市</p>
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
        popState : false,
        inputValue : res.cityName
      });
      this.props.onSelectCity && this.props.onSelectCity(res);
      this.props.dispatch(updateLoading(false));
    })

  }

  renderSearch(){
    const className = this.state.searchList.length == 0 ? 'J-city-wrap J-search-mode no-res' : 'J-city-wrap J-search-mode'
    return (
      <div
          className={className}
          style={{display : this.state.popState ? 'block' : 'none'}}
      >
        {
          (()=>{
            if(this.state.isLoading){
              return <div className='city-loading'>
                      <Spin/>
                    </div>
            }
            return null
          })()
        }
        <ul className="city-list ">
          {
            this.state.searchList.length == 0 ?
            <li className="city-dis">暂无该城市</li>:
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
          <label htmlFor="J-SearchCity">{this.props.labelTitle || '行程开始城市'}</label>
          <Input
            id='J-SearchCity'
            placeholder='请选择开始城市'
            onFocus={this.inputFoucs.bind(this)}
            value={this.state.inputValue}
            onChange={this.searchInput.bind(this)}
            />
          <i className='J-InputDown'></i>
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

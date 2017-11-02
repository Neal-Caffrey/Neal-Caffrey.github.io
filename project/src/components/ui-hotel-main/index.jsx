import React , {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import Request from 'local-Ajax/dist/main.js';
import Storage from 'local-Storage/dist/main.js';
import ApiConfig from "widgets/apiConfig/index.js";
import { updateNav, updateCurrent, updatePage } from 'ACTIONS/listAction.js';
import ListNav from 'components/ui-list-nav/index.jsx';
import Stars from "components/ui-star/index.jsx";
import Score from "components/ui-score/index.jsx";
import Loading from 'components/ui-loading/index.jsx';
import Page from 'components/ui-page/index.jsx';
import searchCss from './sass/index.scss';
import SimulateProgrss from 'components/ui-simulate-progress/index.jsx';
import UIMap from 'components/ui-map/index.js';
const LISTDATE = ApiConfig.storageKey.hotel_list_date;
const HOTELSEARCH = ApiConfig.hotelSearch;

class UIHotelMain extends Component{

  static propTypes = {
    data : PropTypes.object,
    current : PropTypes.number,
    onHandle : PropTypes.func,
  }

  constructor(props,context){
    super(props,context);
    this.request;
    this.storage;
    this.state = this.defaultState;
  }

  get defaultState(){
    const {current, data, list} = this.props;
    return {
      offset : 0,
      limit : 20,
      isLoading:false,
      data : data || list.data,
      current : current || 1,
      auto : true,
      markerSelIndex : -1
    }
  }

  get storage(){
    this._storage = new Storage();
  }

  get request() {
    this._request = new Request();
  }

  get auto(){
    return this.state.auto;
  }

  get offset() {
    return this.state.offset;
  }

  get limit() {
    return this.state.limit;
  }

  get isLoading() {
    return this.state.isLoading;
  }

  get current(){
    return parseInt(this.state.current);
  }

  get sort(){
    return this.state.nav;
  }

  get data(){
    return this.state.data;
  }

  componentWillReceiveProps(nextProps){

    this.setState({...nextProps.list, auto : false, markerSelIndex : 0}, this.getData);
  }

  getStarPrice(term) {
    let obj = {
      star: [],
      price: []
    };
    term.forEach((item, key) => {
      if (item.type === 0) obj.star.push(item.data);
      else obj.price.push(item.data);
    });
    return obj;
  }

  setDateFormat(date){
    let res = [];
    date = [].concat(date);
    date.forEach((item, key) => {
      res.push(item.format('YYYY-MM-DD'));
    });
    return res;
  }

  setSort(sort){
    return {
      sort : sort.orderName,
      order : (sort.star == 'up' || sort.price == 'up') ? 'asc' : 'des',
    };
  }

  getData() {
    let {limit, city, offset, keyword, term, date, nav} = this.state;
    let ops = {
      url: HOTELSEARCH,
      data: {
        destinationId: city ? city.destinationId : '',
        destinationType : city ? city.destinationType : '',
        hotelKeyword : keyword.type == 'input' ? keyword.val :  '',
        hotelId : keyword.type == 'select' ? keyword.val.hotelId : '',
        starRating: this.getStarPrice(term).star.join(','),
        perPrice: this.getStarPrice(term).price.join(','),
        sortOrder : this.setSort(nav).sort,
        orderType : this.setSort(nav).order,
        limit: this.limit,
        offset: this.limit * (this.current-1),
      }
    }
    this.setState({
      isLoading: true,
    })
    this._request.ajax(ops)
      .then((res) => {
        let states = {
          isLoading: false,
        };
        // debugger;
        if (res.status == 200) Object.assign(states, {data : res.data});
        this._storage.set(LISTDATE, this.setDateFormat(date));
        this.setState(states);
      }, (err) => {
        window.location.href='/';
      });

  }

  onHandler(){
    this.props.onHandle && this.props.onHandle.call(this, this.state);
  }

  listNav(nav){
    this.props.dispatch(updateNav({
      current : nav.current,
      auto:nav.auto,
      orderName:nav.orderName,
      price:nav.price,
      star:nav.star,
    }));
    this.props.dispatch(updateCurrent(nav.current));
  }

  onPage(page){
    // debugger;
     this.props.dispatch(updatePage({
      now : page.current,
      pageSize : page.pageSize,
      limit : page.limit,
    }));
     this.props.dispatch(updateCurrent(page.current));
  }

  realImage(src){
    return src ? 'url(' + encodeURI(src) + ')' : null;
  }

  mouseOverHan(index){
    console.log(index);
    if(index !== this.state.markerSelIndex){
      this.setState({
        markerSelIndex : index
      })
    }

  }
  
  render(){
    return (
      <div className='ui-hotel-content' style={{paddingRight : this.data.listData.length > 0 ? '' : '0'}}>
        {
          
          this.isLoading ? <SimulateProgrss auto={true} stop={80} /> :
          this.data.listData.length < 1 ?
          (<div className={this.auto ? 'ui-hotel-auto' : 'ui-hotel-auto ui-hotel-empty'}>
            <p>{this.auto ? '请于页面上方输入您的酒店查询要求' : '请提供有效目的地信息或酒店进行搜索'}</p>
          </div>
          ) : 
          (
            <div className='ui-list-main'>
              <ListNav 
              pageCont={this.data.listCount}
              onHandel={this.listNav.bind(this)}
              current={this.current}
              sort={this.sort}
              />
              <div className='ui-list-view'>
                {
                  this.data.listData.map((item, key) => {
                    return (
                      <dl key={key} onMouseOver={this.mouseOverHan.bind(this,key)}>
                        <dt>
                          <a 
                          href={'/webapp/hotel/detail.html?hotelId=' + item.hotelId}
                          style={{'backgroundImage' : this.realImage(item.hotelImage)}}
                          target='_blank'>
                          </a>
                        </dt>
                        <dd>
                          <a href={'/webapp/hotel/detail.html?hotelId=' + item.hotelId} target='_blank'>
                            <h2>{item.hotelName}</h2>
                            <h3>{item.hotelName != item.hotelNameEn && item.hotelNameEn}</h3>
                          </a>
                          <Stars
                          score={item.starRating}
                          />
                          <p>
                            地址：{item.hotelAddress}
                          </p>
                          <div className='ui-list-footer'>
                            {
                              item.commentRating > 0 &&
                              <div className='ui-list-mty'>
                                <Score
                                half={true}
                                num={item.commentRating}/>
                              </div>
                            }

                            {/*<div className='ui-list-price'>&yen;{item.perPrice}<s>起</s></div>*/}
                              {
                                item.perPrice == 0 ?
                                  <div className='ui-list-price'><s className="non-minimum-price">暂无最低价</s></div>
                                  :
                                  <div className='ui-list-price'>&yen;{item.perPrice}<s>起</s></div>
                              }
                          </div>
                        </dd>
                      </dl>
                      )
                  })
                }
              </div>
              <Page
              total={this.data.listCount}
              onHandle={this.onPage.bind(this)}
              current={this.current} />
            </div>
          )
        }
        <UIMap list={this.data.listData} markerSelIndex={this.state.markerSelIndex}/>
      </div>
    )
  }

}

const mapStateToProps = (state) => {
  return {
    list: state.list
  }
}

export default connect(mapStateToProps)(UIHotelMain);



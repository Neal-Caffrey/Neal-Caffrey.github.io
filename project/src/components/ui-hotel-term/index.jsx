import React , {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import searchCss from './sass/index.scss';
import {updateTerm, updateCurrent} from 'ACTIONS/listAction.js';
import {stars, prices}  from "./js/index.jsx";

class UIHotelTerm extends Component{

  static propTypes = {
    onHandle : PropTypes.func,
  }

  constructor(props,context){
    super(props,context);
    this.state = this.defaultState;
  }

  get defaultState(){
    return {
      starStatus : -1,
      priceStatus : -1,
      starChoseList : stars,
      priceChoseList : prices,
      resultList : [],
    };
  }

  handler(){
    this.props.dispatch(updateTerm(this.resultList));
    this.props.dispatch(updateCurrent(1));
    this.props.onHandle && this.props.onHandle.call(this, this.resultList);
  }

  get starStatus(){
    return this.state.starStatus;
  }

  get starChoseList(){
    return this.state.starChoseList;
  }

  get priceStatus(){
    return this.state.priceStatus;
  }

  get priceChoseList(){
    return this.state.priceChoseList;
  }

  get resultList(){
    return this.state.resultList;
  }

  setChose(key, item, bl){
    item[key].checked = bl;
    return item;
  }

  delChose(key, item){
    let states = {};
    let _resultList = this.resultList;
    let remove = _resultList.splice(key, 1)[0];
    if(remove.type == 1){
      let _priceChoseList = this.priceChoseList;
      let index = _priceChoseList.indexOf(remove);
      _priceChoseList[index].checked = false;
      Object.assign(states, {
        priceChoseList : _priceChoseList,
        priceStatus : -1,
      })

    }else {
      let _starChoseList = this.starChoseList;
      let index = _starChoseList.indexOf(remove);
      let _status = -1;
      _starChoseList[index].checked = false;
      for(let i = 0; i < _starChoseList.length; i++){
        if(_starChoseList[i].checked){
          _status = key;
          break;
        }
      }
      Object.assign(states, {
        starChoseList : _starChoseList,
        starStatus : _status,
      });
    }
    Object.assign(states, {
      resultList : _resultList,

    });
    this.setState(states, this.handler);
  }

  clearItem(item){
    let _resultList = this.resultList;
    item.forEach((item, key) => {
      _resultList.indexOf(item) > -1 && _resultList.splice(_resultList.indexOf(item), 1);
      item.checked = false;
    });
    return {
      result : _resultList,
      chose : item
    };
  }

  setChoseOne(key, item, bl){
    item.map((list, key) => {
      list.checked = false;
    });
    item[key].checked = bl;
    return item;
  }

  clearStar(event){
    let tag = event.target;
    let clear = this.clearItem(this.starChoseList);
    tag.className = 'chose';
    this.setState({
      starStatus : -1,
      starChoseList : clear.chose,
      resultList : clear.result
    }, this.handler);
  }

  clearPrice(event){
    let tag = event.target;
    let clear = this.clearItem(this.priceChoseList);
    tag.className = 'chose';
    this.setState({
      priceStatus : -1,
      priceChoseList : clear.chose,
      resultList : clear.result
    }, this.handler);
  }

  chosePrice(key, event){
    let tag = event.target;
    let _priceChoseList = this.priceChoseList;
    let states = {
      priceStatus : key,
    };
    Object.assign(states, {
      priceChoseList : this.setChoseOne(key, _priceChoseList, tag.checked),
    })
    this.setState(states);
    this.choseResult();
  }

  choseStar(key, event){
    let tag = event.target;
    let _starChoseList = this.starChoseList;
    let states = {
      starStatus : key,
      
    }
     Object.assign(states, {
      starChoseList : this.setChose(key, _starChoseList, tag.checked),
    });
    this.setState(states);
    this.choseResult();
  }

  choseResult(){
    let states = {}, result = [], _starStatus = [], _priceStatus = [];
    this.starChoseList.concat(this.priceChoseList).map((item, key) => {
      if(item.checked) result.push(item);
    });
    Object.assign(states, {
      resultList : result,
    });
    result.map((item, i) => {
      if(item.type === 1 && item.checked) _priceStatus.push(1)
      if(item.type === 0 && item.checked) _starStatus.push(1) ;
    })
    if(_starStatus <= 0) Object.assign(states, {
      starStatus : -1,
    });
    if(_priceStatus <= 0) Object.assign(states, {
      priceStatus : -1,
    });
    this.setState(states, this.handler);
  }

  render(){
    return (
      <div className='ui-hotel-term'>
        <div className='ui-term-mian'>
          <dl className='clearfix'>
            <dt>酒店星级</dt>
            <dd 
            className={this.starStatus == -1 ? 'small select' : 'small'}
            onClick={this.clearStar.bind(this)}><em>不限</em></dd>
            {
              this.starChoseList.map((item, key) => {
                return (
                  <dd key={key}>
                  <input 
                  type='checkbox'
                  id={'star' + key}
                  onChange={this.choseStar.bind(this, key)}
                  checked={item.checked} />
                  <label htmlFor={'star' + key}>{item.text}</label>
                  </dd>)
              })
            }
          </dl>
          <dl className='clearfix'>
            <dt>每晚价格</dt>
            <dd 
            className={this.priceStatus == -1 ? 'small select' : 'small'}
            onClick={this.clearPrice.bind(this)}><em>不限</em></dd>
            {
              this.priceChoseList.map((item, key) => {
                return (
                  <dd key={key}>
                  <input 
                  type='checkbox' 
                  id={'price' + key}
                  onChange={this.chosePrice.bind(this, key)}
                  checked={item.checked} />
                  <label htmlFor={'price' + key} dangerouslySetInnerHTML={{__html: item.text}}></label>
                  </dd>)
              })
            }
            
          </dl>
        </div>
        <div 
        className={this.resultList.length > 0 ? 'ui-term-chose show' : 'ui-term-chose'}>
          {
            this.resultList.map((item, key) => {
              return (
                <del 
                key={key} 
                dangerouslySetInnerHTML={{__html: '<s>' + item.name + '</s>' + item.text}}
                onClick={this.delChose.bind(this, key)}
                ></del>
                )
            })
          }
        </div>
      </div>
    )
  }


}

const mapStateToProps = (state) => {
  return {
    list: state.list
  }
}

export default connect(mapStateToProps)(UIHotelTerm);


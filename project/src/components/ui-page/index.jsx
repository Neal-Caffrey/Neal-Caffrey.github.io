import React , {Component, PropTypes} from 'react';
import IndexCss from "./sass/index.scss";

class UIPage extends Component {

  static propTypes = {
    total : PropTypes.number.isRequired,
    limit : PropTypes.number,
    current : PropTypes.number,
    onHandle : PropTypes.func,
  }

  static defaultProps = {
    total : 0,
    limit : 20,
    now : 1
  }

  constructor(props, context) {
    super(props, context);
    this.state = this.defaultState;
    this._state = {
      pageSize : 0,
      all : [],
      page : [],
      total : this.props.total,
    };
    this.init();
  }

  get defaultState(){
    return {
      now : this.props.current,
    };
  }

  get total(){
    return this._state.total;
  }
  get now(){
    return this.state.now;
  }

  get limit(){
    return this.props.limit;
  }

  get pageSize(){
    return this._state.pageSize;
  }

  get all(){
    return this._state.all;
  }


  get page(){
    return this._state.page;
  }

  get val(){
    return this._state.val;
  }

  get size(){
    return Math.ceil(this.total / this.limit);
  }

  get allSize(){
    let arr = [];
    for(let i = 1; i < this.pageSize; i++) arr.push(i);
    return arr;
  }

  componentWillReceiveProps(nextProps){
    if(this.props != nextProps){
      this.setState({
        now : nextProps.current,
      })
      Object.assign(this._state, {
        total : nextProps.total
      });
      Object.assign(this._state, {
        pageSize : this.size,
      });
      Object.assign(this._state, {
        all : this.allSize,
      });
      Object.assign(this._state, {
        page : this.five(nextProps.current),
      });
    }
  }

  init(){
    Object.assign(this._state, {
      pageSize : this.size,
    });
    Object.assign(this._state, {
      all : this.allSize,
    });
    Object.assign(this._state, {
      page : this.five(this.now),
    })
  }

  five(now, dir){
    let start = 0, end = 0;
    if(dir === 'prev'){
      start = now <= 3 ? 0 : this.pageSize - now < 3 ? this.pageSize - 5 : (now - 4);
      end = now <= 3 ? 5 : this.pageSize - now < 3 ? this.pageSize : now + 1;
    }else if(dir == 'next'){
      start = now < 3 ? 0 : this.pageSize - now <= 3 ? this.pageSize - 5 : (now - 2);
      end = now < 3 ? 5 : this.pageSize - now < 3 ? this.pageSize : now + 3;
    }else{
      start = now <= 3 ? 0 : this.pageSize - now < 3 ? this.pageSize - 5 : (now - 3);
      end = now <= 3 ? 5 : this.pageSize - now < 3 ? this.pageSize : now + 2;
    }
    return this.all.slice(start, end);
  }
  onPrevious(){
    let _now = this.now;
    if(_now <= 1){
      this.setState({
        now : 1,
      });
      return this;
    }else{
      this.setState({
        now : _now - 1,
      }, this.handel);
      Object.assign(this._state, {
        page : this.five(_now, 'prev'),
      });
    }

  }
  onNext(){
    let _now = this.now;
    if(_now > this.pageSize - 1){
      this.setState({
        now : this.pageSize,
      });
      return this;
    }else{
      this.setState({
        now : _now + 1,
      }, this.handel);
      Object.assign(this._state, {
         page : this.five(_now, 'next')
      })
    }

  }

  onValue(event){
    let tag = event.target;
    if(tag.value != '' && /\d+/.test(tag.value)) Object.assign(this._state, {
      val : Math.abs(parseInt(tag.value) || 1),
    })
  }

  onNow(key){
    // 页面未变更
    if(key == this.state.now) return this;
    Object.assign(this._state, {page : this.five(key)});
    this.setState({
      now : key,
    }, this.handel)
  }

  onKeyCode(event){
    let tag = event.target;
    if(event.keyCode == 13) Object.assign(this._state, {
      val : tag.value,
    }, this.onButton);
  }

  onButton(){
    if(!this.val) return this;
    let val = this.val > this._state.pageSize ? this._state.pageSize: this.val;
    
    // 页面未变更
    if(val == this.state.now) return this;
    this.setState({
      now : val,
    }, this.handel);
     Object.assign(this._state, {page : this.five(val)});
  }

  handel(){
    this.props.onHandle && this.props.onHandle.call(this, {
      current : this.now,
      pageSize : this.pageSize,
      all : this.all,
      limit : this.limit,
    });
  }

  render(){
    debugger
    if(this.pageSize < 2) return null;
    return (
      <div className='ui-page'>
        <div className='ui-page-main'>
          <span 
          className={this.now < 2 ? 'ui-page-previous icon-left-arrow noNext' : 'ui-page-previous icon-left-arrow'}
          onClick={this.onPrevious.bind(this)}></span>
          <span
          className='ui-page-number'
          >
            {
              this.now > 3 &&
              <a 
              key={'1_1'}
              className={1 == this.now && 'page'}
              onClick={this.onNow.bind(this, 1)}
              >1</a>
            }
            {
              this.now > 4 &&
              <a
              className='ui-page-more'>...</a>
            }
            {
              this.page.map((item, key) => (<a 
                  className={item == this.now && 'page'}
                  key={key}
                  onClick={this.onNow.bind(this, item)}>{item}</a>)
              )
            }
            {
              this.pageSize - this.now > 3 &&
              <a
              className='ui-page-more'>...</a>
            }
            
            <a
            key={this.pageSize}
            className={this.pageSize == this.now && 'page'}
            onClick={this.onNow.bind(this, this.pageSize)}
            >{this.pageSize}</a>
          </span>
          <span
          className={this.now > this.pageSize - 1 ? 'ui-page-next icon-right-arrow noNext' : 'ui-page-next icon-right-arrow'}
           onClick={this.onNext.bind(this)}></span>
        </div>
        <div className='ui-page-skip'>
          跳转到：
          <input
          type='text'
          onChange={this.onValue.bind(this)}
          onKeyUp={this.onKeyCode.bind(this)}
          defaultValue={this.now}
           />
           <button
           onClick={this.onButton.bind(this)}>GO</button>
        </div>
      </div>
    )
  }
}

export default UIPage;
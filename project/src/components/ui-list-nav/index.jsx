import React , {Component, PropTypes} from 'react';
import IndexCss from './sass/index.scss';

class UIListNav extends Component {

  static propTypes = {
    current : PropTypes.number,
    pageCont : PropTypes.number.isRequired,
    limit : PropTypes.number,
    onHandel : PropTypes.func,
  }

  constructor(props,context) {
    super(props, context);
    this.state = this.defaultState;
  }

  get defaultState(){
    const {current, pageCont, limit, sort} = this.props;
    return {
      orderName : sort.orderName || 'default',
      auto : sort.auto == undefined ? true : sort.auto,
      price : sort.price || false,
      star : sort.star || false,
      current : current || 1,
      limit : limit || 20,
      total : 0,
      cont : pageCont,
    };

  }

  get current(){
    return this.state.current;
  }

  get total(){
    return this.state.total;
  }

  get star(){
    return this.state.star;
  }
  get price(){
    return this.state.price;
  }

  get auto(){
    return this.state.auto;
  }

  componentWillMount(){
    this.setState({
      total : Math.ceil(this.state.cont / this.state.limit)
    })
  }

  componentWillReceiveProps(nextProps){
    // debugger;
    if(this.props.current != nextProps.current)
      this.setState({
        current : nextProps.current,
      });
  }

  defaultDesc(){
    this.setState({
      auto : true,
      star : false,
      price : false,
      orderName : 'default',
    }, this.handel);
  }

  priceDesc(){
    let _price = this.price;
    this.setState({
      auto : false,
      orderName : 'perPrice',
      star : false,
      price : !_price ? 'up' : _price == 'up' ? 'down' : 'up',
    }, this.handel);
  }

  starDesc(){
    let _star = this.star;
    this.setState({
      auto : false,
      orderName : 'starRating',
      price : false,
      star : !_star ? 'up' : _star == 'up' ? 'down' : 'up',
    }, this.handel);
  }

  pageDown(){
    if(this.current < this.total){
      let _current = this.current;
      this.setState({
        current : _current + 1,
      }, this.handel);

    }else{
      this.setState({
        current : this.total,
      });
      return this;
    }
  }

  pageUp(){
    if(this.current <= 1) {
      this.setState({
        current : 1,
      });
      return this;
    }else{
      let _current = this.current;
      this.setState({
        current : _current - 1,
      }, this.handel);
    }

  }

  handel(){
    this.props.onHandel && this.props.onHandel.call(this, this.state);
  }

  renderPage(){
    // debugger;
    if(this.total < 2) return null;
    return (
      <div className='ui-nav-page'>
        <s>{this.current}&nbsp;/&nbsp;{this.total}&nbsp;页</s>
        <a 
        onClick={this.pageUp.bind(this)}
        className={this.current <= 1 ? 'noNext' : ''}>上一页</a>
        <a
        onClick={this.pageDown.bind(this)}
        className={this.current >= this.total ? 'noNext' : ''}>下一页</a>
      </div>
    )
  }

  render(){
    return (
      <div className='ui-list-nav'>
        <div className='ui-nav-desc'>
          <span
          className={this.auto ? 'ui-nav-auto' : ''}
          onClick={this.defaultDesc.bind(this)}>默认</span>
          <code 
          className={this.price == 'up' ? 'icon-sort-up active' : this.price == 'down' ? 'icon-sort-down active' : 'icon-sort-down'}
          onClick={this.priceDesc.bind(this)}>价格</code>
          <code 
          className={this.star == 'up' ? 'icon-sort-up active' : this.star == 'down' ? 'icon-sort-down active' : 'icon-sort-down'}
          onClick={this.starDesc.bind(this)}>星级</code>
        </div>
        {
          this.renderPage()
        }
      </div>
      )
  }
}


export default UIListNav;



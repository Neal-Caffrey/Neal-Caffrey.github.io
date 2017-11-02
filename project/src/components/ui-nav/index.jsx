import React , {Component, PropTypes} from 'react';
import ApiConfig from "widgets/apiConfig/index.js";
import OnclickOutside from 'react-onclickoutside';

import BtnCss from './sass/index.scss';


class UINav extends Component{

  static propTypes = {
    info : PropTypes.array,
    active : PropTypes.number,
    simple : PropTypes.bool,
  }

  constructor(props,context){
    super(props,context);
    this.state = this.defaultState;
  }

  get defaultState(){
    return {
      info : this.list(this.info)
    }
  }

  get info(){
    return this.props.info;
  }

  get simple(){
    return this.props.simple;
  }

  list(infos){
    let info = [];
    if(this.simple) return infos || {};
    (infos || []).map((item, key) => {
      info.push(Object.assign(item, {
        show : false
      }));
    });
    return info;
  }

  get active(){
    return this.props.active;
  }

  actionChild(item, key, event){
    if(this.state.info[key].show) Object.assign(this.state.info[key], {show : false});
    else Object.assign(this.state.info[key], {show : true});
    this.setState(...this.state);

  }

  realUrl(url){
    return url ? ApiConfig.domainHost + url : 'javascript:;';
  }

  renderChild(item, key){
    if(item.children){
      let _child = item.children;
      return (
        <a 
        className={item.show ? "ui-nav-children show-children" : "ui-nav-children"}
        href="javascript:;"
        onClick={this.actionChild.bind(this, item, key)}>
          {item.menu}
          <ol>
            {
              _child.map((list, key) => {
                return (
                  <li key={key}>
                    <a href={this.realUrl(list.nameUrl)}>{list.name}</a>
                  </li>
                  )
              })
            }
          </ol>
        </a>
        )
    }
    return <a href={this.realUrl(item.nameUrl)}>{item.name}</a>;
  }

  rendernav(){
    return this.state.info.map((item, key)=>{
      return(
        <li 
          key={key} 
          className={this.active == key ? 'ui-nav-item-active' : null}>
            {this.renderChild(item, key)}
        </li>
       )   
    })
  }

  handleClickOutside(){
    if(this.props.simple) return;
    this.state.info.map((item, key) => {
      item.show = false;
    });
    this.setState(...this.state);
  }

  componentWillReceiveProps(nextProps){
    let _info = this.list(nextProps.info);
    if( _info != this.info){
      this.setState({
        info : _info
      })
    }
  }


  render(){
    if(this.props.simple) return (
        <div className='ui-nav-simple clearfix'>
          <span>欢迎您，{this.state.info.agentName}</span>
          <em>操作员：{this.state.info.agentUserName}</em>
        </div>
      );
    else return (
      <ul className='ui-nav-wrap'>
        {this.rendernav()}
      </ul>
    )
  }


}

export default OnclickOutside(UINav);

import React, {Component, PropTypes} from "react";
import ApiConfig from "widgets/apiConfig/index.js";
import { connect } from 'react-redux';

import './sass/index.scss';

class Index extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = this.defaultState;
    this._data = {
    	car : {
    		
    	}
    }
  }


  get defaultState(){
    return {
      info : {}
    }
  }

  get menuInfo(){
    return this.state.info.menuInfo ? this.state.info.menuInfo.headMenu : [];
  }

  get carMenu(){
    return this.menuInfo[0] ? this.menuInfo[0].children : [];
  }

  get markMenu(){
    return this.menuInfo[1] ? this.menuInfo[1].children : [];
  }

  realUrl(url){
    return url ? ApiConfig.domainHost + url : 'javascript:;';
  }

  componentWillReceiveProps(nextProps){
    if(!this.state.info.menuInfo){
      this.setState({
        info : nextProps.header.info,
      });
    }
  }

  renderCar(){
    return(
       <div className="images buyer_main">
          {
            this.carMenu.map((item, key) => {
              return (
                  <a href={this.realUrl(item.nameUrl)}>
                      <span></span>
                      <em>{item.name}</em>
                   </a>
                )
            })
          }
       </div>
      );
  }

  renderMark(){
    return(
      <div className="images buyer_else">
        {
          this.markMenu.map((item, key) => {
            return (
                 <a href={this.realUrl(item.nameUrl)}>
                     <span></span>
                   <em>{item.name}</em>
                 </a>
              )
          })
        }
      </div>
    );
  }

  render(){
    return (
        <div className="ui-index">
             <div className="index-wrap">
              <div className="buyer">用车采购</div>
                {this.renderCar()}
                <div className="buyer">其他采购</div>
                {this.renderMark()}
            </div>
          </div>
      )
  }
}

function mapStateToProps(state) {
  return {
    header: state.header,
  }
}

export default connect(mapStateToProps)(Index);


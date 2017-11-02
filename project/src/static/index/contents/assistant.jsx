import React, {Component, PropTypes} from "react";
import ApiConfig from "widgets/apiConfig/index.js";
import { connect } from 'react-redux';
import './sass/assistant.scss';
class TravelAssistant extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = this.defaultState;
  }
  get defaultState(){
    return {
      info : {}
    }
  }

  get menuInfo(){
    return this.state.info.menuInfo ? this.state.info.menuInfo.headMenu : [];
  }

  get travelAssistant(){
    return this.menuInfo[2] ? this.menuInfo[2].children : [];
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

  

  renderPlatform(){
    return(
      <div className="img ui-Assistant">
        {
            this.travelAssistant.map((item, key) => {
              return (
                  <a href={this.realUrl(item.nameUrl)}>
                      <span></span>
                      <div>
                           <em className="item-name">{item.name}</em>
                           <em className="item-desc">{item.desc}</em>
                      </div>
                   </a>
                )
            })
          }
      </div>
    );
  }

  render(){
    return (
        <div className="ui-right">
              <div className="title">行程助手</div>
                {this.renderPlatform()}
          </div>
      )
  }
}

function mapStateToProps(state) {
  return {
    header: state.header,
  }
}

export default connect(mapStateToProps)(TravelAssistant);


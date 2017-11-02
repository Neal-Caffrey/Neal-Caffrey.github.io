import React, {Component,PropTypes} from 'react';
import IndexCss from './sass/index.scss';

class UILoading extends Component{

  constructor(props,context){
    super(props,context);
    this.state = this.defaultState;
  }

  get defaultState(){
    return {
      isLoading : this.props.isLoading || true 
    };
  }

  render(){
    return (
      <div 
      className={this.state.isLoading ? 'ui-loading' : 'ui-loading ui-loading-hide'}>
      <span></span>
      </div>
    )
  }
};

export default UILoading;
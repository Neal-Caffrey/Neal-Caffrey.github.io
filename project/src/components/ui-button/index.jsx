import React , {Component,PropTypes} from 'react';
import BtnCss from './sass/index.scss';
export default class UIButton extends Component{

  static propTypes = {
    title : PropTypes.string,
    uiClassName : PropTypes.string,
    styleObj : PropTypes.object,
    clickHandler : PropTypes.func
  }

  static defaultProps = {
    title : '确定',
  }

  constructor(props,context){
    super(props,context);
    this.state = this.defaultState;
  }

  get defaultState(){
    /*
    btnState : 0 (default), 1 (hover) , 2 (active) , disable (3)
    */
    return {
      title : this.props.title,
      uiClassName : this.props.uiClassName
    }
  }

  get uiClassName(){
    return this.props.uiClassName ? `ui-btn-wrap ${this.props.uiClassName}` : 'ui-btn-wrap';
  }

  render(){
    return (
      <div className={this.uiClassName} style={this.props.styleObj} onClick={this.props.clickHandler && this.props.clickHandler()}>
        <p>{this.props.title}</p>
      </div>
    )
  }


}

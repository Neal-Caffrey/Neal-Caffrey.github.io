import React,{Component,PropTypes} from 'react';
import sass from './sass/index.scss';
export default class UILogo extends Component {

   static propTypes = {
      uiClassName : PropTypes.string,
      link : PropTypes.string,
   }

  constructor(props,context){
    super(props,context);
  }

  get propsClassName(){
    return this.props.uiClassName ? `ui-logo-wrap ${this.props.uiClassName}` : 'ui-logo-wrap';
  }
  render(){
    return (
      <div className={this.propsClassName}>
          <a href={this.props.link || '/'}>
            <div className="ui-logo"
              style={{backgroundImage : `url(${this.props.loginImg})`}}></div>
          </a>
      </div>
    )
  }
}

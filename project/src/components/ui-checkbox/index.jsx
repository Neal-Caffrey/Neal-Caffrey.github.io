import React , {Component,PropTypes} from 'react';
import "components/globleCss/font.scss";
import './sass/index.scss';
export default class UICheckbox extends Component{

  static propTypes = {
    name : PropTypes.string,
    text : PropTypes.string,
    className : PropTypes.string,
    onHandle : PropTypes.func,
    checked : false
  }

  static defaultProps = {
    name : 'test',
    text : 'test',
    className : '',
  }

  constructor(props,context){
    super(props,context);
    this.state = this.defaultState;
  }

  get defaultState(){
    return {
      checked : this.props.checked
    }
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.checked != this.state.checked) this.setState({
        checked : nextProps.checked
      });
  }

  handle(event){
    let target = event.target;
    let _checked = target.checked;
    this.setState({
      checked : _checked
    });
    this.props.onHandle && this.props.onHandle.call(this, _checked, target);
  }

  setClassName(){
    return this.state.checked ? 'ui-checkbox ui-checkbox-select ' : 'ui-checkbox ' + this.props.className;
  }

  render(){
    return (
      <label className={this.setClassName()}>
        <input 
        type="checkbox"
        onClick={this.handle.bind(this)}
        checked={this.state.checked}
        name={this.props.name} />{this.props.text}
      </label>
    )
  }


}
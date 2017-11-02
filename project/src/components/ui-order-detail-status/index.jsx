import React,{Component} from 'react';
import './sass/index.scss';
/*
status
statusDes
*/
export default class UIOrderStatus extends Component{
  constructor(props){
    super(props);
  }
  getClassName(){
    return "ui-order-detail-status-wrap "+this.props.type + '-' + this.props.status
  }
  render(){
    return (
      <div className={this.getClassName()}>
        {
            React.Children.map(this.props.children,(val,index)=>{
              return (
                <span key={index}>{val}</span>
              )

            })
        }
      </div>
    )
  }
}

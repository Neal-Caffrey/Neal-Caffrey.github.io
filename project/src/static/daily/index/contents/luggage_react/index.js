import React from 'react';
import ReactDom from 'react-dom';
// import query from 'widgets/selector/index.js';
require('./index.scss');
const IMG = require("./images/luggage.png");

class Luggage extends React.Component{
  constructor(pros) {
    super(pros);
    this.state = {
     // display:true,
      display : this.props.show,
      img: this.props.img || IMG,
      opacity: this.props.opacity || 0.5
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      display : nextProps.show,
      img: nextProps.img || IMG,
      opacity: nextProps.opacity || 0.5
    });
  }

  _close() {
    this.setState({
      display : false
    });
    this.props.changeHide && this.props.changeHide();
  }
  render() {
    if(this.state.display){
      return (
        <div className="J-luggage-wrap" style={{backgroundColor: `rgba(0, 0, 0, ${this.state.opacity})`}}>
          <div className="img-wrap">
            <img src={this.state.img} alt="退改规则"/>
            <span className="J-closeLuggage" onClick={this._close.bind(this)}></span>
          </div>
        </div>
      );
    }
    return null
  }

}
module.exports = Luggage;

import React , {Component, PropTypes} from 'react';
import IndexCss from './sass/index.scss';
import {
  connect
} from 'react-redux';

import {switchSortor} from '../../action/index.js';
import './sass/index.scss';

class Sortor extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      'orderByField': 1,
      'orderByType': 2,
    };
  }

  componentWillReceiveProps(nextProps) {
    // debugger
    if(this.props.quickSearch != nextProps.quickSearch || this.props.fxOrderStatus != nextProps.fxOrderStatus) {
      // 重置
      this.setState({
          'orderByField': 1,
          'orderByType': 2,
        });
    } else {
      // debugger
      if(nextProps.sortor) {
        this.setState({
          'orderByField': nextProps.sortor.orderByField,
          'orderByType': nextProps.sortor.orderByType,
        });
      }
    }
    
  }

  _changeSort(type) {
    let curInfo = this._getState(type);
    this.props.dispatch(switchSortor(curInfo));
  }

  _getState(type) {
    // debugger
    if(!type) {
      return;
    }
    let curInfo = this.props.sortor || this.state;
    let info = {
      'orderByField': type
    };
    switch (type) {
      case 1:
        if(curInfo.orderByField == 1) {
          info.orderByType = curInfo.orderByType == 1 ? 2 : 1;
        } else {
          info.orderByType = 2;
        }
        break;
      case 2:
        if(curInfo.orderByField == 2) {
          info.orderByType = curInfo.orderByType == 1 ? 2 : 1;
        } else {
          info.orderByType = 2;
        }
        break;
    }
    return info;
  }

  _getClassName(type) {
    // debugger
    let cla = '';
    if (this.state.orderByType == 1) {
      cla += 'icon-sort-up';
    } else {
      cla += 'icon-sort-down';
    }

    switch (type) {
      case 1:
        if (this.state.orderByField == 1) {
          cla += ' active';
        } else {
          cla = 'icon-sort-down';
        }
        break;
      case 2:
        if (this.state.orderByField == 2) {
          cla += ' active';
        } else {
          cla = 'icon-sort-down';
        }
        break;
    }
    return cla;
  }


  render(){
    return (
      <div className='ui-sorter-nav'>
        <div className='ui-sorter-desc'>
          <span>排序：</span>
          <code 
          className={this._getClassName(1)}
          onClick={this._changeSort.bind(this, 1)}>下单日期</code>

          <code 
          className={this._getClassName(2)}
          onClick={this._changeSort.bind(this, 2)}>预约日期</code>
        </div>
      </div>
      )
  }
}


const mapStateToProps = (state) => {
  return {
    sortor: state.main.sortor,
    quickSearch: state.main.quickSearch,
    fxOrderStatus: state.main.fxOrderStatus,
  }
}

export default connect(mapStateToProps)(Sortor);

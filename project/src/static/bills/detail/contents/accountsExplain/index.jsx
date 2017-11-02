import React, {
  Component
} from 'react';
import {
  connect
} from 'react-redux';
import {Row, Col, Spin,Icon} from 'local-Antd';
import Page from 'components/ui-page/index.jsx';
import 'moment/locale/zh-cn';
import billsTableCss from './sass/index.scss';
import {showAccounts, showLoading, showAlert} from '../../action/index.js';
 class AccountsExplain extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
       datas: this.props.dataSource,
       pageSource:this.props.dataSource,
      };
    console.log(this.props.dataSource);debugger
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
       datas: nextProps.dataSource,
       pageSource:nextProps.dataSource,
    });
  }

  _close() {
    console.log('a');
    this.props.dispatch(showAccounts(false));
    // $('body').css({'overflow': 'scroll'});

  }
  render() {
    return (
      <div className="accounts-Explain">
            <div className="mask"></div>
            <div className="accounts-wrap">
            <div className="head">结算说明<Icon className="close" type="close" onClick={this._close.bind(this)}/></div>
            <p>{}</p>
            
            </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  // debugger
  return {
      renderAccount: state.main.renderAccount,
  }
}

export default connect(mapStateToProps)(AccountsExplain);
import React, {
  Component
} from 'react';
import {
  Provider,
  connect
} from 'react-redux';
import Header from 'contents/header/index.jsx';
import LeftSide from './contents/left-side/index.jsx';
import RightSide from './contents/right-side/index.jsx';
import Loading from 'components/ui-loading/index.jsx';
import Msg from 'components/ui-msg/index.jsx';
import {removeAlert} from './action/leftSideAction.js';
import BaseCss from 'local-BaseCss/dist/main.css';
import GlobleCss from 'components/globleCss/index.scss';
import IndexCss from './sass/index.scss';

class App extends Component {

  render() {
    return (
      <div id='ui-wrap'>
        <Header />
        {
          (()=>{
            if(!this.props.header || !this.props.header.info){
              return null;
            }
            return (
              <div className="page-content">
                <LeftSide />
                <RightSide />
              </div>
            )
          })()
        }
        {
          ((isLoading)=>{
            let res = [];
            if(isLoading){
              res.push(<Loading/>)
            }
            return res;
          })(this.props.loading)
        }
        {
          (() => {
              let res = [];
              if (this.props.isAlert) {
                let attr = {
                  showFlag: true,
                  showType: 'alert', // info alert confirm
                  backHandle: () => {
                    this.props.dispatch(removeAlert());
                    if (this.props.alertMsg.goLogin) {
                      window.location.href = '/';
                    }
                  }
                };
                res.push(<Msg initData = {attr}><p>{this.props.alertMsg.msg}</p></Msg>)
              }
              return res;
            })()
        }
      </div>
    )
  }
}


// export default App;

function mapStateToProps(state) {
  const {loading,isAlert,alertMsg} = state.leftSide;

  const {
    header,
  } = state

  return {header,loading,isAlert,alertMsg}
}

export default connect(mapStateToProps)(App)

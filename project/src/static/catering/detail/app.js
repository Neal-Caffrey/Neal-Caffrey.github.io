import React, {
  Component
} from 'react';
import {
  connect
} from 'react-redux';

 import Header from 'contents/header/index.jsx';
 import Footer from 'contents/footer/index.jsx';
import Loading from 'components/ui-loading/index.jsx';
import Detail from './contents/merDetail/index.jsx';

import BaseCss from 'local-BaseCss/dist/main.css';
import GlobleCss from 'components/globleCss/index.scss';
import swiperCss from './sass/swiper.scss';
import indexCss from './sass/dining.scss';
import Msg from 'components/ui-msg/index.jsx';
const ISShowConsult = ((domain)=>{
  let reg = /www/;
  return reg.test(domain);
})(document.domain);
import {
  removeAlert
} from './action/index.js';

class App extends Component {
  render() {
    return (
      <div id='ui-wrap'>
        <Header active={4}/>
        <Detail/>
        {
        	(()=> {
        		let res = [];
        		if(this.props.isLoading) {
        			res.push(<Loading/>)
        		}
        		return res;
        	})()
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
        {ISShowConsult ? <Footer /> : null}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  // debugger
  return {
    isLoading: state.main.isLoading,
    isAlert: state.main.isAlert,
    alertMsg: state.main.alertMsg
  }
}

export default connect(mapStateToProps)(App);

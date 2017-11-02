import React, {
  Component
} from 'react';
import {
  connect
} from 'react-redux';
import ApiConfig from 'widgets/apiConfig';
import Header from 'contents/header/index.jsx';
import Footer from 'contents/footer/index.jsx';
import Loading from 'components/ui-loading/index.jsx';
import Uploader from '../detail/contents/uploader/index.jsx';

import BaseCss from 'local-BaseCss/dist/main.css';
import GlobleCss from 'components/globleCss/index.scss';
import css from './sass/index.scss';

const ISShowConsult = ((domain)=>{
  let reg = /www/;
  return reg.test(domain);
})(document.domain);

class App extends Component {
  render() {
    // const attr = {
    //     sendFlag: false
    // }
    const attr = {
      sendFlag: true,
      fileList: [{
        uid: -1,
        url: `${ApiConfig.fileHost}/fr-hb-t/DCVe774m4w0`,
      }]
     };
     // const attr = {
     //  sendFlag: false,
     //  fileList: [{
     //    uid: -1,
     //    url: `${ApiConfig.fileHost}/fr-hb-t/DCVe774m4w0`,
     //  }]
     // };
    return (
      <div id='ui-wrap'>
        <Header active={4}/>
        <div className="wrapper ui-main ui-order-list ui-fixed-footer">
          <div className="op-row">
            <Uploader {...attr}/> 
            <a className="excel" href="https://fr-hb-t.huangbaoche.com/H2jFnBe1uQ0?" target="_blank">下载Excel账单明细</a>
            <a className="pdf" href="https://fr-hb-t.huangbaoche.com/H2jFnBe1uQ0?" target="_blank">下载PDF账单</a>
          </div>
        </div>
        <Footer />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {}
}

export default connect(mapStateToProps)(App);

import React, {
  Component,
} from 'react';
import {
  connect
} from 'react-redux';
import Header from 'contents/header/index.jsx';
import Footer from 'contents/footer/index.jsx';
import HotelSearch from 'components/ui-hotel-search/index.jsx';
import HotelTerm from './contents/term/index.jsx';
import HotelMain from 'components/ui-hotel-main/index.jsx';
import UiConsult from "components/ui-consult/index.jsx";
import BaseCss from 'local-BaseCss/dist/main.css';
import GlobleCss from 'components/globleCss/index.scss';
import BaseHotelCss from '../sass/index.scss';
import './sass/index.scss';
import $ from 'local-Zepto/dist/main.js';
const ISShowConsult = ((domain)=>{
  let reg = /www/;
  return reg.test(domain);
})(document.domain);
class App extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = this.defaultState;
    this.styles = {

    }
  }

  get defaultState() {
    return {};
  }

  render() {
    return (
      <div id='ui-wrap'>
        <Header active={3} />
        <div className='ui-main ui-fixed-footer' style={{minHeight:$(window).height()-68-100-20+'px'}}>
          <div className='ui-hotel-main' style={{minHeight:$(window).height()-68-100-20+'px'}}>
            <HotelSearch />
            <HotelTerm />
            <HotelMain />
            {ISShowConsult ? <UiConsult /> : null}
          </div>
        </div>
        {ISShowConsult ? <Footer /> : null}
      </div>
    )
  }
}

function mapStateToProps(state) {
  // debugger
  return {
    list: state.list
    // header : state.header
  }
}

export default connect(mapStateToProps)(App);

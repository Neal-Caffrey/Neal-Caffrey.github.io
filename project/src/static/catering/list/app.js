import React, {
  Component
} from 'react';

import Header from 'contents/header/index.jsx';
import Footer from 'contents/footer/index.jsx';
import SearchCon from './contents/searchcon/index.jsx';
import Term from './contents/term/index.jsx';
import Nav from './contents/nav/index.jsx';
import Cont from './contents/cont/index.jsx';
// import UiConsult from "components/ui-consult/index.jsx";
const ISShowConsult = ((domain)=>{
  let reg = /www/;
  return reg.test(domain);
})(document.domain);
import BaseCss from 'local-BaseCss/dist/main.css';
import GlobleCss from 'components/globleCss/index.scss';
import './sass/index.scss';
class App extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = this.defaultState;
  }

  get defaultState() {
    return {};
  }

  handle(data) {
    console.log(data);
  }

  render() {
    return (
      <div id='ui-wrap'>
        <Header active={4} />
        <div className="ui-main">
          <SearchCon />
          <Term />
          <Nav />
          <Cont />
        </div>
        {ISShowConsult ? <Footer /> : null}
      </div>
    )
  }
}

export default App;

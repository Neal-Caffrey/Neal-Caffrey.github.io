import React, {
  Component
} from 'react';
import {
  Provider,
  connect
} from 'react-redux';
import Header from 'components/header/index.jsx';
import Footer from 'contents/footer/index.jsx';
import LeftSide from 'components/left-side/index.jsx';
import RightSide from 'components/right-side/index.jsx';
import MiddleSlide from 'components/middle-slide/index.jsx';
import BottomSide from 'components/bottom-side/index.jsx';
import BaseCss from 'local-BaseCss/dist/main.css';
import GlobleCss from 'components/globleCss/index.scss';

class App extends Component {
  render() {
    return (
      <div id='ui-wrap'>
        <Header />
        <div className="ui-main ui-fixed-footer">
          <LeftSide/>
          <MiddleSlide/>
          <RightSide/>
          <BottomSide/>
        </div>
          <Footer />
      </div>
    )
  }
}


function mapStateToProps(state) {
  const {
    leftSide
  } = state

  return Object.assign({}, leftSide)
}

export default connect(mapStateToProps)(App)
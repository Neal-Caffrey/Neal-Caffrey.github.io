import React, {
  Component
} from 'react';
import {
  Provider,
  connect
} from 'react-redux';

import Header from "contents/header/index.jsx";
import Index from "./contents/index.jsx";
import TravelAssistant from "./contents/assistant.jsx";
import BaseCss from 'local-BaseCss/dist/main.css';
import GlobleCss from 'components/globleCss/index.scss';

class App extends Component {
  render() {
    return (
      <div id='ui-wrap'>
        <Header
        simple={true}/>
        <div className="ui-main">
          <Index />
          <TravelAssistant/>
        </div>
      
      </div>
    )
  }
}

export default App;

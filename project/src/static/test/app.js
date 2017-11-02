import React, {
  Component,
  PropTypes
} from 'react';
import {
  Provider,
  connect
} from 'react-redux';
import {
  Button
} from 'local-Antd';
import RoomSelect from 'components/ui-number-select/index.jsx';
import GuestSelect from 'components/ui-hotel-guest/index.jsx';
import NumberSelect from 'components/ui-number/index.jsx';
import Msg from 'components/ui-msg/index.jsx';
import BaseCss from 'local-BaseCss/dist/main.css';
// import UIDiningCity from "components/ui-dining-city/index.jsx";
import GlobleCss from 'components/globleCss/index.scss';
import IndexCss from './sass/index.scss';
class App extends Component {
  constructor() {
    super();
    this.state = {
      alertAttrAsyn: this.alertAttrAsyn
    }
  }
  get alertAttr() {
    return {
      title: '提示1',
      content: '<span style="color: red">jfslefjslkfjseokfjowjj</span>',
      showFlag: true,
      showType: 'confirm', // info alert confirm
      backHandle: this._handle.bind(this)
    }
  }
  get alertAttrAsyn() {
    return {
      asyn: true,
      title: '提示2',
      content: '<span style="color: red">jfslefjslkfjseokfjowjj</span>',
      showFlag: true,
      showType: 'alert', // info alert confirm
      backHandle: this._handleAsyn.bind(this)
    }
  }
  _handle(key) {
    console.log('---_handle' + key);
  }
  _handleAsyn(key) {
    console.log('---_handleAsyn' + key, this.state);
    let state = this.alertAttrAsyn;
    state.showFlag = false;
    if (key == 'ok') {
      // 此处假设只有ok按钮异步请求
      // 模仿异步请求完成
      setTimeout(() => {
        this.setState(state);
      }, 5000)
    }

  }
  _changeRoom(val) {
    console.log('当前房间数', val);
  }
  _changeGuest(val) {
    console.log('当前选择Guest Info', val);
  }

  _changeNm(val) {
    console.log('当前选择Nm Info', val);
  }
  get showModal() {
    return true;
  }

  get guestInit() {
    let childAges = [{
      defValue: 2
    }, {
      defValue: 5
    }];
    return {
      childAges: [],
      adultMin: 1,
      adultMax: 10,
      adultNum: 2,
      childMin: 0,
      childMax: 5,
      childNum: 0,
      ageMin: 1,
      ageMax: 17,
      ageDef: 1,
      confirmHandler: this._changeGuest.bind(this),
      uiClassName: 'abc'
    }
  }
  renderTest1() {
    return (
      <RoomSelect  defValue="30"
        minNum={15}
        maxNum={50}
        uiClassName="room-select"
        uiPlaceholder="选择房间数"
        postfix="间"
        selectedHandler={this._changeRoom.bind(this)}/>
    );
  }

  renderTest2() {
    return ( < NumberSelect defValue = "20"
      minNum = {
        15
      }
      maxNum = {
        30
      }
      uiClassName = "nm-select"
      uiPlaceholder = "数量"
      selectedHandler = {
        this._changeNm.bind(this)
      }
      />);
    }
    renderTest3() {
      return ( < GuestSelect initData = {
          this.guestInit
        }
        /> 
      )
    }

    renderTest4() {
      return ( < Msg initData = {
          this.state.alertAttrAsyn
        } >
        <p>{this.state.alertAttrAsyn.content}</p> < /Msg>
      )
    }

    renderTest2() {
      return (
        <UIDiningCity 
        keys='name'
        data={[{'id' :'1', 'name': '南非'},{'id' : '2', 'name' : '北非'},{'id' : '3', 'name' : '日韩'},{'id' : '4', 'name' : '港澳台'},]}/>
      )
    }

    render() {}
  }


  function mapStateToProps(state) {

    return Object.assign({}, {})
  }

  export default connect(mapStateToProps)(App)
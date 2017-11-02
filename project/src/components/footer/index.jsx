import React,{Component,PropTypes} from 'react';
import { connect } from 'react-redux';
import Storage from 'local-Storage/dist/main.js';
import ApiConfig from "widgets/apiConfig/index.js";
import FooterCss from './sass/index.scss';

const APPINOF = ApiConfig.storageKey.hotel_app_info;

class Footer extends Component{
  constructor(props,context){
    super(props,context);
    this.storage;
    this.state = this.defaultState;
  }

  get defaultState(){
    return {
      menu : this._storage.get(APPINOF)
    };
  }

  get storage(){
    return this._storage = new Storage;
  }

  get menu(){
    return this.state.menu;
  }

  componentWillReceiveProps(nextProps){
    if(!this.menu)
      this.setState({
        menu : nextProps.header.info,
      });
  }

  render(){
    return (
      <div className='ui-footer'>
        <ul className='clearfix'>{
           this.menu && this.menu.menuInfo.leftMenu_b[0].children.map((item, key) => {
              return (<li key={key}>
                <a href={'/' + item.nameUrl} title={item.name}>{item.name}</a>
              </li>);
           })
         }
        </ul>
        <p>
          Copyright © 2016 纯粹旅行 版权所有
          <em>京ICP备14020952号-4</em>
        </p>
      </div>
    )
  }
};

const mapStateToProps = (state) => {
  return {
    header: state.header
  }
}

export default connect(mapStateToProps)(Footer);

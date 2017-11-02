import React,{Component} from 'react';
import OnclickOutside from 'react-onclickoutside';
import {Input,Spin} from 'local-Antd';
import './sass/index.scss';
// import request from 'superagent';
import YdjAjax from 'components/ydj-Ajax';

export default OnclickOutside(class SearchPlace extends Component {

  constructor(props,context){
    super(props,context);
    this.state = {
      inputVal : this.props.placeVo && this.props.placeVo.placeName || '',
      isLoading : false,
      placeList : []
    }
  }
  componentWillReceiveProps(nextProps) {
      this.setState({
        inputVal : nextProps.placeVo ? nextProps.placeVo.placeName : ''
      })
  }
  inputFocus(proxy){
    this.setState({
      popState : true,
      inputVal : proxy.target.value
    });
  }
  inputChange(proxy){
    let inputVal = proxy.target.value;
    inputVal && this.fetchAirCodeList(inputVal,this.props.cityId);
    this.setState({
      inputVal,
      isLoading : inputVal ? true : false
    });

  }
  handleClickOutside(){
    this.setState({
      popState : false
    });
  }
  fetchAirCodeList(keyword,cityId){
    // this._request && this._request.abort();
    // this._request = request
    // .get(this.props.searchPlaceXHR)
    // .query({keyword,cityId,limit:20,offset:0})
    // .end((err,res)=>{
    //   if(err || res.status != 200){
    //     return
    //   }
    //   this.setState({
    //     placeList : res.body.data.places,
    //     isLoading : false
    //   })
    // })
    let opt = {
      url: this.props.searchPlaceXHR,
      data:{keyword,cityId,limit:20,offset:0},
      abort : true,
      successHandle: (res) => {
          this.setState({
            placeList : res.data.places,
            isLoading : false
          })
      },
      // ...this._handleErrors
    }
    new YdjAjax(opt);
  }
  liClick(index,obj){
    this.props.onSelectPlace && this.props.onSelectPlace(obj);
    this.setState({
      popState : false,
      inputVal : obj.placeName
    });
  }



  render(){
    return (
      <div className='w-searchplace-wrap'>
        <Input
          disabled={this.props.cityId > -1 ? false : true}
          id={this.props.id || 'pickup-place'}
          placeholder={this.props.placeholder || '请选择送达地点'}
          value={this.state.inputVal}
          onFocus={this.inputFocus.bind(this)}
          onChange={this.inputChange.bind(this)}
          />
        {
          this.state.popState===true ?
          <div className='w-place-ul' style={{width : '300px'}}>
            {
              !this.state.inputVal && <div className='w-place-tips'>请输入地点关键字</div>
          }
          {
            this.state.isLoading && <div className='w-place-loading'><Spin/></div>
          }
          {
            !this.state.isLoading && this.state.inputVal && !this.state.popStateAir &&
            <ul>
              {
                this.state.placeList.length > 0 ? this.state.placeList.map((val,index)=>{
                  return (
                    <li key={index} onClick={this.liClick.bind(this,index,val)}>
                        <strong>{val.placeName}</strong>
                        <p>{val.placeAddress}</p>
                    </li>
                  )
                }) :
                <li className='no-res'>找不到您输入的地点</li>
              }
            </ul>
          }
        </div> :
        null
      }
    </div>
    )
  }
})

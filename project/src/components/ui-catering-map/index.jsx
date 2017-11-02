/**
 * @author Kepeng 2017/07/19
 * @description 餐厅订座地图
 * @param {
 *     changeHide, 关闭(父组件回调)
 *     show: true,
 *     detail: {
 *     		lat: **,
 *     		lng: **,
 *     		merchantNameLocal: **,
 *     		merchantName: **
 *     }
 * }
 */
import React, {
	Component
} from 'react';
import {
  connect
} from 'react-redux';
require('./index.scss')
import UIMap from 'components/ui-detail-map/index.js';

class MerMap extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			show : this.props.show
		}
	}
	getHotelPosition(){
		let hotelVo = {};
		hotelVo.hotelLatitude = this.props.detail.lat;
		hotelVo.hotelLongitude = this.props.detail.lng;
		hotelVo.hotelNameEn = this.props.detail.merchantNameLocal;
		hotelVo.hotelName = this.props.detail.merchantName;
		return [
			hotelVo
		]
	}
	componentWillReceiveProps(nextProps) {
	  this.setState({
	    show: nextProps.show
	  });
	}
	_close() {
		// this.setState({
		//   show : false
		// });
		this.props.changeHide && this.props.changeHide();
	}
	render() {
		if(this.state.show){
			return (
				<div className="photo-graph">
					<div className="photo-overlay"></div>
					<div className="map-wrap">
						<div className="map-header">
							<span className="position">商户位置</span>
							<i className="close anticon anticon-close " onClick={this._close.bind(this)}></i>
						</div>
				  	<div className="map-container">
						<UIMap list={this.getHotelPosition()} markerSelIndex={0}/>
					</div>
					</div>
				</div>
			)
		}
		return null;
		
	}

}

module.exports = MerMap;
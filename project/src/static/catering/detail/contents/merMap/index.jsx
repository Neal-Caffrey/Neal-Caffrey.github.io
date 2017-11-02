import React, {
	Component
} from 'react';
import {
  connect
} from 'react-redux';
import $ from 'local-Zepto/dist/main.js';
import {showMap} from '../../action/index.js';
import UIMap from 'components/ui-detail-map/index.js';

class MerMap extends Component {
	constructor(props, context) {
		super(props, context);
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
	_showMap() {
		this.props.dispatch(showMap(false));
		$('body').css({'overflow': 'scroll'});

	}
	render() {
		return (
			<div className="photo-graph">
				<div className="photo-overlay"></div>
				<div className="map-wrap">
					<div className="map-header">
						<span className="position">商户位置</span>
						<i className="close anticon anticon-close " onClick={this._showMap.bind(this)}></i>
					</div>
			  	<div className="map-container">
					<UIMap list={this.getHotelPosition()} markerSelIndex={0}/>
				</div>
				</div>
			</div>
		)
	}

}
const mapStateToProps = (state) => {
  return {
    detail: state.main.detail
  }
}

export default connect(mapStateToProps)(MerMap);
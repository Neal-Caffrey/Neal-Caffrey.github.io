import React, {
	Component
} from 'react';
import {
	connect
} from 'react-redux';
import ApiConfig from 'widgets/apiConfig/index.js';
import YdjAjax from 'components/ydj-Ajax/index.js';
import './sass/index.scss';
import "components/globleCss/font.scss";

class TravelPreview extends Component {
  	constructor(props, context) {
    	super(props, context);
    	this.state = {

    	};
		this.data = props.routeItemList;
  	}
	//格式化时间，分钟=>时分
	formatTime(min) {
		let h,m,res;
		h = Math.floor(min/60);
		m = min%60;
		if(h == 0){
			res = `${m}m`
		}
		else if(m == 0) {
			res = `${h}h`
		}
		else {
			res = `${h}h${m}m`
		}
		return res;
	}
	//获取星期
	getWeek(num) {
		let week = '';
		let	arr = ['周一','周二','周三','周四','周五','周六','周日'];
		week = arr[num-1];
		return week;
	}
	//城市
	renderCity(arr) {
		return(
			arr.map((city,cityIndex)=>{
				return(
					<div className="city-item">
						<h4 className="city-name">
							<span className="icon-city"></span>
							{city.routeCityName}
						</h4>
						<p className='place-diff'>
							{
								city.spotList.map((val,key)=>{
									return(
										<span className="place-name">{val}</span>
									)
								})
							}
						</p>
					</div>
				)
			})
		)
	}
	//交通
	renderTraffic(arr) {
		return(
			arr.map((traffic,trafficId)=>{
				if(traffic.trafficType == 101){
					return(
						<div>
							<h4 className="vehicle-name"><span className="icon-plane_1"></span>飞机：</h4>
							<div className="travel-destination-info">
								<p className='travel-destination'>
									{traffic.depCityName}-{traffic.arrCityName}
								</p>
								<p className="travel-flight">{traffic.trafficNumber}</p>
								<p className='travel-time'>
									{traffic.depTime.substr(11,5)} - {traffic.arrTime.substr(11,5)}<span className="duration">{this.formatTime(traffic.trafficDuration)}</span>
								</p>
							</div>
						</div>
					)
				}
				else {
					return(
						<div>
						{
							traffic.trafficType == 102 && <h4 className="vehicle-name"><span className="icon-train"></span>火车：</h4>
						}
						{
							traffic.trafficType == 103 && <h4 className="vehicle-name"><span className="icon-ship"></span>轮渡：</h4>
						}
						{
							traffic.trafficType == 104 && <h4 className="vehicle-name"><span className="icon-car"></span>包车：</h4>
						}
						<div className="travel-destination-info hire-car">
							<p className='travel-destination'>
								{traffic.depCityName}-{traffic.arrCityName}
							</p>
							<p className='travel-time'>
								{traffic.depTime.substr(11,5)} - {traffic.arrTime.substr(11,5)}
							</p>
						</div>
						</div>
					)
				}
			})
		)
	}
	//酒店
	renderHotel(arr) {
		return(
			arr.map((hotel,hotelId)=>{
				return(
					<div className="hotel-item">
						<h4 className="hotel-title"><span className="icon-hotel_1"></span>酒店：</h4>
						<div className="travel-hotel-info">
							<a href={`${ApiConfig.apiHost}webapp/hotel/detail.html?hotelId=${hotel.hotelId}`} target="_blank"><p className='hotel-name'>{hotel.hotelName}</p></a>
							<p className="reside-night">1晚</p>
						</div>
					</div>
				)
			})
		)

	}
  	render(){
        console.log('render travelPreview', this.props);

    	return (
	    <div className="travel-preview-par">
	    	<div className="travel-preview">
			{
				this.data.map((item,day)=>{
					return(
						<section className='travel-day'>
							<div className="day-head">
								<h3 className="preview-title">
									<span className="day">D{day+1}</span>
									{item.depCityName}-{item.arrCityName}
									<span className="date">
										{item.routeDate} {this.getWeek(item.routeDayOfWeek)}
									</span>
								</h3>
								{
									item.routeHighlight ?
									<p className='day-detail'>
										本日亮点：{item.routeHighlight}
									</p> : null
								}

							</div>
							<div className='travel-consume-type'>
								<ul className="type-list">
									<li className="travel-city">
										{item.routeItemCityList.length>0 && this.renderCity(item.routeItemCityList)}
									</li>
									<li className="travel-vehicle">
										{item.routeItemTrafficList.length>0 && this.renderTraffic(item.routeItemTrafficList)}

									</li>
									<li className="travel-hotel">
										{item.routeItemHotelList.length>0 && this.renderHotel(item.routeItemHotelList)}
									</li>
								</ul>
							</div>
						</section>
					)

				})
			}
	  	 	</div>
	    </div>

    	)
  	}
}

function mapStateToProps(state) {
    return {
        routeItemList: state.main.routeItemList
    }
}

export default connect(mapStateToProps)(TravelPreview)

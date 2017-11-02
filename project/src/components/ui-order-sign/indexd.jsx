import React , {Component, PropTypes} from 'react';

import Star from "components/ui-star/index.jsx";

import signCss from './sass/index.scss';

class UIOrderSign extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = this.defaultState;
	}

	get defaultState(){
		const {info} = this.props;
		return {
			info : info || {}
		};
	}

	get info(){
		return JSON.parse(this.state.info).hotel.hotelVo || {};
	}

	realImage(src){
	    return src ? 'url(' + encodeURI(src) + ')' : null;
	}

	render(){
		return (
			<div className='ui-order-sign'>
				<dl>
					<dt>
						<span 
						alt={this.info.cnname}
						title={this.info.cnname}
						style={{'backgroundImage' : this.realImage(this.info.defaultHotelImage)}}>
						</span>
					</dt>
					<dd>
						<h1>{this.info.name}</h1>
						<h2>{this.info.nameEn}</h2>
						<Star
						score={this.info.starRating || 0} />
						<p>
							地址：{this.info.address}
						</p>
						<p>
							电话：{this.info.telephone}
						</p>
					</dd>
				</dl>
			</div>

			)
	}
}

export default UIOrderSign;

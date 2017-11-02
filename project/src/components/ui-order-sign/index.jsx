import React , {Component, PropTypes} from 'react';
import Star from "components/ui-star/index.jsx";

import signCss from './sass/index.scss';

class UIOrderSign extends Component {
	static propTypes = {
		info : PropTypes.object
	}
	constructor(props, context) {
		super(props, context);
		this.storage;
		this.state = this.defaultState;
	}

	get defaultState(){
		const { info } = this.props;
		return {
			info : info || {}
		};
	}

	get info(){
		return this.state.info.hotelInfo;
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
						<h1>{this.info.cnname}</h1>
						<h2>{this.info.enname}</h2>
						<Star
						score={this.info.starRating} />
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
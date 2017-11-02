import React, {
	Component
} from 'react';
import { connect } from 'react-redux';
import {showAblum} from '../../action/index.js';
import './sass/index.scss';

class Cars extends Component {
	constructor(props, context) {
		super(props, context);
		this.data = props.carInfo
	}

	showAblum(index,i){
		let imgs = [];
		this.data[index].carPhotoL.map((url,item)=>{
			let imgInfo = {
				imageUrl: url
			}
			imgs.push(imgInfo);
		})
		let opt = {
			isShowAblum: true,
			ablumImages: imgs,
			ablumIndex: i
		}
		this.props.dispatch(showAblum(opt));
	}
	render() {
		if(this.data.length){
			return (
				<div className="carWrap">
					{
						this.data.map((item,index)=>{
							return(
								<div className="car-item">
									<p className="car-name">{item.carName}</p>
									<p className="car-info">{item.carInfo}</p>
									<div className="car-photo clearfix">
										{
											item.carPhotoL.map((url,i)=>{
												return(
													<img src={url} onClick={this.showAblum.bind(this,index,i)}/>
												)
											})
										}
									</div>
								</div>
							)
						})
					}
				</div>
			)
		}
		else {
			return (
				<div className="carWrap">
					<div className="tab-empty">
						<p>司导暂未上传车辆信息</p>
				  	</div>
				</div>
			)
		}

	}
}

// export default Cars;
const mapStateToProps = (state) => {
    return {
        ablumInfo: state.ablumInfo
    }
}

export default connect(mapStateToProps)(Cars);

import React, {
	Component
} from 'react';
import { connect } from 'react-redux';
import {showAblum} from '../../action/index.js';
import './sass/index.scss';

class Album extends Component {
	constructor(props, context) {
		super(props, context);
        this.imgs = [];
		this.data = props.photos
	}

	showAblum(index){
		let opt = {
			isShowAblum: true,
			ablumImages: this.imgs,
			ablumIndex: index
		}
		this.props.dispatch(showAblum(opt));
	}
	render() {
        let imgs = [];
		if(this.data.length){
			return (
				<div className="photoWrap clearfix">
					{
						this.data.map((item,index)=>{
	                        let opt = {
	                            imageUrl: item.cardPhotoSrcL
	                        }
	                        imgs.push(opt);
	                        this.imgs = imgs;
							return(
								<img src={item.cardPhotoSrcL} onClick={this.showAblum.bind(this,index)}/>
							)
						})
					}
				</div>
			)
		}
		else {
			return (
				<div className="photoWrap">
					<div className="tab-empty">
						<p>司导暂未上传照片</p>
					</div>
				</div>
			)
		}

	}
}

const mapStateToProps = (state) => {
    return {
        ablumInfo: state.ablumInfo
    }
}

export default connect(mapStateToProps)(Album);

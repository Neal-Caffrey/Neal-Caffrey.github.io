import React, {
	Component
} from 'react';
import { isEmptyObject } from 'components/util/index.jsx';
// import {showAblum} from '../../action/index.js';
import './sass/index.scss';

class Story extends Component {
	constructor(props, context) {
		super(props, context);
        // this.imgs = [];
		this.data = props.story
	}

	render() {
		if(isEmptyObject(this.data)){
			return (
				<div className="storyCont">
					<div className="tab-empty">
						<p>司导暂未上传故事</p>
					</div>
				</div>
			)
		}
		return (
			<div className="storyCont">
                <h2>{this.data.storyTitle}</h2>
                <img src={this.data.storyCover} className="story-cover"/>
                {
                    this.data.storyContent.map((item,index)=>{
                        return(
                            <div className="section">
                                <p>{item.text}</p>
                                {item.imgSrcL ?<img src={item.imgSrcL} /> : null}
                            </div>
                        )
                    })
                }
			</div>
		)

	}
}

export default Story;

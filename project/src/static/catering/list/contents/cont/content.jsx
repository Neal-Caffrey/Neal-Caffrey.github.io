import React, {Component, PropTypes} from "react";

import ComImg from "local-ComImg/dist/main.js";

const PIX = 'x-oss-process=image/resize,limit_0,w_300,h_180';

class Content extends Component {
	static defaultProps={
		data : []
	};
	constructor(props, context) {
		super(props, context);
	}

	realImg(url){
		let _url = url ? new ComImg({
			url : url,
			param : PIX
		}).getUrl() : '';
		return `url(${_url})`;
	}

	realHref(id){
		return `/webapp/catering/detail.html?merchantNo=${id}`;
	}

	clampClass(str){
		let len = str ? str.replace(/[\u0391-\uFFE5]/g, 'aa').length : 0;
		if(len > 88) return 'clamp';
		return null;
	}
	
	render(){
		if(this.props.data.length <= 0){
			return(
				<div className='list-empty'>
					<p>很抱歉，没有找到你要查询的内容！</p>
				</div>
				)
		}
		return (
				<ul>
					{
						this.props.data.map((item, key) => {
							return (
								<li key={key}>
									<div className="list-img" style={{"backgroundImage": this.realImg(item.merchantIndexUrl)}}>
										<a href={this.realHref(item.merchantNo)}></a>
									</div>
									<div className="list-con">
										<h5>
											<a href={this.realHref(item.merchantNo)}>
											{item.merchantName}
											</a>
										</h5>
										<div className="list-sign">{item.subCategoryName}&nbsp;&nbsp;|&nbsp;&nbsp;可预订{item.startSeatNum}-{item.endSeatNum}人</div>
										<div className="list-sign icon-place">{item.tradeingAreaName}</div>
										<div className="list-type">
											{
												item.labelList.map((list, index) => {
													return (<span key={index}>{list}</span>)
												})
											}
										</div>
										<p className={this.clampClass(item.merchantInfo)}>{item.merchantInfo}</p>
									</div>
									<div className="list-price clearfix">
										<s>{item.costPersonInfo}/人</s>
										<span>
											{item.guidePerfitInfo}
										</span>
									</div>
								</li>
								)
						})
					
					}
				</ul>
			)
	}
}

export default Content;

import React, {
  Component
} from 'react';
import {
	connect
} from 'react-redux';
import {
  _extend,
  _getQueryObjJson
} from 'local-Utils/dist/main.js';

import $ from 'local-Zepto/dist/main.js';
import OrderForm from '../orderForm/index.jsx';
import Map from '../merMap/index.jsx';
import YdjAjax from 'components/ydj-Ajax/index.js';
import ApiConfig from 'widgets/apiConfig/index.js';
import Swiper from 'react-id-swiper';
import preTime from '../preTime/index.js';
import {showLoading, updateDetail, showOrderForm, showMap, showAlert} from '../../action/index.js';
class MerDetail extends Component {
	constructor(props, context) {
		super(props, context);
		this.merchantNo = _getQueryObjJson().merchantNo;
	}
	componentWillMount() {
		if (this.props.header.info) {
			this._getDetail();
		}
	}
	componentWillReceiveProps(nextProps) {
		if (!this.props.header.info && nextProps.header.info) {
			this._getDetail();
		}
	}
	get orderQueryData() {
		return JSON.stringify(this.props.formData);
	}
	get _handleErrors() {
		let handles = {
			failedHandle: (res) => {
				this.props.dispatch(showAlert(res.message));
			},
			errorHandle: (xhr, errorType, error, errorMsg) => {
				this.props.dispatch(showAlert(errorMsg));
			}
		};
		return handles;
	}

	_getDetail() {
		let opt = {
			url: ApiConfig.cateringDetail,
			// url: 'http://api6-dev.huangbaoche.com/trade/fx/v1.0/cla/merchant/detail',
			data: {
				'merchantNo': this.merchantNo
			},
			successHandle: (res) => {
				res.data.preTime = new preTime({
					'time': res.data.fxMerchantConf.preMinute
				}).getShow();
				this.props.dispatch(updateDetail(res.data));
			},
			...this._handleErrors
		}
		this.props.dispatch(showLoading(true));
		new YdjAjax(opt);
	}
	_renderOrderForm() {
		this.props.dispatch(showOrderForm(true));
		$('.ui-wrap').css({
			'overflow': 'hidden'
		});
	}

	renderSaleType(type){
		let merConfig = this.props.detail.fxMerchantConf;
		if(type == 2) {
			return (
				<span className="price" >
					<em className="cost">预订服务费</em>
					<em className="rmb">RMB {merConfig.servicePerPrice}/位</em>
				</span>
			)
		} else if(type == 3 && merConfig.openDepositFlag == 1) {
			return (
				<span className="price" >
					<em className="cost">订座押金</em>
					<em className="rmb">
					{merConfig.depositPerPrice ? <span>RMB {merConfig.depositPerPrice}</span>: <span>免费服务</span>}
					</em>
				</span>
			)
		}
		return null;
	}
	renderDetails(details){
		return (
			<div>{details.map((detail)=>{return <span className="beauty-detail">{detail}</span>})}</div>
		)
	}

	addImages(images){
		const params = {
	      pagination: '.swiper-pagination',
	      paginationClickable: true,
		  nextButton: '.swiper-button-next',
		  prevButton: '.swiper-button-prev',
		   spaceBetween: 30
	    }
		if(!images){
			return(<div className="imgs"></div>)
		}else if (images.length==0){
			return(<div className="imgs"></div>)
		}
		return (
			 <Swiper {...params}>
			 {images.map((image)=>{return  <div className="imgs" style={{"backgroundImage":"url(" + image+ ")"}}></div>})

			 }
			 </Swiper>
			)
	}
   addNameLocal(nameLocal){
	   	if(!nameLocal){
	   		return null;
	   	}else if(nameLocal ==''){
	   		return null;
	   	}
	   	return(<span className="detail hotpot">{nameLocal}</span>)

   }
	_showMap() {
		this.props.dispatch(showMap(true));
		$('.ui-wrap').css({'overflow': 'hidden'});
	}

	render(){
		return (
			<div className="wrapper">
				{
					(()=>{
						let res =[];
						if(this.props.detail) {
							let detail = this.props.detail;
							res.push(
								<div>
								  	<div className="top_section">
									  	<div className="index_images">
									    	{this.addImages(detail.merchantPicList)}
									  	</div>
								  		<span className="map" onClick={this._showMap.bind(this)}>商户位置</span>
								  		<em className="a">{detail.merchantName}</em>
								  		<div className="content">
								  			{this.addNameLocal(detail.subCategoryName)}
									  		<span className="detail">{detail.tradeingAreaName}</span>
									  		<br/>
									  		<span className="detail">{detail.merchantInfo}</span>
									  		<br/>
									  		{this.renderDetails(detail.fxMerchantTagNameList)}
									  		<span className="back">{detail.guidePerfitInfo}</span>
									  		<span className="average">人均：{detail.perConsumerPrice}</span>
								  		</div>
										<hr/>
										<ul className="message">
											{detail.merchantAddress ? <li><span className="address">地址：</span><span>{detail.merchantAddress}</span></li>:null}
											{detail.businessTime ? <li><span className="time">营业时间：{detail.businessTime}</span></li>:null}
											{detail.contactTelNo ? <li><span className="phone">联系电话：{"+" + detail.contactAreaCode+" "+detail.contactTelNo}</span></li>:null}
											{detail.parkInfo ? <li><span className="car">泊车许可：{detail.parkInfo}</span></li>:null}
										</ul>
										<hr/>
										<div className="schedule">
											<span className="icon">
												<i></i>
												<em>订座</em>
											</span>
											{this.renderSaleType(detail.fxMerchantConf.saleType)}
											<span className="button" onClick={this._renderOrderForm.bind(this)}>立即预订</span>
											<br/>
											<span className="lead">提前{detail.preTime}预订／可预订{detail.fxMerchantConf.startSeatNum}-{detail.fxMerchantConf.endSeatNum}人 </span>

										</div>
								  	</div>
								  	{detail.merchantDetail ? 
								  	<div className="middle_section">
								  		<span className="title">关于餐厅</span>
								  		<div dangerouslySetInnerHTML={{__html: detail.merchantDetail}} className="describe"></div>
								  	</div>:null}
								  	<div className="bottom_section">
								  		<span>预订须知</span>
								  		<ol>
								  		 <li><span className="number">1.</span><span>如预订未成功，将全额退还预订服务费，收取预订押金的，全额退还预订押金；</span></li>
								  		 <li><span className="number">2.</span><span>预订成功后，因客人原因取消订单，预订服务费不退；</span></li>
								  		 <li><span className="number">3.</span><span>距离预约到店时间72小时外取消订单，预订押金全额退还；距离预约到店时间72小时内取消订单，预订押金不退；</span></li>
								  		 <li><span className="number">4.</span><span>预订成功后，因供应商或商户原因取消订单，将全额退还预订服务费及预订押金；</span></li>
								  		 <li><span className="number">5.</span><span>订单取消后的佣金按商户中设置的分配比例分配。</span></li>
								  		</ol>
								  	</div>
								  	<OrderForm/>
								  	{
								  		(()=>{
								  			let res =[];
								  			if(this.props.isMap) {
								  				res.push(<Map/>)
								  			}
								  			return res;
								  		})()
								  	}
						  		</div>
							)

						}
						return res;
					})()
				}

			</div>
		)
	}
}
const mapStateToProps = (state) => {
  return {
  	isMap: state.main.isMap,
    header: state.header,
    detail: state.main.detail
  }
}

export default connect(mapStateToProps)(MerDetail);
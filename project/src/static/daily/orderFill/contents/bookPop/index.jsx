/**
 * @description 协助预订项
 * @author Kepeng
 */
import React, {Component, PropTypes} from "react";
import { connect } from 'react-redux';
import Marks from 'components/ui-mark/index.jsx';
import {changePlanVo,showBookPop} from '../../action/leftSideAction.js';
import {updateTotalPrice} from '../../action/pageData.js';

import {Icon, Radio, Input, Select} from 'local-Antd';
const RadioGroup = Radio.Group;
const Option = Select.Option;
import update from 'react-addons-update';
import MInput from 'components/ui-input/index.jsx';
import UploadFile from "../upload-file/index.jsx";
import $ from 'local-Zepto/dist/main.js';
const Assign = (state,obj)=>{
  return Object.assign({},state,obj);
}


class BookPop extends Component {

	constructor(props, context) {
		super(props, context);
		this.cachData();
		this.state = this.defaultState;
		// this.bookInfo = {};//存储填写的预订项内容
	}

	get defaultState(){
		// const {id} = this.props;
		return {
			bookType: this.data.bookInfo.bookType || 3, //预订项类型，默认代付
			bookItem: this.data.bookInfo.bookItem || '酒店',
			bookItemId: this.data.bookInfo.bookItemId || 1
			// priceType: 'JPY' //代付金额类型@todo:bookInfo.priceType
			// id: id,
		};
	}

	cachData(props = this.props){// debugger;
		let {planVo,renderBookPop} = props;
		let currentBookInfo = planVo[renderBookPop.id].bookInfo[renderBookPop.index];
		let priceType = planVo[renderBookPop.id].priceInfo.currency;
		let currencyRate = planVo[renderBookPop.id].priceInfo.currencyRate;
		this.data = {
			date: planVo[renderBookPop.id].date,
			bookInfo : currentBookInfo || '',//获取当前的预订项信息
			formTxt: {
				itemName: '酒店',
				itemRequire: '房间'
			},
			priceType: priceType, //代付金额类型
			currencyRate: currencyRate,
			bookTypeName: '代付',
			itemTag: '酒',
			fileObj: (currentBookInfo && currentBookInfo.fileObj) || ''

		}
		this.agentInfo = props.header.info.agentInfo;
		this.bookInfo = {
			attachmentDemand: (currentBookInfo && currentBookInfo.attachmentDemand) || '',
			hotelName: (currentBookInfo && currentBookInfo.hotelName) || '',
			priceSell: (currentBookInfo && currentBookInfo.priceSell) || '',
			remark: (currentBookInfo && currentBookInfo.remark) || ''
		}
	}

	componentWillReceiveProps(props){
		this.cachData(props);
	}


	/**
	 * 获取输入内容
	 * @return {[type]}     [description]
	 */
	getTravelValue(val) {
		this.value = val.value;
	}

	/**
	 * 保存
	 * @return {[type]} [description]
	 */
	saveBookInfo() {
		// this.checkForm();
		let id = this.props.renderBookPop.id;
		let index = this.props.renderBookPop.index;
		let newBookInfo;
		if(!this.bookInfo.hotelName){
			$('.hotelName').focus();
			return;
		}
		if(this.state.bookType == 3 && (!this.bookInfo.priceSell || !(/^\d+$/).test(this.bookInfo.priceSell))){
			$('.priceSell').focus();
			return;
		}
		let bookPop = {
			isShow: false,
			id: this.props.renderBookPop.id,
			index: this.props.renderBookPop.index,
			isEdit: this.props.renderBookPop.isEdit
		}
		let bookInfo = Assign(this.bookInfo,{
			bookItem: this.state.bookItem,
			bookItemId: this.state.bookItemId,
			bookType: this.state.bookType,
			bookTypeName: this.data.bookTypeName,
			priceType: this.data.priceType,
			currencyRate: this.data.currencyRate,
			itemTag: this.data.itemTag,
			fileObj: this.data.fileObj,
		})
		// debugger;
    let price = this.props.totalPrice;
    let canNotOp = !!(price === '等待报价');
    price = canNotOp ? '等待报价' : (bookInfo.bookType === 1 ? '等待报价' : (price-0)+Math.ceil(bookInfo.priceSell*bookInfo.currencyRate));
		if(this.props.renderBookPop.isEdit){
			newBookInfo = update(this.props.planVo[id],{
			    bookInfo : {
			        $splice: [[index,1,bookInfo]]
			    }
			})
		}
		else{
			newBookInfo = update(this.props.planVo[id],{
			    bookInfo : {
			        $push: [bookInfo]
			    }
			})
		}

		let obj = update(this.props.planVo,{
		    $splice : [[id,1,newBookInfo]]
		});
    this.props.dispatch(updateTotalPrice(price));
		this.props.dispatch(changePlanVo(obj));
		this.props.dispatch(showBookPop(bookPop));
	}

	/*取消*/
	cancelPop() {
		let bookPop = {
			isShow: false,
			id: this.props.renderBookPop.id,
			index: this.props.renderBookPop.index,
			isEdit: this.props.renderBookPop.isEdit
		}
		this.props.dispatch(showBookPop(bookPop));
	}

	getBookInfo(info) {
		this.bookInfo[info.name] = info.value;
	}
	/*radio切换预订类型（代订，代付，代办）*/
	changeType(e) {
		let type;
		switch(e.target.value){
			case 1 :
				type = '代订';
				break;
			case 2 :
				type = '代办';
				// this.data.priceType = '';
				break;
			case 3 :
				type = '代付'
				// this.data.priceType = '';
				break;
		}
		this.data.bookTypeName = type;
		this.setState({
	      bookType: e.target.value,
	    });
	}
	/*切换预订项目（酒店，门票，团餐）*/
	handleChange(value) {
		console.log(`selected ${value}`);
		let bookItemId;
		switch(value){
			case '酒店':
				bookItemId = 1
				break;
			case '门票':
				bookItemId = 2
				break;
			case '团餐':
				bookItemId = 3
				break;
		}
		this.setState({
		 	bookItem: value,
		 	bookItemId: bookItemId
		});
		if(value == '酒店'){
			this.data.formTxt = {
				itemName: '酒店',
				itemRequire: '房间'
			};
			this.data.itemTag = '酒'
		}
		if(value == '门票'){
			this.data.formTxt = {
				itemName: '景点',
				itemRequire: '门票'
			};
			this.data.itemTag = '景'
		}
		if(value == '团餐'){
			this.data.formTxt = {
				itemName: '团餐',
				itemRequire: '团餐'
			};
			this.data.itemTag = '吃'
		}
	}
	/*切换代付金额类型*/
	changePriceType(value) {
		// this.setState({
		// 	priceType: value
		// })
		this.data.priceType = e.target.value
	}

	renderTips() {
		let p;
		switch(this.state.bookType){

			case 1:
				p = '提交订单后会OP将协助您预订'
				break;
			case 2:
				p = '请上传预订凭证或者预订信息，司导将直接协助客人办理'
				break;
			case 3:
				p = '请填写预订费用后司导将现场完成代付'
				break;
		}
		return p;
	}

	getUpload(val) {
		let obj;
		if(val) {
			obj = {
				uploadFilePath : val.uploadFilePath,
	            uploadFileName : val.uploadFileName,
	            uploadFileSize : val.uploadFileSize
			}
		}

	    this.data.fileObj = obj;
	}

	render(){
		let date = this.data.date;
		let bookInfo = this.data.bookInfo;
		let formTxt = this.data.formTxt;
		let bookItemDefault = this.agentInfo.bookItem;
		let itemType = '';
		if(this.state.bookItem == '酒店'){
			itemType = '酒店';
		}
		if(this.state.bookItem == '门票'){
			itemType = '景点门票';
		}
		if(this.state.bookItem == '团餐'){
			itemType = '客人团餐';
		}
		//预订项类型
		let BOOKTYPE = [
			{
				'id': 3, //代付
				'txt': `已预订未支付${itemType}费用，司导协助代付`
			},
			{
				'id': 2, //代办
				'txt': `已支付${itemType}费用，司导现场协助办理`
			},
			{
				'id': 1, //代订
				'txt': '联系云地接预订'
			}

		]
		const radioStyle = {
	      	display: 'block',
	      	height: '26px',
	      	lineHeight: '26px',
	      	marginBottom: '0px',
	      	fontSize: '14px'
	    };
	    const selectStyle = {
	    	width: '100%',
	    	height: '40px',
	    	zIndex: '1000'
	    }
	    const priceSelect = {
	    	width: "120px",
	    	height: '40px',
	    	zIndex: '1000'
	    }
		return(
			<div className="bookPop">
				<div className="mask"></div>
				<div className="bookWrap">
					<div className="head">协助预订项<Icon className="close" type="close" onClick={this.cancelPop.bind(this)}/></div>
					<div className="cont">
						<div className="cont-inner">
							<div className="form-row">
								<label>协助项：</label>
								<div className="bookItem">
									<Select defaultValue={this.state.bookItem} style={selectStyle} onChange={this.handleChange.bind(this)}>
										{
											bookItemDefault.map((item,index)=>{
												return (
													<Option value={item.bookItem}>{item.bookItem}</Option>
												)
											})
										}
								    </Select>
								</div>
							</div>
							<div className="form-row">
								<label>预订日期：</label>
								<span>{date}</span>
							</div>
							{/*修改1*/}
							<div className="form-row" style={{marginBottom:0}}>
								<label>办理方式：</label>
								<div className="bookType">
									<RadioGroup onChange={this.changeType.bind(this)} value={this.state.bookType}>
                                        {
                                            BOOKTYPE.map((item, index)=>{
                                                return (
													<Radio style={radioStyle} value={item.id}>{item.txt}</Radio>
                                                )
                                            })
                                        }
                                        <div  className="tishi">{this.renderTips()}</div>
									</RadioGroup>
								</div>
							</div>


							{/*修改2*/}
							<div className="form-row" style={{marginBottom:0}}>
								<label></label>
                            {
                                this.state.bookType == 3 ? <div className="priceSellBox">
										<MInput
											className='priceSell'
											name='priceSell'
											sign='代付金额'
											reg={/^\d+$/}
											value={bookInfo.priceSell}
											onHandle={this.getBookInfo.bind(this)}
											placeholder={`您希望预订${formTxt.itemName}价格`}/>
										<Select defaultValue={this.data.priceType} style={priceSelect} onChange={this.changePriceType.bind(this)}>
											<Option value={this.data.priceType}>{this.data.priceType}</Option>
										</Select>
									</div> : null
                            }
							</div>



							<div className="form-row">
								<label>{formTxt.itemName}名称：</label>
								<MInput
									className='hotelName'
									name='hotelName'
									sign={`${formTxt.itemName}名称`}
									reg={/^.+$/}
									value={bookInfo.hotelName}
									onHandle={this.getBookInfo.bind(this)}
									placeholder={`请输入您需要预订的${formTxt.itemName}名称`}/>
							</div>

							<div className="form-row">
								<label>{formTxt.itemRequire}要求：</label>
								<MInput
									className='attachmentDemand'
									name='attachmentDemand'
									sign={`${formTxt.itemRequire}要求`}
									onHandle={this.getBookInfo.bind(this)}
									value={bookInfo.attachmentDemand}
									placeholder={`请输入您对预订${formTxt.itemRequire}的详细要求`}/>
							</div>
							<div className="form-row">
								<label>备注：</label>
								<div className="textareabox">
									<Marks
										placeholder='请输入您的备注信息'
										onHandle={this.getBookInfo.bind(this)}
										name='remark'
										value={bookInfo.remark}
									/>
								</div>

							</div>
							{/*修改1*/}
							{/*<div className="form-row" style={{marginBottom:0}}>*/}
								{/*<label>办理方式：</label>*/}
								{/*<div className="bookType">*/}
							        {/*<RadioGroup onChange={this.changeType.bind(this)} value={this.state.bookType}>*/}
							        {/*{*/}
							        	{/*BOOKTYPE.map((item, index)=>{*/}
							        		{/*return (*/}
							        			{/*<Radio style={radioStyle} value={item.id}>{item.txt}</Radio>*/}
						        			{/*)*/}
							        	{/*})*/}
							        {/*}*/}
									{/*</RadioGroup>*/}
								{/*</div>*/}
							{/*</div>*/}

							{/*修改2*/}
							{/*<p className="type-tips">{this.renderTips()}</p>*/}

							{/*{*/}
								{/*this.state.bookType == 1 ? <div className="priceSellBox">*/}
									{/*<MInput */}
									{/*className='priceSell'*/}
									{/*name='priceSell'*/}
									{/*sign='代付金额'*/}
									{/*reg={/^\d+$/}*/}
									{/*value={bookInfo.priceSell}*/}
									{/*onHandle={this.getBookInfo.bind(this)}*/}
									{/*placeholder='请输入代付金额'/>*/}
									{/*<Select defaultValue={this.data.priceType} style={priceSelect} onChange={this.changePriceType.bind(this)}>*/}
									    {/*<Option value="JPY">JPY</Option>*/}
									    {/*<Option value="THB">THB</Option>*/}
									    {/*<Option value="RMB">RMB</Option>*/}
								    {/*</Select>*/}
								{/*</div> : null*/}
							{/*}*/}
							<UploadFile onHandle={this.getUpload.bind(this)} fileObj={this.data.fileObj} uid= {'up-proof'} className="up-proof"/>
							{/*<div className="btn-box">*/}
								{/*<button className="cancel" onClick={this.cancelPop.bind(this)}>取消</button>*/}
								{/*<button className="save" onClick={this.saveBookInfo.bind(this)}>保存</button>*/}
							{/*</div>*/}
						</div>
					</div>
					{/*修改3*/}
                    <div className="btn-box">
                    <button className="cancel" onClick={this.cancelPop.bind(this)}>取消</button>
                    <button className="save" onClick={this.saveBookInfo.bind(this)}>保存</button>
                    </div>
				</div>
			</div>
		)

	}
}


// export default WriteTravel;

const mapStateToProps = (state) => {
	return {
		header: state.header,
	 	planVo: state.leftSide.planVo,
	 	renderBookPop: state.leftSide.renderBookPop,
    totalPrice : state.pageData.totalPrice
	}
}

export default connect(mapStateToProps)(BookPop)

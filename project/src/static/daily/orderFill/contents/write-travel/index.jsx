/**
 * @description 填写行程
 */
import React, {Component, PropTypes} from "react";
import { connect } from 'react-redux';
import Marks from 'components/ui-mark/index.jsx';
import {changePlanVo} from '../../action/leftSideAction.js';
import update from 'react-addons-update';
// import markCsss from './sass/index.scss';

class WriteTravel extends Component {

	constructor(props, context) {
		super(props, context);
		this.cachData();
		this.state = this.defaultState;
	}

	get defaultState(){
		const {id} = this.props;
		return {
			isEdit: true,
			id: id,
		};
	}

	cachData(props = this.props){
		let {planVo} = props;
		this.data = {
			planVo : planVo || ''
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
	saveTravel(index) {
		let val = this.value;
		// let id = this.props.id;
		let nextTravel = update(this.props.planVo[index],{
		    travelArr : {
		        $set : val
		    }
		});
		if(!val){
			nextTravel = update(this.props.planVo[index],{
				showTravel: {
					$set: false
				},
			    travelArr : {
			        $set : ''
			    }
		});
		}
		let obj = update(this.props.planVo,{
		    $splice : [[index,1,nextTravel]]
		});

		this.props.dispatch(changePlanVo(obj));// debugger;

		this.setState({
			isEdit: false
		})
	}

	/*删除*/
	delTravel(index) {
		let nextTravel = update(this.props.planVo[index],{
			showTravel: {
				$set: false
			},
		    travelArr : {
		        $set : ''
		    }
		});
		let obj = update(this.props.planVo,{
		    $splice : [[index,1,nextTravel]]
		});

		this.props.dispatch(changePlanVo(obj));
	}

	setEdit() {
		this.setState({
			isEdit: true
		})
	}

	render(){// debugger;
		let id = this.props.id;
		if(this.state.isEdit){
			return (
				<div className="fill-box">
				  	<Marks 
				  	placeholder='行程安排'
					onHandle={this.getTravelValue.bind(this)}
					name='travel'
					max='300'
					value={this.data.planVo[id].travelArr}
					/>
				  	<div className="option-box">
				    	<span><i className="non-icon-save" onClick={this.saveTravel.bind(this,id)}>保存</i></span>
				    	<span><i className="non-icon-cancel" onClick={this.delTravel.bind(this,id)}>关闭</i></span>
				  </div>
				</div>
			)
		}
		else{
			return(
				<div className="fill-box saved">
				  	<i className="plane">行程安排：</i>
				  	<textarea className="message " disabled="disabled" value={this.data.planVo[id].travelArr}>
				  	</textarea>
				  	<div className="option-box">
				    	<span><i className="non-icon-edit" onClick={this.setEdit.bind(this)}>修改</i></span>
				    	<span><i className="non-icon-delete" onClick={this.delTravel.bind(this,id)}>删除</i></span>
				  	</div>
				</div>
			)
		}
	}
}


// export default WriteTravel;

const mapStateToProps = (state) => {
	return {
	 	planVo: state.leftSide.planVo
	}
}

export default connect(mapStateToProps)(WriteTravel)


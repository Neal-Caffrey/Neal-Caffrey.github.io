import React, {
  Component,
  PropTypes
} from 'react';
import {Progress} from 'local-Antd';
/**
* 通用弹框  
* arguments {
*     type	// 类型
*     percent	// 百分比
*     format	// 内容的模板函数
*     status	// 状态，可选：success exception active
*     showInfo	// 是否显示进度数值或状态图标
*     strokeWidth // 进度条线的宽度
*     width      // 圆形进度条画布宽度
*     auto 		// 自动计时
*     stop 		// 自动计时停止点
* }
**/
export default class UiSimulateProgress extends Component {
	constructor(props, context) {
        super(props, context);
        this.stop = this.props.stop || 80;
        this.left =  this.stop;
        this.step = this.stop/10;
        this.state = {
        	percent: 0,
        };
        if(this.props.auto === true) {
        	this. _getPercent();
        }
    }
    componentWillUnmount() {
        if(this.timer) {
            clearTimeout(this.timer);
        }
    }
    _getPercent() {
    	if (this.left < 1) {
    		clearTimeout(this.timer);
    		return;
    	}
    	if(this.timer) {
    		clearTimeout(this.timer);
    	}
		this.timer = setTimeout(()=>{
			this.setState({
				percent: this.state.percent + this.step
			});
    		this._getPercent();
    		this.left = this.left - this.step;
    	}, 50) 
    }
	render () {
		return (
			!this.props.type || this.props.type == 'line' ?
			<div className="simulate-progress">
				<Progress percent={this.props.auto === true? this.state.percent: (this.props.percent || 0)} format={this.props.format || null} status={this.props.status || 'active'} strokeWidth={this.props.strokeWidth || 2} showInfo={this.props.showInfo || false}/>
			</div> :
			<div className="simulate-progress">
				<Progress percent={this.props.auto === true? this.state.percent: (this.props.percent || 0)} width={this.props.format || 100} format={this.props.format || null} status={this.props.status || 'active'} strokeWidth={this.props.strokeWidth || 2} showInfo={this.props.showInfo || false}/>
			</div>
		)
	}
	
}
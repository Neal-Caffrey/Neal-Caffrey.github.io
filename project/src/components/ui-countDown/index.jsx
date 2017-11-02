/**
 * @author Kepeng
 * @date 2017/07/22
 * @description [时分秒倒计时]
 * @param {
 *      time: [number] [毫秒数] ,
 *      type: [number] [类型1,2] [1:时分秒，2:分秒]
 *      callback: [function] [回调函数]
 * }
 */

import React , {Component, PropTypes} from 'react';
// import Moment from 'moment';
import './sass/index.scss';

export default  class CountDown extends Component {
	constructor(props,context){
	  super(props,context);
	  this.state = {
	    time : this.props.time,
	    model: this.props.model || 1,
	    type: this.props.type || 2,
	    result: []
	  };
	  this.data= {
	  	callback: this.props.callback,
	  	step: 1000  //1s刷新一次
	  }
	  // this.data.step = 1000;
	  this.start();
	}
	formatTime() {
	    let left = new Array();
	    let leftS = false;
	    let leftM = false;
	    let leftH = false;
	    switch (this.state.type) {
	        case 1:
	            leftH = Math.floor(this.data.leftTime / (this.data.step * 60 * 60));
	            var h = leftH.toString().split("");
	            (h.length < 2) && (h = ['0'].concat(h));
	            left.push(h);
	        case 2:
	        	let hasH;//如果存在小时
	        	if(this.state.type == 1){
	        		hasH = Math.floor(this.data.leftTime % (this.data.step * 60 * 60));
	        	}
	        	else{
	        		hasH = this.data.leftTime;
	        	}
	            leftM = Math.floor(hasH / (this.data.step * 60));
	            leftS = Math.floor(hasH % (this.data.step * 60)/this.data.step);
	            var m = leftM.toString().split("");
	            var s = leftS.toString().split("");
	            (m.length < 2) && (m = ['0'].concat(m));
	            (s.length < 2) && (s = ['0'].concat(s));
	            left.push(m);
	            left.push(s);
	            break;
	    }
	    return left;
	}
	start() {
		let that = this;
	    this.data.leftTime = this.state.time || 30 * 60 * 1000;
	    // this.data.now = new Moment();
	    // this.data.end = this.data.now.add(this.data.leftTime, 'millisecond');
	    that.data.showCont = that.formatTime();
	    this.setState({
	    	result: that.data.showCont
	    })

	    this.timer = setInterval(function() {
	    	that.data.leftTime -= that.data.step;
	        // that.data.now = new Moment();
	        // that.data.leftTime = that.data.end.diff(that.data.now, 'millisecond', true)
	    	if(that.data.leftTime < 0) {
	    		clearInterval(that.timer);
	    		that.data.callback && that.data.callback();
	    		return;
	    	};
	        that.data.showCont = that.formatTime();
	        that.setState({
	        	result: that.data.showCont
	        });

	        // that.data.leftTime -= that.data.step;
	    }, this.data.step)
	}
	renderMain(){
		let that = this;
		return(
			<em>
			{
				that.state.result.map(function(val,index){
					return(
						<var>
							{
								val.map(function(child,key){
									return(
										<em>{child}</em>
									)
								})
							}
							{
								that.state.model == 1 ?
								(index == 0 ?
								<i>分</i> :
								<i>秒</i>):
								(index < (that.state.result.length-1) ?
								<i>:</i>:null)
							}
						</var>
					)
				})
			}
			</em>
		)

	}
	render() {
		return(
			<code className="count-down">
				{this.renderMain()}
			</code>
		)
	}
}

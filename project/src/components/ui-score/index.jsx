import React, {Component, PropTypes} from "react";
import IndexCss from "./sass/index.scss";

class UIScore extends Component {

	static propTypes = {
		num : PropTypes.number.isRequired,
		width : PropTypes.number,
		total : PropTypes.number,
		half : PropTypes.bool
	};

	constructor(props, context) {
		super(props, context);
		this.state = this.defaultState;


	}

	get score(){
		if(this.props.half) return this.props.num.toFixed(1);
		else return Math.ceil(this.props.num).toFixed(1);
	}

	get defaultState(){

		return {
			total : this.props.totla || 5,
			num : this.score,
			mark : 0,
			width : this.props.width || 80,
		};
	}

	componentWillMount(){
		this.setState({
			mark : this.mark,
		});
	}

	get mark(){
		return this.state.num / this.state.total * this.state.width;
	}

	render(){
		return (
			<div className='ui-score'>
				<span
				className='ui-score-main'
				data-tip={this.state.num}
				style={{'width' : this.state.width + 'px'}}
				>
					{
						<s
						style={{'width' : this.state.mark + 'px'}}
						data-score={this.state.num / this.state.total}></s>
					}
				</span>
				<span
				className='ui-score-view'
				><em>{this.state.num}</em>/{this.state.total}分</span>
			</div>
			)

	}
}

export default UIScore;
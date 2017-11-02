import React , {Component, PropTypes} from 'react';
import IndexCss from './sass/index.scss';

class UIStar extends Component {

	constructor(props, context) {
		super(props, context);
		this.state = this.defaultState;
	}

	get defaultState(){
		return {
			score : this.props.score,
			num : this.setNum(this.props.score),
		}
	}

	setNum(num){
		let arr = [];
		let numArr = (num + '').split('.');
		for(let i = 0, len = numArr[0]; i < len; i++) arr.push(1);
		if(numArr[1]) arr.push(0.5);
		return arr;
	}

	render(){
		return(
			<span 
			className='ui-star'
			data-tip={this.state.score}>
				{
					this.state.num.map((item, key) => {
						return (<s 
							key={key}
							data-score={item}
							className={item === 0.5 ? 'half icon-star-half' : 'icon-star' }></s>)
					})
				}
			</span>
		)
	}

	// methods
}

export default UIStar;
import React, {
	Component
} from 'react';
import {connect} from "react-redux";
class LeftMenu extends Component {
	constructor(props, context) {
		super(props, context);
		this.curPageUrl = this.curUrl;
		this.state = {
			menus: this.getMemus(),
			curUrl: this.curUrl

		};
	}
	componentWillReceiveProps(nextProps) {
		if(nextProps.dataSource)
			this.setState({
				menus: this.getMemus(nextProps.dataSource),
			});
	}

	getMemus(dataSource) {
		let menus = dataSource? dataSource : this.props.dataSource;
		if(menus && menus.length) {
			menus.map((item, index)=>{
				item.children.map((menu, menuIndex)=>{
					menu.isCur = this._checkCur(menu.nameUrl);
				})
			})
		}
		return menus || [];
	}

	get curUrl() {
		return this.props.curMenuUrl || window.location.pathname.substr(1);
	}

	_checkCur(url) {
		if (url == this.curPageUrl) {
			return true;
		}
		return false;
	}


	render() {
		return (
			<div className="left-menu-wrap">
				{this.state.menus.map((item, index)=>{
					return (
						<dl  key={`memu-group-${index}`} className="left-menu">
							<dt>{item.menu}</dt>
							{item.children.map((menu, menuIndex)=>{
								return (
									<dd key={`memu-${index}-${menuIndex}`} className={menu.isCur? 'active': ''}><a href={`/${menu.nameUrl}`}>{menu.name}</a></dd>
								)
							})}
						</dl>
					)
				})}
			</div>
		)
	}
}

const mapStateToProps = (state) => {
  return {header: state.header}
}

export default connect(mapStateToProps)(LeftMenu);
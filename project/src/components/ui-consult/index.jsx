import React, {Component,PropTypes} from 'react';
import './sass/index.scss'
/**
 * 通用在线咨询
 **/
export default class UiConsult extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = this.defaultState;
    }
    get defaultState(){
        return {
            show : this.props.show || true,
            opacity: this.props.opacity ? (this.props.opacity > 1 ? this.props.opacity / 100 : this.props.opacity) : 1
        };
    }

    staticWin(){
        this.setState({
            show : false,
        });
    }

    activeWin(){
        this.setState({
            show : true,
        });
    }

    get show(){
        return this.state.show;
    }

    get staticClassName(){
        return this.show ? 'box-static show' : 'box-static hide';
    }

    get activeClassName(){
        return this.show ? 'box-active hide' : 'box-active show';
    }

    render() {
    	return (
            <div className="service-win">
                <div className={this.staticClassName} onClick={this.staticWin.bind(this)}>
                    <div className="tag">+</div>
                    <div className="icon icon-qq">咨询客服</div>
                </div>
                <div className={this.activeClassName} onClick={this.activeWin.bind(this)}>
                    <div className="tag">-</div>
                    <p className="hot-title">服务热线</p>
                    <p className="time">7x24小时</p>
                    <p className="tel">400-060-0766</p>
                    <div className="service-qq">
                        <a href="http://wpa.qq.com/msgrd?v=3&uin=3454445010&site=qq&menu=yes" target="_blank">
                            <div className=""> 用车咨询</div>
                        </a>
                    </div>
                    <div className="service-qq service-hotel">
                        <a href="http://wpa.qq.com/msgrd?v=3&uin=2281305658&site=qq&menu=yes" target="_blank">
                            <div className=""> 酒店咨询</div>
                        </a>
                    </div>
                </div>
            </div>
		)
    }
}
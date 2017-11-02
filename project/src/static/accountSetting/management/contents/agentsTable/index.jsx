import React, {
	Component
} from 'react';
import { connect } from 'react-redux';
import {Row, Col, Spin} from 'local-Antd';
import Page from 'components/ui-page/index.jsx';
import {showPassword,showAdd} from '../../action/alertAction.js';
import './sass/index.scss';

class OrdersTable extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			datas: this.props.dataSource,
			pagination: this.props.pageSource,
			loading: this.props.loading,
		};
	}
	componentWillReceiveProps(nextProps) {
		this.setState({
			datas: nextProps.dataSource,
			pagination: nextProps.pageSource,
			loading: nextProps.loading,
		});
	}
	_changePage(data) {
		let pageIndex = data.current || 1;
		// let pageIndex = data || 1;
		if(this.state.pagination.current == pageIndex) {
			return;
		}
		this.props.changeHandle && this.props.changeHandle('pageIndex', {'pageIndex': pageIndex});
	}
	_showPassword(val) {
		let obj = {
			show: true,
			loginName: val.loginName,
			agentUserId: val.agentUserId
		}
		this.props.dispatch(showPassword(obj))
	}
	_showAdd(val) {
		let obj = {
			show: true,
			model: 2,
			info: val
		}
		this.props.dispatch(showAdd(obj));
	}
	_renderAgentsRows() {
		if(this.state.loading) {
			return (
				<Spin tip="加载中，请稍后"></Spin>
			)
		} else {
			if(this.state.datas && this.state.datas.length){
				return (
					<div className="list-body">
					{
						this.state.datas.map((val, index)=>{
							return (
								<div className="list-item">
						        	<Row className="list-main" type="flex" justify="space-around" align="middle">
							        	<Col span={3} title={val.loginName}>{val.loginName}</Col>
						        		<Col span={3}>{val.agentUserName}</Col>
						        		<Col span={2}>{val.type == 1 ? '操作员':'管理员'}</Col>
						        		<Col span={2}>{val.supportBalancePay == 1 ?'启用':'禁用'}</Col>
						        		<Col span={1}>{val.status == 1 ? '启用': '禁用'}</Col>
						        		<Col span={3}>{val.phone || '————'}</Col>
						        		<Col span={5}>{val.email || '————'}</Col>
						        		<Col span={5}>
                                            <span onClick={this._showAdd.bind(this,val)}>编辑</span>
                                            <span onClick={this._showPassword.bind(this,val)}>修改密码</span>
                                            <span>
                                                <a target="_blank" href={`/order/list?agentUserName=${val.agentUserName}`}>他的订单</a>
                                            </span>
					        			</Col>
						        	</Row>
					        	</div>
							)
						})
					}
					<Page
		              total={this.state.pagination.total}
		              onHandle={this._changePage.bind(this)}
		              current={this.state.pagination.current}
		              limit={this.state.pagination.limit} />
					</div>
				)
			} else {
				return (
					<div className="non-orders">暂无操作员</div>
				)
			}
		}

	}
	render() {
		return (
			<div className="list-table">
        		<Row className="list-head" type="flex" justify="space-around" align="middle">
	        		<Col span={3}>登录名</Col>
	        		<Col span={3}>姓名</Col>
	        		<Col span={2}>账户级别</Col>
	        		<Col span={2}>余额支付</Col>
	        		<Col span={1}>状态</Col>
	        		<Col  span={3}>联系电话</Col>
	        		<Col span={5}>邮箱</Col>
	        		<Col span={5}>操作</Col>
        		</Row>
				{this._renderAgentsRows()}
        	</div>
		)
	}
}

function mapStateToProps(state) {
    return {
        showPassword: state.alert.showPassword,
		showAdd: state.alert.showAdd,
    }
}

export default connect(mapStateToProps)(OrdersTable)

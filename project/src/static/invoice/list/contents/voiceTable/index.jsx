import React, {
	Component
} from 'react';
import { connect } from 'react-redux';
import {Row, Col, Spin} from 'local-Antd';
import Page from 'components/ui-page/index.jsx';
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
            agentId: window.__AGENT_INFO.agentId
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

	_renderVoiceRows() {
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
							        	<Col span={2} title={val.billNo}>{val.billNo}</Col>
						        		<Col span={2} title={val.billHeaderTypeName}>{val.billHeaderTypeName}</Col>
						        		<Col span={4} title={val.billHeader}>{val.billHeader}</Col>
						        		<Col span={4} title={val.billTaxpayerNum}>{val.billTaxpayerNum}</Col>
						        		<Col span={2} title={val.billTypeName}>{val.billTypeName}</Col>
						        		<Col span={2} title={val.billContentName}>{val.billContentName}</Col>
						        		<Col span={2} title={val.billAmount}>￥{val.billAmount}</Col>
						        		<Col span={2} title={val.billStatusName}>{val.billStatusName}</Col>
                                        <Col span={2} title={val.createTime}>{val.createTime&&val.createTime.substr(0,10)}<br/>{val.createTime&&val.createTime.substr(11)}</Col>
                                        <Col span={2}>
                                            <a target="_blank" href={`/webapp/invoice/detail.html?billNo=${val.billNo}&agentId=${this.state.agentId}`}>查看详情</a>
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
					<div className="non-orders">暂无发票信息</div>
				)
			}
		}

	}
	render() {
		return (
			<div className="list-table">
        		<Row className="list-head" type="flex" justify="space-around" align="middle">
	        		<Col span={2}>申请单号</Col>
	        		<Col span={2}>抬头类型</Col>
	        		<Col span={4}>发票抬头</Col>
	        		<Col span={4}>纳税人识别号</Col>
	        		<Col span={2}>发票类型</Col>
	        		<Col  span={2}>发票内容</Col>
	        		<Col span={2}>发票金额</Col>
	        		<Col span={2}>开票状态</Col>
                    <Col span={2}>申请时间</Col>
                    <Col span={2}>操作</Col>
        		</Row>
				{this._renderVoiceRows()}
        	</div>
		)
	}
}


export default OrdersTable;

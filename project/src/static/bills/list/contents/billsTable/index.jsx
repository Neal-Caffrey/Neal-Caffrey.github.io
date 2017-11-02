import React, {
  Component
} from 'react';
import {Row, Col, Spin} from 'local-Antd';
import Page from 'components/ui-page/index.jsx';
import billsTableCss from './sass/index.scss';
 class billsTable extends Component {
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
    if(this.state.pagination.current == pageIndex) {
      return;
    }
    this.props.changeHandle && this.props.changeHandle('pageIndex', {'pageIndex': pageIndex});
  }

  _renderOrderRows() {
    if(this.state.loading) {
      return (
        <Spin tip="加载中，请稍后"></Spin>
      )
    } else {
      if(this.state.datas && this.state.datas.length){
        return (
          <div className="list-body">
          {
            this.state.datas.map((order, index)=>{
              return (
                <div key={order.billNo} className="list-item">
                      <Row className="list-main" type="flex" justify="space-around" align="middle">
                         {<Col className="every-item " span={4}>{order.billNo||"——"}</Col>}
                         {<Col className="every-item" span={4}>{order.createTime||"——"}</Col>}
                         {<Col className="every-item money" span={4}>{order.settleShouldAmount>=0 ? '¥' + order.settleShouldAmount : "——"}</Col>}
                         {<Col className="every-item money" span={4}>{order.shouldReceiveAmount>=0 ? '¥' + order.shouldReceiveAmount : "——"}</Col>}
                         {<Col className="every-item" span={4}>{order.claBillStatusName || "——"}</Col>}
                        <Col className="btns every-item" span={4}>
                          <a target="_blank " className="btn every-item "href={`/webapp/bills/detail.html?billNo=${order.billNo}`}>查看账单</a>
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
          <div className="non-orders">暂无相关账单</div>
        )
      }

    }

  }
  render() {
    return (
      <div className="list-table">

            <Row className="list-head" type="flex" justify="space-around" align="middle">
              <Col span={4}>账单号</Col>
              <Col span={4}>账单生成时间</Col>
              <Col span={4}>账单金额</Col>
              <Col span={4}>应付金额</Col>
              <Col span={4}>账单状态</Col>
              <Col span={4}>操作</Col>
            </Row>
            {this._renderOrderRows()}
        </div>
    )
  }
}
export default billsTable;

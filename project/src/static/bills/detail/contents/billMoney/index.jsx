import React, {
  Component
} from 'react';
import {Row, Col, Spin} from 'local-Antd';
import Page from 'components/ui-page/index.jsx';
import 'moment/locale/zh-cn';
import billMoneyCss from './sass/index.scss';
import Loading from 'components/ui-loading/index.jsx';
import Uploader from '../uploader/index.jsx';
import BaseCss from 'local-BaseCss/dist/main.css';
import GlobleCss from 'components/globleCss/index.scss';
import ApiConfig from 'widgets/apiConfig/index.js';
import css from './sass/index.scss';

class BillMoney extends Component {
   constructor(props, context) {
    super(props, context);
    this.state = {
        datas: this.props.dataSource,
        channelInfo:this.props.channelInfo,
        moneySource:this.props.moneySource,
      };
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      datas: nextProps.dataSource,
      channelInfo: nextProps.channelInfo,
      moneySource:this.props.moneySource,
    });
  }
  
  render() {
    console.log(this.state.moneySource);
    debugger
    const attr = {
      billNo: this.state.datas.billNo,
      sendFlag: this.state.datas.imgIsSend == 1 ? true : false,
      ...(this.state.datas.watermarkImg ? {
        fileList: [{
          uid: -1,
          url: `${ApiConfig.fileHost}${this.state.datas.watermarkImg}!s`,
          largeUrl: `${ApiConfig.fileHost}${this.state.datas.watermarkImg}!l`,
          path: `${this.state.datas.watermarkImg}`,
        }]
      } : {})

    };

    return (
      <div className = "bill-Money">
                  <div className="Money">
                      <div> <span className="content">应付金额</span><span className="title-money">¥{this.state.datas.shouldReceiveAmount}</span> </div>
                      <div> <span>账单号:</span> <span>{this.state.datas.billNo}</span></div>
                      <div> <span>账单生成时间:</span> <span>{this.state.datas.createTime}</span></div>
                      <div> <span>账单状态:</span> <span>{this.state.datas.claBillStatusName}</span></div>
                      <div> <span>结算说明:</span> <span>{this.state.datas.remark}</span></div>
                  </div>
                  <div className="message-left">
                      <div> <span className="content">开户行信息</span> </div>
                      <div> <span>开户行:</span> <span>{this.state.channelInfo.accountBand}</span></div>
                      <div> <span>开户名:</span> <span>{this.state.channelInfo.accountName}</span></div>
                      <div> <span>银行账号:</span> {this.state.channelInfo.toPublicAccount?<span>{this.state.channelInfo.toPublicAccount}</span>:<span>暂无</span>}</div>
                  </div>
                  <div className="message-right">
                      <div> <span>如有疑问请联系云地接财务部：</span> </div>
                      <div> <span>财务联系人:</span> <span>{this.state.channelInfo.fnContact}</span></div>
                      <div> <span>电话:</span> <span>010-59420746</span></div>
                      <div> <span>邮箱:</span> <span>xindi@yundijie.com</span></div>
                  </div>
                  <div className="load">
                     {this.state.datas.billNo?<Uploader {...attr}/>:null}
                      
                     <a className=" load-detail excel" href={this.state.channelInfo.excelUrl}>下载Excel账单明细</a>
                     <a className="load-bill pdf" href={ this.state.channelInfo.pdfUrl}>下载PDF账单</a>
                  </div>
              </div>
    )
  }
}
export default BillMoney;
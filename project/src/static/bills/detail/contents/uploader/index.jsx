import React, {
  Component
} from 'react';
import {
  Upload, Button, Icon, Modal
} from 'local-Antd';
import {
  connect
} from 'react-redux';
import ApiConfig from 'widgets/apiConfig';
import YdjAjax from 'components/ydj-Ajax/index.js';
import Msg from 'components/ui-msg/index.jsx';
import BaseCss from 'local-BaseCss/dist/main.css';
import GlobleCss from 'components/globleCss/index.scss';

import './sass/index.scss';

class Uploader extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = this.getDefaultState;
  }
  get getDefaultState() {
    if (this.props.fileList && this.props.fileList.length) {
      return {
        fileList: this.props.fileList,
      }
    } else {
      return {}
    }

  }
  componentWillMount() {
      !this.props.sendFlag && this._getOssToken();
  }

  componentWillReceiveProps(nextProps) {
      !this.props.sendFlag && this._getOssToken();
  }
  showMsg() {
      
      if (this.state.isAlert) {
        let attr = {
          showFlag: true,
          showType: 'alert', // info alert confirm
          backHandle: () => {
            if (this.state.alertMsg.loginErr) {
              window.location.href = '/';
            }
            this.setState({
              isAlert: false
            })
            
          }
        };
        return <Msg initData = {attr}><p>{this.state.alertMsg.msg}</p></Msg>
      }
      return null;
  }

  handlePreview(file) {
    // 预览
    
    this.setState({
      previewVisible: true,
      previewUrl: `${file.largeUrl}`
    })
  }
  get errHandler() {
    return {
      failedHandle: (res) => {
        
        this.setState({
          isAlert: true,
          alertMsg: {
            msg: res.message
          },
          sending: false,
        })
      },
      errorHandle: (xhr, errorType, error, errorMsg) => {
        this.setState({
          isAlert: true,
          alertMsg: errorMsg,
          sending: false,
        })
      }
    }
  }
  // 上传水单
  editWatermarkImg(back) {
   let opt = {
      url: ApiConfig.editWatermarkImg,
      type: 'POST',
      data: {
        'billNo': `${this.props.billNo}`, // 账单号
        'watermarkImg': this.state.imgUrl, // 图片
        // 'agentId': , // 代理商id
        // 'agentName': , // 代理商名称
        // 'opId': , // 操作员id
        // 'opName': , // 操作员名称
      },
      successHandle: (res) => {
        
        if(back) {
          back();
        }
      },
      ...this.errHandler
    }
    new YdjAjax(opt);
  }

  // 发送水单
  sendWatermarkImg(back) {
       let opt = {
        url: ApiConfig.sendWatermarkImg,
        type: 'POST',
        data: {
          'billNo': `${this.props.billNo}`, // 账单号
          'watermarkImg': this.state.fileList[0]['path'] || this.props.fileList[0]['path'], // 图片
          // 'agentId': , // 代理商id
          // 'agentName': , // 代理商名称
          // 'opId': , // 操作员id
          // 'opName': , // 操作员名称
        },
        successHandle: (res) => {
          
          if(back) {
            back();
          }
        },
        ...this.errHandler
      }
      new YdjAjax(opt);
  }

  _getUt() {
    var ut = "";
    var arrstr = document.cookie.split("; ");
    for(var i = 0;i < arrstr.length;i ++){
        var temp = arrstr[i].split("=");
        if(temp[0].indexOf("_sso_token")!=-1){
            ut = unescape(temp[1]);
            break;
        }  
    }
    return ut;
  }

  // 获取OSS Token
  _getOssToken() {
    let ut = this._getUt();
  	let opt = {
  		url: ApiConfig.ossToken,
      headers : {
        // 'Content-Type' : 'application/json',
        'ak': 'IMG_UPLOADER', 
        'ut': ut,
        'X-Requested-With': 'XMLHttpRequest'
      },
  		successHandle: (res) => {
  			
  			// 1.address: 文件上传地址，会根据客户ip返回最优的上传地址
  			// 2.validMinutes:有效时长分钟数，目前固定为60分钟
  			// 3.param：json对象，每次上传必须以form表单参数的形式post给阿里云
  			// 4.keys：json数组，每次固定返回10个元素，每个元素都包含2个参数：
  			// key：文件在阿里云的唯一键，需要以表单参数的形式post给阿里云，
  			// path：文件下载地址的相对路径，需要保存在业务数据库中。 
  			// 每个key只能用于一个文件的上传，重复使用会覆盖前一次上传的内容
        let uploadParams = {
          ...res.data.param, 
          'key': res.data.keys[0].key,
          'success_action_status': 201
        }; 
        this.setState({
          fileApi: res.data.address,
          uploadParams: {
            ...res.data.param, 
            'key': res.data.keys[0].key,
          },
          imgUrl: res.data.keys[0].path,
        }); 
  		},
  		...this.errHandler
    }
  	new YdjAjax(opt);
  }

  // 发送邮件
  _uploadFile() {
    this.setState({
      sending: true
    }, ()=>{
       this.sendWatermarkImg(()=>{
        this.setState({
          sendFlag: true,
          sending: false,
        });
      })
    })
   
  }

  handleChange(files) {
    console.log('handleChange', files);
  }

  uploadError(a) {
    console.log('uploadError', a);
    
    this.setState({
      isAlert: true,
      alertMsg: {
        msg: '上传图片失败，请刷新页面后后重试'
      },
      sending: false
    })
  }

  removeImg(a) {
    console.log('removeImg', a);
    
    this.setState({
      fileChange: true,
      fileList: [],
    });
    return true;
  }

  uploadSuccess(a) {
    console.log('uploadSuccess', a);
    
    setTimeout(() => {
      this.editWatermarkImg(() => {
        
        this.setState({
          fileChange: true,
          fileList: [{
            uid: -1,
            url: `${ApiConfig.fileHost}${this.state.imgUrl}!s`,
            largeUrl: `${ApiConfig.fileHost}${this.state.imgUrl}!l`,
            path: `${this.state.imgUrl}`,
          }],
        });
      });
    }, 100)
  }
  render() {
    
    const uploadButton = (
      <div>
        <div className="ant-upload-text">核对完成，上传水单</div>
      </div>
    );
    
    return (
        <div className="upload-img-wrap">
        <Upload
            accept='"image/jpg,image/jpeg,image/png,image/gif'
            fileList={this.state.fileList}
            className="upload-img"
            listType="picture"
            action={this.state.fileApi}
            header={{'contentType': 'multipart/form-data'}}
            data={this.state.uploadParams}
            showUploadList = {{showPreviewIcon: true, showRemoveIcon: !this.props.sendFlag && !this.state.sendFlag}}
            onPreview={this.handlePreview.bind(this)}
            onChange={this.handleChange.bind(this)}
            onError={this.uploadError.bind(this)}
            onSuccess={this.uploadSuccess.bind(this)}
            onRemove={this.removeImg.bind(this)}
          >
          {
            (this.state.fileChange && (this.state.fileList && this.state.fileList.length)) || (!this.state.fileChange && (this.props.sendFlag || this.state.sendFlag || (this.props.fileList && this.props.fileList.length))) ? 
            null : uploadButton
          }
          </Upload>
          {
            !this.props.sendFlag && !this.state.sendFlag && ((!this.state.fileChange && this.props.fileList && this.props.fileList.length) || (this.state.fileChange && this.state.fileList && this.state.fileList.length)) ?
            <Button 
            loading={this.state.sending}
            className="send-img" 
            onClick={this._uploadFile.bind(this)}>提交</Button> : null
          }
          <Modal 
            visible={this.state.previewVisible} 
            footer={null} 
            onCancel={()=>{this.setState({ previewVisible: false, previewUrl: ''});}}>
            <img alt="" style={{ width: '100%' }} src={this.state.previewUrl} />
          </Modal>
          {this.showMsg()}
        </div>
    )
  }
}

export default Uploader;

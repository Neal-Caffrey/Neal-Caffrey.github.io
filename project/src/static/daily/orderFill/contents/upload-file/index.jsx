import React , {Component} from 'react';
import './sass/index.scss';
// import UploadFile from "../upload-file/index.jsx";
import {Upload, Button, Icon} from 'local-Antd';
import ApiConfig from 'widgets/apiConfig/index.js';
import $ from 'local-Zepto/dist/main.js';

class UploadFile extends Component{
    constructor(props,context){
        super(props,context);
        this.cacheData();
        this.state = this.defaultState;
    }   

    cacheData(props = this.props) {
        let {fileObj} = props;
        this.uploadFileName = (fileObj && fileObj.uploadFileName) || '';
        this.uploadFileSize = (fileObj && fileObj.uploadFileSize) || '';
        this.uploadFilePath = (fileObj && fileObj.uploadFilePath) || '';
    }

    get defaultState(){
        return {
            uploadStatus : this.props.fileObj ? 'done' : 'default'
        };
    }

    handleChange(info) {
        if(info.file.status == 'uploading'){
            console.log('uploading...');
            if(this.state.uploadStatus != 'uploading'){
                this.setState({
                   uploadStatus: 'uploading'
               }) 
            }
            
        }
        else if(info.file.status == 'done' && info.file.response.status == 200){
            console.log('upload done~~');
            
            this.uploadFileName = info.file.response.data.fileName;
            this.uploadFileSize = info.file.response.data.fileSize;
            this.uploadFilePath = info.file.response.data.path;
            // debugger;
            this.setState({
                uploadStatus: 'done'
            });
            this.handleBack();
        }
        else{
            alert(info.file.response.message)
        }
    }

    handleBack() {
        this.props.onHandle && this.props.onHandle.call(this, {
            uploadFilePath : this.uploadFilePath,
            uploadFileName : this.uploadFileName,
            uploadFileSize : this.uploadFileSize
        })
    }

    doUpLoad() {
        $(`.${this.props.uid} .ant-upload`).click();
    }

    deleteFile() {
        this.setState({
            uploadStatus: 'default'
        })
        this.props.onHandle && this.props.onHandle.call(this, '')
    }

    render(){
        const uploadObj = {
            name: 'uploadFile',
            action: ApiConfig.upload,
            accept: 'application/pdf',
            showUploadList: false,
            className: 'goUpLoad',
            onChange: this.handleChange.bind(this)
        }
        return (
            <div className={`${this.props.uid} ui-upload`}>
                <Upload {...uploadObj}></Upload>
                {
                    this.state.uploadStatus == 'done' ?
                    <div className="upload-after">
                        <span className="upload-file"></span>
                        <div className="file-wrap">
                            <p><a href={`${ApiConfig.fileHost}${this.uploadFilePath}`} target="_blank">{this.uploadFileName}</a><br/><small>{this.uploadFileSize}</small></p>
                            <div className="btns-wrap">
                                <a className="J-editUpload" onClick={this.doUpLoad.bind(this)}>编辑</a>
                                <a  className="J-deleteUpload" onClick={this.deleteFile.bind(this)}>删除</a>
                            </div>
                        </div>
                    </div> :
                    <div className="upload-default" onClick={this.doUpLoad.bind(this)}>
                        <span className="icon-upload"></span>
                        {
                            this.state.uploadStatus == 'uploading' ? 
                            <p>上传中，请稍候...<br/><small>上传过程中请不要保存修改</small></p> : 
                            <p>点击上传行程<br/><small>当前支持PDF格式文档</small></p>
                        }
                    </div> 
                }
            </div>
        )
    }
}

export default UploadFile;
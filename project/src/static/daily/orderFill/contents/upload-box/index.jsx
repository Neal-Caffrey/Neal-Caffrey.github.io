import React , {Component} from 'react';
import { connect } from 'react-redux';
import './sass/index.scss';
import Marks from 'components/ui-mark/index.jsx';
import UploadFile from "../upload-file/index.jsx";
// import {Upload, Button, Icon} from 'local-Antd';
import {changeDemand} from '../../action/leftSideAction.js';
import ApiConfig from 'widgets/apiConfig/index.js';

class UploadBox extends Component{
    constructor(props,context){
        super(props,context);
        this.state = this.defaultState;
        this.cacheData();
    }   

    get defaultState(){
        return {
            isRrfresh : false,
            uploadStatus : 'default'
        };
    }

    cacheData() {
        this._data = [
            {
                content:'经验丰富',
                select: false
            },
            {
                content:'热情好客',
                select: false
            },
            {
                content:'细心周到',
                select: false
            },
            {
                content:'男司导优先',
                select: false
            },
            {
                content:'金牌翻译',
                select: false
            },
            {
                content:'摄影大拿',
                select: false
            },
            {
                content:'当地百事通',
                select: false
            },
            {
                content:'成熟稳重',
                select: false
            },
            {
                content:'资深司导',
                select: false
            }
        ];
    }

    setRefresh(){
        this.setState({
            isRefresh : !this.state.isRefresh
        });
    }

    getUsRemark(info) {
        this.remark = info.value
        this.handleBack();
        console.log(info.value);
    }

    getSelect(){
        let selectspan=[];
        this._data.forEach((item, key) => {
            if(item.select){
                selectspan.push(item.content);
            }
        });
        console.log(selectspan);
        this.guideTags = selectspan;
        this.handleBack();
    }

    handleClick(item, key){
        let _data = this._data;
        _data.map((item, index) => {
                if(index == key) {
                    item.select = !item.select;
                }
            return item;
        })
        this._data = _data;
        this.setRefresh();
        this.getSelect();
    }

    getUpload(val) {
        this.uploadFilePath = val.uploadFilePath;
        this.handleBack();
    }

    handleBack() {
        let obj = {
            csRemark : this.remark || "",
            guideTags : this.guideTags || [],
            uploadFilePath : this.uploadFilePath || "",
        }
        this.props.dispatch(changeDemand(obj))
    }

    render(){
        return (
            <div  className="upload-box">
                <div className="upload-wrapper">
                    <div className="left-box">
                        <div className="left">
                            <div className="left-center">
                                <UploadFile onHandle={this.getUpload.bind(this)} uid={'up-travel'} className="up-travel"/>
                            </div>
                        </div>
                    </div>
                    <div className="right-box">
                        <p>帮我安排这样的司导<small>（我们会尽力满足您的需求）</small></p>
                        <div className="tags">
                            <dl>
                                {
                                    this._data.map((item, key) => {
                                        return (
                                            <dd key={key}>
								                <span
                                                    className={item.select?'select':null}
                                                    onClick={this.handleClick.bind(this, item, key)}
                                                >
                                                    {item.content}
                                                </span>
                                            </dd>
                                        )
                                    })
                                }
                            </dl>
                        </div>
                        <div className="textarea-box">
                            <Marks
                                max='300'
                                placeholder='给司导捎句话：例如：客人有小孩，勿吸烟'
                                onHandle={this.getUsRemark.bind(this)}
                                name='userRemark'/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

// export default UploadBox;
const mapStateToProps = (state) => {
    return {
        demandInfo: state.leftSide.demandInfo
    }
}

export default connect(mapStateToProps)(UploadBox)
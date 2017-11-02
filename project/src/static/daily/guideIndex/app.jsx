import React, { Component } from 'react';
import { connect } from 'react-redux';
import YdjAjax from 'components/ydj-Ajax';
import Apiconfig from 'widgets/apiConfig';
import { _extend, _getQueryObjJson } from 'local-Utils/dist/main.js';
import Header from 'contents/header/index.jsx';
import Footer from 'contents/footer/index.jsx';
import Loading from 'components/ui-loading/index.jsx';
import Msg from 'components/ui-msg/index.jsx';
import { Spin } from 'local-Antd';
import LeftSide from './contents/leftSide/index.jsx';
import Comment from './contents/comment/index.jsx';
import Cars from './contents/cars/index.jsx';
import Album from './contents/album/index.jsx';
import Story from './contents/story/index.jsx';
import BaseCss from 'local-BaseCss/dist/main.css';
import UISwiper from 'components/ui-swiper/index.v2.jsx';
import { showAblum } from './action/index.js';
import './sass/index.scss';

class App extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = this.defaultState;
        this.cacheData();
        this.getGuideInfo();
        this.getComment();
    }

    get defaultState() {
        return {
            isLoading: true,
            tabIndex: 0,
            comment: false
        }
    }

    get guideId() {
        return _getQueryObjJson().guideId
    }

    get _handleErrors() {
        let handles = {
            failedHandle: (res) => {
                let _state = {
                    isAlert: true,
                    alertMsg: {
                        msg: res.message
                    }
                };
                this.setState(_state);
            },
            errorHandle: (xhr, errorType, error, errorMsg) => {
                let _state = {
                    isAlert: true,
                    alertMsg: errorMsg
                };
                this.setState(_state);
            }
        };
        return handles;
    }

    cacheData() {
        this.data = {
            guideInfo: {},
            comment: {
                offset: 0,
                limit: 10,
                current: 1
            }
        }
    }

    changeTab(index) {
        this.setState({
            tabIndex: index
        })
    }

    getGuideInfo() {
        let opt = {
            url: Apiconfig.guideIndex,
            data: {
                guideId: this.guideId
            },
            abort: true,
            successHandle: (res) => {
                _extend(this.data.guideInfo, res.data)
                this.setState({
                    isLoading: false
                })
            },
            ...this._handleErrors
        }
        new YdjAjax(opt);
    }

    getComment(page) {
        let comment = this.data.comment;
        comment.offset = page ? (page.current - 1) * comment.limit : comment.offset;
        let opt = {
            url: Apiconfig.guideIndexComment,
            data: {
                guideId: this.guideId,
                offset: comment.offset,
                limit: comment.limit
            },
            abort: true,
            successHandle: (res) => {
                _extend(comment, res.data);
                comment.current = Math.trunc(comment.offset / comment.limit) + 1
                this.setState({
                    comment: true
                })
            },
            ...this._handleErrors
        }
        new YdjAjax(opt);
    }

    _cbDoSomething(info) {
        if (info.type == 'hideAblum') {
            let opt = {
                isShowAblum: false,
                ablumImages: [],
                ablumIndex: 0
            }
            this.props.dispatch(showAblum(opt));
        }
    }

    _showMsg() {
        if (this.state.isAlert) {
            let attr = {
                showFlag: true,
                showType: 'alert', // info alert confirm
                backHandle: () => {
                    if (this.state.alertMsg.loginErr) {
                        window.location.href = '/';
                    }
                }
            }
            return (<Msg initData={attr}><p>{this.state.alertMsg.msg}</p></Msg>)
        }
    }

    render() {
        if (this.state.isLoading) {
            return (
                <div>
                    <Loading />
                    {this._showMsg()}
                </div>
            )
        }
        return (
            <div id='ui-wrap' className="clearfix">
                <Header  active={-1}/>
                <div className="main clearfix">
                    <LeftSide info={this.data.guideInfo} />
                    <div className="right-side">
                        <ul className="nav-bar clearfix">
                            {
                                (() => {
                                    let navArr = ['收到的评价', '我的相册', '我的故事', '我的车辆'];
                                    let res = [];
                                    for (let i = 0; i < navArr.length; i++) {
                                        res.push(
                                            <li className={this.state.tabIndex === i ? "active" : ""} onClick={this.changeTab.bind(this, i)}>{navArr[i]}</li>
                                        )
                                    }
                                    return res
                                })()
                            }
                        </ul>
                        <div className="tab-con">
                            {this.state.tabIndex == 0 ? this.state.comment === true ? <Comment data={this.data.comment} onChangePage={this.getComment.bind(this)} /> : (
                                <div className="comment-loading">
                                    <Spin />
                                </div>
                            ) : null}
                            {this.state.tabIndex == 3 ? <Cars carInfo={this.data.guideInfo.guideCars || []} /> : null}
                            {this.state.tabIndex == 1 ? <Album photos={this.data.guideInfo.photoVo.showList} /> : null}
                            {this.state.tabIndex == 2 ? <Story story={this.data.guideInfo.guideStory || {}} /> : null}
                        </div>
                    </div>
                </div>
                <Footer />
                {
                    this.props.ablumInfo.isShowAblum ?
                        <UISwiper imgs={this.props.ablumInfo.ablumImages} index={this.props.ablumInfo.ablumIndex} handle={this._cbDoSomething.bind(this)} show={this.props.ablumInfo.isShowAblum}
                        /> : null
                }
                {this._showMsg()}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        ablumInfo: state.ablumInfo
    }
}

export default connect(mapStateToProps)(App);

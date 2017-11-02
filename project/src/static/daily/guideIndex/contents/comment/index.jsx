import React, { Component } from 'react';
import { connect } from 'react-redux';
import { showAblum } from '../../action/index.js';
import Stars from "components/ui-star/index.jsx";
import Page from 'components/ui-page/index.jsx';
import './sass/index.scss';

class Comment extends Component {
  constructor(props, context) {
    super(props, context);
  }

  get defTxt() {
    return ['非常不满', '不满意', '一般', '满意', '非常满意'];
  }

  showAblum(imgs, index) {
    let imgArr = [];
    imgs.map((item, i) => {
      imgArr.push({
        imageUrl: item
      })
    })
    let opt = {
      isShowAblum: true,
      ablumImages: imgArr,
      ablumIndex: index
    }
    this.props.dispatch(showAblum(opt));
  }

  changePage() {
    this.props.changePage()
  }

  render() {
    let data = this.props.data;
    return (
      <div className="comment">
        {
          data.comments.length > 0 ? (
            <div>
              <h2>来自直客评价</h2>
              <div className="list">
                {
                  data.comments.map((item, i) => {
                    return (
                      <dl className="clearfix">
                        <dt style={item.avatar ? { backgroundImage: `url(${item.avatar})` } : null}></dt>
                        <dd>
                          <h3 className="clearfix">
                            <span><em>{item.nickName ? item.nickName : '匿名用户'}</em><small>{item.serviceTime} 出行</small></span>
                            <span className="trip"><Stars score={item.totalScore} /><small>{item.orderTypeName}</small></span>
                          </h3>
                          {item.content ? <p>{item.content}</p> : this.defTxt[item.totalScore - 1]}
                          {
                            item.commentPic.length > 0 ?
                              <ul className="clearfix">
                                {
                                  item.commentPic.map((_, j) => {
                                    return (
                                      <li style={_ ? { backgroundImage: `url(${_})` } : null} onClick={this.showAblum.bind(this, item.commentPicL, j)}></li>
                                    )
                                  })
                                }
                              </ul> : null
                          }
                          {
                            item.guideReply ? <p className="reply">司导回复：{item.guideReply}</p> : null
                          }
                        </dd>
                      </dl>
                    )
                  })
                }
              </div>
              <Page
                total={data.totalCount}
                onHandle={this.props.onChangePage}
                current={data.current}
                limit={data.limit} />
            </div>
          ) : <div className="empty">
              <p>司导还未收到任何客人的评价</p>
            </div>
        }
      </div >
    )
  }
}

const mapStateToProps = (state) => {
  return {
    ablumInfo: state.ablumInfo
  }
}

export default connect(mapStateToProps)(Comment);

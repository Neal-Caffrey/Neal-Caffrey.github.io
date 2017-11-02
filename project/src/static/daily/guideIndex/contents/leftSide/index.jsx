import React, { Component } from 'react';
import "components/globleCss/font.scss";
import './sass/index.scss';
class LeftSide extends Component {
  constructor(props, context) {
    super(props, context);
  }

  get skill() {
    let info = this.props.info;
    let arr = [];
    if (info.skillVo && info.skillVo.showList && info.skillVo.showList.length > 0) {
      info.skillVo.showList.map((item, index) => {
        arr.push(item.labelName)
      })
      return arr.join(' · ')
    }
    return null;
  }

  render() {
    let info = this.props.info;
    return (
      <div className="left-side">
        <h2 className="sim-info">
          <span className="head" style={{ backgroundImage: `url(${info.avatar})` }}>
            <span className={info.gender === 1 ? "icon-man" : "icon-women"}>
              <i className="path1"></i>
              <i className="path2"></i>
            </span>
          </span>
          <span className="name">{info.guideName}</span>
          <span className="info">{info.cityName}<br />工号：{info.guideNo}</span>
        </h2>
        <h3 className="ser-info">
          <span className="work-num same-one">{info.completeOrderNum} <small>单<i>|</i></small></span>
          <span className="eval-num same-one">{info.commentNum} <small>评价<i>|</i></small></span>
          {
            info.serviceStar ?
            <span className="same-one">{info.serviceStar} <small>星</small></span>
            :<span className="is-star">暂无星级</span>
          }

        </h3>
        {this.skill ? <h4 className="work-name"><span className="icon-tag"></span>{this.skill}</h4> : null}
        <p className="detail-info">{info.homeDesc}</p>
        <dl className="comp-skill">
          <dt className="skill-type">普通话/方言</dt>
          <dd className="skill-name">{info.guideLocalLangs || "中文（普通话"}</dd>
        </dl>
        <dl className="comp-skill">
          <dt className="skill-type">精通外语</dt>
          <dd className="skill-name">{info.guideForeignLangs || "暂未填写"}</dd>
        </dl>
        <dl className="comp-skill">
          <dt className="skill-type">家乡</dt>
          <dd className="skill-name">{info.hometownName || "暂未填写"}</dd>
        </dl>
        <dl className="comp-skill">
          <dt className="skill-type">职业</dt>
          <dd className="skill-name">{info.jobName || "暂未填写"}</dd>
        </dl>
        <p className="pro-types">
          <span className="type1 pro-type">实名认证</span>
          <span className="type2 pro-type">车辆年审</span>
          <span className="type3 pro-type">考核上岗</span>
        </p>
      </div >
    )
  }
}

export default LeftSide;

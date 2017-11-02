import React, { Component, PropTypes} from 'react';
import {Button, Icon} from 'local-Antd';
import NumberSelect from 'components/ui-number/index.jsx';
import OnclickOutside from 'react-onclickoutside';
import './sass/index.scss';
/**
* 通用酒店入住客人选择 
* arguments {
*     initData{
*         uiClassName       : string                ->       // 定制class，自定义样式
*         childAges         : array                 ->       // 按钮是否异步关闭
*         adultMin          : number                ->       // 成人数最小值
*         adultMax          : number                ->       // 成人数最大值  
*         adultNum          : number                ->       // 成人数默认值  
*         childMin          : number                ->       // 儿童数最小值  
*         childMax          : number                ->       // 儿童数最大值  
*         childNum          : number                ->       // 儿童数默认值 
*         ageMin            : number                ->       // 年龄选项的最小值  
*         ageMax            : number                ->       // 年龄选项的最大值  
*         ageDef            : number                ->       // 年龄选项的默认值  
*         confirmHandler    : func                  ->       // 选项变更时的回调
*     }   
* }
**/
export default OnclickOutside( class UiGuestSelect extends Component {
    static propTypes = {
        initData: PropTypes.object.isRequired
    }
    constructor(props, context) {
        super(props, context);
        this.initData = this.props.initData ? this.props.initData : {};
        this.state = {
            adultNum: this.initData.adultNum,
            childNum: this.initData.childNum,
            childAges: this.initData.childAges,
            popState: false
        };
        this._getAttrs();
    }
    // 获取配置参数
    get propsInitData() {
        return this.props.initData ? this.props.initData : {};
    }
    // 获取className
    get propsClassName() {
        return this.initData.uiClassName ? `ui-guest-select-wrap ${this.initData.uiClassName}` : 'ui-guest-select-wrap';
    }
    // agesValue
    _agesValue(val) {
        let ageSize = val;
        let len = (this.state.childAges && this.state.childAges.length) || 0;
        if (ageSize == 0) {
            return [];
        } else if (ageSize < len) {
            return this.state.childAges.slice(0, ageSize);
        } else {
            let that = this;
            let news = function() {
                let tmp = [];
                for (let j = len; j < ageSize; j++) {
                    tmp.push({
                        defValue: that.initData.ageDef,
                        minNum: that.initData.ageMin || 1,
                        maxNum: that.initData.ageDef || 17,
                    });
                }
                return tmp;
            };
            return (this.state.childAges || []).concat(news());
        }
    }
    get renderMain() {
        if(!this.state.popState) {
            return "";
        } else {
            this._getCurAttrs();
            return (
                <div className="dropdown-guest-panel">
                    <div className="title">每间入住人数</div>
                    <div className="clearfix row person-row">
                        <div className="adult-col">
                            <label>成人</label>
                            <NumberSelect {...this.adultAttrs}/>
                        </div>
                        <div className="child-col">
                            <label>儿童</label>
                            <NumberSelect {...this.childAttrs}/>
                        </div>
                    </div>
                    <div className="clearfix row age-rows">
                    {
                        this.state.childAges.map((item, key) => {
                            return (
                                <div className="age-col" key={key}>
                                    <div className="title">儿童{key + 1}</div>
                                    <div className="row age-row">
                                        <label>年龄</label><NumberSelect defValue={this.state.childAges[key].defValue} selectedHandler={this._changeChildAge.bind(this, key)} {...this.childAgeAttrs}/>
                                    </div>
                                </div>
                            );
                        })
                    }
                    </div>
                    <div className="row">
                        <Button className="submit-btn" onClick={this._confirmGuest.bind(this)}>保存</Button>
                    </div>
                </div>
            );
        }
    }
    _getCurAttrs() {
        this.adultAttrs.defValue = this.state.adultNum;
        this.childAttrs.defValue = this.state.childNum;
    }
    // 组件属性
    _getAttrs() {
        // 成人选择
        this.adultAttrs = {
            defValue: this.state.adultNum,
            selectedHandler: this._changeAdult.bind(this),
            uiClassName: "room-adult-select",
            uiPlaceholder: this.initData.adultPlaceholder || "成人数",
            minNum: this.initData.adultMin || 1,
            maxNum: this.initData.adultMax || 10,
        },
        // 儿童选择
        this.childAttrs = {
            defValue: this.state.childNum,
            selectedHandler: this._changeChild.bind(this),
            uiClassName: "room-child-select",
            uiPlaceholder: this.initData.childPlaceholder || "儿童数",
            minNum: this.initData.childMin || 0,
            maxNum: this.initData.childMax || 5,
        }
        // 儿童年龄
        this.childAgeAttrs = {
            uiClassName: "room-child-age",
            uiPlaceholder: this.initData.childAgePlaceholder || "年龄",
            minNum: this.initData.ageMin || 1,
            maxNum: this.initData.ageMax || 17,
        }
    }
    // 成人数
    _changeAdult(val) {
        this.setState({
            adultNum: val
        },() => {
            this.initData.confirmHandler && this.initData.confirmHandler(this.state);
        });
    }
    // 儿童数
    _changeChild(val) {
        this.setState({
            childNum: val,
            childAges: this._agesValue(val)
        },() => {
            this.initData.confirmHandler && this.initData.confirmHandler(this.state);
        });
    }
    // 儿童年龄
    _changeChildAge(key, val) {
        let tmp = this.state.childAges;
        tmp[key].defValue = val;
        this.setState({
            childAges: tmp
        }, () => {
            this.initData.confirmHandler && this.initData.confirmHandler(this.state);
        });
    }
    // 确认选择
    _confirmGuest() {
        this.setState({
            adultNum: this.state.adultNum,
            childNum: this.state.childNum,
            childAges: this.state.childAges,
            popState: false,
        }, () => {
            this.initData.confirmHandler && this.initData.confirmHandler(this.state);
        });
    }
    // 切换显示状态
    _togglePop() {
        this.setState({
            popState: !this.state.popState,
        })
    }
    handleClickOutside() {
        if (this.state.popState == true) {
            this.setState({
                popState: false,
            })
        } 
    }
    render() {
        return (
        <div className={this.propsClassName}>
            <Button className={this.state.popState?'open':""} onClick={this._togglePop.bind(this)}>{(this.state.adultNum && this.state.adultNum + '成人,' + this.state.childNum + '儿童/间')|| '选择入住客人数'}<Icon type="caret-down" /></Button>
            {this.state.popState? this.renderMain : null}
        </div> 
        )
    }
})

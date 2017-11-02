import React, { Component, PropTypes} from 'react';
import {Select, Button, Icon } from 'local-Antd';
const Option = Select.Option;
import './sass/index.scss';
/**
* 通用数值选择
* arguments {
*     initData{
*         uiClassName           : string            ->                          // 定制class,自定义样式
*         uiPlaceholder         : string            -> placeholder              // 无选中值是时的显示文案
*         minNum                : number            ->                          // 选项的最小数值
*         maxNum                : number            ->                          // 选项的最大数值
*         selectedHandler       : func              ->                          // 选定值后回调 
*         defValue              : string            -> value/defaultValue       // 选中值
*         postfix               : string            -> label                    // label数值后的后缀
*         prefix                : string            -> label                    // label数值前的前缀
*         step                  : string            -> label                    // label数值前的前缀
*     }   
* }
**/
export default class UiNumberSelect extends Component {
    constructor(props, context) {
        super(props, context);
        this.defData = {
            prefix      : this.propsPrefix,
            postfix     : this.propsPostfix,
            max         : this.propsMax,
            min         : this.propsMin,
            step        : this.propsStep,
            placeholder : this.propsPlaceHolder,
            className   : this.propsClassName
        };
        this.defData.options = this.selectOpts;
        this.state = {};
        this.selecttAttrs = {
            onChange        : this._select.bind(this),
            placeholder     : this.defData.placeholder,
            notFoundContent : "输入值无效",
            showSearch      : true
        },
        this.minusAttrs = {
            onClick: this._minus.bind(this)
        },

        this.plusAttrs = {
            onClick: this._plus.bind(this)
        }


    }
    componentWillMount() {
        this.props.defValue !== undefined && (this.setState({
            value: this.props.defValue + ''
        }));
    }
    // 获取placeholder
    get propsPlaceHolder() {
        return this.props.uiPlaceholder ? `${this.props.uiPlaceholder}` : '数量';
    }
    // 获取className
    get propsClassName() {
        return this.props.uiClassName ? `ui-number-wrap ${this.props.uiClassName}` : 'ui-number-wrap';
    }
    // 获取下拉选项
    get selectOpts() {
        let options = [];
        for (let i = this.defData.min; i < this.defData.max + this.defData.step;) {
            options.push({
                value: i + "",
                label: `${this.defData.prefix}${i}${this.defData.postfix}`
            });
            i += this.defData.step;
        }
        return options;
    }
    // 获取步长
    get propsStep() {
        return this.props.step || 1;
    }
    // 获取postfix
    get propsPostfix() {
        return this.props.postfix ? `${this.props.postfix}` : '';
    }
    // 获取prefix
    get propsPrefix() {
        return this.props.prefix ? `${this.props.prefix}` : '';
    }
    // 获取最大值
    get propsMax() {
        return this.props.maxNum || 10;
    }
    // 获取最小值
    get propsMin() {
        return this.props.minNum || 0;
    }
    // 选择事件处理
    _selectChange(val) {
        let state = this._checkLimit(val);
        state.value = val + '';
        state.min = this.defData.min;
        state.max = this.defData.max;
        state.step = this.defData.step;
        this.setState(state);
        this.props.selectedHandler && this.props.selectedHandler(val + '');
    }
    // 选择事件处理
    _select(val) {
        if(this.state.value == val) {
            return false;
        }
        this._selectChange(val);
    }
    // 按钮+事件
    _plus(key) {
        let val = parseInt(this.state.value) + this.defData.step;
        if(val > this.defData.max) {
            return;
        }
        this._selectChange(val);
    }
    // 按钮-事件
    _minus(key) {
        let val = parseInt(this.state.value) - this.propsStep;
        if(val < this.defData.min) {
            return;
        }
        this._selectChange(val);
    }
    // 校验是否最大最小
    _checkLimit(val) {
    	let value = parseInt(val);
    	let minFlag = false;
    	let maxFlag = false;
    	if(value < this.defData.min + this.defData.step) {
            minFlag = true;
        }
        if(value > this.defData.max - this.defData.step) {
            maxFlag = true;
        }
        return {isMin: minFlag, isMax: maxFlag}
    }
    render() {
        return ( 
            <div className = {this.defData.className}>
                <Button className="minus" icon="minus" disabled={this.state.value ==undefined || this.state.isMin} {...this.minusAttrs} />  
                <Select {...this.selecttAttrs} value={this.state.value}>
                    {this.selectOpts.map((item, key) => {
                            return (
                                <Select.Option key={key} value={item.value}>{item.label}</Select.Option>
                            );
                        })
                    }
                </Select>
                <Button className="plus" icon="plus" disabled={this.state.value ==undefined || this.state.isMax} {...this.plusAttrs}/>
            </div>
        )  
    }
}

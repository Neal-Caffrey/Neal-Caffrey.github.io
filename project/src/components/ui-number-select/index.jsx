import React, { Component, PropTypes} from 'react';
import {Select, Icon} from 'local-Antd';
const Option = Select.Option;
import './sass/index.scss';
/**
* 通用数值选择
* arguments {
*         uiClassName           : string            ->                          // 定制class,自定义样式
*         uiPlaceholder         : string            -> placeholder              // 无选中值是时的显示文案
*         minNum                : number            ->                          // 选项的最小数值
*         maxNum                : number            ->                          // 选项的最大数值
*         selectedHandler       : func              ->                          // 选定值后回调 
*         defValue              : string            -> value/defaultValue       // 选中值
*         postfix               : string            -> label                    // label数值后的后缀
*         prefix                : string            -> label                    // label数值前的前缀
*         step                  : number            -> label                    // 步长
* }
**/
export default class UiNumberSelect extends Component {
    static propTypes = {
        uiClassName     :  PropTypes.string,
        minNum          : PropTypes.number,
        maxNum          : PropTypes.number,
        step            : PropTypes.number,
        selectedHandler : PropTypes.func,
        defValue        : PropTypes.string,
    }
    constructor(props, context) {
        super(props, context);
        this.state = {};
        this.selecttAttrs = {
            onChange        : this._selectChange.bind(this),
            placeholder     : this.propsPlaceHolder,
            notFoundContent : "输入值无效",
            showSearch      : true
        };
        this.defData = {
            prefix      : this.propsPrefix,
            postfix     : this.propsPostfix,
            step        : this.propsStep
        }
        this.propsDefaultVal && (this.selecttAttrs.defaultValue = this.propsDefaultVal);
    }
    componentWillMount() {
        this.props.selectedHandler && this.props.selectedHandler(this.propsDefaultVal);
    }
    // 获取下拉选项
    get selectOpts() {
        let min = this.props.minNum || 1;
        let max = this.props.maxNum || 10;
        let options = [];
        for (let i = min; i < max + this.defData.step;) {
            options.push({
                value: i + "",
                label: `${this.defData.prefix}${i}${this.defData.postfix}`
            });
            i += this.defData.step;
        }
        return options;
    }
    // 获取step
    get propsStep() {
        return this.props.step ? this.props.step : 1;
    }
    // 获取postfix
    get propsPostfix() {
        return this.props.postfix ? `${this.props.postfix}` : '';
    }
    // 获取prefix
    get propsPrefix() {
        return this.props.prefix ? `${this.props.prefix}` : '';
    }
    // 获取className
    get propsClassName() {
        return this.props.uiClassName ? `ui-select-wrap ${this.props.uiClassName}` : 'ui-select-wrap';
    }
    // 获取placeholder
    get propsPlaceHolder() {
        return this.props.uiPlaceholder ? `${this.props.uiPlaceholder}` : '请选择';
    }
    // 获取默认值设置
    get propsDefaultVal() {
        return this.props.defValue;
    }
    // 选择事件处理
    _selectChange(val) {
        this.setState({
          value: val
        }, ()=>{
           this.props.selectedHandler && this.props.selectedHandler(val); 
        });
    }
    render() {
        return ( 
            <div className = {this.propsClassName} >
                <Select {...this.selecttAttrs} {...this.state}>
                    {this.selectOpts.map((item, key) => {
                        return (
                                <Select.Option key={key} value={item.value}>{item.label}</Select.Option>
                            );
                        })
                    }
                </Select>
            </div>
        )
    }
}

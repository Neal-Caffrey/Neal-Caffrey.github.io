import React, {
  Component,
  PropTypes
} from 'react';
import { Modal, Button } from 'local-Antd';
import './sass/index.scss'
/**
* 通用弹框  
* arguments {
*     initData{
*         uiClassName       : string            ->                          // 定制class，自定义样式
*         asyn              : bool              -> confirmLoading           // 按钮是否异步关闭
*         showFlag          : bool              -> visible                  // 对话框是否可见
*         showType          : enum              ->                          // 用于显示按钮及识别处理方法 【info, alert, confirm】  
*         backHandle        : func              ->                          // confirm类型中confirm按钮事件,alert类型中ok按钮事件
*         title             : string            -> title                    // 对话框的Title          
*         content           : string（html）     ->                          // 对话框的Title   
*         cancelText        : string            -> cancelText               // 取消按钮text
*         okText            : string            -> okText                   // confirm按钮/ok按钮按钮text         
*         disabled          : bool              ->                          // 确认按钮是否默认禁用      
*     }   
* }
**/
export default class UiMsg extends Component {
    constructor(props, context) {
        super(props, context);
        this.initData = this.props.initData || {};
        !this.initData.showType  && (this.initData.showType = 'info');
        this.state = {
            visible: !!this.initData.showFlag,
            maskClosable: this.initData.showType.toLowerCase() == 'info'? true : false,
            confirmLoading: !!this.initData.asyn,
            startLoading: false,
        };
    }
    componentWillReceiveProps(nextProps){
        this.setState({visible: nextProps.initData.showFlag,disabled : nextProps.disabled });
    }
    // 获取className
    get propsClassName() {
        return this.props.uiClassName ? `ui-msg-wrap ${this.props.uiClassName}` : 'ui-msg-wrap';
    }
    // 获取按钮
    get Buttons() {
        let type = (this.initData.showType && this.initData.showType.toLowerCase()) || 'info'
    	let btns;
    	switch(type) {
    		case 'info':
    		btns = "";
    		break;
    		case 'confirm':
    		btns = [<Button className="ui-cancel-btn" key="cancel" onClick={this._handle.bind(this, 'cancel')}>{this.props.initData.cancelText || '取消'}</Button>,
            <Button className={this.state.disabled || this.props.initData.disabled ? "ui-confirm-btn" : 'ui-confirm-btn ui-confirm-btn-dis'} key="confirm" loading={this.state.startLoading} disabled={!(this.state.disabled || this.props.initData.disabled)} onClick={this._handle.bind(this, 'confirm')}>
              {this.props.initData.okText || '确定'}
            </Button>];
    		break;
    		case 'alert':
    		btns = [<Button className="ui-ok-btn" key="ok" loading={this.state.startLoading} disabled={this.props.disabled} onClick={this._handle.bind(this, 'ok')}>
              {this.props.initData.okText || '确定'}
            </Button>];
    		break;
    	}
    	return btns;
    }
    // 事件处理，关闭，取消，确认
    _handle(key) {
        if (this.state.confirmLoading && (key == 'ok' || key == 'confirm')) {
            this.setState({
                startLoading: true,
            }, ()=> {
                this.initData.backHandle && this.initData.backHandle(key);
            });
            return;
        }
        this.setState({
            visible: false
        }, ()=> {
            this.initData.backHandle && this.initData.backHandle(key);
        }); 
    }
    _renderChildrens(child, index) {
        if(/^\s+/.test(child)) {
            return null;
        } else {
            return React.cloneElement(child, { key: index });
        }
    }
    render() {
    	return (
    		<Modal className={this.propsClassName} wrapClassName="vertical-center-modal"
	          visible={this.state.visible}
	          title={this.initData.title || '提示'}
              onOk={this._handle.bind(this,this.props.initData.showType)}
	          onCancel={this._handle.bind(this, 'close')}
	          footer={this.Buttons}
              maskClosable={this.state.maskClosable}
	        >
	        <div className="msg-content">
                {
                    React.Children.map(this.props.children,(val,index)=>{
                        return typeof val == 'object' ? React.cloneElement(val, { key: index }) : null;
                    })
                }
            </div>
	        </Modal>
		)
    }
}
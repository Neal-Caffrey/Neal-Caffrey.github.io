import oqrcode from 'widgets/oqrcode/index';

import React, {Component} from "react";
import Message from "components/ui-msg/index.jsx";
import BaseCss from 'local-BaseCss/dist/main.css';
import GlobleCss from 'components/globleCss/index.scss';
import {showAlert} from '../../action/index.js';
import css from './sass/index.scss';

class Qrcode extends Component {
    constructor(props,context) {
        super(props, context);
    }

    getQRcode(url){
        return new oqrcode({text:url,width:120}).toBase64()
    }

    render(){
    	console.log('render', 'qrcode');
        return(
            <div>
	            {  
	            	this.props.url ? 
	                <Message
	                initData={{
	                    title : '扫描二维码，预览行程',
	                    showType : 'info',
	                    showFlag : true,
	                    backHandle : (type) => {
	                    	let that = this;
							that.props.clickHandle && that.props.clickHandle();
	                    }
	                }}
	                uiClassName = 'qrcode'
	                >
	                	<div className="qr-wrap">
	               			<img src={this.getQRcode(this.props.url)}/>
	               		</div>
	                </Message> : null
	            }
            </div>
        )
    }
}

export default Qrcode;

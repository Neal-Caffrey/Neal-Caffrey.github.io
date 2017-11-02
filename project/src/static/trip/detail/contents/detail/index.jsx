import React, {Component} from "react";
import { Tabs } from 'local-Antd';
const TabPane = Tabs.TabPane;
import ApiConfig from 'widgets/apiConfig/index.js';
import TravelPreview from '../travelPreview/index.jsx';
import PurchaseOrder from '../purchaseOrder/index.jsx';
import BaoChe from '../baoChe/index.jsx';
import JiPiao from '../jiPiao/index.jsx';
import JiuDian from '../jiuDian/index.jsx';

import BaseCss from 'local-BaseCss/dist/main.css';
import GlobleCss from 'components/globleCss/index.scss';
import './sass/index.scss';

class Detail extends Component {
    constructor(props,context) {
        super(props, context);
        this.state = {};
        this.data = {};
    }
    changeTab(key) {
		// 1 切换到采购单；2 切换到行程预览
		console.log('changeTab', key);
    }
    render(){
        console.log('render detail', this.props);

    	return (
			<Tabs className="detail-tab" defaultActiveKey="1" onChange={this.changeTab.bind(this)}>
				<TabPane tab="采购单" key="1">
					<BaoChe/>
					<JiuDian/>
					<JiPiao/>
					<PurchaseOrder/>	
				</TabPane>
				<TabPane tab="行程预览" key="2">
					<TravelPreview />
				</TabPane>
			</Tabs>
		)
    }
}

export default Detail;

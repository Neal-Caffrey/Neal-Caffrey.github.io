import React, {Component} from "react";
import { connect } from 'react-redux';
import Page from 'components/ui-page/index.jsx';
import {
  _extend
} from 'local-Utils/dist/main.js';

import {updateSearchData} from '../../action/index.js';

class ListPage extends Component {
    constructor(props,context){
        super(props,context);
        this.state = {};
    }
    _changePage(pageInfo) {
    	// {"current":1,"pageSize":2,"all":[1],"limit":10}
    	let current = pageInfo.current;
    	let data = _extend({},this.props.result.searchData,{offset: (current - 1) * this.props.result.searchData.limit});
    	this.props.dispatch(updateSearchData(data));
    }

    render(){
        return(
            <div className="page-box">
        		{
                    (()=>{
                        let res = [];
                        if(this.props.result.result && this.props.result.result.resultBean && this.props.result.result.resultBean.length > 0) {
                            res.push(
                                <Page
                                    total={this.props.result.result.totalSize}
                                    onHandle={this._changePage.bind(this)}
                                    current={parseInt(this.props.result.searchData.offset/this.props.result.searchData.limit) + 1}
                                    limit={this.props.result.searchData.limit} />
                            );
                        }

                        return res;
                    })()
	            }
                
            </div>


        )
    }
}

function mapStateToProps(state){
    return {
        result: state.result
    }
}

export default connect(mapStateToProps)(ListPage);

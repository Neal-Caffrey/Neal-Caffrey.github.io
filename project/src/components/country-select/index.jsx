import React, { Component, PropTypes} from 'react';
import {Select, Icon} from 'local-Antd';
import ApiConfig from 'widgets/apiConfig';
import YdjAjax from 'components/ydj-Ajax/index.jsx';
import Code from './code.jsx';
const Option = Select.Option;
const OptGroup = Select.OptGroup;

export default class CountrySel extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            country : Code
        }
        // this.queryAttr = {
        //     queryParam: {
        //         type: 'GET',
        //         headers:{'Content-Type': 'application/json'},
        //         url: ApiConfig.countryHotel,
        //         // url: 'http://api6-dev.huangbaoche.com/ota/v1.0/cla/confirmHotelQuote',
        //     },
        //     name: '国家码',
        // }
    }
    handleChange(value){
        let object = (arr=>{
            let res = null;
            arr.forEach((v,index)=>{
                if(v.code === value){
                    res =  v;
                    return;
                }
            });
            return res;
        })(this.state.country.all);

        this.props.selectCountry && this.props.selectCountry(value,object);
    }


    renderSelect() {
        return (
            <div className="ui-select-wrap room-select ui-countrys">
                {
                    this.props.label === false ? null : <span>客人国籍&nbsp;</span>
                }
                <Select
                    showSearch={true}
                    style={{ width: 140 }}
                    placeholder="请选择国家"
                    optionFilterProp="children"
                    onChange={this.handleChange.bind(this)}
                    defaultValue="CN"
                    notFoundContent="没有找到相关国家"
                >
                    {this.renderOptionFrequency()}
                    {this.renderOptionAll()}
                </Select>
            </div>

        )

    }
    renderOptionFrequency(){
        return(
            <OptGroup label='常用国家' >
            {
                this.state.country.frequency.map((val,index)=>{
                    return (
                        <Option
                            value={val.code}
                            key={index}>
                            {val.countryName}
                        </Option>
                    )
                })
            }

        </OptGroup>
        )

    }
    renderOptionAll(){
        return(
            <OptGroup label='全部国家' >
                {
                    this.state.country['all'].map((val,index)=>{
                        return (
                            <Option
                                value={val.code}
                                key={index}>
                                {val.countryName}
                            </Option>
                        )
                    })
                }

            </OptGroup>
        )
    }
    // cbCountrySuccess(data){
    //     console.log(data);
    //     if(data.status === 200){
    //         this.setState({
    //             country : data.data
    //         })
    //     }
    // }
    render(){
        return this.renderSelect();
        // return (
        //     <YdjAjax
        //         queryAttr={this.queryAttr}
        //         successHandle={this.cbCountrySuccess.bind(this)}
        //         bErrorHandle={()=>{this.setState({isSearchLoading: false,})}}
        //         queryData={{}}
        //     />
        // )
    }
}

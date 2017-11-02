/**
 * Created by Gorden on 2017/5/24.
 */
import React, {
    Component,
    PropTypes
} from 'react';
// import sass from './sass/index.scss';
import LocalMap from 'local-ReactMapForYDJ/dist/main.js';
import ApiConfig from 'widgets/apiConfig/index.js';
import {
    Affix
} from 'local-Antd';


export default class UIMap extends Component {
    constructor(props) {
        super(props);
        this.mapPro = {
            wraperStyle: {
                width: '300px',
                height: '300px',
                // position : 'fixed',

            },
            popStyle: {
                width: '800px',
                height: '800px',
                position: 'absolute',
                display: 'inline'
            },
            zoom: 8,
            linePath: [],

            // markerSelIndex : this.props.markerSelIndex,
            preHref: ApiConfig.apiHost + 'webapp/hotel/detail.html?hotelId='
        }

        this.state = {
            markers: this.props.list || []
        }
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            // markerIndex : nextProps.markerSelIndex,
            markers: nextProps.list,
            markerSelIndex: nextProps.markerSelIndex
        })
    }
    render() {
        if (this.state.markers.length === 0) {
            return null;
        }
        return (
            <div style={{position: 'absolute',right: '10px',top: '10px'}}>
                <Affix offsetTop={80} target={()=>{return document.querySelector('#ui-wrap')}}>
                    <LocalMap
                        {...this.mapPro}
                        markers={this.state.markers}
                        markerSelIndex={this.props.markerSelIndex}
                    />
                </Affix>
            </div>
        )
    }
}
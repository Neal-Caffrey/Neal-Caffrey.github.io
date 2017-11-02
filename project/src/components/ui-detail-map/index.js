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
                width: '280px',
                height: '100%',
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
        }

        this.state = {
            markers: this.props.list || []
        }
    }
    componentWillReceiveProps(nextProps) {
        // this.setState({
        //     // markerIndex : nextProps.markerSelIndex,
        //     markers : nextProps.list,
        //     markerSelIndex : nextProps.markerSelIndex
        // })
    }
    render() {
        return (
            <div style={{position: 'absolute',right: '20px',top: '20px',bottom:'20px'}}>
                    <LocalMap
                        {...this.mapPro}
                        markers={this.state.markers}
                        markerSelIndex={this.props.markerSelIndex}
                    />
            </div>
        )
    }
}
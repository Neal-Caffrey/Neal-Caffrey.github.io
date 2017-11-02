import React, {Component} from 'react';
import ReactSwipe from 'react-id-swiper';
import {Icon} from 'local-Antd';
import './scss/index.scss';
import './scss/photo.scss';
export default class UISwiper extends Component {
    /*
     props : imgs
     */
    constructor(props) {
        super(props);
        this._state = {
            index: this.props.index !=undefined ?parseInt(this.props.index): 0
        };
        this.state = {
            show: this.props.show,
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.show != nextProps.show) {
            this.state = {
                height : 'auto',
                width : 'auto',
                show: nextProps.show,
                right: 'auto'
            }
        }
        
    }

    componentDidMount(){
        let _height = window.innerHeight || document.documentElement.clientHeight;
        let _width = window.innerWidth || document.documentElement.clientWidth;
        let _right = this.refs.rightContainer.clientHeight || this.refs.rightContainer.innerHeight;
        this.setState({
            height : _height,
            width : _width,
            right : _right
        });
    }

    componentDidUpdate(prevProps, prevState) {
        this.swiper && this.swiper.onResize();
        this.rightSwiper && this.rightSwiper.onResize();
    }

    componentWillUnmount() {

        this.swiper && this.swiper.detachEvents();
        this.rightSwiper && this.rightSwiper.detachEvents();
    }
    
    renderLeftMain() {
        let that = this;
        const params = {
            initialSlide: this._state.index,
            paginationClickable: true,
            nextButton: '.swiper-button-next.swiper-button-white',
            prevButton: '.swiper-button-prev.swiper-button-white',
            runCallbacksOnInit: true,
            pagination: '.swiper-pageination',
            paginationType: 'fraction',
            lazyLoading: true,
            lazyLoadingInPrevNext : true,
            lazyLoadingInPrevNextAmount : 3,
            onInit : (swiper)=>{
                this.swiper = swiper;
            },
            onSlideChangeStart: (swiper) => {
                
                this.handleTrans(swiper.activeIndex);
            }
        }
        return (
            <ReactSwipe
                {...params}
            >
                {this.getSubSlide()}
            </ReactSwipe>
        )
    }

    getSubSlide(isRight) {
        let className = isRight ? 'right-slide' : 'left-slide';
        return this.props.imgs && this.props.imgs.map((val, index)=> {
                return (
                    <div key={index} className={`${className} swiper-lazy`} data-background={`${val.imageUrl}`}>
                    </div>
                )
            })
    }

    handleClick(index){
        this.swiper && this.swiper.slideTo(index);
    }

    handleTrans(index){
        this.rightSwiper && this.rightSwiper.slideTo(index);
    }

    getRightSubSlide(){
        return (
            this.props.imgs && this.props.imgs.map((val,index)=>{
                return (
                    <div key={index} className='right-slide swiper-lazy' onClick={this.handleClick.bind(this,index)} data-background={`${val.imageUrl}`}>
                    </div>
                )
            })
        )
    }

    renderRightMain(){
        let _height = (this.state.right - 120) / 3;
        if(_height){
            const params = {
                initialSlide: this._state.index,
                paginationClickable: true,
                nextButton: '.swiper-button-next',
                prevButton: '.swiper-button-prev',
                mousewheelControl : true,
                mousewheelEventsTarged: '.right-container .swiper-wrapper',
                runCallbacksOnInit: true,
                direction: 'vertical',
                width: 110,
                height: _height,
                simulateTouch: true,
                spaceBetween: 10,
                lazyLoading: true,
                lazyLoadingInPrevNext : true,
                lazyLoadingInPrevNextAmount : 3,
                onInit : (swiper)=>{
                    this.rightSwiper = swiper;
                },
                onSlideChangeStart: (swiper) =>{
                    
                    this.handleClick(swiper.activeIndex);
                }
            }
            return (
                <ReactSwipe
                    {...params}
                >
                    {this.getRightSubSlide()}
                </ReactSwipe>
            )
        }
        return null
    }
    _close() {
        this.props.handle && this.props.handle({type: 'hideAblum'})
    }

    _heightReview(){
        if(this.state.height < 750) return 'photo-graph photo-small';
        else return 'photo-graph';
    }

    render() {
        return (
            this.state.show ?
            <div className={this._heightReview()}>
                <div className="photo-overlay"></div>
                <div className="photo-container">
                    <div className="photo-header">
                        <ul>
                            <li className="active">所有</li>
                        </ul>
                        <Icon className="photo-close" type="close" onClick={this._close.bind(this)}/>
                    </div>
                    
                    <div className="left-container">
                        {this.renderLeftMain()}
                    </div>
                    <div className="right-container" ref="rightContainer">
                        {this.renderRightMain()}
                    </div>
                </div>

            </div>: null
        )
    }

}
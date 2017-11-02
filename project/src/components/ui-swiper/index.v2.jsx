import React, {Component} from 'react';
import ReactSwipe from 'react-id-swiper';
import {Icon} from 'local-Antd';
import './scss/index.scss';
import './scss/photo.v2.scss';
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
                show: nextProps.show
            }
        }
        
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
    	// debugger
		let h = window.screen.availHeigh < 800 ? 55 : 110;
		let w = window.screen.availHeigh < 800 ? 55 : 110;
		let s = window.screen.availHeigh < 800 ? 8 : 10;
        const params = {
            initialSlide: this._state.index,
            paginationClickable: true,
            nextButton: '.swiper-button-next',
            prevButton: '.swiper-button-prev',
            mousewheelControl : true,
            mousewheelEventsTarged: '.right-container .swiper-wrapper',
            runCallbacksOnInit: true,
            direction: 'vertical',
            width: w, // window.screen.availHeigh < 800?55 : 110,
            height: h, // window.screen.availHeigh < 800?55 : 110,
            simulateTouch: true,
            spaceBetween: s,
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
    _close() {
        this.props.handle && this.props.handle({type: 'hideAblum'})
    }
    render() {
        return (
            this.state.show ?
            <div className="photo-graph">
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
                    <div className="right-container">
                        {this.renderRightMain()}
                    </div>
                </div>

            </div>: null
        )
    }

}
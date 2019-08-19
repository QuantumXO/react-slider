
import './_slider.sass';

import sliderData from './../../data/sliderData.json';

import React, {Component, PureComponent} from 'react';

import PropTypes from "prop-types";
import classNames from 'classnames';

import RatingStars from '../../components/default/rating/ratingStars';
import DiscountBlock from '../../components/default/discount/DiscountBlock';

const bucket =
    (
        <svg viewBox="0 0 40 40" width="60">
            <path d="M0.5 4.5C0.5 3.67157 1.17157 3 2 3H5.4264C7.29819 3 8.97453 4.15869 9.63602 5.9097L10.4264 8.00178C10.4503 8.00062 10.4745 8.00002 10.4987 8L34.0093 7.98001C37.2162 7.97728 39.3967 11.2342 38.1722 14.1982L34.3031 23.5639C33.8485 24.6643 32.8658 25.4581 31.6944 25.6711L18.7279 28.0286C16.5907 28.4172 14.481 27.2236 13.7133 25.1915L6.8296 6.9699C6.60911 6.38623 6.05033 6 5.4264 6H2C1.17157 6 0.5 5.32843 0.5 4.5ZM11.5587 10.9991L16.5197 24.1313C16.7756 24.8087 17.4789 25.2065 18.1913 25.077L31.1577 22.7195C31.3251 22.689 31.4655 22.5756 31.5304 22.4184L35.3995 13.0527C35.8077 12.0648 35.0809 10.9791 34.0119 10.98L11.5587 10.9991Z" />
            <circle cx="13.5" cy="34" r="3" />
            <circle cx="31.5" cy="34" r="3" />
        </svg>
    );

class Slider extends Component{
    constructor(props){
        super(props);

        let {id, arrows, data, classList, slidesToShow, infiniteScroll, autoScroll, stopOnHover, speed, slidesToScroll} = this.props;
        const $this = this;

        this.state = {
            speed: speed || 3000,
            slideWidth: 275,
            id: id || 'slider',
            stopOnHover: (typeof stopOnHover == "boolean") ? stopOnHover : true,
            slideOffsetLeft: 50,
            currentSlidesSet: 1,
            sliderListOffset: 0,
            sliderWrapWidth: 1250,
            arrows: (typeof arrows == "boolean") ? arrows : true,
            sliderListWidth: 1250,
            data: data || sliderData,
            classList: classList || null,
            slidesToShow: slidesToShow || 4,
            autoScroll: (typeof autoScroll == "boolean") ? autoScroll : false,
            numberOfSlides: data.length || 4,
            infiniteScroll: (typeof infiniteScroll == "boolean") ? infiniteScroll : false,
            autoScrollTimer: false,
            clonedItemsArr: [],
            animation: false,
        };

        this.prevSlide = this.prevSlide.bind(this);
        this.nextSlide = this.nextSlide.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.stopAutoScroll = this.stopAutoScroll.bind(this);
        this.startAutoScroll = this.startAutoScroll.bind(this);

        this.sliderRef = React.createRef();
        this.slidesRef = React.createRef();

        this.getSlideOffset = (index) => {

            const {slideOffsetLeft, slideWidth} = this.state;

            return ((slideOffsetLeft + slideWidth) * index);
        };

        this.cloneItemsFunc = (startIndexOfSlide = 0) => {

            if(!this.state.infiniteScroll){
                return;
            }else{

                let clonedItemsNum = 0;
                let currentCloneIndex = startIndexOfSlide;

                for(let i = 0; i < this.props.slidesToShow; i++){

                    if(currentCloneIndex < this.props.data.length - 1){
                        currentCloneIndex = startIndexOfSlide + i;
                    }else{
                        currentCloneIndex = 0;
                    }

                    //console.log('this.cloneItemsFunc() -> currentCloneIndex', currentCloneIndex);

                    this.setState((prevState) => ({
                        clonedItemsArr: [
                            ...prevState.clonedItemsArr,
                            this.props.data[i]
                        ]
                    })
                    );

                    clonedItemsNum += 1;
                }

                return clonedItemsNum;

            }
        };

        if(this.state.autoScroll){

            let autoScrollTimer;

            this.startAutoScrollTimer = () => {
                const lastSlidesSet = Math.round(this.state.numberOfSlides/this.state.slidesToShow);

                if(this.state.autoScrollTimer){
                    return;
                }

                autoScrollTimer = setInterval(() => {
                    if(
                        this.state.infiniteScroll ||
                        lastSlidesSet != this.state.currentSlidesSet
                    ){
                        this.nextSlide();

                        // console.log('tick');
                    }else {

                        if(this.state.autoScrollTimer){
                            this.stopAutoScrollTimer();
                        }

                    }

                }, this.state.speed);

                this.setState(() => ({autoScrollTimer}));

                return;
            };

            this.stopAutoScrollTimer = () => {

                if(!this.state.autoScrollTimer) {
                    return;
                }

                this.setState({autoScrollTimer: false},
                    clearInterval(this.state.autoScrollTimer)
                );

                //console.log('stop');
            };

        }

    }

    componentDidMount() {

        const clonedItemsNum = 0; //this.cloneItemsFunc();

        let {slidesToShow, numberOfSlides, autoScroll, data} =  this.state;
        let slideOffsetLeft;
        let sliderListWidth;

        const $this = this;
        const sliderWrapNode = this.sliderRef.current;
        const sliderWrapWidth =  sliderWrapNode.offsetWidth;
        const slideNode = this.slidesRef.current;
        const slideWidth = slideNode.offsetWidth;

        if(slidesToShow > numberOfSlides){
            slideOffsetLeft = Math.round((sliderWrapWidth - (slideWidth * numberOfSlides)) / (numberOfSlides - 1));  // (1250 - (275 * 5) / 4)
        }else{
            slideOffsetLeft = Math.round((sliderWrapWidth - (slideWidth * slidesToShow)) / (slidesToShow - 1));  // (1250 - (275 * 1) / 0)
        }

        //console.log('componentDidMount() -> ', clonedItemsNum);

        sliderListWidth = Math.round(((numberOfSlides + clonedItemsNum) * (slideWidth + slideOffsetLeft)) - slideOffsetLeft);  // (5 * (275 + NaN)) - NaN

        this.setState(() =>
            ({
                sliderWrapWidth,
                slideWidth,
                sliderListWidth,
                slideOffsetLeft,
                numberOfSlides: data.length + clonedItemsNum,
            }),
            () => {
                if(autoScroll){
                    this.startAutoScrollTimer();

                }
            }
        );

    }

    shouldComponentUpdate(nextProps, nextState){

        if(
            this.state.currentSlidesSet != nextState.currentSlidesSet ||
            this.state.slideOffsetLeft != nextState.slideOffsetLeft ||
            this.state.numberOfSlides != nextState.numberOfSlides ||
            this.state.clonedItemsArr != nextState.clonedItemsArr
        ){
            return true;
        }else {
            return false;
        }


    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.data !== prevProps.data) {
            this.setState(() => ({
                data: this.props.data,
            }));
        }
    }

    prevSlide(){

        const {currentSlidesSet, sliderListOffset, sliderWrapWidth, slideOffsetLeft, infiniteScroll, autoScroll, numberOfSlides, slidesToShow, sliderListWidth, slideWidth} = this.state;

        if(
            infiniteScroll ||
            currentSlidesSet > 1
        ){

            let slideSet,
                listOffset;

            if(currentSlidesSet > 1){
                slideSet =  currentSlidesSet - 1;
                listOffset = sliderListOffset + sliderWrapWidth + slideOffsetLeft;

            }else{
                slideSet = Math.ceil(numberOfSlides/slidesToShow);
                listOffset = -((slideOffsetLeft + slideWidth) * (numberOfSlides - 2));
            }

            this.setState(
                {
                    currentSlidesSet: slideSet,         // Увеличиваем счетчик сета слайдов
                    sliderListOffset: listOffset        // Смещаем слайдер влево
                }, function () {
                    if(autoScroll){
                        this.startAutoScrollTimer();
                    }
                }

            );
        }

    };

    nextSlide = () => {

        const {slidesToShow, currentSlidesSet, numberOfSlides, sliderListOffset, sliderWrapWidth, slideOffsetLeft, infiniteScroll} = this.state;

        if(
            infiniteScroll ||
            (
                //numberOfSlides > slidesToShow &&                        // Показано слайдов меньше, чем их всего
                (currentSlidesSet * slidesToShow) < numberOfSlides        // И текущий сет слайдов не последний
            )
        ){

            let slideSet,
                listOffset;

            if((currentSlidesSet * slidesToShow) < numberOfSlides){
                slideSet =  currentSlidesSet + 1;
                listOffset = sliderListOffset - sliderWrapWidth - slideOffsetLeft;
            }else{
                slideSet = 1;
                listOffset = 0;
            }

            this.setState(() => ({
                currentSlidesSet: slideSet,              // Увеличиваем счетчик сета слайдов
                sliderListOffset: listOffset,            // Смещаем слайдер влево
                //animation: false
            }));
        }
    };

    stopAutoScroll(){

        if(this.state.stopOnHover){
            this.stopAutoScrollTimer();
        }

    };

    startAutoScroll(){

        if(this.state.autoScroll){

            const lastSlidesSet = Math.round(this.state.numberOfSlides/this.state.slidesToShow);

            if(
                this.state.infiniteScroll ||
                lastSlidesSet != this.state.currentSlidesSet
            ){
                this.startAutoScrollTimer();
            }
        }
    };

    handleClick = (e) => {
    };

    render(){

        const {id, data, classList, sliderListOffset, sliderListWidth, arrows, slidesToShow, autoScroll, clonedItemsArr} = this.state;

        const sliderClasses = classNames('slider', this.state.classList);
        const sliderListClasses = classNames('slider__list', this.state.animation && 'animation');

        let clonedItems = [];
        const navWrap = arrows ?
            (
                <div className="slider__nav">
                    <span className="arrow arrow--prev" onClick={this.prevSlide} />
                    <span className="arrow arrow--next" onClick={this.nextSlide} />
                </div>
            ) : null;

        if(clonedItemsArr.length){


            clonedItems = clonedItemsArr.map((clonedNode, i) => {

                let indexForGetSlideOffset = i + data.length;

                const slideOffset = this.getSlideOffset(indexForGetSlideOffset, slidesToShow);

                return (
                    <li
                        key={i}
                        className="slider__item cloned"
                        //data-slide-index={index}
                        ref={this.slidesRef}
                        style={{left: slideOffset}}
                        onClick={this.handleClick}
                        onMouseEnter={autoScroll ? this.stopAutoScroll : null}
                        onMouseLeave={autoScroll ? this.startAutoScroll : null}
                    >
                        <div className="slider__item__header">
                            <DiscountBlock discount={clonedNode.discount} />
                            <img src={clonedNode.images[0]} className="slider__item__image" alt={clonedNode.title} />
                            <span className="slider__item__cart">{bucket}</span>

                        </div>
                        <div className="slider__item__footer">
                            <a className="slider__item__title">{clonedNode.title}</a>
                            <div className="slider__item__price">
                                <div className={clonedNode.discount > 0 ? "price--new" : "price--default"}>
                                    $<span className="value">{clonedNode.price}</span>
                                </div>
                                {clonedNode.oldPrice}
                            </div>
                            <RatingStars rating={clonedNode.rating} />
                        </div>
                    </li>
                );
            })

        }

        const sliderBody = data.map((item, index) => {

            const {id, discount, images, title, price, oldPrice, rating} = item;

            const slideOffset = this.getSlideOffset(index , slidesToShow);

            return (
                <React.Fragment key={id}>
                    <li className="slider__item"
                        //data-slide-index={index}
                        ref={this.slidesRef}
                        style={{left: slideOffset}}
                        onClick={this.handleClick}
                        onMouseEnter={autoScroll ? this.stopAutoScroll : null}
                        onMouseLeave={autoScroll ? this.startAutoScroll : null}
                    >
                        <div className="slider__item__header">
                            <DiscountBlock discount={discount} />
                            <img src={images[0]} className="slider__item__image" alt={title} />
                            <span className="slider__item__cart">{bucket}</span>

                        </div>
                        <div className="slider__item__footer">
                            <a className="slider__item__title">{title}</a>
                            <div className="slider__item__price">
                                <div className={discount > 0 ? "price--new" : "price--default"}>
                                    $<span className="value">{price}</span>
                                </div>
                                {oldPrice}
                            </div>
                            <RatingStars rating={rating} />
                        </div>
                    </li>
                    {(index == data.length -1) && clonedItems ? clonedItems : null}
                </React.Fragment>
            )
        });

        return(
            <div id={id || null} className={sliderClasses} ref={this.sliderRef}>
                {navWrap}
                <ul className={sliderListClasses} style={{marginLeft: sliderListOffset || 0, width: sliderListWidth}}>
                    {sliderBody}
                </ul>
            </div>
        );
    }
}

export default Slider

Slider.propTypes = {
    data: PropTypes.array.isRequired,
    infiniteScroll: PropTypes.bool,
    arrows: PropTypes.bool,
    autoScroll: PropTypes.bool,
    stopOnHover: PropTypes.bool,
    id: PropTypes.string,
    classList: PropTypes.string,
    slidesToShow: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
};



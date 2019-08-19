'use strict';

import React, {Component} from 'react';

export default function DiscountBlock(props) {

    const discount = props.discount;

    if(!discount || discount <= 0){
        return null;

    }else{
        return (
            <span className="slider__item__discount">-{discount} %</span>
        );
    }
}

'use strict';

import React, {Component} from 'react';

export default function RatingStars(props) {

    if(props.rating){

        const star = <i className="star far fa-star" />;
        let starsHTML;
        let stars = [];

        for(let i = 0; i < props.rating; i++){
            stars.push(star);
        }

        starsHTML = stars.map((item, i) => (<React.Fragment key={i}>{item}</React.Fragment>));

        return (
            <div className="rating rating--stars bg">{starsHTML}</div>
        );

    }else{
        return '';
    }
}

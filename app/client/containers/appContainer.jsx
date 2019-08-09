'use strict';

import sliderData from './../data/sliderData.json';

import './../styles/_basic.sass';

import React, {Component} from 'react';

import Slider from './../components/slider/slider';

class App extends Component{
    constructor(){
        super();
    }

    render(){
        return(
            <React.Fragment>
                <main>
                    <div className="container">
                        <div className="row">
                            <Slider
                                id={'slider'}
                                data={sliderData}
                                arrows={false}
                                classList={'slider--custom'}
                                slidesToShow={"4"}
                                infiniteScroll={false}
                                autoScroll={true}
                                //speed={3000}
                            />
                        </div>
                    </div>
                </main>
            </React.Fragment>
        );
    }

}

export default App;


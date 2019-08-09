'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

const rootEl = document.querySelector('#root');

import App from './containers/appContainer';

ReactDOM.render(
    <App />,
    rootEl
);

if (module.hot) {
    module.hot.accept();
}

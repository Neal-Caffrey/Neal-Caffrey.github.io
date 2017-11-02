import React from "react";
import {
    render
} from "react-dom";
import {
    Provider
} from "react-redux";
import App from "./appd.js";
import configureStore from './store/initd.js'
const store = configureStore();
render(
    <Provider store={store}>
        <App/>
    </Provider>,
    document.querySelector('#wrap')
);

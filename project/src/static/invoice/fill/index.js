import React from "react";
import {
    render
} from "react-dom";
import {
    Provider
} from "react-redux";
import App from "./app.js";
import configureStore from './store/init.js'
const store = configureStore();
render(
    <Provider store={store}>
        <App/>
    </Provider>,
    document.querySelector('#wrap')
);

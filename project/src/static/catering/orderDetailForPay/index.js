/**
 * @author Kepeng
 * @description 用于支付后跳转新页面，显示支付状态
 */
import React from "react";
import {
	render
} from "react-dom";
import {
	Provider
} from "react-redux";
import App from "./app.jsx";
import configureStore from './store/init.js'
const store = configureStore();
render(
	<Provider store={store}>
    	<App/>
  	</Provider>,
	document.querySelector('#wrap')
);
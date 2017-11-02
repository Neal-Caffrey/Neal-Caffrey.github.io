import React from 'react';
import {
	render
} from 'react-dom';
import {
	Provider
} from 'react-redux';
import App from './uploadApp.js';
import configureStore from 'STORE/init.js'
const store = configureStore();
render(
	<Provider store={store}>
    	<App/>
  	</Provider>,
	document.querySelector('#wrap')
);


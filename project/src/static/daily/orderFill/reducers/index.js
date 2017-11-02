import {
	combineReducers
} from 'redux';
import leftSide from './leftSide.js';
import rightSide from './rightSide.js';
import header from 'REDUCERS/header.js';
import pageData from './pageData.js';

const rootReducer = combineReducers({
	header,
	leftSide,
	rightSide,
	pageData
});

export default rootReducer;

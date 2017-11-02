import {
	combineReducers
} from 'redux';
import alert from './alert.js';
import header from 'REDUCERS/header.js';

const rootReducer = combineReducers({
	header,
	alert
});

export default rootReducer;

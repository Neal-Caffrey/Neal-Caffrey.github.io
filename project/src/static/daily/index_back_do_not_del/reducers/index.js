import {
	combineReducers
} from 'redux';
import leftSide from './leftSide.js';
import main from './main.js';
import header from 'REDUCERS/header.js';
import daily from './dailyOrder.js';
import flight from './flightOrder.js'

const rootReducer = combineReducers({
	header,
	leftSide,
	main,
	daily,
	flight
});

export default rootReducer;

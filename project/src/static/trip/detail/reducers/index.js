import {
	combineReducers
} from 'redux';

import header from 'REDUCERS/header.js';
import main from './main.js';
import hotel from './hotel.js';
import air from './air.js';
const rootReducer = combineReducers({
	header,
	main,
	hotel,
	air,
});

export default rootReducer;

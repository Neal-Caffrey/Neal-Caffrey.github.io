import {
	combineReducers
} from 'redux';

import header from 'REDUCERS/header.js';
import main from './maind.js';

const rootReducer = combineReducers({
	header,
	main
});

export default rootReducer;
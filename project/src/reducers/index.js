import {
	combineReducers
} from 'redux';
import leftSide from './leftSide.js';
import list from './list.js';
import order from './order.js';
import edit from "./edit.js";
import middleSide from './middleSide.js';
import header from './header.js';


const rootReducer = combineReducers({
	header,
	edit,
	order,
	list,
	leftSide,
	middleSide
});

export default rootReducer;
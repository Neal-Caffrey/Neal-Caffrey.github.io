import {
    combineReducers
} from 'redux';
import header from 'REDUCERS/header.js';
import result from './result.js';
import searchBar from './searchBar.js';
import invoiceList from './invoiceList.js';

const rootReducer = combineReducers({
    header,
    result,
    searchBar,
    invoiceList
});

export default rootReducer;
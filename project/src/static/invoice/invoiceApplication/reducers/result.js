const Assign = (state, obj) => {
	return Object.assign({}, state, obj);
}
const initialState = {
	searchData: {}
};
const result = (state = initialState, action) => {
	switch (action.type) {
		case 'UPDATERESULT':
			return Assign(state, {
				result: action.data.result,
				searchData: action.data.searchData
			});
		case 'UPDATESEARCHDATA':
			return Assign(state, {
				searchData: action.data
			});

			
		default:
			return state;
	}
}
export default result
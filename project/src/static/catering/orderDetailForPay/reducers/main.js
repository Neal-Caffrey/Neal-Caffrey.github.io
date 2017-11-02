const Assign = (state, obj) => {
	return Object.assign({}, state, obj);
}
const initialState = {}

const main = (state = initialState, action) => {
	switch (action.type) {
		default:
			return state;
	}
}
export default main
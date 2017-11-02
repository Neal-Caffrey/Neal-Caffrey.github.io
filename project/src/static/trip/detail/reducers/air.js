const Assign = (state, obj) => {
	return Object.assign({}, state, obj);
}

const initialState = {
	isShow: false,
	curPassengerInfo: null,
}

const hotel = (state = initialState, action) => {
	switch (action.type) {
		case 'SHOWPASSENGERWIN':
			return Assign(state, {
				isShow: true,
				curPassengerInfo: action.data
			})
			
		case 'HIDEPASSENGERWIN':
			return Assign(state, {
				isShow: false,
				curPassengerInfo: null
			})

		default:
			return state;
	}
}
export default hotel

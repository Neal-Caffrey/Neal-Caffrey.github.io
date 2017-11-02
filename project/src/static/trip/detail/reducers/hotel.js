const Assign = (state, obj) => {
	return Object.assign({}, state, obj);
}

const initialState = {
	isShow: false,
	curRoomInfo: null,
}

const hotel = (state = initialState, action) => {
	switch (action.type) {
		case 'SHOWGUESTWIN':
			return Assign(state, {
				isShow: true,
				curRoomInfo: action.data
			})
			
		case 'HIDEGUESTWIN':
			return Assign(state, {
				isShow: false,
				curRoomInfo: null
			})

		default:
			return state;
	}
}
export default hotel

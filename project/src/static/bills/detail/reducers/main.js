const Assign = (state, obj) => {
	return Object.assign({}, state, obj);
}
const initialState = {}

const main = (state = initialState, action) => {
	switch (action.type) {
		case 'UPDATEDETAIL':
			return Assign(state, {
				detail: action.detail,
				isLoading: false
			})

		case 'SHOWACCOUNTS':
			return Assign(state, {
				renderAccount: action.flag
			})

		case 'SHOWLOADING':
			return Assign(state, {
				isLoading: action.flag
			})
		case 'SHOWALERT':
			return Assign(state, {
				isAlert: true,
				isLoading: false,
				alertMsg: {
					msg: action.msg,
					goLogin: action.goLogin
				}
			})
		case 'REMOVEALERT':
			return Assign(state, {
				isAlert: false
			})

		default:
			return state;
	}
}
export default main
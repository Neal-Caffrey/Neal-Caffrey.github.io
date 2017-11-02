const Assign = (state, obj) => {
	return Object.assign({}, state, obj);
}
const initialState = {
	invoiceInfo: {},
	totalInfo: {},
	addressInfo: {}
}

const main = (state = initialState, action) => {
	switch (action.type) {
		case 'UPDATETOTAL':
			return Assign(state, {
				totalInfo: action.data,
			})
		case 'UPDATEINVOICE':
			return Assign(state, {
				invoiceInfo: action.data,
			})

		case 'UPDATEADDRESS':
			return Assign(state, {
				addressInfo: action.data
			})
		case 'UPDATEDETAIL':
			return Assign(state, {
				detail: {
					invoiceInfo: Assign({},action.data.invoiceInfo),
					addressInfo: Assign({},action.data.addressInfo),
					totalInfo: Assign({},action.data.totalInfo),
				},
				invoiceInfo: Assign({},action.data.invoiceInfo),
				addressInfo: Assign({},action.data.addressInfo),
				totalInfo: Assign({},action.data.totalInfo),
			})

		default:
			return state;
	}
}
export default main
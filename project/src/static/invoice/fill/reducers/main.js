const Assign = (state, obj) => {
	return Object.assign({}, state, obj);
}

const initialState = {
	invoiceInfo: {
		billHeaderType: 1, // 默认公司
		billContent: '2', // 默认旅游服务费
		billType: 1, // 默认电子发票
	},
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
					invoiceInfo: action.data.invoiceInfo,
					addressInfo: action.data.addressInfo,
					totalInfo: action.data.totalInfo,
				},
				invoiceInfo: action.data.invoiceInfo,
				addressInfo: action.data.addressInfo,
				totalInfo: action.data.totalInfo,
			})

		default:
			return state;
	}
}
export default main
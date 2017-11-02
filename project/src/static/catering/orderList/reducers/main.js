const Assign = (state, obj) => {
	return Object.assign({}, state, obj);
}

const page = {
	'limit': 5,
	'current': 1,
	'offset': 0
};
const initialState = {
	fxOrderStatus: 1, // 默认未支付
	quickSearch: false, // 默认不选择快速查询
	formData: {}, // 默认查询条件为空
	sortor: {
		'orderByField': 1, // 下单时间
        'orderByType': 2, // 降序
	}, // 默认排序条件
	pagination: page
}

const main = (state = initialState, action) => {
	switch (action.type) {
		case 'SHOWALERT':
			return Assign(state, {
				isAlert: true,
				alertMsg: {
					msg: action.msg,
					goLogin: action.goLogin
				}
			})
			
		case 'REMOVEALERT':
			return Assign(state, {
				isAlert: false
			})

		case 'SWITCHORDERSTATUS':
			return Assign(state, {
				fxOrderStatus: action.status,
				quickSearch: false,
				pagination: page
			})

		case 'CHANGEFORMDATA':
			return Assign(state, {
				formData: action.data,
				quickSearch: false,
				pagination: page
			})

		case 'QUICKSEARCH':
			return Assign(state, {
				formData: action.data,
				quickSearch: true,
				pagination: page
			})

		case 'SWITCHSORTOR':
			return Assign(state, {
				sortor: action.data,
				pagination: page
			})

		case 'CHANGEPAGE':
			return Assign(state, {
				pagination: {
					'limit': 5,
					'current': action.data.current,
					'offset': action.data.offset
				}
			})

		default:
			return state;
	}
}
export default main
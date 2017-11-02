const Assign = (state, obj) => {
	return Object.assign({}, state, obj);
}

const initialState = {
	isAlert: false, // 控制类，控制显示弹窗
	currencyInfo: null, // 当前显示的币种信息
	routeNo: null, // 判断依据
	breif: null,
	hotel: null,  // 订单列表
	car: [
		// {
		// 	userInfo: {},
		// 	i: 0
		// },  // 用车信息
		// {
		// 	userInfo: {},
		// 	i: 1
		// },
		// {
		// 	userInfo: {},
		// 	i: 2
		// }
	],	// 包车订单
	air: null,	// 机票订单
	others: null, // 其他信息
	carModel:{
		show: false,
		index: '' //行程ID
	},
	routeItemList:[]
}

const main = (state = initialState, action) => {
	switch (action.type) {
		case 'SHOWALERT':
			return Assign(state, {
				isAlert: true,
				alertMsg: {
					msg: action.msg,
					goLogin: action.goLogin,
					showType: action.showType
				}
			})

		case 'REMOVEALERT':
			return Assign(state, {
				isAlert: false
			})

		case 'UPDATEDETAIL':
			return Assign(state, action.data)

		case 'UPDATEAIR':
			return Assign(state, {
				air: action.data,
			})

		case 'UPDATECAR':
			return Assign(state, {
				car: action.data
			})

		case 'SHOWCAR':
			return Assign(state, {
				carModel: action.obj
			})

		case 'UPDATECCY':
			return Assign(state, {
				currencyInfo: action.data
			})
		case 'UPDATEBREIF':
			return Assign(state, {
				breif: action.data
			})

		case 'UPDATEHOTEL':
			return Assign(state, {
				hotel: action.data
			})
			break;

		case 'UPDATEHOTELGUEST':
			// 只更新对应订单号的入住人信息
			var hotel = action.data;
			var hotelSource = state.hotel.concat([]);
			hotelSource.map((item, index)=>{
				hotel.map((hitem, hindex)=>{
					if(item.orderNo == hitem.orderNo) {
						hotelSource[index] = hitem;
					}
				});
			})
			return Assign(state, {
				hotel: hotelSource
			})
			break;

		case 'UPDATEPASSENGER':
			// 只更新对应订单号的乘机人
			var air = action.data;
			var airSource = state.air.concat([]);
			airSource.map((item, index)=>{
				if(air.orderNo == item.orderNo) {
					airSource[index] = air;
				}
			})
			return Assign(state, {
				air: airSource
			})
			break;
		default:
			return state;
	}
}
export default main

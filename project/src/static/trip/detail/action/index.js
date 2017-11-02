export function showAlert(res, type) {
	return {
		type: 'SHOWALERT',
		msg: typeof res === 'string'? res : res.msg,
		goLogin: typeof res === 'string'? false : (res.loginErr ? true : false),
	};
}

export function removeAlert() {
	return {
		type: 'REMOVEALERT',
	};
}

export function updateDetail(res) {
	return {
		type: 'UPDATEDETAIL',
		data: res,
	};
}

export function updateCar(data) {
	return {
		type: 'UPDATECAR',
		data: data
	};
}

export function showCarModel(obj) {
	return {
		type: 'SHOWCAR',
		obj: obj
	};
}

export function updateCcy(res) {
	// 币种信息
	return {
		type: 'UPDATECCY',
		data: res
	};
}

export function showGuestWin(res) {
	// 显示酒店入住人修改
	return {
		type: 'SHOWGUESTWIN',
		data: res
	};
}

export function hideGuestWin() {
	// 隐藏酒店入住人修改
	return {
		type: 'HIDEGUESTWIN',
	};
}
export function updateHotel(data) {
	// 更新酒店列表
	return {
		type: 'UPDATEHOTEL',
		data: data
	};
}

export function updateHotelGuest(data) {
	// 更新酒店入住人列表
	return {
		type: 'UPDATEHOTELGUEST',
		data: data,
	};
}

export function showPassengerWin(res) {
	// 显示乘机人修改
	return {
		type: 'SHOWPASSENGERWIN',
		data: res
	};
}

export function hidePassengerWin() {
	// 隐藏乘机人修改
	return {
		type: 'HIDEPASSENGERWIN',
	};
}

export function updatePassenger(data) {
	// 更新乘机人信息
	return {
		type: 'UPDATEPASSENGER',
		data: data,
	};
}

export function updateBreif(data) {
	// 更新breif
	return {
		type: 'UPDATEBREIF',
		data: data
	};
}

export function updateAir(data) {
	// 更新机票列表
	return {
		type: 'UPDATEAIR',
		data: data
	};
}


export function showLoading(flag) {
	return {
		type: 'SHOWLOADING',
		flag: flag
	};
}

export function showOrderForm(flag) {
	return {
		type: 'SHOWORDERFORM',
		flag: flag
	};
}

export function showMap(flag) {
	return {
		type: 'SHOWMAP',
		flag: flag
	};
}

export function updateDetail(res) {
	console.log(res)
	return {
		type: 'UPDATEDETAIL',
		detail: res,
	};
}

export function showAlert(res) {
	console.log(res)
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

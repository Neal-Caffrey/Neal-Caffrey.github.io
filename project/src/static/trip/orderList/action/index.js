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

export function changeFormData(data) {
	return {
		type: 'CHANGEFORMDATA',
		data: data
	};
}

export function switchSortor(data) {
	return {
		type: 'SWITCHSORTOR',
		data: data
	};
}

export function changePage(data) {
	return {
		type: 'CHANGEPAGE',
		data: data
	};
}

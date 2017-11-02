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
export function showPassword(obj) {
	return {
		type: 'SHOWPASSWORD',
		val:{
			show: obj.show,
			loginName: obj.loginName,
			agentUserId: obj.agentUserId
		}
	};
}

export function showAdd(obj) {
	return {
		type: 'SHOWADD',
		val:{
			show: obj.show,
			model: obj.model,
			info: obj.info
		}

	};
}

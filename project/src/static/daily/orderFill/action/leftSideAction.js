export function changePlanVo(val){
  	return {
    	type : 'CHANGEPLANVO',
    	planVo : val
  	}
}

export function showLoading(flag) {
	return {
		type: 'SHOWLOADING',
		flag: flag
	};
}

export function showBookPop(obj) {
	return {
		type: 'SHOWBOOKPOP',
		obj: obj
	};
}

export function changeDemand(obj) {
	return {
		type: 'CHANGEDEMAND',
		obj: obj
	}
}

export function updateLoading(loading){
  return {
    type : 'UPDATELOADING',
    loading,
  }
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

// export function fillForm(obj) {
// 	return {
// 		type: 'FILLFORM',
// 		obj: obj
// 	}
// }

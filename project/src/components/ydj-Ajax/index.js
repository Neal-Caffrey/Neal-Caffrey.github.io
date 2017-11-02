import Request from "local-Ajax/dist/main.js";

export default class doAjax {
    constructor(data) {
    	let _request = new Request();
		_request.ajax(data).then(res => {
			if (res.status === 200) {
				data.successHandle && data.successHandle(res);
			} else {
				// TODO: 统一提示业务异常 + 是否已在错误状态
				data.failedHandle && data.failedHandle(res);
			}
		}, (xhr, errorType, error) => {
			debugger
			console.log(xhr, errorType, error);
			// debugger
			// 统一处理checkLogout + 是否已在错误状态
			if(data.errorHandle) {
				let errorMsg= this._checkLogin(xhr, errorType, error);
				data.errorHandle(xhr, errorType, error, errorMsg);
			}
		});
    }
    _checkLogin(xhr, errorType, error) {
		let states = {};
		if (xhr.status == 302 || xhr.status == 420 || xhr.status == 421 || xhr.status == 404 || xhr.status == 200) {
			states.loginErr = true;
			switch (xhr.status) {
				case 200:
					states.msg = '请先登录，如有疑问，请联系云地接客服：400-060-0766';
					break;
				case 302:
					states.msg = '服务器异常，请重新登录，如有疑问，请联系云地接客服：400-060-0766';
					break;
				case 420:
					states.msg = '会话已失效，请重新登录！';
					break;
				case 421:
					states.msg = '您的账号已被封禁，如有疑问，请联系云地接客服：400-060-0766';
					break;
				case 404:
					states.msg = '服务器异常，请重新登录，如有疑问，请联系云地接客服：400-060-0766';
					break;
			}
		} else {
			states.loginErr = false;
			states.msg = `请求发送失败 ${xhr.status}`;
		}
		return states;
	}
}

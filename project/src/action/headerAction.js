export function appInfo(info) {
	return {
		type: 'header/APPINFO',
		header: info
	};
}
//reload 用于重新拉取info接口，见indexReload.jsx
export function reLoad(flag) {
	return {
		type: 'RELOAD',
		flag: flag
	};
}

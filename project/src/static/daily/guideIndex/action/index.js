export function showAblum(res) {
	console.log(res)
	return {
		type: 'SHOWABLUM',
        ablumInfo:res
	};
}

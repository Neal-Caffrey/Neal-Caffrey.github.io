export function updateAuto() {
	return {
		type: 'list/UPDATEAUTO'
	}
}

export function updateCityId(id) {
	return {
		type: 'list/UPDATECITYID',
		cityId: id
	};

}
export function updateKeywords(val) {
	return {
		type: 'list/UPDATEKEYWORDS',
		searchKey: val
	}
}

export function updataDatas(bl) {
	return {
		type: 'list/UPDATEDATAS',
		canDatas: bl
	}
}

export function updateOffset(num) {
	return {
		type: 'list/UPDATEOFFSET',
		offset: num
	}
}

export function updateSortType(num) {
	return {
		type: 'list/UPDATESORTTYPE',
		sortType: num
	}
}

export function updateCurrent(num) {
	return {
		type: 'list/UPDATECURRENT',
		current: num
	}
}

export function updateTrade(arr) {
	return {
		type: 'list/UPDATETRADE',
		tradeingAreaNo: arr
	}
}

export function updateSubCate(arr) {
	return {
		type: 'list/UPDATESUBCATE',
		subCategoryNo: arr
	}
}

export function updateRefreshTrem(bl) {
	return {
		type: 'list/UPDATEREFRESHTREM',
		refreshTrem: bl
	}
}

export function updateTagNos(num) {
	return {
		type: 'list/UPDATETAGNOS',
		tagNos: num
	}
}

export function updateLoading(bl) {
	return {
		type: 'list/UPDATELOADING',
		loading: bl
	}
}

export function updateConfirm(num) {
	return {
		type: 'list/UPDATECONFIRM',
		confirmImmediately: num
	}
}

export function updateToday(num) {
	return {
		type: 'list/UPDATETODAY',
		canBookToday: num
	}
}
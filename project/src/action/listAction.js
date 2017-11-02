export function updatePage(page) {
	return {
		type: 'list/UPDATEPAGE',
		page: page
	};
}

export function updateNav(nav) {
	return {
		type: 'list/UPDATENAV',
		nav: nav
	};
}

export function updateCurrent(current) {
	return {
		type: 'list/UPDATECURRENT',
		current: current,
	};
}

export function updateCity(city) {
	return {
		type: 'list/UPDATECITY',
		city: city
	}
}

export function updateDate(date) {
	return {
		type: 'list/UPDATEDATE',
		date: date
	}
}

export function updateKeyword(keyword) {
	return {
		type: 'list/UPDATEKEYWORD',
		keyword: keyword,
	}
}

export function updateTerm(term) {
	return {
		type: 'list/UPDATETERM',
		term: term,
	}
}

export function updateData(data) {
	return {
		type: 'list/UPDATEDATA',
		data: data,
	}
}
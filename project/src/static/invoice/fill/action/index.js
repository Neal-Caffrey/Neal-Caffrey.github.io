export function updateTotal(totalInfo) {
	return {
		type: 'UPDATETOTAL',
		data: totalInfo
	};
}
export function updateInvoice(invoiceInfo) {
	return {
		type: 'UPDATEINVOICE',
		data: invoiceInfo
	};
}

export function updateAddress(addressInfo) {
	return {
		type: 'UPDATEADDRESS',
		data: addressInfo
	};
}

export function updateDetail(detail) {
	return {
		type: 'UPDATEDETAIL',
		data: detail
	};
}

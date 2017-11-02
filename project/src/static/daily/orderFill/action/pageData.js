export function getPageData(data){
  	return {
    	type : 'GETPAGEDATA',
    	data : data
  	}
}
export function formatPlanVo(data){
  	return {
    	type : 'FORMATPLANVO',
    	data : data
  	}
}
export function updateTotalPrice(totalPrice){
  return {
    type : 'UPTOTAL',
    totalPrice
  }
}
export function checkFlightSign(flag){
  return {
    type : 'checkFlightSign',
    flag: flag
  }
}

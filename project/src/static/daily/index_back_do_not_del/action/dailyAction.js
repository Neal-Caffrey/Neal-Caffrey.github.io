export function updateShowPickUp(isShowPickup){
  return {
    type : 'UP_DA_SHOWPICKUP',
    isShowPickup,
  }
}
export function updateShowDropOff(isShowDropoff){
  return {
    type : 'UP_DA_SHOWDROPOFF',
    isShowDropoff,
  }
}

export function updatePickupInfo(pickupInfo){
  return {
    type : 'UP_DA_PICKUPINFO',
    pickupInfo,
  }
}
export function updatePickupVo(dailyPickupVo){
  return {
    type : 'UP_DA_PICKUPVO',
    dailyPickupVo,
  }
}
export function updateInputVal(inputValue){
  return {
    type : 'UP_DA_INPUTVAL',
    inputValue,
  }
}
export function resetDaily(){
  return {
    type : 'RES_DA_DEFAULT',
    dropoffInfo : '',
    inputValue : '',
    isShowPickup : false,
    pickupInfo : '',
    dailyPickupVo : null,
    dailyVo : null
  }
}
export function updateDailyVo(dailyVo){
  return {
    type : 'UP_DA_DAILYVO',
    dailyVo,
  }
}
export function updatePickupModelKey(){
  return {
    type : 'UP_DA_PIMODEL',
  }
}
export function resetPickupAndDropOff(){
  return {
    type : 'RES_DA_PICKANDDROPOFF'
  }
}
// export function updateCurrentMap(currentMap){
//   return {
//     type : 'UPDATECURRENTMAP',
//     currentMap
//   }
// }
//
// export function UPDATESHOWMAP(isShowMap){
//   return {
//     type : 'UPDATESHOWMAP',
//     isShowMap
//   }
// }

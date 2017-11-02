export function updateLoading(loading){
  return {
    type : 'UPDATELOADING',
    loading,
  }
}

export function updateCurrentMap(currentMap){
  return {
    type : 'UPDATECURRENTMAP',
    currentMap
  }
}

export function updateShowMap(isShowMap){
  return {
    type : 'UPDATESHOWMAP',
    isShowMap
  }
}

export function updateMainSplitAndQuery(splitPlanList,queryParam,carList){
  return {
    type :'UP_MA_SPLI_A_QUER',
    splitPlanList,
    queryParam,
    carList
  }
}

export function updateStartCity(cityVo){
  return {
    type : 'UPDATESTARTCITY',
    startCity : cityVo
  }
}

export function updateTime(startTime,endTime){
  return {
    type : 'UPDATETIME',
    startTime,
    endTime
  }
}

export function initailPlanList(planList){
  return {
    type : 'INITALDEFAULTPLAN',
    planList
  }
}

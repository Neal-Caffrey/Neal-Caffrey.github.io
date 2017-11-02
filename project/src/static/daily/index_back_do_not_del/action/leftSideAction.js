export function updateStartCity(cityVo){
  return {
    type : 'UPDATESTARTCITY',
    startCity : cityVo
  }
}

export function openTime(openTime){
  return {
    type : 'UP_LE_OP_TM',
    openTime
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

export function updateCurrentDayIndex(currentDayIndex,currentObject){
  console.log(currentDayIndex)
  return {
    type : 'UPDATECURRENTDAYINDEX',
    currentDayIndex,
    currentObject
  }
}

export function updatePlanListByIndexAndIndex(planList,currentDayIndex){
  //同时修改Index+1，修改PlanList【index】的值
  return {
    type : 'UPDATEPLANLISTBYINDEXANDINDEX',
    planList,
    currentDayIndex
  }
}

export function updateCompleteAll(isCompleteAll){
  return {
    type : 'UPDATECOMPLETEALL',
    isCompleteAll
  }
}
export function updateCurrentObject(currentObject){
  return {
    type : 'UPDATECURRENTOBJECT',
    currentObject
  }
}

const Assign = (state,obj)=>{
  return Object.assign({},state,obj);
}
const initialState = {
  startCity : null,//cityVo
  startTime : null,//moment
  endTime : null, //moment
  planList : [],//行程列表
  currentDayIndex : 0,//当前选中的是哪一天
  isCompleteAll : false,
  currentObject : '',
  openTime : false
}

const leftSide = (state=initialState,action)=>{
  switch (action.type) {
    case 'UPDATESTARTCITY':
      return Assign(state,{
        startCity : action.startCity
      })
    case 'UPDATETIME':
      return Assign(state,{
        startTime : action.startTime,
        endTime : action.endTime
      });
      case 'UP_LE_OP_TM':
        return Assign(state,{
          openTime : action.openTime
        })
    case 'INITALDEFAULTPLAN':
        return Assign(state,{
          planList : action.planList
        });
    case 'UPDATECURRENTDAYINDEX':
      return Assign(state,{
        currentDayIndex : action.currentDayIndex,
        currentObject : action.currentObject
      });
    case 'UPDATEPLANLISTBYINDEXANDINDEX':
      return Assign(state,{
        planList : action.planList,
        currentDayIndex : action.currentDayIndex
      });
    case 'UPDATECOMPLETEALL' :
      return Assign(state,{
        isCompleteAll : action.isCompleteAll
      });
      case 'UPDATECURRENTOBJECT' :
        return Assign(state,{
          currentObject : action.currentObject
        })
    default:
      return state;
  }
}
export default leftSide

const Assign = (state,obj)=>{
  return Object.assign({},state,obj);
}
const initialState = {
  test : 0
}

const middleSide = (state=initialState,action)=>{
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
    case 'INITALDEFAULTPLAN':
        return Assign(state,{
          planList : action.planList
        });
    default:
      return state;
  }
}
export default middleSide

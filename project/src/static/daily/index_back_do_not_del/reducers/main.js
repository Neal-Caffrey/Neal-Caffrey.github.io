const Assign = (state,obj)=>{
  return Object.assign({},state,obj);
}
// handle pickup and dropoff
const initialState = {
  loading : false,
  currentMap : null,
  isShowMap : false,
  splitPlanList : null,
  queryParam : null,
  carList : []
}

const middleSide = (state=initialState,action)=>{
  switch (action.type) {
    case 'UPDATELOADING':
      return Assign(state,{
        loading : action.loading
      });
    case 'UPDATECURRENTMAP':
      return Assign(state,{
        currentMap : action.currentMap
      })
    case 'UPDATESHOWMAP':
      return Assign(state,{
        isShowMap : action.isShowMap
      });
    case 'UP_MA_SPLI_A_QUER' : {
      return Assign(state,{
        splitPlanList : action.splitPlanList,
        queryParam : action.queryParam,
        carList : action.carList
      })
    }
    default:
      return state;
  }
}
export default middleSide

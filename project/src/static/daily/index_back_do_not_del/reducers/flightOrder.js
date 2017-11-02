const Assign = (state,obj)=>{
  return Object.assign({},state,obj);
}
// handle pickup and dropoff
const initialState = {
  isDaily : true
}

const middleSide = (state=initialState,action)=>{
  switch (action.type) {
    case 'UP_FL_FROM':
      return Assign(state,{
        isDaily : action.isDaily
      });
    default:
      return state;
  }
}
export default middleSide

const Assign = (state, obj) => {
  return Object.assign({}, state, obj);
}
const initialState = {

}

const leftSide = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATESTARTCITY':
      return Assign(state, {
        startCity: action.startCity
      })

    default:
      return state;
  }
}
export default leftSide
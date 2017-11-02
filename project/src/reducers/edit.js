const Assign = (state, obj) => {
  return Object.assign({}, state, obj);
}
const initialState = {
  info: {},
}

const listReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'edit/INFO':
      return Assign(state, {
        info: action.info
      });

    default:
      return state;
  }
}
export default listReducer;
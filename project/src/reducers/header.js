const Assign = (state, obj) => {
  return Object.assign({}, state, obj);
}
const initialState = {
  header: {},
  reLoad: false //让header重新渲染，刷新消息显示
}

const listReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'header/APPINFO':
      return Assign(state, {
        info: action.header
      });
    case 'RELOAD':
        return Assign(state,{
            reLoad: action.flag
        })
    default:
      return state;
  }
}
export default listReducer;

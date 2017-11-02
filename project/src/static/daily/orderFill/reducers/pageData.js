const Assign = (state,obj)=>{
  return Object.assign({},state,obj);
}
const initialState = {
  pageData: {},
  formatPlanVo: [],
  totalPrice : '0',
  isFlightSign : false
}

const PageData = (state=initialState,action)=>{
  switch (action.type) {
    case 'GETPAGEDATA':
      return Assign(state, {
        pageData: action.data
      })

    case 'FORMATPLANVO':
      return Assign(state, {
        formatPlanVo: action.data
      })
    case 'UPTOTAL':
      return Assign(state, {
        totalPrice: action.totalPrice
      })
    case 'checkFlightSign':
      return Assign(state,{
        isFlightSign : action.flag
      })
    default:
      return state;
  }
}
export default PageData

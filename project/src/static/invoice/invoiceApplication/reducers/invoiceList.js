const Assign = (state,obj)=>{
    return Object.assign({},state,obj);
}
const initialState = {}

const invoiceList = (state=initialState,action)=>{
    switch(action.type){
        case 'CHANGESELECTINFO' :
            return Assign(state,{
                selectedInfo : action.data
            });
        default:
            return state;
    }
}
export default invoiceList
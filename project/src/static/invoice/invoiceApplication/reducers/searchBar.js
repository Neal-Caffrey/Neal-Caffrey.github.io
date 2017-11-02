const Assign = (state,obj)=>{
    return Object.assign({},state,obj);
}
const initialState = {
    selectType : 1  //默认显示选中的订单类型是用车订单
}

const searchBar = (state=initialState,action)=>{
    switch(action.type){
        case 'CHANGESELECTTYPE' :
            return Assign(state,{
                selectType : action.selectType
            });
        case 'CHANGESTARTTIME' :
            return Assign(state,{
                startTime : action.startTime
            });
        case 'CHANGEENDTIME' :
            return Assign(state,{
                endTime : action.endTime
            });
        case 'CHANGEORDERNO' :
            return Assign(state,{
                orderNo : action.orderNo
            });
        default:
            return state;
    }
}
export default searchBar
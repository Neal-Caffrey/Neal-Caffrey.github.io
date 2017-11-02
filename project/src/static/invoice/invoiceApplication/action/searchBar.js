export function changeSelectType(selectType){
    return {
        type : 'CHANGESELECTTYPE',
        selectType : selectType
    }
}
export function changeStartTime(startTime){
    return {
        type : 'CHANGESTARTTIME',
        startTime : startTime
    }
}
export function changeEndTime(endTime){
    return {
        type : 'CHANGEENDTIME',
        endTime : endTime
    }
}
export function changeOrderNo(orderNo){
    return {
        type : 'CHANGEORDERNO',
        orderNo : orderNo
    }
}
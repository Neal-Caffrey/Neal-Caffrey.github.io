export function updateResult(data){
    return {
        type : 'UPDATERESULT',
        data : data
    }
}

export function updateSearchData(data){
    return {
        type : 'UPDATESEARCHDATA',
        data : data
    }
}
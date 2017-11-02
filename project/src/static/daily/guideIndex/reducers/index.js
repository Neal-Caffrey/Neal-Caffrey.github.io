const Assign = (state,obj)=>{
  return Object.assign({},state,obj);
}

const initialState = {
    ablumInfo: {
        isShowAblum: false,
        ablumImages: [],
        ablumIndex: 0
    }
}

const ablumInfo = (state=initialState,action) => {
    switch (action.type) {
        case 'SHOWABLUM':
            return Assign(state, {
                ablumInfo: action.ablumInfo
            })

        default:
            return state;
    }
}
export default ablumInfo

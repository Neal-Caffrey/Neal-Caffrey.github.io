const Assign = (state,obj)=>{
  return Object.assign({},state,obj);
}

const initialState = {
    isAlert: false,
    showPassword: {
        show: false,
        loginName: '',
        agentUserId: ''
    },
    showAdd: {
        show: false,
        model: 1,
        info: {}
    }
}

const alert = (state=initialState,action) => {
    switch (action.type) {
        case 'SHOWALERT':
            return Assign(state, {
                isAlert: true,
                alertMsg: {
                    msg: action.msg,
                    goLogin: action.goLogin
                }
            })
        case 'REMOVEALERT':
            return Assign(state, {
                isAlert: false
            })
        case 'SHOWPASSWORD':
            return Assign(state,{
                showPassword: action.val
            })
        case 'SHOWADD':
            return Assign(state,{
                showAdd: action.val
            })
        default:
            return state;
    }
}
export default alert

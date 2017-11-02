const Assign = (state,obj)=>{
  return Object.assign({},state,obj);
}
const initialState = {
  loading : true,
  planVo: [],
  isLoading: false,
  renderBookPop: {
    isShow: false,
    isEdit: false, //是否是编辑
    id: '', //第几天
    index: '' //第几个协助项
  },
  demandInfo: {
    csRemark: '',//给司导捎句话
    guideTags: [],//司导标签
    uploadFilePath: '',//行程PDF
  },
  // formData: {
  //   priceTicket: '',//票面价
  //   thirdTradeNo: '',//三方订单号
  //   realUserEx: [],//客人信息
  //   userEx: [],//联系人信息
  //   childNum: '',
  //   childSeatNum: '',
  //   adultNum: '',
  //   userName: '',
  //   userRemark: '',
  //   userWechat: '',
  //   userMobile: '',
  //   areaCode: 86,
  //   realUserName: '',
  //   realUserWechat: '',
  //   realUserMobile: '',
  //   realAreaCode: 86,
  //   areacode_1: 86,
  //   areacode_2: 86,
  //   usermobile_1: '',
  //   usermobile_2: '',
  // }
}

const leftSide = (state=initialState,action)=>{
  switch (action.type) {
    case 'UPDATELOADING':
      return Assign(state,{
        loading : action.loading
      });
    case 'CHANGEPLANVO':
      return Assign(state,{
        planVo: action.planVo
      })

    case 'SHOWLOADING':
      return Assign(state, {
        isLoading: action.flag
      })

    case 'SHOWBOOKPOP':
      return Assign(state, {
        renderBookPop: action.obj
      })

    case 'CHANGEDEMAND':
      return Assign(state, {
        demandInfo: action.obj
      })
      case 'SHOWALERT' : {
        return Assign(state, {
          isAlert: true,
          isLoading: false,
          alertMsg: {
            msg: action.msg,
            goLogin: action.goLogin
          }
        })
      }
      case 'REMOVEALERT':
        return Assign(state, {
          isAlert: false
        })
    default:
      return state;
  }
}
export default leftSide

const Assign = (state,obj)=>{
  return Object.assign({},state,obj);
}
// handle dailyOrder
const initialState = {
  dropoffInfo : '',
  inputValue : '',
  isShowPickup : false,
  isShowDropoff : false,
  pickupInfo : '',
  dailyPickupVo : null,
  dailyDropoffVo : null,
  dailyVo : {
    pickupVo : null,
    dropoffVo : null,
    startCity : {},

  },
  pickUpModelKey : 0,
  isModifyCity : false
}

const daily = (state=initialState,action)=>{
  switch (action.type) {
    case 'UP_DA_SHOWPICKUP':
      return Assign(state,{
        isShowPickup : action.isShowPickup
      });
    case 'UP_DA_SHOWDROPOFF':
      return Assign(state,{
        isShowDropoff : action.isShowDropoff
      });
    case 'UP_DA_PICKUPINFO':
      return Assign(state,{
        pickupInfo : action.pickupInfo
      });
    case 'UP_DA_PICKUPVO':
      return Assign(state,{
        dailyPickupVo : action.dailyPickupVo
      });
      case 'UP_DA_DROPOFFVO':
        return Assign(state,{
          dailyDropoffVo : action.dailyDropoffVo
        });
    case 'UP_DA_INPUTVAL':
      return Assign(state,{
        inputValue : action.inputValue
      });
    case 'RES_DA_DEFAULT' :
      return Assign(state,{
        dropoffInfo : action.dropoffInfo,
        inputValue : action.inputValue,
        isShowPickup : action.isShowPickup,
        pickupInfo : action.pickupInfo,
        dailyPickupVo : action.dailyPickupVo,
        dailyVo : action.dailyVo
      });
    case 'UP_DA_DAILYVO' :
      return Assign(state,{
        dailyVo : action.dailyVo
      });
    case 'RES_DA_PICKANDDROPOFF' :
      return Assign(state,{
        dropoffInfo : '',
        inputValue : '',
        isShowPickup : false,
        pickupInfo : '',
        dailyPickupVo : null,
        pickUpModelKey : 0
      })
    case 'UP_DA_PIMODEL' :
      return Assign(state,{
        key : state.pickUpModelKey++
      })
      case 'UP_DA_MODI' :
        return Assign(state,{
          isModifyCity : state.isModifyCity
        })
    default:
    return state;
  }
}
export default daily

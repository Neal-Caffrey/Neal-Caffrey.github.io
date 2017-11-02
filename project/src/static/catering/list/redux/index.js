const Assign = (state, obj) => {
  return Object.assign({}, state, obj);
}
const initialState = {
  cityId: 217,
  offset: 0,
  searchKey: '',
  tagNos: '',
  confirmImmediately: 0,
  canBookToday: 0,
  canDatas: false,
  sortType: 1,
  current: 1,
  loading: false,
  tradeingAreaNo: '',
  subCategoryNo: '',
  refreshTrem: false,
}

const listReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'list/UPDATECITYID':
      return Assign(state, {
        cityId: action.cityId
      });
    case 'list/UPDATEKEYWORDS':
      return Assign(state, {
        searchKey: action.searchKey
      });
    case 'list/UPDATEDATAS':
      return Assign(state, {
        canDatas: action.canDatas
      });
    case 'list/UPDATEOFFSET':
      return Assign(state, {
        offset: action.offset
      });
    case 'list/UPDATESORTTYPE':
      return Assign(state, {
        sortType: action.sortType
      });
    case 'list/UPDATECURRENT':
      return Assign(state, {
        current: action.current
      });
    case 'list/UPDATETRADE':
      return Assign(state, {
        tradeingAreaNo: action.tradeingAreaNo
      });
    case 'list/UPDATESUBCATE':
      return Assign(state, {
        subCategoryNo: action.subCategoryNo
      })
    case 'list/UPDATEREFRESHTREM':
      return Assign(state, {
        refreshTrem: action.refreshTrem
      })
    case 'list/UPDATETAGNOS':
      return Assign(state, {
        tagNos: action.tagNos
      })
    case 'list/UPDATELOADING':
      return Assign(state, {
        loading: action.loading
      });
    case 'list/UPDATECONFIRM':
      return Assign(state, {
        confirmImmediately: action.confirmImmediately
      });
    case 'list/UPDATETODAY':
      return Assign(state, {
        canBookToday: action.canBookToday
      });
    case 'list/UPDATEAUTO':
      return Assign(state, {
        tagNos: '',
        offset: 0,
        sortType: 1,
        current: 1,
        tradeingAreaNo: '',
        subCategoryNo: '',
        confirmImmediately: 0,
        canBookToday: 0,
      })
    default:
      return state;
  }
}
export default listReducer;
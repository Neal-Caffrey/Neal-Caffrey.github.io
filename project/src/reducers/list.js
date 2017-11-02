const Assign = (state, obj) => {
  return Object.assign({}, state, obj);
}
const initialState = {
  city: {},
  date: [],
  keyword: {},
  nav: {},
  term: [],
  page: {},
  current: 1,
  data: {
    listData: [],
    listCount: 0
  },
}

const listReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'list/UPDATECITY':
      return Assign(state, {
        city: action.city
      });
    case 'list/UPDATEDATE':
      return Assign(state, {
        date: action.date,
      });
    case 'list/UPDATEKEYWORD':
      return Assign(state, {
        keyword: action.keyword,
      });
    case 'list/UPDATENAV':
      return Assign(state, {
        nav: action.nav,
      })
    case 'list/UPDATECURRENT':
      return Assign(state, {
        current: action.current,
      });
    case 'list/UPDATETERM':
      return Assign(state, {
        term: action.term
      });
    case 'list/UPDATEPAGE':
      return Assign(state, {
        page: action.page,
      });
    case 'list/UPDATEDATA':
      return Assign(state, {
        data: action.data,
      });
    default:
      return state;
  }
}
export default listReducer;
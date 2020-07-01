import { SET_FAVORITE } from '../types';

function reducer(state, action) {
  switch (action.type) {
    case SET_FAVORITE:
      return {
        ...state,
        myList: [...state.myList, action.payload],
      };
    default:
      return state;
  }
}

export default reducer;

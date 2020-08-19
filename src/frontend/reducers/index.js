/* eslint-disable no-underscore-dangle */
import {
  ADD_FAVORITE,
  DELETE_FAVORITE,
  LOGIN,
  LOGOUT,
  REGISTER,
  GET_VIDEO_SOURCE,
} from '../types';

function reducer(state, action) {
  switch (action.type) {
    case ADD_FAVORITE:
      return {
        ...state,
        myList: [...state.myList, action.payload],
      };
    case DELETE_FAVORITE:
      return {
        ...state,
        myList: state.myList.filter((item) => item._id !== action.payload),
      };
    case LOGIN:
      return {
        ...state,
        user: action.payload,
      };
    case LOGOUT:
      return {
        ...state,
        user: action.payload,
      };
    case REGISTER:
      return {
        ...state,
        user: action.payload,
      };
    case GET_VIDEO_SOURCE:
      return {
        ...state,
        playing: state.trends.find((item) => item.id === Number(action.payload))
        || state.originals.find((item) => item.id === Number(action.payload))
        || [],
      };
    default:
      return state;
  }
}

export default reducer;

/* eslint-disable no-underscore-dangle */
import axios from 'axios';

import {
  ADD_FAVORITE,
  DELETE_FAVORITE,
  LOGIN,
  LOGOUT,
  REGISTER,
  GET_VIDEO_SOURCE,
} from '../types';

export const addFavorite = (payload) => ({
  type: ADD_FAVORITE,
  payload,
});

export const deleteFavorite = (payload) => ({
  type: DELETE_FAVORITE,
  payload,
});

export const login = (payload) => ({
  type: LOGIN,
  payload,
});

export const logout = (payload) => ({
  type: LOGOUT,
  payload,
});

export const register = (payload) => ({
  type: REGISTER,
  payload,
});

export const getVideoSource = (payload) => ({
  type: GET_VIDEO_SOURCE,
  payload,
});

export const loginUserRequest = ({ email, password }, redirectUrl) => async (dispatch) => {
  try {
    const { data } = await axios({
      url: '/auth/sign-in',
      method: 'post',
      auth: {
        username: email,
        password,
      },
    });

    document.cookie = `email=${data.user.email}`;
    document.cookie = `name=${data.user.name}`;
    document.cookie = `id=${data.user.id}`;
    dispatch(login(data.user));
    window.location.href = redirectUrl;
  } catch (error) {
    console.log(error);
  }
};

export const registerUserRequest = (payload, redirectUrl) => async (dispatch) => {
  try {
    const { data } = await axios.post('/auth/sign-up', payload);
    dispatch(register(data));
    window.location.href = redirectUrl;
  } catch (error) {
    console.log(error);
  }
};

export const addFavoriteRequest = (payload) => async (dispatch) => {
  try {
    const { data: userMovie } = await axios.post('/user-movies', payload);
    const { data: _id } = userMovie;
    dispatch(addFavorite({ ...payload, _id }));
  } catch (error) {
    console.log(error);
  }
};

export const deleteFavoriteRequest = (payload) => async (dispatch) => {
  try {
    const { data } = await axios.delete(`/user-movies/${payload}`);
    dispatch(deleteFavorite(data));
  } catch (error) {
    console.log(error);
  }
};

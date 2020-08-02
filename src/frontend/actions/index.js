import axios from 'axios';

import {
  SET_FAVORITE,
  DELETE_FAVORITE,
  LOGIN_REQUEST,
  LOGOUT_REQUEST,
  REGISTER_REQUEST,
  GET_VIDEO_SOURCE,
} from '../types';

export const setFavorite = (payload) => ({
  type: SET_FAVORITE,
  payload,
});

export const deleteFavorite = (payload) => ({
  type: DELETE_FAVORITE,
  payload,
});

export const loginRequest = (payload) => ({
  type: LOGIN_REQUEST,
  payload,
});

export const logoutRequest = (payload) => ({
  type: LOGOUT_REQUEST,
  payload,
});

export const registerRequest = (payload) => ({
  type: REGISTER_REQUEST,
  payload,
});

export const getVideoSource = (payload) => ({
  type: GET_VIDEO_SOURCE,
  payload,
});

export const loginUser = ({ email, password }, redirectUrl) => (dispatch) => {
  axios({
    url: '/auth/sign-in',
    method: 'post',
    auth: {
      username: email,
      password,
    },
  })
    .then(({ data }) => {
      document.cookie = `email=${data.user.email}`;
      document.cookie = `name=${data.user.name}`;
      document.cookie = `id=${data.user.id}`;
      dispatch(loginRequest(data.user));
    })
    .then(() => {
      window.location.href = redirectUrl;
    });
};

export const registerUser = (payload, redirectUrl) => (dispatch) => {
  axios.post('/auth/sign-up', payload)
    .then(({ data }) => dispatch(registerRequest(data)))
    .then(() => { window.location.href = redirectUrl; });
};
